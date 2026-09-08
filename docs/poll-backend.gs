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

function doGet() {
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
