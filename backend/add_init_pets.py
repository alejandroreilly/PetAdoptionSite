"""Add a pet to the database"""

from db_crud.crud_main import crud_main

def add_pet(name, species, breed, age, status):
    '''Creates a layout to add a new pet to the database for initial searching'''
    # Define the JSON payload for the new pet
    pet_data = {
        "action": "create",
        "table": "pets",
        "user_id": None,  # None for no user associated initially
        "name": name,
        "species": species,
        "breed": breed,
        "age": age,
        "status": status
    }

    # Call the CRUD main function with the provided data
    result, status_code = crud_main(pet_data)

    # Print the result and status for debugging
    print(f"Result: {result}, Status Code: {status_code}")

if __name__ == "__main__":
    add_pet("Wingstop","Bird","cockatoo",17,"Unavailable")
    add_pet("Buddy","Dog","Golden Retriever", 6, "Available")
    add_pet("Fluffy", 'Cat', "Tabby", 1, "Available Soon")
    add_pet("HavenHot", "Bird", "Parrot", 0.5, 'Available')
    add_pet("Gerald", "Snake", "Ball Python", 3, "Available")
    add_pet("Spot", "Dog", "Dalmation", 0.25, "Available")
    add_pet("PolkaDot", "Cat", "Tortoiseshell", 9, "Available")
    add_pet("Michaelangelo", "Turtle", "Red-Eared Slider", 13, "Unavailable")
    add_pet("Rango", "Dog", "Australian Shepherd", 2, "Available")
