const { to } = require('utils')
const log = require('./log.js')

var db // the database

const request = function(module){
	const output = new Promise(function(resolve, reject){
		try {
			const result = require(module)
			resolve(result)
		} catch(err) {
			reject(new Error(`Could not register module: ${module}`))
		}
	})

	return to(output)
}

exports.init = async function(){
	const [err, sqlite] = await request('sqlite3')

	if(err) {
		log.error(err.message)
		return
	} else {
		log.info('registered module')
	}
}

exports.init()

try { 
	sqlite = require("sqlite3")
	db = new sqlite.Database("./users.db")
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
	const [err, result] = await to(sql_run(SQL.LOOK_UP, [id]))

	if(err) {
		log.error(`Invalid SQL syntax in lookup: ${err.message}`)
		throw err
	}

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

exports.get_permissions = async function(id){
	let output = {}
	const [err, result] = await to(exports.lookup(id))

	if(err) {
		log.error(`No permissions found for ${id}: Invalid SQL`)
		return {} // no permissions
	}

	if(result.length < 1) {
		log.info(`No permissions found for ${id}: Could not find in database`)
		return {} // no permissions
	}

	const user = result[0]
	const { accessgroup } = user

	if(accessgroup == 'dj' || accessgroup =='admin') {
		output.studio_door = true
	} else {
		log.info(`Access Denied for user: ${user.firstname} ${user.lastname}. Not permitted to open studio door`)
		output.studio_door = false
	}

	return output
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