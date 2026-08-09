const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const { CANONICAL_AGENT_ROLES, canonicalAgentRole } = require(path.join(root, "assets/js/agent-roles.js"));

const expected = [
  { value: 1, key: "AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER", label: "Product Manager", code: "PM" },
  { value: 2, key: "AGENT_ROLE_PRODUCT_DESIGNER", label: "Product Designer", code: "PD" },
  { value: 3, key: "AGENT_ROLE_ENGINEERING_MANAGER", label: "Engineering Manager", code: "EM" },
  { value: 4, key: "AGENT_ROLE_STAFF_CLIENT", label: "Engineer", code: "E1" },
  { value: 5, key: "AGENT_ROLE_STAFF_BACKEND", label: "Engineer", code: "E2" },
  { value: 6, key: "AGENT_ROLE_STAFF_PLATFORM", label: "Engineer", code: "E3" },
  { value: 7, key: "AGENT_ROLE_ENGINEER", label: "Engineer", code: "EN", repeatable: true }
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

test("home role register presents the customer team structure", () => {
  const home = read("index.md");
  // The register moved from a table to a list in the 2026 rebuild. What the
  // test protects is the vocabulary, not the element: the home page must name
  // the same roles the product does, in the same words.
  const labels = [...home.matchAll(/<li><strong>(?:<svg[^>]*>.*?<\/svg>)?([^<]+)<\/strong>/g)].map((match) => match[1].trim());
  assert.deepEqual(labels, ["Product Manager", "Engineering Manager", "Product Designer", "Engineers × 3–50"]);
  // Marketing must not leak runtime jargon that no longer matches the product.
  assert.doesNotMatch(home, /Staff (Client|Backend|Platform) Engineer|Technical Product Manager/);
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
