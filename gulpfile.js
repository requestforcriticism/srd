var gulp = require('gulp');
var { rm } = require('./src/file-system.js')
var SiteBuilder = require('./src/SiteBuilder.js')

var options = {
	build_dir: "./docs"
}

function clean(done){
	rm(options.build_dir)
	done()
}

function build(done){
	var siteBuilder = new SiteBuilder(options)
	siteBuilder.loadPosts("skills")
	siteBuilder.loadPosts("feats")
	siteBuilder.writePages()
	siteBuilder.writePosts()
	siteBuilder.writePosts("skills")
	siteBuilder.writePosts("feats")
	done()
}

function watch(done){
	done()
}

exports.clean = clean
exports.build = build
exports.watch = watch

exports.default = build