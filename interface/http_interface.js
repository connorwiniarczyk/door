var express = require("express")
var app = express()
var http = require("http").Server(app)
const fetch = require('node-fetch')
const log = require('../log.js')
var path = require("path")

const bodyParser = require('body-parser')

app.use(bodyParser.json())

// const remote_url = "http://45.55.38.183:4002/log"
const watchdog_url = "http://45.55.38.183:4002/log"

// continuously let the monitor server know that we are still alive
const heartbeat = async function(){
	fetch(watchdog_url, {
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		method: "POST",
		body: JSON.stringify({ event: "HEARTBEAT", data: "", sender: "DOOR" })
	})
	.then(() => setTimeout(heartbeat, 1000))
	.catch(() => console.log("Could not connect to remote"))
}

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

	app.post("/register", async function(req, res){
		program.emit('register', req.body)
	})

	app.listen(port)
	log.info(`listening on port ${port}`)

	heartbeat()
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