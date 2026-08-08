"use strict";

// Syntax-check the scripts that ship inline in <head>.
//
// They are inline because a render-blocking external script there blanks the
// whole page if its request stalls. That moved them out of the file list
// `node --check` walks, so check them here instead - a syntax error in either
// one breaks the app before any other script runs.

const { readFileSync } = require("node:fs");
const vm = require("node:vm");

const sources = ["_includes/head.html", "_layouts/app.html"];
let checked = 0;
let failed = 0;

for (const path of sources) {
  const markup = readFileSync(path, "utf8").replace(
    /\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g,
    ""
  );
  const blocks = [...markup.matchAll(/<script(?![^>]*\ssrc=)([^>]*)>([\s\S]*?)<\/script>/g)];
  for (const [, attributes, body] of blocks) {
    if (/application\/ld\+json/.test(attributes)) continue;
    if (/\{[%{]/.test(body)) {
      console.error(`FAIL ${path}: inline script contains Liquid; its CSP hash could not be stable`);
      failed += 1;
      continue;
    }
    try {
      new vm.Script(body);
      checked += 1;
    } catch (error) {
      console.error(`FAIL ${path}: ${error.message}\n${body.slice(0, 120)}`);
      failed += 1;
    }
  }
}

if (checked === 0) {
  console.error("FAIL: expected inline pre-paint scripts, found none");
  process.exit(1);
}
if (failed > 0) {
  process.exit(1);
}
console.log(`Checked ${checked} inline script(s) in ${sources.length} template(s).`);
