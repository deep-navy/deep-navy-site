"use strict";

// The settings view in the kit's card grammar — the last screen out of its
// old bones. These pin the restructure's commitments:
//
//   - four hairline-first decision cards, each scoped by a mono eyebrow;
//   - at most ONE primary action per card, and it is always the commit
//     (the stepper and the checkboxes propose; "Update …" commits) — the
//     Stripe door keeps the quiet weight because the decision happens
//     inside Stripe, not on this card;
//   - destructive verbs ride the coral danger class wherever they render,
//     and the settings surface itself hosts none — team deletion stays with
//     the roster on Your teams, quiet, behind a typed-name confirm;
//   - settings renders build DOM, never markup strings;
//   - the Repositories card's create-flow contract survives the restyle:
//     the pinned <article>, the checklist fieldset, the exact save button,
//     and the honest re-provision line under it;
//   - billing money is mono, tabular, and never separated from its unit;
//   - humans are ink: a member's monogram keeps the crew plate's shape and
//     none of its hue — role colour is agent identity, never a person's;
//   - the settings door stays where wayfinding expects it: last in the
//     overflow menu, after every work surface.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const shell = readFileSync("_includes/app-shell.html", "utf8");
const app = readFileSync("assets/js/app.js", "utf8");
const css = readFileSync("assets/css/main.css", "utf8");

function settingsSection() {
  const start = shell.indexOf('data-view="settings"');
  assert.notEqual(start, -1, "the settings view exists");
  const end = shell.indexOf("<dialog", start);
  return shell.slice(start, end === -1 ? shell.length : end);
}

function settingsCards() {
  const cards = settingsSection().split("<article").slice(1)
    .map((chunk) => chunk.slice(0, chunk.indexOf("</article>")));
  assert.equal(cards.length, 4, "settings is exactly four decision cards");
  return cards;
}

const cssRule = (selector) => {
  const start = css.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `missing rule: ${selector}`);
  return css.slice(start, css.indexOf("}", start));
};

test("the settings view is four hairline cards, each scoped by a mono eyebrow", () => {
  const cards = settingsCards();
  const titles = ["Account", "Billing", "Engineering capacity", "Repositories"];
  const eyebrows = ["GitHub identity", "Stripe subscription", "Selected team", "Selected team"];
  cards.forEach((card, index) => {
    assert.match(card, /class="settings-card"/, `card ${index} wears the kit card class`);
    const head = card.indexOf('class="settings-card-head"');
    assert.notEqual(head, -1, `card ${index} has a card head`);
    const eyebrow = card.indexOf('<span class="eyebrow">');
    const title = card.indexOf(`>${titles[index]}</h3>`);
    assert.ok(eyebrow !== -1 && title !== -1 && eyebrow < title,
      `card ${index} leads with its eyebrow, then the title ${titles[index]}`);
    assert.match(card, new RegExp(`<span class="eyebrow">${eyebrows[index]}</span>`),
      `card ${index} eyebrow names its scope`);
  });
  // Hairline first: the card is a 1px border before it is a surface, and the
  // head draws the divider — no boxes inside boxes.
  assert.match(cssRule(".settings-card"), /border: 1px solid var\(--line-mid\)/);
  assert.match(cssRule(".settings-card-head"), /border-bottom: 1px solid var\(--line\)/);
  // The eyebrow is the mono micro-label vocabulary, not a heading.
  const eyebrowRule = cssRule(".settings-card-head .eyebrow");
  assert.match(eyebrowRule, /letter-spacing: \.16em/);
});

test("one primary per settings card, and it is always the commit — never the door", () => {
  const cards = settingsCards();
  const primaries = cards.map((card) => (card.match(/button-primary/g) || []).length);
  assert.deepEqual(primaries, [0, 0, 1, 1],
    "Account and Billing decide nothing here; Capacity and Repositories each carry exactly one primary");
  // The primaries are the two commits.
  assert.match(cards[2], /<button class="button button-primary" type="button" data-settings-engineer-apply/);
  assert.match(cards[3], /<button class="button button-primary" type="button" data-settings-repositories-apply/);
  // The Stripe door is a departure, not a commit: quiet weight, held to it.
  assert.match(cards[1], /<button class="button button-secondary" type="button" data-settings-billing-manage/);
});

test("destructive verbs carry the danger class, and settings hosts none today", () => {
  // Any settings button whose LABEL is a destructive verb must wear coral.
  // (The stepper's minus is a quantity control: it proposes a count and
  // commits nothing, so its aria-label is not a destructive action.)
  for (const [, attrs, label] of settingsSection().matchAll(/<button([^>]*)>([^<]*)</g)) {
    if (/\b(delete|remove|revoke|destroy)\b/i.test(label)) {
      assert.match(attrs, /button-danger/,
        `settings button "${label.trim()}" is destructive and must carry button-danger`);
    }
  }
  // Where the destructive actions actually live (the team roster), they ride
  // the coral tokens — quiet placement, loud colour, typed-name confirm.
  assert.match(app, /"Confirm delete" : "Delete team", "button-danger"/);
  assert.match(app, /"Retry deletion" : "Delete", "button-danger"/);
});

test("settings renders build DOM, never markup strings", () => {
  const start = app.indexOf("function renderSettingsAccount()");
  const end = app.indexOf("async function applyTeamRepositories()");
  assert.ok(start !== -1 && end > start, "the settings render block exists in one span");
  const renders = app.slice(start, end);
  assert.doesNotMatch(renders, /innerHTML|outerHTML|insertAdjacentHTML/);
  assert.match(renders, /replaceChildren\(\)/);
  assert.match(renders, /document\.createElement/);
});

test("the repositories card's pinned contract survives the restyle", () => {
  const start = shell.indexOf("data-repo-settings");
  const card = shell.slice(shell.lastIndexOf("<article", start), shell.indexOf("</article>", start));
  assert.match(card, /<h3 id="settings-repos-title">Repositories<\/h3>/);
  assert.match(card, /data-repo-settings-field/);
  assert.match(card, /data-settings-repository-list/);
  assert.match(card, /role="group"/);
  assert.match(card, /aria-describedby="settings-repositories-help settings-repositories-error"/);
  assert.match(card, /data-settings-repositories-error role="alert" hidden/);
  assert.match(card, /<button[^>]*data-settings-repositories-apply[^>]*>Update repositories<\/button>/);
  // The GitHub door stays OUTSIDE the fieldset: it must survive the fieldset
  // hiding, because that is exactly when the customer needs it.
  const fieldsetClose = card.indexOf("</fieldset>");
  const door = card.indexOf("repo-access-line");
  assert.ok(fieldsetClose !== -1 && door > fieldsetClose, "the access line sits after the checklist fieldset");
  // The honest re-provision line still sits under the save action.
  const apply = card.indexOf("data-settings-repositories-apply");
  const note = card.indexOf("Saving re-provisions the team. Agents keep their memory; work in progress is interrupted.");
  assert.ok(apply !== -1 && note > apply, "the honest line sits under the save button");
});

test("billing money is mono, tabular, and never separated from its unit", () => {
  const billing = settingsCards()[1];
  assert.match(billing, /<dd class="settings-fig" data-settings-team-count>0<\/dd>/);
  assert.match(billing, /<dd class="settings-fig settings-emphasis" data-settings-billing-amount>\$0\.00\/month<\/dd>/);
  assert.match(billing, /<dd class="settings-fig" data-settings-billing-unit>\$599\.00\/month<\/dd>/);
  const fig = cssRule(".settings-list dd.settings-fig");
  assert.match(fig, /font-variant-numeric: tabular-nums/);
  assert.match(fig, /var\(--font-mono\)/);
  // The renderer writes value and unit as one string, so they cannot drift.
  assert.match(app, /ui\.settingsBillingUnit\.textContent = `\$\{formatCents\(unitCents\)\}\/month`/);
  assert.match(app, /ui\.settingsBillingAmount\.textContent = `\$\{formatCents\(unitCents \* BigInt\(count\)\)\}\/month`/);
});

test("humans are ink: the member monogram never wears a crew hue", () => {
  const plate = cssRule(".settings-member-list .user-avatar");
  assert.doesNotMatch(plate, /--role-|--rose|--iris|--anemone|--current/,
    "a person's plate must not reference an agent identity hue");
  assert.match(plate, /var\(--accent-a08\)/, "the plate is the achromatic ink wash");
  // The render stamps no role key, so the crew's [data-role-key] paint can
  // never reach a person.
  const start = app.indexOf("function renderSettingsMembers()");
  const members = app.slice(start, app.indexOf("function teamUnitAmountCents", start));
  assert.doesNotMatch(members, /roleKey|data-role-key/);
  assert.doesNotMatch(settingsCards()[0], /data-role-key/);
});

test("the members empty state follows the three-part formula", () => {
  const account = settingsCards()[0];
  assert.match(account,
    /<div class="empty-state settings-empty" data-settings-members-empty><strong>[^<]+<\/strong><p>[^<]+<\/p><\/div>/,
    "name the absence, then say what belongs here and how to get it");
});

test("the settings door sits last in the overflow menu, after every work surface", () => {
  const menuStart = shell.indexOf("wsmenu-panel");
  const menu = shell.slice(menuStart, shell.indexOf("</details>", menuStart));
  const order = ["dashboard", "overview", "objectives", "approvals", "economics", "settings"]
    .map((view) => menu.indexOf(`data-view-link="${view}"`));
  assert.ok(order.every((position) => position !== -1), "every door is in the menu");
  assert.deepEqual([...order].sort((a, b) => a - b), order,
    "doors read: teams, floor, objectives, approvals, economics, settings — settings last");
});
