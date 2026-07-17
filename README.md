# deep-navy-site

Public Jekyll site and authenticated early-access customer shell for Deep Navy.
Public pages are rendered as static HTML. `/app/` uses a public Amazon Cognito
app client with OAuth 2.0 authorization code + PKCE, then calls the configured
ConnectRPC API for server-confirmed onboarding state.

The onboarding client targets the trusted organization contract introduced by
`platform-protos` revision `12b20f153f6ca4afb6c9e2c7e2fa434d1dfe58b7`.

The browser contains no provider credentials or client secret. The PKCE verifier
and OAuth state are transient in `sessionStorage`; access and ID tokens remain in
memory and are cleared by a hard refresh or sign-out.

## Run locally

```sh
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

## Onboarding behavior

The app never synthesizes completion:

- `GetCurrentUser` is the only source of user memberships and current organization context.
- A first organization is created only through idempotent `BootstrapOrganization`; an ambiguous retry reuses its key.
- `SelectOrganization` accepts only an organization returned in `GetCurrentUser.memberships`.
- GitHub is complete only after `GetGitHubInstallation` returns an active installation.
- Billing is complete only after `GetSubscription` returns `active` or `trialing`.
- A team appears only after `ListTeams` or `CreateTeam` returns it.
- Redirect URLs returned by APIs must use HTTPS and an allowlisted GitHub or Stripe host.
- API errors show an actionable unavailable state and, when present, a request ID.

## Verification

The custom Pages workflow builds with Ruby 3.3 and Jekyll 4.4.1, then uploads
the rendered `_site` directory through the official Pages artifact actions.

```sh
node --check assets/js/site.js
node --check assets/js/organization-onboarding.js
node --check assets/js/app.js
node --test scripts/onboarding_contract_test.cjs
bundle exec jekyll build --strict_front_matter
ruby scripts/check_site.rb _site
```
