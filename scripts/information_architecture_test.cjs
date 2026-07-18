"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const header = readFileSync("_includes/header.html", "utf8");
const footer = readFileSync("_includes/footer.html", "utf8");

const requiredDestinations = [
  ["Product", "/product/"],
  ["Solutions", "/solutions/"],
  ["Economics", "/economics/"],
  ["Customers", "/customers/"],
  ["Pricing", "/pricing/"],
  ["Resources", "/blog/"],
  ["Docs", "/docs/"],
  ["Security", "/security/"],
  ["Sign in", "/app/"]
];

test("desktop and mobile navigation expose the complete customer information architecture", () => {
  for (const [label, path] of requiredDestinations) {
    const occurrences = header.match(new RegExp(`href=\\"\\{\\{ '${path.replaceAll("/", "\\/")}' \\| relative_url \\}\\}\\"`, "g")) || [];
    const expected = label === "Sign in" ? 3 : 2;
    assert.ok(occurrences.length >= expected, `${label} must be reachable in desktop and mobile navigation`);
  }
  assert.match(header, />Start onboarding</);
});

test("footer keeps product, solution, customer, resource, documentation, and trust paths reachable", () => {
  for (const path of ["/product/", "/solutions/", "/economics/", "/customers/", "/blog/", "/pricing/", "/docs/", "/security/", "/trust/"]) {
    assert.ok(footer.includes(`'${path}' | relative_url`), `${path} is missing from the footer`);
  }
});
