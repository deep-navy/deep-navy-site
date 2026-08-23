"use strict";

// The design system ships a brand layer. This site vendored the system and dropped it,
// on the reasoning written at the top of ds.css — "the site keeps its own mark" — which
// was a guess of exactly the same shape as the icons-motion exclusion beside it, and
// wrong in the same way. The site kept the same SILHOUETTE. What it dropped was the
// construction:
//
//   · the mark painted as TWO stacked copies of that silhouette, masked out of
//     currentColor and clipped either side of the row where the arms leave the head, so
//     the arm copy can skew about that row while the head copy never moves at all;
//   · the period in "deep.navy" drawn as a circle rather than typed, which is what makes
//     it perfectly round at every size and in every face — and the only brand chroma in
//     an otherwise achromatic system.
//
// Everything below is a shape that, if it quietly reverted, would leave a mark that still
// looked right in a screenshot and had stopped being the system's.

const assert = require("node:assert/strict");
const { readFileSync, existsSync } = require("node:fs");
const test = require("node:test");

const dsBrand = readFileSync("assets/css/ds/components/brand/brand.css", "utf8");
const siteBrand = readFileSync("assets/css/brand.css", "utf8");
const components = readFileSync("assets/css/ds/components/components.css", "utf8");
const dsEntry = readFileSync("assets/css/ds.css", "utf8");
const head = readFileSync("_includes/head.html", "utf8");
// The include opens with a liquid comment that names the shapes it is protecting —
// including the two it must never become. Strip it, or every assertion below matches
// the explanation instead of the markup.
const logo = readFileSync("_includes/logo.html", "utf8")
  .replace(/\{%-?\s*comment\s*-?%\}[\s\S]*?\{%-?\s*endcomment\s*-?%\}/g, "");
const tokens = readFileSync("assets/css/tokens.css", "utf8");
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

// Every surface that carries the mark. If a fifth one appears, it goes in this list, or
// the "one lockup" test below stops meaning anything.
const SURFACES = [
  "_includes/header.html",   // the marketing header
  "_includes/footer.html",   // the marketing footer
  "_layouts/app.html",       // the chrome above sign-in and create-a-team
  "_includes/app-shell.html", // the workspace rail
];

/* ---- the layer is actually loaded ---------------------------------------- */

test("the brand layer is vendored and imported, on both kits", () => {
  // The console reaches it the system's own way: ds.css -> components.css -> brand/.
  assert.equal(components.split("\n")[0].trim(), '@import "brand/brand.css";',
    "components.css must keep the system's own first-line brand import");
  assert.ok(existsSync("assets/css/ds/components/brand/brand.css"), "the vendored layer is missing");

  // The marketing pages skip ds.css because ds/tokens/base.css is a reset, so they take
  // the brand layer on its own — the same arrangement icons-motion already has, and for
  // the same reason: the header and footer that carry the lockup are the SAME includes.
  assert.match(head, /<link rel="stylesheet" href="\{\{ '\/assets\/css\/ds\/components\/brand\/brand\.css' \| relative_url \}\}">/,
    "the marketing pages must link the brand layer directly");
  assert.match(head, /\{% unless page\.layout == 'app' %\}<link[^>]*ds\/components\/brand\/brand\.css/,
    "…and only where ds.css is not, so it is never loaded twice");
  assert.match(head, /<link rel="stylesheet" href="\{\{ '\/assets\/css\/brand\.css' \| relative_url \}\}">/,
    "the companion sheet carries the mask source and must load on every page");

  // Order matters: the companion overrides two clip-paths and a transform-origin, so it
  // has to arrive after both routes into the vendored sheet.
  const at = (needle) => head.indexOf(needle);
  assert.ok(at("'/assets/css/brand.css'") > at("ds/components/brand/brand.css"),
    "the companion must load after the standalone brand link");
  assert.ok(at("'/assets/css/brand.css'") > at("'/assets/css/ds.css'"),
    "the companion must load after ds.css");

  // And the note at the top of ds.css must stop counting the brand layer as an omission.
  // Exactly one thing is left out of the vendored system now, and it is the fonts CDN.
  assert.match(dsEntry, /with exactly ONE omission:/,
    "ds.css still records more than one omission; the brand layer is no longer one of them");
  assert.match(dsEntry, /1\. no @import of the Google Fonts CDN/);
  assert.doesNotMatch(dsEntry, /^\s*2\./m, "there is no second omission any more");
});

/* ---- the mark is the two-layer masked construction ----------------------- */

test("the mark is two masked layers on one empty element — never an <img>, never an <svg>", () => {
  // An <img> is its own document: it can neither inherit the page's colour nor be split.
  // An inline <svg> could inherit colour, but the supplied artwork is ONE evenodd path,
  // so it has no addressable arms to move — which is the whole reason for the mask.
  assert.doesNotMatch(logo, /<img\b/i, "the mark is masked, never an <img>");
  assert.doesNotMatch(logo, /<svg\b/i, "the mark is masked, never an inline <svg>");
  assert.match(logo, /<span class="dn-logo__mark dn-mark" aria-hidden="true"><\/span>/,
    "the mark is one empty element; brand.css paints both layers on its pseudo-elements");

  const ds = stripComments(dsBrand);
  assert.match(ds, /\.dn-mark::before,\.dn-mark::after\{[^}]*mask:var\(--dn-mark-src,[^)]*\)[^}]*\}/,
    "both layers must paint the same silhouette through the same overridable mask source");
  assert.match(ds, /\.dn-mark::before,\.dn-mark::after\{[^}]*background:currentColor/,
    "the mark paints currentColor through the mask, so one file follows both themes");

  // Two layers, two clips, and the skew pivots on the seam.
  const site = stripComments(siteBrand);
  const headClip = site.match(/\.dn-mark::before\s*\{\s*clip-path:\s*inset\(0 0 ([\d.]+)% 0\);?\s*\}/);
  const armClip = site.match(/\.dn-mark::after\s*\{\s*clip-path:\s*inset\(([\d.]+)% 0 0 0\);\s*transform-origin:\s*50% ([\d.]+)%;?\s*\}/);
  assert.ok(headClip && armClip, "the re-measured clip pair is gone from assets/css/brand.css");
  const hinge = 100 - Number(headClip[1]);
  const armTop = Number(armClip[1]);
  const origin = Number(armClip[2]);
  assert.ok(Math.abs(origin - hinge) < 0.001,
    `the skew must pivot on the same row the head layer is clipped at (${hinge}%), or the two halves tear apart; origin is ${origin}%`);
  assert.ok(Math.abs(hinge - armTop - 3) < 0.001,
    `the clips must overlap by the system's 3%, got ${(hinge - armTop).toFixed(2)}%`);

  // The hinge is measured out of the artwork, not chosen. Rasterising
  // deep-navy-mark-ghost.svg and counting solid runs per row gives one run through the
  // crown, two through the head, and four from 30.4% down as the arms separate — stable
  // at 600px and 1200px and at alpha thresholds 8, 128 and 200. The system's own file
  // frames the same silhouette inside scale(0.74) about the centre, which is why the
  // system's sheet says 35%: 0.5 + 0.74 * (0.304 - 0.5) = 0.355. Same feature, two
  // framings. Taking 35% on OUR artwork hinges the arms 4.6% below where they leave.
  assert.ok(Math.abs(hinge - 30.4) < 0.05,
    `the hinge must be the row measured out of this site's artwork (30.4%), got ${hinge}%`);
  assert.match(stripComments(dsBrand), /transform-origin:50% 35%/,
    "the vendored sheet must stay the system's own bytes, 35% and all — we override, never edit");
});

test("the mask source is a silhouette on a transparent ground, not the plated artwork", () => {
  // A mask-image that references an image resolves mask-mode: match-source to ALPHA.
  // Three files in assets/images/ carry this same single evenodd path and only one of
  // them can be a mask: the other two sit on an opaque navy tile, so their alpha channel
  // is a solid square and the two layers would clip nothing at all. Rasterised at 600x600,
  // deep-navy-mark.svg comes back opaque on all 600 rows and favicon.svg on 468 of them;
  // the ghost has none.
  assert.match(siteBrand, /--dn-mark-src:\s*url\("\/assets\/images\/deep-navy-mark-ghost\.svg"\)/,
    "the mark must be pointed at the transparent-ground silhouette");
  assert.doesNotMatch(stripComments(siteBrand), /--dn-mark-src:[^;]*deep-navy-mark\.svg/,
    "the plated file is opaque edge to edge and masks to a square");

  const ghost = readFileSync("assets/images/deep-navy-mark-ghost.svg", "utf8");
  assert.doesNotMatch(ghost, /<rect/, "a ground of any kind turns the mask into a square");
  assert.equal((ghost.match(/<path/g) || []).length, 1, "the silhouette is one path");
  assert.match(ghost, /fill-rule="evenodd"/, "…and it is the supplied evenodd path");

  // The same file masks the marketing hero watermark. One silhouette, two uses — if a
  // future change gives one of them its own copy, they will drift.
  const home = readFileSync("assets/css/home.css", "utf8");
  assert.match(home, /mask: url\("\/assets\/images\/deep-navy-mark-ghost\.svg"\)/,
    "the watermark and the lockup mask the same file");
});

/* ---- the period is drawn, not typed -------------------------------------- */

test("the period in deep.navy is an element, not a character", () => {
  assert.match(logo, /<span class="dn-logo__word">deep<span class="dn-logo__dot" aria-hidden="true"><\/span>navy<\/span>/,
    "the wordmark is deep + a drawn dot + navy");
  const word = logo.match(/<span class="dn-logo__word">([\s\S]*?)<\/span>\s*<\/a>/);
  assert.ok(word, "the wordmark is gone");
  assert.doesNotMatch(word[1].replace(/<[^>]+>/g, ""), /\./,
    "a typed period is a different shape in each of our three faces and cannot scale on hover");
  // The dot is an element, so a screen reader would read "deepnavy" without help.
  assert.match(logo, /aria-label="deep navy home"/, "the anchor must carry the spoken name");

  const ds = stripComments(dsBrand);
  assert.match(ds, /\.dn-logo__dot\{[^}]*border-radius:50%/, "round at every size, in every face");
  assert.match(ds, /\.dn-logo__dot\{[^}]*background:var\(--lumen-500\)/);
  assert.match(ds, /\[data-theme="dark"\] \.dn-logo__dot\{background:var\(--lumen-400\)\}/);

  // Those two steps are colour, and colour is defined in tokens.css and nowhere else —
  // ds.css is console-only and the marketing header carries the same dot.
  assert.match(tokens, /--lumen-500:\s*#0B9C8D;/);
  assert.match(tokens, /--lumen-400:\s*#17BFAD;/);

  // One chroma, and only one. The dot is the single sanctioned brand colour; nothing else
  // in the lockup may take a hue. (--brand-navy is the plate treatment's own ground and is
  // the system's, not a second brand colour introduced here.)
  const hues = [...stripComments(siteBrand).matchAll(/var\(--(?:lumen|kelp|brass|coral|rose|iris|anemone|current)[a-z0-9-]*\)/g)];
  assert.deepEqual(hues.map((m) => m[0]), [], "the companion sheet must introduce no colour of its own");
});

/* ---- motion: one pass, on a pointer, and off when asked ------------------ */

test("the sway is one hover pass at the pointer budget, and never ambient", () => {
  const ds = stripComments(dsBrand);
  assert.match(ds, /@keyframes dn-mark-sway\{0%\{transform:skewX\(0\) scaleY\(1\)\}[\s\S]*100%\{transform:skewX\(0\) scaleY\(1\)\}\}/,
    "the keyframe must start and end at the resting pose");
  assert.match(ds, /animation:dn-mark-sway var\(--dur-slower\) var\(--ease-in-out\) 1\}/,
    "one iteration, 480ms — the same pointer budget as the icon families");
  assert.doesNotMatch(ds, /animation:dn-mark-sway[^;}]*infinite/,
    "a logo that moves on its own answers nothing about what changed");

  // The hover gate is a pointer capability, not a device: a tap on iOS fires :hover and
  // then leaves it applied, so an ungated mark animates once and holds its last pose.
  const gate = ds.match(/@media \(hover:hover\)\{[\s\S]*?\n\}/);
  assert.ok(gate, "the hover gate is gone from the vendored sheet");
  assert.match(gate[0], /\.dn-mark::after,\.dn-mark:hover::after\{animation:dn-mark-sway/);
  assert.match(gate[0], /\.dn-logo:hover \.dn-logo__dot\{transform:scale\(1\.18\)\}/);

  // The site adds no motion of its own: every duration, easing and keyframe is the system's.
  assert.doesNotMatch(stripComments(siteBrand), /@keyframes/,
    "the companion sheet must declare no motion of its own");
});

test("reduced motion switches the sway OFF, rather than collapsing it to 1ms", () => {
  // tokens.css collapses every animation to .01ms. That was enough for six of the seven
  // icon families and not for the seventh: dn-i-spin ends at rotate(50deg) with fill-mode
  // both, so under the collapse alone a hover snapped the glyph 50 degrees and HELD it.
  // dn-mark-sway does end at rest, so the collapse would not strand it — but a collapsed
  // animation is still an animation that runs. Reduced has to mean the pass does not
  // happen: verified in a browser, getAnimations() reports none and the arm layer's
  // transform stays "none" through a held hover.
  const guard = stripComments(siteBrand).match(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\n\}/);
  assert.ok(guard, "the brand layer has no reduced-motion guard");
  assert.match(guard[0], /\.dn-mark::before, \.dn-mark::after \{ animation: none !important; \}/,
    "both layers must be switched off outright");
  assert.doesNotMatch(guard[0], /animation-duration/,
    "shortening leaves a skew-ended keyframe holding its final pose; switch it off");
  assert.match(guard[0], /\.dn-logo__dot[^{]*\{ transition: none !important; \}/,
    "the dot arrives instead of travelling");
});

/* ---- one lockup, every surface ------------------------------------------- */

test("every surface that shows the mark renders the one lockup", () => {
  assert.ok(!existsSync("_includes/logo.svg"),
    "the still inline mark is superseded by _includes/logo.html; two marks will drift");
  for (const path of SURFACES) {
    const markup = readFileSync(path, "utf8");
    assert.match(markup, /\{% include logo\.html/, `${path} no longer renders the lockup`);
    assert.doesNotMatch(markup, /include logo\.svg/, `${path} still inlines the old still mark`);
    assert.doesNotMatch(markup, /<img[^>]*deep-navy-mark/, `${path} draws the mark as an <img>`);
  }
  // The two chrome-scale surfaces take the system's small step rather than a private size.
  assert.match(readFileSync("_includes/footer.html", "utf8"), /include logo\.html size="dn-logo--sm"/);
  assert.match(readFileSync("_includes/app-shell.html", "utf8"), /include logo\.html size="dn-logo--sm" class="cs-rail-brand"/);

  // And nothing hand-rolls the lockup beside it any more.
  const main = readFileSync("assets/css/main.css", "utf8");
  const consoleCss = readFileSync("assets/css/console.css", "utf8");
  assert.doesNotMatch(stripComments(main), /\.brand\s*\{/, "main.css must not re-declare the lockup");
  assert.doesNotMatch(stripComments(main), /\.brand \.mark\b/, "the old mark sizing is the system's job now");
  assert.doesNotMatch(stripComments(consoleCss), /\.cs-rail-brand svg\b/,
    "the rail's mark is .dn-logo--sm, not a private 22px svg rule");
});
