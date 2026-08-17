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

// /app/github/callback/ stamps data-github-callback on every load, not only the
// one that carries GitHub's handoff. Once the one-time parameters were stripped
// a plain reload was still treated as a callback with nothing to parse, so it
// answered "Sign-in was not completed", restarted the GitHub round trip, and
// came back to the same bare URL - a loop with no exit but clearing site data.
test("a callback page load with no handoff leaves instead of failing", () => {
  const source = readFileSync("assets/js/app.js", "utf8");
  assert.match(source, /const carriesCallback = callbackParams\.has\("code"\) \|\| callbackParams\.has\("state"\)/);
  assert.match(source, /callbackParams\.has\("installation_id"\) \|\| callbackParams\.has\("setup_action"\)/);
  // Nothing to receive: go to the app, which decides workspace or homepage.
  assert.match(
    source,
    /if \(document\.body\.dataset\.githubCallback === "true" && !carriesCallback\) \{\s*\n\s*window\.location\.replace\(new URL\("\.\.\/\.\.\/", window\.location\.href\)/,
    "a bare callback load must leave the page rather than report a failed sign-in"
  );
  // ...and the stamp alone no longer makes a load a callback.
  assert.doesNotMatch(
    source,
    /const githubCallback = document\.body\.dataset\.githubCallback === "true" \|\|/,
    "the page stamp alone still marks any load as a callback"
  );
  assert.match(source, /const githubCallback = \(document\.body\.dataset\.githubCallback === "true" && carriesCallback\)/);
});
