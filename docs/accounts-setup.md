# Accounts

The site is static files, so it has no server to check a password against.
Firebase does that part: people sign in in the browser, Google holds the
passwords, and we never see one. Firestore stores what accounts need to
remember. Both are free at the size this site will ever be.

Everything below is done once, in your own Google account, and takes about
fifteen minutes.

## What accounts will be used for

In this order, because each one needs the one before it:

1. **Signing in**, and picking a display name.
2. **The poll** — one vote per account instead of a note in the browser
   that a reset cannot clear.
3. **Saving your game** — flight sim settings and favourite seeds.
4. **A name next to things** — leaderboards, once a game has a score to rank.
5. **Chat** — last, and with moderation built in rather than added after.

## Making the project

1. Go to <https://console.firebase.google.com> and **Add project**. Call it
   `schappi-studios`. Turn Google Analytics **off** — it collects data about
   visitors that this site has no use for, and it would have to be declared
   on the privacy page.
2. In the project, click the **web** icon (`</>`) to add a web app. Nickname
   it `site`. **Do not** tick Firebase Hosting: the site already lives on
   CloudFront.
3. Copy the `firebaseConfig` block it shows you. That goes into
   `assets/js/auth.js`.
4. **Build → Authentication → Get started.** Enable **Google**, then enable
   **Email/Password** (leave "Email link" off).
5. **Build → Firestore Database → Create database.** Start in **production
   mode** — it denies everything until the rules below are in place, which is
   the right way round. Pick the region nearest you and leave it; it cannot be
   changed later.
6. **Authentication → Settings → Authorized domains**: add
   `schappistudios.com`. Sign-in is refused from any domain not on that list,
   which is what stops someone cloning the site and collecting sign-ins under
   your project.

## The config is not a secret

The `firebaseConfig` block contains an `apiKey`, and it belongs in the site's
JavaScript where anyone can read it. That is by design: it names the project,
it does not grant access to it. Every Firebase web app works this way.

What actually protects the data is the security rules below. They run on
Google's servers and cannot be bypassed by editing the page. Rules are the
only thing standing between your database and anyone who opens the console,
so they are worth reading rather than pasting blind.

## Security rules

**Firestore → Rules**, replace everything, **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() {
      return request.auth != null;
    }
    function isSelf(uid) {
      return signedIn() && request.auth.uid == uid;
    }

    // Profiles. Anyone may read a display name, because names appear next to
    // votes and scores. Only the owner may write one, and only these two
    // fields, so nobody can give themselves a field the rules do not expect.
    match /users/{uid} {
      allow read: if true;
      allow create, update: if isSelf(uid)
        && request.resource.data.keys().hasOnly(['displayName', 'updatedAt'])
        && request.resource.data.displayName is string
        && request.resource.data.displayName.size() >= 2
        && request.resource.data.displayName.size() <= 20;
      allow delete: if isSelf(uid);
    }

    // One ballot per person per week. The document is named after the voter,
    // so a second vote would have to overwrite the first, and update is not
    // allowed. That is what makes one-vote-per-account real rather than a
    // note in the voter's own browser.
    match /votes/{week}/ballots/{uid} {
      allow read: if true;
      allow create: if isSelf(uid)
        && request.resource.data.keys().hasOnly(['game', 'at'])
        && request.resource.data.game in
             ['flight-sim', 'god-sim', 'turret-showdown', 'sheep-and-tree-world'];
      allow update, delete: if false;
    }

    // Saved games are private to the person who saved them.
    match /users/{uid}/saves/{game} {
      allow read, write: if isSelf(uid);
    }

    // Anything not named above is refused. Chat and scores get their own
    // rules when they are built; until then they do not exist.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

The last block matters most. Firestore rules do not inherit, and anything
without a rule is denied, so a mistake fails shut rather than open.

## Checking the rules do what they claim

In the console, **Firestore → Rules → Rules Playground**. Worth trying:

| Simulate | Expect |
| --- | --- |
| `get` on `/users/anything`, signed out | **Allowed** — names are public |
| `create` on `/users/abc` as uid `abc`, data `{displayName: "Lucas"}` | **Allowed** |
| `create` on `/users/abc` as uid `xyz` | **Denied** — not your profile |
| `create` on `/users/abc` as `abc`, `{displayName: "L"}` | **Denied** — too short |
| `create` on `/votes/2026-W37/ballots/abc` as `abc`, `{game: "flight-sim"}` | **Allowed** |
| `update` on that same ballot | **Denied** — votes cannot be changed |
| `create` on `/chat/1` as anyone | **Denied** — not built yet |

If any of those come out the other way, stop and tell me rather than
publishing.

## Then

Paste the `firebaseConfig` block into the top of `assets/js/auth.js`, where
it says where to put it. Sign-in appears in the header on its own, exactly
like the poll did once it had a URL.

## What this means for the privacy page

Accounts mean holding personal data about other people, some of them
children. `privacy/index.html` is currently a stub with a placeholder where
the date should be. Before sign-in goes live it needs to say plainly: that
accounts are handled by Google Firebase, what is stored (an id, an email if
they used one, and a display name they chose), that saved games and votes are
tied to that id, and how someone deletes their account. That is not legal
boilerplate — it is the honest answer to "what happens to my data", and it is
short.
