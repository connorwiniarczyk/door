const log = require('./log.js')
const { to } = require('utils')
let io;

const request = function(module){
	const output = new Promise(function(resolve, reject){
		try {
			const result = require(module)
			resolve(result)
		} catch(err) {
			reject(new Error(`Could not register module: ${module}`))
		}
	})

	return to(output)
}

exports.init = async function(){
	[ err, onoff ] = await request('onoff')

	if(err){
		log.warn(err.message)
		exports.open = function(){
			log.info('open door called, but no gpio module is registered')
		}

		return
	}

	const io = onoff.Gpio

	exports.open = function(){
		
	}
}

try {
	io = require("onoff").Gpio

	//create a reference to the pin that will open the door
	const doorCtrl = new io(4, 'out')

	exports.open = function(){
		log.info('opening door')
		doorCtrl.writeSync(1) // set the door control pin to HIGH

		// after 500 ms, call a function that returns the door control pin to LOW
		setTimeout(function(){
			doorCtrl.writeSync(0) // set the door control pin to LOW
		}, 500) // here is where the delay is specified, in this case it is 500 ms
	}
} catch (e) {
	log.warn(e.message)

	exports.open = function(){
		log.info('open door called, but no gpio module is registered')
	}
}