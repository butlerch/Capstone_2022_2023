# Description: API entrypoint; contains all the functionality for accessing the database.
import json
import string
import psycopg2
from flask import Flask, jsonify, request, abort, Response, make_response
from verify_jwt import verify_jwt, AuthError
import re
import user
import admin_api
from authlib.integrations.flask_client import OAuth
import os
from dotenv import load_dotenv
from flask_cors import CORS
# import secrets

# Load credentials from environmental variables
load_dotenv()

# Create Flask App
app = Flask(__name__)

# Handles cross-origin resource sharing between the frontend & backend
CORS(app)

# == Setup Auth0 ==
oauth = OAuth(app)
auth0 = oauth.register(
    'auth0',
    client_id=os.environ.get('AUTH_CLIENT_ID'),
    # client_secret=secrets.access_secret_version('AUTH_CLIENT_SECRET', 1),
    api_base_url="https://" + os.environ.get('AUTH_DOMAIN'),
    access_token_url="https://" + os.environ.get('AUTH_DOMAIN') + "/oauth/token",
    authorize_url="https://" + os.environ.get('AUTH_DOMAIN') + "/authorize",
    client_kwargs={
        'scope': "openid profile email",
    },
)

#== Database Instance  ==
'''db = psycopg2.connect(
    host=os.environ.get('DB_HOST'),
    port=os.environ.get('DB_PORT'),
    user=os.environ.get('DB_USER'),
    password=os.environ.get('DB_PASSWORD'),
    database=os.environ.get('DATABASE_NAME')
)'''

# For debugging Database connection issues
db = psycopg2.connect(
    host = '35.236.118.9',
    port = 5432,
    user = 'butlerch',
    password = 'wdlJim@2023',
    database = 'postgres'
)
# if(db):
#     print('db == ',)
cursor = db.cursor()

# Registers the route for the User Entity (located in user.py)
app.register_blueprint(user.bp)
app.register_blueprint(admin_api.bp)


def make_a_returnable_single(query_results, colnames, num_bottles):
    '''
    This function helps build a json object
    '''
    returnable = {}
    i = 0
    for colname in colnames:
        if colname == "soils" or colname == "varietals" or colname == "clones" \
                or colname == "wine_name":
            returnable[colname] = query_results[i].split(",")
            for j in range(0, len(returnable[colname])):  # TODO: .strip()?
                returnable[colname][j] = returnable[colname][j].strip()
        else:
            returnable[colname] = query_results[i]
            if isinstance(query_results, str):
                returnable[colname].strip()  # TODO: .strip()?
        i += 1
    returnable["total_sheets"] = num_bottles
    return returnable


def make_a_returnable_multiple(query_results, colnames):
    '''
    This function helps build a json object
    '''

    cursor.execute("SELECT COUNT(*) FROM bottle_data;")
    num_bottles = int(cursor.fetchall()[0][0])
    returnable = []
    for query_result in query_results:
        nth_returnable = make_a_returnable_single(
            query_result, colnames, num_bottles)
        returnable.append(nth_returnable)
    return jsonify(returnable)


def search_endpoint_query_builder(query_substring, list_of_vars,
                                  num_quals):  # TODO: will need another set of eyes to help me figure out how to make this one faster
    query_string = ""
    if list_of_vars:
        if num_quals > 0:
            query_string += " AND"
        query_string += " ("
        query_string += query_substring.format(
            list_of_vars[0], list_of_vars[0], list_of_vars[0], list_of_vars[0],
            list_of_vars[0], list_of_vars[0], list_of_vars[0])
        if len(list_of_vars) > 1:
            for idx in range(1, len(list_of_vars)):
                query_string += " OR " + query_substring.format(
                    list_of_vars[idx], list_of_vars[idx])
        num_quals = + 1
        query_string += ")"
    return num_quals, query_string


@app.route('/', methods=['GET'])
def home():
    return '''
            hello, world
            '''


@app.route('/search',
           methods=['GET'])  # TODO: will need another set of eyes to help me figure out how to make this one faster
def search():
    '''
    This function returns a bottle data based on search parameters. If none are
    specified, it returns everything in the table
    url params: bottleId, wineryName, soils, year, varietals
    variables:
    '''
    bottle_id = request.args.getlist('bottleId')
    winery_name = request.args.getlist('wineryName')
    soils = request.args.getlist('soils')
    year = request.args.getlist('year')
    varietals = request.args.getlist('varietals')
    keywords = request.args.getlist('keywords')

    params_exist = False
    if bottle_id or winery_name or soils or year or varietals or keywords:
        params_exist = True

    if keywords[0] == 'undefined':
        keywords[0] = ''

    query_string = "SELECT * FROM bottle_data"

    if params_exist:
        query_string += " WHERE"

    num_quals = 0

    num_quals, substring = search_endpoint_query_builder(
        "bottle_id = '{}'", bottle_id, num_quals)
    query_string += substring

    num_quals, substring = search_endpoint_query_builder(
        "winery_name ILIKE '{}'", winery_name, num_quals)
    query_string += substring

    num_quals, substring = search_endpoint_query_builder(
        "soils ILIKE '%{}%'", soils, num_quals)
    query_string += substring

    num_quals, substring = search_endpoint_query_builder(
        "year = '{}'", year, num_quals)
    query_string += substring

    num_quals, substring = search_endpoint_query_builder(
        "(varietals ILIKE '%{}%' OR wine_name ILIKE '%{}%')",
        varietals, num_quals)
    query_string += substring

    '''
    Search in columns: winery_name, wine_name, year, varietals, soils, clones,
    aging_process
    '''
    num_quals, substring = search_endpoint_query_builder(
        "(winery_name ILIKE '%{}%' OR wine_name ILIKE '%{}%' OR year ILIKE \
        '%{}%' OR varietals ILIKE '%{}%') OR soils ILIKE '%{}%' OR clones \
        ILIKE '%{}%' OR aging_process ILIKE '%{}%' ", keywords, num_quals)
    query_string += substring

    query_string += ";"

    cursor.execute(query_string)

    query_results = cursor.fetchall()
    if len(query_results) < 1:
        abort(404)
    colnames = [desc[0] for desc in cursor.description]
    return make_a_returnable_multiple(query_results, colnames)


@app.route('/random', methods=['GET'])
def random_bottle_data():
    '''
    This function returns a random row from the bottle_data table.
    url params: quantity
    variables: <none>, int
    '''

    quantity = request.args.get('quantity')
    if not quantity:
        quantity = 1

    cursor.execute(
        "SELECT * FROM bottle_data TABLESAMPLE BERNOULLI (100) ORDER BY random() LIMIT {};"
        .format(quantity))
    query_results = cursor.fetchall()
    if len(query_results) < 0:
        abort(404)
    colnames = [desc[0] for desc in cursor.description]
    return make_a_returnable_multiple(query_results, colnames)


@app.route('/techsheets/<int:bottle_id>', methods=['GET'])
def techsheets_by_id(bottle_id):
    '''
    This function returns a row of bottle data by bottle_id
    '''

    cursor.execute(
        "SELECT * FROM bottle_data WHERE bottle_id = '{}';".format(bottle_id))
    query_results = cursor.fetchall()

    if len(query_results) != 1:
        abort(404)
    query_results = query_results[0]
    colnames = [desc[0] for desc in cursor.description]
    cursor.execute("SELECT COUNT(*) FROM bottle_data;")
    num_bottles = int(cursor.fetchall()[0][0])
    return make_a_returnable_single(query_results, colnames, num_bottles)


@app.route('/bottleData', methods=['GET'])
def return_bottle_data():
    '''
    This function returns specified number of bottle data entries in the
    bottle_data table
    url params: quantity
    values: "all", int
    '''
    quantity = request.args.get('quantity')
    if not quantity:
        quantity = 'all'
    if quantity == 'all':
        cursor.execute("SELECT * FROM bottle_data;")
    else:
        quantity = int(quantity)
        cursor.execute(
            "SELECT * FROM bottle_data LIMIT '{}';".format(quantity))
    query_results = cursor.fetchall()
    if len(query_results) < 1:
        abort(404)
    colnames = [desc[0] for desc in cursor.description]
    return make_a_returnable_multiple(query_results, colnames)


@app.route('/bottleDataByWinery', methods=['GET'])
def sort_by_winery_name():
    '''
    This function returns all bottle data in the bottle_data table belonging to
    a specific winery
    url params: wineryName
    values: ["Alloro","Anne Amie","Archery Summit","Boedecker","Ken Writght
    Cellars","Minimus","Omero","Origin"]
    '''

    winery_name = request.args.get('wineryName')
    if not winery_name:
        abort(404)
    cursor.execute(
        "SELECT * FROM bottle_data WHERE winery_name ILIKE '{}';"
        .format(winery_name))
    query_results = cursor.fetchall()
    if len(query_results) < 1:
        abort(404)
    colnames = [desc[0] for desc in cursor.description]
    return make_a_returnable_multiple(query_results, colnames)


@app.route('/bottleDataBySoilType', methods=['GET'])
def sort_by_soil_type():
    '''
    This function returns all bottle data in the bottle_data table having to a
    specific soil type
    url params: soils
    values:
    '''

    soils = request.args.get('soils')
    if not soils:
        abort(404)
    soils = "%" + soils + "%"
    cursor.execute(
        "SELECT * FROM bottle_data WHERE soils ILIKE '{}';".format(soils))
    query_results = cursor.fetchall()
    if len(query_results) < 1:
        abort(404)
    colnames = [desc[0] for desc in cursor.description]
    return make_a_returnable_multiple(query_results, colnames)


@app.route('/bottleDataByYear', methods=['GET'])
def sort_by_year():
    '''
    This function returns all bottle data in the bottle_data table made in a
    specific year
    url params: year
    values:
    '''

    year = request.args.get('year')
    if not year:
        abort(404)
    cursor.execute("SELECT * FROM bottle_data WHERE year = '{}';".format(year))
    query_results = cursor.fetchall()
    if len(query_results) < 1:
        abort(404)
    colnames = [desc[0] for desc in cursor.description]
    return make_a_returnable_multiple(query_results, colnames)


@app.route('/bottleDataByVarietal', methods=['GET'])
def sort_by_varietal():
    '''
    This function returns all bottle data in the bottle_data table that contain
    a specific varietal
    url params: varietals
    values: ["Auxerrois","Baco Noir","Barbera","Black Muscat","Cab Sauvignon",
    "Cabernet Franc","Cabernet Sauvignon","Canadice","Canelli","Carmenere",
    "Chardonnay","Chenin Blanc","Cinsault","Counoise","Dolcetto","Gamay
    Beaujolais","Gamay Noir","Gew\u00fcrztraminer","Graciano","Grenache",
    "Gr\u00fcner Veltliner","Lemberger","Malbec","Marechal Foch","Marsanne",
    "Melon","Melon de Bourgogne","Merlot","Montepulciano","Morio Muskat",
    "Mourvedre","M\u00fcller-Thurgau","Muscadelle","Muscat","Muscat Canelli",
    "Muscat Ottonel","Nebbiolo","Orange Muscat","Petit Verdot","Petite Sirah",
    "Pinot Blanc","Pinot Gris","Pinot Meunier","Pinot Noir","Pinotage",
    "Primitivo","Riesling","Roussanne","Royalty","Sangiovese","Sauvignon
    Blanc","Semillon","Siegerrebe","Syrah","Tannat","Tempranillo","Touriga
    Nacional","Vermentino","Viognier","Zinfandel"]
    '''

    varietals = request.args.get('varietals')
    if not varietals:
        abort(404)
    if varietals.caseful() == "Pinot Gouges":
        varietals = "Pinot “Gouges"
    varietals = "%" + varietals + "%"
    cursor.execute(
        "SELECT * FROM bottle_data WHERE varietals ILIKE '{}' \
            OR wine_name ILIKE '{}';".format(varietals, varietals))
    query_results = cursor.fetchall()
    if len(query_results) < 1:
        abort(404)
    colnames = [desc[0] for desc in cursor.description]
    return make_a_returnable_multiple(query_results, colnames)


@app.route('/varietalNames', methods=['GET'])
def varietal_names_in_bottle_data():
    '''
    A specific route to pull varietal names
    '''
    returnable = []

    cursor.execute("SELECT DISTINCT wine_name, varietals FROM bottle_data;")
    query_results = cursor.fetchall()
    for query_result in query_results:
        varietals = re.split(',|and', query_result[0]) + re.split(',|and', query_result[1])
        for varietal in varietals:
            varietal = re.sub("[0-9]%*", "", varietal)
            # Remove forward/backward curly quotes
            varietal = re.sub("\“", "", varietal)
            varietal = re.sub("\”", "", varietal)
            varietal = string.capwords(varietal, " ")
            varietal = varietal.strip();
            if varietal not in returnable and varietal != "NULL" and varietal != "Null" and len(varietal) > 0:
                returnable.append(varietal.strip())
    return jsonify({"varietals": returnable})


@app.route('/listOfWineries', methods=['GET'])
def list_of_wineries():
    '''
    A specific route to only pull winery_names
    '''
    cursor.execute("SELECT DISTINCT winery_name FROM bottle_data;")
    query_results = cursor.fetchall()
    if len(query_results) < 1:
        abort(404)
    returnable = [''.join(query_result) for query_result in query_results]
    return jsonify({"wineries": returnable})


@app.route('/bottleNames', methods=['GET'])
def list_of_wine_names():
    '''
    A specific route to only pull wine_names
    '''
    returnable = []
    result = {
        "year": [],
        "winery_name": [],
        "wine_name": []
    }
    cursor.execute("SELECT bottle_id, year, winery_name, wine_name "
                   "FROM bottle_data ORDER BY bottle_id;")
    query_results = cursor.fetchall()
    if len(query_results) < 1:
        abort(404)

    colnames = [desc[0] for desc in cursor.description]
    return make_a_returnable_multiple(query_results, colnames)


###############################################################################
'''
The functions below this line pull data from tables in the db other than the 
bottle_data table.
'''


@app.route('/allVarietalNames', methods=['GET'])
def varietal_names_list():
    '''
    This function returns all varietal names found in the varietal_data table
    '''

    cursor.execute("SELECT varietal_name FROM varietal_data;")
    query_results = cursor.fetchall()
    if len(query_results) < 1:
        abort(404)
    returnable = [query_result[0] for query_result in query_results]
    return jsonify({"varietals": returnable})


@app.route('/wineryInfo', methods=['GET'])
def winery_info():
    '''
    This function returns winery data from the winery_data table belonging to a
    specific winery
    url params: wineryName
    values: ["Alloro","Anne Amie","Archery Summit","Boedecker","Ken Writght
    Cellars","Minimus","Omero","Origin"]
    '''
    winery_name = request.args.get('wineryName')
    if not winery_name:
        abort(404)

    cursor.execute(
        "SELECT * FROM winery_data WHERE winery_name ILIKE '{}';"
        .format(winery_name))
    query_results = cursor.fetchall()
    if len(query_results) != 1:
        abort(404)
    query_results = query_results[0]
    colnames = [desc[0] for desc in cursor.description]
    returnable = {}
    i = 0
    for colname in colnames:
        returnable[colname] = query_results[i]
        i += 1
    return jsonify(returnable)


@app.route('/wineries', methods=['GET'])
def wineries():
    '''
    This function returns all winery names found in the winery_data table
    '''

    cursor.execute("SELECT DISTINCT winery_name FROM winery_data;")
    query_results = cursor.fetchall()
    if len(query_results) < 1:
        abort(404)
    returnable = [''.join(query_result) for query_result in query_results]
    return jsonify({"wineries": returnable})


###############################################################################

@app.errorhandler(404)
def custom_404(error):
    return Response('Invalid request', 404)


# driver function
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
    # app.run(host='localhost', port=8080)

'''
return list of varietals available at each winery
'''
