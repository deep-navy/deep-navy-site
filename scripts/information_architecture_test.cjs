"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const header = readFileSync("_includes/header.html", "utf8");
const footer = readFileSync("_includes/footer.html", "utf8");

// The top navigation is five destinations, not the whole sitemap. A reader
// deciding whether to put a team on their repository needs to know what it is,
// what it costs, how it works, whether it is safe, and what we have written -
// and every other page stays one click away in the footer, which is where a
// sitemap belongs. Solutions, Economics and Customers were dropped from the
// header for that reason; "Economics" was internal vocabulary besides.
// Five destinations, named the way the reader would name them rather than the
// way a sitemap would. "Economics" was our word for the page; "Ledger" is
// theirs, and the receipts are the argument, so it sits second. Product and
// Solutions collapse into one question a buyer actually asks. Blog and
// Customers moved to the footer, which is where a sitemap belongs.
const requiredDestinations = [
  ["How it works", "/product/"],
  ["Ledger", "/economics/"],
  ["What it costs", "/pricing/"],
  ["Security", "/security/"],
  ["Docs", "/docs/"],
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
