"""Add a pet to the database"""

from db_crud.create import db_create

def add_visit():
    '''Creates a layout to add a new pet to the database for initial searching'''
    # Define the JSON payload for the new pet
    visit_data = {
        'pet_id': 1,
        'user_id': 1,
        'visit_time': '(9:00:00)',
        'visit_date': '12/14/24',
    }

    # Call the CRUD main function with the provided data
    result, status_code = db_create('visits', visit_data)

    # Print the result and status for debugging
    print(f"Result: {result}, Status Code: {status_code}")

if __name__ == "__main__":
    add_visit()
