#!/usr/bin/python3

import redis
import time
import psycopg2 as postgres
import json

db = postgres.connect(
	user='wjrh',
	password='hogghall',
	host='3.87.55.46',
	port='5432',
	database='wjrh'
)

# setup the database
cursor = db.cursor()
cursor.execute("""
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		key VARCHAR(255) NOT NULL UNIQUE,
		firstname VARCHAR(255),
		lastname VARCHAR(255),
		role VARCHAR(255),
		class VARCHAR(255)
	)		
""")

db.commit()

data = redis.Redis(host='localhost', port=6379, decode_responses=True)
stream = data.pubsub()
stream.subscribe('register')
stream.subscribe('scan')

def request_access(key):
	cursor.execute("""
		SELECT * FROM users WHERE key = %s
	""", [key])

	result = cursor.fetchall()

	if len(result) == 1:
		data.publish('info', 'success, opening door')
		data.publish('door-commands', 'open')
	else:
		data.publish('info', 'failure, key not in system')

def register(user_info):
	key = user_info.get('key', None)
	firstname = user_info.get('firstname', None)
	lastname = user_info.get('lastname', None)
	role = user_info.get('role', None)
	class_year = user_info.get('class', None)

	try:
		cursor.execute("""
			INSERT INTO users (
				key, firstname, lastname, role, class	
			)VALUES(
				%s, %s, %s, %s, %s	
			)	
		""", [key, firstname, lastname, role, class_year])

		db.commit()
		data.publish('info', 'registered user')
	except Exception as error:
		print('database error')
		data.publish('info', 'database error: {}'.format(error))

while True:
	message = stream.get_message()
	if message and message.get('type') == 'message':

		if message.get('channel') == 'register':
			register(json.loads(message.get('data')))
		elif message.get('channel') == 'scan':
			request_access(message.get('data'))

	else:
		time.sleep(0.1)
