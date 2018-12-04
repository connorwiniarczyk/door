var door = require("./door_control.js")
var server = require("./server.js")
var users = require("./users.js")
var log = require("./log.js")

door.open()

// Comment out to disable force_open functionality
server.on("force_open", () => door.open())

server.on("scan", function(id){
	users.lookup(id)
	.then(function(row){
		console.log(row)
		if(row[0].accessgroup == "dj" || row[0].accessgroup == "admin") door.open()
	})
	.catch(err => console.log(err))
})

server.on("register", data => users.register(data))

server.get("/users/get", function(req, res){
	users.lookup(req.query.id)
	.then(rows => res.send(rows))
	.catch(err => res.send(err))
})

// register a new user
server.post("/register", function(req, res){
	if(! server.authenticate(req.headers)) {
		res.send("failure, password incorrect")
		return
	}

	console.log(req.body)

	var data = {
		firstname: 			req.body.firstname,
		lastname: 			req.body.lastname,
		middlename: 		req.body.middlename,
		communitygroup: 	req.body.communitygroup,
		accessgroup: 		req.body.accessgroup,
		id: 				req.body.id
	}

	users.register(data)
	.then(() => res.send("success"))
	.catch(err => res.send(err))
})
