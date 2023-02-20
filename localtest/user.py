# Description: This blueprint contains all the routing for user endpoints and resource management.

import json
from flask import jsonify, make_response
from flask import Blueprint, request
import psycopg2
from verify_jwt import verify_jwt, AuthError
from dotenv import load_dotenv
import os

# Load credentials from environmental variables
load_dotenv()

# Blueprint routing
bp = Blueprint('user', __name__, url_prefix='/user')

# == Database Instance  ==
# db = psycopg2.connect(
#     host=os.environ.get('DB_HOST'),
#     port=os.environ.get('DB_PORT'),
#     user=os.environ.get('DB_USER'),
#     password=os.environ.get('DB_PASSWORD'),
#     database=os.environ.get('DATABASE_NAME')
# )
DB_HOST="127.0.0.1"
DB_PORT="5432"
DB_USER="wines"
DB_PASSWORD="test1234"
DATABASE_NAME="winesdatabase"



# == Database Instance  ==
db = psycopg2.connect(
    host=DB_HOST,
    port=DB_PORT,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DATABASE_NAME
)
cursor = db.cursor()


# Description: Error Handler for Auth0/JWT Errors
@bp.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


# Description: Given a user_auth id, this function attempts to retrieve a user from the database;
# if the user doesn't exist, they are created and stored in the database; user data is returned as JSON.
def retrieve_user(user_auth):
    # Confirm that the user exists in the database
    cursor.execute(cursor.mogrify("SELECT * FROM users WHERE user_auth = %s", (user_auth,)))
    query_results = cursor.fetchall()

    # If there is no such user, create one.
    if len(query_results) < 1:
        # Add a new user ot the database.
        cursor.execute(cursor.mogrify(
            "INSERT INTO users(user_auth, location, fav_techsheets, fav_wineries) VALUES (%s, NULL, '[]', '[]')",
            (user_auth,)))
        db.commit()

        # Retrieve the newly-created user from the database.
        cursor.execute(cursor.mogrify("SELECT * FROM users WHERE user_auth = %s", (user_auth,)))
        query_results = cursor.fetchall()

    # Return the user object.
    return {"id": query_results[0][0], "user_auth": query_results[0][1],
            "fav_techsheets": query_results[0][2], "fav_wineries": query_results[0][3],
            "location": query_results[0][4]}


# Description: Given a bottle id, this function retrieves a bottle from the database and returns a JSON object.
def make_returnable_bottle(bottle_id):
    cursor.execute("SELECT * FROM bottle_data WHERE bottle_id = '{}';".format(bottle_id))

    query_results = cursor.fetchall()
    if len(query_results) < 1:
        return {"error": "error"}
    query_results = query_results[0]
    colnames = [desc[0] for desc in cursor.description]

    returnable = {}
    i = 0
    for colname in colnames:
        if colname == "soils" or colname == "varietals" or colname == "clones" \
                or colname == "wine_name":
            returnable[colname] = query_results[i].split(",")
            for j in range(0, len(returnable[colname])):
                returnable[colname][j] = returnable[colname][j].strip()
        else:
            returnable[colname] = query_results[i]
            if isinstance(query_results, str):
                returnable[colname].strip()
        i += 1
    return returnable


# Description: (GET) Retrieves the user's profile information; if the user doesn't exist, they're created.
@bp.route('/', methods=['GET', 'POST', 'DELETE', 'PUT', 'PATCH'])
def user():
    payload = verify_jwt(request)
    user_auth = payload["sub"]
    if request.method == 'GET':
        res = make_response(retrieve_user(user_auth), 200)
        res.headers['Content-Type'] = 'application/json'
        return res

    res = make_response('Invalid Method', 405)
    res.headers['Content-Type'] = 'application/json'
    return res


# Description: (GET) Returns whether-or-not a wine is a favorite (204) or not (404)
# (POST) Adds a wine to the user's favorites (204), (DELETE) Removes a wine from the user's favorites (204),
# All other methods invalid.
@bp.route('/favorites/wines/<int:bottle_id>', methods=['GET', 'POST', 'DELETE', 'PUT', 'PATCH'])
def wines(bottle_id):
    # Verifies the JWT, pulls the user_auth id from the token, and retrieves the user.
    payload = verify_jwt(request)
    user_auth = payload["sub"]
    user_data = retrieve_user(user_auth)


    # Given a user and a wine, return whether-or-not that user has marked that wine as a favorite.
    if request.method == 'GET':
        # Search for the wine and, if found, return 204.
        print("Data: " + str(user_data))
        for bottle in user_data["fav_techsheets"]:
            if bottle["bottle_id"] == bottle_id:
                res = make_response('', 204)
                res.headers['Content-Type'] = 'application/json'
                return res

        # If the wine isn't a favorite, return 404.
        res = make_response('Favorite Not Found', 404)
        res.headers['Content-Type'] = 'application/json'
        return res

    # Adds a favorite wine to the user's list of favorites.
    if request.method == 'POST':
        target_techsheet = make_returnable_bottle(bottle_id)

        # Is the bottle being added already one of the user's favorites?
        for bottle in user_data["fav_techsheets"]:
            if bottle["bottle_id"] == bottle_id:
                res = make_response('', 204)
                res.headers['Content-Type'] = 'application/json'
                return res

        # If not already in the list, add the target techsheet to the user's list of favorite techsheets.
        user_data["fav_techsheets"].append(target_techsheet)
        updated_list = json.dumps(user_data["fav_techsheets"], default = str)

        # Update the user entity.
        cursor.execute(cursor.mogrify("UPDATE users SET fav_techsheets = %s WHERE user_auth = %s",
                                      (updated_list, user_auth)))

        db.commit()
        res = make_response('Added Favorite', 201)
        res.headers['Content-Type'] = 'application/json'
        return res

    # Adds a favorite wine to the user's list of favorites.
    if request.method == 'DELETE':

        target_techsheet = make_returnable_bottle(bottle_id)

        # Create a list that excludes the bottle to be removed.
        updated_list = []
        for bottle in user_data["fav_techsheets"]:
            if bottle["bottle_id"] != bottle_id:
                updated_list.append(bottle)

        # Update the user entity with the new list.
        cursor.execute(cursor.mogrify("UPDATE users SET fav_techsheets = %s WHERE user_auth = %s",
                                      (json.dumps(updated_list), user_auth)))

        db.commit()
        res = make_response('Removed Favorite', 201)
        res.headers['Content-Type'] = 'application/json'
        return res

    res = make_response('Invalid Method', 405)
    res.headers['Content-Type'] = 'application/json'
    return res
