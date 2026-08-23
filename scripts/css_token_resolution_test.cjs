"use strict";

// A custom property that resolves to nothing does not error — the
// declaration it sits in is silently discarded, which is how an intended
// border or status colour simply vanishes. This happened twice before the
// checker existed (--aqua-dim and --warning). So: every var() reference in
// every stylesheet must either resolve to a definition somewhere in the
// cascade or carry an explicit fallback, and every definition's own value
// must resolve too.

const assert = require("node:assert/strict");
const { readFileSync, readdirSync } = require("node:fs");
const test = require("node:test");

// The vendored design system is in the search path for both directions: its
// own var() references have to resolve, and — since it loads between tokens.css
// and main.css on /app/ — it is also where some of the names the site consumes
// are now defined. Leave it out and a legitimate reference reads as a missing
// token, or a dead one in ds/ goes unnoticed.
const FILES = [
  "assets/css/tokens.css",
  "assets/css/type.css",
  "assets/css/ds.css",
  ...readdirSync("assets/css/ds/tokens").sort().map((f) => `assets/css/ds/tokens/${f}`),
  ...readdirSync("assets/css/ds/components", { recursive: true })
    .filter((f) => f.endsWith(".css")).sort().map((f) => `assets/css/ds/components/${f}`),
  "assets/css/main.css",
  "assets/css/console.css",
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
