var gulp = require('gulp');
var nodemon = require('nodemon');

var { rm, cp } = require('./src/file-system.js')
var SiteBuilder = require('./src/SiteBuilder.js')

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

function build(done) {
	// static(()=>{console.log("Static Done")})

	var siteBuilder = new SiteBuilder(options)
	siteBuilder.loadPosts("skills")
	siteBuilder.loadPosts("feats")
	siteBuilder.updateMeta({
		site: {
			root: "http://localhost:3000/",
			title: "DEV SITE"
		}
	})
	siteBuilder.writePages()
	siteBuilder.writePosts()
	siteBuilder.writePosts("skills")
	siteBuilder.writePosts("feats")
	console.log(siteBuilder.getMeta().tags)
	console.log(siteBuilder.getMeta().categories)
	done()
}

function watch(done) {
	nodemon('-e md,hbs -x "gulp build"');
	nodemon.on('start', function () {
		console.log('App has started');
	}).on('quit', function () {
		console.log('App has quit');
		done()
	}).on('restart', function (files) {
		console.log('App restarted due to: ', files);
	});
}

exports.clean = clean
exports.build = build
exports.watch = watch
exports.bootstrap = bootstrap
exports.jquery = jquery
exports.static = static

exports.default = build