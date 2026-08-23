---
title: Pricing
image: /assets/images/og/pricing.png
description: Review the commercial fields deep navy confirms for an early-access pilot before Stripe checkout begins.
body_class: pricing lp
extra_css: /assets/css/home.css
updated: 2026-08-22
---

<section class="lp-hero lp-hero-sub">
  <div class="lp-shell dn-stagger">
    <p class="lp-eyebrow">Commercial terms · early access</p>
    <h1 class="lp-h1 lp-h1-sub">$199 per organization, per month. <em>Unlimited teams</em>.</h1>
    <p class="lp-lede">One subscription covers your whole organization and as many teams as you want to run. Every team ships with a Product Manager, an Engineering Manager, a Designer, and three engineers, and the organization gets 10,000 engineering credits each billing period. Want a fourth engineer on a team? $199 a month for that seat — the app shows the exact total before you pay, and there are no setup fees or hidden charges. Work stops before an unpaid balance can accrue.</p>
    <p class="lp-note">Term sheet v0.3 · Updated July 17, 2026</p>
  </div>
</section>

<section class="lp-section">
  <div class="lp-shell">
    <p class="lp-label">The plans</p>
    <h2 class="lp-h2">Per organization, not per token.</h2>
    <p class="lp-sub">One subscription per organization, engineers above the floor added as line items, usage prepaid as credits. Every number below is the number Stripe bills; the app shows the exact monthly total on the pay button before you pay.</p>
    <ul class="lp-plans lp-stagger-reveal">
      <li class="lp-plan lp-plan-featured dn-reveal">
        <span class="lp-plan-name">Founding organization</span>
        <span class="lp-plan-price">$199 <span class="lp-plan-per">per organization · month</span></span>
        <p class="lp-plan-body">As many teams of six specialists as you need, working in repositories you choose.</p>
        <ul class="lp-plan-list">
          <li>Unlimited teams — each with a product manager, engineering manager, designer and three engineers</li>
          <li>10,000 engineering credits for the whole organization, per paid billing period</li>
          <li>Unlimited issues and pull requests</li>
          <li>Two peer reviews plus manager approval on every merge</li>
          <li>Monthly; cancellation takes effect at period end</li>
        </ul>
      </li>
      <li class="lp-plan dn-reveal">
        <span class="lp-plan-name">Additional engineer</span>
        <span class="lp-plan-price">$199 <span class="lp-plan-per">per engineer · month</span></span>
        <p class="lp-plan-body">Scale a team from three engineers up to fifty, in Settings.</p>
        <ul class="lp-plan-list">
          <li>From the fourth engineer up to the fiftieth</li>
          <li>Adding charges the prorated remainder of the period now</li>
          <li>Removing credits the unused portion to your next invoice</li>
          <li>Three is the floor, so every shipped change gets two peer reviews</li>
        </ul>
      </li>
      <li class="lp-plan dn-reveal">
        <span class="lp-plan-name">Credit top-up</span>
        <span class="lp-plan-price">$100 <span class="lp-plan-per">per 10,000 credits</span></span>
        <p class="lp-plan-body">Prepaid usage on top of the included grant. No postpaid overage, ever.</p>
        <ul class="lp-plan-list">
          <li>1 credit = $0.01 of billable model, compute, storage, and service usage</li>
          <li>Credits post only after a signed paid webhook — checkout completion in the browser is not fulfillment</li>
          <li>A positive reserved balance is required before work starts; otherwise the team stops and asks</li>
        </ul>
      </li>
    </ul>
    <p class="lp-plans-note">Additional repositories are customer controlled: an organization owner updates GitHub App access, then you update the deep navy selection. Creating a team needs an active subscription, an active GitHub installation and a repository it can reach — not a spare slot, because there are no slots to run out of.</p>
  </div>
</section>

<section class="lp-section" aria-labelledby="terms-title">
  <div class="lp-shell">
    <p class="lp-label">The terms sheet</p>
    <h2 class="lp-h2" id="terms-title">Every commercial field, and where it is confirmed.</h2>
    <p class="lp-sub">One organization licence, prepaid usage, and one accountable ledger per team. Each field names the place you can read it back — a term that cannot be checked does not belong on this page.</p>
    <div class="data-table-wrap"><table class="data-table"><thead><tr><th>Commercial field</th><th>Launch term</th><th>Where confirmed</th></tr></thead><tbody><tr><td>Organization subscription</td><td>$199 USD per organization each month — unlimited teams, each with a Product Manager, Engineering Manager, Designer, and three engineers</td><td>Signed-in plan, the Billing screen, and the Stripe invoice</td></tr><tr><td>Additional engineers</td><td>$199 USD per engineer each month, from the fourth engineer up to fifty; three is the floor so every shipped change gets two peer reviews</td><td>Per-engineer subscription item and Stripe invoice</td></tr><tr><td>Changing engineer count</td><td>Increasing charges the prorated remainder of the period now; decreasing credits the unused portion to your next invoice</td><td>Team settings and the following Stripe invoice</td></tr><tr><td>Included credits</td><td>10,000 engineering credits for the whole organization per paid billing period</td><td>Webhook-confirmed credit ledger</td></tr><tr><td>Credit value</td><td>1 credit = $0.01 of billable model, compute, storage, and service usage</td><td>Plan and measured usage ledger</td></tr><tr><td>Prepaid top-up</td><td>$100 USD for 10,000 additional credits</td><td>Server-owned catalog and Stripe payment</td></tr><tr><td>Additional usage</td><td>No postpaid overage; a positive reserved balance is required before work starts</td><td>Team budget and usage reservation</td></tr><tr><td>Renewal and cancellation</td><td>Monthly; cancellation takes effect at period end</td><td>Stripe subscription and Billing Portal</td></tr></tbody></table></div>
    <p class="lp-sub lp-terms-note">Stripe renders the encrypted payment fields inside deep navy’s own checkout — card, Apple Pay, or Google Pay. Your card details never touch deep navy’s servers, the exact monthly total is on the pay button, and the card is saved once — a second team is covered by the same subscription and charges nothing.</p>
    <div class="lp-cta"><a class="lp-btn lp-btn-github" href="{{ '/app/?signin=1' | relative_url }}">Create your team</a><a class="lp-btn lp-btn-quiet" href="mailto:hello@deep.navy?subject=deep%20navy%20pilot%20terms">Discuss terms</a></div>
  </div>
</section>

<section class="lp-section" aria-labelledby="pricing-questions">
  <div class="lp-shell">
    <p class="lp-label">Billing questions</p>
    <h2 class="lp-h2" id="pricing-questions">The questions technical buyers actually ask.</h2>
    <dl class="lp-faq">
      <div class="lp-faq-item dn-reveal">
        <dt class="lp-faq-q">How does changing the engineer count bill?</dt>
        <dd class="lp-faq-a">Adding an engineer charges the saved card for the prorated remainder of the current period immediately; removing one credits the unused portion to your next invoice. Three engineers is the floor — it keeps two peer reviewers on every shipped change.</dd>
      </div>
      <div class="lp-faq-item dn-reveal">
        <dt class="lp-faq-q">What is an engineering credit?</dt>
        <dd class="lp-faq-a">One credit represents $0.01 of billable model, compute, storage, and service usage. deep navy separately reconciles provider cost so team and admin economics remain auditable.</dd>
      </div>
      <div class="lp-faq-item dn-reveal">
        <dt class="lp-faq-q">Can usage exceed the available balance?</dt>
        <dd class="lp-faq-a">No postpaid overage is enabled. The runtime must reserve a positive balance from the organization’s credit pool before billable work begins; otherwise the team stops and asks for a prepaid top-up.</dd>
      </div>
      <div class="lp-faq-item dn-reveal">
        <dt class="lp-faq-q">Is the $199 price per organization or per team?</dt>
        <dd class="lp-faq-a">Per organization. One subscription licenses the whole organization and covers as many teams as you run — a second team costs nothing. Each team still keeps its own attributable usage ledger, and the included credits are one grant the organization shares.</dd>
      </div>
      <div class="lp-faq-item dn-reveal">
        <dt class="lp-faq-q">Where does payment happen?</dt>
        <dd class="lp-faq-a">Stripe renders encrypted payment fields inside the deep navy checkout dialog. The server owns prices, verifies signed webhooks, and is the only system allowed to activate capacity or post credits.</dd>
      </div>
    </dl>
  </div>
</section>
