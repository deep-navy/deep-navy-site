"use strict";

// WHICH BALANCE THE CONSOLE MEANS.
//
// BillingService reports two credit figures and they are not interchangeable:
//
//   balance_micros              the signed sum of the ledger entries that NAME
//                               one team. An attribution diagnostic. For a
//                               fully funded team it is routinely NEGATIVE,
//                               because an organization grant carries no
//                               team_id and never enters the filtered sum while
//                               every charge names one.
//   organization_balance_micros the shared prepaid pool. What a team can
//                               actually spend, what the spend gate reserves
//                               against, and the same quantity
//                               TeamCreditControl reports as
//                               ledger_available_micros.
//
// The console confused them in three places at once, and the customer-visible
// symptom was a credit panel that BLANKED ITSELF on entirely healthy data with
// "BillingService returned inconsistent ledger and budget projections" — the
// consistency guard cross-checking a team-filtered sum against the pool, which
// diverge the moment any team spends anything.
//
// THESE TESTS EXECUTE THE GUARD. A test that merely asserted "a consistency
// guard exists" would have stayed green through the whole outage, because the
// guard was there and firing — it was reading the wrong operand. So what is
// pinned here is the OPERANDS: pool against pool, never pool against team.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");

/* Lift one function out of app.js by brace matching, so these run the shipped
 * source rather than a paraphrase of it. */
function fn(name) {
  const start = app.indexOf(`  function ${name}(`);
  assert.notEqual(start, -1, `app.js no longer defines ${name}`);
  let depth = 0;
  for (let i = app.indexOf("{", start); i < app.length; i++) {
    if (app[i] === "{") depth += 1;
    else if (app[i] === "}") {
      depth -= 1;
      if (depth === 0) return app.slice(start, i + 1);
    }
  }
  throw new Error(`unbalanced braces in ${name}`);
}

function between(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  assert.notEqual(start, -1, `marker missing: ${startMarker}`);
  const end = app.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `marker missing after ${startMarker}: ${endMarker}`);
  return app.slice(start, end);
}

/* The credit surface, wired to recording stubs for everything it paints. */
function creditSurface() {
  const calls = [];
  const ui = new Proxy({}, {
    get: (target, key) => (target[key] ||= { __el: String(key), textContent: "", hidden: true })
  });
  const session = { creditBalance: null, creditBalanceShownMicros: null, lastCreditMovementSequence: 0n };
  const source = [
    fn("stringValue"),
    fn("int64Value"),
    fn("signedInt64Value"),
    fn("timestampDate"),
    fn("formatCreditMicros"),
    fn("pauseReasonLabel"),
    fn("validCreditControl"),
    fn("renderCreditBalanceResult"),
    fn("renderTeamCreditResults")
  ].join("\n");
  const build = new Function("ui", "session", "record", `
    ${source}
    function resetCreditBalanceView(message, label, tone) { record("resetCreditBalanceView", message, label, tone); }
    function resetCreditControlView(message, label, tone) { record("resetCreditControlView", message, label, tone); }
    function renderCreditControlResult(result, teamId) { record("renderCreditControlResult", teamId); }
    function setSourceState(element, label, tone) { record("setSourceState", label, tone); }
    function renderRailSpend() {}
    function renderStatStrip() {}
    function apiErrorMessage(error, fallback) { return fallback; }
    return { renderTeamCreditResults, renderCreditBalanceResult, validCreditControl };
  `);
  const api = build(ui, session, (name, ...args) => calls.push({ name, args }));
  return { ...api, ui, session, calls, called: (name) => calls.some((entry) => entry.name === name) };
}

/* The live team from the incident: 18,883.403215 credits of work booked
 * against it, 308,944.522099 credits left in the organization's pool, and no
 * team-scoped grant — so its own filtered sum is deeply negative while it is
 * in fact solvent. */
const TEAM_ID = "team_01HZX";
const ORGANIZATION_POOL = 308_944_522_099n;
const TEAM_FILTERED_SUM = -18_883_403_215n;

function healthyControl(overrides = {}) {
  const ledger = overrides.ledgerAvailableMicros ?? ORGANIZATION_POOL;
  const open = 0n;
  const consumed = 18_883_403_215n;
  const hard = 500_000_000_000n;
  const budget = hard - (open + consumed);
  return {
    teamId: TEAM_ID,
    ledgerAvailableMicros: ledger,
    openReservedMicros: open,
    periodConsumedMicros: consumed,
    hardLimitMicros: hard,
    budgetRemainingMicros: budget,
    effectiveAvailableMicros: ledger < budget ? ledger : budget,
    version: 7n,
    pauseReason: 1,
    paused: false,
    customerPaused: false,
    periodStartsAt: { seconds: 1_756_000_000n, nanos: 0 },
    periodEndsAt: { seconds: 1_758_000_000n, nanos: 0 },
    ...overrides
  };
}

const balanceResponse = (organization, team) => ({
  status: "fulfilled",
  value: { balanceMicros: team, organizationBalanceMicros: organization }
});

test("the fixture is one the guard actually inspects, or these prove nothing", () => {
  const surface = creditSurface();
  assert.equal(surface.validCreditControl(healthyControl(), TEAM_ID), true,
    "healthyControl must pass validCreditControl, otherwise the guard is skipped and every assertion below is vacuous");
});

test("healthy data does NOT blank the panel — either way the team's own sum can fall", () => {
  // Both production failure modes, and they are different failures.
  //
  //   negative filtered sum  int64Value refuses it, the read reported an
  //                          "invalid team credit balance" and blanked.
  //   positive filtered sum  the read succeeded and the CONSISTENCY GUARD
  //                          fired instead, blanking both panels with
  //                          "inconsistent ledger and budget projections".
  //
  // A team with a team-scoped grant of its own lands in the second; a team
  // without one lands in the first. Neither is unhealthy data.
  for (const [label, teamSum] of [["negative", TEAM_FILTERED_SUM], ["positive", 5_000_000_000n]]) {
    const surface = creditSurface();
    surface.renderTeamCreditResults(
      balanceResponse(ORGANIZATION_POOL, teamSum),
      { status: "fulfilled", value: { control: healthyControl() } },
      TEAM_ID
    );
    assert.equal(surface.called("resetCreditBalanceView"), false,
      `the balance panel blanked on healthy data with a ${label} filtered sum — the exact production symptom`);
    assert.equal(surface.called("resetCreditControlView"), false,
      `the budget panel blanked on healthy data with a ${label} filtered sum`);
    assert.equal(surface.called("renderCreditControlResult"), true);
    assert.equal(surface.session.creditBalance, ORGANIZATION_POOL);
  }
});

test("the consistency guard compares the organization pool with the organization pool", () => {
  // balance_micros is not an operand. Whatever it says — negative, zero, huge,
  // absent — the guard's verdict must not move, because it is a different
  // quantity from ledger_available_micros and comparing them is meaningless.
  for (const teamSum of [TEAM_FILTERED_SUM, 0n, 1n, -1n, 999_999_999_999n, undefined]) {
    const surface = creditSurface();
    surface.renderTeamCreditResults(
      balanceResponse(ORGANIZATION_POOL, teamSum),
      { status: "fulfilled", value: { control: healthyControl() } },
      TEAM_ID
    );
    assert.equal(surface.called("resetCreditBalanceView"), false,
      `balance_micros = ${teamSum} changed the guard's verdict; it must not be an operand`);
  }

  // And the guard is still a guard: a pool that disagrees with the pool the
  // budget projection reports is a real inconsistency and still fails closed.
  const inconsistent = creditSurface();
  inconsistent.renderTeamCreditResults(
    balanceResponse(ORGANIZATION_POOL, TEAM_FILTERED_SUM),
    { status: "fulfilled", value: { control: healthyControl({ ledgerAvailableMicros: ORGANIZATION_POOL - 1n }) } },
    TEAM_ID
  );
  const blanked = inconsistent.calls.find((entry) => entry.name === "resetCreditBalanceView");
  assert.ok(blanked, "a genuine pool-against-pool disagreement must still fail closed");
  assert.match(blanked.args[0], /inconsistent ledger and budget projections/);
  assert.ok(inconsistent.called("resetCreditControlView"), "both projections are withheld together");
});

test("the figure shown as remaining credit is the pool, never the team's filtered sum", () => {
  const surface = creditSurface();
  surface.renderCreditBalanceResult(balanceResponse(ORGANIZATION_POOL, TEAM_FILTERED_SUM));
  assert.equal(surface.session.creditBalance, ORGANIZATION_POOL);
  assert.equal(surface.ui.creditBalanceValue.textContent, "308,944.522099");
  assert.notEqual(surface.ui.creditBalanceValue.textContent.startsWith("−"), true,
    "a fully funded team was shown a negative balance");
  assert.equal(surface.called("resetCreditBalanceView"), false);

  // An absent pool figure is an invalid response, not a zero and not a
  // fallback to the team sum.
  const absent = creditSurface();
  absent.renderCreditBalanceResult({ status: "fulfilled", value: { balanceMicros: TEAM_FILTERED_SUM } });
  assert.ok(absent.called("resetCreditBalanceView"), "no pool figure must not silently borrow the team sum");
  assert.equal(absent.session.creditBalance, null);
});

test("the stream writes the same quantity the read does, so the first frame cannot undo the fix", () => {
  const append = between("function appendCreditMovement(movement)", "function stopCreditMovementStream()");
  assert.match(append, /const organizationAfter = signedInt64Value\(movement\?\.organizationBalanceAfterMicros\)/);
  assert.match(append, /session\.creditBalance = organizationAfter;/);
  assert.match(append, /rollOdometer\(ui\.creditBalanceValue, typeof previous === "bigint" \? previous : null, organizationAfter\)/);
  // team_balance_after_micros is the team-filtered window and must not reach
  // the panel: a frame carrying it would drag the balance back to the negative
  // quantity a second after the workspace loaded.
  assert.doesNotMatch(append, /session\.creditBalance = teamAfter/);
  assert.doesNotMatch(append, /teamBalanceAfterMicros/);
});

test("the panel says whose balance it is", () => {
  // The figure is organization-scoped, so a heading calling it the team's is
  // the same confusion in words.
  assert.match(shell, /id="credit-balance-title">Organization credit balance</);
  const render = fn("renderCreditBalanceResult");
  assert.match(render, /organization's shared prepaid pool/);
  assert.doesNotMatch(render, /minus settled usage for this team/);
});

test("a credit pack raises a ceiling; it does not fence the credits to one team", () => {
  // CreateCreditPackCheckoutSessionRequest.team_id: "A client must not tell a
  // customer that a purchase is confined to one team."
  const checkout = between("async function startCreditPackCheckout(event)", "function validatedRedirect(value");
  assert.doesNotMatch(checkout, /Apply purchased credits only to/);
  assert.match(checkout, /spending ceiling/);
  assert.match(checkout, /shared pool/);
  assert.match(checkout, /any team can spend them/);
});
