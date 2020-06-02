#!/usr/bin/python3
import redis
import argparse
import time
import json

# configure redis
data = redis.Redis(host='localhost', port=6379, decode_responses=True)
stream = data.pubsub()
stream.subscribe('info')

def wait_for_message():

	elapsed_time = 0
	timeout_duration = 1

	while True:
		message = stream.get_message()
		if message and message.get('type') == 'message':
			return message
		else:
			time.sleep(0.01)
			elapsed_time += 0.01
			if elapsed_time > timeout_duration:
				return 

parser = argparse.ArgumentParser(description='door')
subparsers = parser.add_subparsers(help='sub-command help')

# open
def open(arguments):
	print(arguments)
	data.publish('door-commands', 'open')
	result = wait_for_message()
	print(result.get('data'))

parser_open = subparsers.add_parser('open', help='open the door')
parser_open.add_argument(
	'--duration',
	metavar = '-d',
	help = 'how long to keep the door open before closing it again'
)
parser_open.set_defaults(func=open)

# hold
def hold(duration=1):
	data.publish('door-commands', 'hold')
	result = wait_for_message()
	print(result.get('data'))

parser_hold = subparsers.add_parser('hold', help='hold the door open indefinitely')
parser_hold.set_defaults(func=hold)

# close
def close(duration=1):
	data.publish('door-commands', 'close')
	result = wait_for_message()
	print(result.get('data'))

parser_close = subparsers.add_parser('close', help='close the door')
parser_close.set_defaults(func=close)

def register(args):
	values = {}
	values['firstname'] = input('First Name: ')
	values['lastname'] = input('Last Name: ')
	values['class']  = input('Class: ')
	values['key'] = input('key: ')

	data.publish('register', json.dumps(values))

	print(wait_for_message())


parser_register = subparsers.add_parser('register')
parser_register.set_defaults(func=register)

def request_access(args):
	key = vars(args).get('key')
	data.publish('scan', key)
	print(wait_for_message())

parser_scan = subparsers.add_parser('scan')
parser_scan.add_argument('key')
parser_scan.set_defaults(func=request_access)

args = parser.parse_args()
args.func(args)
