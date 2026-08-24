"use strict";

// The console's chrome, and the one thing about it that is a decision rather
// than a detail: the rail has TWO SCOPES.
//
// Organization doors — Teams, People, Billing — are about the account and every
// team in it. Team doors — Dashboard, Activity, Runs, Economics, Decisions,
// Settings — are about the one team the switcher has selected. Before this the
// six doors sat in one flat list behind a "…" summary, which put "Your teams"
// under the same heading as the selected team's own screens and hid six real
// destinations behind three dots. The switcher sits BETWEEN the two groups
// because it is the boundary between them, and that ordering is what this file
// exists to keep.
//
// It also holds the two rules that make the navigation honest: every door the
// rail offers must open a section that exists, and a section that has no data
// yet must say so in its own words rather than render an empty screen.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const shell = readFileSync("_includes/app-shell.html", "utf8");
const layout = readFileSync("_layouts/app.html", "utf8");
const head = readFileSync("_includes/head.html", "utf8");
const views = readFileSync("assets/js/app-views.js", "utf8");
const console_ = readFileSync("assets/css/console.css", "utf8");
const themeToggle = readFileSync("assets/js/theme-toggle.js", "utf8");
const icons = readFileSync("_includes/icons.svg", "utf8");
const app = readFileSync("assets/js/app.js", "utf8");
const main = readFileSync("assets/css/main.css", "utf8");

const ORG = ["dashboard", "people", "billing"];
const TEAM = ["overview", "activity", "runs", "economics", "approvals", "settings"];

/* ---- the rail ----------------------------------------------------------- */

test("the rail opens with the account card, then the two named scopes", () => {
  assert.match(views, /const ORG_VIEWS = \["dashboard", "people", "billing"\];/);
  assert.match(views, /const TEAM_VIEWS = \["overview", "activity", "runs", "economics", "approvals", "settings"\];/);
  assert.match(views, /const VIEWS = ORG_VIEWS\.concat\(TEAM_VIEWS, INLINE_VIEWS\);/);

  const rail = shell.slice(shell.indexOf('class="cs-rail-nav"'), shell.indexOf("</nav>", shell.indexOf('class="cs-rail-nav"')));
  const at = (needle) => {
    const index = rail.indexOf(needle);
    assert.notEqual(index, -1, `${needle} is missing from the rail`);
    return index;
  };

  // Who is signed in and which team is open are one question, so they share one
  // card at the top. They used to sit at opposite ends of the rail — the
  // switcher mid-list on the scope boundary, the user down in the foot — which
  // made "am I in the right place" a two-look answer.
  const account = at("data-rail-account");
  const card = at('class="cs-account"');
  const user = at('class="cs-rail-user"');
  const switcher = at('class="cs-switcher"');
  const orgHeading = at("data-rail-organization");
  const teamHeading = at("data-rail-team-scope");

  assert.ok(account < card, "the account scope is named before its card");
  assert.ok(card < user && user < switcher, "the card holds the identity, then the switcher");
  assert.ok(switcher < orgHeading && orgHeading < teamHeading,
    "account card, then the organization scope, then the team scope");

  // The identity belongs to the card now. A copy left in the foot would be a
  // second answer to the same question.
  const foot = shell.slice(shell.indexOf('class="cs-rail-foot"'));
  assert.ok(!foot.includes('class="cs-rail-user"'), "the signed-in user moved out of the foot");

  // Settings and Billing are account surfaces and sit with the card. Settings is
  // still a TEAM view in app-views.js and still acts on the selected team — this
  // is where it is reached from, not a change of what it operates on.
  for (const view of ["settings", "billing"]) {
    assert.ok(at(`data-view-link="${view}"`) > switcher && at(`data-view-link="${view}"`) < orgHeading,
      `${view} is an account door and belongs with the account card`);
  }
  for (const view of ORG.filter((v) => v !== "billing")) {
    assert.ok(at(`data-view-link="${view}"`) > orgHeading && at(`data-view-link="${view}"`) < teamHeading,
      `${view} is an organization door and belongs under the organization heading`);
  }
  for (const view of TEAM.filter((v) => v !== "settings")) {
    assert.ok(at(`data-view-link="${view}"`) > teamHeading, `${view} is a team door and belongs under the team heading`);
  }
});

test("the rail keeps its height when the crew arrives", () => {
  // .cs-rail-nav is a flex column, so its children are flex ITEMS. .dn-nav sets
  // height:32px, which reads like a floor and is not one — the default
  // flex-shrink:1 compresses a flex item below its own height as soon as the
  // column overflows. And the column overflows at a specific, guaranteed moment:
  // when the team finishes provisioning and the six-strong crew roster appears
  // at the foot of the rail. Every door above it lost height exactly when the
  // customer's team came alive.
  //
  // The guarantee is written against the container, not a list of components, so
  // a door added tomorrow inherits it rather than re-opening the bug.
  assert.match(console_, /\.cs-rail-nav > \* \{ flex: none; \}/,
    "every rail child must be unshrinkable");

  // The nav must actually be able to scroll, or refusing to shrink just clips.
  const nav = console_.slice(console_.indexOf(".cs-rail-nav {"), console_.indexOf("}", console_.indexOf(".cs-rail-nav {")));
  assert.match(nav, /overflow-y:\s*auto/, "the rail scrolls rather than clipping");
  assert.match(nav, /min-height:\s*0/, "a flex child needs min-height:0 before it can scroll");
});

test("the team crumb appears on team screens and nowhere else", () => {
  // An organization screen is not inside a team, so it does not get the team
  // crumb. Everything else does — including the two inline records, which
  // belong to a team even though they have no rail entry of their own.
  assert.match(views, /const IN_TEAM = TEAM_VIEWS\.concat\(INLINE_VIEWS\);/);
  assert.match(views, /crumbTeamWrap\.hidden = !IN_TEAM\.includes\(currentView\)/);
  assert.match(shell, /<span class="cs-crumb-team" data-crumb-team-wrap hidden>/);
});

test("the chrome mirrors app.js rather than holding data of its own", () => {
  // Every name in the rail and the crumb is copied from something a response
  // already put on the page. Nothing here invents an organization or a team.
  assert.match(views, /contextOrganization\.textContent\.trim\(\)/);
  assert.match(views, /teamSelect\.options\[teamSelect\.selectedIndex\]/);
  assert.match(views, /railTeamCount\.textContent = String\(n\)/);
  // The switcher is the native select app.js already populates — not a second
  // opinion about which team is open.
  assert.match(shell, /<select id="workspace-team" data-team-select disabled>/);
  assert.equal((shell.match(/data-team-select/g) || []).length, 1);
});

test("aria-current is the navigation's, and it is the value the system reads", () => {
  // The design system keys the active plate and the edge marker on
  // aria-current="page". "true" painted nothing.
  assert.match(views, /setAttribute\("aria-current", "page"\)/);
  assert.match(views, /const navLinks = links\.filter\(\(link\) => link\.closest\("\[data-view-nav\]"\)\)/);
  assert.equal((shell.match(/data-view-nav/g) || []).length, 2, "the rail and the tab bar are the two navigations");
});

/* ---- the tab bar -------------------------------------------------------- */

test("below 900 the tab bar carries the same doors, and both are always mounted", () => {
  const tabbar = shell.slice(shell.indexOf('class="dn-tabbar"'), shell.indexOf("</nav>", shell.indexOf('class="dn-tabbar"')));
  for (const view of ["dashboard", "overview", "activity", "economics", "approvals"]) {
    assert.ok(tabbar.includes(`data-view-link="${view}"`), `the tab bar is missing ${view}`);
  }
  // The rail folds at the tablet stop and the system shows the tab bar at the
  // same one, so no viewport gets two navs or none.
  assert.match(console_, /@media \(max-width: 900px\) \{[\s\S]*?\.cs-rail \{ display: none; \}/);
});

/* ---- every door opens a screen ------------------------------------------ */

test("every rail door opens a section, and none of them is a placeholder", () => {
  for (const view of ORG.concat(TEAM)) {
    assert.ok(shell.includes(`data-view="${view}"`), `${view} has a door but no section`);
    assert.ok(shell.includes(`id="workspace-${view}"`), `${view} has no anchor of its own`);
  }
  // The four that used to be cards saying so are screens now. Each one has a
  // head that names it, a state chip that reports where its reading came
  // from, and at least one container a render fills — and none of them still
  // claims to be unbuilt.
  const heads = {
    activity: "data-activity-screen-state",
    runs: "data-runs-state",
    people: "data-people-state",
    billing: "data-billing-state",
  };
  for (const [view, chip] of Object.entries(heads)) {
    const start = shell.indexOf(`data-view="${view}"`);
    const screen = shell.slice(start, shell.indexOf("<!-- =====", start + 1));
    assert.ok(!/Not built yet/.test(screen), `${view} is built and must stop saying it is not`);
    assert.match(screen, /class="wview-head"/, `${view} needs the head every built view wears`);
    assert.match(screen, new RegExp(chip), `${view} must say where its reading came from`);
    assert.match(screen, /class="cs-panel"/, `${view} must be composed of the console's panels`);
  }
});

test("the four new screens ship containers, never a figure the markup invented", () => {
  // Every hook below is an empty container. A number, a count or a money
  // amount baked into the shell is a claim no response confirmed, and it
  // would be visible on a signed-out page load before any call is made.
  const filled = [
    "data-activity-agents", "data-activity-reach",
    "data-runs-sessions", "data-runs-changes", "data-runs-spend", "data-runs-trace",
    "data-people-roster", "data-people-reach", "data-people-access", "data-people-rules",
    "data-billing-stats", "data-billing-subscription", "data-billing-teams", "data-billing-credits",
  ];
  for (const hook of filled) {
    const at = shell.indexOf(hook);
    assert.notEqual(at, -1, `${hook} is missing from the shell`);
    const rest = shell.slice(at);
    const open = rest.indexOf(">");
    const close = rest.indexOf("<", open);
    assert.equal(rest.slice(open + 1, close).trim(), "", `${hook} ships content the markup invented`);
  }
  // Filtering belongs to the full record; the floor is an unfiltered live tail
  // with a door through to it. One toolbar, so there is no second filter state
  // to disagree with the first.
  assert.equal(shell.match(/data-activity-filters/g).length, 1);
  for (const category of ["all", "sessions", "workspace", "delivery", "cost"]) {
    assert.equal(shell.match(new RegExp(`data-activity-filter="${category}"`, "g")).length, 1,
      `${category} must be a chip on the full record, and only there`);
  }
});

/* ---- the wiring --------------------------------------------------------- */

test("the design system loads on the console only, and before main.css", () => {
  const ds = head.indexOf("/assets/css/ds.css");
  const main = head.indexOf("/assets/css/main.css");
  const layer = head.indexOf("/assets/css/console.css");
  assert.ok(ds !== -1 && main !== -1 && layer !== -1, "one of the three stylesheets is not linked");
  assert.ok(ds < main, "ds/tokens/base.css is a reset; the site's base rules must be able to answer it");
  assert.ok(main < layer, "the console layer is the last word on the console");
  // Marketing does not load it: those pages were rebuilt on their own kit and
  // the system's reset would pull it out from under them.
  for (const sheet of ["ds.css", "console.css"]) {
    const link = new RegExp(`\\{% if page\\.layout == 'app' %\\}<link rel="stylesheet" href="\\{\\{ '/assets/css/${sheet.replace(".", "\\.")}'`);
    assert.match(head, link, `${sheet} must be gated to the app layout`);
  }
});

test("dark mode re-derives the eight hues one notch, and does it outside ds/", () => {
  // What makes the console read as a lit instrument panel rather than a grey
  // one. It lives here and not in ds/ so the vendored files stay byte-identical
  // to the design system and can be re-vendored without a merge.
  for (const [token, source, factor] of [
    ["--role-pm", "--rose-400", "1.22"], ["--role-em", "--iris-400", "1.22"],
    ["--role-design", "--anemone-400", "1.22"], ["--role-eng", "--current-400", "1.22"],
    ["--status-live-dot", "--lumen-400", "1.25"], ["--status-live-fg", "--lumen-300", "1.25"],
    ["--status-success-dot", "--kelp-400", "1.25"], ["--status-success-fg", "--kelp-300", "1.25"],
    ["--status-attention-dot", "--brass-400", "1.25"], ["--status-attention-fg", "--brass-300", "1.25"],
    ["--status-danger-dot", "--coral-400", "1.25"], ["--status-danger-fg", "--coral-300", "1.25"],
  ]) {
    assert.ok(console_.includes(`${token}: oklch(from var(${source}) l calc(c * ${factor}) h);`),
      `${token} must be re-derived from ${source} at ${factor}`);
  }
  // It has to out-specify tokens.css, which declares the same names at
  // :root[data-theme="dark"]. Same declarations, adapted selector.
  assert.match(console_, /:root\[data-theme="dark"\],\n\[data-theme="dark"\] \{\n {2}--role-pm: oklch/);
});

test("data-theme is always stamped, because the system has no media query", () => {
  // Leave "system" as the absence of the attribute and, in a dark-preferring
  // browser, tokens.css resolves dark while ds.css resolves light — on the same
  // page. The pre-paint script resolves it; the toggle re-resolves it live.
  assert.match(head, /d\.setAttribute\("data-theme",s\);/);
  assert.match(head, /matchMedia\("\(prefers-color-scheme: dark\)"\)\.matches\?"dark":"light"/);
  assert.doesNotMatch(themeToggle, /removeAttribute\("data-theme"\)/,
    "the attribute is never removed: system resolves, it does not vanish");
  assert.match(themeToggle, /if \(state === "system"\) apply\(state, buttons\);/,
    "while the preference is system, an OS flip must re-resolve the theme");
  // Change the script, change the hash, or the CSP refuses it.
  assert.match(layout, /'sha256-c9NR3kojoozMZhv9MWIxrqPWueu4APvyNh4mh005tFw='/);
});

test("the rail's glyphs are in the sprite and the chrome carries no inline style", () => {
  for (const glyph of [
    "i-nav-teams", "i-nav-people", "i-nav-billing", "i-nav-dashboard",
    "i-nav-activity", "i-nav-runs", "i-nav-economics", "i-nav-decisions",
    "i-nav-settings", "i-bell", "i-caret-down", "i-refresh", "i-plus",
  ]) {
    assert.ok(icons.includes(`id="${glyph}"`), `${glyph} is missing from the sprite`);
    assert.ok(shell.includes(`href="#${glyph}"`), `${glyph} is in the sprite but nothing uses it`);
  }
  // style-src 'self' with no 'unsafe-inline' — an inline style attribute here
  // is not a lint failure, it is a declaration the browser drops.
  assert.doesNotMatch(shell, /\sstyle="/, "the shell must carry no inline style attribute");
  assert.doesNotMatch(layout, /\sstyle="/, "the layout must carry no inline style attribute");
});

test("the layout header stands down in the workspace, and the sign-out went with it", () => {
  assert.match(console_, /body:has\(\[data-shell\]\[data-shell-mode="workspace"\]\) \.app-header \{ display: none; \}/);
  // One [data-sign-out], and it is in the top bar the mockup puts it in.
  assert.equal((shell.match(/data-sign-out(?![\w-])/g) || []).length, 1);
  assert.doesNotMatch(layout, /data-sign-out/);
  const actions = shell.slice(shell.indexOf('class="cs-topbar-actions"'), shell.indexOf("</header>", shell.indexOf('class="cs-topbar-actions"')));
  assert.match(actions, /data-sign-out/, "sign out belongs in the top bar, beside the bell");
});

// The rail ends with the people on it, and with who is reading it. Both were
// in the mockup from the first cut and neither survived the shell rebuild:
// under a system-grammar rail the foot was an environment pill and nothing
// else, which said what deployment you were on and not who you were.
test("the rail ends with the team's crew and the person reading it", () => {
  const rail = shell.slice(shell.indexOf('class="cs-rail-nav"'), shell.indexOf("</nav>", shell.indexOf('class="cs-rail-nav"')));
  // The roster is a fact about the SELECTED team, so it sits inside the team
  // scope — after every door that scope opens, never above the switcher.
  assert.ok(rail.indexOf("data-rail-team-scope") < rail.indexOf("data-rail-crew-scope"),
    "the crew belongs under the team scope, not beside the organization's doors");
  assert.match(rail, /data-view-link="settings"[\s\S]*data-rail-crew-scope/,
    "the crew comes after the last door, because it is a roster and not a destination");
  assert.match(rail, /<div class="cs-rail-crew" data-rail-crew hidden><\/div>/,
    "the container ships empty: app.js fills it from the roster the server confirmed");

  // Rows are built from the same resolved canonical roles the floor's tiles
  // are, so a hue in the rail cannot disagree with a hue on the floor.
  assert.match(app, /function renderRailCrew\(rows\)/);
  assert.match(app, /plate\.dataset\.roleKey = entry\.roleKey;/);
  assert.match(app, /plate\.className = "dn-avatar dn-avatar--xs";/);
  assert.match(main, /\.dn-avatar\[data-role-key="AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER"\]/,
    "the design system's plate must carry role colour through the same rule the site's does");

  // A row is the agent's record, and the agent view has no rail door of its
  // own. One handler serves both surfaces, so the two cannot drift.
  assert.match(app, /if \(ui\.railCrew\) ui\.railCrew\.addEventListener\("click", openAgentFromCrew\);/);
  assert.match(views, /const railCrew = document\.querySelector\("\[data-rail-crew\]"\);/);
  assert.doesNotMatch(views, /INLINE_VIEWS = \[[^\]]*"agent"[^\]]*\][\s\S]{0,80}ORG_VIEWS\.concat\("agent"/);

  // The identity block, and the one rule that keeps it true: the create
  // screen's chip and the rail's foot are written by one call.
  assert.match(shell, /<div class="cs-rail-user" data-rail-user hidden>/);
  assert.equal((shell.match(/data-user-name(?![\w-])/g) || []).length, 2,
    "two places show the signed-in person; both must be hooks, not one hook and one guess");
  assert.match(app, /function applyIdentity\(name, login\)/);
  assert.match(app, /document\.querySelectorAll\("\[data-user-name\]"\)\.forEach/);
  assert.doesNotMatch(app, /ui\.userName\.textContent =/,
    "a single-element write would leave one of the two surfaces stale");
});
