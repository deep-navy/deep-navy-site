---
title: Field Notes
description: Product, engineering, security, and economics notes from building accountable autonomous engineering teams.
updated: 2026-07-17
---

<section class="page-hero"><div class="shell"><span class="eyebrow">Field notes</span><h1>Building accountable autonomous teams.</h1><p>Practical notes on coordination, isolation, approval, delivery evidence, and Engineering Economics.</p></div></section>
<section class="content-section"><div class="shell"><div class="article-list">{% for post in site.posts %}<a class="article-card" href="{{ post.url | relative_url }}"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%B %-d, %Y' }}</time><h2>{{ post.title }}</h2><p>{{ post.description }}</p><span>Read field note →</span></a>{% endfor %}</div></div></section>
