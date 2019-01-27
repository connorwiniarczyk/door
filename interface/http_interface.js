var express = require("express")
var app = express()
var http = require("http").Server(app)

const log = require('../log.js')

var path = require("path")

exports.listen = function(program, port){
	var bodyParser = require("body-parser")
	app.use(bodyParser.json()); // support json encoded bodies
	app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

	app.get("/", function(req, res){
		res.sendFile( path.join(__dirname, "public/index.html") );
	});

	app.get("/esp", function(req, res){
		program.emit('scan', req.query.id)
		res.send('success')
	})

	app.get("/scanner/next", async function(req, res){
		const scan = await program.next('scan')
		res.send(scan)
	})

	app.listen(port)
	log.info(`listening on port ${port}`)

	// log.begin_heartbeat()
}

// // interface used by the scanner to communicate scanned id's with server
// app.get("/esp", function(req, res){
// 	exports.events.emit("scan", req.query.id)
// 	res.send("success")
// })

// // wait until the next device is scanned and send it's id
// app.get("/scanner/next", function(req, res){
// 	exports.events.once("scan", id => res.send(id))
// })

// app.get("/door/force_open", function(req, res){
// 	exports.events.emit("force_open")
// 	res.send("opening door")
// })

app.use("/", express.static("public"));
// const server = app.listen(8000);