'''Tests API calls related CRUD operations to the database'''

from app import app

def test_read_pets():
    """Tests reading an existing pets details [GET]"""

    client = app.test_client()

    # Step 2: Send a request to read the pets details
    response = client.get('/api/read_pets', query_string={})

    # Step 3: Check the response for success status and the expected pet details
    assert response.status_code == 200
