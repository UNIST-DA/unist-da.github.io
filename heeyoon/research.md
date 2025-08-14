---
layout: page
title: "Research"
lang: "en"
ko_url: "/ko/research/"
---

### Publications
<ul class="list">
{% assign pubs = site.publications | sort: 'year' | reverse %}
{% for p in pubs %}
  <li>
    <strong>{{ p.title }}</strong> ({{ p.year }}) — {{ p.venue }}<br>
    {{ p.authors | join: ", " }}
  </li>
{% endfor %}
</ul>
