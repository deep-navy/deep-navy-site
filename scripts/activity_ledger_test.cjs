// Source labels are internal discriminators that the timeline can render,
// so they no longer name services. The rule under test is unchanged.
"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");

test("activity filters cover every launch work source without conflating their cursors", () => {
  for (const category of ["all", "conversations", "sessions", "tools", "workspace", "delivery", "approvals", "provisioning", "cost"]) {
    assert.match(shell, new RegExp(`data-activity-filter="${category}"`));
  }
  assert.match(app, /source: "runtime"/);
  assert.match(app, /ProvisioningService stream/);
  assert.match(app, /source: "approval queue"/);
  assert.match(app, /source: "economics"/);
  assert.match(app, /Activity event \$\{sequence\.toString\(\)\}/);
  assert.match(app, /Provisioning event \$\{sequence\.toString\(\)\}/);
});

test("runtime activity renders only the normalized allowlisted envelope", () => {
  for (const type of ["a2a.message", "tool.call", "session.status", "artifact.summary"]) assert.match(app, new RegExp(type.replace(".", "\\.")));
  for (const detail of ["from_agent_id", "to_agent_id", "message_kind", "tool_name", "duration_ms", "current_status", "reason_code", "artifact_type", "artifact_id", "change_kind"]) assert.match(app, new RegExp(detail));
  assert.match(app, /unexpected detail field/);
  assert.match(app, /non-monotonic sequence/);
  assert.match(app, /canonicalArtifactUrl/);
  assert.match(app, /url\.hostname !== "github\.com"/);
  assert.match(app, /link\.textContent = "Open verified GitHub artifact"/);
  assert.match(app, /link\.rel = "noopener noreferrer"/);
  assert.match(app, /link\.referrerPolicy = "no-referrer"/);
  assert.doesNotMatch(app, /innerHTML|outerHTML|insertAdjacentHTML/);
  assert.doesNotMatch(app, /prompt|chain.of.thought|reasoning_content/i);
});

test("the browser uses the generated ProvisioningService stream", () => {
  assert.match(client, /provisioning\.streamProvisioningStatus/);
  assert.match(client, /afterSequence: int64Field/);
  assert.match(client, /timeoutMs: 0/);
  assert.match(client, /return Object\.freeze\(\{ request, signIn, streamTeamActivity, streamTeamConversation, streamProvisioningStatus, streamCreditMovements \}\)/);
});

test("objective recovery is team-scoped, paginated, and selectable after refresh", () => {
  assert.match(app, /apiRequest\("objectives", \{ teamId, page: \{ pageSize: 100, pageToken \} \}\)/);
  assert.match(app, /Objective pagination returned a repeated cursor/);
  assert.match(app, /stringValue\(objective\?\.teamId\) !== stringValue\(teamId\)/);
  assert.match(app, /objectiveListsByTeam/);
  assert.match(app, /ui\.objectiveSelect\.addEventListener\("change", selectObjective\)/);
});

test("customer economics breakdowns are server-calculated, scoped, and bounded", () => {
  for (const group of ["operation", "initiative", "agent", "agent_role", "repository", "issue", "pull_request"]) assert.match(app, new RegExp(`key: "${group}"`));
  // Operation leads, because on a real team most of the spend is not a unit of
  // work: the one-shot provisioning charge dwarfs the model calls, and every
  // other dimension renders that as "no attribution" rather than as a fact.
  assert.match(app, /economicsGroupDefinitions = Object\.freeze\(\[\s*\n\s*\{ key: "operation"/);
  assert.match(app, /apiRequest\("economics_breakdowns"/);
  assert.match(app, /parentScopeType: "team"/);
  assert.match(app, /Economics breakdown exceeded the supported 500-row dimension limit/);
  /* CHANGED DELIBERATELY: this pinned formatCanonicalMoney(record.directCost)
   * leading the row. directCost is what the work cost DEEP NAVY at the
   * provider; the ledger converts cost to credits at the published rate, so it
   * is roughly 2.5x away from what the customer is charged. Printing it beside
   * a credit figure put two currencies in one line with no label saying which
   * was which. The money shown now is the credits restated at $0.01 each — the
   * same quantity in the other unit, so the two can never disagree. */
  assert.match(app, /formatCreditMicros\(record\.creditsUsedMicros\).*formatCreditValue\(record\.creditsUsedMicros\)/s);
  assert.doesNotMatch(app, /formatCanonicalMoney\(record\.directCost\)/,
    "our measured direct cost is cost of goods and does not belong on a customer surface");
  assert.match(client, /economics\.listEconomicsBreakdowns/);
  // groupBy travels as the definition's KEY, so a dimension the app offers and
  // the client cannot map is a screen that throws invalid_argument on open.
  assert.match(client, /operation: EconomicsScopeType\.OPERATION/,
    "the app offers an Operation breakdown; the client must be able to send it");
});

test("the activity stream reconnects itself and heals an expired token", () => {
  // A mid-stream token expiry arrives as an in-stream "unauthenticated"
  // error frame; the old code treated it as terminal and the manual Retry
  // reused the same stale token, so one expiry became a permanent dead
  // panel. Reconnects are automatic with backoff, bounded for streams that
  // never establish, and routed through the refresh_session cookie exchange
  // when auth is the failure.
  assert.match(app, /function refreshStreamAccessToken/);
  assert.match(app, /platformApi\.signIn\("refresh_session"/);
  assert.match(app, /function scheduleActivityReconnect/);
  assert.match(app, /const activityReconnectLimit = \d+/);
  assert.match(app, /Math\.min\(30000, 1500 \* 2 \*\* attempt\)/);
  assert.match(app, /normalized\.status === 401 \|\| normalized\.code === "unauthenticated"/);
  assert.match(app, /scheduleActivityReconnect\(teamId, generation, nextAttempt, unauthenticated\)/);
  assert.match(app, /scheduleActivityReconnect\(teamId, generation, nextAttempt, false\)/);
  // A stream that genuinely established gets a fresh budget when it drops.
  assert.match(app, /streamEstablished \? 0 : attempt \+ 1/);
});

test("reconnecting is a different promise than terminal unavailability", () => {
  assert.match(app, /setSourceState\(ui\.activityState, "Reconnecting", "loading"\)/);
  assert.match(app, /setSourceState\(ui\.activityState, "Unavailable", "error"\)/);
});

// The log is read by the person paying for the work, not by the service that
// emitted the event. It printed enum names in sentence position - "Provisioning
// is succeeded", "ready · attempt 2" - and explained a number by saying what it
// was NOT ("not a streamed usage event"), which answers a question nobody asked.
test("the activity log speaks to the customer, not in service vocabulary", () => {
  const source = readFileSync("assets/js/app.js", "utf8");

  assert.doesNotMatch(source, /`Provisioning is \$\{label\}\.`/, "a state enum is still used as a sentence");
  assert.doesNotMatch(source, /title: `Provisioning · \$\{label\}`/, "the log still titles entries with the internal state");
  assert.doesNotMatch(source, /attributable cost/, "\"attributable cost\" is service vocabulary");
  assert.doesNotMatch(source, /not a streamed usage event/, "the explanation still says what the number is not");
  assert.doesNotMatch(source, /`attempt \$\{record\.attempt\}`/, "a raw retry counter is still shown");

  // What it says instead: a sentence about the team, and a credit balance the
  // customer can act on.
  assert.match(source, /const SETUP_SENTENCE = \{/);
  assert.match(source, /succeeded: \["Setup finished", "Your team finished setting up and is ready to work\."\]/);
  // The summary carries both units of the SAME figure — credits, and those
  // credits in money — and no longer quotes our measured direct cost beside them.
  assert.match(source, /credits used \(\$\{formatCreditValue\(economics\.creditsUsedMicros\)\}\)/);
  assert.match(source, /\$\{formatCreditMicros\(economics\.creditsRemainingMicros\)\} left in the organization's pool/);
  assert.doesNotMatch(source, /Measured cost of the work so far/,
    "our direct cost is not the customer's bill and is no longer quoted as one");
  // The stated rate must match the published one: 1 credit = $0.01.
  assert.match(source, /100 credits = \$1\.00 of model, compute and storage usage/);
  const pricing = readFileSync("pricing/index.md", "utf8");
  assert.match(pricing, /1 credit = \$0\.01 of billable model, compute, storage, and service usage/,
    "the pricing page no longer states the rate the app quotes");
  // Reconcile passes are how declarative provisioning works: the counter
  // appears only when something actually failed and the number explains the
  // wait - a successful setup never brags about its retries.
  assert.doesNotMatch(source, /record\.attempt > 1 \? `took \$\{record\.attempt\} attempts`/);
  assert.match(source, /tried \$\{record\.attempt\} times/);
});

// The ledger accepts the agent's own sentence and survives event types newer
// than this build; provisioning reconcile passes stop masquerading as
// struggle on success rows.
test("agent notes render and unknown event types skip instead of killing the stream", () => {
  const source = readFileSync("assets/js/app.js", "utf8");
  assert.match(source, /runtimeActivityTypes = new Set\(\[.*"agent\.note"\]\)/);
  assert.match(source, /if \(!runtimeActivityTypes\.has\(type\)\) return null;/);
  assert.match(source, /if \(entry === null\) \{/);
  // The duplicate details.note is ignored, never validated as a code value.
  assert.match(source, /activityDetailIgnoredKeys = Object\.freeze\(\{ "agent\.note": new Set\(\["note"\]\) \}\)/);
  // The attempts counter appears only when something actually failed.
  assert.match(source, /record\.attempt > 1 && \/fail\|error\|degraded\/i\.test\(String\(label\)\)/);
  assert.doesNotMatch(source, /took \$\{record\.attempt\} attempts/);
  assert.doesNotMatch(source, /`attempt \$\{record\.attempt\}`/);
});

// Day one on a real team read "10,000 credits used ($100.00)" seconds after it
// was created, with no hint of where that came from. It is correct: a team's
// monthly runtime is levied once at provisioning - $75 of cost, 10,000 credits,
// The credits line states the pool's contract: the subscription includes the
// organization's monthly credits, teams are unlimited and free to create (the
// flat team-runtime charge was retired 2026-08-28), and credits are spent only
// as agents work. The old copy explained a per-team charge that no longer
// exists; asserting its absence keeps it from returning.
test("the credits line states the subscription-pool contract", () => {
  const detail = app.slice(app.indexOf('id: `cost:${teamId}`'));
  const block = detail.slice(0, detail.indexOf("occurredAt"));
  assert.match(block, /subscription includes your organization's monthly credits/,
    "the customer must be told where the pool comes from");
  assert.match(block, /Teams are unlimited and cost nothing to create/,
    "and that creating teams is free");
  assert.match(block, /spent only as your agents work/,
    "and that credits leave the pool through agent work alone");
  assert.doesNotMatch(block, /monthly runtime is charged once/,
    "the retired per-team charge explanation must not return");
  // The staleness caveat earned its place separately; do not lose it.
  assert.match(block, /Measured at a point in time/);
});
