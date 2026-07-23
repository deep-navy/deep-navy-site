---
title: Security
image: /assets/images/og/security.png
description: Review deep navy trust boundaries, credential handling, resource scopes, request enforcement, runtime isolation, and disclosure process.
updated: 2026-07-17
hide_cta: true
---

<section class="page-hero">
  <div class="shell">
    <span class="eyebrow">Security reference / early access</span>
    <h1>Boundaries, credentials, and enforcement.</h1>
    <p>This record separates controls visible in the customer application from controls that require validation in each AWS, GitHub, Stripe, and Kubernetes deployment.</p>
    <div class="page-meta">
      <span>Scope: customer application + service boundary</span>
      <span>Reviewed: 2026-07-17</span>
      <span><a href="{{ '/trust/#status-index' | relative_url }}">Deployment status index</a></span>
      <span><a href="mailto:security@deep.navy">security@deep.navy</a></span>
    </div>
  </div>
</section>

<section class="content-section">
  <div class="shell content-grid">
    <header>
      <span class="eyebrow">Control matrix</span>
      <h2>Enforcement by trust boundary.</h2>
    </header>
    <div class="prose">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>Boundary</th><th>Credential</th><th>Scope</th><th>Lifetime</th><th>Enforcement</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Browser → Cognito</td>
              <td>Authorization code + PKCE verifier</td>
              <td>One sign-in transaction and configured OAuth scopes</td>
              <td>Client transaction expires after 10 minutes; the code is one-time</td>
              <td>S256 challenge, state, nonce, callback URI, client, token-use, and expiration checks</td>
              <td>Implemented in customer application</td>
            </tr>
            <tr>
              <td>Browser → Platform API</td>
              <td>Cognito access token</td>
              <td>Requested organization, installation, repository, team, activity, or economics resource</td>
              <td>JWT expiration; the browser shell has no refresh-token persistence</td>
              <td>Bearer authentication and resource authorization must execute server-side on every request</td>
              <td>Service contract; deployment validation required</td>
            </tr>
            <tr>
              <td>User → Organization</td>
              <td>Authenticated principal + server membership record</td>
              <td>Organizations returned for that principal</td>
              <td>Evaluated per request</td>
              <td>The API checks membership and rejects client-supplied resource IDs outside the current scope</td>
              <td>Service contract; deployment validation required</td>
            </tr>
            <tr>
              <td>Platform service → GitHub</td>
              <td>GitHub App installation token</td>
              <td>Installed GitHub organization and approved repositories</td>
              <td>Short-lived token issued by GitHub</td>
              <td>GitHub App installation mapping and repository selection remain server-side</td>
              <td>Deployment dependent</td>
            </tr>
            <tr>
              <td>Platform → Team runtime</td>
              <td>Kubernetes service identity and injected runtime credentials</td>
              <td>One customer team namespace and its provisioned services</td>
              <td>Runtime or lease lifetime; rotation is an environment responsibility</td>
              <td>The provisioner assigns the namespace and team runtime; cluster policy requires deployment verification</td>
              <td>Deployment dependent</td>
            </tr>
            <tr>
              <td>Team runtime → Model and telemetry providers</td>
              <td>Server-managed provider credentials</td>
              <td>The configured team runtime and provider project</td>
              <td>Secret version and rotation policy set by the deployment</td>
              <td>AWS Secrets Manager supplies server-side values at runtime; the public site excludes them</td>
              <td>Deployment dependent</td>
            </tr>
            <tr>
              <td>Billing service ↔ Stripe</td>
              <td>Stripe server secret and webhook signature</td>
              <td>Organization checkout and subscription records</td>
              <td>Checkout Session lifetime and configured key rotation</td>
              <td>Stripe Payment Element (Stripe-hosted encrypted fields inside deep navy’s checkout), signed webhook verification, server-owned prices, idempotent event processing, and exact-origin hosted-invoice links</td>
              <td>Deployment dependent</td>
            </tr>
            <tr>
              <td>Activity service → Browser</td>
              <td>Cognito access token</td>
              <td>Selected team ID</td>
              <td>Authenticated stream lifetime</td>
              <td>Team authorization and normalized safe summaries; provider credentials and hidden model reasoning are excluded</td>
              <td>Generated service contract; deployment validation required</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Implementation and deployment status are maintained in the <a href="{{ '/trust/#status-index' | relative_url }}">trust status index</a>. A contract row records the required enforcement point and carries no independent audit assurance.</p>
    </div>
  </div>
</section>

<section class="content-section">
  <div class="shell content-grid">
    <header>
      <span class="eyebrow">Request path</span>
      <h2>An authenticated resource read.</h2>
    </header>
    <div class="prose">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Seq.</th><th>Direction</th><th>Request or decision</th><th>Result</th></tr></thead>
          <tbody>
            <tr><td><code>01</code></td><td>Browser → Cognito</td><td><code>GET /oauth2/authorize</code> carries the public client ID, exact callback URI, state, nonce, S256 challenge, and configured scopes.</td><td>Cognito authenticates the user and issues a one-time authorization code.</td></tr>
            <tr><td><code>02</code></td><td>Cognito → Browser</td><td>The callback carries <code>code</code> and <code>state</code>.</td><td>The browser matches state, transaction age, and callback URI before any token request.</td></tr>
            <tr><td><code>03</code></td><td>Browser → Cognito</td><td><code>POST /oauth2/token</code> carries the code, PKCE verifier, public client ID, and exact callback URI.</td><td>Cognito returns access and ID tokens; the one-time transaction is removed.</td></tr>
            <tr><td><code>04</code></td><td>Browser → Platform API</td><td>The generated client sends <code>Authorization: Bearer &lt;access token&gt;</code> and <code>X-Request-ID: &lt;request ID&gt;</code>. Credentials are omitted from ambient browser fetch state.</td><td>The static host makes no authorization decision.</td></tr>
            <tr><td><code>05</code></td><td>Platform API</td><td>Authenticate the token; authorize the principal against the organization and requested resource; validate the request message.</td><td>An out-of-scope request is rejected before domain work.</td></tr>
            <tr><td><code>06</code></td><td>Domain service → Persistence or runtime</td><td>Use server credentials for the minimum service operation attached to the authorized resource.</td><td>The service persists the operation or reads the scoped record.</td></tr>
            <tr><td><code>07</code></td><td>Platform API → Browser</td><td>Return the versioned response, safe error, and request ID. Activity responses contain normalized summaries.</td><td>The application renders loading, empty, measured, or unavailable state from the response.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>

<section class="content-section">
  <div class="shell content-grid">
    <header>
      <span class="eyebrow">Token handling</span>
      <h2>Browser and server custody.</h2>
    </header>
    <div class="prose">
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Material</th><th>Custody</th><th>Removal or expiry</th><th>Browser exposure</th></tr></thead>
          <tbody>
            <tr><td>OAuth state, nonce, and PKCE verifier</td><td><code>sessionStorage</code> in the initiating browser tab</td><td>Removed before token exchange; rejected after 10 minutes</td><td>Present only for the sign-in transaction</td></tr>
            <tr><td>Authorization code</td><td>Callback query until processing</td><td>One-time exchange; callback query is removed from browser history state</td><td>Briefly present in the callback URL</td></tr>
            <tr><td>Access token</td><td>JavaScript memory</td><td>Cleared on refresh or sign-out; rejected after token expiration</td><td>Sent only as the API bearer credential</td></tr>
            <tr><td>ID token</td><td>JavaScript memory</td><td>Cleared on refresh or sign-out; rejected after token expiration</td><td>Used to establish the displayed user identity</td></tr>
            <tr><td>GitHub App private key and installation token</td><td>Server-side secret store and integration service</td><td>Installation tokens expire; key rotation follows deployment procedure</td><td>Excluded</td></tr>
            <tr><td>Stripe secret and webhook signing secret</td><td>Server-side secret store and billing service</td><td>Rotation follows deployment procedure</td><td>Excluded</td></tr>
            <tr><td>Stripe publishable key and Checkout client secret</td><td>Public runtime configuration and JavaScript memory</td><td>Client secret expires with the Checkout Session and is cleared when the iframe is destroyed</td><td>Used only to initialize Stripe.js; never persisted or logged</td></tr>
            <tr><td>Model, runtime, and telemetry provider credentials</td><td>AWS Secrets Manager and the authorized runtime</td><td>Secret-version and rotation policy set by deployment</td><td>Excluded</td></tr>
          </tbody>
        </table>
      </div>
      <p>Public runtime configuration contains the API origin, Cognito domain, public client ID, callback URLs, OAuth scopes, plan ID, Stripe publishable key, and build revision. Provider credentials, GitHub App keys, Stripe secret/restricted keys, webhook signing secrets, and runtime keys do not belong in that configuration.</p>
    </div>
  </div>
</section>

<section class="content-section">
  <div class="shell content-grid">
    <header>
      <span class="eyebrow">Disclosure</span>
      <h2>Security report intake.</h2>
    </header>
    <div class="prose">
      <p>Send the affected surface, impact, and reproducible steps to <a href="mailto:security@deep.navy">security@deep.navy</a>. Do not access another customer's data, interrupt service, or publish the issue before coordination.</p>
      <p>Request an encrypted reporting channel before sending sensitive material. Do not send credentials, access tokens, authorization codes, private keys, customer source code, or payment information by email.</p>
      <p>deep navy currently makes no claim of SOC 2 certification, ISO 27001 certification, a published penetration-test attestation, or a contractual uptime commitment. The <a href="{{ '/trust/#status-index' | relative_url }}">status index</a> records the current statement for each item.</p>
    </div>
  </div>
</section>
