
## Archive of Posts

{{#each posts}}
__[{{title}}]({{../site.root}}{{href\}})__ _{{date}}_ <br/>
{{#if short}}{{short}}<br/>{{/if}}
{{#if category}}Categories: {{#each category}}<a href="{{../../site.root}}category/{{this}}">{{this}}</a> {{/each}} | {{/if}}
{{#if tags}}Tags: {{#each tags}}<a href="{{../../site.root}}tags/{{this}}">{{this}}</a> {{/each}}{{/if}}

{{/each}}