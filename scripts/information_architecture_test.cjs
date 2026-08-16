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
  // The sign-in door carries ?signin=1. A bare /app/ link bounces a signed-out
  // visitor straight back to the homepage, so it is not a way in at all.
  ["Sign in", "/app/?signin=1"]
];

test("desktop and mobile navigation expose the complete customer information architecture", () => {
  for (const [label, path] of requiredDestinations) {
    // Escape the query separator too: unescaped, "?" makes the slash before
    // it optional and the pattern stops matching the link it is looking for.
    const pattern = path.replaceAll("/", "\\/").replaceAll("?", "\\?");
    const occurrences = header.match(new RegExp(`href=\\"\\{\\{ '${pattern}' \\| relative_url \\}\\}\\"`, "g")) || [];
    const expected = label === "Sign in" ? 3 : 2;
    assert.ok(occurrences.length >= expected, `${label} must be reachable in desktop and mobile navigation`);
  }
  assert.match(header, />Continue with GitHub</);
  assert.match(header, />Sign in with GitHub</);
});

test("footer keeps product, solution, customer, resource, documentation, and trust paths reachable", () => {
  for (const path of ["/product/", "/solutions/", "/economics/", "/customers/", "/blog/", "/pricing/", "/docs/", "/security/", "/trust/"]) {
    assert.ok(footer.includes(`'${path}' | relative_url`), `${path} is missing from the footer`);
  }
});
