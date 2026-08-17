"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const tokens = readFileSync("assets/css/tokens.css", "utf8");
const main = readFileSync("assets/css/main.css", "utf8");
const home = readFileSync("assets/css/home.css", "utf8");
const header = readFileSync("_includes/header.html", "utf8");
const index = readFileSync("index.md", "utf8");

// The ground is the void and the instruments mounted on it are navy. That
// two-material split is what keeps a black page from reading as the generic
// dark theme, where every panel is simply grey.
test("black is the ground and the brand navy is the material above it", () => {
  assert.match(tokens, /--abyss-0:\s*#000000;/, "the ground must be true black");
  assert.match(tokens, /--abyss-1:\s*#000f1a;/, "the brand navy must survive as the step above the void");
  // The ramp must keep rising in blue, not collapse to grey.
  const ramp = [...tokens.matchAll(/--abyss-[2-5]:\s*(#[0-9a-f]{6});/g)].map((m) => m[1]);
  assert.equal(ramp.length, 4, "the abyss ramp lost steps");
  for (const step of ramp) {
    const red = parseInt(step.slice(1, 3), 16);
    const blue = parseInt(step.slice(5, 7), 16);
    assert.ok(blue > red + 8, `${step} is not blue enough to read as navy rather than grey`);
  }
});

// Monospace is the machine's voice: chrome, labels, identifiers, quantities.
// It is never prose, because a paragraph set in mono is a costume.
test("the chrome is set in the machine's face", () => {
  assert.match(main, /\.desktop-nav a,\s*\n\.mobile-menu nav a \{[^}]*--font-mono/,
    "navigation must be monospace");
  assert.match(main, /\.button,\s*\n\.lp-btn \{[^}]*--font-mono/, "buttons must be monospace");
  assert.match(main, /\.instrument-label \{[^}]*--font-mono/);
  assert.match(main, /\.instrument-figure \{[^}]*--font-mono/);
  // Quantities line up under one another or they are not quantities.
  assert.match(main, /font-variant-numeric: tabular-nums;/);
  // Prose stays in the reading faces.
  const proseRule = main.match(/\.instrument-caption \{[^}]*\}/);
  assert.ok(proseRule, "the instrument caption rule is gone");
  assert.doesNotMatch(proseRule[0], /--font-mono/, "captions are prose and must not be monospace");
});

// Colour lives in tokens.css alone; a hex anywhere else is how a theme starts
// to drift. The print stylesheet is the one honest exception - paper is always
// white - and one legacy fallback predates the rule.
test("the new styling introduces no colour outside the token file", () => {
  const instrumentLayer = main.slice(main.indexOf("INSTRUMENT LAYER"));
  assert.doesNotMatch(instrumentLayer, /#[0-9a-fA-F]{3,8}\b/, "the instrument layer must use tokens only");
  const homeAddition = home.slice(home.indexOf(".lp-instruments"));
  assert.doesNotMatch(homeAddition, /#[0-9a-fA-F]{3,8}\b/);
});

// The page is a ledger: each section is a label, a drawing of the mechanism,
// what it means, the facts, and the line naming where the reader can check it
// themselves. The verify line is the whole thesis - a claim that cannot be
// checked does not belong on this page.
test("the homepage reads as a ledger, section by section", () => {
  const labels = [...index.matchAll(/<p class="lp-label">([^<]+)<\/p>/g)].map((m) => m[1]);
  assert.deepEqual(labels, [
    "Unit of work", "The brief", "The roster", "The merge gate",
    "Your GitHub", "Metered spend", "Price", "Not on the ledger",
  ], "the refusals are the last word before the ask, and money stays contiguous");

  // Every section states its mechanism, its facts, and — except the refusals,
  // which exist precisely because they cannot be checked — where to verify it.
  assert.equal((index.match(/class="lp-facts[^"]*"/g) || []).length, 7);
  assert.equal((index.match(/class="lp-verify"/g) || []).length, 6);
  assert.doesNotMatch(
    index.slice(index.indexOf('<p class="lp-label">Not on the ledger</p>')),
    /class="lp-verify"/,
    "the refusals section must not claim a receipt it cannot produce");

  // A drawing made of box characters is noise to a screen reader, so each one
  // describes itself and the drawing is hidden from the accessibility tree.
  const figures = index.match(/<figure class="instrument-figure"[^>]*>/g) || [];
  assert.equal(figures.length, 6);
  for (const figure of figures) {
    assert.match(figure, /role="img"/);
    assert.match(figure, /aria-label="[^"]{50,}"/, "every drawing needs a real description, not a stub");
  }
  assert.equal((index.match(/<pre aria-hidden="true">/g) || []).length, 6);

  // Only the roster uses <strong>, because the role vocabulary is a contract
  // the product keeps elsewhere and agent_roles_test reads exactly these.
  assert.equal((index.match(/<li><strong>/g) || []).length, 4);
});

// Five destinations, not the sitemap.
test("the navigation is lean and every label points at a page that exists", () => {
  const links = [...header.matchAll(/href="\{\{ '([^']+)' \| relative_url \}\}"[^>]*>([^<]+)</g)]
    .map((m) => ({ route: m[1], label: m[2].trim() }))
    // The mark links home and the sign-in button is an action, not a section.
    .filter((link) => !link.route.includes("/app/") && link.route !== "/");
  const labels = [...new Set(links.map((link) => link.label))];
  assert.deepEqual(labels.sort(), ["Docs", "Ledger", "Security", "What it costs", "How it works"].sort());
  assert.doesNotMatch(header, />Economics</, "Economics was our word for that page; the reader's word is Ledger");
  // One closing call to action, not two stacked on each other.
  assert.match(index, /^hide_cta: true$/m,
    "the homepage writes its own closing CTA, so the shared one must be suppressed");
});

// A monospace drawing cannot reflow — its lines are a grid — so it must scroll
// inside its own frame. And a grid item defaults to min-width:auto, which lets
// a long word push the item wider than its track: that is how a 350px column
// became 404px and the whole page scrolled sideways on a phone.
test("nothing widens the page on a narrow screen", () => {
  assert.match(home, /\.lp-hero-grid > \*,\s*\n\.lp-shell > \* \{ min-width: 0; \}/,
    "grid items must be allowed to shrink below their content");
  assert.match(home, /\.instrument-figure > pre \{[^}]*overflow-x: auto;/,
    "the drawing scrolls inside its frame, never the page");
  assert.match(home, /\.instrument-figure \{ max-width: 100%; \}/);
});

// The page shows a pull request and a console because those are the two
// surfaces a customer actually looks at. Both are depictions drawn in the same
// materials as the rest of the page, not screenshots that will go stale, and
// both show the product doing something real — a reply arriving mid-sentence
// is the streaming behaviour the runtime actually has.
test("the console is shown, not just described", () => {
  assert.match(index, /<figure class="console-shot"[^>]*aria-label="[^"]{60,}"/,
    "the console depiction needs a real description for anyone who cannot see it");
  // The activity stream: who did what, when, in the machine's face.
  assert.match(index, /<ol class="console-stream">/);
  assert.equal((index.match(/<li><span>\d{2}:\d{2}:\d{2}<\/span>/g) || []).length, 5);
  // The conversation, caught mid-reply.
  assert.match(index, /class="console-msg is-you"/);
  assert.match(index, /class="console-msg is-pm"/);
  assert.match(index, /class="console-writing">still writing</);
  const css = readFileSync("assets/css/home.css", "utf8");
  assert.match(css, /\.console-stream span \{[^}]*tabular-nums/, "timestamps must line up");
  assert.match(css, /@keyframes console-caret/);
  // The caret is decoration; a reader using a screen reader hears the sentence,
  // not a blinking block.
  assert.match(index, /<span class="console-caret" aria-hidden="true">/);
});

// The one thing a visitor is meant to do must be findable. GitHub's own button
// colour measures 1.33:1 against the void — on the old navy ground it read
// fine, and moving the ground to black made it a surface you cannot see.
test("the primary action is legible on whichever ground it lands on", () => {
  const value = (name) => {
    const match = tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"));
    assert.ok(match, `${name} is missing from the token file`);
    return match[1];
  };
  const luminance = (hex) => {
    const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const contrast = (a, b) => {
    const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
    return (x + 0.05) / (y + 0.05);
  };

  // Dark: the bright seafoam fill on the void, labelled in the void's own black.
  const darkFill = value("seafoam-4");
  const dark = contrast(darkFill, value("abyss-0"));
  assert.ok(dark >= 4.5, `dark primary is ${dark.toFixed(2)}:1 against the ground, want >= 4.5`);

  // Light: the darker seafoam on white, labelled white. Both the label and the
  // control's own edge have to clear their thresholds - 4.5 for text this size,
  // 3 for the boundary of something you have to find and click.
  const lightFill = value("seafoam-2");
  const lightLabel = contrast(lightFill, value("white"));
  assert.ok(lightLabel >= 4.5, `light primary label is ${lightLabel.toFixed(2)}:1, want >= 4.5`);
  assert.ok(lightLabel >= 3, `light primary edge is ${lightLabel.toFixed(2)}:1 against white, want >= 3`);

  // And the rule must take the theme-aware accent, not the graphic one: the
  // graphic seafoam is a fill for shapes and is far too pale on white.
  assert.match(main, /\.button-github \{[^}]*background: var\(--accent\);/);
  assert.match(main, /\.lp-btn-github \{[^}]*background: var\(--accent\);/);
  // The label inverts with the theme by taking the page's own ground.
  assert.match(main, /\.button-github \{[^}]*color: var\(--surface\);/);
  assert.match(main, /\.lp-btn-github \{[^}]*color: var\(--surface\);/);
  // No dead declaration left behind to be overridden from further down.
  assert.doesNotMatch(main, /background: var\(--brand-github-bg\)/);
});
