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
		tags: {},
		categories: {}
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
			if(typeof page.data.nav != "undefined" && !page.data.nav){

			} else {
				this.#meta.nav.push({
					href: page.data.href,
					title: page.data.title
				})
			}

		}
	}

	splitNavPaths(){
		var nav = []
		for(var n of this.#meta.nav){
			var pathSplit = n.href.split("/")
			//surface level page
			if(pathSplit.length == 1){
				nav.push({
					...n,
					page: "page"
				})
			} else if(pathSplit.length == 2){
				var baseDropdown = {
					dropdown: "dropdown",
					title: pathSplit[0],
					pages: []
				}
				// nav[pathSplit[0]] = (!Array.isArray(nav[pathSplit[0]])) ? baseDropdown : nav[pathSplit[0]]
				nav[pathSplit[0]] = nav[pathSplit[0]] || baseDropdown
				// nav[pathSplit[0]] = (nav[pathSplit[0]] && Array.isArray(nav[pathSplit[0]])) ? nav[pathSplit[0]] : baseDropdown
				nav[pathSplit[0]].pages.push({
					...n,
					page: "page"
				})
				// console.log(nav)
			}
			//ignore anything deeper than that

			
		}
		var newNav = []
		for(var i in nav){
			newNav.push(nav[i])
		}
		this.#meta.nav = newNav
		
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

	writeTagsPages(tagsDir){
		var tagPageTemplate = Renderer.load(path.join(this.#options.content_dir, "templates", "tag.md"))
		// console.log(tagPageTemplate)
		for(var t in this.#meta.tags){
			var tagPageHtml = Renderer.page(tagPageTemplate.content, this.#meta, tagPageTemplate.data, {
				post: this.#meta.tags[t],
				title: t
			})
			// console.log(tagPageHtml)
			var fileHtml = Renderer.template(path.join(this.#options.theme_dir, this.#options.theme, "layout.hbs"), this.#meta, {
				// tags: tags,
				body: tagPageHtml,
				nav: this.#meta.nav,
				title: "Tag:" + t
			})
			write(path.join(this.#options.build_dir, tagsDir, t+ ".html"), fileHtml)

		}
	}

	writeCategoryPages(catDir){
		var catPageTemplate = Renderer.load(path.join(this.#options.content_dir, "templates", "category.md"))
		// console.log(tagPageTemplate)
		for(var c in this.#meta.categories){
			var tagPageHtml = Renderer.page(catPageTemplate.content, this.#meta, catPageTemplate.data, {
				post: this.#meta.categories[c],
				title: c
			})
			// console.log(tagPageHtml)
			var fileHtml = Renderer.template(path.join(this.#options.theme_dir, this.#options.theme, "layout.hbs"), this.#meta, {
				// tags: tags,
				body: tagPageHtml,
				nav: this.#meta.nav,
				title: "Category:" + c
			})
			write(path.join(this.#options.build_dir, catDir, c+ ".html"), fileHtml)

		}
	}

	writePages(){
		for (var p of this.#meta.pages) {
			var content = Renderer.page(p.content, this.#meta, p)
			// var tags = []
			// for(var i in this.#meta.tags){
			// 	tags[i] = this.#meta.tags[i]
			// }
			// // console.log(tags)
			var fileHtml = Renderer.template(path.join(this.#options.theme_dir, this.#options.theme, "layout.hbs"), this.#meta, p, {
				// tags: tags,
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
			var pageLayout = (p.type) ? p.type : "layout"
			var fileHtml = Renderer.template(path.join(this.#options.theme_dir, this.#options.theme, pageLayout+".hbs"), this.#meta, p, {
				body: content,
				nav: this.#meta.nav,
				page: p
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