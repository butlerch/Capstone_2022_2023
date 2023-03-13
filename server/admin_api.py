# Description: This blueprint contains all the routing for admin endpoints and resource management.

import json
from flask import jsonify, make_response
from flask import Blueprint, request
import psycopg2
from server.verify_jwt import verify_jwt, AuthError
from dotenv import load_dotenv
import os
import sys
from werkzeug.utils import secure_filename

# Load credentials from environmental variables
load_dotenv()

# Blueprint routing
bp = Blueprint('admin', __name__, url_prefix='/admin')
pdf_pathway = '../frontend/public/pdfs'
pic_pathway = '../frontend/public/pictures'

# == Database Instance  ==
'''db = psycopg2.connect(
    host=os.environ.get('DB_HOST'),
    port=os.environ.get('DB_PORT'),
    user=os.environ.get('DB_USER'),
    password=os.environ.get('DB_PASSWORD'),
    database=os.environ.get('DATABASE_NAME')
)'''
connection = psycopg2.connect(
    host='35.236.118.9',
    port=5432,
    user='butlerch',
    password='wdlJim@2023',
    database='postgres'
)

cursor = connection.cursor()
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Description: Error Handler for Auth0/JWT Errors
@bp.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


def print_psycopg2_exception(err):
    """
    Function to print psycopg2 errors
    Code taken from:
    https://kb.objectrocket.com/postgresql/python-error-handling-with-the-psycopg2-postgresql-adapter-645
    """
    # get details about the exception
    err_type, err_obj, traceback = sys.exc_info()

    # get the line number when exception occured
    line_num = traceback.tb_lineno

    # print the connect() error
    print("\npsycopg2 ERROR:", err, "on line number:", line_num)
    print("psycopg2 traceback:", traceback, "-- type:", err_type)

    # psycopg2 extensions.Diagnostics object attribute
    print("\nextensions.Diagnostics:", err.diag)

    # print the pgcode and pgerror exceptions
    print("pgerror:", err.pgerror)
    print("pgcode:", err.pgcode, "\n")


def make_a_returnable_single_response(query_results, colnames):
    '''
    This function helps build a string for SQL
    '''
    returnable = {}
    i = 0
    for colname in colnames:
        if colname == "soils" or colname == "varietals" or colname == "clones" \
                or colname == "wine_name":
            returnable[colname] = ','.join(query_results[colname].split(","))
        else:
            returnable[colname] = query_results[colname]
            if isinstance(query_results, str):
                returnable[colname].strip()  # TODO: .strip()?
        i += 1
    return returnable


def prep_input(query_results, colnames):
    '''
    This function helps build a json object
    '''
    returnable = {}
    i = 0
    for colname in colnames:
        returnable[colname] = query_results[i]
        if isinstance(query_results, str):
            returnable[colname].strip()  # TODO: .strip()?
        i += 1
    return returnable


@bp.route('/add_wine', methods=['POST'])
def add_wine():
    '''
    Fucntion to setup and run an INSERT query for a new wine to be added
    '''
    # Pull the information to add
    pdf = request.files['file']
    filename = secure_filename(pdf.filename)
    data = json.loads(request.form['technicalForm'])
    if allowed_file(pdf.filename) and os.path.exists(filename) is False:
        pdf.save(os.path.join(pdf_pathway, filename))

    # Check for empty strings
    for keys in data:
        if data[keys] == '':
            data[keys] = 'NULL'

    colnames = []
    for keys in data:
        colnames.append(keys)
    cleaned = make_a_returnable_single_response(data, colnames)

    winery_name, winery_id, year, wine_name, pct_alc, ta, ph, soils,\
        varietals, clones, clusters, aging_process, cases_prod = cleaned.values()

    cases_prod = int(cases_prod)

    try:
        cursor.execute(cursor.mogrify("INSERT INTO bottle_data (winery_name,"
        " winery_id, year, wine_name, pct_alcohol, ta, ph, soils, varietals,"
        " clones, clusters, aging_process, cases_produced, source_file) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
        (winery_name, winery_id, year, wine_name, pct_alc, ta, ph, soils,\
        varietals, clones, clusters, aging_process, cases_prod, filename)))
    except psycopg2.Error as err:
        # pass exception to function
        print_psycopg2_exception(err)

        # rollback the previous transaction before starting another
        connection.rollback()
        res = make_response('Query Failed', 422)
        res.headers['Content-Type'] = 'application/json'
        return res

    connection.commit()
    res = make_response('Added New Wine Bottle', 201)
    res.headers['Content-Type'] = 'application/json'
    return res


@bp.route('/edit_wine', methods=['POST'])
def edit_wine():
    '''

    '''
    # Pull the information to add from the request object
    try:
        pdf = request.files['file']
        filename = secure_filename(pdf.filename)
        if allowed_file(pdf.filename) and os.path.exists(filename) is False:
            pdf.save(os.path.join(pdf_pathway, filename))
    except:
        filename = ''

    data = json.loads(request.form['technicalForm'])
    bottle_id = json.loads(request.form['wine_name'])

    # Query current information for the selected wine bottle
    try:
        cursor.execute("SELECT * FROM bottle_data WHERE bottle_id  = '{}';".format(bottle_id))
    except psycopg2.Error as err:
        # pass exception to function
        print_psycopg2_exception(err)

        # rollback the previous transaction before starting another
        connection.rollback()
        res = make_response('Query Failed', 422)
        res.headers['Content-Type'] = 'application/json'
        return res

    results = cursor.fetchall()

    # Prep and clean the data from both the request and the current data
    colnames = [desc[0] for desc in cursor.description]
    cleaned_results = prep_input(results[0], colnames)

    colnames = []
    for keys in data:
        colnames.append(keys)
    cleaned = make_a_returnable_single_response(data, colnames)

    # Check for empty strings and replace with what is currently in the database
    i = 0
    for keys in cleaned:
        if cleaned[keys] == '':
            cleaned[keys] = cleaned_results[keys]
        i += 1

    if filename == '':
        filename = cleaned_results["source_file"]

    # Set variables for SQL query
    winery_name, winery_id, year, wine_name, pct_alc, ta, ph, soils,\
        varietals, clones, clusters, aging_process, cases_prod = cleaned.values()

    cases_prod = int(cases_prod)

    try:
        cursor.execute(cursor.mogrify("UPDATE bottle_data "
        "SET winery_name = %s,"
        "winery_id = %s," 
        "year = %s," 
        "wine_name = %s," 
        "pct_alcohol = %s," 
        "ta = %s," 
        "ph = %s," 
        "soils = %s," 
        "varietals = %s,"
        "clones = %s," 
        "clusters = %s," 
        "aging_process = %s," 
        "cases_produced = %s," 
        "source_file = %s"
        "WHERE bottle_id = %s;",
        (winery_name, winery_id, year, wine_name, pct_alc, ta, ph, soils,
            varietals, clones, clusters, aging_process, cases_prod, filename,
            bottle_id)))
    except psycopg2.Error as err:
        # pass exception to function
        print_psycopg2_exception(err)

        # rollback the previous transaction before starting another
        connection.rollback()
        res = make_response('Query Failed', 422)
        res.headers['Content-Type'] = 'application/json'
        return res

    connection.commit()
    res = make_response('Added New Wine Bottle', 201)
    res.headers['Content-Type'] = 'application/json'
    return res


@bp.route('/add_winery', methods=['POST'])
def add_winery():
    '''

    '''
    # Pull the information to add
    pdf = request.files['file']
    filename = secure_filename(pdf.filename)
    data = json.loads(request.form['technicalForm'])
    if allowed_file(pdf.filename) and os.path.exists(filename) is False:
        pdf.save(os.path.join(pic_pathway, filename))

    # Check for empty strings
    for keys in data:
        if data[keys] == '':
            data[keys] = 'NULL'

    colnames = []
    for keys in data:
        colnames.append(keys)
    cleaned = make_a_returnable_single_response(data, colnames)

    winery_name, winemaker, address, city, state, zipcode, phone_number,\
        website, bio = cleaned.values()

    print((cleaned, filename))

    try:
        cursor.execute(cursor.mogrify("INSERT INTO winery_data (winery_name,"
        " winemaker, address, city, state, zipcode, phone_number, winery_bio, winery_url,"
        " winery_picture) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);",
        (winery_name, winemaker, address, city, state, zipcode, phone_number,\
        bio, website, filename)))
    except psycopg2.Error as err:
        # pass exception to function
        print_psycopg2_exception(err)

        # rollback the previous transaction before starting another
        connection.rollback()
        res = make_response('Query Failed', 422)
        res.headers['Content-Type'] = 'application/json'
        return res

    connection.commit()
    res = make_response('Added New Winery', 201)
    res.headers['Content-Type'] = 'application/json'
    return res

@bp.route('/edit_winery', methods=['POST'])
def edit_winery():
    '''

    '''
    # Pull the information to add
    try:
        png = request.files['file']
        filename = secure_filename(png.filename)
        if allowed_file(png.filename) and os.path.exists(filename) is False:
            png.save(os.path.join(pic_pathway, filename))
    except:
        filename = ''

    data = json.loads(request.form['technicalForm'])

    # Query current informtion for the selected wine bottle
    try:
        cursor.execute("SELECT * FROM winery_data WHERE winery_name  = '{}';".format(data["winery_name"]))
    except psycopg2.Error as err:
        # pass exception to function
        print_psycopg2_exception(err)

        # rollback the previous transaction before starting another
        connection.rollback()
        res = make_response('Query Failed', 422)
        res.headers['Content-Type'] = 'application/json'
        return res

    results = cursor.fetchall()
    colnames = [desc[0] for desc in cursor.description]
    cleaned_results = prep_input(results[0], colnames)

    colnames = []
    for keys in data:
        colnames.append(keys)
    cleaned = make_a_returnable_single_response(data, colnames)

    # Check for empty strings and replace with what is currently in the database
    i = 0
    for keys in cleaned:
        if cleaned[keys] == '':
            cleaned[keys] = cleaned_results[keys]
        i += 1

    if filename == '':
        filename = cleaned_results["winery_picture"]

    winery_name, winemaker, address, city, state, zipcode, phone_number,\
        website, bio = cleaned.values()

    print((cleaned, filename))

    try:
        cursor.execute(cursor.mogrify(
            "UPDATE winery_data "
            "SET  winemaker = %s,"
            "address = %s,"
            "city = %s,"
            "state = %s,"
            "zipcode = %s,"
            "phone_number = %s,"
            "winery_bio = %s,"
            "winery_url = %s,"
            "winery_picture = %s"
            "WHERE winery_name = %s;",
        (winemaker, address, city, state, zipcode, phone_number,\
        bio, website, filename, winery_name)))
    except psycopg2.Error as err:
        # pass exception to function
        print_psycopg2_exception(err)

        # rollback the previous transaction before starting another
        connection.rollback()
        res = make_response('Query Failed', 422)
        res.headers['Content-Type'] = 'application/json'
        return res

    connection.commit()
    res = make_response('Added New Winery', 201)
    res.headers['Content-Type'] = 'application/json'
    return res