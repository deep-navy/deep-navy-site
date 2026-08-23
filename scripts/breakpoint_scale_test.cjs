"use strict";

// Three breakpoints, no others: 1200 · 900 · 600.
//
// Before the scale existed this site folded at 1180, 1040, 1000, 980, 960,
// 900, 860, 840, 800, 720 and 620 — eleven ad-hoc widths, which meant the
// same layout broke at a different place on every surface. Every width
// query must now land on one of the three system stops, so a reader
// resizing a window sees the whole page fold together.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const ALLOWED = new Set([1200, 900, 600]);
const FILES = ["assets/css/main.css", "assets/css/home.css"];

test("every @media width query sits on the 1200/900/600 scale", () => {
  const offenders = [];
  for (const file of FILES) {
    const css = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const lines = css.split("\n");
    lines.forEach((line, i) => {
      for (const match of line.matchAll(/@media[^\{]*/g)) {
        for (const width of match[0].matchAll(/(min-width|max-width)\s*:\s*([\d.]+)px/g)) {
          const px = Number(width[2]);
          if (!ALLOWED.has(px)) offenders.push(`${file}:${i + 1} ${width[1]}: ${px}px`);
        }
      }
    });
  }
  assert.deepEqual(offenders, [],
    `width queries off the 1200/900/600 scale:\n  ${offenders.join("\n  ")}`);
});

test("the shell is the desktop breakpoint", () => {
  const tokens = readFileSync("assets/css/tokens.css", "utf8");
  assert.match(tokens, /--shell:\s*1200px;/,
    "--shell must be 1200px so the content column and the first fold agree");
});
