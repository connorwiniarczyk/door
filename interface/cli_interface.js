const cli = require("commander")
const eventHandler = require('events')

exports.listen = function(program){
	// events = event

	cli
	.version('1.0.0')
	.command('list') // display a list of users
	.action(async function(){
		program.emit('list_users', function(result){
			result.forEach(row => {
				// display the information in a human readable format
				const { firstname, lastname, communitygroup, id } = row
				const result_pretty = `${firstname} ${lastname}, [${communitygroup}]: ${id}`
				console.log(result_pretty)
			})
		})
	})

	cli
	.command('open')
	.action(async function(){
		// tell the program to open the door
		program.emit('open_door')
	})

	cli
	.command('begin')
	.option('-p, --port [port]', 'Specify the port to run the server on [80]', '80')
	.action(async function(cmd){
		const port = parseInt(cmd.port)
		// server.listen(8000)
	})

	cli.parse(process.argv)
}

// exports.use = function(eventHandler){
// 	events = eventHandler
// 	events.on('test', () => console.log('test'))
// }
