"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");

test("customer billing history is visible, typed, organization scoped, and paginated", () => {
  assert.match(shell, /data-invoice-history/);
  assert.match(shell, /data-invoice-list/);
  assert.match(shell, /data-invoice-more/);
  assert.match(client, /case "invoices":[\s\S]*billing\.listInvoices/);
  assert.match(client, /case "invoice":[\s\S]*billing\.getInvoice/);
  assert.match(app, /apiRequest\("invoices", \{ organizationId: session\.organizationId, page: \{ pageSize: 25 \} \}\)/);
  assert.match(app, /apiRequest\("invoices", \{ organizationId, page: \{ pageSize: 25, pageToken \} \}\)/);
  assert.match(app, /ui\.invoiceMore\.addEventListener\("click", loadMoreInvoices\)/);
});

test("invoice pages fail closed on scope, malformed money, duplicates, and cursor loops", () => {
  assert.match(app, /stringValue\(invoice\.organizationId\) !== session\.organizationId/);
  assert.match(app, /canonicalMoneyValue/);
  assert.match(app, /BillingService returned a duplicate invoice/);
  assert.match(app, /repeated invoice page cursor/);
  assert.match(app, /invoices\.length > 25/);
  assert.doesNotMatch(app, /innerHTML/);
});

test("receipt links use only the exact Stripe invoice origin and a no-referrer new tab", () => {
  assert.match(app, /url\.host !== "invoice\.stripe\.com"/);
  assert.match(app, /receipt\.rel = "noopener noreferrer"/);
  assert.match(app, /receipt\.referrerPolicy = "no-referrer"/);
  assert.match(app, /validatedHostedInvoiceURL\(invoice\.hostedInvoiceUrl\)/);
  assert.doesNotMatch(shell, /stripe_(?:invoice|customer|subscription)_id/i);
});
