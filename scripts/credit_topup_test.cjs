"use strict";

// AUTOMATIC CREDIT TOP-UP — the console side of an unattended card charge.
//
// Credits are one pool per ORGANIZATION, so when it empties every team stops
// mid-objective. This is the customer arming a refill against that: below a
// threshold they set, the card already on file is charged without them present.
//
// Two properties are load-bearing rather than cosmetic, and both are pinned by
// executing the code rather than by reading it.
//
//   CONSENT IS NOT A TOGGLE. The card networks require a recorded agreement for
//   an unscheduled off-session charge, and the server enforces it with a CHECK
//   constraint — an enabled policy with no version, timestamp and user is
//   literally unstorable. So the console must render required_consent.text
//   VERBATIM, ship the opt-in UNTICKED, and echo consent_terms_version back.
//   Paraphrasing would also break the disclosures Stripe requires: timing,
//   frequency, how the amount is determined, and cancellation.
//
//   A DECLINE DISARMS THE ORGANIZATION, TERMINALLY. Off session, Strong
//   Customer Authentication cannot be completed, so Stripe reports it as a
//   decline only the customer can clear. It is never retried. Re-enabling needs
//   reArm: true plus fresh consent — and, critically, turning the toggle back on
//   does NOT fix a declined card. A customer who believes it does will sit
//   disarmed believing they are covered, which is the failure this panel exists
//   to prevent.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");
const generated = Function(`${readFileSync("assets/js/platform-api-client.js", "utf8")}\nreturn deepNavyGeneratedClient;`)();

/* The body's opening brace, not the first brace after the name — a default
 * parameter such as `options = {}` puts one in the SIGNATURE, and starting
 * there returns half a function that then fails to parse. */
function bodyBrace(source, start) {
  let depth = 0;
  for (let i = source.indexOf("(", start); i < source.length; i++) {
    if (source[i] === "(") depth += 1;
    else if (source[i] === ")") {
      depth -= 1;
      if (depth === 0) return source.indexOf("{", i);
    }
  }
  throw new Error("unbalanced parameter list");
}

function fn(name) {
  let start = app.indexOf(`  function ${name}(`);
  if (start === -1) start = app.indexOf(`  async function ${name}(`);
  assert.notEqual(start, -1, `app.js no longer defines ${name}`);
  let depth = 0;
  for (let i = bodyBrace(app, start); i < app.length; i++) {
    if (app[i] === "{") depth += 1;
    else if (app[i] === "}") {
      depth -= 1;
      if (depth === 0) return app.slice(start, i + 1);
    }
  }
  throw new Error(`unbalanced braces in ${name}`);
}

function constant(name) {
  const start = app.indexOf(`  const ${name} = Object.freeze({`);
  assert.notEqual(start, -1, `app.js no longer defines ${name}`);
  let depth = 0;
  for (let i = app.indexOf("{", start); i < app.length; i++) {
    if (app[i] === "{") depth += 1;
    else if (app[i] === "}") {
      depth -= 1;
      if (depth === 0) return `${app.slice(start, i + 1)});`;
    }
  }
  throw new Error(`unbalanced braces in ${name}`);
}

/* The exact terms the server publishes (platform-api
 * internal/billing/credit_topup.go). They are reproduced here as a FIXTURE, to
 * be handed to the renderer and compared against what it paints — never as the
 * console's own copy of the wording. */
const CONSENT_VERSION = "auto-topup-terms/v1";
const CONSENT_TEXT = [
  "Automatic credit top-up",
  "You authorise deep navy to charge the payment method saved on your organization's account for prepaid Engineering Credits, without you present, whenever the conditions you set below are met.",
  "These charges are unscheduled. They are not on a fixed date and there is no fixed number of them: a charge happens only when your organization's shared credit balance falls to or below the threshold you set, and only when every other condition you set here is satisfied. deep navy will never charge automatically more than once while a previous automatic charge is still in progress, and will wait a cooling-off interval after each one.",
  "Each charge is the published price of the credit pack you select, multiplied by the number of packs you select. Nothing else is added. Automatic charges will never total more than the per-billing-period ceiling you set, and that ceiling resets when your billing period does.",
  "You can turn automatic top-up off at any time in Settings, with immediate effect and no notice. Turning it off stops all future automatic charges; it does not reverse a charge that has already been made. If a charge is declined, automatic top-up stops by itself and will not run again until you fix the payment method and turn it back on."
].join("\n\n");

/* A minimal DOM, enough for the consent renderer to build into. */
function element(tag = "div") {
  const node = {
    tagName: tag.toUpperCase(),
    children: [],
    hidden: false,
    checked: false,
    disabled: false,
    _text: "",
    dataset: {},
    get textContent() {
      return this.children.length ? this.children.map((child) => child.textContent).join("\n\n") : this._text;
    },
    set textContent(value) {
      this._text = String(value);
      this.children = [];
    },
    replaceChildren(...nodes) { this.children = nodes; },
    append(...nodes) { this.children.push(...nodes); },
    querySelector() { return null; }
  };
  return node;
}

function consentSurface(settings, { enabled = true } = {}) {
  const ui = {
    topUpConsent: element("fieldset"),
    topUpConsentTitle: element("legend"),
    topUpConsentText: element(),
    topUpConsentAccept: element("input"),
    topUpConsentVersion: element("p"),
    topUpEnabled: Object.assign(element("input"), { checked: enabled })
  };
  const dataStates = [];
  const run = new Function("ui", "document", "recordDataState", `
    ${fn("stringValue")}
    ${fn("creditTopUpConsentRequired")}
    ${fn("renderCreditTopUpConsent")}
    function setDataState(element, kind, why) { recordDataState(kind, why); }
    return renderCreditTopUpConsent;
  `);
  run(ui, { createElement: (tag) => element(tag) }, (kind, why) => dataStates.push({ kind, why }))(settings, Boolean(settings.reArmRequired));
  return { ui, dataStates };
}

const baseSettings = (overrides = {}) => ({
  enabled: false,
  thresholdMicros: 1_000_000_000n,
  creditPackId: "engineering-credits",
  packQuantity: 1n,
  cooldownSeconds: 900n,
  reArmRequired: false,
  version: 3n,
  requiredConsent: { version: CONSENT_VERSION, text: CONSENT_TEXT },
  ...overrides
});

/* ---- the ceiling ------------------------------------------------------- */

test("all three procedures are on the browser's ceiling and reach the real client", () => {
  for (const procedure of ["credit_top_up_settings", "update_credit_top_up_settings", "credit_top_ups"]) {
    assert.ok(generated.SUPPORTED_PROCEDURES.includes(procedure), `${procedure} is not reachable from the browser`);
    assert.match(client, new RegExp(`case "${procedure}":`), `${procedure} has no case in request()`);
  }
  // The streaming and unary lists stay disjoint.
  for (const procedure of ["credit_top_up_settings", "update_credit_top_up_settings", "credit_top_ups"]) {
    assert.ok(!generated.STREAM_PROCEDURES.includes(procedure));
  }
});

/* ---- consent ------------------------------------------------------------ */

test("the agreement is rendered verbatim, paragraph for paragraph", () => {
  const { ui } = consentSurface(baseSettings());
  const painted = ui.topUpConsentText.children.map((child) => child.textContent);
  const published = CONSENT_TEXT.split("\n\n");

  assert.equal(painted.length, published.length,
    "the console dropped or merged a paragraph of an agreement it must reproduce exactly");
  published.forEach((paragraph, index) => {
    assert.equal(painted[index], paragraph, `paragraph ${index + 1} was not reproduced verbatim`);
  });

  // Every element is built, never assembled from markup.
  assert.match(fn("renderCreditTopUpConsent"), /document\.createElement\("p"\)/);
  assert.doesNotMatch(fn("renderCreditTopUpConsent"), /innerHTML/);

  // The four disclosures a card network requires are present because the
  // SERVER's text is present — not because the console wrote them. Each is
  // checked against the paragraph that carries it.
  assert.match(painted.join("\n"), /without you present/, "the permission");
  assert.match(painted.join("\n"), /These charges are unscheduled/, "timing and frequency");
  assert.match(painted.join("\n"), /published price of the credit pack you select/, "how the amount is determined");
  assert.match(painted.join("\n"), /turn automatic top-up off at any time/, "cancellation");
});

test("the opt-in ships unticked, and the version the server will record is echoed on screen", () => {
  const { ui } = consentSurface(baseSettings());
  assert.equal(ui.topUpConsentAccept.checked, false,
    "a pre-ticked consent box is not consent, and the server records who agreed");
  assert.equal(ui.topUpConsent.hidden, false);
  assert.match(ui.topUpConsentVersion.textContent, new RegExp(CONSENT_VERSION.replace("/", "\\/")));
  assert.match(ui.topUpConsentVersion.textContent, /records that version, the time, and that it was you/);
});

test("nothing can be armed against terms the server did not publish", () => {
  const { ui, dataStates } = consentSurface(baseSettings({ requiredConsent: { version: "", text: "" } }));
  assert.equal(ui.topUpConsentAccept.disabled, true, "consent must not be givable to an absent agreement");
  assert.equal(dataStates.length, 1);
  assert.equal(dataStates[0].kind, "unavailable");
  assert.match(dataStates[0].why, /cannot be switched on/);
});

test("turning it OFF never demands consent — a customer can always stop an unattended charge", () => {
  const { ui } = consentSurface(baseSettings({ enabled: true }), { enabled: false });
  assert.equal(ui.topUpConsent.hidden, true);
});

test("re-arming and a changed terms version are named as what they are", () => {
  const reArm = consentSurface(baseSettings({ reArmRequired: true })).ui;
  assert.match(reArm.topUpConsentTitle.textContent, /re-arm/i);

  const moved = consentSurface(baseSettings({
    consent: { termsVersion: "auto-topup-terms/v0", recordedAt: { seconds: 1_750_000_000n, nanos: 0 } }
  })).ui;
  assert.match(moved.topUpConsentTitle.textContent, /terms have changed since you last agreed/);
});

/* ---- the submit gate ---------------------------------------------------- */

test("the form refuses to arm without the tick, before the server has to", () => {
  const save = fn("saveCreditTopUp");
  assert.match(save, /if \(enabled && !ui\.topUpConsentAccept\.checked\)/);
  assert.match(save, /cannot be switched on until you agree to the terms/);
  // The version is ECHOED from what the server published, never invented, and
  // only when the request enables.
  assert.match(save, /consentTermsVersion: enabled \? version : ""/);
  assert.match(save, /const version = stringValue\(settings\.requiredConsent\?\.version\)/);
  assert.doesNotMatch(save, /consentTermsVersion: "auto-topup-terms/, "a hard-coded terms version is a forged consent record");
  // A re-arm is sent only when re-arming, and only alongside consent.
  assert.match(save, /reArm: Boolean\(enabled && reArmRequired\)/);
  // Optimistic versioning, so two people editing the policy cannot silently
  // overwrite each other.
  assert.match(save, /expectedVersion: expectedVersion\.toString\(\)/);
  assert.match(save, /idempotencyKey: mutationKeys\.for\("updateCreditTopUp", fingerprint\)/);
});

/* ---- a declined card ---------------------------------------------------- */

test("a stored disarm is blocked, never warning, and says re-enabling will not fix the card", () => {
  const blocks = new Function(`${constant("CREDIT_TOP_UP_BLOCKS")} return CREDIT_TOP_UP_BLOCKS;`)();

  // CARD_DECLINED (2) and AUTHENTICATION_REQUIRED (3) are the two STORED
  // disarms: they persist until the customer acts, so they need a person and
  // rank 0 is the only honest level. A warning would let someone scroll past an
  // organization that has silently stopped refilling itself.
  for (const reason of [2, 3]) {
    assert.equal(blocks[reason].level, "blocked",
      `a stored disarm at reason ${reason} must be blocked — it needs a human`);
  }
  assert.match(blocks[2].body, /will not try it again/, "a decline is terminal, never retried");
  assert.match(blocks[2].body, /Turning this back on will not fix it/,
    "the customer must be told that re-enabling does not clear a declined card");
  assert.match(blocks[2].body, /update the card in Stripe first, then re-arm/);
  assert.match(blocks[3].body, /cannot be completed while you are away/,
    "off-session SCA is a decline, not a pending state");

  // The computed reasons clear by themselves and must NOT shout. A period cap
  // resets with the billing period; a cooldown is what stops a charge loop.
  assert.equal(blocks[4].level, "warning");
  assert.equal(blocks[7].level, "info");
  // The two that need a person but are not stored disarms still need one.
  assert.equal(blocks[5].level, "blocked");
  assert.equal(blocks[6].level, "blocked");

  // Severity is never decided on the screen: every level here is a name from
  // the one ladder.
  const ladder = require("../assets/js/notice-levels.js");
  for (const entry of Object.values(blocks)) {
    assert.ok(ladder.level(entry.level), `${entry.level} is not on the NOTICE_LEVELS ladder`);
  }
});

test("the disarmed state is surfaced as disarmed, not as merely off", () => {
  const render = fn("renderCreditTopUp");
  assert.match(render, /reArmRequired \? "Disarmed"/);
  assert.match(render, /Until you do, nothing is refilled and your teams stop when the pool empties/);
  // The notice is built by the ladder, so its glyph, word and tone come from
  // the one table and it survives filter: grayscale(1).
  assert.match(render, /buildNotice\(\{\s*\n\s*level: block\.level/);
});

test("every top-up state is a ladder level, and a decline is loud", () => {
  const states = new Function(`${constant("CREDIT_TOP_UP_STATES")} return CREDIT_TOP_UP_STATES;`)();
  const ladder = require("../assets/js/notice-levels.js");
  for (const entry of Object.values(states)) {
    assert.ok(ladder.level(entry.level), `${entry.level} is not on the NOTICE_LEVELS ladder`);
    assert.ok(entry.word, "every state carries a WORD, so the row survives greyscale");
  }
  assert.equal(states[4].level, "blocked", "a declined charge needs a person");
  assert.equal(states[5].level, "blocked", "an authentication demand needs a person, on session");
  assert.equal(states[3].level, "success");
  assert.match(states[2].detail, /never charged twice/, "CHARGING means outcome unknown, not charge again");
});

/* ---- the record --------------------------------------------------------- */

test("an automatic charge is distinguishable from one the customer made", () => {
  const row = fn("creditTopUpRow");
  // The ledger reason the server writes is automatic_credit_top_up rather than
  // prepaid_credit_pack, but CreditMovement carries no reason field on the
  // wire — so the distinction is made where it CAN be made: this list is
  // automatic by definition and every row says so, and manual purchases are
  // pointed at their invoice.
  assert.match(row, /Charged automatically/);
  assert.match(shell, /A pack you bought yourself is not here — that is a one-off purchase and it is on your invoice\./);
  // Why it fired, captured at the decision and never recomputed.
  assert.match(row, /pool was \$\{formatCreditMicros\(observed\)\} against a threshold of \$\{formatCreditMicros\(threshold\)\}/);
  // The server's own safe sentence wins over anything written here: it is the
  // only thing that knows the decline.
  assert.match(row, /const safe = stringValue\(record\?\.safeMessage\)/);
  assert.match(row, /if \(safe\) parts\.push\(safe\)/);
  assert.match(row, /ladderBadge\(shape\.word, shape\.level\)/);
});

test("an empty record and an unreadable one are different facts", () => {
  const history = fn("renderCreditTopUpHistory");
  assert.match(history, /setDataState\(empty, "unavailable"/);
  assert.match(history, /setDataState\(empty, "pending"/);
  assert.match(history, /No automatic top-up has ever run/);
  assert.doesNotMatch(history, /No data available/i);
});

/* ---- what a top-up is, and is not --------------------------------------- */

test("a top-up funds the pool and is never sold as a fix for a team's own limit", () => {
  const summary = fn("renderCreditTopUpSummary");
  assert.match(summary, /funds the organization's shared pool/);
  assert.match(summary, /never raises a team's own hard limit/);
  assert.match(summary, /stopped by the ceiling you set for it is stopped on purpose/);
});

test("the balance says where it came from, and guesses at nothing", () => {
  const credits = fn("renderBillingCredits");
  assert.match(credits, /Came from · your plan/);
  assert.match(credits, /Came from · automatic top-ups/);
  assert.match(credits, /Came from · packs you bought/);
  // Adjacency is the point: rendered after "Used this period" these read as a
  // decomposition of what was SPENT, not of the balance. The order is pinned.
  // The array entries, not the prose above them — the comment explaining this
  // rule names the same label and would otherwise match first.
  const balanceAt = credits.indexOf('["Balance now",');
  const cameFrom = credits.indexOf('["Came from · your plan",');
  const usedAt = credits.indexOf('["Used this period",');
  assert.ok(balanceAt !== -1 && cameFrom !== -1 && usedAt !== -1);
  assert.ok(balanceAt < cameFrom && cameFrom < usedAt,
    "the sources of the balance must sit between the balance and the spend, or they read as a breakdown of the spend");
  // Only counted from records actually read; an unavailable record is said to
  // be unavailable rather than counted as none.
  assert.match(credits, /session\.creditTopUpsState !== "loaded"/);
  assert.match(credits, /The automatic top-up record is unavailable, so none is counted\./);
  // The route we cannot total is named and pointed at its evidence rather than
  // guessed at.
  assert.match(credits, /Each one is on an invoice below\./);
});
