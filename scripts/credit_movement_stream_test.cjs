"use strict";

// The console could read a credit total and watch it change, but it could never
// say what changed it. StreamCreditMovements publishes the ledger as it moves;
// these pin the wiring, because every way it can regress is silent.
//
// Four things are held here:
//
//   the transport is the ACTIVITY stream's, exactly — same backoff, same budget,
//     same in-stream `unauthenticated` healing, same cursor. The contract asks
//     for that in as many words: a second cursor idiom on one console is a
//     second way to lose a row.
//   motion only where something ARRIVED — the odometer rolls on a frame and on
//     nothing else, and the travelling hairline is set exactly where the
//     stream's own state is set.
//   reduced motion DISABLES rather than shortens.
//   the money rules hold — a provider cost is never presented as what the
//     customer paid, and an absent count never becomes a zero.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const main = readFileSync("assets/css/main.css", "utf8");
const generated = Function(`${readFileSync("assets/js/platform-api-client.js", "utf8")}\nreturn deepNavyGeneratedClient;`)();

function between(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.notEqual(start, -1, `marker missing: ${startMarker}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `marker missing after ${startMarker}: ${endMarker}`);
  return source.slice(start, end);
}

/* ---- the ceiling ------------------------------------------------------- */

test("the streaming ceiling is written down, and the two lists stay disjoint", () => {
  assert.ok(Array.isArray(generated.STREAM_PROCEDURES), "STREAM_PROCEDURES is exported");
  assert.deepEqual([...generated.STREAM_PROCEDURES], [
    "stream_team_activity",
    "stream_team_conversation",
    "stream_provisioning_status",
    "stream_credit_movements"
  ]);
  // A stream name in SUPPORTED_PROCEDURES would be a lie: request() has no case
  // for one and would answer not_configured, so a caller trusting the documented
  // ceiling would be told a procedure exists and then refused it.
  for (const name of generated.STREAM_PROCEDURES) {
    assert.ok(!generated.SUPPORTED_PROCEDURES.includes(name), `${name} must not appear in the unary ceiling`);
  }
  assert.equal(generated.PLATFORM_CAPABILITIES.creditMovementStream, true);
});

test("every declared stream resolves to a real generated function", () => {
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async () => { throw new Error("not called"); }
  });
  const named = {
    stream_team_activity: "streamTeamActivity",
    stream_team_conversation: "streamTeamConversation",
    stream_provisioning_status: "streamProvisioningStatus",
    stream_credit_movements: "streamCreditMovements"
  };
  for (const procedure of generated.STREAM_PROCEDURES) {
    assert.equal(typeof api[named[procedure]], "function", `${procedure} has no client function`);
  }
});

test("the generated stream is the contract's, and refuses an unauthenticated caller", async () => {
  let touchedNetwork = false;
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async () => { touchedNetwork = true; throw new Error("must not run"); }
  });
  await assert.rejects(
    (async () => { for await (const _ of api.streamCreditMovements({ teamId: "t" }, { accessToken: "  ", requestId: "r" })) break; })(),
    (error) => error.name === "PlatformClientError" && error.code === "unauthenticated" && error.status === 401
  );
  assert.equal(touchedNetwork, false, "a token-less stream must not open a connection");

  const source = between(client, "async function* streamCreditMovements(", "return Object.freeze({");
  assert.match(source, /economics\.streamCreditMovements/);
  // The resume cursor and the no-client-timeout are what make it the same shape
  // as the three streams beside it.
  assert.match(source, /afterSequence: int64Field\(payload\.afterSequence \?\? 0, "afterSequence"\)/);
  assert.match(source, /timeoutMs: 0/);
});

test("the browser bundle decodes a real credit movement frame", async () => {
  // The Connect server-streaming envelope: one flag byte, four length bytes,
  // then the JSON message; flag 2 is the end-of-stream trailer.
  const envelope = (flags, payload) => {
    const body = new TextEncoder().encode(JSON.stringify(payload));
    const frame = new Uint8Array(5 + body.length);
    frame[0] = flags;
    new DataView(frame.buffer).setUint32(1, body.length, false);
    frame.set(body, 5);
    return frame;
  };
  const frames = [
    envelope(0, { movement: {
      sequence: "41", organizationId: "org_1", teamId: "team_1",
      kind: "CREDIT_MOVEMENT_KIND_SETTLE", operationType: "model_call",
      unit: "tokens", quantity: "1200", deltaMicros: "-250000",
      teamBalanceAfterMicros: "9500000", organizationBalanceAfterMicros: "41750000",
      directCost: { currencyCode: "USD", units: "0", nanos: 160000000 },
      attribution: { agentRole: "engineer" }, occurredAt: "2026-08-23T18:00:00Z"
    } }),
    envelope(2, {})
  ];
  const total = frames.reduce((n, f) => n + f.length, 0);
  const body = new Uint8Array(total);
  let at = 0;
  for (const f of frames) { body.set(f, at); at += f.length; }

  let requestedUrl = "";
  const api = generated.createPlatformApi({
    baseUrl: "https://dev.api.deep.navy",
    fetch: async (input) => {
      requestedUrl = String(input);
      return new Response(body, { status: 200, headers: { "content-type": "application/connect+json" } });
    }
  });
  const seen = [];
  for await (const response of api.streamCreditMovements({ teamId: "team_1", afterSequence: 40 }, { accessToken: "tok", requestId: "req" })) {
    seen.push(response.movement);
  }
  assert.equal(requestedUrl, "https://dev.api.deep.navy/deepnavy.v1.EconomicsService/StreamCreditMovements");
  assert.equal(seen.length, 1);
  assert.equal(seen[0].sequence, 41n);
  assert.equal(seen[0].kind, 2, "CREDIT_MOVEMENT_KIND_SETTLE");
  assert.equal(seen[0].deltaMicros, -250000n);
  assert.equal(seen[0].teamBalanceAfterMicros, 9500000n);
  assert.equal(seen[0].organizationBalanceAfterMicros, 41750000n);
  assert.equal(seen[0].directCost.nanos, 160000000);
});

/* ---- the transport is the activity stream's ---------------------------- */

test("the ledger stream reconnects exactly like the activity stream", () => {
  const credit = between(app, "async function startCreditMovementStream(teamId", "function scheduleConversationReconnect");
  const schedule = between(app, "function scheduleCreditMovementReconnect(teamId", "async function startCreditMovementStream(teamId");

  // Same backoff curve and same budget as scheduleActivityReconnect.
  assert.match(schedule, /Math\.min\(30000, 1500 \* 2 \*\* attempt\)/);
  assert.match(credit, /nextAttempt <= activityReconnectLimit/);
  // Same token remedy: a mid-stream expiry heals through the session cookie.
  assert.match(schedule, /await refreshStreamAccessToken\(\)/);
  assert.match(credit, /normalized\.status === 401 \|\| normalized\.code === "unauthenticated"/);
  assert.match(credit, /if \(\(unauthenticated \|\| isRetryableApiError\(normalized\)\) && nextAttempt <= activityReconnectLimit\)/);
  // Same settle window, so a healthy-but-quiet stream still counts as live.
  assert.match(credit, /window\.setTimeout\(markStreamEstablished, 1500\)/);
  // Same resume cursor.
  assert.match(credit, /afterSequence: session\.lastCreditMovementSequence/);
  // A cleanly closed stream reconnects before anyone is asked to click anything.
  assert.match(credit, /scheduleCreditMovementReconnect\(teamId, generation, nextAttempt, false\)/);
});

test("an organization grant rides the team's stream, and another team's movement does not", () => {
  const credit = between(app, "async function startCreditMovementStream(teamId", "function scheduleConversationReconnect");
  // team_id is empty for an organization-scoped movement, and such a movement
  // still belongs here because it moves the pool the team spends from. Only a
  // movement naming a DIFFERENT team is out of scope.
  assert.match(credit, /if \(movementTeam && movementTeam !== stringValue\(teamId\)\)/);
  assert.match(credit, /invalid_response/);
});

test("a replay the server refuses is a designed state, not an outage", () => {
  const credit = between(app, "async function startCreditMovementStream(teamId", "function scheduleConversationReconnect");
  assert.match(credit, /normalized\.code === "resource_exhausted"/);
  assert.match(credit, /bounded replay window/);
  // And it is not dressed up as an error the customer can act on by retrying.
  assert.doesNotMatch(between(credit, 'resource_exhausted"', "return;"), /scheduleCreditMovementReconnect/);
});

/* ---- motion only where something arrived -------------------------------- */

test("the odometer rolls on a change, and never on a still number", () => {
  const roll = between(app, "function rollOdometer(element, fromMicros, toMicros)", "// The four kinds are the whole lifecycle");
  // No prior reading, no change, or reduced motion: write it, do not roll it.
  assert.match(roll, /typeof fromMicros !== "bigint" \|\| fromMicros === toMicros \|\| prefersReducedMotion\(\)/);
  assert.match(roll, /element\.textContent = settled;\s*\n\s*return;/);
  // The exact figure lands at the end, never a rounded interpolation.
  assert.match(roll, /\/\/ The exact figure lands at the end/);
  // A second frame mid-roll retargets the same element instead of racing it.
  assert.match(roll, /window\.cancelAnimationFrame\(previous\)/);

  // The unary balance read is the FIRST reading, so it is written, not rolled.
  const balance = between(app, "function renderCreditBalanceResult(result)", "function renderTeamCreditResults");
  assert.match(balance, /session\.creditBalanceShownMicros = balance;/);
  assert.doesNotMatch(balance, /rollOdometer/);
});

test("prefers-reduced-motion is read in JS as well as in CSS", () => {
  assert.match(app, /function prefersReducedMotion\(\)/);
  assert.match(app, /window\.matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches/);
});

test("the travelling hairline is set exactly where the stream's state is set", () => {
  // Every place the stream stops, fails, closes or reconnects must take the
  // hairline with it: a live rail left painted over a dead transport is the same
  // lie as a live dot over a dead pod.
  const stop = between(app, "function stopCreditMovementStream()", "// Reconnection twin of scheduleActivityReconnect");
  assert.match(stop, /setCreditMovementsLive\(false\)/);
  const schedule = between(app, "function scheduleCreditMovementReconnect(teamId", "async function startCreditMovementStream(teamId");
  assert.match(schedule, /setCreditMovementsLive\(false\)/);
  const credit = between(app, "async function startCreditMovementStream(teamId", "function scheduleConversationReconnect");
  assert.match(credit, /setCreditMovementsLive\(true\)/);
  assert.equal((credit.match(/setCreditMovementsLive\(false\)/g) || []).length, 2, "the cleanly-closed and the failed paths both remove it");

  const render = between(app, "function renderCreditMovementsLive()", "function setCreditMovementsLive(on)");
  assert.match(render, /classList\.toggle\("dn-livebar", on\)/);
});

test("reduced motion switches the loops OFF rather than collapsing them to 1ms", () => {
  // The global collapse sets animation-duration to a hundredth of a millisecond
  // and iteration-count to 1. For a keyframe that ends where it started that is
  // the same as switching it off; for dn-travel, which ends at translateX(360%),
  // it is not - the animation still runs, still fills, and parks the rail on its
  // final pose, clipped out of existence by the parent's overflow.
  const block = between(main, "@media (prefers-reduced-motion: reduce) {\n  .dn-livebar::after", "/* ---- the live credit ledger");
  assert.match(block, /\.dn-livebar::after \{\s*\n\s*animation: none !important;/);
  // And it is given an explicit resting pose, so "actively streaming" is still
  // expressed - as a lit rail that simply is not moving.
  assert.match(block, /transform: none;/);
  assert.match(block, /width: 100%;/);
  assert.match(block, /\.credit-movement-row,/);
  assert.match(block, /animation: none !important;/);
});

test("an arriving row uses the system's own overshoot, not a second opinion", () => {
  const append = between(app, "function appendCreditMovement(movement)", "function stopCreditMovementStream()");
  // --ease-arrive is reserved for something appearing that the reader did not
  // trigger, and .dn-in-pop is the design system's class for exactly that.
  assert.match(append, /row\.classList\.add\("dn-in-pop"\)/);
  assert.match(main, /\.dn-in-pop \{ animation: dn-pop var\(--dur-slow\) var\(--ease-arrive\) both; \}/);
});

/* ---- the money rules ---------------------------------------------------- */

test("the last frame and the balance panel are one number, not two readings", () => {
  const append = between(app, "function appendCreditMovement(movement)", "function stopCreditMovementStream()");
  // team_balance_after_micros is written THROUGH the panel above rather than
  // beside it, so the two cannot drift apart: there is only one of them.
  assert.match(append, /rollOdometer\(ui\.creditBalanceValue,/);
  assert.match(append, /session\.creditBalance = teamAfter;/);

  // And a read taken before a movement must never overwrite it, or the balance
  // visibly runs backwards a second after it moved.
  const balance = between(app, "function renderCreditBalanceResult(result)", "function renderTeamCreditResults");
  assert.match(balance, /session\.lastCreditMovementSequence > 0n/);
  assert.match(balance, /if \(!streamed\)/);
});

test("a provider cost is never presented as what the customer paid", () => {
  const row = between(app, "function creditMovementRow(movement)", "// The mockup's live line");
  assert.match(row, /metered provider cost/);
  assert.match(row, /not customer impact/);
  // The ledger converts cost to credits at the published rate, so the raw figure
  // understates customer impact and may never stand in for it.
  assert.match(row, /It is NOT what the customer paid/);
});

test("an absent count is never rendered as a zero", () => {
  const row = between(app, "function creditMovementRow(movement)", "// The mockup's live line");
  // "An empty unit means the movement metered nothing, and quantity is then not
  // a count of zero but no count at all."
  assert.match(row, /if \(unit && quantity !== null\)/);
  // operation_type is empty for a movement that is not one, such as a grant;
  // that absence is described rather than left blank.
  assert.match(row, /organization pool, not metered work/);
  assert.doesNotMatch(row, /quantity \|\| 0/);
});

test("empty is four different facts, and each is its own DataState", () => {
  const reset = between(app, "function resetCreditMovementsView(why", "// A frame arrived.");
  assert.match(reset, /setDataState\(ui\.creditMovementsEmpty, kind, why\)/);
  const credit = between(app, "async function startCreditMovementStream(teamId", "function scheduleConversationReconnect");
  // Open with nothing to say is PENDING, not absent: the contract says the
  // ledger withholds the newest movements until their ordering is settled, so
  // "nothing new" means "nothing has settled yet".
  assert.match(credit, /setDataState\(ui\.creditMovementsEmpty, "pending"/);
  assert.match(credit, /nothing has settled yet/);
  assert.match(credit, /setDataState\(ui\.creditMovementsEmpty, "unavailable"/);
  // The design system's banned blanket phrase must not appear.
  assert.doesNotMatch(credit, /No data available/i);
});

/* ---- the panel itself --------------------------------------------------- */

test("the panel follows the console mockup's live line", () => {
  // console.dc.html:591 puts the indicator inline and right-aligned, immediately
  // before the count it qualifies: "streaming · 1,284 events".
  const render = between(app, "function renderCreditMovementsLive()", "function setCreditMovementsLive(on)");
  assert.match(render, /createTextNode\("streaming · "\)/);
  assert.match(render, /dn-dot dn-dot--live dn-dot--pulse/);
  assert.match(render, /movements/);
  // The count is present whether or not it is streaming, so removing the
  // indicator never removes information.
  const dotIndex = render.indexOf('dn-dot--pulse');
  const countIndex = render.indexOf("const seen = session.creditMovements.length");
  assert.ok(dotIndex < countIndex, "the dot and word precede the count they qualify");

  assert.match(shell, /data-credit-movements-panel/);
  assert.match(shell, /class="dn-stat__value dn-odometer" data-credit-movements-org/);
  assert.match(shell, /class="dn-odometer" data-credit-balance-value/);
  // The line itself carries no hue; only the dot inside it does.
  const live = between(main, ".movement-live {", ".movement-stats {");
  assert.match(live, /color: var\(--text-tertiary\)/);
  assert.doesNotMatch(live, /--status-live-fg/);
});

test("the shared organization pool is described as shared, not as a team allowance", () => {
  // The billing mockup still says credits are held per team so a hot team cannot
  // spend another's allowance. That is no longer true - the pool is
  // organization-scoped - so the shape is kept and the content corrected.
  const panel = between(shell, "data-credit-movements-panel", "</section>");
  assert.match(panel, /Organization pool/);
  assert.match(panel, /shared across the organization/);
  assert.match(panel, /a team does not hold an allowance of its own/);
});
