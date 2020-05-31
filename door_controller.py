import redis
import time

#import RPi.GPIO as gpio
#gpio.setmode(gpio.BCM)

data = redis.Redis(host='localhost', port=6379, decode_responses=True)
stream = data.pubsub()
stream.subscribe('door-commands')

def open(duration=1):
	print('opening')
	pass

def hold():
	pass

def close():
	pass

command_list = {
	'open': open,
	'hold': hold,
	'close': close,
}

while True:
	message = stream.get_message()
	if message:
		command = message['data']
		default = lambda : print('command not recognized')
		function = command_list.get(command, default)
		function()
	else:
		time.sleep(0.1)
