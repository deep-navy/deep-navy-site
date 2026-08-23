"use strict";

// The design-system thesis this file enforces: THE CHROME IS ACHROMATIC.
// Surfaces, text, borders, buttons and navigation are ink — pure greys from
// white to black — so that a coloured pixel is always information. Colour
// appears in exactly eight meanings: four statuses (lumen teal = running,
// kelp green = met, brass amber = waiting on a human, coral red = failed or
// destructive) and four roles (rose = PM, iris = EM, orchid = Designer,
// azure = the Engineers). If a hue shows up styling base chrome, the thesis
// is broken and this file goes red.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const tokens = readFileSync("assets/css/tokens.css", "utf8");
const main = readFileSync("assets/css/main.css", "utf8");
const home = readFileSync("assets/css/home.css", "utf8");
const typeCss = readFileSync("assets/css/type.css", "utf8");
const header = readFileSync("_includes/header.html", "utf8");
const head = readFileSync("_includes/head.html", "utf8");
const index = readFileSync("index.md", "utf8");

/* ---- tiny CSS readers ---------------------------------------------------
   Enough parser to read custom properties per theme scope and to walk rules.
   tokens.css nests at most one @media level, which this handles. */

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

// Walk a stylesheet and yield { media, selector, body } for every rule.
function rules(css) {
  const out = [];
  const src = stripComments(css);
  let i = 0;
  const skipBlock = () => { // consume a balanced { ... } we are already inside
    let depth = 1;
    while (i < src.length && depth > 0) {
      if (src[i] === "{") depth += 1;
      else if (src[i] === "}") depth -= 1;
      i += 1;
    }
  };
  const walk = (media) => {
    while (i < src.length) {
      while (i < src.length && /\s/.test(src[i])) i += 1;
      if (i >= src.length) return;
      if (src[i] === "}") { i += 1; return; } // end of the enclosing at-rule
      const brace = src.indexOf("{", i);
      if (brace === -1) { i = src.length; return; }
      const selector = src.slice(i, brace).trim();
      i = brace + 1;
      if (selector.startsWith("@media") || selector.startsWith("@supports")) {
        walk(selector);
        continue;
      }
      if (selector.startsWith("@")) { skipBlock(); continue; } // @keyframes, @font-face, @print
      const end = src.indexOf("}", i);
      const body = src.slice(i, end === -1 ? src.length : end);
      i = end === -1 ? src.length : end + 1;
      out.push({ media, selector, body });
    }
  };
  walk(null);
  return out;
}

const declsOf = (body) => body.split(";").map((d) => {
  const at = d.indexOf(":");
  return at === -1 ? null : { prop: d.slice(0, at).trim(), value: d.slice(at + 1).trim() };
}).filter(Boolean);

// Custom-property maps for the two themes, resolved from tokens.css itself.
function themeMaps() {
  const light = new Map();
  const dark = new Map();
  for (const { media, selector, body } of rules(tokens)) {
    const inDarkMedia = media && /prefers-color-scheme:\s*dark/.test(media);
    const isRoot = /^:root$/.test(selector);
    const isDarkChoice = selector.includes('[data-theme="dark"]');
    const isLightChoice = selector.includes('[data-theme="light"]');
    for (const { prop, value } of declsOf(body)) {
      if (!prop.startsWith("--")) continue;
      if (isRoot && !media) { light.set(prop, value); dark.set(prop, value); }
      else if (isRoot && inDarkMedia) dark.set(prop, value);
      else if (isDarkChoice) dark.set(prop, value);
      else if (isLightChoice) light.set(prop, value);
    }
  }
  return { light, dark };
}

function resolveVar(map, value, depth = 0) {
  assert.ok(depth < 16, `token chain too deep resolving ${value}`);
  const match = value.match(/^var\((--[a-z0-9-]+)(?:\s*,\s*(.+))?\)$/i);
  if (!match) return value;
  const [, name, fallback] = match;
  if (map.has(name)) return resolveVar(map, map.get(name), depth + 1);
  assert.ok(fallback, `${name} resolves to nothing and has no fallback`);
  return resolveVar(map, fallback.trim(), depth + 1);
}

const hexChannels = (hex) => {
  const h = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const isAchromatic = ([r, g, b]) => Math.abs(r - g) <= 2 && Math.abs(g - b) <= 2;
const luminance = (channels) => {
  const [r, g, b] = channels.map((c) => c / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// The tokens allowed to carry a hue, each because it MEANS something: the
// four statuses (raw families, --signal-* names and the --status-*-fg/bg/
// border/dot alias sets), the four identity families and the --role-*
// aliases that ride them, the diff evidence pair, the brand navy on the
// logo tile, and GitHub's own brand button. Everything else in tokens.css
// must be ink.
const HUE_BEARING = /^--(?:abyss-1|brand-navy|brand-github-[a-z-]+|role-[a-z-]+|lumen(?:-[a-z0-9-]+)?|kelp(?:-[a-z0-9-]+)?|brass(?:-[a-z0-9-]+)?|coral(?:-[a-z0-9-]+)?|seafoam(?:-[a-z0-9-]+)?|signal-[a-z-]+|status-[a-z-]+|diff-(?:add|del)-[a-z-]+|rose-\d+|iris-\d+|anemone-\d+|current-\d+)$/;

/* ---- (a) the surface/text ramp is achromatic ---------------------------- */
test("every greyscale token is a true grey: |r-g| <= 2 and |g-b| <= 2", () => {
  let checked = 0;
  for (const { selector, body } of rules(tokens)) {
    if (!selector.startsWith(":root")) continue;
    for (const { prop, value } of declsOf(body)) {
      if (!prop.startsWith("--") || HUE_BEARING.test(prop)) continue;
      const hex = value.match(/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i);
      if (hex) {
        assert.ok(isAchromatic(hexChannels(hex[0])),
          `${prop}: ${value} is tinted; the chrome ramp must be pure grey`);
        checked += 1;
        continue;
      }
      // Bare triplets (--x-rgb: R G B) and literal rgb() legs must be grey too.
      const triplet = value.match(/^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})$/);
      if (triplet) {
        assert.ok(isAchromatic(triplet.slice(1, 4).map(Number)),
          `${prop}: ${value} is a tinted triplet; chrome alphas must be grey`);
        checked += 1;
        continue;
      }
      for (const literal of value.matchAll(/rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})/g)) {
        assert.ok(isAchromatic(literal.slice(1, 4).map(Number)),
          `${prop}: ${value} carries a tinted rgb() literal`);
        checked += 1;
      }
    }
  }
  assert.ok(checked >= 20, `only ${checked} greyscale tokens found; the ink ramp is missing`);
});

/* ---- (b) hex lives in tokens.css alone ---------------------------------- */
test("the styling layers introduce no colour outside the token file", () => {
  const instrumentLayer = main.slice(main.indexOf("INSTRUMENT LAYER"));
  assert.ok(main.includes("INSTRUMENT LAYER"), "the instrument layer marker is gone");
  assert.doesNotMatch(instrumentLayer, /#[0-9a-fA-F]{3,8}\b/, "the instrument layer must use tokens only");
  const homeAddition = home.slice(home.indexOf(".lp-instruments"));
  assert.doesNotMatch(homeAddition, /#[0-9a-fA-F]{3,8}\b/);
  assert.doesNotMatch(stripComments(typeCss), /#[0-9a-fA-F]{3,8}\b/, "type.css must not define colour");
});

/* ---- (c) colour only ever says status or role --------------------------- */
test("role and status hues exist, and never style base chrome", () => {
  for (const name of ["--role-pm", "--role-em", "--role-design", "--role-eng"]) {
    assert.match(tokens, new RegExp(`${name}:`), `${name} is missing from the token file`);
  }
  for (const name of ["--lumen-rgb", "--kelp-rgb", "--brass-rgb", "--coral-rgb"]) {
    assert.match(tokens, new RegExp(`${name}:\\s*\\d{1,3} \\d{1,3} \\d{1,3};`),
      `${name} must be a raw triplet so it can back text, dots, fills and borders`);
  }
  // The status semantics must ride the families, not private pastels.
  assert.match(tokens, /--signal-ok-rgb:\s*var\(--kelp-rgb\)/);
  assert.match(tokens, /--signal-warn-rgb:\s*var\(--brass-rgb\)/);
  assert.match(tokens, /--signal-crit-rgb:\s*var\(--coral-rgb\)/);

  // Any rule that paints with a hue token must be scoped to a state or a
  // role. Base chrome — nav, buttons, cards, body — never qualifies. Role
  // scoping is the roster's own key attribute: a selector pinned to
  // [data-role-key=…] paints the monogram that names an agent, which is the
  // second legitimate meaning this file's header describes.
  // --status-* and --diff-* joined the hue-bearing set with the expression
  // layer, so the walker polices them too. The scope matcher grew exactly
  // four admissions, each a state's own class: .is-writing (a reply being
  // composed), .console-typing (the composing shimmer, hidden otherwise),
  // and the two live utilities .dn-caret/.dn-livebar, which are applied
  // only while something genuinely streams.
  const HUE_REF = /var\(--(?:role-|signal-|status-|diff-|lumen|kelp|brass|coral|amber|warning|warn-a|crit-a)/;
  const STATE_SCOPED = /(data-tone|data-status|data-state|\[data-role-key=|\.is-(?:blocked|live|on|writing)\b|\.dn-(?:caret|livebar)\b|\.console-typing\b|danger|voided|error|warn|wait|crit|status|\.del\b|\.add\b|\.pr-ok\b)/;
  for (const [file, css] of [["main.css", main], ["home.css", home]]) {
    for (const { selector, body } of rules(css)) {
      for (const { prop, value } of declsOf(body)) {
        if (prop.startsWith("--")) continue; // token plumbing, not paint
        if (!HUE_REF.test(value)) continue;
        assert.match(selector, STATE_SCOPED,
          `${file}: "${selector}" paints chrome with a hue (${prop}: ${value}); colour must mean status or role`);
      }
    }
  }
});

/* ---- (d) the maths: ink on ground clears WCAG in both themes ------------ */
test("primary text and the primary action clear their ratios in both themes", () => {
  const { light, dark } = themeMaps();
  for (const [themeName, map] of [["light", light], ["dark", dark]]) {
    const surface = hexChannels(resolveVar(map, "var(--surface)"));
    const text = hexChannels(resolveVar(map, "var(--text)"));
    const muted = hexChannels(resolveVar(map, "var(--text-muted)"));
    const accent = hexChannels(resolveVar(map, "var(--accent)"));
    const textRatio = contrast(text, surface);
    assert.ok(textRatio >= 4.5, `${themeName}: primary text is ${textRatio.toFixed(2)}:1, want >= 4.5`);
    const mutedRatio = contrast(muted, surface);
    assert.ok(mutedRatio >= 4.5, `${themeName}: muted text is ${mutedRatio.toFixed(2)}:1, want >= 4.5`);
    // The one thing a visitor must do: an ink button whose label is the
    // page's own ground. Label 4.5:1 for text, edge 3:1 to be findable.
    const label = contrast(accent, surface);
    assert.ok(label >= 4.5, `${themeName}: primary action label is ${label.toFixed(2)}:1, want >= 4.5`);
    assert.ok(label >= 3, `${themeName}: primary action edge is ${label.toFixed(2)}:1, want >= 3`);
    // Actions are ink: the accent may not smuggle a hue back into the chrome.
    assert.ok(isAchromatic(accent), `${themeName}: --accent resolves to a hue; actions are ink`);
  }
  // And the button rules must take the theme-aware pair, so they invert together.
  assert.match(main, /\.button-github \{[^}]*background: var\(--accent\);/);
  assert.match(main, /\.button-github \{[^}]*color: var\(--surface\);/);
  assert.match(main, /\.lp-btn-github \{[^}]*background: var\(--accent\);/);
  assert.match(main, /\.lp-btn-github \{[^}]*color: var\(--surface\);/);
});

/* ---- (e) evidence is a typeface: mono carries the chrome labels --------- */
test("chrome labels are set in the machine's face, prose is not", () => {
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
  // The mono face is JetBrains Mono, self-hosted, with a system net under it.
  assert.match(tokens, /--font-mono:\s*"JetBrains Mono",[^;]*ui-monospace/,
    "--font-mono must lead with JetBrains Mono and fall back to the system stack");
  // Display and body are Bricolage Grotesque and Instrument Sans.
  assert.match(typeCss, /--font-display:\s*"Bricolage Grotesque"/);
  assert.match(typeCss, /--font-sans:\s*"Instrument Sans"/);
  // Each family is ONE variable file declaring the weight range the file's
  // own fvar table carries — never a range the browser would have to fake.
  for (const [family, file, range] of [
    ["Bricolage Grotesque", "bricolage-grotesque", "200 800"],
    ["Instrument Sans", "instrument-sans", "400 700"],
    ["JetBrains Mono", "jetbrains-mono", "400 800"],
  ]) {
    const face = new RegExp(
      `@font-face \\{\\n  font-family: "${family}";\\n  src: url\\("/assets/fonts/${file}\\.woff2"\\) format\\("woff2"\\);\\n  font-weight: ${range};`);
    assert.match(typeCss, face, `${family} must be one self-hosted variable woff2 spanning ${range}`);
  }
  assert.equal((stripComments(typeCss).match(/@font-face/g) || []).length, 3,
    "three families, three @font-face blocks - a variable font never needs one per weight");
  // The two preloads are the two files the first paint actually needs.
  const preloads = [...head.matchAll(/rel="preload" as="font"[^>]*\/assets\/fonts\/([a-z0-9-]+\.woff2)/g)]
    .map((m) => m[1]);
  assert.equal(preloads.length, 2, "exactly two font preloads: body 400 and display 700");
  const { statSync } = require("node:fs");
  for (const file of preloads) {
    assert.ok(typeCss.includes(`/assets/fonts/${file}`), `${file} is preloaded but never declared`);
    assert.ok(statSync(`assets/fonts/${file}`).size > 1000, `${file} is preloaded but missing on disk`);
  }
});

/* ---- carried guardrails --------------------------------------------------
   These predate the achromatic thesis and stay true under it. They live on
   here so replacing the old styling test never loosened the page itself. */

// The page is a ledger: each section is a label, a drawing of the mechanism,
// what it means, the facts, and the line naming where the reader can check it
// themselves. The verify line is the whole thesis - a claim that cannot be
// checked does not belong on this page.
test("the homepage reads as a ledger, section by section", () => {
  const labels = [...index.matchAll(/<p class="lp-label">([^<]+)<\/p>/g)].map((m) => m[1]);
  assert.deepEqual(labels, [
    "Unit of work", "The brief", "The roster", "The merge gate", "Built to converge",
    "Your GitHub", "Metered spend", "Price", "Not on the ledger",
  ], "the refusals are the last word before the ask, and money stays contiguous");
  assert.equal((index.match(/class="lp-facts[^"]*"/g) || []).length, 8);
  assert.equal((index.match(/class="lp-verify"/g) || []).length, 7);
  assert.doesNotMatch(
    index.slice(index.indexOf('<p class="lp-label">Not on the ledger</p>')),
    /class="lp-verify"/,
    "the refusals section must not claim a receipt it cannot produce");
  const figures = index.match(/<figure class="instrument-figure"[^>]*>/g) || [];
  assert.equal(figures.length, 7);
  for (const figure of figures) {
    assert.match(figure, /role="img"/);
    assert.match(figure, /aria-label="[^"]{50,}"/, "every drawing needs a real description, not a stub");
  }
  assert.equal((index.match(/<pre aria-hidden="true">/g) || []).length, 7);
  assert.equal((index.match(/<li><strong>/g) || []).length, 4);
});

// Five destinations, not the sitemap.
test("the navigation is lean and every label points at a page that exists", () => {
  const links = [...header.matchAll(/href="\{\{ '([^']+)' \| relative_url \}\}"[^>]*>([^<]+)</g)]
    .map((m) => ({ route: m[1], label: m[2].trim() }))
    .filter((link) => !link.route.includes("/app/") && link.route !== "/");
  const labels = [...new Set(links.map((link) => link.label))];
  assert.deepEqual(labels.sort(), ["Docs", "Ledger", "Security", "What it costs", "How it works"].sort());
  assert.doesNotMatch(header, />Economics</, "Economics was our word for that page; the reader's word is Ledger");
  assert.match(index, /^hide_cta: true$/m,
    "the homepage writes its own closing CTA, so the shared one must be suppressed");
});

// A monospace drawing cannot reflow — its lines are a grid — so it must scroll
// inside its own frame, and grid items must be allowed to shrink.
test("nothing widens the page on a narrow screen", () => {
  assert.match(home, /\.lp-hero-grid > \*,\s*\n\.lp-shell > \* \{ min-width: 0; \}/,
    "grid items must be allowed to shrink below their content");
  assert.match(home, /\.instrument-figure > pre \{[^}]*overflow-x: auto;/,
    "the drawing scrolls inside its frame, never the page");
  assert.match(home, /\.instrument-figure \{ max-width: 100%; \}/);
});

// The console is shown, not just described.
test("the console is shown, not just described", () => {
  assert.match(index, /<figure class="console-shot"[^>]*aria-label="[^"]{60,}"/,
    "the console depiction needs a real description for anyone who cannot see it");
  assert.match(index, /<ol class="console-stream">/);
  assert.equal((index.match(/<li><span>\d{2}:\d{2}:\d{2}<\/span>/g) || []).length, 5);
  assert.match(index, /class="console-msg is-you"/);
  assert.match(index, /class="console-msg is-pm"/);
  assert.match(index, /class="console-writing">still writing</);
  assert.match(home, /\.console-stream span \{[^}]*tabular-nums/, "timestamps must line up");
  assert.match(home, /@keyframes console-caret/);
  assert.match(index, /<span class="console-caret" aria-hidden="true">/);
});

// The mark is fine line art and a favicon is 16 pixels; the rasters stay.
test("the icon ships raster sizes for the ones the vector cannot win", () => {
  const { statSync } = require("node:fs");
  assert.match(head, /rel="icon"[^>]*favicon\.svg[^>]*type="image\/svg\+xml"/,
    "the vector stays the primary icon");
  for (const size of [16, 32]) {
    assert.match(head, new RegExp(`icon-${size}\\.png[^>]*sizes="${size}x${size}"`),
      `the ${size}px raster is not declared`);
  }
  assert.match(head, /rel="apple-touch-icon"[^>]*icon-180\.png/);
  for (const size of [16, 32, 48, 180, 192, 512]) {
    const file = `assets/images/icons/icon-${size}.png`;
    assert.ok(statSync(file).size > 200, `${file} is missing or empty`);
  }
  const generator = readFileSync("scripts/generate_icons.mjs", "utf8");
  assert.match(generator, /new Map\(\[\[16, 20\], \[32, 8\], \[48, 0\]/,
    "the stroke compensation must fall as the grid grows and reach zero by 48px");
  assert.doesNotMatch(generator, /-Z |sips/, "sizes are rendered, never downsampled");
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  assert.equal(pkg.scripts.icons, "node scripts/generate_icons.mjs");
});
