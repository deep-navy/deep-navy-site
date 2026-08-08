"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

// The scrubber is inline in the app layout rather than an external file: a
// render-blocking <script src> in <head> blanks the whole page if its request
// stalls. Extract the block from the layout so this still tests the code that
// actually ships, and fail loudly if it is moved again.
// Liquid comments in the layout discuss script tags in prose, so strip them
// before matching or the prose is mistaken for markup.
const layout = readFileSync("_layouts/app.html", "utf8").replace(
  /\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g,
  ""
);
const inlineBlocks = [...layout.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(
  (match) => match[1]
);
const source = inlineBlocks.find((block) => block.includes("deepNavyInitialQuery"));
assert.ok(
  source,
  "no inline callback-scrubber block found in _layouts/app.html; if it moved, point this test at its new home"
);

test("callback query is captured non-enumerably and removed from address history before app assets load", () => {
  const replacements = [];
  const window = {
    location: {
      search: "?code=one-time-code&state=opaque-state",
      pathname: "/deep-navy-site/app/github/callback/",
      hash: "#continue"
    },
    history: {
      replaceState(state, title, url) { replacements.push({ state, title, url }); }
    }
  };

  vm.runInNewContext(source, { window });

  assert.equal(window.deepNavyInitialQuery, "?code=one-time-code&state=opaque-state");
  assert.equal(Object.prototype.propertyIsEnumerable.call(window, "deepNavyInitialQuery"), false);
  assert.equal(replacements.length, 1);
  assert.deepEqual(Object.keys(replacements[0].state), []);
  assert.equal(replacements[0].title, "");
  assert.equal(replacements[0].url, "/deep-navy-site/app/github/callback/#continue");
  assert.doesNotMatch(replacements[0].url, /code|state|\?/);
});
