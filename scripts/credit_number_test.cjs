"use strict";

// THE NUMBERS ON THE MONEY SCREENS, AND WHY THEY READ THE WAY THEY DO.
//
// A customer opened billing and saw:
//
//   18,883.403215 credits used, 308,944.522099 left.
//   Measured cost of the work so far: $75.53.
//
// Three separate defects in two lines, and all three are pinned here.
//
//   SIX DECIMAL PLACES. A microcredit is a ledger STORAGE unit — a millionth of
//   a credit, a hundred-millionth of a dollar. The last four places are worth
//   less than a hundredth of a cent and nobody can hold the figure long enough
//   to compare it to anything.
//
//   TWO CURRENCIES, UNLABELLED. The dollar figure was economics.directCost —
//   what the work cost DEEP NAVY at the provider. The ledger converts cost to
//   credits at the published rate (CreditsForCostNanos, ceil(costNanos/4) at the
//   4000bp target), so direct cost and billed credits sit about 2.5x apart. The
//   customer could not tell whether they had spent $75 or $188. They had spent
//   $188.83. Direct cost is now off the customer surfaces entirely, and the
//   money shown is the credits restated at $0.01 each — the same quantity in the
//   other unit, so the two figures cannot disagree.
//
//   A FALSE ZERO. Rounding is not free: a real movement smaller than half a cent
//   must never print as "0", because a zero is a CLAIM ("we counted, there were
//   none") and the design system forbids standing one in for a fact.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");

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
  const start = app.indexOf(`  function ${name}(`);
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

// The shipped formatters, with the money helper's currency pinned so these
// assertions are about rounding rather than about a locale.
const format = new Function("formatCents", `
  ${fn("formatCreditMicros")}
  ${fn("formatCreditMicrosExact")}
  ${fn("formatCreditValue")}
  return { formatCreditMicros, formatCreditMicrosExact, formatCreditValue };
`)((cents) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(cents) / 100));

const { formatCreditMicros, formatCreditMicrosExact, formatCreditValue } = format;

// The live team's own figures, which are what made this readable at all.
const USED = 18_883_403_215n;         // 18,883.403215 credits
const LEFT = 308_944_522_099n;        // 308,944.522099 credits
const PROVISIONING = 18_750_000_000n; // the one-shot team_runtime_month charge
const MODEL_SPEND = 133_403_215n;     // everything the agents actually did

test("the precision follows the scale, so a figure never shows places it cannot mean", () => {
  // At thousands of credits the fraction is noise: 0.000001 credits is
  // 0.0000001 dollars.
  assert.equal(formatCreditMicros(USED), "18,883");
  assert.equal(formatCreditMicros(LEFT), "308,945");
  assert.equal(formatCreditMicros(1_000_000_000n), "1,000");
  // Between one and a thousand credits, a cent's worth of resolution.
  assert.equal(formatCreditMicros(MODEL_SPEND), "133.40");
  assert.equal(formatCreditMicros(999_500_000n), "999.50");
  // Rounding is real rounding, not truncation.
  assert.equal(formatCreditMicros(133_405_000n), "133.41");
  assert.equal(formatCreditMicros(308_944_522_099n), "308,945");
  // The sign survives, as the typographic minus the rest of the console uses.
  assert.equal(formatCreditMicros(-USED), "−18,883");
});

test("a real movement below a cent never rounds down into a zero", () => {
  // This is the design system's rule about zeros, applied to money: a zero is a
  // claim that we counted and found none. A single model call is not none.
  for (const micros of [1n, 100n, 241_235n, 999_999n]) {
    const rendered = formatCreditMicros(micros);
    assert.notEqual(rendered, "0", `${micros} microcredits rendered as a zero`);
    assert.match(rendered, /^0\.[0-9]*[1-9]$/, `${micros} microcredits lost its last significant digit`);
  }
  assert.equal(formatCreditMicros(241_235n), "0.241235");
  assert.equal(formatCreditMicros(100n), "0.0001");
  // And an actual nought is still allowed to say so.
  assert.equal(formatCreditMicros(0n), "0");
});

test("exact stays exact where reconciling against the ledger is the task", () => {
  assert.equal(formatCreditMicrosExact(USED), "18,883.403215");
  assert.equal(formatCreditMicrosExact(LEFT), "308,944.522099");
  assert.equal(formatCreditMicrosExact(PROVISIONING), "18,750");

  // The two surfaces that must not round, and the reason each one cannot.
  const row = app.slice(app.indexOf("function creditMovementRow(movement)"), app.indexOf("// The mockup's live line"));
  assert.match(row, /formatCreditMicrosExact\(/, "the ledger's own rows are the reconciliation surface");
  const summary = app.slice(app.indexOf("function updateCreditControlSummary()"), app.indexOf("async function submitCreditControl"));
  assert.match(summary, /Choose a limit from \$\{formatCreditMicrosExact\(committed\)\} to \$\{formatCreditMicrosExact\(prepaidCeiling\)\}/,
    "the bounds are enforced to the microcredit; a rounded ceiling is a number the field then refuses");
});

test("the money beside the credits is those credits, not our cost of goods", () => {
  // 1 credit = $0.01 by definition, so this is an exact restatement and the two
  // figures on screen can never disagree.
  assert.equal(formatCreditValue(USED), "$188.83");
  assert.equal(formatCreditValue(LEFT), "$3,089.45");
  assert.equal(formatCreditValue(PROVISIONING), "$187.50");
  assert.equal(formatCreditValue(MODEL_SPEND), "$1.33");
  assert.equal(formatCreditValue(0n), "$0.00");
  assert.equal(formatCreditValue(-USED), "−$188.83");
  // Sub-cent spend is described, never rendered as $0.00 — the same false-zero
  // rule the credit formatter follows.
  assert.equal(formatCreditValue(241_235n), "less than $0.01");

  // 18,883 credits is $188.83, and the direct cost the panel used to print
  // beside it was about $75. Pinning the ratio is what stops a cost_nanos
  // figure creeping back in wearing a dollar sign.
  assert.equal(formatCreditValue(USED), "$188.83",
    "the customer's money is credits x $0.01, never CreditsForCostNanos' input");
});

test("our measured direct cost is gone from every customer surface", () => {
  for (const gone of [
    /formatCanonicalMoney\(economics\.directCost\)/,
    /formatCanonicalMoney\(record\.directCost\)/,
    /economicsDirectCost/,
    /measured cost/,
    /Measured cost of the work so far/
  ]) {
    assert.doesNotMatch(app, gone, `a direct-cost surface survived: ${gone}`);
  }
  assert.doesNotMatch(shell, /Attributable cost/);
  // What replaced it, labelled in the UI and not only in the source.
  assert.match(shell, /<dt>What that is in money<\/dt>/);
});

test("the breakdown explains why its largest line is largest, from the rows themselves", () => {
  const note = fn("renderEconomicsBreakdownNote");
  // Computed from what is on screen, so it cannot go stale when a team's shape
  // of spend changes.
  assert.match(note, /leaderMicros \* 1000n/);
  assert.match(note, /charged once, not per unit of work/);
  // It stays quiet when there is nothing to say: one row is not a distribution,
  // and a leader under a third of the total is not a story.
  assert.match(note, /records\.length < 2/);
  assert.match(note, /share < 33/);
  // And only on the dimension that can answer the question.
  assert.match(note, /definition\.key !== "operation"/);
});
