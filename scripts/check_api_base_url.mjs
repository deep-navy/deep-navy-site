// Refuse to publish a site pointed at an API hostname that does not exist.
//
// The site shipped SITE_API_BASE_URL=https://dev.api.deep.navy for an API that
// is served at https://api.dev.deep.navy - the labels transposed. That hostname
// has no Route 53 record, no zone, and no ingress rule, so every call the app
// made failed at DNS. Sign-in could not start, and the only symptom the user
// ever saw was "deep navy could not begin GitHub sign-in. No credentials were
// sent." Nothing in the build objected, because a string that looks like a
// hostname passes every check that only reads the string.
//
// Deep Navy runs both spellings across its estate - api.dev.deep.navy for the
// API, dev.admin.deep.navy for the admin site - so the transposition is not a
// typo anyone would spot by eye. It has to be checked against DNS.
//
// This resolves the host rather than calling it. NXDOMAIN is the failure that
// actually happened and DNS does not flap, so the check stays honest without
// blocking a deploy during a transient API outage.

import { lookup } from "node:dns/promises";

const raw = (process.env.SITE_API_BASE_URL || "").trim();

if (!raw) {
  // Local builds and the public marketing site legitimately have no API.
  console.log("check:api-base-url - SITE_API_BASE_URL is unset, nothing to verify");
  process.exit(0);
}

let url;
try {
  url = new URL(raw);
} catch {
  console.error(`check:api-base-url - SITE_API_BASE_URL is not a URL: ${raw}`);
  process.exit(1);
}

if (url.protocol !== "https:") {
  console.error(`check:api-base-url - SITE_API_BASE_URL must be https, got ${url.protocol}//`);
  process.exit(1);
}

if (url.pathname !== "/" || url.search || url.hash) {
  console.error(`check:api-base-url - SITE_API_BASE_URL must be a bare origin, got ${raw}`);
  process.exit(1);
}

try {
  const { address } = await lookup(url.hostname);
  console.log(`check:api-base-url - ${url.hostname} resolves to ${address}`);
} catch (error) {
  console.error(
    `check:api-base-url - ${url.hostname} does not resolve (${error.code || error.message}).\n` +
      "  The app would fail every request at DNS and sign-in could not start.\n" +
      "  Check the label order: the API is api.<env>.deep.navy, not <env>.api.deep.navy."
  );
  process.exit(1);
}
