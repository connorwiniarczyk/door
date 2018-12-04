try {
	var io = require("onoff").Gpio

	//create a reference to the pin that will open the door
	var doorCtrl = new io(4, 'out')

	exports.open = function(){
		console.log("opening")
		doorCtrl.writeSync(1) // set the door control pin to HIGH

		// after 500 ms, call a function that returns the door control pin to LOW
		setTimeout(function(){
			doorCtrl.writeSync(0) // set the door control pin to LOW
		}, 500) // here is where the delay is specified, in this case it is 500 ms
	}
} catch (e){
	console.log(e.message)

	if(e.message == "Module did not self-register.") {
		console.log("Program Running in Sandbox Environment")
	}

	exports.open = function(){
		console.log("opening")
	}
}