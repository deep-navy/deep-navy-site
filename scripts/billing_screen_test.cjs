"use strict";

// The Billing screen — organization scope.
//
// Pricing is $199 a month for the ORGANIZATION, unlimited teams, 10,000
// credits included per billing period. The base Stripe item licenses the
// organization and its quantity is pinned at one, so nothing on this screen
// multiplies a price by a team count: the teams table is a roster of what the
// one licence already covers, and the only figure that is authoritatively
// what you paid is an invoice — which is on the same screen.
//
// The credit reading is the organization's own measured summary, because that
// is the only credit figure that is organization-scoped. The per-team
// balances belong to Economics and are deliberately not summed here: the pool
// is shared, so adding it up once per team would count the same credits
// several times.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const css = readFileSync("assets/css/console.css", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");

const renderer = (name, next) =>
  app.slice(app.indexOf(`function ${name}(`), app.indexOf(`function ${next}(`));

const screen = () => {
  const start = shell.indexOf('data-view="billing"');
  assert.notEqual(start, -1, "the billing view is missing");
  return shell.slice(start, shell.length);
};

test("nothing multiplies a price by a team count", () => {
  // The bug this screen exists to end: unit × teams read as "$199 × your team
  // count" the moment the plan became an organization licence.
  assert.doesNotMatch(app, /unitCents \* BigInt\(count\)/);
  assert.doesNotMatch(app, /organizationSubscriptionCents\(\) \* BigInt/);
  const subscription = renderer("renderBillingSubscription", "renderBillingTeams");
  assert.doesNotMatch(subscription, /\* BigInt\(/);
  assert.match(subscription, /a month for this organization · as many teams as you need/);
  assert.match(subscription, /The amount you were actually charged is an invoice/);
});

test("the readings on this screen are ones the platform served", () => {
  for (const procedure of ["subscription", "billing_plan", "invoices", "billing_portal"]) {
    assert.match(client, new RegExp(`"${procedure}",`), `${procedure} must be reachable`);
  }
  // The organization's own measured summary — the only organization-scoped
  // credit figure the ledger will give a browser.
  assert.match(app, /apiRequest\("economics", \{ scopeType: "organization", scopeId: session\.organizationId \}\)/);
  const accept = renderer("renderOrganizationEconomicsResult", "renderSessionSpendResult");
  assert.match(accept, /scopeType !== "organization"/, "a summary about another scope must be refused");
  assert.match(accept, /scopeId !== session\.organizationId/);
  assert.match(accept, /session\.organizationEconomicsState = "unavailable"/);
  // The shared pool is never re-added per team.
  const credits = renderer("renderBillingCredits", "renderTeamCreditResults");
  assert.doesNotMatch(credits, /session\.teams[\s\S]*reduce/);
  assert.match(app, /count the same[\s\S]{0,40}credits several times/);
});

test("every figure that is missing says which kind of missing it is", () => {
  const credits = renderer("renderBillingCredits", "renderTeamCreditResults");
  assert.match(credits, /setDataState\(host, "unavailable"[\s\S]*Nothing here is a zero/);
  assert.match(credits, /setDataState\(host, "loading"/);
  assert.match(credits, /setDataState\(host, "unavailable"[\s\S]*rather than a zero standing in for one/);
  const subscription = renderer("renderBillingSubscription", "renderBillingTeams");
  assert.match(subscription, /setDataState\(host, "pending"[\s\S]*action: \{ label: "Create your first team", view: "dashboard" \}/);
  const teams = renderer("renderBillingTeams", "renderBillingCredits");
  assert.match(teams, /setDataState\(host, "pending"/);
  // The stat strip is withheld entirely rather than printing a plan nobody
  // confirmed.
  const stats = renderer("renderBillingStats", "engineerSeatsAboveFloor");
  assert.match(stats, /if \(!plan\) \{\s*\n\s*host\.hidden = true;/);
});

test("the licence covers every team it has, and the stat agrees with the roster", () => {
  const stats = renderer("renderBillingStats", "engineerSeatsAboveFloor");
  assert.match(stats, /lifecycleLabel\(team\?\.state\) !== "deleted"/,
    "a team still provisioning is covered too");
  assert.match(stats, /billingStat\("Teams it covers", new Intl\.NumberFormat\(\)\.format\(covered\), "· no limit"\)/);
  const teams = renderer("renderBillingTeams", "renderBillingCredits");
  assert.match(teams, /!\["deleted"\]\.includes\(lifecycleLabel\(team\?\.state\)\)/);
  assert.match(teams, /all covered by the one licence/);
});

/* CHANGED DELIBERATELY. This used to be "what still bills per seat is an
 * engineer above the floor, and only that" — true when an engineer above three
 * was a $199/month subscription item. The server deleted that add-on: seats are
 * unlimited within a team and credits are the only usage charge.
 *
 * The COUNT survives and is still shown, because the floor of three is a real
 * composition rule (two peer reviewers on every shipped change) and the roster
 * is worth reading. What must not survive is any suggestion that the count
 * costs money, so that is what is pinned. */
test("the engineer count is reported as a roster fact, never as a charge", () => {
  const seats = renderer("engineerSeatsAboveFloor", "renderBillingSubscription");
  assert.match(seats, /count > ENGINEER_FLOOR \? count - ENGINEER_FLOOR : 0/,
    "the roster is still counted against the floor");
  assert.match(screen(), /Engineers are not a per-seat charge/);
  assert.match(screen(), /every shipped change gets two peer[\s\S]{0,20}reviews/);
  // The console must not tell a customer a seat bills.
  assert.doesNotMatch(screen(), /billed per seat/);
  assert.doesNotMatch(screen(), /bills per seat/);
});

test("the credit meter's hue is paired with a word, and is drawn through CSSOM", () => {
  const credits = renderer("renderBillingCredits", "renderTeamCreditResults");
  assert.match(credits, /\["Past the included grant", "danger"\]/);
  assert.match(credits, /\["Running low", "attention"\]/);
  assert.match(credits, /\["Headroom", "live"\]/);
  assert.match(credits, /heading\.textContent = word/, "the word is what survives greyscale");
  assert.match(credits, /setChartGeometry\(fill, \{ width: Math\.min\(100, share\) \}, "gc"\)/);
  assert.doesNotMatch(credits, /\.style\./);
  for (const tone of ["live", "attention", "danger"]) {
    assert.ok(css.includes(`.cs-credits__fill[data-tone="${tone}"]`), `${tone} has no fill rule`);
  }
});

test("the invoices moved to Billing whole, and the Stripe door is the quiet weight", () => {
  // Organization-scoped records belong on the organization-scoped screen; the
  // implementation moved with them rather than being written twice.
  assert.match(screen(), /data-invoice-history/);
  assert.match(screen(), /data-invoice-list/);
  assert.match(screen(), /data-invoice-more/);
  const economics = shell.slice(shell.indexOf('data-view="economics"'), shell.indexOf('data-view="approvals"'));
  assert.doesNotMatch(economics, /data-invoice-history/, "one invoice list, on one screen");
  // The portal is a departure, not a commit, so it keeps the secondary weight.
  assert.match(screen(), /class="dn-btn dn-btn--secondary dn-btn--sm" type="button" data-billing-portal/);
  assert.match(app, /ui\.billingPortal\.addEventListener\("click", manageBilling\)/);
  assert.match(app, /ui\.billingPortal\.disabled = !session\.subscriptionManageable \|\| checkoutOpening/);
});
