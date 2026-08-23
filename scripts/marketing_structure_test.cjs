"use strict";

// The marketing rebuild's load-bearing structures, pinned. The homepage
// follows the design system's marketing kit — ghosted mark hero, six-cell
// crew strip, two ink bands, objective records, the activity ledger — while
// the COPY stays the shipped, corrected claims: the hero promise, the
// you-are-needed-twice doctrine, and a step four that ends at the ruleset
// and the acceptance runs, never at an agent's opinion of "done".

const assert = require("node:assert/strict");
const { readFileSync, statSync } = require("node:fs");
const test = require("node:test");

const index = readFileSync("index.md", "utf8");
const pricing = readFileSync("pricing/index.md", "utf8");
const home = readFileSync("assets/css/home.css", "utf8");
const main = readFileSync("assets/css/main.css", "utf8");
const tokens = readFileSync("assets/css/tokens.css", "utf8");
const layout = readFileSync("_layouts/default.html", "utf8");
const motion = readFileSync("assets/js/marketing-motion.js", "utf8");

/* ---- the hero: shipped copy in the kit's shape ------------------------- */
test("the hero keeps the corrected promise, and the ghost mark is masked, never an <img>", () => {
  assert.match(index, /<h1 class="lp-h1">Six specialists\. <em>You define done\. They prove it<\/em>\.<\/h1>/,
    "the shipped hero promise is the page's one h1");
  assert.equal((index.match(/<h1\b/g) || []).length, 1);
  // The watermark: a masked element painting currentColor, so one file
  // follows both themes. An SVG in an <img> is its own document and cannot
  // inherit the page colour — it would render one theme wrong.
  assert.match(index, /<span class="lp-mark" aria-hidden="true"><\/span>/);
  assert.doesNotMatch(index, /<img[^>]*mark/i, "the mark is painted through a mask, never an <img>");
  assert.match(home, /\.lp-mark,\n\.lp-mark-badge \{[^}]*background: currentColor;/);
  assert.match(home, /mask: url\("\/assets\/images\/deep-navy-mark-ghost\.svg"\) center \/ contain no-repeat;/);
  // The mask asset is the supplied mark with the tile removed: transparent
  // ground (a full-bleed rect would mask everything, hiding nothing).
  const ghost = readFileSync("assets/images/deep-navy-mark-ghost.svg", "utf8");
  assert.ok(statSync("assets/images/deep-navy-mark-ghost.svg").size > 1000, "the mask asset is missing");
  assert.doesNotMatch(ghost, /<rect/, "the mask asset must have a transparent ground");
  // Watermark opacity, both themes — decorative use stays a watermark.
  assert.match(home, /\.lp-mark \{[^}]*opacity: \.05;/);
  assert.match(home, /:root\[data-theme="dark"\] \.lp-mark \{ opacity: \.06; \}/);
  // The eyebrow's dot claims "live" through a status scope, with words beside it.
  assert.match(index, /<span class="lp-live" data-status="live" aria-hidden="true"><\/span> Early access · founding teams/);
  assert.match(home, /\.lp-live\[data-status="live"\] \{[^}]*var\(--status-live-dot\)/);
});

/* ---- the crew strip: role tint identifies, never decorates -------------- */
test("the crew strip is six cells, each role-scoped with its monogram beside the tint", () => {
  const cells = [...index.matchAll(/<li class="lp-crew-cell" data-role-key="([A-Z_]+)">/g)].map((m) => m[1]);
  assert.deepEqual(cells, [
    "AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER",
    "AGENT_ROLE_ENGINEERING_MANAGER",
    "AGENT_ROLE_PRODUCT_DESIGNER",
    "AGENT_ROLE_STAFF_CLIENT",
    "AGENT_ROLE_STAFF_BACKEND",
    "AGENT_ROLE_STAFF_PLATFORM",
  ], "six cells, the roster's own keys, in the roster's own order");
  // A role tint never appears without the agent's monogram: every cell
  // carries the app's own monogram plate under the same key.
  for (const key of cells) {
    assert.ok(index.includes(`<span class="user-avatar lp-crew-monogram" data-role-key="${key}"`),
      `${key} is missing its monogram plate`);
  }
  // The tint itself is defined only under the roster scope — the cell's top
  // edge and uppercase name ride the custom property, never a raw role token.
  assert.match(home, /\.lp-crew-cell\[data-role-key="AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER"\] \{ --dn-role: var\(--role-pm\); \}/);
  assert.match(home, /\.lp-crew-cell\[data-role-key="AGENT_ROLE_ENGINEERING_MANAGER"\] \{ --dn-role: var\(--role-em\); \}/);
  assert.match(home, /\.lp-crew-cell\[data-role-key="AGENT_ROLE_PRODUCT_DESIGNER"\] \{ --dn-role: var\(--role-design\); \}/);
  assert.match(home, /\.lp-crew-cell\[data-role-key="AGENT_ROLE_STAFF_PLATFORM"\] \{ --dn-role: var\(--role-eng\); \}/);
  // Top edge, not left — a full-width rule under the whole cell.
  assert.match(home, /\.lp-crew-cell \{[^}]*border-top: 2px solid var\(--dn-role, var\(--line\)\);/);
});

/* ---- the ink bands: exactly two, scoped in the markup ------------------- */
test("exactly two ink bands, each carrying data-theme in its own markup", () => {
  const bands = index.match(/<section class="lp-band-ink"[^>]*>/g) || [];
  assert.equal(bands.length, 2, "maximum two ink bands per page, and this page uses both");
  for (const band of bands) assert.match(band, /data-theme="dark"/,
    "an inverted band carries data-theme in the markup — never a colour patch");
  assert.equal((index.match(/data-theme="dark"/g) || []).length, 2,
    "nothing else on the page flips a theme scope");
  // The mechanism: tokens.css re-resolves its theme blocks at ANY
  // [data-theme=…] element and restarts colour inheritance there.
  assert.match(tokens, /:root\[data-theme="dark"\],\n\[data-theme="dark"\] \{/);
  assert.match(tokens, /:root\[data-theme="light"\],\n\[data-theme="light"\] \{/);
  assert.match(tokens, /\[data-theme\] \{ color: var\(--text\); \}/);
  assert.match(home, /\.lp-band-ink \{[^}]*background: var\(--surface-sunken\);/);
});

/* ---- the four steps: the doctrine survives verbatim ---------------------- */
test("the steps band keeps 'you are needed twice' and ends at the ruleset plus acceptance runs", () => {
  assert.ok(index.includes(
    "You are needed twice: once to choose the repositories, and once to sign off the PRD. After that you are a reader, not a manager."),
    "the you-are-needed-twice sentence survives verbatim — it is true and excellent");
  assert.equal((index.match(/class="lp-step-title"/g) || []).length, 4);
  assert.ok(index.includes(
    "GitHub's ruleset merges only on approvals from two engineers who did not write it plus the manager. Every merge runs the acceptance suite; done is a passing run."),
    "step four ends at the ruleset and the acceptance runs — never at an agent's belief");
});

/* ---- the objective records: the app's real treatments -------------------- */
test("three objective records ride the app's own check plate, one per state", () => {
  for (const state of ["proven", "running", "regressed"]) {
    assert.equal((index.match(new RegExp(`<span class="obj-check" data-state="${state}"`, "g")) || []).length, 1,
      `exactly one ${state} record`);
    assert.equal((index.match(new RegExp(`<li class="lp-objective dn-reveal" data-state="${state}">`, "g")) || []).length, 1);
  }
  // Colour is never the only cue: each record carries its state as a word.
  assert.equal((index.match(/class="lp-objective-word"/g) || []).length, 3);
  // Regressed is a distinct fact from never-proven, and says so.
  assert.match(index, /was proven for 11 days · last run on main <b>failed<\/b> → objective re-opened/);
  // The measures speak the doctrine: number → threshold · source.
  assert.equal((index.match(/class="lp-objective-measure"/g) || []).length, 3);
});

/* ---- the pull request card: the merge gate's illustration ---------------- */
test("the PR card left the hero and illustrates the merge gate", () => {
  const hero = index.slice(0, index.indexOf('class="lp-crew-band"'));
  assert.doesNotMatch(hero, /<figure/, "the hero carries the ghost mark, not a figure");
  const gateAt = index.indexOf('<p class="lp-label">The merge gate</p>');
  const prAt = index.indexOf('<figure class="pr dn-reveal"');
  const convergeAt = index.indexOf('<p class="lp-label">Built to converge</p>');
  assert.ok(gateAt !== -1 && prAt > gateAt && prAt < convergeAt,
    "the pull request figure belongs to the merge-gate section");
  // Its reviews still choreograph — gated on the scroll reveal, failing open.
  assert.match(home, /\.dn-motion-ready \.pr\.dn-reveal \.pr-review \{[^}]*animation-play-state: paused;/);
  assert.match(home, /\.dn-motion-ready \.pr\.dn-reveal\.is-in \.pr-review \{ animation-play-state: running; \}/);
});

/* ---- proof cells ---------------------------------------------------------- */
test("the proof numbers are the shipped claims: 3 approvals, 0 extra repos, 1 query", () => {
  const nums = [...index.matchAll(/<span class="lp-proof-num">(\d+)<\/span>/g)].map((m) => m[1]);
  assert.deepEqual(nums, ["3", "0", "1"]);
  assert.match(index, /query answers what a pull request cost/);
});

/* ---- motion: the reveal fails open ---------------------------------------- */
test("the marketing observer arms the reveal and nothing hides without it", () => {
  assert.match(layout, /marketing-motion\.js' \| relative_url \}\}" defer><\/script>/,
    "the observer loads defer on the marketing layout");
  // dn-motion-ready lands only once the observer is actually observing, and
  // never under reduced motion — so blocked script simply shows the content.
  assert.match(motion, /prefers-reduced-motion: reduce/);
  assert.match(motion, /"IntersectionObserver" in window/);
  const readyAt = motion.indexOf('classList.add("dn-motion-ready")');
  const observeAt = motion.indexOf("observer.observe(target)");
  assert.ok(readyAt !== -1 && observeAt !== -1 && readyAt < observeAt);
  assert.doesNotMatch(motion, /\.style\b/, "the observer toggles classes, never element.style");
  // Stagger indices come from CSS position, so no markup carries an inline style.
  assert.match(home, /\.lp-stagger-reveal > :nth-child\(2\) \{ --dn-i: 1; \}/);
  assert.doesNotMatch(index, /\sstyle="/, "no inline styles on the homepage");
  assert.doesNotMatch(pricing, /\sstyle="/, "no inline styles on the pricing page");
});

/* ---- the mobile sheet: full-height, display type, staggered ---------------- */
test("the mobile nav is the kit's full-height sheet", () => {
  assert.match(main, /\.mobile-menu nav \{[^}]*position: fixed;/);
  assert.match(main, /\.mobile-menu nav \{[^}]*inset: 68px 0 0 0;/,
    "the sheet hangs below the bar — a full-inset sheet would cover the burger that closes it");
  assert.match(main, /\.mobile-menu nav a:not\(\.button\) \{[^}]*font-family: var\(--font-display\);/,
    "sheet links are display type — the kit's grammar, not a shrunken desktop menu");
  assert.match(main, /\.mobile-menu nav > :nth-child\(7\) \{ animation-delay: calc\(6 \* var\(--stagger-step\)\); \}/,
    "the sheet's links arrive one --stagger-step apart");
  assert.match(main, /\.mobile-menu nav a:not\(\.button\) \{[^}]*min-height: 44px;/, "thumb targets stay 44px");
});

/* ---- pricing: the kit's plans and FAQ over the real numbers ---------------- */
test("pricing restyles the contracted numbers — it invents none", () => {
  assert.match(pricing, /<span class="lp-plan-price">\$599 <span class="lp-plan-per">per team · month<\/span><\/span>/);
  assert.match(pricing, /<span class="lp-plan-price">\$199 <span class="lp-plan-per">per engineer · month<\/span><\/span>/);
  assert.match(pricing, /<span class="lp-plan-price">\$100 <span class="lp-plan-per">per 10,000 credits<\/span><\/span>/);
  assert.equal((pricing.match(/class="lp-plan-price"/g) || []).length, 3, "three prices exist; a fourth would be invented");
  assert.match(pricing, /class="lp-plan lp-plan-featured dn-reveal"/, "the team plan is the featured card");
  // The terms table — the contract, field by field — survives the restyle.
  assert.match(pricing, /<table class="data-table">/);
  assert.match(pricing, /1 credit = \$0\.01 of billable model, compute, storage, and service usage/);
  // FAQ: answers on the page in the kit's two-column grammar, not behind
  // disclosure clicks — find-in-page works, comparison scans work.
  assert.equal((pricing.match(/class="lp-faq-q"/g) || []).length, 5);
  assert.doesNotMatch(pricing, /<details>/, "the FAQ no longer hides its answers");
  assert.match(home, /\.lp-faq \{ display: grid; grid-template-columns: 1fr;/);
});

/* ---- the two-way class check: markup and stylesheet name the same things -- */
test("every lp- class the pages use exists in home.css, and none is orphaned", () => {
  const used = new Set();
  for (const source of [index, pricing]) {
    for (const m of source.matchAll(/class="([^"]+)"/g)) {
      for (const cls of m[1].split(/\s+/)) if (cls.startsWith("lp-")) used.add(cls);
    }
  }
  const defined = new Set();
  for (const m of home.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/\.(lp-[a-z0-9-]+)/g)) defined.add(m[1]);
  const missing = [...used].filter((cls) => !defined.has(cls)).sort();
  assert.deepEqual(missing, [], `markup uses lp- classes home.css never styles: ${missing.join(", ")}`);
  // States (.lp-plan-featured pairs with .lp-plan, .lp-hero-sub with
  // .lp-hero, …) appear in markup beside their base class, so the reverse
  // check is exact: a selector with no markup is dead weight.
  const orphans = [...defined].filter((cls) => !used.has(cls)).sort();
  assert.deepEqual(orphans, [], `home.css styles lp- classes no marketing page uses: ${orphans.join(", ")}`);
});
