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
  return json({ week: week, votes: read(week) });
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
    return json({ week: week, votes: read(week) });
  }

  /* Two people voting at the same moment would otherwise both read the same
     number and both write one more than it, losing a vote. */
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var votes = read(week);
    votes[game] = (votes[game] || 0) + 1;
    write(week, votes);
    return json({ week: week, votes: votes });
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

function read(week) {
  var raw = PropertiesService.getScriptProperties().getProperty('votes-' + week);
  return raw ? JSON.parse(raw) : {};
}

function write(week, votes) {
  PropertiesService.getScriptProperties()
    .setProperty('votes-' + week, JSON.stringify(votes));
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
