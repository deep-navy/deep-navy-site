"use strict";

// The People screen.
//
// There is no procedure that lists an organization's members. What the
// platform will confirm to a browser is the account it signed in with and the
// role that account's own membership carries — so the screen shows exactly
// one person and says, in the reader's own words, that one row is the whole
// answer rather than a roster whose other rows failed to load.
//
// The rules beside it are not invented either: every line is a check the API
// makes on every call, named in its own contract. The screen says that, so it
// is never mistaken for a per-person capability read.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");

const renderer = (name, next) =>
  app.slice(app.indexOf(`function ${name}(`), app.indexOf(`function ${next}(`));

const screen = () => {
  const start = shell.indexOf('data-view="people"');
  assert.notEqual(start, -1, "the people view is missing");
  return shell.slice(start, shell.indexOf("<!-- ===== BILLING", start));
};

test("there is no members procedure, so the screen never implies one was called", () => {
  // If this ever fails because a members RPC arrived, this screen should grow
  // a roster — but until then, nothing here may imply a list was attempted.
  assert.doesNotMatch(client, /"(?:members|organization_members|list_members)",/);
  assert.doesNotMatch(client, /organizations\.listMembers/);
  const view = renderer("renderPeopleView", "renderPeopleRoster");
  assert.doesNotMatch(view, /apiRequest\(/, "People renders held state; it never fetches");
  // The one row comes from the membership the organization coordinator already
  // confirmed, and it is marked as the signed-in person.
  assert.match(app, /function buildOrganizationMembers\(state\)/);
  assert.match(app, /return \[\{ name, login, role: membershipRoleLabel\(membership\?\.role\), self: true \}\]/);
});

test("one row is stated as the whole answer, not as a partial roster", () => {
  const reach = renderer("renderPeopleReach", "renderPeopleAccess");
  assert.match(reach, /does not serve a member list/);
  assert.match(reach, /nobody else failed to\s*\n?\s*load, and nobody is hidden/);
  // A Callout explains what you are looking at; it carries no source, time or
  // code, which is what separates it from a Notice.
  assert.match(reach, /calloutCard\(\{/);
  assert.doesNotMatch(reach, /source:|code:|time:/);
});

test("an unconfirmed membership is unavailable, never an empty table", () => {
  const roster = renderer("renderPeopleRoster", "renderPeopleReach");
  assert.match(roster, /setDataState\(host, "unavailable"[\s\S]*No organization is established/);
  assert.doesNotMatch(roster, /replaceWithTable\(host, \[[\s\S]*?\], \[\]\)/);
  // A role the response did not state is not silently called "member".
  assert.match(roster, /ladderBadge\("Role not reported", "warning"\)/);
  assert.match(app, /function membershipRoleLabel\(value\)/);
  const access = renderer("renderPeopleAccess", "renderPeopleRules");
  assert.match(access, /setDataState\(host, "unavailable"/);
  assert.match(access, /The platform did not report a role/);
});

test("the rules table is the contract the API enforces, and says so", () => {
  assert.match(app, /const MEMBERSHIP_RULES = Object\.freeze\(\[/);
  const rules = app.slice(app.indexOf("const MEMBERSHIP_RULES"), app.indexOf("function renderPeopleView"));
  // The four memberships the protos define, and only claims those protos make.
  for (const roles of ["Any member", "Owner or admin", "Owner or billing"]) {
    assert.ok(rules.includes(`roles: "${roles}"`), `${roles} is missing from the rules`);
  }
  assert.doesNotMatch(rules, /Viewer/, "viewer is a mockup role, not one this platform has");
  // And the screen states what the table is, so it is never read as a
  // per-person capability query.
  assert.match(screen(), /These are the checks the API makes on every call, not a reading of any one account/);
});

test("a person is ink: the monogram keeps the crew plate's shape and none of its hue", () => {
  const roster = renderer("renderPeopleRoster", "renderPeopleReach");
  assert.match(roster, /plate\.className = "user-avatar crew-monogram-xs"/);
  assert.doesNotMatch(roster, /dataset\.roleKey/, "role colour is an agent's identity and stops at the roster");
  assert.doesNotMatch(roster, /innerHTML|outerHTML|insertAdjacentHTML/);
});
