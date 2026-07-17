# deep-navy-site

Public Jekyll site and authenticated early-access customer shell for Deep Navy.
Public pages are rendered as static HTML. `/app/` uses a public Amazon Cognito
app client with OAuth 2.0 authorization code + PKCE, then calls the configured
ConnectRPC API for server-confirmed onboarding state.

The onboarding client targets the additive launch contract finalized by
`platform-protos` revision `fa01d7cc4c68c1e7ee606a44677ad70d16f4c563`.
Only the generated Protobuf-ES descriptors required by this site are vendored
under `vendor/platform-protos`; `REVISION` and `MANIFEST.sha256` pin and verify
their source. The browser bundle uses the generated service descriptors with
Connect v2 instead of maintaining handwritten RPC paths or transport models.

The browser contains no provider credentials or client secret. The PKCE verifier
and OAuth state are transient in `sessionStorage`; access and ID tokens remain in
memory and are cleared by a hard refresh or sign-out.

The product GitHub App callback's one-time OAuth code and state are also held
only in the current tab while the customer re-authenticates with Cognito. They
are sent once to `CompleteGitHubInstallation`, never rendered, logged, or stored
in local storage, and are cleared after completion or a terminal error.

## Run locally

```sh
node --version # 22.14.0 or newer
npm ci
npm run build
bundle install
bundle exec jekyll serve --livereload
```

The marketing site works without runtime configuration. The app intentionally
shows a not-configured state and makes no backend requests.

To exercise a deployed development environment locally, set the public values
and generate the ignored runtime overlay:

```sh
DEEP_NAVY_ENVIRONMENT=development \
SITE_API_BASE_URL=https://api.dev.deep.navy \
SITE_COGNITO_DOMAIN=https://YOUR_DOMAIN.auth.us-west-2.amazoncognito.com \
SITE_COGNITO_CLIENT_ID=YOUR_PUBLIC_CLIENT_ID \
SITE_COGNITO_CALLBACK_URL=http://localhost:4000/app/callback/ \
SITE_COGNITO_LOGOUT_URL=http://localhost:4000/app/ \
ruby scripts/write_runtime_config.rb

bundle exec jekyll serve --config _config.yml,_config.runtime.yml
```

The callback and logout URLs must be allowlisted on the Cognito app client.
Never add a Cognito client secret, AWS credential, GitHub App private key,
Stripe key, access token, or password to these variables.

## GitHub environment variables

The `develop` branch deploys through the `development` environment. `main`
deploys through `production`. Configure these public build inputs as GitHub
**environment variables**, not secrets:

| Variable | Example | Required |
| --- | --- | --- |
| `SITE_API_BASE_URL` | `https://api.dev.deep.navy` | for API-backed onboarding |
| `SITE_COGNITO_DOMAIN` | `https://deep-navy-dev.auth.us-west-2.amazoncognito.com` | for sign-in |
| `SITE_COGNITO_CLIENT_ID` | Cognito public app-client ID | for sign-in |
| `SITE_COGNITO_CALLBACK_URL` | exact deployed `/app/callback/` URL | for sign-in |
| `SITE_COGNITO_LOGOUT_URL` | exact deployed `/app/` URL | for sign-out |
| `SITE_PLAN_ID` | `founding-team` | optional; this is the default |

`scripts/write_runtime_config.rb` accepts only this explicit public allowlist and
JSON-encodes it into `_config.runtime.yml`. The rendered configuration is visible
to every browser, as it must be for a public OAuth client.

## Product GitHub App settings

For the development Pages deployment, configure the customer-facing product
GitHub App—not the infrastructure automation App—as follows:

- Enable **Request user authorization (OAuth) during installation**.
- Set the first **Callback URL** to the exact rendered
  `/app/github/callback/` URL, including the GitHub Pages project base path.
- Leave **Setup URL** blank. GitHub makes it unavailable when OAuth during
  installation is enabled.
- Keep expiring user authorization tokens enabled. The API exchanges the
  one-time code, verifies the installation through `GET /user/installations`,
  independently confirms it with App authentication, and discards the user
  token.

GitHub's documented OAuth callback guarantees `code` and server-provided
`state`. `installation_id` and `setup_action` are accepted when present but are
not required by the browser; the API must securely resolve and verify the
installation when GitHub omits them.

## Onboarding behavior

The app never synthesizes completion:

- `GetCurrentUser` is the only source of user memberships and current organization context.
- A first organization is created only through idempotent `BootstrapOrganization`; an ambiguous retry reuses its key.
- `SelectOrganization` accepts only an organization returned in `GetCurrentUser.memberships`.
- GitHub starts through idempotent `StartGitHubInstallation` and is complete
  only after `CompleteGitHubInstallation` or `GetGitHubInstallation` returns an
  explicitly active typed state.
- Repository access is complete only after `GetRepositorySelection` or
  `UpdateRepositorySelection` returns a selection containing at least one
  currently accessible repository.
- The checkout display uses `GetBillingPlan`; billing is complete only after
  `GetSubscription` returns typed `ACTIVE` or `TRIALING` state.
- A team appears only after `ListTeams` or `CreateTeam` returns it.
- Queued and running teams poll `GetProvisioningStatus`, with `GetTeam` as an
  additive compatibility fallback until the public Connect stream is exposed.
- Redirect URLs returned by APIs must use HTTPS and an allowlisted GitHub or Stripe host.
- API errors show an actionable unavailable state and, when present, a request ID.

## Verification

The custom Pages workflow builds with Ruby 3.3 and Jekyll 4.4.1, then uploads
the rendered `_site` directory through the official Pages artifact actions.

```sh
npm run check:vendor
npm run typecheck
npm run build
node --check assets/js/site.js
node --check assets/js/callback-scrubber.js
node --check assets/js/platform-api-client.js
node --check assets/js/organization-onboarding.js
node --check assets/js/launch-contract.js
node --check assets/js/app.js
npm test
ruby scripts/runtime_config_test.rb
bundle exec jekyll build --strict_front_matter
ruby scripts/check_site.rb _site
```
