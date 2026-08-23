"use strict";

// A custom property that resolves to nothing does not error — the
// declaration it sits in is silently discarded, which is how an intended
// border or status colour simply vanishes. This happened twice before the
// checker existed (--aqua-dim and --warning). So: every var() reference in
// every stylesheet must either resolve to a definition somewhere in the
// cascade or carry an explicit fallback, and every definition's own value
// must resolve too.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const FILES = [
  "assets/css/tokens.css",
  "assets/css/type.css",
  "assets/css/main.css",
  "assets/css/home.css",
];

const sheets = FILES.map((file) => ({
  file,
  css: readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, ""),
}));

// Every custom property defined anywhere in the cascade (any scope: :root,
// theme blocks, .app-body, .lp — scoping is the author's concern; existence
// is this file's concern).
const defined = new Set();
for (const { css } of sheets) {
  for (const def of css.matchAll(/(--[a-z0-9-]+)\s*:/gi)) defined.add(def[1]);
}

test("every var() reference resolves to a definition or carries a fallback", () => {
  const missing = [];
  for (const { file, css } of sheets) {
    const lines = css.split("\n");
    lines.forEach((line, i) => {
      for (const ref of line.matchAll(/var\(\s*(--[a-z0-9-]+)\s*(,)?/gi)) {
        const [, name, fallback] = ref;
        if (!defined.has(name) && !fallback) missing.push(`${file}:${i + 1} ${name}`);
      }
    });
  }
  assert.deepEqual(missing, [],
    `tokens referenced but never defined (their declarations are being discarded):\n  ${missing.join("\n  ")}`);
});

test("no custom property is defined as a reference to itself", () => {
  // `--x: var(--x)` is a cycle; CSS throws the whole custom property away,
  // silently unsetting every rule that consumes it.
  const cycles = [];
  for (const { file, css } of sheets) {
    for (const def of css.matchAll(/(--[a-z0-9-]+)\s*:\s*var\(\s*(--[a-z0-9-]+)\s*\)/gi)) {
      if (def[1] === def[2]) cycles.push(`${file}: ${def[1]}`);
    }
  }
  assert.deepEqual(cycles, [], `self-referential tokens:\n  ${cycles.join("\n  ")}`);
});
