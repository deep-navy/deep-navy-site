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

- No free tier. Priced at $599/month, one team.
- No Tailwind: the CSP is style-src 'self' and the hand-written system is
  coherent. A build step would fight it.
- No charts until there is a series worth plotting. Chart.js when spend over
  time is real, not to decorate the corner.
