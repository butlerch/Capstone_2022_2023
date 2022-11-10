import string
import psycopg2
from flask import Flask, jsonify, request, abort, Response, make_response
import re
from server.user import user
from authlib.integrations.flask_client import OAuth

# create flask app
from flask_cors import CORS

app = Flask(__name__)
# Handles cross-origin routing between the frontend & backend
CORS(app)

# == Setup Auth0 ==
oauth = OAuth(app)
DOMAIN = 'winedatalake.us.auth0.com'
ALGORITHMS = ["RS256"]
CLIENT_ID = 'Nncz6b9skBCCAkyR4AFUyEdct3URx5Kd'
CLIENT_SECRET = 'aF3LnZv!&W@CB*@JZhTR8k7ZPT3gBGqvNdGmyJLspA#9T6hLJx59&pvAZ6'
SCOPE = "read:users"

auth0 = oauth.register(
    'auth0',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    api_base_url="https://" + DOMAIN,
    access_token_url="https://" + DOMAIN + "/oauth/token",
    authorize_url="https://" + DOMAIN + "/authorize",
    client_kwargs={
        'scope': "openid profile email",
    },
)

# Connection information for the database
connection = psycopg2.connect(
    host='database-1.cy2oippu9yih.us-west-2.rds.amazonaws.com',
    port=5432,
    user='postgres',
    password='ostate4826',
    database='postgres'
)

cursor = connection.cursor()
query_string = "SELECT * FROM bottle_data"
cursor.execute(query_string)
query_results = cursor.fetchall()
print(query_results)

# testing
