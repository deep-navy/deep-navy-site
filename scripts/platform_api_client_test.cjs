"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const source = readFileSync("assets/js/platform-api-client.js", "utf8");
const generated = Function(`${source}\nreturn deepNavyGeneratedClient;`)();

function parseRequestBody(body) {
  if (typeof body === "string") return JSON.parse(body);
  if (body instanceof Uint8Array) return JSON.parse(new TextDecoder().decode(body));
  throw new TypeError(`Unexpected request body type: ${Object.prototype.toString.call(body)}`);
}

test("the browser bundle exposes the pinned generated contract", () => {
  assert.equal(generated.PLATFORM_PROTOS_REVISION, "fa01d7cc4c68c1e7ee606a44677ad70d16f4c563");
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("github_install_complete"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("update_repository_selection"));
  assert.ok(generated.SUPPORTED_PROCEDURES.includes("provisioning_status"));
});

test("generated GitHub client derives the RPC path and Protobuf JSON", async () => {
  const calls = [];
  const api = generated.createPlatformApi({
    baseUrl: "https://api.dev.deep.navy",
    fetch: async (input, init) => {
      calls.push({ input: String(input), init });
      return new Response(JSON.stringify({
        installation: {
          id: "42",
          organizationId: "org-1",
          installationState: "GIT_HUB_INSTALLATION_STATE_ACTIVE"
        }
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  const result = await api.request("github_installation", { organizationId: "org-1" }, {
    accessToken: "access-token",
    requestId: "request-1"
  });

  assert.equal(calls.length, 1);
  assert.equal(calls[0].input, "https://api.dev.deep.navy/deepnavy.v1.GitHubService/GetGitHubInstallation");
  assert.equal(new Headers(calls[0].init.headers).get("authorization"), "Bearer access-token");
  assert.equal(new Headers(calls[0].init.headers).get("x-request-id"), "request-1");
  assert.equal(calls[0].init.credentials, "omit");
  assert.equal(calls[0].init.cache, "no-store");
  assert.equal(calls[0].init.redirect, "error");
  assert.equal(calls[0].init.referrerPolicy, "no-referrer");
  assert.deepEqual(parseRequestBody(calls[0].init.body), { organizationId: "org-1" });
  assert.equal(String(result.installation.id), "42");
  assert.equal(result.installation.installationState, 2);
});

test("generated repository client serializes int64 and enum inputs from the UI boundary", async () => {
  let request;
  const api = generated.createPlatformApi({
    baseUrl: "https://api.dev.deep.navy",
    fetch: async (input, init) => {
      request = { input: String(input), init };
      return new Response(JSON.stringify({
        selection: {
          organizationId: "org-1",
          githubInstallationId: "42",
          mode: "REPOSITORY_SELECTION_MODE_SELECTED",
          githubRepositoryIds: ["101"],
          version: "3"
        }
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
  });

  await api.request("update_repository_selection", {
    organizationId: "org-1",
    mode: "REPOSITORY_SELECTION_MODE_SELECTED",
    githubRepositoryIds: ["101"],
    idempotencyKey: "selection-1",
    expectedVersion: "2"
  }, { accessToken: "access-token", requestId: "request-2" });

  assert.equal(request.input, "https://api.dev.deep.navy/deepnavy.v1.RepositoryService/UpdateRepositorySelection");
  assert.deepEqual(parseRequestBody(request.init.body), {
    organizationId: "org-1",
    mode: "REPOSITORY_SELECTION_MODE_SELECTED",
    githubRepositoryIds: ["101"],
    idempotencyKey: "selection-1",
    expectedVersion: "2"
  });
});

test("Connect errors expose only the safe top-level message and request ID", async () => {
  const api = generated.createPlatformApi({
    baseUrl: "https://api.dev.deep.navy",
    fetch: async () => new Response(JSON.stringify({
      code: "not_found",
      message: "No accessible installation was found."
    }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": "server-request"
      }
    })
  });

  await assert.rejects(
    api.request("github_installation", { organizationId: "org-1" }, { accessToken: "access-token", requestId: "client-request" }),
    (error) => {
      assert.equal(error.name, "PlatformClientError");
      assert.equal(error.code, "not_found");
      assert.equal(error.status, 404);
      assert.equal(error.requestId, "server-request");
      assert.equal(error.message, "No accessible installation was found.");
      return true;
    }
  );
});
