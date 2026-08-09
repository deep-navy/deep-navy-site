"use strict";

// Fail the build when the app can print our machinery to a customer.
//
// check_site.rb reads rendered HTML, so it cannot see anything app.js builds
// after load. That gap is exactly how "ECONOMICSSERVICE SNAPSHOT MEASURED
// SNAPSHOT" and "PV PROVISIONINGSERVICE SNAPSHOT SUCCEEDED PROVISIONING EVENT
// 13" reached a customer's activity feed: both are strings constructed at
// runtime and assigned to fields the timeline renders.
//
// This checks the two ways a service name reaches the screen:
//   1. as a value on a rendered field (source, title, detail, sequenceLabel)
//   2. as display text assigned to an element
//
// Thrown errors are exempt. Those are for us, never rendered, and asking them
// to be vague would make failures harder to diagnose for no customer benefit.

const { readFileSync } = require("node:fs");

const app = readFileSync("assets/js/app.js", "utf8");
const SERVICE = /\b(Activity|Economics|Provisioning|GitHubDelivery|Team|Billing|Auth|Agent|Approval|Objective|Initiative|Workspace)Service\b/;

const failures = [];

// Field assignments that end up on screen. sequenceLabel is included because
// it rendered "Activity event 13" into the meta line.
for (const field of ["source", "title", "detail", "sequenceLabel", "safeSummary"]) {
  const pattern = new RegExp(`\\b${field}\\s*[:=]\\s*(\`[^\`]*\`|"[^"]*"|'[^']*')`, "g");
  for (const match of app.matchAll(pattern)) {
    const literal = match[1];
    if (SERVICE.test(literal)) failures.push(`${field} carries a service name: ${literal.slice(0, 72)}`);
  }
}

// Anything written directly to the DOM.
for (const match of app.matchAll(/\.(textContent|innerText)\s*=\s*("[^"]*"|'[^']*'|`[^`]*`)/g)) {
  if (SERVICE.test(match[2])) failures.push(`rendered text carries a service name: ${match[2].slice(0, 72)}`);
}

if (failures.length) {
  console.error("Customer-facing strings must not name internal services:\n  " + failures.join("\n  "));
  console.error("\nThe customer's model is issues, pull requests, reviews and money.");
  process.exit(1);
}
console.log("Runtime language: no internal service names reach customer-facing strings.");
