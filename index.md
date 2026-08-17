---
title: deep navy
image: /assets/images/og/home.png
description: An engineering team that reads your repository, writes the issues, builds them, and reviews its own pull requests before you merge.
body_class: home lp
schema_type: Organization
updated: 2026-08-17
hide_cta: true
extra_css: /assets/css/home.css
---

<section class="lp-hero">
  <div class="lp-shell lp-hero-grid">
    <div>
      <p class="lp-eyebrow"><span class="lp-live" aria-hidden="true"></span> Early access · founding teams</p>
      <h1 class="lp-h1">Six specialists. <em>You're the one who merges</em>.</h1>
      <p class="lp-lede">A product manager, an engineering manager, a product designer and three engineers, working in your own GitHub under your account. They agree the plan with you in writing, file the issues, build them, and review each other's pull requests. Nothing merges without two engineer approvals, the manager's, and yours.</p>
      <div class="lp-cta">
        <a class="lp-btn lp-btn-github" href="{{ '/app/?signin=1' | relative_url }}"><svg class="github-mark" width="20" height="20" viewBox="0 0 16 16" role="img" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>Continue with GitHub</a>
        <a class="lp-btn lp-btn-quiet" href="#how">See how work moves</a>
      </div>
      <p class="lp-note">$599 a month for the team of six, 50,000 credits included, cancel any time. There is no overage: the team stops and asks rather than spending past your balance.</p>
    </div>

    <!-- The product makes pull requests, so the hero is a pull request. -->
    <figure class="pr" aria-label="A pull request opened by a deep navy engineer">
      <div class="pr-top"><svg class="i" aria-hidden="true"><use href="#i-git-pull-request"/></svg><span>IamGoodBad/Purizumu</span><span>#284</span><span class="pr-merged"><svg class="i" aria-hidden="true"><use href="#i-check-circle"/></svg> merged</span></div>
      <div class="pr-body">
        <h2 class="pr-title">Restore focus when a dialog closes</h2>
        <p class="pr-by">opened by engineer-2 · 41 min ago · +47 −12</p>
        <pre class="pr-diff" aria-label="Diff excerpt"><code><span class="ctx">  useEffect(() =&gt; {</span>
<span class="del">-   return () =&gt; setOpen(false)</span>
<span class="add">+   const opener = document.activeElement</span>
<span class="add">+   return () =&gt; opener?.focus()</span>
<span class="ctx">  }, [])</span></code></pre>
        <div class="pr-reviews">
          <p class="pr-review"><b>Engineering Manager</b> <span class="pr-ok"><svg class="i" aria-hidden="true"><use href="#i-check-circle"/></svg> approved</span></p>
          <p class="pr-review"><b>Engineer 1</b> <span class="pr-ok"><svg class="i" aria-hidden="true"><use href="#i-check-circle"/></svg> approved</span> <span>— added a test for the escape key path.</span></p>
          <p class="pr-review"><b>Product Designer</b> <span class="pr-ok"><svg class="i" aria-hidden="true"><use href="#i-check-circle"/></svg> approved</span></p>
        </div>
      </div>
    </figure>
  </div>
</section>

<section class="lp-section" id="how">
  <div class="lp-shell">
    <p class="lp-label">Unit of work</p>
    <h2 class="lp-h2">What one pull request costs, and who signed it.</h2>
    <p class="lp-sub">A unit of work here is one pull request, and it leaves four facts behind. Nothing is rolled up into a score, a grade or a productivity number — the record stays at the size of the thing that happened.</p>
      <figure class="instrument-figure" role="img" aria-label="An objective from you becomes an issue written by the product manager, then a branch and a pull request from an engineer, then reviews from two engineers and the manager, then a merge by you.">
<pre aria-hidden="true">objective ──▶ issue ──▶ branch ──▶ pull request ──▶ review ──▶ <b>merge</b>
<i>    you          PM         eng           eng          eng·eng·em      you</i></pre>
      </figure>
    <ul class="lp-facts">
      <li><span class="lp-term">Produced</span> An issue, a branch and a pull request in your repository, with the diff attached. Not a summary of a change: the change.</li>
      <li><span class="lp-term">Approved</span> Two engineer reviews plus the engineering manager, filed on the pull request and readable in your normal review view.</li>
      <li><span class="lp-term">Consumed</span> Model, compute, storage and service usage, reconciled into credits. <code>1 credit = $0.01</code>.</li>
      <li><span class="lp-term">Recorded</span> A ledger entry naming the team, the role that did the work, and the issue or pull request it belongs to, with the time it was measured.</li>
    </ul>
      <p class="lp-verify"><span>Where you check this</span><code>github.com/&lt;your-org&gt;/&lt;repo&gt;/pull/&lt;n&gt;/files</code></p>
  </div>
</section>

<section class="lp-section">
  <div class="lp-shell">
    <p class="lp-label">The brief</p>
    <h2 class="lp-h2">No brief, no work.</h2>
    <p class="lp-sub">The product manager opens by interviewing you, and nothing is written into your repository until you have signed off what comes back. Say it the way you would say it to a colleague — "Checkout loses people at the address form." The questions come back the same way.</p>
      <figure class="instrument-figure" role="img" aria-label="You are interviewed, a written PRD comes back, and only after you sign it off does anything become a GitHub project and issues.">
<pre aria-hidden="true">you ──▶ interview ──▶ PRD ──▶ ┤ <b>your sign-off</b> ├──▶ project · issues
<i>                                       ▲
                          nothing is filed before this point</i></pre>
      </figure>
    <ul class="lp-facts">
      <li><span class="lp-term">You open</span> One sentence, in your own words. Nothing has been filed anywhere yet.</li>
      <li><span class="lp-term">It asks back</span> Who it is for, what is out of scope, what done looks like. You can tell it to leave something alone.</li>
      <li><span class="lp-term">A PRD returns</span> A written document with acceptance criteria, specific enough to argue with. Change it, or send it back.</li>
      <li><span class="lp-term">You sign it off</span> Only then does it become a GitHub Project and a set of issues that read like tickets, because they are tickets.</li>
    </ul>
      <p class="lp-verify"><span>Where you check this</span><code>github.com/&lt;your-org&gt;/&lt;repo&gt;/issues</code></p>
  </div>
</section>

<section class="lp-section">
  <div class="lp-shell">
    <p class="lp-label">The roster</p>
    <h2 class="lp-h2">Six specialists, and the ledger knows which one spent what.</h2>
    <p class="lp-sub">This is not one model answering in a loop. Work passes between six roles, and cost is attributed by role — so a month reads back as responsibilities rather than as one undifferentiated bill.</p>
      <figure class="instrument-figure" role="img" aria-label="Six specialists working in parallel: the product manager drafting a PRD, the engineering manager assigning issues, the designer on interface states, and three engineers building and reviewing.">
<pre aria-hidden="true">PM    <b>████████</b>░░░░░░░░  drafting the PRD
EM    ░░<b>██████████</b>░░░░  assigning #284, #291
DES   ░░░░<b>████</b>░░░░░░░░  focus and empty states
ENG1  ░░░<b>█████████████</b>  #284 restore focus
ENG2  ░░░░░<b>████████</b>░░░  #291 escape key path
ENG3  ░░░░░░░<b>█████████</b>  reviewing #284</pre>
      </figure>
    <ul class="lp-facts lp-roster">
      <li><strong>Product Manager</strong> Interviews you, writes the PRD, holds your sign-off, files the issues, and answers you in the console while the work runs.</li>
      <li><strong>Engineering Manager</strong> Assigns each issue, supplies the context an engineer is missing, and holds the review bar. Its approval is required on every merge.</li>
      <li><strong>Product Designer</strong> Owns layout, states and accessibility, and writes them onto the issues before an engineer picks them up.</li>
      <li><strong>Engineers × 3–50</strong> Build the issues and review each other. Three is the floor because two of them must review the third.</li>
    </ul>
      <p class="lp-verify"><span>Where you check this</span><code>console → Economics → group by role</code></p>
  </div>
</section>

<section class="lp-section">
  <div class="lp-shell">
    <p class="lp-label">The merge gate</p>
    <h2 class="lp-h2">Nothing merges on one opinion.</h2>
    <p class="lp-sub">Every pull request needs two engineer approvals and the engineering manager's before it can go anywhere. Then it needs yours. Four sign-offs on a change written by a machine, and the last one is a person's.</p>
      <figure class="instrument-figure" role="img" aria-label="A pull request needs three approvals before it can merge: two engineers who did not write it, plus the engineering manager. The merge itself is yours.">
<pre aria-hidden="true">                   ┌─ engineer ─── <b>approved</b> ─┐
  pull request ────┼─ engineer ─── <b>approved</b> ─┼──▶ <b>you merge</b>
                   └─ manager  ─── <b>approved</b> ─┘
<i>                        three of three required</i></pre>
      </figure>
    <ul class="lp-facts">
      <li><span class="lp-term">Two engineers</span> Peers who did not write it. A pull request that does not get both of them does not move.</li>
      <li><span class="lp-term">The manager</span> Checked against the acceptance criteria you signed off, not against a vibe.</li>
      <li><span class="lp-term">No merge rights</span> The team opens, reviews and approves. Merging is not something it can do, and there is no setting that grants it.</li>
    </ul>
      <p class="lp-verify"><span>Where you check this</span><code>github.com/&lt;your-org&gt;/&lt;repo&gt;/pulls?q=review:approved</code></p>
  </div>
</section>

<section class="lp-section">
  <div class="lp-shell">
    <p class="lp-label">Your GitHub</p>
    <h2 class="lp-h2">It happens in your repositories, under your account.</h2>
    <p class="lp-sub">There is no second system where the real work lives and no export step to get it back. Issues, branches, pull requests, reviews and commits are objects in repositories you own. Close the tab and the work carries on.</p>
      <figure class="instrument-figure" role="img" aria-label="The GitHub App asks for read and write on contents, issues and pull requests, and does not request organization member access.">
<pre aria-hidden="true">contents        <b>████</b>  read · write
issues          <b>████</b>  read · write
pull requests   <b>████</b>  read · write
members         ░░░░  <i>not requested</i></pre>
      </figure>
    <ul class="lp-facts">
      <li><span class="lp-term">Named, not bundled</span> An organization owner reviews the App's permissions and repository access on GitHub's own page. You then choose which repositories the team may work in.</li>
      <li><span class="lp-term">Readable history</span> Every commit, review and merge is in your git history with an author on it, readable with tools we have never heard of.</li>
      <li><span class="lp-term">Cancelling stops the team</span> It does not take the issues, the branches or the history. Those were never anywhere else.</li>
    </ul>
      <p class="lp-verify"><span>Where you check this</span><code>github.com/settings/installations</code></p>
  </div>
</section>

<section class="lp-section">
  <div class="lp-shell">
    <p class="lp-label">Metered spend</p>
    <h2 class="lp-h2">A receipt for everything above this line.</h2>
    <p class="lp-sub">A credit is one cent of billable model, compute, storage and service usage, and every credit is attributed to the work it bought. There is no overage: the team reserves credits before work starts, and when the balance runs out it stops and asks.</p>
      <figure class="instrument-figure" role="img" aria-label="Credit usage across one paid period, showing 18,750 credits used and 31,250 remaining of the 50,000 included.">
<pre aria-hidden="true">     ┌──┐         ┌─┐             ┌────
─────┘  └─────────┘ └───┐  ┌───┐  ┌┘
                        └──┘   └──┘
<i>CREDITS_USED</i>  <b>18,750</b>            <i>REMAINING</i>  <b>31,250</b></pre>
      </figure>
    <ul class="lp-facts">
      <li><span class="lp-term">Included</span> The six specialists, and <code>50,000</code> credits per team, per paid period.</li>
      <li><span class="lp-term">Extra engineers</span> <code>$199</code> a month each, from the fourth to the fiftieth, prorated when you add one.</li>
      <li><span class="lp-term">Top-ups</span> <code>$100</code> buys <code>10,000</code> credits, posted when Stripe confirms the charge, not when the browser says it went through.</li>
    </ul>
      <p class="lp-verify"><span>Where you check this</span><code>Stripe invoice · line: deep navy team</code></p>
  </div>
</section>

<section class="lp-section">
  <div class="lp-shell lp-price">
    <div>
      <p class="lp-label">Price</p>
      <p class="lp-amount">$599<small> / month</small></p>
      <p class="lp-sub" style="margin-top:.6rem">One team, billed monthly. Cancel any time from Settings.</p>
    </div>
    <div>
      <ul class="lp-includes">
        <li>Six agents, including three engineers</li>
        <li>Unlimited issues and pull requests</li>
        <li>Two peer reviews plus manager approval on every merge</li>
        <li>Every action and its cost, itemised</li>
        <li>Add engineers whenever the work needs them</li>
      </ul>
    </div>
  </div>
</section>

<section class="lp-section">
  <div class="lp-shell">
    <p class="lp-label">Not on the ledger</p>
    <h2 class="lp-h2">Four things this page will not tell you.</h2>
    <p class="lp-sub">An accounting is only worth reading if it says what it does not know. These are the claims we are not making, because we cannot show you the receipt.</p>
    <ul class="lp-facts">
      <li><span class="lp-term">No speed claims</span> We do not publish how fast a team ships. It depends on your codebase, and any number we printed would be invented.</li>
      <li><span class="lp-term">No causal claims</span> The ledger records what the work cost and what was observed afterwards. It does not claim the work caused the outcome.</li>
      <li><span class="lp-term">No customer logos</span> This is early access. When a founding team is willing to be named, they will be named here and nowhere else.</li>
      <li><span class="lp-term">No productivity score</span> Nothing is rolled up into a grade, a velocity or an index. The record stays at the size of the thing that happened.</li>
    </ul>
  </div>
</section>
<section class="lp-close">
  <div class="lp-shell">
    <h2 class="lp-h2">Put a team on your repository.</h2>
    <p class="lp-sub" style="margin-inline:auto">$599 a month. Cancel any time.</p>
    <div class="lp-cta">
      <a class="lp-btn lp-btn-github" href="{{ '/app/?signin=1' | relative_url }}"><svg class="github-mark" width="20" height="20" viewBox="0 0 16 16" role="img" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>Continue with GitHub</a>
      <a class="lp-btn lp-btn-quiet" href="{{ '/pricing/' | relative_url }}">Pricing detail</a>
    </div>
  </div>
</section>
