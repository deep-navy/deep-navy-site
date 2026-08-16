"use strict";

// "I can't switch the repo here and I should be able to select multiple
// repos." A team's repository selection was frozen at creation; these pin the
// Settings → Repositories section that unfreezes it:
//   - the section is the create-flow checklist pointed at an EXISTING team,
//     with the TEAM's current set pre-checked;
//   - save is the explicit "Update repositories" action, disabled until the
//     selection differs from the team's current set;
//   - a selection can never go below one repository;
//   - one honest line states what a save really does: it re-provisions the
//     team, agents keep their memory, work in progress is interrupted;
//   - success hands the workspace to the existing provisioning stream, and
//     the header's repository line speaks for the team, plural-aware.

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const test = require("node:test");

const app = readFileSync("assets/js/app.js", "utf8");
const shell = readFileSync("_includes/app-shell.html", "utf8");
const client = readFileSync("src/platform-api-client.ts", "utf8");

function between(startMarker, endMarker) {
  const start = app.indexOf(startMarker);
  assert.notEqual(start, -1, `marker missing: ${startMarker}`);
  const end = app.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `marker missing after ${startMarker}: ${endMarker}`);
  return app.slice(start, end);
}

test("Settings carries a Repositories section: checklist, error slot, and an explicit save", () => {
  const start = shell.indexOf("data-repo-settings");
  assert.notEqual(start, -1, "the Repositories settings card exists");
  const card = shell.slice(shell.lastIndexOf("<article", start), shell.indexOf("</article>", start));
  assert.match(card, /<h3 id="settings-repos-title">Repositories<\/h3>/);
  // The checklist is the create-flow pattern: a fieldset with a grouped list
  // the script fills, described by its help line and its own error slot.
  assert.match(card, /data-repo-settings-field/);
  assert.match(card, /data-settings-repository-list/);
  assert.match(card, /role="group"/);
  assert.match(card, /aria-describedby="settings-repositories-help settings-repositories-error"/);
  assert.match(card, /data-settings-repositories-error role="alert" hidden/);
  // The save button says what it does — it is the update action, nothing else.
  assert.match(card, /<button[^>]*data-settings-repositories-apply[^>]*>Update repositories<\/button>/);
  assert.match(card, /type="button"/);
});

test("the honest re-provision line is present, verbatim, under the save action", () => {
  const card = shell.slice(shell.indexOf("data-repo-settings"), shell.indexOf("</article>", shell.indexOf("data-repo-settings")));
  const noteIndex = card.indexOf("Saving re-provisions the team. Agents keep their memory; work in progress is interrupted.");
  assert.notEqual(noteIndex, -1, "the honest line exists exactly as written");
  const applyIndex = card.indexOf("data-settings-repositories-apply");
  assert.ok(applyIndex !== -1 && applyIndex < noteIndex, "the honest line sits under the save button");
  // And it is revealed with the section, not parked hidden forever.
  assert.match(app, /ui\.settingsRepositoriesNote\.hidden = false/);
});

test("the checklist renders with the TEAM's current set pre-checked", () => {
  // The current set: recorded from a server-confirmed mutation in this
  // session, else the organization's durable selection — the same signals
  // the create picker pre-checks from.
  const known = between("function knownTeamRepositoryIds(teamId)", "function checkedSettingsRepositoryIds");
  assert.match(known, /session\.teamRepositoryIds\.get\(/);
  assert.match(known, /REPOSITORY_SELECTION_MODE\.ALL \|\| selected\.has\(/);
  assert.match(known, /selectedForTeams === true/);
  // The builder checks exactly that set.
  const build = between("function buildRepositoryControlChecklist(currentIds)", "function renderRepositoryControl");
  assert.match(build, /checkbox\.checked = current\.has\(id\)/);
  const render = between("function renderRepositoryControl()", "function syncRepositoryControl");
  assert.match(render, /buildRepositoryControlChecklist\(knownTeamRepositoryIds\(teamId\)\)/);
  // A background re-render never rebuilds (and so never clobbers) an edit:
  // rebuilding is keyed on the team and the accessible list changing.
  assert.match(render, /repositoryControlTeamId !== teamId \|\| repositoryControlListSignature !== listSignature/);
  // Server-confirmed mutations record the team's own set.
  assert.match(app, /session\.teamRepositoryIds\.set\(stringValue\(pending\.id\), sortedRepositoryIds\(repositoryIds\)\)/);
  assert.match(app, /session\.teamRepositoryIds\.set\(teamId, target\)/);
});

test("save stays disabled until the selection differs from the team's current set", () => {
  const sync = between("function syncRepositoryControl()", "function repositoryControlErrorMessage");
  assert.match(sync, /const unchanged = sameRepositorySet\(checked, knownTeamRepositoryIds\(team\.id\)\)/);
  assert.match(sync, /ui\.settingsRepositoriesApply\.disabled = !manageable \|\| unchanged \|\| checked\.length === 0/);
  // Order-insensitive comparison: the same set in any checkbox order is
  // "unchanged", so a click-and-unclick cannot arm the button.
  const same = between("function sameRepositorySet(left, right)", "// The team's current repository set");
  assert.match(same, /sortedRepositoryIds\(left\)/);
  assert.match(same, /sortedRepositoryIds\(right\)/);
  // Every checklist change re-runs the computation.
  assert.match(app, /ui\.settingsRepositoryList\.addEventListener\("change", \(\) => \{\n\s*setFieldError\(ui\.settingsRepositoriesError, ""\);\n\s*syncRepositoryControl\(\);/);
});

test("a team can never be saved below one repository", () => {
  const apply = between("async function applyTeamRepositories()", "// The workspace header's repository line");
  const guard = apply.indexOf('setFieldError(ui.settingsRepositoriesError, "Your team needs at least one repository.")');
  assert.notEqual(guard, -1, "the min-one error is customer-worded and inline");
  const request = apply.indexOf('apiRequest("update_team_repositories"');
  assert.ok(guard < request, "the empty selection is rejected before any network access");
  assert.match(apply, /if \(target\.length === 0\) \{/);
  // And the button itself disarms on an empty selection.
  const sync = between("function syncRepositoryControl()", "function repositoryControlErrorMessage");
  assert.match(sync, /checked\.length === 0/);
});

test("saving updates the team's own selection and hands the workspace to the provisioning stream", () => {
  const apply = between("async function applyTeamRepositories()", "// The workspace header's repository line");
  // Sorted ids → stable normalized request and idempotency fingerprint.
  assert.match(apply, /const target = sortedRepositoryIds\(checkedSettingsRepositoryIds\(\)\)/);
  assert.match(apply, /idempotencyKey: mutationKeys\.for\("updateTeamRepositories", `\$\{teamId\}:\$\{target\.join\(","\)\}`\)/);
  // The response team is verified in-scope, then the standard authoritative
  // reload runs — the same path every lifecycle mutation uses, which starts
  // the provisioning stream so the re-provision renders like any provision.
  assert.match(apply, /stringValue\(updated\.organizationId\) !== session\.organizationId/);
  assert.match(apply, /await reloadTeamsAfterLifecycle\(\)/);
  // Errors surface in the section's own slot, customer-worded for the two
  // server preconditions (inaccessible repository, in-flight command).
  assert.match(apply, /setFieldError\(ui\.settingsRepositoriesError, repositoryControlErrorMessage\(error\)\)/);
  const wording = between("function repositoryControlErrorMessage(error)", "async function applyTeamRepositories");
  assert.match(wording, /no longer grants the deep navy app access/);
  assert.match(wording, /Wait for the current provisioning run to finish/);
  // The client exposes the RPC with exactly the proto fields.
  assert.match(client, /case "update_team_repositories":/);
  assert.match(client, /teams\.updateTeamRepositories\(\{\n\s*id: textField\(payload, "id"\),\n\s*repositoryIds: int64ListField\(payload\.repositoryIds, "repositoryIds"\),\n\s*idempotencyKey: textField\(payload, "idempotencyKey"\)\n\s*\}, callOptions\)/);
});

test("the workspace header's repository line speaks for the selected team, plural-aware", () => {
  const header = between("function renderContextRepositories()", "function subscriptionStatusLabel");
  // One repository renders as its bare owner/name; several as a count plus
  // the first names — never a bare accessible-repos preview for a team.
  assert.match(header, /names\.length === 1/);
  assert.match(header, /\$\{names\.length\} repositories/);
  assert.match(header, /knownTeamRepositoryIds\(team\.id\)/);
  // Selecting a team re-renders the line.
  const summary = between("function renderSelectedTeamSummary()", "function renderWorkspaceHeadline");
  assert.match(summary, /renderContextRepositories\(\)/);
});
