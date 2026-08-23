"use strict";

// The expression layer: role colour, status colour, and the motion
// vocabulary — the layer that makes a coloured pixel information and an
// animation an answer to "what just changed?". These pin its three
// commitments:
//
//   1. Identity and status speak through theme-dependent alias sets that
//      exist in BOTH themes, so no tint can strand on one theme.
//   2. Motion rides one token scale (with the 2:3:4 ambient beats) and
//      NEVER transitions a colour property — a colour transition resolves
//      against the outgoing theme and strands mid-swap, which is exactly
//      how a themed element ends up invisible.
//   3. Arrival motion is earned, not decorative: only a row the stream
//      just delivered flashes, exactly once, and a changed instrument
//      reading replays its tick through classList and one layout read.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const tokens = readFileSync("assets/css/tokens.css", "utf8");
const main = readFileSync("assets/css/main.css", "utf8");
const home = readFileSync("assets/css/home.css", "utf8");
const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/* ---- the same tiny CSS reader the achromatic test trusts ------------- */
function rules(css) {
  const out = [];
  const src = stripComments(css);
  let i = 0;
  const walk = (media, atName) => {
    while (i < src.length) {
      while (i < src.length && /\s/.test(src[i])) i += 1;
      if (i >= src.length) return;
      if (src[i] === "}") { i += 1; return; }
      const brace = src.indexOf("{", i);
      if (brace === -1) { i = src.length; return; }
      const selector = src.slice(i, brace).trim();
      i = brace + 1;
      if (selector.startsWith("@media") || selector.startsWith("@supports")) {
        walk(selector, atName);
        continue;
      }
      if (selector.startsWith("@keyframes")) {
        walk(media, selector.replace("@keyframes", "").trim());
        continue;
      }
      if (selector.startsWith("@")) { // @font-face, @page …
        let depth = 1;
        while (i < src.length && depth > 0) {
          if (src[i] === "{") depth += 1;
          else if (src[i] === "}") depth -= 1;
          i += 1;
        }
        continue;
      }
      const end = src.indexOf("}", i);
      const body = src.slice(i, end === -1 ? src.length : end);
      i = end === -1 ? src.length : end + 1;
      out.push({ media, keyframes: atName || null, selector, body });
    }
  };
  walk(null, null);
  return out;
}

const declsOf = (body) => body.split(";").map((d) => {
  const at = d.indexOf(":");
  return at === -1 ? null : { prop: d.slice(0, at).trim(), value: d.slice(at + 1).trim() };
}).filter(Boolean);

// Custom-property maps per theme, from tokens.css itself.
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

/* ---- (1) identity and status exist in both themes -------------------- */
test("every role alias ships fg, -soft and -border in BOTH theme scopes", () => {
  const { light, dark } = themeMaps();
  for (const role of ["pm", "em", "design", "eng"]) {
    for (const suffix of ["", "-soft", "-border"]) {
      const name = `--role-${role}${suffix}`;
      assert.ok(light.has(name), `${name} is missing from the light theme`);
      assert.ok(dark.has(name), `${name} is missing from the dark theme`);
      assert.notEqual(light.get(name), dark.get(name),
        `${name} is identical in both themes; the alias would strand on one treatment`);
    }
  }
  // The explicit data-theme choices must restate the values, so the toggle
  // beats the media query in both directions.
  const explicitDark = tokens.slice(tokens.indexOf(':root[data-theme="dark"]'), tokens.indexOf(':root[data-theme="light"]'));
  const explicitLight = tokens.slice(tokens.indexOf(':root[data-theme="light"]'));
  for (const block of [explicitDark, explicitLight]) {
    for (const role of ["pm", "em", "design", "eng"]) {
      assert.match(block, new RegExp(`--role-${role}-soft:`), "role aliases must be restated under the explicit theme choice");
    }
  }
});

test("the four status alias sets carry fg/bg/border/dot in BOTH themes", () => {
  const { light, dark } = themeMaps();
  for (const status of ["live", "success", "attention", "danger", "idle"]) {
    for (const part of ["fg", "bg", "border", "dot"]) {
      const name = `--status-${status}-${part}`;
      assert.ok(light.has(name), `${name} is missing from the light theme`);
      assert.ok(dark.has(name), `${name} is missing from the dark theme`);
    }
  }
  // Diff evidence aliases ride the same families.
  for (const name of ["--diff-add-bg", "--diff-add-fg", "--diff-del-bg", "--diff-del-fg"]) {
    assert.ok(light.has(name) && dark.has(name), `${name} must exist in both themes`);
  }
});

/* ---- (2) the motion scale and its rules ------------------------------ */
test("the motion tokens exist and the ambient loops keep the 2:3:4 relation", () => {
  const { light } = themeMaps();
  for (const name of [
    "--dur-instant", "--dur-micro", "--dur-fast", "--dur-base", "--dur-slow", "--dur-slower",
    "--dur-loop-fast", "--dur-loop", "--dur-ambient", "--dur-drift",
    "--stagger-step", "--press-scale", "--transition-control",
    "--ease-standard", "--ease-out", "--ease-in", "--ease-in-out", "--ease-arrive", "--ease-spring",
  ]) {
    assert.ok(light.has(name), `${name} is missing from tokens.css`);
  }
  const ms = (name) => Number.parseFloat(light.get(name));
  assert.equal(ms("--dur-loop-fast") / 2, ms("--dur-loop") / 3, "loop-fast : loop must be 2 : 3");
  assert.equal(ms("--dur-loop") / 3, ms("--dur-ambient") / 4, "loop : ambient must be 3 : 4");
  assert.equal(ms("--dur-drift"), ms("--dur-ambient") * 2, "drift is the octave of ambient");
  // The arrive curve overshoots — that is what makes it an arrival.
  assert.match(light.get("--ease-arrive"), /1\.28/);
});

test("the motion utilities ship, and the reveal fails open", () => {
  for (const cls of [".dn-stagger", ".dn-in", ".dn-in-log", ".dn-reveal", ".dn-sweep", ".dn-tick", ".dn-shake", ".dn-flash", ".dn-caret", ".dn-livebar", ".dn-odometer", ".dn-press"]) {
    assert.ok(stripComments(main).includes(cls), `${cls} is missing from main.css`);
  }
  for (const frame of ["dn-rise", "dn-breathe", "dn-tick", "dn-shake", "dn-flash", "dn-caret", "dn-sweep", "dn-travel", "dn-pop", "dn-sonar"]) {
    assert.match(main, new RegExp(`@keyframes ${frame} `), `@keyframes ${frame} is missing`);
  }
  // FAIL OPEN: the hidden state must be scoped to .dn-motion-ready. A bare
  // .dn-reveal rule that sets opacity:0 will eventually hide something
  // permanently on any page where the observer never runs.
  assert.match(main, /\.dn-motion-ready \.dn-reveal:not\(\.is-in\) \{ opacity: 0;/);
  for (const { selector, body } of rules(main)) {
    if (selector === ".dn-reveal") {
      assert.doesNotMatch(body, /opacity:\s*0/, "bare .dn-reveal must never default to hidden");
    }
  }
  // The reduced-motion collapse survives in both files that animate.
  assert.match(tokens, /prefers-reduced-motion: reduce/);
  assert.match(main, /prefers-reduced-motion: reduce/);
  // Hover-gated: the layer's own hover motion lives behind the capability
  // query, so a tap cannot leave a sweep or a nudge stuck mid-flight.
  for (const { media, selector } of rules(main)) {
    const layerHover = (/^\.dn-/.test(selector) && selector.includes(":hover"))
      || selector === ".button-primary:hover::after";
    if (!layerHover) continue;
    assert.ok(media && /hover:\s*hover/.test(media),
      `${selector} hovers outside @media (hover: hover)`);
  }
});

test("no transition animates a colour property, in either stylesheet", () => {
  const COLOUR_LEG = /^(background|background-color|color|border-color|border|outline-color|fill|stroke)$/;
  // Split a transition value into legs at top-level commas only, so
  // cubic-bezier(.2, 0, 0, 1) stays one token stream.
  const legsOf = (value) => {
    const legs = [];
    let depth = 0;
    let current = "";
    for (const ch of value) {
      if (ch === "(") depth += 1;
      if (ch === ")") depth -= 1;
      if (ch === "," && depth === 0) { legs.push(current.trim()); current = ""; continue; }
      current += ch;
    }
    if (current.trim()) legs.push(current.trim());
    return legs;
  };
  for (const [file, css] of [["main.css", main], ["home.css", home]]) {
    for (const { selector, body, keyframes } of rules(css)) {
      if (keyframes) continue;
      for (const { prop, value } of declsOf(body)) {
        if (prop !== "transition" && prop !== "transition-property") continue;
        for (const leg of legsOf(value)) {
          const first = leg.split(/\s+/)[0];
          if (first === "var(--transition-control)") continue; // audited below
          assert.doesNotMatch(first, COLOUR_LEG,
            `${file}: "${selector}" transitions ${first}; a colour transition strands on the outgoing theme`);
        }
      }
    }
  }
  // The shared control transition itself may only name the three safe
  // properties.
  const control = /--transition-control:([^;]+);/.exec(tokens);
  assert.ok(control, "--transition-control is missing");
  for (const leg of control[1].split(/,(?![^(]*\))/)) {
    assert.match(leg.trim().split(/\s+/)[0], /^(transform|opacity|box-shadow)$/,
      `--transition-control carries an unsafe property: ${leg.trim()}`);
  }
  // Keyframes may touch a colour in exactly one place: the one-shot
  // dn-flash, which animates FROM a resolved overlay TO transparent and
  // cannot strand across a swap.
  for (const [file, css] of [["main.css", main], ["home.css", home]]) {
    for (const { keyframes, body } of rules(css)) {
      if (!keyframes) continue;
      if (/(?:^|[^-])(background-color|border-color|color)\s*:/.test(body)) {
        assert.equal(keyframes, "dn-flash",
          `${file}: @keyframes ${keyframes} animates a colour property`);
      }
    }
  }
});

/* ---- (3) arrival motion is earned ------------------------------------ */
test("only a freshly streamed row earns .dn-in-log, exactly once", () => {
  // Marked on the append path, gated on recency so the connect replay
  // paints still…
  const append = app.slice(app.indexOf("function appendActivityEvent(event)"), app.indexOf("function replaceActivityProjections"));
  assert.match(append, /session\.freshActivityIds\.add\(entry\.id\)/);
  assert.match(append, /occurredMs\) && Date\.now\(\) - occurredMs <= 90 \* 1000/);
  // …consumed on the first paint, so a filter change or projection refresh
  // can never replay the motion…
  const render = app.slice(app.indexOf("function renderActivityLedger()"), app.indexOf("const SETUP_SENTENCE"));
  assert.match(render, /item\.classList\.add\("dn-in-log"\)/);
  assert.match(render, /session\.freshActivityIds\.delete\(entry\.id\)/);
  const marks = render.indexOf('classList.add("dn-in-log")');
  const consumes = render.indexOf("freshActivityIds.delete");
  assert.ok(marks !== -1 && consumes !== -1 && marks < consumes, "the class lands before the mark is consumed");
  // …and torn down with the view.
  const reset = app.slice(app.indexOf("function resetActivityView("), app.indexOf("function resetSessionHistoryView("));
  assert.match(reset, /session\.freshActivityIds = new Set\(\)/);
  // The utility itself rises then flashes once — never an infinite loop.
  assert.match(main, /\.dn-in-log \{ animation: dn-rise[^}]*dn-flash[^}]*both; \}/);
  assert.doesNotMatch(/\.dn-in-log \{[^}]*\}/.exec(main)[0], /infinite/);
});

test("the livebar is set exactly where the stream's own state is set", () => {
  assert.match(app, /function setLogLive\(on\)/);
  assert.match(app, /head\.classList\.toggle\("dn-livebar", Boolean\(on\)\)/);
  // On: only when the stream establishes.
  const established = app.slice(app.indexOf("const markStreamEstablished"), app.indexOf("const establishTimer"));
  assert.match(established, /setLogLive\(true\)/);
  assert.equal((app.match(/setLogLive\(true\)/g) || []).length, 1, "only the establish beat may claim the stream is live");
  // Off: teardown, reset, and both terminal failure paths.
  for (const marker of ["function stopRuntimeActivityStream()", "function resetActivityView("]) {
    const at = app.indexOf(marker);
    assert.match(app.slice(at, at + 700), /setLogLive\(false\)/, `${marker} must stand the livebar down`);
  }
  assert.ok((app.match(/setLogLive\(false\)/g) || []).length >= 4, "every dead-stream path stands the livebar down");
});

test("a changed instrument reading replays its tick without element.style", () => {
  const helper = app.slice(app.indexOf("function setStatValue(element, text)"), app.indexOf("function renderStatStrip()"));
  assert.match(helper, /if \(element\.textContent === text\) return;/);
  assert.match(helper, /classList\.remove\("dn-tick"\)/);
  assert.match(helper, /void element\.offsetWidth;/);
  assert.match(helper, /classList\.add\("dn-tick"\)/);
  assert.doesNotMatch(helper, /\.style\b/);
  const render = app.slice(app.indexOf("function renderStatStrip()"), app.indexOf("function agentRoleLabel("));
  for (const cell of ["statObjectives", "statCredits", "statDelivery", "statAgents"]) {
    assert.match(render, new RegExp(`setStatValue\\(ui\\.${cell},`), `${cell} must tick through the helper`);
  }
  // The strip's values are odometers: tabular figures, no reflow.
  assert.match(shell, /class="statcell-value dn-odometer" data-stat-objectives/);
  assert.match(main, /\.dn-odometer \{ font-variant-numeric: tabular-nums; display: inline-block; \}/);
});

/* ---- the crown jewels, pinned ----------------------------------------- */
test("the crew monogram plate carries the role code, and only a working agent breathes", () => {
  const roster = app.slice(app.indexOf("function renderAgentsResult(result, teamId)"), app.indexOf("function latestActivityForRole"));
  assert.match(roster, /monogram\.className = "user-avatar crew-monogram"/);
  assert.match(roster, /monogram\.dataset\.roleKey = canonicalRole\.key/);
  assert.match(roster, /monogram\.textContent = canonicalRole\.code/);
  // The breathing ring exists only under the liveness class, at the
  // ambient beat, in the role's own colour (currentColor from the plate).
  assert.match(main, /\.app-body \.crew-row\.is-on \.crew-monogram::after \{[^}]*dn-breathe var\(--dur-ambient\)/s);
  for (const { selector, body } of rules(main)) {
    if (!selector.includes(".crew-monogram::after") || !/animation/.test(body)) continue;
    assert.match(selector, /\.is-on\b/, "a resting plate must not breathe");
  }
  // The hero monogram answers the same question from the same source.
  assert.match(app, /ui\.agentMonogram\.classList\.toggle\("is-on", on\)/);
  assert.match(main, /\.agent-monogram\.is-on::after \{[^}]*dn-breathe var\(--dur-ambient\)/s);
});

test("the ledger speaks in voices: role-tinted actor, role-tinted rail, status-worded meta", () => {
  const item = app.slice(app.indexOf("function activityLedgerItem(entry, evidence)"), app.indexOf("function renderActivityLedger()"));
  assert.match(item, /actor\.className = "ledger-actor"/);
  assert.match(item, /actor\.dataset\.roleKey = actorRole\.key/);
  assert.match(item, /item\.dataset\.roleKey = actorRole\.key/);
  assert.match(item, /span\.dataset\.status = value\.toLowerCase\(\)/);
  // Every actor rule is scoped to the roster's own key.
  assert.match(main, /\.ledger-actor\[data-role-key="AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER"\] \{ color: var\(--role-pm\); \}/);
  assert.match(main, /\.customer-activity-item\[data-role-key="AGENT_ROLE_ENGINEERING_MANAGER"\] \.customer-activity-details \{ border-left-color: var\(--role-em-border\); \}/);
});

test("merged work carries the engineers' azure — the deliberate signature", () => {
  assert.match(main, /\.customer-activity-meta \[data-status="merged"\] \{ color: var\(--role-eng\); \}/);
  assert.match(main, /\.descent-item\[data-status="merged"\]::before \{ background: var\(--role-eng\); \}/);
  // And its neighbours stay status, not identity: open is kelp, review
  // waits in brass.
  assert.match(main, /\.customer-activity-meta \[data-status="open"\] \{ color: var\(--status-success-fg\); \}/);
  assert.match(main, /\.descent-band\[data-state="review"\] \.descent-item::before \{ background: var\(--status-attention-dot\); \}/);
  assert.match(app, /row\.dataset\.status = stringValue\(entry\.status\) === "merged" \? "merged" : "closed"/);
});

test("the objective check plate proves, breathes or shakes — and the tick opposes the fill in both themes", () => {
  assert.match(app, /function objectivePlateState\(objective, acceptanceState\)/);
  assert.match(app, /check\.dataset\.state = objectivePlateState\(objective, acceptanceState\)/);
  assert.match(app, /ui\.objectiveCheck\.dataset\.state = objectivePlateState\(objective, objectiveAcceptanceState\(objective\)\)/);
  assert.match(shell, /class="obj-check" data-objective-check aria-hidden="true"/);
  // Proven: kelp plate, tick scales in, tick colour is the page surface —
  // white on the darker light-theme kelp, black on the lighter dark kelp.
  assert.match(main, /\.obj-check\[data-state="proven"\] \{ background: var\(--status-success-dot\); border-color: var\(--status-success-dot\); color: var\(--surface\); \}/);
  assert.match(main, /\.obj-check\[data-state="proven"\]::before \{ content: "✓"; animation: dn-tick/);
  assert.match(main, /\.obj-check\[data-state="running"\]::before \{[^}]*dn-breathe var\(--dur-loop\)/);
  assert.match(main, /\.obj-check\[data-state="regressed"\] \{[^}]*animation: dn-shake/);
});
