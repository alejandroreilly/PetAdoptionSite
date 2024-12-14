"""Input Validation"""

from functools import wraps

TABLE_SCHEMAS = {
    'error_logs':{
        'error_id': 'INTEGER',
        'timestamp': 'TEXT',
        'error_message': 'TEXT',
        'severity_level': 'INTEGER', 
        'user_id': 'INTEGER'
    },
    'pets': {
        'pet_id': 'INTEGER',
        'user_id': 'INTEGER',
        'name': 'TEXT',
        'age': 'INTEGER',
        'species': 'TEXT',
        'breed': 'TEXT',
        'status': 'TEXT'
    },
    'users': {
        'user_id': 'INTEGER',
        'username': 'TEXT',
        'password': 'TEXT',
        'data': 'TEXT',
    },
    'applications': {
        'application_id': 'INTEGER',
        'user_id': 'INTEGER',
        'questionnaire': 'TEXT',
        'status': 'TEXT',
        'last_updated': 'TEXT',
        'comments': 'TEXT'
    },
    'visits': {
        'visit_id': 'INTEGER',
        'visit_time': 'TEXT',
        'user_id': 'INTEGER',
        'pet_id': 'INTEGER',
        'visit_date': 'TEXT',
    }
}

def validate_input(table, args=None):
    """Validates input data against the table schema"""
    if table not in TABLE_SCHEMAS:
        raise ValueError(f"Unknown table: {table}")

    schema = TABLE_SCHEMAS[table]
    errors = []

    if args is None:
        return

    for column, value in args.items():
        if column not in schema:
            errors.append(f"Invalid column: {column}")
        else:
            expected_type = schema[column]
            if expected_type == 'TEXT' and not isinstance(value, str) and value is not None:
                errors.append(f"Column '{column}' should be of type TEXT")
            elif expected_type == 'INTEGER' and not isinstance(value, int) and value is not None:
                errors.append(f"Column '{column}' should be of type INTEGER")

    if errors:
        raise ValueError("Validation errors: " + "; ".join(errors))

def verify_input(func):
    """Decorator to validate the input for CRUD operations"""
    @wraps(func)
    def wrapper(table, args, *args_passed, **kwargs):
        try:
            validate_input(table, args)
        except ValueError as error:
            return {'message': f'Validation error | {str(error)}'}, 405

        return func(table, args, *args_passed, **kwargs)

    return wrapper
