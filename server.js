var express = require("express")
var app = express()
var http = require("http").Server(app)

var path = require("path")
var events = require("events")

exports.events = new events()
exports.on = exports.events.on.bind(exports.events)

exports.get = app.get.bind(app)
exports.post = app.post.bind(app)

var bodyParser = require("body-parser")
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

exports.authenticate = function(headers){
	return headers.password_hash == "iheartbengordon"
}

app.get("/", function(req, res){
	res.sendFile( path.join(__dirname, "public/index.html") );
});

// interface used by the scanner to communicate scanned id's with server
app.get("/esp", function(req, res){
	exports.events.emit("scan", req.query.id)
	res.send("success")
})

// wait until the next device is scanned and send it's id
app.get("/scanner/next", function(req, res){
	exports.events.once("scan", id => res.send(id))
})

app.use("/", express.static("public"));
const server = app.listen(80);