"""Centralized location for app routes"""
import sqlite3
from flask import Flask, jsonify, request
from flasgger import Swagger

from db_crud.crud_main import crud_main
from db_crud.create import db_create
from db_crud.read import db_read
from db_crud.update import db_update
from db_crud.delete import db_delete

app = Flask(__name__)
Swagger(app)

@app.route('/api/db_query', methods=['GET', 'POST'])
def post_db_query():
    """
    Calls upon crud_main to perform CRUD operations on the database.

    ---
    tags:
      - Database
    parameters:
      - name: action
        in: query
        type: string
        required: true
        description: Action to perform (create, read, update, delete).
      - name: table
        in: query
        type: string
        required: true
        description: The database table to perform the action on.
    responses:
      200:
        description: Operation successful
      400:
        description: Invalid input
    """
    db_result = None
    status_code = None

    if request.method == 'GET':
        db_result, status_code = crud_main(request.args)
    elif request.method == 'POST':
        db_result, status_code = crud_main(request.json)

    return jsonify(db_result), status_code

@app.route('/api/read_users', methods=['POST'])
def login():
    """
    Handle user login by verifying credentials.

    ---
    tags:
      - Users
    parameters:
      - name: username
        in: body
        type: string
        required: true
        description: The username of the user.
      - name: password
        in: body
        type: string
        required: true
        description: The password of the user.
    responses:
      200:
        description: User successfully logged in
      401:
        description: Unauthorized, invalid credentials
    """
    db_result, status_code = db_read('users', request.get_json())
    return jsonify(db_result), status_code

@app.route('/api/create_application', methods=['POST'])
def submit_application():
    """
    Submit a new application.

    ---
    tags:
      - Applications
    parameters:
      - name: user_id
        in: body
        type: integer
        required: true
        description: The ID of the user.
      - name: questionnaire
        in: body
        type: string
        required: true
        description: The questionnaire responses.
      - name: comments
        in: body
        type: string
        required: false
        description: Additional comments for the application.
    responses:
      201:
        description: Application successfully created
      400:
        description: Invalid input
    """
    db_result, status_code = db_create('applications', request.get_json())
    return jsonify(db_result), status_code

@app.route('/api/read_application/<int:application_id>', methods=['GET'])
def check_application(application_id):
    """
    Retrieve details of a specific application by its ID.
    
    ---
    tags:
      - Applications
    parameters:
      - name: application_id
        in: path
        type: integer
        required: true
        description: The ID of the application to retrieve.
    responses:
      200:
        description: Application details retrieved successfully
      404:
        description: Application not found
    """
    db_result, status_code = db_read('applications', {'application_id': application_id})
    return jsonify(db_result), status_code

@app.route('/api/admin/read_logs', methods=['GET'])
def get_error_logs():
    """
    Retrieve error logs from the database.
    
    ---
    tags:
      - Admin
    parameters:
      - name: action
        in: query
        type: string
        required: true
        description: Action to perform (read).
      - name: table
        in: query
        type: string
        required: true
        description: The database table to read from.
    responses:
      200:
        description: Error logs retrieved successfully
      400:
        description: Invalid input
    """
    error_logs, status_code = db_read('error_logs', request.args)
    return jsonify(error_logs), status_code

@app.route('/api/admin/applications/read_form', methods=['GET'])
def get_applications():
    """
    Retrieve applications from the database.

    ---
    tags:
      - Admin
    parameters:
      - name: action
        in: query
        type: string
        required: true
        description: Action to perform (read).
      - name: table
        in: query
        type: string
        required: true
        description: The database table to read from.
    responses:
      200:
        description: Applications retrieved successfully
      400:
        description: Invalid input
    """
    applications, status_code = db_read('applications', request.args)
    return jsonify(applications), status_code

@app.route('/api/admin/applications/delete_form', methods=['DELETE'])
def del_form():
    """
    Delete an application from the database.

    ---
    tags:
      - Admin
    parameters:
      - name: application_id
        in: body
        type: integer
        required: true
        description: The ID of the application to delete.
    responses:
      200:
        description: Application deleted successfully
      400:
        description: Invalid input
    """
    db_result, status_code = db_delete('applications', request.json)
    return jsonify(db_result), status_code

@app.route('/api/admin/applications/update_form', methods=['POST'])
def update_form():
    """
    Update an application in the database.

    ---
    tags:
      - Admin
    parameters:
      - name: application_id
        in: body
        type: integer
        required: true
        description: The ID of the application to update.
      - name: status
        in: body
        type: string
        required: true
        description: The new status of the application.
    responses:
      200:
        description: Application updated successfully
      400:
        description: Invalid input
    """
    status, status_code = db_update('applications', request.json)
    return jsonify(status), status_code

@app.route('/api/admin/pets/create_pet', methods=['POST'])
def add_pet():
    """
    Add a new pet to the database.

    ---
    tags:
      - Pets
    parameters:
      - name: pet_name
        in: body
        type: string
        required: true
        description: The name of the pet.
      - name: breed
        in: body
        type: string
        required: true
        description: The breed of the pet.
      - name: age
        in: body
        type: integer
        required: true
        description: The age of the pet.
    responses:
      201:
        description: Pet added successfully
      400:
        description: Invalid input
    """
    db_result, status_code = db_create('pets', request.json)
    return jsonify(db_result), status_code

@app.route('/api/admin/pets/delete_pet', methods=['DELETE'])
def del_pet():
    """
    Delete a pet from the database.

    ---
    tags:
      - Pets
    parameters:
      - name: pet_id
        in: body
        type: integer
        required: true
        description: The ID of the pet to delete.
    responses:
      200:
        description: Pet deleted successfully
      400:
        description: Invalid input
    """
    db_result, status_code = db_delete('pets', request.json)
    return jsonify(db_result), status_code

@app.route('/api/admin/pets/update_pet', methods=['POST'])
def update_pet():
    """
    Update pet information in the database.

    ---
    tags:
      - Pets
    parameters:
      - name: pet_id
        in: body
        type: integer
        required: true
        description: The ID of the pet to update.
      - name: status
        in: body
        type: string
        required: true
        description: The new status of the pet.
    responses:
      200:
        description: Pet updated successfully
      400:
        description: Invalid input
    """
    status, status_code = db_update('pets', request.json)
    return jsonify(status), status_code

@app.route("/api/create_visit", methods=["POST"])
def create_visit():
    """
    Schedule a visit for a pet.

    ---
    tags:
      - Visits
    parameters:
      - name: pet_id
        in: body
        type: integer
        required: true
        description: The ID of the pet.
      - name: user_id
        in: body
        type: integer
        required: true
        description: The ID of the user.
      - name: visit_time
        in: body
        type: string
        required: true
        format: date-time
        description: The scheduled visit time in ISO 8601 format.
    responses:
      201:
        description: Visit scheduled successfully
      400:
        description: Invalid input
    """
    result, status_code = db_create("visits", request.get_json())
    return jsonify(result), status_code

@app.route("/api/read_visit", methods=["GET"])
def read_visit():
    """
    Retrieve details of a scheduled visit.

    ---
    tags:
      - Visits
    parameters:
      - name: pet_id
        in: query
        type: integer
        required: true
        description: The ID of the pet.
      - name: user_id
        in: query
        type: integer
        required: true
        description: The ID of the user.
    responses:
      200:
        description: Visit details retrieved successfully
      400:
        description: Invalid input
    """
    result, status_code = db_read("visits", request.args)
    return jsonify(result), status_code

@app.route("/api/update_visit", methods=["POST"])
def update_visit():
    """
    Update a scheduled visit.

    ---
    tags:
      - Visits
    parameters:
      - name: visit_id
        in: body
        type: integer
        required: true
        description: The ID of the visit to update.
      - name: visit_time
        in: body
        type: string
        required: true
        format: date-time
        description: The new scheduled visit time.
    responses:
      200:
        description: Visit updated successfully
      400:
        description: Invalid input
    """
    result, status_code = db_update("visits", request.get_json())
    return jsonify(result), status_code

@app.route("/api/delete_visit", methods=["POST"])
def delete_visit():
    """
    Delete a scheduled visit.

    ---
    tags:
      - Visits
    parameters:
      - name: visit_id
        in: body
        type: integer
        required: true
        description: The ID of the visit to delete.
    responses:
      200:
        description: Visit deleted successfully
      400:
        description: Invalid input
    """
    result, status_code = db_delete("visits", request.get_json())
    return jsonify(result), status_code

@app.route("/api/read_pets", methods=["GET"])
def filter_pets():
    """
    Filter pets based on breed, age, and location.

    ---
    tags:
      - Pets
    parameters:
      - name: breed
        in: query
        type: string
        required: false
        description: The breed of the pet.
      - name: age
        in: query
        type: integer
        required: false
        description: The age of the pet.
      - name: location
        in: query
        type: string
        required: false
        description: The location of the pet.
    responses:
      200:
        description: Pets filtered successfully
      400:
        description: Invalid input
    """
    filtered_pets, status_code = db_read("pets", request.args)
    return jsonify(filtered_pets), status_code

@app.route('/api/read_pets/options', methods=['GET'])
def get_pet_filter_options():
    """
    ---
    get:
      summary: Fetch unique options for pet filters
      description: Retrieve distinct characteristics from the pets database to filter with.
      responses:
        200:
          description: A JSON object containing filter options.
          content:
            application/json:
              schema:
                type: object
                properties:
                  species:
                    type: array
                    items:
                      type: string
                    description: List of unique species available in the database.
                  breeds:
                    type: array
                    items:
                      type: string
                    description: List of unique breeds available in the database.
                  statuses:
                    type: array
                    items:
                      type: string
                    description: List of unique adoption statuses.
        500:
          description: Internal server error.
    """
    connection = sqlite3.connect('app_database.db')
    cursor = connection.cursor()

    # Fetch unique options from the database
    cursor.execute("SELECT DISTINCT species FROM pets")
    species = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT DISTINCT breed FROM pets")
    breeds = [row[0] for row in cursor.fetchall() if row[0] is not None]

    cursor.execute("SELECT DISTINCT status FROM pets")
    statuses = [row[0] for row in cursor.fetchall()]

    connection.close()

    return jsonify({
        "species": species,
        "breeds": breeds,
        "statuses": statuses
    }), 200

@app.route('/api/read_pets/breeds', methods=['GET'])
def get_breeds_by_species():
    """
    ---
    get:
      summary: Fetch unique breeds by species
      description: Retrieve a list of unique breeds filtered by a specific species.
      parameters:
        - name: species
          in: query
          required: false
          description: The species to filter breeds by (e.g., Dog, Cat).
          schema:
            type: string
      responses:
        200:
          description: A JSON object containing the list of breeds.
          content:
            application/json:
              schema:
                type: object
                properties:
                  breeds:
                    type: array
                    items:
                      type: string
                    description: List of breeds associated with the given species.
        400:
          description: Bad request. Missing or invalid species parameter.
        500:
          description: Internal server error.
    """
    species = request.args.get('species', None)
    connection = sqlite3.connect('app_database.db')
    cursor = connection.cursor()

    if species:
        # Fetch breeds specific to the given species
        cursor.execute("SELECT DISTINCT breed FROM pets WHERE species = ?", (species,))
    else:
        # Fetch all breeds (if no species is provided, return empty for safety)
        return jsonify({"breeds": []}), 200

    breeds = [row[0] for row in cursor.fetchall() if row[0] is not None]
    connection.close()

    return jsonify({"breeds": breeds}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
