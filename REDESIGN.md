# deep navy — the redesign

## What is actually wrong

The product sells a software team in a box. The interface presents a database
with five tabs.

**The tabs are the biggest error.** Overview, Activity, Economics, Approvals
and Settings split one continuous thing — your team doing work — into five
places, none of which answers "what is happening and what do I do". A person
who wants to know whether their objective is progressing has to visit three
tabs and correlate them. Nesting like this is how internal tools are organised,
because internal tools are built one service at a time. It is not how work is
experienced.

**Nothing shows work moving.** Issues become branches become pull requests
become merges. That progression is the product, and it appears nowhere. The
Overview shows a roster with six identical "active" labels; the Activity tab
shows a reverse-chronological log. Neither answers "where is my work".

**The fields do not say what they do.** "What do you want built?" sits above an
empty box with three example chips, and nothing indicates what happens after
you press the button, how long it takes, or what you will see. A person cannot
form a model of the system from this screen.

**The log leaks our machinery.** Shipped today, visible to a customer:

    $ ECONOMICSSERVICE SNAPSHOT MEASURED SNAPSHOT
    PV PROVISIONINGSERVICE SNAPSHOT SUCCEEDED PROVISIONING EVENT 13
    GITHUBDELIVERYSERVICE ISSUE SNAPSHOT OPEN WEBHOOK-BACKED ISSUE SNAPSHOT

These are `source:` labels built at runtime in app.js, which is why the
build-time language check in check_site.rb never caught them: it reads rendered
HTML, and these strings only exist once JavaScript runs.

## The idea

**One screen. The brief at the top, the work below it.**

A customer arrives with a business objective. They write it once, as a
document. Everything after that is watching a team execute it, and stepping in
where a decision is theirs to make.

    ┌──────────────────────────────────────────────────────────────┐
    │  🐙 deep navy            IamGoodBad/Purizumu      ● live      │
    ├──────────────────────────────────────────────────────────────┤
    │                                                              │
    │  THE BRIEF                                    [Edit]         │
    │  Cut checkout drop-off                                       │
    │  We lose 40% of carts at payment. Fix the top causes,        │
    │  starting with the address form and the 3DS redirect...      │
    │                                                              │
    │  ─────────────────────────────────────────────────────────   │
    │                                                              │
    │  PLANNED 3        BUILDING 2       IN REVIEW 1     SHIPPED 4 │
    │  ┌──────────┐   ┌──────────┐    ┌──────────┐   ┌──────────┐ │
    │  │ #12      │   │ #9   ●   │    │ PR #284  │   │ #7  ✓    │ │
    │  │ Address  │   │ 3DS      │    │ Focus    │   │ Retry    │ │
    │  │ form     │   │ redirect │    │ restore  │   │ logic    │ │
    │  │          │   │ Ada · 12 │    │ 2 of 3   │   │ merged   │ │
    │  │ unassign │   │ files    │    │ approved │   │ 2h ago   │ │
    │  └──────────┘   └──────────┘    └──────────┘   └──────────┘ │
    │                                                              │
    │  ⚠ Morgan needs you — PR #284 touches production data        │
    │    [Review the diff]  [Approve and merge]                    │
    └──────────────────────────────────────────────────────────────┘

The board is the product. Each card is a real GitHub issue or pull request,
and its column is its actual state. The person who is on it and what they are
touching right now is on the card, because "who is doing what" is the question
this product exists to answer.

Approvals are not a tab. A decision appears where the work is, when it is
needed, and disappears when it is made. That is Netflix's Skip Intro rule: a
contextual control beats a permanent destination.

Economics is not a tab. Spend sits in the corner as one number against the
budget, and expands on click for the breakdown.

Settings stays a destination, because it is genuinely a different job.

## Screens

There are three, not five.

**1. Landing** — one job: understand the product and sign in. Already rebuilt:
the hero is a real pull request with a diff and three approvals. Keep.

**2. Setup** — connect a repository, write the brief, start the team. One
question at a time, Typeform-style, because a first-time user has no model yet
and a wall of fields is where they leave.

**3. Mission control** — the brief and the board, above. This is where a
customer lives. It replaces Overview, Activity, Approvals and Economics.

## The brief

The single most important change. Today the objective is a 3-row textarea with
a 200-character title derived from its first sentence. That is a ticket, and we
are asking for a strategy.

The brief is a document:

- A title, and prose the length it needs to be.
- Written in the customer's language about their business, not ours about
  issues.
- Editable at any time. Editing it does not restart the work; the product
  manager reconciles the plan against the change and says what it did.
- Always visible at the top of mission control. It is the thing everything
  below is in service of.

Placeholder copy, written to teach by example rather than instruct:

    What are we trying to achieve?

    We lose about 40% of carts at the payment step. I think it is the
    address form and the 3DS redirect, but I would rather you check the
    data than take my word for it. Ship the highest-impact fix first.

## The agent log

The board answers "where is my work". It does not answer "what is my team
actually doing", and that question is the one that decides whether a person
trusts an autonomous product at all. Every AI-UX source says the same thing:
show the work, or the system reads as a black box making changes to your
repository.

**The log is a work journal, not an event stream.** It reads like catching up
on a team channel:

    Riley · Product Manager                                    09:42
    Read the checkout flow across 14 files. The address form posts on
    every keystroke, which is where the drop-off is. Filed three issues.
    → #12 Address form · #13 3DS redirect · #14 Retry logic

    Morgan · Engineering Manager                               09:48
    Assigned #12 to Ada — she wrote the current form. Holding #14 until
    #12 lands; they touch the same file.

    Ada · Engineer                                             09:51
    ● Working #12 · checkout/AddressForm.tsx
    Debounced validation to blur instead of keystroke. Tests pass.

    Ada · Engineer                                             10:04
    Opened PR #284. Two reviewers requested.
    ↳ ran tests · read 6 files · edited 2 files

Compare that to what ships today for the same events:

    A2A propose initiative
    7f3a1c2e-... → 9b2d4f81-...
    ECONOMICSSERVICE SNAPSHOT MEASURED SNAPSHOT
    Tool · deep navy assign work

### The rules

1. **Lead with the agent's own words.** Events already carry `safe_summary` —
   customer-safe text, secret-scrubbed at the gateway boundary, up to 1024
   bytes. The UI currently ignores it and builds a title out of metadata
   instead. Leading with the summary is most of the fix and needs no new API.

2. **Group by turn, not by event.** Consecutive events from one agent in one
   session are one entry. Tool calls fold in as a quiet trailing line
   (`ran tests · read 6 files`), because "which tools ran" is evidence for the
   claim above it, not news in itself.

3. **Names, never identifiers.** Agents get human names — Riley, Morgan, Ada.
   A UUID arrow is not a conversation. Roles stay as the subtitle so a customer
   learns who does what.

4. **Every entry links to its artifact.** Issue, pull request, commit, file.
   The log is a way into the work, not a read-only record of it.

5. **Nothing internal is ever printed.** No service names, snapshot labels,
   event types or sequence numbers. This must be enforced at runtime, not only
   at build time — the current check reads rendered HTML and cannot see strings
   that app.js constructs after load, which is exactly how these shipped.

6. **Silence is reported honestly.** If no agent has said anything for a while,
   say when the last thing happened rather than showing an empty list under a
   claim that the team is active.

### Where it lives

Not a tab. The log is the right-hand column of mission control, running beside
the board, so cause and effect sit next to each other: a card moves, and the
sentence explaining why is level with it. Clicking a card filters the log to
that piece of work.

### What it needs

**UI, no API change:** lead with `safe_summary`; group consecutive same-agent
events into turns; fold tool calls into the turn; assign and store human names
per agent; drop every constructed `A2A …` / `Tool · …` title.

**Runtime — and this is not prompt work, which an earlier draft of this plan
got wrong.** Agents cannot write the sentence today, by design.
`safe_summary` is generated server-side from a fixed template per event type
(`internal/activity/normalize.go`), and the ingest handler explicitly rejects
a producer-supplied summary. Every line in the log is one of five templates:

    Agent-to-agent propose_initiative recorded.
    Tool github succeeded.
    Session is ready.
    Artifact pull_request opened.
    Workspace file created.

No prompt can improve that, because the agent's words never reach the field.
The boundary exists for a real reason: an agent runs customer code and can be
prompt-injected, so letting it write arbitrary text into the customer's
timeline is a genuine risk.

But the boundary is already inconsistent. The same agent writes issue
comments, pull request descriptions and review comments straight into the
customer's GitHub, and the customer reads those. Forbidding narration while
allowing PR bodies does not remove the risk; it only removes the explanation.

The fix is a typed narration event, sanitized rather than forbidden:

- A new event type carrying one field: a sentence, capped in length, passed
  through the existing credential scrubber and the same normalization
  boundary every other event crosses.
- Emitted by an agent at the end of a meaningful step, in the customer's
  language: what it did and why.
- Rendered as the entry's body, with the generated template as the fallback
  when an agent says nothing.

Until that exists the log is honest about structure — who acted, in what
order, against which issue — and thin on voice. That is the correct trade to
be sitting on, and it should not be described as finished.

**Guardrail:** a runtime check that fails the build if any string rendered into
the log matches a service name, an event type or a snapshot label. The
build-time check that exists reads HTML; this one has to read app.js.

## What each state means, in the customer's words

| State | What it means | Never say |
| --- | --- | --- |
| Planned | Written up, waiting for an engineer | queued, dispatched |
| Building | An engineer is writing code now | in progress, executing |
| In review | Open pull request, waiting on approvals | pending, awaiting quorum |
| Shipped | Merged into your default branch | delivered, completed |
| Blocked | Needs a decision from you | failed, error, unavailable |

## Motion

Motion carries the one thing static design cannot: that this is happening now,
by itself, while you watch.

- A card moves between columns when its issue changes state. It animates the
  move; it does not disappear and reappear.
- The agent working a card has a breathing seafoam dot, the only glow on the
  page.
- A new approval lands with the sequence already built on the landing page.
- Everything: one easing, three durations, and nothing at all under
  prefers-reduced-motion.

## Deep ocean, properly

Currently the palette is deep-ocean coloured. The feeling is not there. Three
concrete moves, none of them a gradient:

1. **Bioluminescence is the only light.** Nothing else glows. Seafoam marks
   exactly one thing: something alive right now. Every other accent goes.
2. **Depth is spacing, not shadow.** Sections nearer the surface (the brief)
   breathe; the further down the board you read, the tighter and quieter it
   gets, so scrolling feels like descending.
3. **Things surface.** New work rises into view from below and settles. Nothing
   fades in place.

## Copy rules

Every rule below is already violated somewhere in the shipped product.

- Never show a service name, an event type, a snapshot label or a sequence
  number. The customer's model is issues, branches, pull requests, reviews,
  merges, and money.
- Every empty state names the next action and offers it.
- Every control says its outcome: "Approve and merge", never "Confirm".
- Money is always stated with what it bought.

## What this needs from the API

The board needs GitHub work in the customer's own repository, which mostly
exists but is not exposed as one query:

1. **`ListWork`** — every issue and pull request for a team with its state,
   assignee, review count and last activity. github-service holds all of this
   in its projection today; nothing serves it to the browser in one call.
2. **`StreamWork`** — state transitions as they happen, so a card moves without
   a refresh. The activity stream already carries the underlying events; this
   is a projection of it, not a new pipeline.
3. **`UpdateBrief`** — replaces CreateBusinessObjective's title/description
   split with one document, and tells the product manager to reconcile.

The autonomous loop that fills the board is task #37, and its queue already
exists and is verified (platform-api migration 000019). The enqueue and
delivery are not built. **Without that loop the board will only ever show what
a human triggered**, so it is the prerequisite for this design being honest.

## Build order

1. `ListWork` in platform-api, reading github-service's projection.
2. Mission control: the brief and the board, replacing the five tabs. Static
   first, refreshed on an interval.
3. Finish the autonomous loop (#37) so cards move on their own.
4. `StreamWork`, so they move live.
5. Setup rebuilt as one-question-at-a-time.
6. Delete Overview, Activity and Approvals as separate views.

Steps 1 and 2 are the ones that change what the customer sees. Step 3 is what
makes the product real.

## Not doing

- No free tier. Priced at $199/month per organization, unlimited teams.
- No Tailwind: the CSP is style-src 'self' and the hand-written system is
  coherent. A build step would fight it.
- No charts until there is a series worth plotting. Chart.js when spend over
  time is real, not to decorate the corner.
