/* Game of the week poll — Google Apps Script backend.
 *
 * This is the whole server. Paste it into script.google.com, deploy it as a
 * web app, and put the URL it gives you into POLL_ENDPOINT in
 * assets/js/site.js. Setup steps are in docs/poll-setup.md.
 *
 * Votes live in the script's own properties store, so there is no spreadsheet
 * to create and nothing to tidy up. One entry per week, holding a small
 * object like {"flight-sim": 12, "god-sim": 5}.
 */

/* Only these count. Anything else is thrown away, so a stranger poking at the
   URL cannot invent a game or push the numbers somewhere silly. */
var GAMES = [
  'flight-sim',
  'god-sim',
  'turret-showdown',
  'sheep-and-tree-world'
];

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.board) return json(topOf(p.board));
  if (p.today) return json({ day: today(), challenge: challengeOfDay(today()) });
  var week = isoWeek(new Date());
  var state = read(week);
  return json({ week: week, stamp: state.stamp, votes: state.votes });
}

function doPost(e) {
  var body = {};
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    /* Not JSON. Fall through and let the game check below reject it. */
  }

  if (body.action === 'score') return submitScore(body);

  /* The week is worked out here, never taken from the browser. Otherwise
     anyone could post votes into next month. */
  var week = isoWeek(new Date());
  var game = String(body.game || '');

  if (GAMES.indexOf(game) === -1) {
    var known = read(week);
    return json({ week: week, stamp: known.stamp, votes: known.votes });
  }

  /* Two people voting at the same moment would otherwise both read the same
     number and both write one more than it, losing a vote. */
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var state = read(week);
    state.votes[game] = (state.votes[game] || 0) + 1;
    write(week, state);
    return json({ week: week, stamp: state.stamp, votes: state.votes });
  } finally {
    lock.releaseLock();
  }
}

/* ISO week, matching the site's own isoWeek(): weeks start on Monday, and the
   week belongs to whichever year its Thursday falls in. */
function isoWeek(d) {
  var t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  var jan1 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  var week = Math.ceil(((t - jan1) / 86400000 + 1) / 7);
  return t.getUTCFullYear() + '-W' + (week < 10 ? '0' + week : week);
}

/* Returns { stamp, votes }.
 *
 * The stamp names this round of voting. Browsers remember which round they
 * voted in, so a new stamp is what lets everybody vote again: clearing the
 * votes deletes this whole entry, and the next read below builds a fresh one
 * with a new stamp. Without it, wiping the counts would leave every previous
 * voter locked out of a poll that looks open.
 */
function read(week) {
  var raw = PropertiesService.getScriptProperties().getProperty('votes-' + week);
  var state = null;
  if (raw) {
    try {
      state = JSON.parse(raw);
    } catch (err) {
      state = null;   // hand-edited into something invalid; start over
    }
  }

  if (state && state.votes) return state;
  // An entry written before stamps existed is a bare set of counts.
  state = { stamp: null, votes: (state || {}) };

  state.stamp = Date.now().toString(36);
  write(week, state);
  return state;
}

function write(week, state) {
  PropertiesService.getScriptProperties()
    .setProperty('votes-' + week, JSON.stringify(state));
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Wipe this week's votes back to zero.
 *
 * Only you can run this: pick "resetThisWeek" from the function dropdown at
 * the top of the Apps Script editor and press Run. It is not reachable from
 * the web app URL, so nobody visiting the site can call it.
 */
function resetThisWeek() {
  var week = isoWeek(new Date());
  PropertiesService.getScriptProperties().deleteProperty('votes-' + week);
  // Reading it back builds a fresh round, so anyone who already voted this
  // week is free to vote again.
  Logger.log('Cleared ' + week + ', new round ' + read(week).stamp);
}

/* ---------------------------------------------------------------- leaderboards
 *
 * Each player's browser holds a random code it never shows anyone. An entry is
 * filed under that code, so writing a different name renames the entry the
 * player already has rather than creating a second one.
 *
 * Codes are never sent back out. The board that reaches the page is names and
 * numbers only, so one player cannot learn another's code and post as them.
 */

var BOARDS = {
  // Free play: lowest altitude you died at, in feet. Lower wins. The floor is
  // the deepest trench in the world, about -179 ft, so anything past the bound
  // below did not come from playing the game.
  'low-crash':  { lower: true,  min: -220, max: 200000 },

  // Daily challenges. Each keeps an all-time board and a board for today.
  'chal-low':   { lower: true,  min: -220, max: 200000 },   // lowest death, ft
  'chal-high':  { lower: false, min: -220, max: 200000 },   // highest death, ft
  'chal-glide': { lower: false, min: 0,    max: 36000 }     // seconds aloft
};
var BOARD_KEEP = 50;      // a script property holds 9 kB; 50 entries is well under
var DAY_BOARDS_KEPT = 8;  // yesterday is worth a look; last month is clutter

function submitScore(body) {
  var spec = BOARDS[body.board];
  if (!spec) return json({ error: 'unknown board' });

  var code = String(body.code || '');
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(code)) return json({ error: 'bad code' });

  // A post with no score is a rename, or simply a page asking for the board
  // with its own row marked. Neither should invent an entry.
  var hasValue = body.value !== undefined && body.value !== null && body.value !== '';
  var value = 0;
  if (hasValue) {
    value = Number(body.value);
    if (!isFinite(value)) return json({ error: 'bad score' });
    value = Math.round(value);
    if (value < spec.min || value > spec.max) return json({ error: 'bad score' });
  }

  var name = cleanName(body.name);

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    // A score counts twice: once against everyone who has ever flown this
    // course, and once against everyone who has flown it today.
    fileOn(body.board, null, code, name, hasValue, value, spec);
    if (isChallenge(body.board)) {
      fileOn(body.board, today(), code, name, hasValue, value, spec);
      pruneDayBoards();
    }
    return json(topOf(body.board, code));
  } finally {
    lock.releaseLock();
  }
}

/* Names are shown to other people, so rather than trying to spot bad input
 * this keeps only characters a name plausibly needs. Nothing that could be
 * read as markup survives. The page also renders names as text rather than
 * HTML, so it would take two mistakes to matter. */
function cleanName(raw) {
  var n = String(raw == null ? '' : raw)
    .replace(/[^A-Za-z0-9 '._-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 16);
  return n || 'Unknown';
}

function readBoard(board, day) {
  var raw = PropertiesService.getScriptProperties().getProperty(keyFor(board, day));
  if (!raw) return {};
  try {
    return JSON.parse(raw) || {};
  } catch (err) {
    return {};                   // hand-edited into nonsense; start over
  }
}

function writeBoard(board, all, day) {
  var spec = BOARDS[board];
  var codes = Object.keys(all);

  // Keep only the best BOARD_KEEP entries, so the stored value cannot grow
  // past the size a script property is allowed to be.
  if (codes.length > BOARD_KEEP) {
    codes.sort(function (a, b) {
      return spec.lower ? all[a].v - all[b].v : all[b].v - all[a].v;
    });
    var trimmed = {};
    codes.slice(0, BOARD_KEEP).forEach(function (c) { trimmed[c] = all[c]; });
    all = trimmed;
  }
  PropertiesService.getScriptProperties()
    .setProperty(keyFor(board, day), JSON.stringify(all));
}

function isChallenge(board) { return board.indexOf('chal-') === 0; }

/* A day's table lives under the same name with the date appended, so today's
 * board and the all-time board are the same code on two different keys. */
function keyFor(board, day) { return 'board-' + board + (day ? '@' + day : ''); }

function today() {
  return Utilities.formatDate(new Date(), 'UTC', 'yyyy-MM-dd');
}

function fileOn(board, day, code, name, hasValue, value, spec) {
  var all = readBoard(board, day);
  var mine = all[code];
  if (!mine) {
    if (!hasValue) return;                    // nothing worth filing yet
    all[code] = { n: name, v: value };
  } else {
    mine.n = name;                            // a rename always sticks
    if (hasValue && (spec.lower ? value < mine.v : value > mine.v)) mine.v = value;
  }
  writeBoard(board, all, day);
}

/* Yesterday's table is never read again, and script properties are finite. */
function pruneDayBoards() {
  var props = PropertiesService.getScriptProperties();
  var keep = {}, d = new Date();
  for (var i = 0; i < DAY_BOARDS_KEPT; i++) {
    keep[Utilities.formatDate(d, 'UTC', 'yyyy-MM-dd')] = true;
    d = new Date(d.getTime() - 86400000);
  }
  var all = props.getProperties();
  Object.keys(all).forEach(function (k) {
    var at = k.indexOf('@');
    if (k.indexOf('board-') === 0 && at > 0 && !keep[k.slice(at + 1)]) {
      props.deleteProperty(k);
    }
  });
}

/* Which challenge today is. Saturday borrows one of the others, picked from
 * the date so everybody gets the same one. */
var CHALLENGE_BY_DAY = ['glide', 'target', 'low', 'high', 'land', 'course'];

function challengeOfDay(day) {
  var p = day.split('-');
  var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]));
  var dow = d.getUTCDay();                    // 0 Sunday .. 6 Saturday
  if (dow < 6) return CHALLENGE_BY_DAY[dow];
  var n = Math.floor(d.getTime() / 86400000);
  return CHALLENGE_BY_DAY[((n % 6) + 6) % 6];
}

/* The public view: names and scores, never codes. `you` is the caller's own
 * code, used only to mark their row and report their rank. A challenge board
 * comes back with today's table alongside the all-time one. */
function topOf(board, you) {
  var spec = BOARDS[board];
  if (!spec) return { error: 'unknown board' };
  var out = rankOn(board, null, you, spec);
  out.board = board;
  if (isChallenge(board)) {
    var d = rankOn(board, today(), you, spec);
    out.today = d.top;
    out.todayRank = d.rank;
    out.todayEntries = d.entries;
    out.day = today();
    out.challenge = challengeOfDay(today());
  }
  return out;
}

function rankOn(board, day, you, spec) {
  var all = readBoard(board, day);
  var rows = Object.keys(all).map(function (c) {
    return { name: all[c].n, value: all[c].v, mine: c === you };
  });
  rows.sort(function (a, b) {
    return spec.lower ? a.value - b.value : b.value - a.value;
  });
  var r = 0;
  for (var i = 0; i < rows.length; i++) if (rows[i].mine) { r = i + 1; break; }
  return { top: rows.slice(0, 10), rank: r, entries: rows.length };
}

function resetBoard(board) {
  PropertiesService.getScriptProperties().deleteProperty('board-' + (board || 'low-crash'));
  Logger.log('Cleared board ' + (board || 'low-crash'));
}
