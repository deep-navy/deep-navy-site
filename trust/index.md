---
title: Trust Center
description: Review Deep Navy's current security posture, planned controls, data handling principles, deployment model, and responsible disclosure contact.
updated: 2026-07-17
---

<section class="page-hero"><div class="shell"><span class="eyebrow">Trust center</span><h1>Current posture, without the compliance theater.</h1><p>This page distinguishes implemented architecture, deployment-dependent controls, and future assurance work. It will evolve as the service reaches general availability.</p><div class="page-meta"><span>Early access</span><span>Last reviewed July 17, 2026</span></div></div></section>

<section class="content-section"><div class="shell content-grid"><header><span class="eyebrow">Control status</span><h2>What is true today.</h2></header><div class="status-list">
  <div class="status-row"><div><strong>Public site contains no provider secrets</strong><p>Runtime configuration is limited to public OAuth and API coordinates.</p></div><span class="status-label">Implemented</span></div>
  <div class="status-row"><div><strong>Authorization code with PKCE</strong><p>The customer shell uses a public Cognito client, verifier challenge, and one-time state.</p></div><span class="status-label">Implemented</span></div>
  <div class="status-row"><div><strong>Tokens excluded from persistent browser storage</strong><p>Tokens remain in memory; a hard refresh requires authentication again.</p></div><span class="status-label">Implemented</span></div>
  <div class="status-row"><div><strong>Per-team Kubernetes isolation</strong><p>The infrastructure and provisioner design assigns a namespace and Gateway per customer team.</p></div><span class="status-label planned">Deployment dependent</span></div>
  <div class="status-row"><div><strong>GitHub short-lived installation tokens</strong><p>The GitHub App model avoids customer personal access tokens.</p></div><span class="status-label planned">Deployment dependent</span></div>
  <div class="status-row"><div><strong>Formal third-party assurance</strong><p>No SOC 2 report, ISO 27001 certification, or published penetration-test attestation is currently claimed.</p></div><span class="status-label planned">Planned</span></div>
</div></div></section>

<section class="content-section"><div class="shell content-grid"><header><span class="eyebrow">Data principles</span><h2>Collect for the product, not for ambiguity.</h2></header><div class="prose"><ul class="check-list"><li>Repository access is established through a customer-installed GitHub App.</li><li>Customer authorization and resource membership are enforced by the API, not encoded into static pages.</li><li>Provider credentials are held server-side in managed secret stores and injected only where required.</li><li>Normalized activity is customer-visible; hidden model reasoning is not presented as a product artifact.</li><li>Cost records retain provider correlation IDs for reconciliation without making provider invoices the product model.</li><li>Development and production are designed as isolated environments with different secrets.</li></ul><p>Retention periods, subprocessors, deletion timelines, and contractual terms are finalized for each early-access engagement and will be published here before general availability.</p></div></div></section>

<section class="content-section"><div class="shell content-grid"><header><span class="eyebrow">Contacts</span><h2>Ask a direct question.</h2></header><div class="prose"><p><strong>Security and vulnerabilities:</strong> <a href="mailto:security@deep.navy">security@deep.navy</a><br><strong>Privacy and data requests:</strong> <a href="mailto:privacy@deep.navy">privacy@deep.navy</a><br><strong>Customer support:</strong> <a href="mailto:support@deep.navy">support@deep.navy</a></p><p>Do not email credentials, tokens, authorization codes, customer source code, or payment information.</p></div></div></section>
