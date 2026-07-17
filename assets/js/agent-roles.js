(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DeepNavyAgentRoles = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CANONICAL_AGENT_ROLES = Object.freeze([
    Object.freeze({ value: 1, key: "AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER", label: "Technical Product Manager", code: "TPM" }),
    Object.freeze({ value: 2, key: "AGENT_ROLE_PRODUCT_DESIGNER", label: "Product Designer", code: "PD" }),
    Object.freeze({ value: 3, key: "AGENT_ROLE_ENGINEERING_MANAGER", label: "Engineering Manager", code: "EM" }),
    Object.freeze({ value: 4, key: "AGENT_ROLE_STAFF_CLIENT", label: "Staff Client Engineer", code: "SCE" }),
    Object.freeze({ value: 5, key: "AGENT_ROLE_STAFF_BACKEND", label: "Staff Backend Engineer", code: "SBE" }),
    Object.freeze({ value: 6, key: "AGENT_ROLE_STAFF_PLATFORM", label: "Staff Platform Engineer", code: "SPE" })
  ]);

  function canonicalAgentRole(value) {
    if (typeof value === "number" && Number.isInteger(value)) {
      return CANONICAL_AGENT_ROLES.find((role) => role.value === value) || null;
    }
    const key = typeof value === "string" ? value.trim() : "";
    return CANONICAL_AGENT_ROLES.find((role) => role.key === key) || null;
  }

  return Object.freeze({ CANONICAL_AGENT_ROLES, canonicalAgentRole });
});
