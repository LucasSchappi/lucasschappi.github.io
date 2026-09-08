# Turning the poll on

The poll on the home page is finished, but it is hidden until it has somewhere
to keep the votes. A site made of plain files cannot count anything by itself:
every visitor gets their own copy of the page, so a number stored in one of
them is invisible to everyone else. Something has to hold the running total in
one place.

That "something" is about eighty lines of code, and Google will run it for
free. No AWS, no card, no help needed.

## What you are building

A Google Apps Script **web app**: a script with a public URL. Ask that URL for
this week's votes and it answers with them; post a vote to it and it adds one.
It stores the counts in the script's own settings store, so there is no
spreadsheet to make and nothing to clean up.

Weeks are numbered the ISO way (they start on Monday), and the week is decided
by the script, never by the visitor's browser — otherwise anyone with a wrong
clock, or a bit of curiosity, could push votes into a different week.

## Steps

1. Go to <https://script.google.com> and sign in.
   **Use a personal Google account, not the school one.** School accounts are
   managed, and administrators often block scripts from being shared outside
   the school — which would stop the site reaching it. If step 6 will not let
   you pick "Anyone", this is why.
2. Click **New project**.
3. Delete the few lines already in the editor, and paste in the whole of
   [`poll-backend.gs`](poll-backend.gs).
4. Give the project a name (top left) — "Schappi Studios poll" does.
5. Click **Deploy** → **New deployment**. Press the gear next to "Select type"
   and choose **Web app**.
6. Set:
   - **Execute as:** Me
   - **Who has access:** **Anyone**

   "Anyone" sounds alarming but only means anyone may call this one script,
   which does nothing but count votes. It gives away no access to your account.
7. Click **Deploy**. Google will ask you to authorise the script; it is your
   own code, so approve it. You may have to click "Advanced" and then
   "Go to <project name> (unsafe)" — Google says that about every script that
   has not been through its review process, including yours.
8. Copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfycb…long…/exec`.

## Plugging it in

Open `assets/js/site.js`, find this line near the bottom:

```js
  var POLL_ENDPOINT = "";
```

Put the URL between the quotes, then publish:

```sh
./bin-sync-site.sh
~/code/schappistudios-aws-deploy/bin/deploy
```

The poll appears on the home page by itself. Nothing else needs changing.

## Checking it works

Paste the URL straight into a browser tab. You should see:

```json
{"week":"2026-W37","votes":{}}
```

If you see that, it is working. If you get a sign-in page instead, "Who has
access" is not set to "Anyone" — go back to step 6.

## Clearing a week's votes

Pick **resetThisWeek** from the function dropdown at the top of the editor and
press **Run**. It is not reachable from the web app URL, so nobody visiting the
site can call it.

Clearing the votes also starts a new *round*. That matters: a browser
remembers that it has voted, and without a new round every previous voter
would stay locked out of a poll that looked open to them. The round number
comes back with the counts, the page keys its memory on it, and a new one
lets everybody vote again.

Deleting the `votes-<week>` row by hand in Project Settings works the same
way, because the entry is rebuilt with a fresh round the next time anyone
loads the page.

## Changing it later

Editing the script is not enough on its own: Apps Script keeps serving the
version you deployed. After any edit, use **Deploy** → **Manage deployments**
→ the pencil icon → **Version: New version** → **Deploy**. That keeps the same
URL, so the site needs no change.

To add a game to the poll, add its id to the `GAMES` list in the script *and*
to `POLL_GAMES` in `assets/js/site.js`. The two lists have to agree — the
script ignores votes for anything it does not recognise, which is what stops a
stranger inventing entries.

## What this does not do

Voting is limited by a note in your own browser's storage, so someone who
clears it, opens a private window, or uses their phone can vote again. That is
true of almost every poll that does not make people log in, and for a poll
about which of your games people like, it is not worth fixing. Do not treat
the numbers as exact.

If it ever does matter, the honest fix is counting one vote per signed-in
person, not tracking people by IP address. Recording visitors' addresses would
mean saying so on the privacy page first.
