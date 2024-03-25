const betterSqlite = require('better-sqlite3');
const { K } = require('handlebars');


var createPageTableQuery = 
`CREATE TABLE IF NOT EXISTS Pages (
	id 			INTEGER 	PRIMARY KEY,
   	title 		TEXT 		NOT NULL,
	contents 	TEXT,
	nav			TEXT,
	layout		TEXT,
	href		TEXT,
	date		TEXT,
	type		TEXT,
	subtype		TEXT,
	category	TEXT
);`

var createTagsTableQUery = 
`CREATE TABLE IF NOT EXISTS Tags (
	id 			INTEGER 	PRIMARY KEY,
   	title 		TEXT 		NOT NULL
);`

var createPageTagsTableQUery = 
`CREATE TABLE IF NOT EXISTS PageTags (
   	page 		INTEGER 	NOT NULL,
	tag			INTEGER		NOT NULL,
	PRIMARY KEY (page, tag)
);`

var insertTag = `INSERT INTO Tags (title) VALUES (?);`

var getTags = `SELECT * FROM Tags`

var getAllPageTags = `SELECT * FROM PageTags`

var getPageTags = `SELECT * FROM PageTags WHERE page = ?`

var getTagByName = `SELECT * FROM Tags WHERE title=?;`

var addPageTag = `INSERT INTO PageTags (page, tag) VALUES (?, ?);`

var hasTag = `SELECT EXISTS(SELECT 1 FROM PageTags WHERE tag=? AND page=?);`

var insertPage = `INSERT INTO Pages (title, contents) VALUES (?, ?)`

var getTagId = `SELECT * FROM Tags WHERE title = ?`

var updatePage = 
`UPDATE Pages
SET 
	title = ?,
	contents = ?,
	nav = ?,
	layout = ?,
	href = ?,
	date = ?,
	type = ?,
	subtype = ?,
	category = ?
WHERE
    id = ?`

class DB{

	#db
	#queries = []

	constructor(path){
		this.#db = betterSqlite(path)
	}

	#prepareQuery(name, qstr){
		if(this.#queries[name]){
			return this.#queries[name]
		}
		this.#queries[name] = this.#db.prepare(qstr)
		return this.#queries[name]
	}

	createTables(){
		this.#db.prepare(createPageTableQuery).run()
		this.#db.prepare(createTagsTableQUery).run()
		this.#db.prepare(createPageTagsTableQUery).run()
	}

	truncate(){
		this.#db.prepare("DELETE FROM Pages;").run()
		this.#db.prepare("DELETE FROM Tags;").run()
		this.#db.prepare("DELETE FROM PageTags;").run()
	}

	addPage(title, contents){
		return this.#prepareQuery("addPage", insertPage).run(title, contents)
	}

	updatePage(data){
		return this.#prepareQuery("updatePage", updatePage).run(
			data.title,
			data.contents,
			data.nav,
			data.layout,
			data.href,
			data.date,
			data.type,
			data.subtype,
			data.category,
			data.id
		)
	}

	tagExists(tag){
		var ret = this.#prepareQuery("getTagByName", getTagByName).all(tag)
		// console.log( ret.length)
		if(ret.length > 0){
			return ret[0].id
		} 
		return undefined
	}

	addTag(tag){
		var tagId = this.tagExists(tag)
		console.log(tagId)
		if(tagId != undefined){
			console.log("t",tag, tagId)
			return tagId
		}
		return this.#prepareQuery("addTag", insertTag).run(tag).lastInsertRowid
	}

	getTags(){
		return this.#prepareQuery("getTags", getTags).all()
	}

	getAllPageTags(){
		return this.#prepareQuery("getAllPageTags", getAllPageTags).all()
	}

	getPageTags(page){

	}

	hasTag(page, tag){

	}

	addPageTag(page, tag){
		var ret = this.#prepareQuery("addPageTag", addPageTag).run(page, tag)
		return ret
	}

	exec(str, func, arg1){
		return this.#db.prepare(str)[func](arg1)
	}


}

module.exports = DB