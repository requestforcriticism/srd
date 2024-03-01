var SiteBuilder = require('./src/SiteBuilder.js')


var options = {
	build_dir: "./docs"
}


var siteBuilder = new SiteBuilder(options)
siteBuilder.loadPosts("skills")
siteBuilder.loadPosts("feats")
siteBuilder.updateMeta({
	site: {
		root: "http://localhost:3000/",
		title: "DEV SITE"
	}
})
siteBuilder.splitNavPaths()
siteBuilder.writePages()
siteBuilder.writePosts()
siteBuilder.writePosts("skills")
siteBuilder.writePosts("feats")
// console.log(siteBuilder.getMeta().tags)
// console.log(siteBuilder.getMeta())
// console.log(siteBuilder.getMeta().categories)