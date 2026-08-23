# UI standards

The rules this product is held to, and where it currently breaks them.
Sourced from the Clay design guides on brand language, buttons, navigation,
animation, conversion, cognitive load, UI elements, and skeuomorphism.

Rules only matter if something enforces them. Where a rule is machine-checkable
it belongs in `scripts/check_site.rb`; where it is not, it belongs in review.
Roughly 95% of companies have guidelines and 25% enforce them — the difference
is whether the check runs.

## Enforced today

| Rule | Where |
| --- | --- |
| No render-blocking external script in `<head>` | `check_site.rb` |
| Every inline script hash-pinned by the page CSP | `check_site.rb` |
| `script-src` never allows `'unsafe-inline'` | `check_site.rb` |
| Inline pre-paint scripts syntax-checked | `check_inline_scripts.cjs` |
| One `<h1>`, unique ids, valid internal links | `check_site.rb` |
| Width queries only at 1200 · 900 · 600 | `breakpoint_scale_test.cjs` |
| Every `var()` resolves or carries a fallback | `css_token_resolution_test.cjs` |
| Chrome achromatic; hue only from the meaning set | `achromatic_chrome_test.cjs` |

## Buttons

- **44px minimum height.** Below that, touch targets miss on phones. *(applied)*
- **Six states ship:** enabled, hover, focus, pressed, disabled, busy. Busy
  keeps its label — a bare spinner drops the context saying which action you
  are waiting on. *(applied)*
- **Destructive actions get their own semantic colour**, never a neutral
  outline. Delete previously rendered as a dashed grey border, which reads as
  an unfinished placeholder rather than something that erases a team and its
  work. *(applied — Delete and Confirm delete ride the coral crit tokens, and
  the shadowed legacy dashed rule is deleted from the stylesheet, not just
  overridden)*
- **One primary button per decision point.** Two primaries means the hierarchy
  was never decided. *(audited: six `button-primary` in the shell, none of
  which can meet on one decision. The four first-run primaries are mutually
  exclusive — the organization card shows one form at a time, and a blocking
  card replaces the name form while it shows; the floor keeps Send as its one
  ask; Start subscription lives alone in the checkout dialog. Approve is the
  one primary of each approval card. The remaining tension: while a PRD
  sign-off is pending, its card sits above the composer, so Sign off and Send
  share the console — two decision points, two primaries, one panel. Held as
  is, because the sign-off card is the queue's own render pass and must not
  disagree with it.)*
- **Label the outcome, not the interaction.** "Delete team", not "Confirm". If
  the label would make sense on any page, it is too generic.
- **A disabled button must say why.** "Complete all required fields" beats a
  dead control with no explanation.

## Navigation

- Five primary items or fewer; seven is the ceiling. *(currently 5 — passes)*
- Label by the customer's mental model, never our internal grouping.
- The current section must be unambiguous.
- Icon-only controls need an accessible label. *(6 present — verify each)*

## Cognitive load

- **One primary action per screen.** Everything else is subordinate or moved.
- Working memory holds 4–7 items; every extra region on a screen spends some.
- Progressive disclosure: show what is needed for the next step, reveal depth
  on demand.
- Keep related information together — validate inline, next to the field, not
  in a summary elsewhere.
- **Resolved:** team lifecycle no longer competes with the work. It sits in
  the floor's quiet footer at reduced opacity, `Suspend` is a quiet button,
  `Delete` carries the crit tokens, and confirming a delete means typing the
  team's name. It stayed on the floor rather than moving to Settings — the
  footer treatment says "not work" without hiding the controls a screen away
  from the team they end.

## Language

- The customer never reads our internal vocabulary. No service names
  (`ObjectiveService returned…`), no `durable`, `projection`, `dispatch`,
  `TPM`, `reconcile`. *(swept once; needs a standing check)*
- Say what happened and what it means for them, in their words.
- Banned because they diminish or presume: "just", "simply", "easy".
- Tone shifts with context: steady in errors, plain in status, never breezy
  about money or destruction.

## Empty states

Follow the three-part formula: name the absence, say what to do next, and make
doing it possible from that spot. An empty state is the best onboarding moment
we get, not a shrug.

## Motion

- One easing, three durations: `--quick` 140ms feedback, `--settle` 260ms state
  change, `--arrive` 420ms something new entered.
- Motion must mean something. No decorative movement.
- Never animate a target the customer is reaching for, and never animate text
  or fields while they are being used.
- `prefers-reduced-motion` disables all of it. *(honoured)*

## Depth

Flat structure with dimensional accents only where they signal affordance —
buttons, the live dot, the one thing asking for a decision. No texture, no
wholesale realism. Consistency matters more than the level chosen: mixing
dimensional and flat treatments arbitrarily is worse than either.

## Contrast

4.5:1 for text, 3:1 for UI components. Colour is never the only signal — pair
it with an icon, a label, or position, so the interface survives greyscale.
