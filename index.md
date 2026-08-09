---
title: deep navy
image: /assets/images/og/home.png
description: An engineering team that reads your repository, writes the issues, builds them, and reviews its own pull requests before you merge.
body_class: home lp
schema_type: Organization
updated: 2026-08-08
extra_css: /assets/css/home.css
---

<section class="lp-hero">
  <div class="lp-shell lp-hero-grid">
    <div>
      <p class="lp-eyebrow"><span class="lp-live" aria-hidden="true"></span> Early access · founding teams</p>
      <h1 class="lp-h1">Your engineering team, <em>already in your repo</em>.</h1>
      <p class="lp-lede">Six specialists — a product manager, an engineering manager, a product designer and three engineers. They read your codebase, write the issues, build them, and review each other's pull requests. You merge.</p>
      <div class="lp-cta">
        <a class="lp-btn lp-btn-go" href="{{ '/app/' | relative_url }}">Connect your repo</a>
        <a class="lp-btn lp-btn-quiet" href="#how">See how it works</a>
      </div>
      <p class="lp-note">$599 a month. One team, cancel any time.</p>
    </div>

    <!-- The product makes pull requests, so the hero is a pull request. -->
    <figure class="pr" aria-label="A pull request opened by a deep navy engineer">
      <div class="pr-top"><span>IamGoodBad/Purizumu</span><span>#284</span><span class="pr-merged">merged</span></div>
      <div class="pr-body">
        <h2 class="pr-title">Restore focus when a dialog closes</h2>
        <p class="pr-by">opened by engineer-2 · 41 min ago · +47 −12</p>
        <pre class="pr-diff" aria-label="Diff excerpt"><code><span class="ctx">  useEffect(() =&gt; {</span>
<span class="del">-   return () =&gt; setOpen(false)</span>
<span class="add">+   const opener = document.activeElement</span>
<span class="add">+   return () =&gt; opener?.focus()</span>
<span class="ctx">  }, [])</span></code></pre>
        <div class="pr-reviews">
          <p class="pr-review"><b>Engineering Manager</b> <span class="pr-ok">approved</span></p>
          <p class="pr-review"><b>Engineer 1</b> <span class="pr-ok">approved</span> <span>— added a test for the escape key path.</span></p>
          <p class="pr-review"><b>Product Designer</b> <span class="pr-ok">approved</span></p>
        </div>
      </div>
    </figure>
  </div>
</section>

<section class="lp-section" id="how">
  <div class="lp-shell">
    <p class="lp-label">How it works</p>
    <h2 class="lp-h2">Work moves the way it does on a real team.</h2>
    <p class="lp-sub">You state an objective. It becomes issues in your repository, then branches, then pull requests that two engineers and the manager have already reviewed. Every step happens in your GitHub, under your account.</p>
    <ol class="lp-steps">
      <li class="lp-step">
        <div><h3>Connect a repository</h3>
        <p>Sign in with GitHub and pick the repository your team will work in. We ask for the permissions the work needs and name each one.</p></div>
      </li>
      <li class="lp-step">
        <div><h3>Say what you want</h3>
        <p>One sentence, the way you would tell a colleague. "Cut our checkout drop-off." "Get the flaky tests under control."</p></div>
      </li>
      <li class="lp-step">
        <div><h3>Read the plan</h3>
        <p>Your product manager breaks it into issues with acceptance criteria and files them in your repository, where you can read them like any other ticket.</p></div>
      </li>
      <li class="lp-step">
        <div><h3>Watch it ship</h3>
        <p>Engineers pick up the issues and build. Every pull request needs two engineer reviews and the engineering manager's approval before it can merge — the same bar you would hold a human team to.</p></div>
      </li>
    </ol>
  </div>
</section>

<section class="lp-section">
  <div class="lp-shell">
    <p class="lp-label">The team</p>
    <h2 class="lp-h2">Six specialists, not one chatbot.</h2>
    <p class="lp-sub">Work moves between them the way it moves through a real team, and each hand-off is visible to you as it happens.</p>
    <ul class="lp-crew">
      <li><strong>Product Manager</strong><span>Turns your objective into issues with acceptance criteria.</span></li>
      <li><strong>Engineering Manager</strong><span>Adds context, assigns each issue, and holds the review bar.</span></li>
      <li><strong>Product Designer</strong><span>Interface decisions, tokens and accessibility.</span></li>
      <li><strong>Engineers × 3–50</strong><span>Build the issues and review each other's pull requests. Three is the floor, so every merge has two peer reviewers.</span></li>
    </ul>
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

<section class="lp-close">
  <div class="lp-shell">
    <h2 class="lp-h2">Put a team on your repository.</h2>
    <p class="lp-sub" style="margin-inline:auto">$599 a month. Cancel any time.</p>
    <div class="lp-cta">
      <a class="lp-btn lp-btn-go" href="{{ '/app/' | relative_url }}">Connect your repo</a>
      <a class="lp-btn lp-btn-quiet" href="{{ '/pricing/' | relative_url }}">Pricing detail</a>
    </div>
  </div>
</section>
