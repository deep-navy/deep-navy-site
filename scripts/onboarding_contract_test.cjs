"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const {
  ContractError,
  createCoordinator,
  decisionFromProfile,
  organizationIdFromProfile
} = require("../assets/js/organization-onboarding.js");

function membership(id, name = "Deep Navy") {
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
