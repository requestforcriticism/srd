---
title: Home
layout: home
nav: false
---

# RFC/SRD: Welcome to the Solaris Research Database



### New Players

Insert todo

### Active bounties

- Submitting fixes for minor errors.
- Fubmitting fixes for major errors.

### Recent Posts

{{#each posts}}
__[{{title}}]({{../site.root}}{{href\}})__ _{{date}}_ <br/>
{{#if short}}{{short}}<br/>{{/if}}
<!-- {{#if category}}Categories: {{#each category}}<a href="{{../../site.root}}category/{{this}}">{{this}}</a> {{/each}} | {{/if}} -->
<!-- {{#if tags}}Tags: {{#each tags}}<a href="{{../../site.root}}tags/{{this}}">{{this}}</a> {{/each}}{{/if}} -->
{{/each}}




