var sqlite = require("sqlite3")
var db = new sqlite.Database("./users.db")

const sql_commands = {
	INIT:`	CREATE TABLE IF NOT EXISTS users (
				firstname text NOT NULL, 
				middlename text, 
				lastname text NOT NULL, 
				communitygroup text NOT NULL, 
				accessgroup text NOT NULL,
				id text PRIMARY KEY
			);`,
	NEW_USER:`INSERT INTO users 
	(firstname, lastname, communitygroup, accessgroup, id) 
	VALUES(?, ?, ?, ?, ?);`,

	CLEAR_ALL: `DELETE FROM users WHERE 1;`,

	LOOK_UP: `SELECT * FROM users WHERE id=?;`

}

exports.clearAll = function() {
	db.run(sql_commands.CLEAR_ALL)
}

exports.lookup = function(id) {
	console.log(id)
	return new Promise((resolve, reject) => {
		db.all(sql_commands.LOOK_UP, [id], (err, rows) => {
			console.log(rows)
			if(err || rows.length == 0)	reject(err)
			else 						resolve(rows[0])
		})
	})
}

exports.register = function(data) {
	return new Promise((resolve, reject) => {
		db.run(sql_commands.NEW_USER, [
			data.firstname,
			data.lastname,
			data.communitygroup,
			data.accessgroup,
			data.id
		], function(err){
			if(err)	reject(err)
			else	resolve()
		})
	})
}