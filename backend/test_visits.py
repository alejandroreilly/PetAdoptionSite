"""Tests API calls related CRUD operations to the database"""

from app import app


def test_create_visit():
    """Tests scheduling a visit for a pet [POST]"""

    client = app.test_client()

    # Step 1: Send the request to create a visit
    response = client.post('/api/create_visit', json={
        'pet_id': 1,
        'user_id': 1,
        'visit_date': '11-10-2024',
        'visit_time': '15:00:00',
    })

    # Step 2: Check the response for success status and presence of visit_id
    assert response.status_code == 201
    assert response.json['message'] == 'success | new entry in visits'


def test_read_visit():
    """Tests reading an existing visit's details [GET]"""

    client = app.test_client()

    # Step 2: Send a request to read the visit's details
    response = client.get('/api/read_visit', query_string={})

    # Step 3: Check the response for success status and the expected visit details
    assert response.status_code == 200
    assert response.json[0]['pet_id'] == 1
    assert response.json[0]['user_id'] == 1
    assert response.json[0]['visit_date'] == '11-10-2024'
    assert response.json[0]['visit_time'] == '15:00:00'


def test_update_visit():
    """Tests updating an existing visit"""
    client = app.test_client()

    # Step 1: Send the request to update a visit
    response = client.post('/api/update_visit', json={
        'visit_id': 1,
        'visit_date': '11-10-2024',
        'visit_time': '15:00:00'
    })

    # Step 2: Check the response for success status and if entry was updated of a specific visit_id
    assert response.status_code == 200
    assert response.json['message'] == 'success | updated entry in visits'


def test_delete_visit():
    """Tests entry deletion"""

    client = app.test_client()

    # Step 1: Send the request to delete a visit
    response = client.post('/api/delete_visit', json={
        'visit_id': 1,
    })

    assert response.status_code == 200
    assert response.json['message'] == 'success | deleted from visits'

    response = client.post('/api/db_query', json={
        'action': 'read',
        'table': 'visits'
    })
    after_delete = len(response.json)

    # Step 2: Check that the length of the visits table is 0
    assert after_delete == 0
