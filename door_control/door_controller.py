#!/usr/bin/python3

import redis
import time

import logging
import logging_loki

handler = logging_loki.LokiHandler(
	url='10.8.0.15',
	tags={"application", "door-controller"},
)

logger = logging.getLogger('my-logger')
logger.addHandler(handler)

logger.error('service started',
	extra={"tags": {"service": "my-service"}}
)

#import RPi.GPIO as gpio
#gpio.setmode(gpio.BCM)

data = redis.Redis(host='localhost', port=6379, decode_responses=True)
stream = data.pubsub()
stream.subscribe('door-commands')

def open(duration=1):
	data.publish('info', 'opening door')
	time.sleep(duration)
	data.publish('info', 'closing door')

def hold():
	data.publish('info', 'holding door')

def close():
	data.publish('info', 'closing door')

command_list = {
	'open': open,
	'hold': hold,
	'close': close,
}

while True:
	message = stream.get_message()
	if message:
		command = message['data']
		default = lambda : data.publish('info', 'command not recognized: {}'.format(command))
		function = command_list.get(command, default)
		function()
	else:
		time.sleep(0.1)
