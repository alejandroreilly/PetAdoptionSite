"""
Module for testing app routes.
"""

from app import app

client = app.test_client()

def test_login():
    """
    Test the login route to ensure it returns the expected result.
    """
    client.post('/api/db_query', json={
    'action': 'create',
    'table': 'users',
    'username': 'testuser',
    'password': 'testpassword',
    'data': 'Sample data'
    })

    login_data = {
        "username": "testuser",
        "password": "testpassword"
    }
    response = client.post('/api/read_users', json=login_data)
    assert response.status_code in [200, 401]

    if response.status_code == 200:
        # Check if response contains the expected structure
        assert isinstance(response.json, list)
        assert len(response.json) > 0
        assert 'username' in response.json[0]
        assert 'password' in response.json[0]
        assert response.json[0]['username'] == 'testuser'
        assert response.json[0]['password'] == 'testpassword'
    else:
        assert 'error' in response.json

    client.post('/api/db_query', json={
        'action': 'delete',
        'table': 'users',
        'user_id': 1
    })

def test_submit_application():
    """
    Test the application submission process to validate response and status code.
    """
    application_data = {
        "user_id": 1,
        "questionnaire": "Sample questionnaire content",
        "comments": "Initial comment"
    }
    response = client.post('/api/create_application', json=application_data)
    assert response.status_code in [201, 400]
    if response.status_code == 201:
        assert response.json['message'] == 'success | new entry in applications'
    else:
        assert 'error' in response.json

def test_check_application():
    """
    Test retrieving an application by its ID and validate the response structure and status.
    """
    client.post('/api/db_query', json={
    'action': 'create',
    'table': 'applications',
    'user_id': 1,
    'questionnaire': 'Sample questionnaire content',
    'status': 'meh',
    'last_updated': '12/21/12',
    'comments': 'Initial comment'
    })

    application_id = 1
    response = client.get(f'/api/read_application/{application_id}')
    assert response.status_code in [200, 404]

    if response.status_code == 200:
        # Check if response contains the expected data structure
        assert isinstance(response.json, list)
        assert len(response.json) > 0
        first_entry = response.json[0]
        assert 'application_id' in first_entry
        assert first_entry['application_id'] == 1
        assert 'questionnaire' in first_entry
        assert first_entry['questionnaire'] == 'Sample questionnaire content'
    else:
        assert 'error' in response.json

    client.post('/api/db_query', json={
        'action': 'delete',
        'table': 'applications',
        'user_id': 1
    })
