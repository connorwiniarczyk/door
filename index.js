#!/usr/bin/env node

var door = require("./door_control.js")
var users = require("./users.js")
var log = require("./log.js")

// the two main parts of our interface, one handles input via http, and the other
// (cli) takes input from the command line
const http = require("./interface/http_interface.js")
const cli = require("./interface/cli_interface.js")

// build the event handler that our interfaces will use
const events = require('events')
const interface = new events()

events.prototype.next = function(event){
	return new Promise(function(resolve, reject){
		events.once(event, function(args){
			resolve(args)
		})
	})
}

//-------------------------------------
//	Handle Input Events
//-------------------------------------

interface.on('open_door', function(){
	door.open()
})

// fetch a list of all the users and pass it back
// to the interface so it can display the output
interface.on('list_users', async function(callback){
	const result = await users.all()
	callback(result)
})

interface.on('begin_server', function(port){
	http.listen(interface, port)
})

interface.on('scan', async function(id){
	const { studio_door } = await users.get_permissions(id)
})

cli.listen(interface)

// // Comment out to disable force_open functionality
// server.on("force_open", () => door.open())

// server.on("scan", function(id){
// 	users.lookup(id)
// 	.then(function(row){
// 		console.log(row)
// 		if(row[0].accessgroup == "dj" || row[0].accessgroup == "admin") door.open()
// 	})
// 	.catch(err => console.log(err))
// })

// server.on("register", data => users.register(data))

// server.get("/users/get", function(req, res){
// 	users.lookup(req.query.id)
// 	.then(rows => res.send(rows))
// 	.catch(err => res.send(err))
// })

// // register a new user
// server.post("/register", function(req, res){
// 	if(! server.authenticate(req.headers)) {
// 		res.send("failure, password incorrect")
// 		return
// 	}

// 	console.log(req.body)

// 	var data = {
// 		firstname: 			req.body.firstname,
// 		lastname: 			req.body.lastname,
// 		middlename: 		req.body.middlename,
// 		communitygroup: 	req.body.communitygroup,
// 		accessgroup: 		req.body.accessgroup,
// 		id: 				req.body.id
// 	}

// 	users.register(data)
// 	.then(() => res.send("success"))
// 	.catch(err => res.send(err))
// })
