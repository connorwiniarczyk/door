const log = require('./log.js')
var db // the database

try { 
	sqlite = require("sqlite3")
	db = new sqlite.Database("./door.db")
} catch(err) {
	db = null
}

if(db)	log.info('user database registered successfully')
else	log.warn('could not register database')

const SQL = require("./sql_commands.js");

//wrap sqlite commands in a Promise API for ease of use
sql_run = function(method, args){
	// make sure that SQL is enabled
	if(db == null) {
		return // do not execute the rest of the function
	}

	return new Promise((resolve, reject) => {
		db.all(method, args, function(err, rows){
			if(err) reject(err.message)
			else 	resolve(rows)
		})
	})
}

// expose some methods
exports.lookup = async function(id) {
	const result = await sql_run(SQL.LOOK_UP, [id])
	console.log(result)
	return result
}

exports.register = async function(data) {
	const args = [
		data.firstname,
		data.lastname,
		data.communitygroup,
		data.accessgroup,
		data.id,
	]

	await sql_run(SQL.NEW_USER, args)
}

exports.all = async function(){
	return await sql_run(SQL.ALL, [])
}

// exports.register({
// 	firstname: "hello",
// 	lastname: "hello",
// 	communitygroup: "DJ",
// 	accessgroup: "IDK",
// 	id: "b67asdm",
// })
// .catch(err => console.log(err))

exports.all()

// COMMENTED OUT FOR SAFETY
// -------------------------
// exports.clearAll = function() {
// 	db.run(SQL.CLEAR_ALL)
// }

// exports.lookup = function(id) {
// 	return new Promise((resolve, reject) => {
// 		db.all(SQL.LOOK_UP, [id], (err, rows) => {
// 			console.log(rows)
// 			if(err || rows.length == 0)	reject(err)
// 			else 						resolve(rows[0])
// 		})
// 	})
// }

// exports.register = function(data) {
// 	console.log(data)
// 	return new Promise((resolve, reject) => {
// 		db.run(SQL.NEW_USER, [
// 			data.firstname,
// 			data.lastname,
// 			data.communitygroup,
// 			data.accessgroup,
// 			data.id
// 		], function(err){
// 			if(err)	reject(err)
// 			else	resolve()
// 		})
// 	})
// }