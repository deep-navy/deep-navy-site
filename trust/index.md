---
title: Trust Status
image: /assets/images/og/trust.png
description: Review the current implementation, deployment, and assurance status of deep navy security and data-handling controls.
updated: 2026-07-17
hide_cta: true
---

<section class="page-hero">
  <div class="shell">
    <span class="eyebrow">Trust status / early access</span>
    <h1>Current control and assurance status.</h1>
    <p>Each row states what can be verified in the customer application, what remains dependent on the active deployment, and what has not been completed.</p>
    <div class="page-meta">
      <span>Owner: deep navy</span>
      <span>Last reviewed: 2026-07-17</span>
      <span>Security: <a href="mailto:security@deep.navy">security@deep.navy</a></span>
      <span>Privacy: <a href="mailto:privacy@deep.navy">privacy@deep.navy</a></span>
    </div>
  </div>
</section>

<section class="content-section" id="status-index">
  <div class="shell content-grid">
    <header>
      <span class="eyebrow">Status index</span>
      <h2>Reviewed statements.</h2>
    </header>
    <div class="prose">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Control or assurance item</th><th>Current status</th><th>Current statement</th><th>Evidence or next verification</th></tr></thead>
          <tbody>
            <tr>
              <td>Public site secret boundary</td>
              <td>Implemented in site</td>
              <td>Runtime configuration is limited to public API and OAuth coordinates, plan ID, environment, and build revision.</td>
              <td>Static configuration schema and browser bundle review.</td>
            </tr>
            <tr>
              <td>Authorization code with PKCE</td>
              <td>Implemented in site</td>
              <td>The customer application creates an S256 verifier challenge and checks state, nonce, client, token use, and expiration.</td>
              <td>Customer application authentication flow.</td>
            </tr>
            <tr>
              <td>Persistent browser token storage</td>
              <td>Excluded in site</td>
              <td>Access and ID tokens remain in memory and are absent from <code>localStorage</code>. Refresh and sign-out clear them.</td>
              <td>Customer application storage and sign-out paths.</td>
            </tr>
            <tr>
              <td>Server-side resource authorization</td>
              <td>Deployment validation required</td>
              <td>The service contract requires authorization for organization, repository, team, activity, approval, and economics operations.</td>
              <td>Validate middleware and resource-scope tests in the deployed platform API.</td>
            </tr>
            <tr>
              <td>GitHub App repository scope</td>
              <td>Deployment dependent</td>
              <td>The integration model uses a customer-installed GitHub App, installation mapping, approved repositories, and short-lived installation tokens.</td>
              <td>Verify the installed App permissions, selected repositories, callback, and server secret custody.</td>
            </tr>
            <tr>
              <td>Stripe subscription authority</td>
              <td>Deployment dependent</td>
              <td>Stripe Embedded Checkout renders isolated payment fields. Subscription state changes only after signed webhook processing.</td>
              <td>Verify webhook signature enforcement, idempotency, event destinations, and live-mode keys.</td>
            </tr>
            <tr>
              <td>Per-team Kubernetes runtime</td>
              <td>Deployment dependent</td>
              <td>The provisioner contract assigns a namespace and runtime records to each customer team.</td>
              <td>Verify namespace, service identity, cluster policy, network path, teardown, and backup behavior in each environment.</td>
            </tr>
            <tr>
              <td>Provider credential custody</td>
              <td>Deployment dependent</td>
              <td>Provider credentials belong in AWS Secrets Manager and are supplied only to authorized services or team runtimes.</td>
              <td>Verify secret resource policies, workload access, rotation, audit events, and absence from static configuration.</td>
            </tr>
            <tr>
              <td>Normalized activity visibility</td>
              <td>Contract defined</td>
              <td>The generated activity service streams team-scoped safe summaries. Provider credentials and hidden model reasoning are outside the customer event record.</td>
              <td>Validate authorization and redaction against the deployed activity service.</td>
            </tr>
            <tr>
              <td>Approval queue discovery</td>
              <td>Contract implemented</td>
              <td>The approval service lists only team-scoped pending safe summaries, requires current membership, and restricts decisions to authorized owners or administrators. Denials require a bounded reason.</td>
              <td>Validate deployed authorization, snapshot pagination, and immutable decision audit events.</td>
            </tr>
            <tr>
              <td>Retention, deletion, and subprocessor schedule</td>
              <td>Engagement specific</td>
              <td>These terms are confirmed for each early-access engagement and have not been published as a general schedule.</td>
              <td>Publish the approved schedule before general availability.</td>
            </tr>
            <tr>
              <td>SOC 2 report</td>
              <td>Not completed</td>
              <td>No SOC 2 report is currently claimed.</td>
              <td>Scope and complete an independent examination before changing this status.</td>
            </tr>
            <tr>
              <td>ISO 27001 certification</td>
              <td>Not completed</td>
              <td>No ISO 27001 certification is currently claimed.</td>
              <td>Establish the certification scope and accredited audit before changing this status.</td>
            </tr>
            <tr>
              <td>Published penetration-test attestation</td>
              <td>Not completed</td>
              <td>No published penetration-test attestation is currently claimed.</td>
              <td>Complete an authorized assessment and define customer-accessible reporting.</td>
            </tr>
            <tr>
              <td>Contractual uptime commitment</td>
              <td>Not published</td>
              <td>No generally available uptime SLA is currently claimed.</td>
              <td>Publish service-level terms with measurement and remedy definitions before changing this status.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Questions about a row: <a href="mailto:security@deep.navy">security@deep.navy</a>. Data requests: <a href="mailto:privacy@deep.navy">privacy@deep.navy</a>. Do not send credentials, authorization codes, access tokens, customer source code, or payment information by email.</p>
    </div>
  </div>
</section>
