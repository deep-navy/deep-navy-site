const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const { CANONICAL_AGENT_ROLES, canonicalAgentRole } = require(path.join(root, "assets/js/agent-roles.js"));

const expected = [
  { value: 1, key: "AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER", label: "Technical Product Manager", code: "TPM" },
  { value: 2, key: "AGENT_ROLE_PRODUCT_DESIGNER", label: "Product Designer", code: "PD" },
  { value: 3, key: "AGENT_ROLE_ENGINEERING_MANAGER", label: "Engineering Manager", code: "EM" },
  { value: 4, key: "AGENT_ROLE_STAFF_CLIENT", label: "Staff Client Engineer", code: "SCE" },
  { value: 5, key: "AGENT_ROLE_STAFF_BACKEND", label: "Staff Backend Engineer", code: "SBE" },
  { value: 6, key: "AGENT_ROLE_STAFF_PLATFORM", label: "Staff Platform Engineer", code: "SPE" }
];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

test("canonical customer labels stay aligned with the pinned AgentRole enum", () => {
  assert.deepEqual(CANONICAL_AGENT_ROLES, expected);
  const proto = read("vendor/platform-protos/deepnavy/v1/agents_pb.ts");
  for (const role of expected) {
    assert.match(proto, new RegExp(`@generated from enum value: ${role.key}\\s*=\\s*${role.value};`));
    assert.deepEqual(canonicalAgentRole(role.value), role);
    assert.deepEqual(canonicalAgentRole(role.key), role);
  }
  assert.equal(canonicalAgentRole(0), null);
  assert.equal(canonicalAgentRole("AGENT_ROLE_UNKNOWN"), null);
});

test("home role register uses the exact canonical labels in order", () => {
  const home = read("index.md");
  const labels = [...home.matchAll(/<strong role="cell">([^<]+)<\/strong>/g)].map((match) => match[1]);
  assert.deepEqual(labels, expected.map((role) => role.label));
});

test("customer app fails closed through the canonical role contract", () => {
  const app = read("assets/js/app.js");
  assert.match(app, /canonicalAgentRole/);
  assert.doesNotMatch(app, /Product engineer|Reliability engineer|Code reviewer/i);
});

test("customer economics expose only usage, credits, budgets, and attributable cost", () => {
  const app = read("assets/js/app.js");
  const shell = read("_includes/app-shell.html");
  for (const source of [app, shell]) {
    assert.doesNotMatch(source, /gross\s*profit|gross\s*margin|data-economics-revenue|economicsRevenue/i);
  }
  assert.match(shell, /Attributable cost/);
  assert.match(shell, /Credits used/);
  assert.match(shell, /Credits remaining/);
});
