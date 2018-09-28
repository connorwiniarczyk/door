var fs = require("fs")

var path = "./public/log.txt"

module.exports = function(data){
	var text = "id: " + data

	console.log(text)
	fs.writeFile(path, text, () => {})
}