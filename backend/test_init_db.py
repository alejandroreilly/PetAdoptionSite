"""Tests API calls related to CRUD operaations on database"""
import pytest

from app import app

def test_create_entry():
    """Tests entry creation [POST]"""

    client = app.test_client()

    response = client.post('/api/db_query', json={
        'action': 'create',
        'table': 'pets',
        'user_id': None,
        'name': 'Buddy',
        'species': 'golden retriever',
        'breed': 'placeholder',
        'age': 19,
        'status': 'open'
    })
    assert response.status_code == 201
    assert response.json['message'] == 'success | new entry in pets'

def test_read_entry_post():
    """Tests entry read [POST]"""

    client = app.test_client()

    response = client.post('/api/db_query', json={
        'action': 'read',
        'table': 'pets'
    })
    assert response.status_code == 200
    assert len(response.json) > 0
    assert response.json[0]['name'] == 'Buddy'

def test_read_entry_get():
    """Tests entry read [GET]"""

    client = app.test_client()

    response = client.get('/api/db_query', query_string={
        'action': 'read',
        'table': 'pets'
    })
    assert response.status_code == 200
    assert len(response.json) > 0
    assert response.json[0]['name'] == 'Buddy'

def test_read_specific_entry():
    """Tests entry creation with filter [POST]"""

    client = app.test_client()

    response = client.post('/api/db_query', json={
        'action': 'read',
        'table': 'pets',
        'pet_id': 1
    })

    assert response.status_code == 200
    print(response.json)
    assert response.json[0]['name'] == 'Buddy'

def test_update_entry():
    """Tests entry updation"""

    client = app.test_client()

    response = client.post('/api/db_query', json={
        'action': 'update',
        'table': 'pets',
        'pet_id': 1,
        'name': 'Fluffy'
    })
    assert response.status_code == 200
    assert response.json['message'] == 'success | updated entry in pets'

    response = client.post('/api/db_query', json={
        'action': 'read',
        'table': 'pets'
    })
    assert response.json[0]['name'] == 'Fluffy'

def test_delete_entry():
    """Tests entry deletion"""

    client = app.test_client()

    response = client.post('/api/db_query', json={
        'action': 'read',
        'table': 'pets'
    })
    before_delete = len(response.json)

    response = client.post('/api/db_query', json={
        'action': 'delete',
        'table': 'pets',
        'pet_id': 1
    })
    assert response.status_code == 200
    assert response.json['message'] == 'success | deleted from pets'

    response = client.post('/api/db_query', json={
        'action': 'read',
        'table': 'pets'
    })
    after_delete = len(response.json)

    assert after_delete == before_delete - 1

if __name__ == '__main__':
    pytest.main()
