"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const {
  ContractError,
  createCoordinator,
  decisionFromProfile,
  organizationIdFromProfile
} = require("../assets/js/organization-onboarding.js");

const appSource = readFileSync("assets/js/app.js", "utf8");

function membership(id, name = "deep navy") {
  return {
    organization: { id, name, slug: name.toLowerCase().replace(/\s+/g, "-") },
    role: "MEMBERSHIP_ROLE_OWNER"
  };
}

test("reads only the typed camelCase current organization and nested membership IDs", () => {
  assert.equal(organizationIdFromProfile({
    currentOrganization: { id: "current-1" },
    memberships: [membership("member-1")],
    organizationId: "untrusted-flat-id"
  }), "current-1");

  assert.equal(organizationIdFromProfile({
    memberships: [membership("member-1")],
    organizationId: "untrusted-flat-id"
  }), "member-1");

  assert.equal(organizationIdFromProfile({ organizationId: "untrusted-flat-id" }), "");
  assert.equal(organizationIdFromProfile({ memberships: [membership("one"), membership("two")] }), "");
});

test("sign-in profile load followed by bootstrap retries with one idempotency key", async () => {
  const calls = [];
  let bootstrapAttempts = 0;
  const coordinator = createCoordinator({
    createIdempotencyKey: () => "bootstrap-key-1",
    request: async (name, payload) => {
      calls.push({ name, payload });
      if (name === "current_user") {
        return {
          user: { id: "user-1", displayName: "Ada" },
          memberships: [],
          onboardingState: 1
        };
      }
      if (name === "bootstrap_organization") {
        bootstrapAttempts += 1;
        if (bootstrapAttempts === 1) throw new Error("response lost");
        return { currentMembership: membership("organization-1", "Acme Engineering") };
      }
      throw new Error(`unexpected request ${name}`);
    }
  });

  const initial = await coordinator.load();
  assert.equal(initial.kind, "needs_bootstrap");

  await assert.rejects(coordinator.bootstrap("  Acme   Engineering "), /response lost/);
  assert.equal(coordinator.state().kind, "needs_bootstrap", "a failed response must not be rendered as ready");

  const ready = await coordinator.bootstrap("Acme Engineering");
  assert.equal(ready.kind, "ready");
  assert.equal(ready.organization.id, "organization-1");
  assert.deepEqual(calls, [
    { name: "current_user", payload: {} },
    { name: "bootstrap_organization", payload: { name: "Acme Engineering", idempotencyKey: "bootstrap-key-1" } },
    { name: "bootstrap_organization", payload: { name: "Acme Engineering", idempotencyKey: "bootstrap-key-1" } }
  ]);
});

test("a single returned membership is selected through SelectOrganization", async () => {
  const calls = [];
  const coordinator = createCoordinator({
    createIdempotencyKey: () => "unused",
    request: async (name, payload) => {
      calls.push({ name, payload });
      if (name === "current_user") {
        return {
          memberships: [membership("organization-1")],
          onboardingState: 2
        };
      }
      if (name === "select_organization") return { currentMembership: membership("organization-1") };
      throw new Error(`unexpected request ${name}`);
    }
  });

  const ready = await coordinator.load();
  assert.equal(ready.kind, "ready");
  assert.equal(ready.organization.id, "organization-1");
  assert.deepEqual(calls, [
    { name: "current_user", payload: {} },
    { name: "select_organization", payload: { organizationId: "organization-1" } }
  ]);
});

test("multiple memberships require an authorized explicit selection", async () => {
  const calls = [];
  const coordinator = createCoordinator({
    createIdempotencyKey: () => "unused",
    request: async (name, payload) => {
      calls.push({ name, payload });
      if (name === "current_user") {
        return {
          memberships: [membership("organization-1", "One"), membership("organization-2", "Two")],
          onboardingState: "ONBOARDING_STATE_ORGANIZATION_SELECTION_REQUIRED"
        };
      }
      if (name === "select_organization") return { currentMembership: membership(payload.organizationId) };
      throw new Error(`unexpected request ${name}`);
    }
  });

  const pending = await coordinator.load();
  assert.equal(pending.kind, "needs_selection");
  await assert.rejects(coordinator.select("organization-not-returned"), (error) => {
    assert.ok(error instanceof ContractError);
    assert.equal(error.code, "organization_not_accessible");
    return true;
  });
  assert.equal(calls.length, 1, "an arbitrary organization ID must never reach the API");

  const ready = await coordinator.select("organization-2");
  assert.equal(ready.organization.id, "organization-2");
  assert.deepEqual(calls[1], { name: "select_organization", payload: { organizationId: "organization-2" } });
});

test("contract contradictions remain unavailable instead of becoming ready", async () => {
  assert.throws(() => decisionFromProfile({
    memberships: [membership("organization-1")],
    onboardingState: 0
  }), ContractError);

  assert.throws(() => decisionFromProfile({
    memberships: [],
    onboardingState: "ONBOARDING_STATE_READY"
  }), (error) => {
    assert.ok(error instanceof ContractError);
    assert.equal(error.code, "invalid_profile");
    return true;
  });

  const coordinator = createCoordinator({
    createIdempotencyKey: () => "unused",
    request: async () => ({
      currentOrganization: { id: "organization-1" },
      memberships: [membership("organization-2")],
      onboardingState: "ONBOARDING_STATE_READY"
    })
  });
  await assert.rejects(coordinator.load(), ContractError);
  assert.equal(coordinator.state().kind, "invalid");
});

test("failed selection preserves the needs-selection state", async () => {
  const coordinator = createCoordinator({
    createIdempotencyKey: () => "unused",
    request: async (name) => {
      if (name === "current_user") {
        return {
          memberships: [membership("organization-1"), membership("organization-2")],
          onboardingState: "ONBOARDING_STATE_ORGANIZATION_SELECTION_REQUIRED"
        };
      }
      throw new Error("selection unavailable");
    }
  });

  await coordinator.load();
  await assert.rejects(coordinator.select("organization-1"), /selection unavailable/);
  assert.equal(coordinator.state().kind, "needs_selection");
});

test("team onboarding exhausts stable organization-scoped pages before enforcing paid capacity", () => {
  assert.match(appSource, /async function listAllTeams\(\)/);
  assert.match(appSource, /pageSize: 100, pageToken/);
  assert.match(appSource, /TeamService returned a repeated page cursor/);
  assert.match(appSource, /stringValue\(team\?\.organizationId\) !== session\.organizationId/);
  assert.match(appSource, /listAllTeams\(\)/);
});

test("customer sign-in uses the platform-owned GitHub round trip instead of Cognito hosted UI", () => {
  // beginSignIn asks the platform API to start a GitHub sign-in and redirects to
  // the returned authorization URL (login) or installation URL (new user connecting
  // repositories) rather than building a Cognito PKCE URL.
  assert.match(appSource, /platformApi\.signIn\("github_sign_in_start", \{ returnTo: appPath \}/);
  assert.match(appSource, /result\?\.authorizationUrl/);
  assert.match(appSource, /result\?\.installationUrl \|\| result\?\.installation_url/);
  assert.match(appSource, /const destination = validatedRedirect\(url, \["github\.com"\]\)/);
  assert.match(appSource, /storageWrite\(signInStorageKey, \{ purpose: "sign_in", createdAt: Date\.now\(\) \}\)/);
  // The Cognito hosted-UI OAuth + PKCE token exchange is fully removed.
  assert.doesNotMatch(appSource, /oauth2\//);
  assert.doesNotMatch(appSource, /code_challenge/);
  assert.doesNotMatch(appSource, /config\.cognito_/);
  assert.doesNotMatch(appSource, /function completeCallback/);
});

test("the shared GitHub callback completes sign-in with the parsed one-time credential and stores the session", () => {
  // A "sign_in" transaction plus no in-memory session distinguishes a sign-in
  // from a signed-in user's repository-management install on the same page.
  assert.match(appSource, /const signInTransaction = readSignInTransaction\(\)/);
  assert.match(appSource, /if \(signInTransaction && !session\.accessToken\)/);
  assert.match(appSource, /completeSignInCallback\(callback\)/);
  assert.match(appSource, /launchContract\.parseGitHubCallback\(callbackParams/);
  assert.match(appSource, /platformApi\.signIn\("github_sign_in_complete", \{/);
  assert.match(appSource, /authorizationCode: callback\.authorizationCode/);
  assert.match(appSource, /stateToken: callback\.stateToken/);
  assert.match(appSource, /installationId: callback\.installationId/);
  assert.match(appSource, /session\.accessToken = sessionToken/);
});

test("sign-out revokes the session server-side, then redirects into the app", () => {
  assert.match(appSource, /platformApi\.request\("sign_out", \{\}, \{ accessToken: revokedToken/);
  assert.match(appSource, /window\.location\.assign\(appPath\)/);
});

// Every way into the app from a marketing page is a sign-in handoff. The app
// itself has no login screen by design: an ordinary /app/ load that finds no
// session calls location.replace("../") and puts the visitor back where they
// started, with nothing said and nothing done. A conversion button that links
// bare /app/ therefore reads as broken - "Create your team" returned the
// visitor to the page they clicked it from. ?signin=1 is the correct link for
// both states, because that branch restores an existing session first and only
// hands off to GitHub when there is none.
test("every marketing link into the app asks for sign-in", () => {
  const { execFileSync } = require("node:child_process");
  const sources = execFileSync("git", ["ls-files", "*.md", "*.html"], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean)
    // The callback page IS the app's own return address, not a link into it.
    .filter((file) => !file.startsWith("app/"));
  const bare = [];
  for (const file of sources) {
    const body = readFileSync(file, "utf8");
    for (const match of body.matchAll(/href="\{\{\s*'([^']*\/app\/[^']*)'\s*\|\s*relative_url\s*\}\}"/g)) {
      if (!match[1].includes("signin=1")) bare.push(`${file}: ${match[1]}`);
    }
    for (const match of body.matchAll(/href="(\/app\/[^"]*)"/g)) {
      if (!match[1].includes("signin=1")) bare.push(`${file}: ${match[1]}`);
    }
  }
  assert.deepEqual(bare, [], `these links bounce a signed-out visitor back to where they came from:\n${bare.join("\n")}`);
});

// The bounce those links used to hit, so the test above keeps meaning what it
// says if the redirect is ever rewritten.
test("a signed-out app load with no sign-in request returns to the homepage", () => {
  assert.match(appSource, /!session\.accessToken && document\.body\.dataset\.githubCallback !== "true"/);
  assert.match(appSource, /window\.location\.replace\(new URL\("\.\.\/", window\.location\.href\)/);
});
