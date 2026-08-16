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
// The fourth incident of this class was subtler and worse: the objective form
// left the shell, its listeners were dutifully guarded — and every RENDER
// path that wrote to the removed elements kept dereferencing null. The old
// version of this test could not see it, for two reasons: it only parsed
// double-quoted querySelector arguments (the objective inputs used single
// quotes), and it only looked at top-level bail-outs and addEventListener
// statements, never at property writes inside render/reset functions. So
// npm test stayed green while every workspace render, team delete, and
// sign-out died on `ui.objectiveTitleInput.disabled = true`.
//
// So now: for EVERY entry in the ui map whose element no longer exists in the
// shell+layout markup, EVERY property access or method call on it — at any
// depth, not just statement position — must be guarded (inside an
// `if (ui.<key>)` window, behind an `if (!ui.<key>) return;` bail, behind a
// same-statement `ui.<key> &&` / `ui.<key> ?` short-circuit, or
// optional-chained). Helpers that receive the element as a bare argument are
// out of scope here; they must be null-safe themselves (setEmptyState,
// setFieldError, setSourceState are).

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

// ui: { name: document.querySelector("[data-thing]"), ... } — BOTH quote
// styles: the single-quoted selectors are exactly where the last incident hid.
function uiSelectorMap(source) {
  const map = new Map();
  const pattern = /(\w+):\s*document\.querySelector\(\s*(?:"([^"]+)"|'([^']+)')\s*\)/g;
  for (const match of source.matchAll(pattern)) map.set(match[1], match[2] ?? match[3]);
  return map;
}

// The selector's leading data attribute — the thing whose presence in markup
// decides whether the element can exist at all. For descendant selectors like
// `[data-objective-form] input[name="objectiveTitle"]` that is the ancestor
// attribute: if it is gone, every descendant lookup is null too.
function leadingAttribute(selector) {
  const match = /^\[([a-zA-Z0-9_-]+)/.exec(selector.trim());
  return match ? match[1] : null;
}

function markupHasAttribute(attribute) {
  // Boundary so data-team never matches data-team-list.
  return new RegExp(`${attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`).test(appDOM);
}

// ── A tiny lexer so range math cannot be fooled by strings or comments ──────
// Replaces the CONTENTS of string literals, template literals (keeping the
// code inside ${…} interpolations), and comments with spaces, preserving
// every index and newline. Regex literals are not modeled; app.js has none
// containing quotes or unbalanced braces, and a `//` inside one only blanks
// the remainder of its own line.
function sanitize(source) {
  const out = source.split("");
  const blank = (i) => { if (out[i] !== "\n") out[i] = " "; };
  let i = 0;
  const n = source.length;
  // state stack entries: "sq" | "dq" | "tpl" | "line" | "block" | "interp"
  const stack = [];
  const top = () => stack[stack.length - 1];
  while (i < n) {
    const c = source[i];
    const next = source[i + 1];
    const state = top();
    if (state === "sq" || state === "dq") {
      if (c === "\\") { blank(i); blank(i + 1); i += 2; continue; }
      if ((state === "sq" && c === "'") || (state === "dq" && c === '"')) { blank(i); stack.pop(); i += 1; continue; }
      blank(i); i += 1; continue;
    }
    if (state === "tpl") {
      if (c === "\\") { blank(i); blank(i + 1); i += 2; continue; }
      if (c === "`") { blank(i); stack.pop(); i += 1; continue; }
      if (c === "$" && next === "{") { blank(i); blank(i + 1); stack.push("interp"); i += 2; continue; }
      blank(i); i += 1; continue;
    }
    if (state === "line") {
      if (c === "\n") { stack.pop(); i += 1; continue; }
      blank(i); i += 1; continue;
    }
    if (state === "block") {
      if (c === "*" && next === "/") { blank(i); blank(i + 1); stack.pop(); i += 2; continue; }
      blank(i); i += 1; continue;
    }
    // code (possibly inside a template interpolation)
    if (c === "'") { blank(i); stack.push("sq"); i += 1; continue; }
    if (c === '"') { blank(i); stack.push("dq"); i += 1; continue; }
    if (c === "`") { blank(i); stack.push("tpl"); i += 1; continue; }
    if (c === "/" && next === "/") { blank(i); blank(i + 1); stack.push("line"); i += 2; continue; }
    if (c === "/" && next === "*") { blank(i); blank(i + 1); stack.push("block"); i += 2; continue; }
    if (state === "interp" && c === "}") { blank(i); stack.pop(); i += 1; continue; }
    i += 1;
  }
  return out.join("");
}

const lineOf = (source, index) => source.slice(0, index).split("\n").length;

// Matching close paren / close brace on sanitized source.
function matchForward(source, openIndex, open, close) {
  let depth = 0;
  for (let i = openIndex; i < source.length; i += 1) {
    if (source[i] === open) depth += 1;
    else if (source[i] === close) { depth -= 1; if (depth === 0) return i; }
  }
  return -1;
}

// Guarded ranges for one ui key, from the sanitized source:
//  (a) `if (…ui.key…) { block }` / `if (…ui.key…) statement;` where the
//      condition holds ui.key as a truthy term → the block/statement.
//  (b) `if (!ui.key || …) return|throw …;` (no `&&` in the condition) → from
//      the end of that statement to the end of the enclosing brace block.
function guardRanges(sanitized, key) {
  const ranges = [];
  const truthy = new RegExp(`(?<![!\\w$.])ui\\.${key}\\b`);
  const negated = new RegExp(`!ui\\.${key}\\b`);
  for (const match of sanitized.matchAll(/\bif\s*\(/g)) {
    const openParen = match.index + match[0].length - 1;
    const closeParen = matchForward(sanitized, openParen, "(", ")");
    if (closeParen === -1) continue;
    const condition = sanitized.slice(openParen + 1, closeParen);
    const after = sanitized.slice(closeParen + 1);
    const afterOffset = closeParen + 1;
    if (truthy.test(condition)) {
      const brace = /^\s*\{/.exec(after);
      if (brace) {
        const openBrace = afterOffset + brace[0].length - 1;
        const closeBrace = matchForward(sanitized, openBrace, "{", "}");
        if (closeBrace !== -1) ranges.push([openBrace, closeBrace]);
      } else {
        const semi = after.indexOf(";");
        if (semi !== -1) ranges.push([afterOffset, afterOffset + semi]);
      }
      continue;
    }
    if (negated.test(condition) && !condition.includes("&&") && /^\s*\{?\s*(return|throw)\b/.test(after)) {
      // Find the end of the bail statement…
      let bailEnd;
      const brace = /^\s*\{/.exec(after);
      if (brace) bailEnd = matchForward(sanitized, afterOffset + brace[0].length - 1, "{", "}");
      else bailEnd = afterOffset + after.indexOf(";");
      if (bailEnd === -1 || bailEnd < afterOffset) continue;
      // …then the end of the enclosing block: everything after the bail, up
      // to the close of the innermost brace open at the `if`, is guarded.
      let depth = 0;
      let enclosingClose = -1;
      for (let i = match.index; i < sanitized.length; i += 1) {
        if (sanitized[i] === "{") depth += 1;
        else if (sanitized[i] === "}") { depth -= 1; if (depth < 0) { enclosingClose = i; break; } }
      }
      if (enclosingClose !== -1) ranges.push([bailEnd, enclosingClose]);
    }
  }
  return ranges;
}

// A same-statement short-circuit: `ui.key && …use…` or `ui.key ? …use…`.
function shortCircuited(sanitized, key, useIndex) {
  let start = useIndex;
  while (start > 0 && !";{}".includes(sanitized[start - 1])) start -= 1;
  const preceding = sanitized.slice(start, useIndex);
  return new RegExp(`(?<![!\\w$.])ui\\.${key}\\b\\s*(&&|\\?(?!\\.))`).test(preceding);
}

function unguardedUses(source, sanitized, key) {
  const ranges = guardRanges(sanitized, key);
  const inRange = (i) => ranges.some(([a, b]) => i >= a && i <= b);
  const uses = [];
  // Property access or method call; `ui.key?.…` never matches (the `?` is
  // neither whitespace nor `.`/`[`), so optional chaining passes.
  const usePattern = new RegExp(`\\bui\\.${key}\\b\\s*[.\\[]`, "g");
  for (const match of sanitized.matchAll(usePattern)) {
    if (inRange(match.index)) continue;
    if (shortCircuited(sanitized, key, match.index)) continue;
    uses.push({ line: lineOf(source, match.index), text: source.slice(match.index, match.index + 60).split("\n")[0] });
  }
  return uses;
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
    // Keys whose absence the code explicitly tolerates (an `if (!ui.x) return;`
    // inside a handler) are exactly the guarded ones — the bootstrap-level
    // bail-outs are the top-level `return`s, which kill the whole module.
    // Only those keyed on elements genuinely absent from the markup are fatal.
    const attribute = leadingAttribute(selector);
    if (!attribute) continue;
    if (markupHasAttribute(attribute)) continue;
    // Absent from markup: fatal only if the bail-out is at the IIFE top level.
    // A guard inside a function is the pattern this suite REQUIRES, so do not
    // flag it — the unguarded-use test below owns per-use enforcement.
    const topLevelBail = new RegExp(`^  if \\(![^)]*\\bui\\.${key}\\b[^)]*\\)\\s*return;`, "m");
    assert.ok(
      !topLevelBail.test(app),
      `app.js aborts its whole bootstrap when ui.${key} (${selector}) is missing, ` +
      `but the markup no longer contains ${attribute}. Every load of ` +
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
  const selectors = uiSelectorMap(app);
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
    const attribute = leadingAttribute(selector);
    if (!attribute) continue;
    assert.ok(
      markupHasAttribute(attribute),
      `app.js attaches a listener to ui.${key} (${selector}) unguarded at the top level, ` +
      `but the shell no longer contains ${attribute}. That throws on null and freezes the ` +
      `entire app at "Checking environment configuration" - guard it with if (ui.${key}) ` +
      `or restore the markup.`
    );
  }
});

// The fourth incident's whole class: markup leaves the shell, the ui map
// entry goes null, and any property write or method call on it — at any
// depth, in any render/reset/handler function — throws TypeError at runtime
// while this suite stays green. For every ui key whose element the markup no
// longer ships, every `ui.<key>.…` use must sit behind a guard.
test("every property access on a ui element the shell no longer ships is guarded", () => {
  const selectors = uiSelectorMap(app);
  assert.ok(selectors.size > 100, `expected to parse the full ui map (got ${selectors.size} entries) — both quote styles`);
  // Regression pin for the incident that motivated this: the single-quoted
  // objective-form descendants must be part of the scanned map.
  assert.ok(selectors.has("objectiveTitleInput"), "single-quoted querySelector arguments must be parsed");

  const sanitized = sanitize(app);
  const problems = [];
  for (const [key, selector] of selectors) {
    const attribute = leadingAttribute(selector);
    if (!attribute) continue;
    if (markupHasAttribute(attribute)) continue;
    for (const use of unguardedUses(app, sanitized, key)) {
      problems.push(`ui.${key} (${selector}) is null — ${attribute} is not in the shell/layout — ` +
        `but app.js line ${use.line} dereferences it unguarded: \`${use.text.trim()}\`. ` +
        `Guard it with if (ui.${key}), optional-chain it, or restore the markup.`);
    }
  }
  assert.deepEqual(problems, [], `${problems.length} unguarded null dereference(s):\n${problems.join("\n")}`);
});
