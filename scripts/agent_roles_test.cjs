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
  // The register moved from a facts list to the marketing kit's crew strip
  // in the 2026 rebuild. What the test protects is the vocabulary, not the
  // element: the home page must name the same roles the product does, in
  // the same words, under the roster's own canonical keys — so the strip
  // can never drift from the enum the app renders.
  const cells = [...home.matchAll(/<li class="lp-crew-cell" data-role-key="([A-Z_]+)">[\s\S]*?<span class="lp-crew-role">([^<]+)<\/span>/g)]
    .map((match) => ({ key: match[1], label: match[2] }));
  assert.deepEqual(cells, [
    { key: "AGENT_ROLE_TECHNICAL_PRODUCT_MANAGER", label: "Product Manager" },
    { key: "AGENT_ROLE_ENGINEERING_MANAGER", label: "Engineering Manager" },
    { key: "AGENT_ROLE_PRODUCT_DESIGNER", label: "Product Designer" },
    { key: "AGENT_ROLE_STAFF_CLIENT", label: "Engineer 1" },
    { key: "AGENT_ROLE_STAFF_BACKEND", label: "Engineer 2" },
    { key: "AGENT_ROLE_STAFF_PLATFORM", label: "Engineer 3" },
  ]);
  // The scaling truth stays on the page in the reader's words.
  assert.match(home, /Three is the floor/);
  // Marketing must not leak runtime jargon that no longer matches the product.
  assert.doesNotMatch(home, /Staff (Client|Backend|Platform) Engineer|Technical Product Manager/);
});

test("customer app fails closed through the canonical role contract", () => {
  const app = read("assets/js/app.js");
  assert.match(app, /canonicalAgentRole/);
  assert.doesNotMatch(app, /Product engineer|Reliability engineer|Code reviewer/i);
});

/* CHANGED DELIBERATELY: the reading was "Attributable cost", which rendered
 * economics.directCost — OUR provider cost for the work. It was never the
 * customer's money: the ledger converts cost to credits at the published rate,
 * so the two sit a margin apart, and an unlabelled dollar figure next to a
 * credit figure is how a customer ends up unable to say whether they spent $75
 * or $188. The panel now reads the credits and those same credits in money.
 *
 * The margin assertions below are the point of this test and are unchanged —
 * they are what keeps an internal profitability figure off a customer screen,
 * and taking direct cost off the panel only strengthens that. */
test("customer economics expose usage, credits and budgets — never our own cost or margin", () => {
  const app = read("assets/js/app.js");
  const shell = read("_includes/app-shell.html");
  for (const source of [app, shell]) {
    assert.doesNotMatch(source, /gross\s*profit|gross\s*margin|data-economics-revenue|economicsRevenue/i);
  }
  assert.match(shell, /Credits used/);
  assert.match(shell, /What that is in money/);
  assert.match(shell, /Credits remaining/);
  assert.doesNotMatch(shell, /Attributable cost/, "our provider cost is not a customer reading");
  assert.doesNotMatch(app, /economicsDirectCost/, "the direct-cost hook is gone, not merely unread");
});
