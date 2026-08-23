((root, factory) => {
  "use strict";

  const contract = factory();
  if (typeof module === "object" && module.exports) module.exports = contract;
  if (root) root.deepNavyOrganizationOnboarding = contract;
})(typeof globalThis === "object" ? globalThis : this, () => {
  "use strict";

  const ONBOARDING_STATE = Object.freeze({
    ORGANIZATION_REQUIRED: "ONBOARDING_STATE_ORGANIZATION_REQUIRED",
    ORGANIZATION_SELECTION_REQUIRED: "ONBOARDING_STATE_ORGANIZATION_SELECTION_REQUIRED",
    READY: "ONBOARDING_STATE_READY"
  });

  class ContractError extends Error {
    constructor(message, code = "invalid_profile") {
      super(message);
      this.name = "ContractError";
      this.code = code;
    }
  }

  function stringValue(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function normalizedOnboardingState(value) {
    if (value === 1) return ONBOARDING_STATE.ORGANIZATION_REQUIRED;
    if (value === 2) return ONBOARDING_STATE.ORGANIZATION_SELECTION_REQUIRED;
    if (value === 3) return ONBOARDING_STATE.READY;
    return stringValue(value);
  }

  function membershipsFromProfile(profile) {
    if (!Array.isArray(profile?.memberships)) return [];
    return profile.memberships.map((membership) => {
      const organization = membership?.organization;
      const id = stringValue(organization?.id);
      if (!id) throw new ContractError("GetCurrentUser returned a membership without an organization ID.");
      return {
        id,
        name: stringValue(organization.name) || "Organization",
        slug: stringValue(organization.slug),
        // The role travels as it arrived. MembershipRole is a proto enum, so
        // over Connect JSON it reaches the browser as a NUMBER; stringValue()
        // flattened every one of them to "" here, which is why an owner was
        // labelled "member" on every surface that shows a role. Resolving the
        // enum is the console's job, not the contract's — this module only
        // guarantees the field is carried, not what it is called.
        role: membership.role,
        organization
      };
    });
  }

  function organizationIdFromProfile(profile) {
    const currentId = stringValue(profile?.currentOrganization?.id);
    if (currentId) return currentId;
    const memberships = membershipsFromProfile(profile);
    return memberships.length === 1 ? memberships[0].id : "";
  }

  function decisionFromProfile(profile) {
    if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
      throw new ContractError("GetCurrentUser did not return a profile object.");
    }

    const currentOrganization = profile.currentOrganization;
    const currentId = stringValue(currentOrganization?.id);
    const memberships = membershipsFromProfile(profile);
    const state = normalizedOnboardingState(profile.onboardingState);
    const knownStates = new Set(Object.values(ONBOARDING_STATE));
    if (!knownStates.has(state)) throw new ContractError("GetCurrentUser returned an unknown onboarding state.");

    if (currentId) {
      if (state !== ONBOARDING_STATE.READY) {
        throw new ContractError("GetCurrentUser returned conflicting current-organization state.");
      }
      if (!memberships.some((membership) => membership.id === currentId)) {
        throw new ContractError("The current organization is not present in the authenticated user's memberships.");
      }
      return { kind: "ready", organization: currentOrganization, profile, memberships };
    }

    if (state === ONBOARDING_STATE.READY) {
      throw new ContractError("GetCurrentUser reported ready without a current organization.");
    }
    if (state === ONBOARDING_STATE.ORGANIZATION_REQUIRED && memberships.length) {
      throw new ContractError("GetCurrentUser requires bootstrap but also returned memberships.");
    }
    if (state === ONBOARDING_STATE.ORGANIZATION_SELECTION_REQUIRED && memberships.length === 0) {
      throw new ContractError("GetCurrentUser requires organization selection but returned no memberships.");
    }

    if (memberships.length === 0) return { kind: "needs_bootstrap", profile, memberships };
    return { kind: "needs_selection", profile, memberships };
  }

  function organizationFromMutation(response, operation) {
    const organization = response?.currentMembership?.organization;
    if (!stringValue(organization?.id)) {
      throw new ContractError(`${operation} did not return a current membership with an organization ID.`, "invalid_response");
    }
    return organization;
  }

  function createCoordinator({ request, createIdempotencyKey }) {
    if (typeof request !== "function") throw new TypeError("request must be a function");
    if (typeof createIdempotencyKey !== "function") throw new TypeError("createIdempotencyKey must be a function");

    let current = { kind: "idle", profile: null, memberships: [] };
    let pendingBootstrap = null;

    async function select(organizationId) {
      const id = stringValue(organizationId);
      const allowed = current.memberships.some((membership) => membership.id === id);
      if (!allowed) throw new ContractError("Choose an organization returned by GetCurrentUser.", "organization_not_accessible");

      const previous = current;
      try {
        const response = await request("select_organization", { organizationId: id });
        const organization = organizationFromMutation(response, "SelectOrganization");
        if (stringValue(organization.id) !== id) {
          throw new ContractError("SelectOrganization returned a different organization.", "invalid_response");
        }
        current = { kind: "ready", organization, profile: previous.profile, memberships: previous.memberships };
        return current;
      } catch (error) {
        current = previous;
        throw error;
      }
    }

    async function load() {
      const profile = await request("current_user", {});
      try {
        current = decisionFromProfile(profile);
      } catch (error) {
        current = { kind: "invalid", profile, memberships: [] };
        throw error;
      }
      pendingBootstrap = null;
      if (current.kind === "needs_selection" && current.memberships.length === 1) {
        return select(current.memberships[0].id);
      }
      return current;
    }

    async function bootstrap(name) {
      if (current.kind !== "needs_bootstrap") {
        throw new ContractError("Organization bootstrap is not available for this profile.", "bootstrap_not_allowed");
      }

      const normalizedName = stringValue(name).replace(/\s+/g, " ");
      if (normalizedName.length < 2 || normalizedName.length > 80) {
        throw new ContractError("Organization name must contain 2 to 80 characters.", "invalid_organization_name");
      }
      if (!pendingBootstrap || pendingBootstrap.name !== normalizedName) {
        const key = stringValue(createIdempotencyKey());
        if (!key) throw new ContractError("Could not create an idempotency key.", "idempotency_key_required");
        pendingBootstrap = { name: normalizedName, key };
      }

      const previous = current;
      try {
        const response = await request("bootstrap_organization", {
          name: normalizedName,
          idempotencyKey: pendingBootstrap.key
        });
        const organization = organizationFromMutation(response, "BootstrapOrganization");
        current = {
          kind: "ready",
          organization,
          profile: previous.profile,
          memberships: [{ id: organization.id, name: stringValue(organization.name) || normalizedName, slug: stringValue(organization.slug), role: "MEMBERSHIP_ROLE_OWNER", organization }]
        };
        pendingBootstrap = null;
        return current;
      } catch (error) {
        current = previous;
        throw error;
      }
    }

    return {
      bootstrap,
      load,
      select,
      state: () => current
    };
  }

  return {
    ContractError,
    ONBOARDING_STATE,
    createCoordinator,
    decisionFromProfile,
    membershipsFromProfile,
    organizationIdFromProfile
  };
});
