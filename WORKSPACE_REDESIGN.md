# Workspace redesign — the approved target

Approved mockup: <https://claude.ai/code/artifact/45abf28b-77f1-4a4c-9bff-a32d540c3c41>
("Deep Navy — newton"). Companion flow mockup: <https://claude.ai/code/artifact/7ef1cc5d-2269-4b1f-8cf6-1bd6eb2fc0da>.

This file exists because the mockup was approved and then not implemented: the
live app kept its card-grid operator console and received cosmetic edits
instead. What shipped is not a lighter version of this design, it is a
different screen. Treat the gap below as the work, not as polish.

## Design intent

The activity stream is the spine of the product. The page answers "what is my
team doing right now", asks for at most one decision, and shows evidence that
the work is real. It is a rail plus a stream — the mockup's CSS says it
outright: `layout: rail + stream, no card grid`.

## Structure, top to bottom

**Top bar** (sticky): `DEEP NAVY` wordmark · a breathing seafoam dot with a
live connection word · the repository · a three-way theme control
(Auto / Light / Dark) · Sign out.

**Left rail** (250px, sticky):
- `Your team` — one row per agent: human name, role, and **what that agent is
  doing right now** (`dialog.tsx · 12 files`, `waiting on you`, `idle · 4m`).
  Working agents get a glowing dot; blocked agents an amber dot; idle agents a
  dim one.
- `This month` — spend against budget with a progress track, plus unit
  economics (`7 PRs · $2.63 each`).
- `Test suite` — pass count and whether main is green.

**Main column:**
- A headline in plain language about the present tense, with the verb in
  seafoam: *"Three engineers are `writing code` right now."*
- A one-line context strip: team · branch · last commit · PRs merged.
- **The ask** — an inline block (never a shouty banner) naming the agent that
  needs the customer, what the decision is, and its consequence, with
  `Review diff` and `Approve & start`. At most one at a time.
- **Evidence row** — a thin strip of proof-of-work numbers.
- **Live activity** — the stream: one line per event, agent name in bold,
  commits/PRs inline, a result clause where there is one, timestamps right.

## The one orchestrated moment

Approving is the only decision the screen asks for and the moment the promise
pays off. On approval the ask resolves and leaves, then the crew wakes one at
a time so it reads as people picking up work rather than flags flipping, and
the headline catches up. Motion is one easing and three durations
(`--quick` 140ms, `--settle` 260ms, `--arrive` 420ms), all honouring
`prefers-reduced-motion`.

## Data honesty

The mockup's numbers are placeholders. Implement only what we actually have,
and omit the rest rather than inventing it:

| Region | Real source | Status |
| --- | --- | --- |
| Crew roster + roles | `TeamService` agents | available |
| What each agent is doing | activity stream, latest event per agent | derivable |
| Spend vs budget | economics balance / prepaid | available |
| Live activity | `ActivityService/StreamTeamActivity` | available |
| Pull requests open | github-service projection | available |
| Test suite, diff coverage, median CI | none | **do not fabricate** |

## What must not survive the port

Everything in the current overview that speaks operator: internal service
names in customer copy, `data-source-badge` state chips (`LIVE`, `WAITING`,
`6/6 ROLES`), empty internal scaffolding ("Proposed KPIs", "Proposed
initiatives") rendered when there is nothing, and `Suspend` / `Delete` as the
most prominent actions on the page — destructive team lifecycle belongs in
Settings.

## Known blocker

The mockup's flow assumes RPCs that do not exist yet: `StartTeam`,
`StreamWorkspace`, and `Decide`. Confirmed absent from platform-api's protos.
The rail, stream, evidence row and copy can all ship against today's
endpoints; the single-call approve flow needs those added first.
