(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.DeepNavyAgentRoles = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const CANONICAL_AGENT_ROLES = Object.freeze([
    Object.freeze({ value: 1, key: "AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER", label: "Product Manager", code: "PM" }),
    Object.freeze({ value: 2, key: "AGENT_ROLE_PRODUCT_DESIGNER", label: "Product Designer", code: "PD" }),
    Object.freeze({ value: 3, key: "AGENT_ROLE_ENGINEERING_MANAGER", label: "Engineering Manager", code: "EM" }),
    Object.freeze({ value: 4, key: "AGENT_ROLE_STAFF_CLIENT", label: "Engineer", code: "E1" }),
    Object.freeze({ value: 5, key: "AGENT_ROLE_STAFF_BACKEND", label: "Engineer", code: "E2" }),
    Object.freeze({ value: 6, key: "AGENT_ROLE_STAFF_PLATFORM", label: "Engineer", code: "E3" }),
    Object.freeze({ value: 7, key: "AGENT_ROLE_ENGINEER", label: "Engineer", code: "EN", repeatable: true })
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
