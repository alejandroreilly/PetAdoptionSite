"""Caller function for CRUD operations"""

from db_crud.create import db_create
from db_crud.read import db_read
from db_crud.update import db_update
from db_crud.delete import db_delete

from db_crud.helper.helper import get_table_list

def crud_main(args):
    """Routes call upon this helper function

    Extracts action and table from args to decide which operation
    to perform and upon which table in the database

    Also does checks to ensure table exists in database and enough
    args are present for CUD

    Args:
        args (dict): key pair values containing parameters for operations

    Returns:
        dict: a message related to the status (CUD) or the requested logs (R)
        int: the status code of the request
    """

    args = dict(args)
    print(args)
    action = args.pop('action', None)
    table = args.pop('table', None)
    print(args)

    result = None

    # Check if the table exists in the database
    if table not in get_table_list():
        return {'message': 'table not found'}, 404

    # Validate input for CUD operations
    if action in ['create', 'update', 'delete'] and not args:
        return {'message': 'no args provided for action'}, 400

    if action == 'create':
        result = db_create(table, args)
    elif action == 'read':
        result = db_read(table, args)
    elif action == 'update':
        result = db_update(table, args)
    elif action == 'delete':
        result = db_delete(table, args)
    else:
        return {'message': 'action not found'}, 404

    return result
