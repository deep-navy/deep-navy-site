"use strict";

// Third-party identity marks are the one place in this product where our own
// taste is not welcome. GitHub's guidelines forbid altering the logo — "compress
// distort, skew, stretch, or alter the logo in any way" — and the mark we
// shipped for months was a simplified Octocat, 571 characters against the
// official Invertocat's 721. It read as very slightly wrong to anyone who knows
// the logo, which is the worst possible outcome on a sign-in control: the exact
// moment a customer is deciding whether to trust us with their repositories.
//
// The path below is GitHub's own mark-github-16 from primer/octicons, verbatim.
// If it needs changing, take it from GitHub, do not redraw it.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const OFFICIAL_INVERTOCAT_16 =
  "M6.766 11.328c-2.063-.25-3.516-1.734-3.516-3.656 0-.781.281-1.625.75-2.188-.203-.515-.172-1.609.063-2.062.625-.078 1.468.25 1.968.703.594-.187 1.219-.281 1.985-.281.765 0 1.39.094 1.953.265.484-.437 1.344-.765 1.969-.687.218.422.25 1.515.046 2.047.5.593.766 1.39.766 2.203 0 1.922-1.453 3.375-3.547 3.64.531.344.89 1.094.89 1.954v1.625c0 .468.391.734.86.547C13.781 14.359 16 11.53 16 8.03 16 3.61 12.406 0 7.984 0 3.563 0 0 3.61 0 8.031a7.88 7.88 0 0 0 5.172 7.422c.422.156.828-.125.828-.547v-1.25c-.219.094-.5.156-.75.156-1.031 0-1.64-.562-2.078-1.609-.172-.422-.36-.672-.719-.719-.187-.015-.25-.093-.25-.187 0-.188.313-.328.625-.328.453 0 .844.281 1.25.86.313.452.64.655 1.031.655s.641-.14 1-.5c.266-.265.47-.5.657-.656";

const SURFACES = ["_includes/header.html", "_includes/app-shell.html"];

test("every GitHub mark is the official Invertocat, unaltered", () => {
  let seen = 0;
  for (const path of SURFACES) {
    const markup = readFileSync(path, "utf8");
    for (const match of markup.matchAll(/class="github-mark"[^>]*>\s*<path[^>]*\sd="([^"]+)"/g)) {
      assert.equal(match[1], OFFICIAL_INVERTOCAT_16, `${path} carries a mark that is not GitHub's`);
      seen += 1;
    }
  }
  assert.ok(seen >= 3, `expected the mark on at least 3 surfaces, found ${seen}`);
});

test("the mark keeps a permitted colour and is never stretched", () => {
  // GitHub permits white, black, and in a few cases grey or green. The button
  // paints it with currentColor over --accent, which resolves to the ink
  // extreme in both themes — #0a0a0a on light, #f5f5f5 on dark. What must not
  // happen is a hue creeping in behind it, or the viewBox drifting off square.
  for (const path of SURFACES) {
    const markup = readFileSync(path, "utf8");
    for (const match of markup.matchAll(/class="github-mark"([^>]*)>\s*<path([^>]*)>/g)) {
      assert.match(match[1], /viewBox="0 0 16 16"/, `${path}: the mark must stay square`);
      assert.match(match[2], /fill="currentColor"/, `${path}: the mark takes the button's ink`);
    }
  }
  const css = readFileSync("assets/css/main.css", "utf8");
  assert.match(css, /\.button-github\s*\{[^}]*background:\s*var\(--accent\)/,
    "the mark sits on the ink extreme, never on a hue");
});
