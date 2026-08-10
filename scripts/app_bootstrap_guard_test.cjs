"use strict";

// app.js opens with one IIFE and bails early when the page is not the app
// shell. That guard is keyed on an element it looks up by data attribute, and
// if the attribute stops existing in the markup the guard fires on EVERY load:
// a bare `return` at the top level of the IIFE exits the whole module. Nothing
// throws, nothing reaches the console, no request is sent. The page still
// renders, because the shell is server-rendered — so the customer sees a
// plausible screen that is simply frozen at whatever the HTML hardcodes.
//
// That is exactly how deleting the [data-sign-in] button took sign-in down
// while every other check stayed green: the file was deployed, the pods were
// healthy, the CSS was live, and the app was dead on arrival.
//
// So: every element the bootstrap treats as mandatory has to exist in the
// shell. This reads the guard out of the source rather than hardcoding a list,
// so it keeps working when the guard is rewritten.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");

// ui: { name: document.querySelector("[data-thing]"), ... }
function uiSelectorMap(source) {
  const map = new Map();
  const pattern = /(\w+):\s*document\.querySelector\(\s*"(\[[^"]+\])"\s*\)/g;
  for (const match of source.matchAll(pattern)) map.set(match[1], match[2]);
  return map;
}

// The top-level bail-outs: `if (!ui.a || !ui.b) return;` and `if (!ui.a) return;`
function guardedUiKeys(source) {
  const keys = new Set();
  const pattern = /if\s*\(([^)]*?\bui\.\w+[^)]*?)\)\s*return;/g;
  for (const match of source.matchAll(pattern)) {
    const condition = match[1];
    if (!condition.includes("!ui.")) continue;
    for (const ref of condition.matchAll(/!ui\.(\w+)/g)) keys.add(ref[1]);
  }
  return keys;
}

test("every element the app bootstrap requires exists in the shell", () => {
  const selectors = uiSelectorMap(app);
  const guarded = guardedUiKeys(app);

  assert.ok(guarded.size > 0, "expected app.js to guard its bootstrap on at least one element");

  for (const key of guarded) {
    const selector = selectors.get(key);
    if (!selector) continue; // not a [data-*] lookup; nothing to check against markup
    const attribute = selector.slice(1, -1).split("=")[0];
    assert.ok(
      shell.includes(attribute),
      `app.js aborts its whole bootstrap when ui.${key} (${selector}) is missing, ` +
      `but _includes/app-shell.html no longer contains ${attribute}. Every load of ` +
      `the app would return out of app.js before sending a single request, while ` +
      `still rendering the server-side shell — a page that looks fine and does nothing.`
    );
  }
});

test("the bootstrap guard does not depend on the deleted sign-in button", () => {
  // Sign-in moved to the homepage; the app ships no sign-in button at all. A
  // guard keyed on it can only ever be false.
  assert.doesNotMatch(app, /if\s*\(!ui\.signIn\)\s*return;/);
  assert.doesNotMatch(shell, /data-sign-in\b/);
});
