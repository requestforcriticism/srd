
## Categories




{{#if site.long_category_page}}
long form

{{#each categories}} 

## [{{@key}}](../{{site.root}}category/{{@key}})

{{#each this}}

[{{title}}](../../{{site.root}}{{href}})

{{/each}}

{{/each}}
{{else}}

{{#each categories}} 

- [{{@key}}](../{{site.root}}category/{{@key}})

{{/each}}

{{/if}}