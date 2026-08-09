# The flow

## What was wrong

The old funnel asked for $599/month before the customer had seen their team
do anything:

    land → sign in → onboarding wall → name team → pay $599 → work begins

Everything before the payment was administration, and everything that proves
the product works came after it. A person evaluating "can I trust agents to
write code in my repository" was asked to answer that question with their
credit card, on faith, having seen nothing. That is the conversion problem.
It is not a styling problem, and restyling the wall never moved it.

## The flow

    land → connect your repo (free) → say what you want →
    your product manager writes the issues into your repo, free →
    you read real issues in your own repo →
    start the team ($599/mo) → engineers build, review, open pull requests

The change is one thing: **the plan is free, the building is paid.**

The product manager reading a repository and filing well-formed issues is
cheap for us and immediately legible to a customer. It happens in their
GitHub, under their account, where they already trust what they are looking
at. By the time the price appears they have a real backlog they did not have
an hour ago, and the question has changed from "does this work" to "do I want
these built".

## What each step must answer

| Step | The customer's question | What the screen shows |
| --- | --- | --- |
| Land | What is this and is it real | A pull request an agent opened, with its diff and reviews |
| Connect | What are you getting access to | The repository list, and exactly which permissions and why |
| Describe | What do I even ask for | One field, three examples drawn from their repository's language |
| Plan | Did it understand my codebase | Real issues, in their repo, linked out to GitHub |
| Start | What happens when I pay | The roster, the price, and the first thing that will be built |
| Workspace | What is my team doing now | Crew and what each is on, the stream, one decision at a time |

## Copy rules

Say it once. The old create-team screen said "create your team" five times
across a title, a headline, a label, a heading and a paragraph.

Name the outcome on every control: "Start the team — $599/month", never
"Continue" or "Submit". A person should never have to click to find out what
a button does.

Never bill a surprise. The amount, the date and how to stop appear together,
next to the control that commits to them.

No internal vocabulary on any customer surface: no service names, no
"durable", "projection", "dispatch", "reconcile". Enforced by
scripts/check_site.rb.

## What this needs from the API

The free-plan step needs a team that can run the product manager without a
payment method:

- `CreateTeam` must accept a plan-only team (no card), provisioning just the
  product manager rather than the full six-agent roster.
- `StartTeam` (does not exist yet) takes that team paid: collects payment,
  provisions the remaining five agents, and begins execution.

Until those exist the site can present the flow honestly by gating the plan
step behind sign-in and running it as today's full team creation, but the
conversion gain is in the free plan, so the API work is the priority.
