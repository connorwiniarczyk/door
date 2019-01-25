const bunyan = require('bunyan')
const prettyStream = require('bunyan-prettystream')

const out_pretty = new prettyStream
out_pretty.pipe(process.stdout)

const log = bunyan.createLogger({
	name: "door",
	streams: [{
		level: 'debug',
		type: 'raw',
		stream: out_pretty
	}]
})

module.exports = log