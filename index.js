const fs = require('fs')
const path = require('path')

const { ls, cat, write } = require('./file-system.js')
const Renderer = require("./renderer.js")

const default_options = {
	theme: "default",
	theme_dir: "./themes",
	content_dir: "./content",
	build_dir: "./dest"
}

class SiteBuilder {

	#meta = {}
	#options = { ...default_options }
	constructor(options) {
		if (options) {
			this.#options = {
				...default_options,
				...options
			}
		}
		this.#loadGlobals()
		this.#loadPages()
		this.#loadPosts()
	}

	#loadGlobals() {
		var globals = require(path.resolve(this.#options.content_dir, "globals.json"))
		this.#meta = {
			...this.#meta,
			...globals
		}
	}

	#loadPages() {
		// load page meta info
		this.#meta.pages = this.#meta.pages || []
		this.#meta.nav = this.#meta.nav || []
		var pages_dir = path.join(this.#options.content_dir, "pages")
		var pages = ls(pages_dir)

		for (var p of pages) {
			var page = Renderer.load(path.join(pages_dir, p))

			page.data.title = page.data.title || path.basename(p).replace(/\.md$/, "")
			page.data.href = page.data.href || p.replace(/\.md$/, ".html").replace(/\s+/g, "-").replace(/\\/g, "/")

			this.#meta.pages.push({
				...page.data,
				content: page.content
			})

			this.#meta.nav.push({
				href: page.data.href,
				title: page.data.title
			})
		}
	}

	#loadPosts(){
		this.#meta.posts = this.#meta.posts || []
		var posts_dir = path.join(this.#options.content_dir, "posts")
		var posts = ls(posts_dir)

		for (var p of posts) {
			var post = Renderer.load(path.join(posts_dir, p))
	
			post.data.title = post.data.title || path.basename(p).replace(/\.md$/, "")
			post.data.href = post.data.href || "posts/" + p.replace(/\.md$/, ".html").replace(/\s+/g, "-").replace(/\\/g, "/")
	
			this.#meta.posts.push({
				...post.data,
				content: post.content
			})
		}
	}

	writePages(){
		for (var p of this.#meta.pages) {
			var content = Renderer.page(p.content, this.#meta, p)
			var fileHtml = Renderer.template(path.join(this.#options.theme_dir, this.#options.theme, "layout.hbs"), this.#meta, p, {
				body: content,
				nav: this.#meta.nav
			})
			write(path.join(this.#options.build_dir, p.href), fileHtml)
		}
	}

	writePosts(){
		for(var p of this.#meta.posts){
			var content = Renderer.page(p.content, this.#meta, p)
			var fileHtml = Renderer.template(path.join(this.#options.theme_dir, this.#options.theme, "layout.hbs"), this.#meta, p, {
				body: content,
				nav: this.#meta.nav
			})
			write(path.join(this.#options.build_dir, p.href), fileHtml)
		}
	}

	getMeta() {
		return this.#meta
	}

}

var siteBuilder = new SiteBuilder()

// console.log(siteBuilder.getMeta())

siteBuilder.writePages()
siteBuilder.writePosts()

// function loadMeta(options) {
// 	if (options) {
// 		options = {
// 			...default_options,
// 			...options
// 		}
// 	} else {
// 		options = default_options
// 	}
// 	var pages_dir = path.join(options.content_dir, "pages")
// 	var posts_dir = path.join(options.content_dir, "posts")
// 	var pages = ls(pages_dir)
// 	var posts = ls(posts_dir)

// 	var globals = require("./content/globals.json")
// 	meta = {
// 		...globals,
// 		pages: [],
// 		posts: [],
// 		nav: []
// 	}

// 	// load page meta info
// 	for (var p of pages) {
// 		var page = Renderer.load(path.join(pages_dir, p))

// 		page.data.title = page.data.title || path.basename(p).replace(/\.md$/, "")
// 		page.data.href = page.data.href || p.replace(/\.md$/, ".html").replace(/\s+/g, "-").replace(/\\/g, "/")

// 		meta.pages.push({
// 			...page.data,
// 			content: page.content
// 		})

// 		meta.nav.push({
// 			href: page.data.href,
// 			title: page.data.title
// 		})
// 	}

// 	//Load post meta info
// 	for (var p of posts) {
// 		var post = Renderer.load(path.join(posts_dir, p))

// 		post.data.title = post.data.title || path.basename(p).replace(/\.md$/, "")
// 		post.data.href = post.data.href || "posts/" + p.replace(/\.md$/, ".html").replace(/\s+/g, "-").replace(/\\/g, "/")

// 		meta.posts.push({
// 			...post.data,
// 			content: post.html
// 		})
// 	}

// 	return meta
// }

// function writeSite(meta, options) {
// 	if (options) {
// 		options = {
// 			...default_options,
// 			...options
// 		}
// 	} else {
// 		options = default_options
// 	}

// 	//actually wrtite pages out now
// 	for (var p of meta.pages) {
// 		var content = Renderer.page(p.content, meta, p)
// 		var fileHtml = Renderer.template(path.join(options.theme_dir, options.theme, "layout.hbs"), meta, p, {
// 			body: content,
// 			nav: meta.nav
// 		})
// 		write(path.join(options.build_dir, p.href), fileHtml)
// 	}
// }

// function build(themeDir, contentDir, buildDir) {
// 	var globals = require("./content/globals.json")
// 	var theme = globals.theme || "default"
// 	var pages = ls(path.join(contentDir, "pages"))
// 	var posts = ls(path.join(contentDir, "posts"))

// 	var meta = {
// 		pages: [],
// 		posts: [],
// 		nav: []
// 	}

// 	// load page meta info
// 	for (var p of pages) {
// 		var page = Renderer.load(path.join(contentDir, "pages", p))

// 		page.data.title = page.data.title || path.basename(p).replace(/\.md$/, "")
// 		page.data.href = page.data.href || p.replace(/\.md$/, ".html").replace(/\s+/g, "-").replace(/\\/g, "/")

// 		meta.pages.push({
// 			...page.data,
// 			content: page.content
// 		})

// 		meta.nav.push({
// 			href: page.data.href,
// 			title: page.data.title
// 		})
// 	}

// 	//Load post meta info
// 	for (var p of posts) {
// 		var post = Renderer.load(path.join(contentDir, "posts", p))

// 		post.data.title = post.data.title || path.basename(p).replace(/\.md$/, "")
// 		post.data.href = post.data.href || "posts/" + p.replace(/\.md$/, ".html").replace(/\s+/g, "-").replace(/\\/g, "/")

// 		meta.posts.push({
// 			...post.data,
// 			content: post.html
// 		})
// 	}

// 	//actually wrtite pages out now
// 	for (var p of meta.pages) {
// 		var content = Renderer.page(p.content, globals, meta, p)
// 		var fileHtml = Renderer.template(path.join(themeDir, theme, "layout.hbs"), globals, p, {
// 			body: content,
// 			nav: meta.nav
// 		})
// 		write(path.join(buildDir, p.href), fileHtml)
// 	}
// }

// build("./themes", "./content", "./dist")
// var meta = loadMeta()
// console.log(meta)
// writeSite(meta)