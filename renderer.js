const Handlebars = require('handlebars')
const matter = require('gray-matter');
const { marked } = require('marked')

const { cat } = require('./file-system.js')

var Renderer = {}
// const handlebarsTag = {
// 	name: 'handlebarsTag',
// 	level: 'inline',                          // This is an inline-level tokenizer
// 	start(src) { return src.indexOf('{{'); }, // Hint to Marked.js to stop and check for a match
// 	tokenizer(src, tokens) {
// 		const rule = /^\{\{.*?\}\}+/;           // Regex for the complete token, anchor to string start
// 		const match = rule.exec(src);
// 		if (match) {
// 			return {                               // Token to generate
// 				type: 'handlebarsTag',               // Should match "name" above
// 				raw: match[0],                       // Text to consume from the source
// 				text: match[0]                       // Additional custom properties
// 			};
// 		}
// 	},
// 	renderer(token) {
// 		console.log(token, token.text)
// 		return token.text;
// 	}
// };



// marked.use({ extensions: [handlebarsTag] });

//neded to prevent {{}} from being escaped in the links
marked.use({
	extensions: [{
		name: 'link',
		renderer(token) {
			return `<a href="${token.href}">${token.text}</a>`
		}
	}]
})

var templates = []
Renderer.template = function (templatePath, ...data) {
	if (!templates[templatePath]) {
		var templateText = cat(templatePath)
		templates[templatePath] = Handlebars.compile(templateText)
	}
	if (Array.isArray(data)) {
		var expandedObject = {}
		for (var d of data) {
			expandedObject = {
				...expandedObject,
				...d
			}
		}
		data = expandedObject
	}
	return templates[templatePath](data)
}

Renderer.load = function (file) {
	var parsed = matter(cat(file))
	return {
		data: parsed.data,
		content: marked(parsed.content)
	}
}

Renderer.page = function (html, ...data) {
	if (Array.isArray(data)) {
		var expandedObject = {}
		for (var d of data) {
			expandedObject = {
				...expandedObject,
				...d
			}
		}
		data = expandedObject
	}
	var pageTemplate = Handlebars.compile(html)
	return pageTemplate(data)
}

Renderer.markdown = function (file, globals) {
	var f = cat(file)
	var parsed = matter(f)
	var hbsTemplate = Handlebars.compile(parsed.content)
	var variables = {
		...globals,
		...parsed.data
	}
	var html = marked(hbsTemplate(variables))
	return {
		data: parsed.data,
		content: html
	}
}

module.exports = Renderer