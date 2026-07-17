"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");
const vm = require("node:vm");

const source = readFileSync("assets/js/callback-scrubber.js", "utf8");

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
