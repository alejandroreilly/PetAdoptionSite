"""Add a pet to the database"""

from db_crud.create import db_create

def add_user():
    '''Creates a layout to add a new pet to the database for initial searching'''
    # Define the JSON payload for the new pet
    app_data = {
    'username': 'testuser',
    'password': 'testpassword',
    'data': 'Sample data'
    }

    # Call the CRUD main function with the provided data
    result, status_code = db_create('users',app_data)

    # Print the result and status for debugging
    print(f"Result: {result}, Status Code: {status_code}")

if __name__ == "__main__":
    add_user()
