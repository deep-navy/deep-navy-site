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
// The app's DOM is the shell include PLUS the layout chrome (header, pills);
// elements like the sign-out control live in the layout, and a listener
// check that reads only the include would cry wolf on them.
const layout = readFileSync("_layouts/app.html", "utf8");
const appDOM = shell + layout;

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

// The third frozen-shell incident was not the bail-out guard but an orphaned
// listener: markup removed from the shell while its top-level
// addEventListener stayed unguarded, throwing TypeError on null and killing
// the bootstrap just as thoroughly as the early return did. So: every
// ui.<name>.addEventListener at statement position must either be guarded
// (inside "if (ui.<name>)") or target an element the shell still ships.
test("no top-level listener targets an element the shell no longer ships", () => {
  const selectors = new Map();
  for (const match of app.matchAll(/(\w+):\s*document\.querySelector\(\s*"(\[[^"]+\])"\s*\)/g)) {
    selectors.set(match[1], match[2]);
  }
  // Unguarded form: line begins with optional whitespace then ui.<name>.addEventListener
  for (const match of app.matchAll(/^[ \t]*ui\.(\w+)\.addEventListener\(/gm)) {
    const key = match[1];
    const selector = selectors.get(key);
    if (!selector) continue;
    // A listener wrapped in an if (ui.<key>) block is guarded even though the
    // call itself starts its own line - look back a short window for the
    // guard before crying wolf.
    const preceding = app.slice(Math.max(0, match.index - 300), match.index);
    if (preceding.includes(`if (ui.${key})`)) continue;
    const attribute = selector.slice(1, -1).split("=")[0];
    assert.ok(
      appDOM.includes(attribute),
      `app.js attaches a listener to ui.${key} (${selector}) unguarded at the top level, ` +
      `but the shell no longer contains ${attribute}. That throws on null and freezes the ` +
      `entire app at "Checking environment configuration" - guard it with if (ui.${key}) ` +
      `or restore the markup.`
    );
  }
});
