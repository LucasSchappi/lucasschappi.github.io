#!/usr/bin/env node
/*
 * record-page.mjs - record an HTML page to a video file, frame by frame.
 *
 *   node tools/record-page.mjs <url> [options]
 *
 * This is not a screen recorder. A screen recorder captures whatever the
 * browser managed to draw in real time, so every hitch and dropped frame is
 * baked into the file. This instead lies to the page about time: it replaces
 * the clock, requestAnimationFrame and the timers, then advances them by
 * exactly one frame, renders, captures, and only then advances again.
 *
 * The page believes it is running at a perfect frame rate on an infinitely
 * fast machine. A frame that takes two seconds to draw still lasts 1/60th of a
 * second in the finished video. Nothing can stutter, because nothing is
 * racing a real clock.
 *
 * Needs Chrome and ffmpeg. No npm packages: it drives Chrome over its own
 * debugging protocol using the WebSocket built into Node 22 and later.
 */

import { spawn, spawnSync } from 'node:child_process';
import { mkdtemp, rm, readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';

const CHROME_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

function parseArgs(argv) {
  const o = {
    url: null, out: 'recording.mp4', seconds: 48, fps: 60,
    width: 1920, height: 1080, quality: 92, crf: 17, warmup: 0,
    scale: 1, frames: null, png: false, keep: false, verbose: false,
  };
  const nums = new Set(['seconds', 'fps', 'width', 'height', 'quality', 'crf',
                        'warmup', 'scale', 'frames']);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { o.url ??= a; continue; }
    const key = a.slice(2);
    if (key === 'png' || key === 'keep' || key === 'verbose') { o[key] = true; continue; }
    if (!(key in o)) fail(`unknown option --${key}`);
    const v = argv[++i];
    if (v === undefined) fail(`--${key} needs a value`);
    o[key] = nums.has(key) ? Number(v) : v;
    if (nums.has(key) && !Number.isFinite(o[key])) fail(`--${key} must be a number`);
  }
  if (!o.url) fail('no url given');
  if (!/^[a-z]+:/i.test(o.url)) o.url = 'file://' + join(process.cwd(), o.url);
  o.frames ??= Math.round(o.seconds * o.fps);
  return o;
}

function fail(msg) {
  console.error('record-page: ' + msg);
  console.error(`
usage: node tools/record-page.mjs <url> [options]

  --out FILE       where to write the video      (default recording.mp4)
  --seconds N      how long to record            (default 48)
  --frames N       exact frame count, overrides --seconds
  --fps N          frames per second             (default 60)
  --width N        pixels                        (default 1920)
  --height N       pixels                        (default 1080)
  --scale N        device pixel ratio, 2 for retina sharpness  (default 1)
  --warmup N       frames to run but not record  (default 0)
  --quality N      jpeg quality of each frame, 1-100  (default 92)
  --crf N          video quality, lower is better, 17-23 is sensible (default 17)
  --png            write a numbered png sequence instead of a video
  --keep           keep the temporary profile directory
  --verbose        print every frame

example:
  node tools/record-page.mjs \\
    "https://schappistudios.com/games/flight-sim/play/?trailer" \\
    --out trailer.mp4 --seconds 48
`);
  process.exit(1);
}

/* The script injected into the page before any of its own code runs. Every
   source of time is replaced with one that only moves when we say so. */
function clockScript(fps) {
  return `(() => {
  const STEP = 1000 / ${fps};
  let t = 0;
  const epoch = Date.now();

  const rafs = new Map(); let rafId = 1;
  let timers = []; let timerId = 1;

  performance.now = () => t;
  const RealDate = Date;
  const FakeDate = function (...a) {
    return a.length ? new RealDate(...a) : new RealDate(epoch + t);
  };
  FakeDate.prototype = RealDate.prototype;
  FakeDate.now = () => epoch + t;
  FakeDate.parse = RealDate.parse;
  FakeDate.UTC = RealDate.UTC;
  window.Date = FakeDate;

  window.requestAnimationFrame = cb => { const id = rafId++; rafs.set(id, cb); return id; };
  window.cancelAnimationFrame = id => { rafs.delete(id); };

  window.setTimeout = (fn, ms) => {
    const id = timerId++;
    timers.push({ id, at: t + (Number(ms) || 0), fn, every: 0 });
    return id;
  };
  window.setInterval = (fn, ms) => {
    const id = timerId++;
    const every = Math.max(1, Number(ms) || 1);
    timers.push({ id, at: t + every, fn, every });
    return id;
  };
  window.clearTimeout = window.clearInterval = id => {
    timers = timers.filter(x => x.id !== id);
  };

  window.__advance = () => {
    t += STEP;
    // Timers first, in the order they fall due. The cap stops a zero-delay
    // interval from spinning here for ever.
    for (let guard = 0; guard < 2000; guard++) {
      let next = null;
      for (const x of timers) if (x.at <= t && (!next || x.at < next.at)) next = x;
      if (!next) break;
      if (next.every) next.at = Math.max(t + 1, next.at + next.every);
      else timers = timers.filter(x => x !== next);
      try { next.fn(); } catch (e) { console.error(e); }
    }
    // Then the frame callbacks, exactly one round of them.
    const due = [...rafs.values()];
    rafs.clear();
    for (const cb of due) { try { cb(t); } catch (e) { console.error(e); } }
  };
  window.__clockReady = true;
})();`;
}

/* A very small Chrome DevTools Protocol client. */
class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = new Map();
    ws.addEventListener('message', ev => {
      const msg = JSON.parse(ev.data);
      if (msg.id !== undefined) {
        const p = this.pending.get(msg.id);
        if (!p) return;
        this.pending.delete(msg.id);
        msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result);
      } else {
        const hs = this.handlers.get(msg.method);
        if (hs) for (const h of hs) h(msg.params);
      }
    });
  }
  send(method, params = {}, sessionId) {
    const id = ++this.id;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  on(method, fn) {
    if (!this.handlers.has(method)) this.handlers.set(method, []);
    this.handlers.get(method).push(fn);
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const o = parseArgs(process.argv.slice(2));

  const chrome = CHROME_CANDIDATES.find(p => existsSync(p));
  if (!chrome) fail('no Chrome found; edit CHROME_CANDIDATES at the top of this file');
  if (!o.png && !hasFfmpeg()) fail('ffmpeg not found on PATH (brew install ffmpeg), or pass --png');

  const profile = await mkdtemp(join(tmpdir(), 'record-page-'));
  const args = [
    '--headless', '--hide-scrollbars', '--mute-audio',
    '--no-first-run', '--no-default-browser-check',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    `--user-data-dir=${profile}`,
    '--remote-debugging-port=0',
    `--window-size=${o.width},${o.height}`,
    'about:blank',
  ];
  const proc = spawn(chrome, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  proc.stderr.on('data', d => { if (o.verbose) process.stderr.write(d); });

  let cleanupDone = false;
  const cleanup = async () => {
    if (cleanupDone) return; cleanupDone = true;
    try { proc.kill(); } catch {}
    if (o.keep) return;
    // Chrome is often still writing to its profile as it goes down, and a
    // removal that lands mid-write fails with ENOTEMPTY and leaves the whole
    // directory behind. These are tens of megabytes each and they add up.
    for (let i = 0; i < 6; i++) {
      await sleep(250);
      try { await rm(profile, { recursive: true, force: true }); return; } catch {}
    }
    console.error('record-page: could not remove ' + profile);
  };
  process.on('SIGINT', async () => { await cleanup(); process.exit(130); });

  try {
    const port = await readPort(profile);
    const version = await fetchJson(`http://127.0.0.1:${port}/json/version`);
    const ws = new WebSocket(version.webSocketDebuggerUrl);
    await once(ws, 'open');
    const cdp = new CDP(ws);

    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    const S = sessionId;

    await cdp.send('Page.enable', {}, S);
    await cdp.send('Runtime.enable', {}, S);
    cdp.on('Runtime.consoleAPICalled', p => {
      if (o.verbose && p.type === 'error') console.error('  page:', p.args.map(a => a.value).join(' '));
    });
    cdp.on('Runtime.exceptionThrown', p =>
      console.error('  page error:', p.exceptionDetails?.exception?.description
        || p.exceptionDetails?.text));

    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: o.width, height: o.height, deviceScaleFactor: o.scale, mobile: false,
    }, S);

    await cdp.send('Page.addScriptToEvaluateOnNewDocument',
      { source: clockScript(o.fps) }, S);

    const loaded = new Promise(res => cdp.on('Page.loadEventFired', res));
    await cdp.send('Page.navigate', { url: o.url }, S);
    await loaded;
    await sleep(400);          // let deferred scripts and images settle

    const ready = await evaluate(cdp, S, 'window.__clockReady === true');
    if (!ready) fail('the fake clock did not install; is this a normal HTML page?');

    const sink = o.png ? await pngSink(o) : ffmpegSink(o);

    process.stderr.write(
      `recording ${o.frames} frames at ${o.fps} fps ` +
      `(${(o.frames / o.fps).toFixed(1)}s) ${o.width}x${o.height}` +
      (o.scale !== 1 ? ` @${o.scale}x` : '') + '\n');

    const started = Date.now();
    for (let i = 0; i < o.warmup; i++) await evaluate(cdp, S, 'window.__advance()');

    for (let f = 0; f < o.frames; f++) {
      await evaluate(cdp, S, 'window.__advance()');
      const shot = await cdp.send('Page.captureScreenshot',
        { format: 'jpeg', quality: o.quality, captureBeyondViewport: false }, S);
      await sink.write(Buffer.from(shot.data, 'base64'), f);
      if (o.verbose) process.stderr.write(`  frame ${f + 1}/${o.frames}\n`);
      else if (f % o.fps === 0 || f === o.frames - 1) {
        const pct = Math.round(((f + 1) / o.frames) * 100);
        process.stderr.write(`\r  ${pct}%  ${(f / o.fps).toFixed(1)}s of page time`);
      }
    }
    process.stderr.write('\n');
    await sink.end();

    const took = ((Date.now() - started) / 1000).toFixed(1);
    process.stderr.write(`done in ${took}s -> ${o.out}\n`);
  } finally {
    await cleanup();
  }
}

async function evaluate(cdp, S, expression) {
  const r = await cdp.send('Runtime.evaluate',
    { expression, awaitPromise: true, returnByValue: true }, S);
  if (r.exceptionDetails) {
    throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  }
  return r.result?.value;
}

function hasFfmpeg() {
  return spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status === 0;
}

function ffmpegSink(o) {
  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(o.fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(o.crf),
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    o.out,
  ], { stdio: ['pipe', 'ignore', 'inherit'] });

  const done = once(ff, 'close');
  return {
    async write(buf) {
      if (!ff.stdin.write(buf)) await once(ff.stdin, 'drain');
    },
    async end() {
      ff.stdin.end();
      const [code] = await done;
      if (code !== 0) throw new Error('ffmpeg exited with code ' + code);
    },
  };
}

async function pngSink(o) {
  const dir = o.out.replace(/\.[^.]+$/, '') + '-frames';
  await mkdir(dir, { recursive: true });
  return {
    async write(buf, i) {
      await writeFile(join(dir, String(i).padStart(6, '0') + '.jpg'), buf);
    },
    async end() { process.stderr.write(`frames written to ${dir}/\n`); },
  };
}

async function readPort(profile) {
  const file = join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 100; i++) {
    try {
      const txt = await readFile(file, 'utf8');
      const port = Number(txt.split('\n')[0]);
      if (port > 0) return port;
    } catch {}
    await sleep(100);
  }
  throw new Error('Chrome never opened a debugging port');
}

async function fetchJson(url) {
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(url); if (r.ok) return await r.json(); } catch {}
    await sleep(100);
  }
  throw new Error('could not reach Chrome at ' + url);
}

main().catch(err => { console.error('record-page:', err.message); process.exit(1); });
