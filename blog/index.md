---
title: Field Notes
image: /assets/images/og/blog.png
description: Product, engineering, security, and economics notes from the deep navy implementation record.
updated: 2026-07-17
---

<section class="page-hero"><div class="shell"><span class="eyebrow">Engineering field notes</span><h1>Decisions from the implementation record.</h1><p>Notes on coordination contracts, runtime isolation, approvals, delivery evidence, and customer economics.</p><div class="page-meta"><span>Maintainer / deep navy</span><span>Updated July 17, 2026</span></div></div></section>
<section class="content-section"><div class="shell"><div class="article-list">{% for post in site.posts %}<a class="article-card" href="{{ post.url | relative_url }}"><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: '%B %-d, %Y' }}</time><h2>{{ post.title }}</h2><p>{{ post.description }}</p><span>Open note →</span></a>{% endfor %}</div></div></section>
