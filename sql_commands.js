exports.INIT_USERS = `\
CREATE TABLE IF NOT EXISTS users (
	firstname text NOT NULL, 
	middlename text, 
	lastname text NOT NULL, 
	communitygroup text NOT NULL, 
	accessgroup text NOT NULL,
	id text PRIMARY KEY
);`

exports.NEW_USER = `\
INSERT INTO users (
	firstname, lastname, communitygroup, accessgroup, id
) 
VALUES(?, ?, ?, ?, ?);
`

exports.CLEAR_ALL = `\
DELETE FROM users WHERE 1;
`

exports.LOOK_UP = `\
SELECT * FROM users WHERE id=?;
`

exports.INIT_LOG = `\
CREATE TABLE IF NOT EXISTS log (
	message text NOT NULL,	
);
`

exports.ALL = `\
SELECT * FROM users;
`