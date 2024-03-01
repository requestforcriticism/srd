const matter = require('gray-matter');
const {marked} = require('marked')
const fs = require('fs')
const Handlebars = require("handlebars");

function replaceVariables(text, variables){
	for(var v in variables){
		var regexSearch = new RegExp("\\${\\s*"+ v +"\\s*}", "g")
		text = text.replace(regexSearch, variables[v])
	}
	return text
}

function normalizeLineEndings(text){
	return text.replace(/\r\n|\r|\n/g, "\n")
}

function parse(text, globals){
	var parsed = matter(text)
	var hbsTemplate = Handlebars.compile(parsed.content)
	var variables = {
		...globals,
		...parsed.data
	}
	var html = marked(hbsTemplate(variables))
	return {
		data: parsed.data,
		html: html
	}
}

function parseFile(filePath, globals){
	var f = fs.readFileSync(filePath, "utf8")
	var parsed = matter(f)
	var hbsTemplate = Handlebars.compile(parsed.content)
	var variables = {
		...globals,
		...parsed.data
	}
	var html = marked(hbsTemplate(variables))
	return {
		data: parsed.data,
		html: html
	}
}

// function compileHtml(layout, )

module.exports = {replaceVariables, normalizeLineEndings, parseFile, parse}