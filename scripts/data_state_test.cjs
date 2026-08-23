"use strict";

// Empty is four different facts.
//
// The design system ships DataState rather than reusing EmptyState because a
// grey "nothing here" cannot tell a reading that has not started apart from
// one that will never exist — and for a technical reader that difference is
// the whole question. Four kinds, and only one of them is a person's problem:
//
//   pending         wired, not yet flowing        brass, and one action
//   uninstrumented  the span or label is absent   neutral, needs code
//   unavailable     empty by construction         neutral, nothing to fix
//   loading         a query in flight             lumen, a claim about now
//
// The component was vendored with the rest of the system and then sat unused:
// every empty surface in the console reached for the same `.empty-state` box,
// which is the shrug this file exists to keep out.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const views = readFileSync("assets/js/app-views.js", "utf8");
const data = readFileSync("assets/css/ds/components/data/data.css", "utf8");

test("the four kinds are an enum, not four spellings of the same string", () => {
  assert.match(app, /const DATA_STATE_KINDS = Object\.freeze\(\{/);
  for (const [kind, flag] of [
    ["pending", "Pending"],
    ["uninstrumented", "Uninstrumented"],
    ["unavailable", "Unavailable"],
    ["loading", "Loading"],
  ]) {
    assert.match(app, new RegExp(`${kind}: \\{ flag: "${flag}"`), `${kind} is missing from the enum`);
  }
  // Colour is meaning: brass on the one a person can act on, lumen on the one
  // that is a claim about right now, and nothing on the two that are facts.
  assert.match(app, /pending: \{ flag: "Pending", modifier: "dn-dstate--attention" \}/);
  assert.match(app, /loading: \{ flag: "Loading", modifier: "dn-dstate--live" \}/);
  assert.match(app, /uninstrumented: \{ flag: "Uninstrumented", modifier: "" \}/);
  assert.match(app, /unavailable: \{ flag: "Unavailable", modifier: "" \}/);
});

test("only the actionable kind gets a button", () => {
  const builder = app.slice(app.indexOf("function dataState(kind, why, options = {})"), app.indexOf("function setDataState("));
  assert.match(builder, /if \(kind === "pending" && options\.action\?\.label && options\.action\?\.view\)/,
    "a button on an unavailable reading invites pressing something that cannot change the answer");
  // Built, never assembled — the innerHTML ban is the whole file's rule.
  assert.match(builder, /document\.createElement/);
  assert.doesNotMatch(builder, /innerHTML|outerHTML|insertAdjacentHTML/);
  // The action is a door the router did not know about at load, so it must be
  // delegated or it is a button that does nothing.
  assert.match(views, /Doors that did not exist at load/);
  assert.match(views, /document\.addEventListener\("click", \(event\) => \{[\s\S]*closest\("\[data-view-link\]"\)/);
});

test("the design system's own DataState markup is what gets built", () => {
  const builder = app.slice(app.indexOf("function dataState(kind, why, options = {})"), app.indexOf("function setDataState("));
  for (const cls of ["dn-dstate", "dn-dstate__flag", "dn-dstate__why", "dn-dstate__query", "dn-dstate__act"]) {
    assert.ok(builder.includes(cls), `${cls} is in the vendored stylesheet and must be the class that is built`);
    assert.ok(data.includes(`.${cls}`), `${cls} is not in the vendored stylesheet`);
  }
  assert.match(builder, /host\.dataset\.dstate = kind;/, "the kind must be readable off the node it produced");
});

test("nothing anywhere says No data available", () => {
  // The sentence that hides all four kinds behind one shrug. It is banned in
  // the code that could write it and in the markup that could ship it.
  assert.doesNotMatch(app, /No data available/i);
  assert.doesNotMatch(shell, /No data available/i);
  assert.doesNotMatch(views, /No data available/i);
});
