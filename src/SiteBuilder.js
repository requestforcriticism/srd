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

	#meta = {
		tags: [],
		categories: []
	}

	#tags = []

	#options = { ...default_options }
	constructor(options) {
		if (options) {
			this.#options = {
				...default_options,
				...options
			}
		}
		this.loadGlobals()
		this.loadPages()
		this.loadPosts()
	}

	loadGlobals() {
		var globals = require(path.resolve(this.#options.content_dir, "globals.json"))
		this.#meta = {
			...this.#meta,
			...globals
		}
	}

	loadPages() {
		// load page meta info
		this.#meta.pages = this.#meta.pages || []
		this.#meta.nav = this.#meta.nav || []
		var pages_dir = path.join(this.#options.content_dir, "pages")
		var pages = ls(pages_dir)

		for (var p of pages) {
			var page = Renderer.load(path.join(pages_dir, p))

			page.data.title = page.data.title || path.basename(p).replace(/\.md$/, "")
			page.data.href = page.data.href || p.replace(/\.md$/, ".html").replace(/\s+/g, "-").replace(/\\/g, "/")

			var pageRef = {
				...page.data,
				content: page.content
			}
			this.#meta.pages.push(pageRef)

			// if(page.data.categories){
			// 	for(var c of page.data.categories){
			// 		this.#meta.categories[c] = this.#meta.categories[c] || []
			// 		this.#meta.categories[c].push(pageRef)
			// 	}
			// }

			// if(page.data.tags){
			// 	for(var t of page.data.tags){
			// 		this.#meta.tags[t] = this.#meta.tags[t] || []
			// 		this.#meta.tags[t].push(pageRef)
			// 	}
			// }
			
			this.#meta.nav.push({
				href: page.data.href,
				title: page.data.title
			})
		}
	}

	loadPosts(postFolder){
		postFolder = postFolder || "posts"
		this.#meta[postFolder] = this.#meta[postFolder] || []
		var posts_dir = path.join(this.#options.content_dir, postFolder)
		var posts = ls(posts_dir)

		for (var p of posts) {
			var post = Renderer.load(path.join(posts_dir, p))
	
			post.data.title = post.data.title || path.basename(p).replace(/\.md$/, "")
			post.data.href = post.data.href || postFolder + "/" + p.replace(/\.md$/, ".html").replace(/\s+/g, "-").replace(/\\/g, "/")


			var postRef = {
				...post.data,
				content: post.content
			}
			this.#meta[postFolder].push(postRef)

			if(post.data.category){
				for(var c of post.data.category){
					// this.#meta.categories[c] = this.#meta.categories[c] || []
					//need this ugliness because tags may match part of the array prototype
					//ex ["map"] and ["some"] match existing arr lib functions
					this.#meta.categories[c] = (this.#meta.categories[c] && Array.isArray(this.#meta.categories[c])) ? this.#meta.categories[c] : []
					this.#meta.categories[c].push(post.data)
					// console.log(this.#meta.categories)
				}
			}

			if(post.data.tags){
				for(var t of post.data.tags){
					// this.#meta.tags[t] = this.#meta.tags[t] || []
					//need this ugliness because tags may match part of the array prototype
					//ex ["map"] and ["some"] match existing arr lib functions
					this.#meta.tags[t] = (this.#meta.tags[t] && Array.isArray(this.#meta.tags[t])) ? this.#meta.tags[t] : []
					this.#meta.tags[t].push(post.data)
					// console.log(this.#meta.tags)
				}
			}

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

	writePosts(postFolder){
		postFolder = postFolder || "posts"
		for(var p of this.#meta[postFolder]){
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

	updateMeta(data){
		this.#meta = {
			...this.#meta,
			...data
		}
	}

}

module.exports = SiteBuilder