var nodemon = require('nodemon');
var trun = require("@rfcrit/trun")

var { rm, cp, write } = require('./src/file-system.js')


const { page } = require('./src/renderer.js');

var options = {
	build_dir: "./docs"
}

var staticResources = [
	{
		src: "./node_modules/bootstrap/dist",
		dest: "./themes/default/static/bootstrap"
	},
	{
		src: "./node_modules/jquery/dist",
		dest: "./themes/default/static/jquery"
	}
]

function clean(done) {
	rm(options.build_dir)
	// rm("./test.sqlite")
	done()
}

function clean_db(done) {
	// rm(options.build_dir)
	rm("./test.sqlite")
	done()
}

function bootstrap(done){
	cp("./node_modules/bootstrap/dist", "./themes/default/static/bootstrap")
	done()
}

function jquery(done){
	cp("./node_modules/jquery/dist", "./themes/default/static/jquery")
	done()
}

function static(done){
	cp("./themes/default/static", options.build_dir + "/static")
	done()
}

function runSiteBuilder(isRelease){
	var SiteBuilder = require('./src/SiteBuilder.js')
	var siteBuilder = new SiteBuilder(options)
	if(!isRelease){
		var meta = siteBuilder.getMeta()
		meta.site.root = "http://localhost:3000/"
		meta.site.title = "RFS/SRD"
		siteBuilder.updateMeta(meta)
	}
	siteBuilder.splitNavPaths()
	siteBuilder.writePages()
	siteBuilder.writePosts()
	siteBuilder.writeTagsPages("tags")
	siteBuilder.writeCategoryPages("category")
	write("meta.json", JSON.stringify(siteBuilder.getMeta()))
}

function build(done, isRelease) {
	runSiteBuilder(isRelease)
	done()
}
build.depends=[clean_db, static, bootstrap, jquery]
// build.depends=[clean_db]



function dev(done){
	runSiteBuilder(false)
	done()
}
dev.depends=[clean_db]

function watch(done) {
	nodemon('-e md,hbs -x "trun dev"');
	nodemon.on('start', function () {
		console.log('App has started');
	}).on('quit', function () {
		console.log('App has quit');
		done()
	}).on('restart', function (files) {
		console.log('App restarted due to: ', files);
	});
}

function db(done, func, arg, arg2, arg3, arg4){
	var DB = require("./src/db.js");
	var pageDb = new DB("test.sqlite")
	pageDb.createTables()
	pageDb.truncate()

	console.log(pageDb[func]?.name)
	if(pageDb[func]?.name == func){
		console.log("found function", func, arg, arg2, arg3, arg4)
		var ret = pageDb[func](arg, arg2, arg3, arg4)
		console.log(ret)
	} else {
		console.log("NO function found: ", func)
	}
	done()
}

exports.clean = clean
exports.build = build
exports.watch = watch
exports.db = db
exports.clean_db = clean_db
exports.dev = dev

exports.default = build