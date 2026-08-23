"use strict";

// Spend over time: the design system's chart chrome around a plot the console
// draws itself. Chart.js was never vendored and this page ships style-src
// 'self', so the plot is SVG with geometry in attributes and every colour in a
// class — which is also what makes it follow the theme instead of being painted
// once at draw time.
//
// The load-bearing rule comes from the contract, not from taste.
// ListEconomicsDaily "includes days with no usage as explicit zero buckets" and
// says a client "must never infer a gap as zero or a zero as a gap". A measured
// zero and an absent day are different facts, so they must not look alike and
// must not be produced by the same branch.

const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const css = readFileSync("assets/css/console.css", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");

const render = app.slice(app.indexOf("function renderEconomicsDailyResult"),
  app.indexOf("function renderEconomicsResult"));

test("the day series is reachable from the browser at all", () => {
  // It existed on the contract and on the server the whole time, and was simply
  // absent from the client's procedure list — served, and unreachable.
  assert.match(client, /"economics_daily",/);
  assert.match(client, /case "economics_daily":/);
  assert.match(client, /economics\.listEconomicsDaily\(/);
  // Empty reporting_period means the current subscription period, which is the
  // period every other figure on the screen reports. Asking for a different one
  // would put two periods on one page.
  assert.doesNotMatch(client.slice(client.indexOf('case "economics_daily"'), client.indexOf('case "objectives"')),
    /reportingPeriod/);
});

test("a measured zero and an absent day are drawn differently", () => {
  // Same branch for both would be the bug the contract warns about.
  assert.match(render, /ec-bar ec-bar--zero/, "a zero bucket gets its own mark");
  assert.match(css, /\.ec-bar--zero \{/, "and its own paint");
  // The zero mark keeps the bar's footprint — it is a counted day, so only its
  // height should say nothing happened.
  const zeroRule = css.slice(css.indexOf(".ec-bar--zero"), css.indexOf(".ec-cumulative"));
  assert.doesNotMatch(zeroRule, /display\s*:\s*none/, "a counted zero must still be visible");
  // Nothing may synthesise a day the server did not send.
  assert.doesNotMatch(render, /fill\w*Gap|padDays|for \(let d = /, "days come from the response, never from a loop over a range");
});

test("the four empties are distinct, and none of them is a zero", () => {
  assert.match(render, /"unavailable"\)[\s\S]*?days\.length/, "a failed read is unavailable, before any emptiness check");
  assert.match(render, /resetEconomicsDailyView\([^)]*"pending"\)/, "a period with no metered day yet is pending");
  assert.match(app, /resetEconomicsDailyView\("Loading[^"]*", "loading"\)/, "and loading is its own state");
  // The failure copy must not read as "there was no spend".
  const failure = render.slice(render.indexOf('result.status === "rejected"'), render.indexOf("const days"));
  assert.match(failure, /not a period without spend/i,
    "an unreadable series must not be reported as a period with no spend");
});

test("the plot obeys the page's two hard constraints", () => {
  assert.doesNotMatch(render, /innerHTML|outerHTML|insertAdjacentHTML/, "markup is built, never parsed");
  assert.doesNotMatch(render, /\.style\./, "style-src 'self' forbids element.style; colour lives in classes");
  assert.match(render, /createElementNS|svgEl\(/, "the plot is real SVG");
});

test("the chart says which calendar it is on, and wears the system's chrome", () => {
  // The contract pins buckets to UTC midnight and forbids relabelling them into
  // a local calendar without saying so. This says so.
  assert.match(render, /timeZone: "UTC"/);
  assert.match(render, /days are UTC/);
  for (const cls of ["dn-chart__frame", "dn-chart__head", "dn-chart__title", "dn-chart__body", "dn-chart__legend", "dn-chart__swatch"]) {
    assert.ok(shell.includes(cls), `the frame uses the design system's ${cls}`);
  }
  // The legend describes series; with nothing plotted it would describe nothing.
  assert.match(shell, /data-economics-daily-legend hidden/);
});

test("an emptied summary takes the plot with it", () => {
  // A stale period painted beside a summary that has just said it cannot report
  // is the panel claiming data it does not have.
  const reset = app.slice(app.indexOf("function resetEconomicsView"), app.indexOf("function resetCreditBalanceView"));
  assert.match(reset, /economicsDailyPanel\.hidden = true/);
});
