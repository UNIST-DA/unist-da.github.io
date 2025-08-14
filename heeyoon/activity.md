---
layout: page
title: "Activity"
lang: "en"
ko_url: "/ko/activity/"
---

## Lab News
<ul class="list">
{% for post in site.posts %}
  {% if post.categories contains "news" %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span class="badge">News</span>
    — {{ post.date | date: "%Y-%m-%d" }}
  </li>
  {% endif %}
{% endfor %}
</ul>

## Tips & Essays
<ul class="list">
{% for post in site.posts %}
  {% if post.categories contains "tips" %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span class="badge">Tips</span>
    — {{ post.date | date: "%Y-%m-%d" }}
  </li>
  {% endif %}
{% endfor %}
</ul>
