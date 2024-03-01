const fs = require('fs')
const path = require('path')

/**
 * Recursively get a list of all the files in a directory
 * @param {string} dir - the directory to list
 * @param {string} [basedir] - Do not use. Used later in recursive search 
 * @returns {Array[String]} Array of file paths to recursive files
 */
function ls(dir, basedir){
	var list = []
	basedir = basedir || dir

	var currentFiles = fs.readdirSync(dir)
	for(var f of currentFiles){
		var fullPath = path.join(dir, f)
		var stat = fs.lstatSync(fullPath)
		if(!stat.isDirectory()){
			//strip out the content\\pages\\ from the file path before pushing
			list.push(path.relative(basedir, fullPath))
		} else {
			list.push(...ls(fullPath, basedir))
		}
	}
	return list
}

/**
 * Load the contents from a text file
 * @param {String} file 
 * @returns {String} File contents in utf8 format
 */
function cat(file){
	return fs.readFileSync(file, "utf8")
}

/**
 * Write text to a file
 * @param {String} file 
 * @param {String} data 
 */
function write(file, data){
	var destDir = path.dirname(file)
	if(!fs.existsSync(destDir)){
		fs.mkdirSync(destDir, {recursive:true})
	}
	fs.writeFileSync(file, data)
}

module.exports = { ls, cat, write }