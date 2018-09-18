try {
	var io = require("onoff").Gpio

	//create a reference to the pin that will open the door
	var doorCtrl = new io(4, 'out')

	exports.open = function(){
		console.log("test")
		doorCtrl.writeSync(1) // set the door control pin to HIGH

		// after 500 ms, call a function that returns the door control pin to LOW
		setTimeout(function(){
			doorCtrl.writeSync(0) // set the door control pin to LOW
		}, 500) // here is where the delay is specified, in this case it is 500 ms
	}
} catch (e){
	console.log(e)

	exports.open = function(){
		console.log("opening!!!")
	}
}

// exports.listen = () => (
// 	new Promise((resolve, reject) => {
// 		exports.events.once("scan", id => resolve(id))
// 	})
// )

// var rl = readLine.createInterface({
// 	input: process.stdin,
// 	output: process.stdout
// })

// var read_wrap = function(prompt){
// 	return new Promise((resolve, reject) => {
// 		rl.question(prompt, answer => resolve(answer))
// 	})
// }

// exports.begin = function(){
// 	var data = {}

// 	read_wrap("First Name: ")
// 	.then(answer => data.firstname = answer)
// 	.then(() => read_wrap("Last Name: "))
// 	.then(answer => data.lastname = answer)
// 	.then(()=> read_wrap("Community Group"))
// 	.then(answer => data.communitygroup = answer)
// 	.then(() => read_wrap("Access Group"))
// 	.then(answer => data.accessgroup = answer)
// 	.then(() => console.log(data))
// 	.then(() => read_wrap("Okay (y/n)"))
// 	.then(() => exports.listen())
// 	.then(id => data.id = id)
// 	.then(() => console.log(id))
// 	// read_wrap("Community Group: ", 	answer => data.communitygroup = answer)
// 	// read_wrap("Access Group: ",		answer => data.accessgroup = answer)

// }
