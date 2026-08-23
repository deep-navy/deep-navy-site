"use strict";

// "Every icon animates — there are no still icons in this system."
//
// The design system says that in its own words, and for a long time this site did not do
// it: ds.css dropped the icons-motion layer on the reasoning that a sprite could not carry
// it. The layer is back, and these tests exist because every way it can regress is silent.
// Nothing here throws at runtime. A dropped @import, a class nobody applies, a keyframe
// pointed at an element that is not there, a token that resolves to nothing — each one
// leaves a console that renders perfectly and simply never moves, with no error to find.
//
// Four things are pinned:
//
//   the layer is IMPORTED           — it arrives through core/core.css, one level below
//                                     ds.css, which is exactly where a re-vendor loses it
//   every family is RE-POINTED      — the vendored selectors expect the system's wrapper
//                                     DOM and match nothing over a sprite until they are
//   every glyph RESOLVES            — including one nobody has added yet
//   every shape carries pathLength  — without which draw runs, and draws dots

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const iconMotion = require("../assets/js/icon-motion.js");

const vendored = readFileSync("assets/css/ds/components/core/icons-motion.css", "utf8");
const core = readFileSync("assets/css/ds/components/core/core.css", "utf8");
const dsEntry = readFileSync("assets/css/ds.css", "utf8");
const adapter = readFileSync("assets/css/icon-motion.css", "utf8");
const dsMotion = readFileSync("assets/css/ds/tokens/motion.css", "utf8");
const tokens = readFileSync("assets/css/tokens.css", "utf8");
const sprite = readFileSync("_includes/icons.svg", "utf8");
const head = readFileSync("_includes/head.html", "utf8");
const appLayout = readFileSync("_layouts/app.html", "utf8");
const defaultLayout = readFileSync("_layouts/default.html", "utf8");
const app = readFileSync("assets/js/app.js", "utf8");
const site = readFileSync("assets/js/site.js", "utf8");

const FAMILIES = ["draw", "spin", "ring", "hop", "nudge", "pop", "jitter"];

const spriteIds = [...sprite.matchAll(/<symbol id="i-([a-z0-9-]+)"/g)].map((match) => match[1]);

/* ---- the layer is there, and it is the system's own bytes --------------- */

test("the vendored icon-motion layer is imported, not dropped", () => {
  // The design system's own core.css opens with this line. It was stripped when the tree
  // was first vendored, which is how the whole vocabulary went missing without a diff to
  // point at — ds.css imports core.css, and core.css is where the trail ended.
  assert.match(core, /^@import "icons-motion\.css";/,
    "ds/components/core/core.css no longer imports the icon motion layer — every icon in the console just went still");

  // And the entry point must not claim otherwise. The old header said the site kept
  // "inline-SVG icons" and skipped this layer; a stale comment is how the next person
  // decides the omission was deliberate.
  assert.ok(!/no brand\/ or icons-motion imports/.test(dsEntry),
    "ds.css still documents the icons-motion layer as deliberately omitted");
});

test("the vocabulary is seven families, and the site adds none of its own", () => {
  for (const family of FAMILIES) {
    assert.ok(vendored.includes(`dn-i-${family}`) || family === "spin",
      `the vendored layer has no dn-i-${family} keyframe`);
  }
  // spin is the one family whose loop reuses the system's own dn-spin rather than a
  // dn-i- keyframe of its own, so it is checked against both sources.
  assert.match(vendored, /@keyframes dn-i-spin\b/);
  assert.match(dsMotion, /@keyframes dn-spin\b/);

  // Keyframes belong to the design system. The adapter re-points selectors and nothing
  // else; the moment it declares a keyframe, the two sites can drift apart.
  const declarations = adapter.replace(/\/\*[\s\S]*?\*\//g, "");
  assert.ok(!/@keyframes/.test(declarations),
    "assets/css/icon-motion.css declares a keyframe — the vocabulary lives in ds/, this file only re-points it");
});

test("every duration and easing the layer names is defined", () => {
  const referenced = [...vendored.matchAll(/var\((--[a-z0-9-]+)\)/g)].map((match) => match[1]);
  assert.ok(referenced.length > 0, "the layer stopped using tokens");
  // The console resolves them from ds/tokens/motion.css; the marketing pages, which do not
  // load ds.css at all, resolve them from tokens.css. Both have to carry every one, or the
  // animation is handed an invalid duration and silently never runs.
  for (const token of new Set(referenced)) {
    assert.ok(dsMotion.includes(`${token}:`),
      `${token} is used by the icon motion layer but not defined in ds/tokens/motion.css`);
    assert.ok(tokens.includes(`${token}:`),
      `${token} is used by the icon motion layer but not defined in tokens.css — the marketing pages would no-op`);
  }
});

/* ---- re-pointed at this site's DOM -------------------------------------- */

test("every family is re-pointed at the sprite's DOM shape", () => {
  // The system puts its motion class on a <span> around the glyph and writes
  // `.dn-icon--spin svg`. This site puts it on the <svg> itself, where that selector has
  // no descendant svg to match. Every family needs its own re-pointed rule or it is inert.
  for (const family of FAMILIES) {
    assert.ok(adapter.includes(`svg.dn-icon--${family}`),
      `${family} is not re-pointed at svg.dn-icon--${family} — it will never match a sprite icon`);
  }
  // draw is the one family that reaches past the svg, into the <use>.
  assert.match(adapter, /svg\.dn-icon--draw > \*\{stroke-dasharray:1;stroke-dashoffset:0\}/);
});

test("the hover gate survives, in both sheets", () => {
  // A tap on iOS fires :hover and then leaves it applied. Ungated, every icon in a row
  // animates once on first touch and holds its last pose until something else is tapped.
  for (const [name, css] of [["the vendored layer", vendored], ["the adapter", adapter]]) {
    assert.ok(css.includes("@media (hover:hover)"), `${name} lost its hover gate`);
    const gate = css.indexOf("@media (hover:hover)");
    for (const family of FAMILIES) {
      const hover = css.indexOf(`.dn-icon--${family}:hover`);
      if (hover === -1) continue;
      assert.ok(hover > gate, `${name} plays ${family} on hover outside the hover:hover gate`);
    }
  }
});

test("loop is reserved for a live state, and is never applied by the resolver", () => {
  // dn-icon--loop is a second class a caller adds deliberately beside the family. Nothing
  // that derives a class from a glyph name may ever produce it, or decoration starts
  // looping and "this is live" stops meaning anything.
  assert.ok(!/dn-icon--loop/.test(readFileSync("assets/js/icon-motion.js", "utf8")),
    "the resolver can emit dn-icon--loop — loop is a live state, never a property of a glyph");
  assert.match(adapter, /svg\.dn-icon--loop\.dn-icon--spin/);
});

test("prefers-reduced-motion switches the whole vocabulary off", () => {
  const start = adapter.indexOf("@media (prefers-reduced-motion:reduce)");
  assert.ok(start > -1, "the adapter has no reduced-motion block");
  const block = adapter.slice(start);
  for (const family of FAMILIES) {
    assert.ok(block.includes(`svg.dn-icon--${family}`),
      `${family} is not switched off under prefers-reduced-motion`);
  }
  assert.match(block, /animation:none!important/);
  // Not merely collapsed to 1ms, which is what the global rule in tokens.css does. Six of
  // the seven families end on their resting pose and a 1ms run is harmless; dn-i-spin ends
  // at rotate(50deg) with fill-mode `both`, so under the collapse alone a hover would snap
  // the glyph 50 degrees and hold it there for as long as the pointer stayed.
  assert.match(tokens, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(vendored, /animation:dn-i-spin var\(--dur-slow\) var\(--ease-spring\) both/);
});

/* ---- every glyph resolves ----------------------------------------------- */

test("resolveMotion returns a family for a name nobody has added yet", () => {
  for (const unknown of ["sprocket", "i-sprocket", "quantum-flux", "zzzz", "a"]) {
    const motion = iconMotion.motionFor(unknown);
    assert.ok(FAMILIES.includes(motion), `${unknown} resolved to ${motion}, which is not a family`);
  }
  // The catch-all is the point: a glyph with nothing to say about how it moves still moves.
  assert.equal(iconMotion.resolveMotion("sprocket"), "pop");
  // The rules are patterns, not a whitelist, and they are deliberately loose: an invented
  // name ending in x lands on jitter through the /x$/ branch that catches circle-x. That
  // is the design — a name that LOOKS alarming moves like the alarming ones — and it is
  // pinned here so nobody "fixes" it into a lookup that leaves new glyphs still.
  assert.equal(iconMotion.resolveMotion("quantum-flux"), "jitter");
  // And an empty name cannot throw — the DOM pass calls this on whatever a href holds.
  assert.ok(FAMILIES.includes(iconMotion.motionFor("")));
});

test("every glyph in the sprite resolves to a family", () => {
  assert.ok(spriteIds.length > 30, "the sprite shrank unexpectedly");
  for (const id of spriteIds) {
    assert.ok(FAMILIES.includes(iconMotion.motionFor(id)), `#i-${id} has no motion`);
  }
});

test("a representative glyph of each family carries that family", () => {
  // The families the sprite actually draws, pinned against the glyph that carries them.
  // These are the assertions that fail if the name map is edited carelessly.
  const representative = {
    draw: "circle-check-big",   // a check draws itself in
    spin: "refresh",            // this site's shorthand for refresh-cw
    ring: "bell",
    nudge: "arrow-right",
    pop: "plus",
    jitter: "triangle-alert"
  };
  for (const [family, id] of Object.entries(representative)) {
    assert.ok(spriteIds.includes(id), `the sprite no longer carries #i-${id}`);
    assert.equal(iconMotion.motionFor(id), family, `#i-${id} should ${family}`);
    assert.equal(iconMotion.motionClass(id), `dn-icon--${family}`);
  }

  // hop is the seventh, and this sprite has no glyph for it: there is no search, filter or
  // zoom anywhere in this console. The family is still carried by both stylesheets and
  // still reachable, so the first search glyph added animates without any further work.
  assert.equal(iconMotion.resolveMotion("search"), "hop");
  assert.ok(adapter.includes("svg.dn-icon--hop") && vendored.includes("dn-i-hop"));
});

test("the rail's glyphs are classified by their drawing, not their door", () => {
  // Rail ids are named for the destination — nav-runs, nav-decisions — because the label
  // is what changes least. The motion has to follow what is DRAWN, which is what the name
  // map is for, and it is the part of the map most likely to be edited without thinking.
  assert.equal(iconMotion.motionFor("nav-economics"), "draw");   // a gauge
  assert.equal(iconMotion.motionFor("nav-decisions"), "draw");   // a signature
  assert.equal(iconMotion.motionFor("nav-teams"), "pop");        // users
  assert.equal(iconMotion.motionFor("nav-settings"), "spin");    // sliders, settings-2
  assert.equal(iconMotion.motionFor("nav-dashboard"), "pop");    // layout-dashboard

  // Every id the map names must still exist in the sprite, or the map is documenting a
  // glyph nobody draws.
  for (const id of Object.keys(iconMotion.SPRITE_TO_LUCIDE)) {
    assert.ok(spriteIds.includes(id), `SPRITE_TO_LUCIDE names #i-${id}, which the sprite does not carry`);
  }
});

/* ---- draw's one requirement --------------------------------------------- */

test("every shape in the sprite carries pathLength=\"1\"", () => {
  // draw expresses the whole path as 1 — stroke-dasharray:1, dashoffset 1 -> 0. pathLength
  // is what makes 1 mean the whole path. Without it the animation still RUNS, and renders
  // the glyph as a crawl of dots: a failure that looks like a bug in the artwork.
  const shapes = [...sprite.matchAll(/<(path|circle|rect|line|polyline|polygon|ellipse)\b[^>]*>/g)];
  assert.ok(shapes.length > 50, "the sprite has no shapes to check");
  const bare = shapes.filter((match) => !/\bpathLength="1"/.test(match[0]));
  assert.deepEqual(bare.map((match) => match[0].slice(0, 60)), [],
    "sprite shapes without pathLength=\"1\" — draw will render these as dots");
});

/* ---- wired in ----------------------------------------------------------- */

test("both surfaces load the layer and apply the class", () => {
  // The console gets the vocabulary through ds.css; the marketing pages skip ds.css (its
  // base layer is a reset) and link the one file in the tree they can take.
  assert.match(head, /page\.layout == 'app' %\}<link rel="stylesheet" href="\{\{ '\/assets\/css\/ds\.css'/);
  assert.match(head, /unless page\.layout == 'app' %\}<link rel="stylesheet" href="\{\{ '\/assets\/css\/ds\/components\/core\/icons-motion\.css'/);
  // The adapter is unconditional: both kits draw the same sprite.
  assert.match(head, /<link rel="stylesheet" href="\{\{ '\/assets\/css\/icon-motion\.css'/);

  for (const [name, layout] of [["the app", appLayout], ["the marketing pages", defaultLayout]]) {
    assert.ok(layout.includes("/assets/js/icon-motion.js"), `${name} do not load icon-motion.js`);
  }

  // And something has to actually apply the class. Both entry points derive it; neither
  // hardcodes a family.
  assert.match(app, /iconMotion\.applyIconMotion\(document\)/);
  assert.match(app, /iconMotion\.motionFor\(glyph\)/);
  assert.match(site, /deepNavyIconMotion\?\.applyIconMotion\(document\)/);
  // Every renderer that builds a sprite icon runs it through the same derivation.
  const factories = [...app.matchAll(/use\.setAttribute\("href", `#i-\$\{(\w+)\}`\)/g)];
  assert.equal(factories.length, 2, "the number of sprite-icon factories changed");
  for (const factory of factories) {
    const tail = app.slice(factory.index, factory.index + 220);
    assert.match(tail, /return applyIconMotionTo\(svg, \w+\)/,
      "a sprite-icon factory returns an unclassified icon — it would render still");
  }
});

test("no icon is classified by hand in markup", () => {
  // The class is derived from the glyph's own name, everywhere. A family hardcoded into a
  // template is a glyph that stops agreeing with the table the moment the table changes.
  const shell = readFileSync("_includes/app-shell.html", "utf8");
  const index = readFileSync("index.md", "utf8");
  for (const [name, source] of [["_includes/app-shell.html", shell], ["index.md", index]]) {
    const hardcoded = [...source.matchAll(/dn-icon--(draw|spin|ring|hop|nudge|pop|jitter)/g)];
    assert.deepEqual(hardcoded.map((match) => match[0]), [],
      `${name} hardcodes a motion family — derive it from the glyph name instead`);
  }
});
