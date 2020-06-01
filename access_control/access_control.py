# access control server

import redis
import time
import psycopg2 as postgres

db = postgres.connect(
	user='wjrh',
	password='hogghall',
	host='3.87.55.46',
	port='5432',
	database='wjrh'
)

print('test')

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
stream.subscribe('access-commands')

def request_access(key):
	pass

def register(key, firstname=None, lastname=None, role=None, year=None):
	cursor.execute("""
		INSERT INTO users (
			key, firstname, lastname, role, class	
		)VALUES(
			%s, %s, %s, %s, %s	
		)	
	""", [key, firstname, lastname, role, year])

	db.commit()

register('asdf')

#while True:
#	message = stream.get_message()
#	if message:
#		command = message['data']
#	else:
#		time.sleep(0.1)
