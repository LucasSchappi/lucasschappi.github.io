# tools

Development tools. Not part of the website: `bin-sync-site.sh` excludes this
directory, so nothing here is ever published.

## record-page.mjs

Records an HTML page to a video, one frame at a time.

```sh
node tools/record-page.mjs "https://schappistudios.com/games/flight-sim/play/?trailer" \
  --out trailer.mp4 --seconds 48 --width 1920 --height 1080
```

It is not a screen recorder. A screen recorder captures whatever the browser
managed to draw in real time, so a stutter while recording is a stutter in the
file for ever. This replaces the page's clock, `requestAnimationFrame` and its
timers, then advances them by exactly one frame, renders, captures, and only
then advances again.

The page believes it is running at a perfect frame rate on an infinitely fast
machine. A frame that takes two seconds to draw still lasts a sixtieth of a
second in the finished video, so the result cannot stutter no matter what else
the computer is doing.

Needs Chrome and ffmpeg (`brew install ffmpeg`). No npm packages: it drives
Chrome over its own debugging protocol using the WebSocket built into Node 22
and later.

Run it with no arguments for the full list of options.

### What it does not do

**Sound.** The video is silent. Recording WebAudio would mean rendering the
audio graph separately and lining it up afterwards, which is a different job.
Add music or record the audio separately in an editor.

**Anything that needs a real clock.** A page that waits on the network, or
animates with CSS transitions rather than `requestAnimationFrame`, will not be
stepped by this and may come out frozen. It suits a page that draws itself in
a frame callback, which is what a game loop is.
