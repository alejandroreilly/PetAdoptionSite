"""Tests API calls of admin routes"""
import pytest
from app import app

def test_get_logs():
    '''Tests the get_logs api call
    
    creates an error log entry, checks if there, then deletes it
    '''
    client = app.test_client()
    #CREATE ERROR LOG ENTRY
    response = client.post('/api/db_query', json={
        'action': 'create',
        'table': 'error_logs',
        'error_id': 1,
        'timestamp': '2024',
        'error_message': 'test',
        'severity_level': 999,
        'user_id': 999
    })
    before_delete = len(response.json)

    response = client.get('/api/admin/read_logs', query_string={})
    assert response.status_code == 200
    assert len(response.json) > 0
    assert response.json[0]['error_id'] == 1

    #DELETE ERROR LOG ENTRY
    response = client.post('/api/db_query', json={
        'action': 'delete',
        'table': 'error_logs',
        'error_id': 1
    })

    response = client.get('/api/admin/read_logs', query_string={})
    after_delete = len(response.json)

    assert response.status_code == 200
    assert after_delete == (before_delete - 1)

def test_get_applications():
    '''Tests getting the applications. Will create a form for test purposes'''

    client = app.test_client()

    #CREATE APPLICATION ENTRY
    client.post('/api/db_query', json={
        'action': 'create',
        'table': 'applications',
        'user_id': 999,
        'questionnaire': 'q1:aq2:a',
        'status': 'pending',
        'last_updated': '2024',
        'comments': 'tbd'
    })

    response = client.get('/api/admin/applications/read_form', query_string={})
    assert response.status_code == 200
    assert len(response.json) > 0
    assert response.json[0]['application_id'] == 1

def test_update_applications():
    '''Test to see if update application is functional'''
    client = app.test_client()

    #UPDATE THE ENTRY
    response = client.post('/api/admin/applications/update_form', json={
        'application_id': 1,
        'status': 'approved'
    })
    assert response.status_code == 200
    assert response.json['message'] == 'success | updated entry in applications'

    #CHECK THE ENTRY YOU UPDATED
    response = client.get('/api/admin/applications/read_form', query_string={})
    assert response.json[0]['status'] == 'approved'

def test_del_application():
    '''Test that deleting application works'''
    client = app.test_client()

    response = client.delete('/api/admin/applications/delete_form', json={
        'application_id':1
    })

    assert response.status_code == 200
    assert response.json['message'] == 'success | deleted from applications'

def test_create_pet():
    '''Test creating a pet in the db'''
    client = app.test_client()

    response = client.post('/api/admin/pets/create_pet', json={
        'pet_id': 1,
        'user_id': 999,
        'name': 'Buddy',
        'species': 'Lizard',
        'breed': 'Kimodo Dragon',
        'age': 53,
        'status': 'available'
    })
    #Test self-made response codes (from CRUD)
    assert response.status_code == 201
    assert response.json['message'] == 'success | new entry in pets'

def test_update_pet():
    '''Test updating a pet's attribute'''

    client = app.test_client()

    #UPDATE THE PET
    response = client.post('/api/admin/pets/update_pet', json={
        'pet_id': 1,
        'age': 54
    })
    assert response.status_code == 200
    assert response.json['message'] == 'success | updated entry in pets'

    #CHECK THE ENTRY YOU UPDATED
    response = client.get('/api/db_query', query_string={
        'action': 'read',
        'table': 'pets'
    })
    print(response.json)
    assert response.json[0]['age'] == 54

def test_delete_pet():
    '''Test that deleting pet works'''
    client = app.test_client()

    response = client.delete('/api/admin/pets/delete_pet', json={
        'pet_id':1
    })

    assert response.status_code == 200
    assert response.json['message'] == 'success | deleted from pets'

if __name__ == '__main__':
    pytest.main()
