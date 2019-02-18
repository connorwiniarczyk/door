const fetch = require('node-fetch')

const url = "https://api.groupme.com/v3/bots/post"
const bot_id = "6956995d8f9cab3bdc9c386da6" // WJRH-2019 chat
// const bot_id = "cf40fd03f3f763c5d794c97114" // test room

exports.post = function(message){
	return fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST',
		body: JSON.stringify({ bot_id, text: message })
	})
}
