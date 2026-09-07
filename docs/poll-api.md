# Game of the week poll — what the site needs

The site is static, so it cannot count votes itself. The front end is written
and waiting; it needs one HTTP endpoint. Everything else is done.

To switch it on, set `POLL_ENDPOINT` at the top of the poll block in
`assets/js/site.js` to the URL below. Until then the section stays hidden, and
it also hides itself if the endpoint stops responding — a broken backend shows
nothing rather than an empty poll.

## The contract

Two calls on one URL.

**Read the week's tally**

    GET  <endpoint>?week=2026-W37

    200 { "week": "2026-W37", "votes": { "flight-sim": 12, "god-sim": 7 } }

**Add a vote**

    POST <endpoint>
         { "week": "2026-W37", "game": "flight-sim" }

    200 { "week": "2026-W37", "votes": { "flight-sim": 13, "god-sim": 7 } }

Games absent from `votes` are treated as zero, so an empty object is a valid
first response. Valid ids are `flight-sim`, `god-sim`, `turret-showdown` and
`sheep-and-tree-world`; anything else should be rejected with a 400 so a
stray request cannot invent a category.

The week is an ISO week string, which is what makes the poll reset on Monday.
The browser sends it, but the server should not trust it — see below.

## CORS

The page is served from `https://schappistudios.com`, so the endpoint needs:

    Access-Control-Allow-Origin: https://schappistudios.com
    Access-Control-Allow-Methods: GET, POST, OPTIONS
    Access-Control-Allow-Headers: Content-Type

A Lambda Function URL with CORS configured handles this without API Gateway.

## Suggested shape

One DynamoDB table, on-demand billing:

    table   schappistudios-poll
    PK      week   (S)     e.g. "2026-W37"
    SK      game   (S)     e.g. "flight-sim"
    attr    votes  (N)     an atomic counter

A query on `week` returns that week's rows; `ADD votes 1` is atomic, so
simultaneous votes cannot overwrite each other. Old weeks cost nothing to keep,
and are worth keeping — they are the history of which game won each week.

Node 20 Lambda, roughly:

```js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand }
  from "@aws-sdk/lib-dynamodb";

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = "schappistudios-poll";
const GAMES = ["flight-sim", "god-sim", "turret-showdown", "sheep-and-tree-world"];

// Derive the week here rather than trusting the browser, otherwise anyone can
// write into an arbitrary week and the reset means nothing.
function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const jan1 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const w = Math.ceil(((t - jan1) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(w).padStart(2, "0")}`;
}

async function tally(week) {
  const r = await db.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: "week = :w",
    ExpressionAttributeValues: { ":w": week },
  }));
  return Object.fromEntries((r.Items ?? []).map(i => [i.game, Number(i.votes)]));
}

export const handler = async (event) => {
  const week = isoWeek();
  const method = event.requestContext?.http?.method ?? "GET";
  const reply = (code, body) => ({
    statusCode: code,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  if (method === "POST") {
    const { game } = JSON.parse(event.body || "{}");
    if (!GAMES.includes(game)) return reply(400, { error: "unknown game" });
    await db.send(new UpdateCommand({
      TableName: TABLE,
      Key: { week, game },
      UpdateExpression: "ADD votes :one",
      ExpressionAttributeValues: { ":one": 1 },
    }));
  }
  return reply(200, { week, votes: await tally(week) });
};
```

The function needs `dynamodb:Query` and `dynamodb:UpdateItem` on that one
table, and nothing else.

## What this does not do

One vote per person is enforced in the browser with `localStorage`, which
anyone who wants to can get around. That is a deliberate trade: the
alternatives mean storing something identifying about every visitor, which is
not worth it for a poll about which game people liked. If it ever gets abused,
rate limiting by IP at the CloudFront or Lambda layer is the next step, and
should be mentioned in the privacy page before it is added.
