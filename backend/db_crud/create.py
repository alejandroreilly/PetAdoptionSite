"""Create operation helper function"""

import sqlite3

from db_crud.helper.helper import generate_unique_id
from input_validation import verify_input

@verify_input
def db_create(table, args):
    """Creates a new entry in the SQLite database

    Args:
        table (string): table in database to create new entry
        args (dict): dict of key pair values to create new entry

    Returns:
        dict: contains message related status
        int: status code
    """

    conn = sqlite3.connect('app_database.db')
    cursor = conn.cursor()

    primary_key, new_id  = generate_unique_id(table)
    args[primary_key] = new_id

    columns = ', '.join(args.keys())
    placeholders = ', '.join('?' * len(args))
    sql = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"

    try:
        cursor.execute(sql, tuple(args.values()))
        conn.commit()

        return {'message': f'success | new entry in {table}'}, 201

    except sqlite3.Error:
        return {'message': f'error while attempting CREATE | {str(sqlite3.Error)}'}, 500

    finally:
        cursor.close()
        conn.close()
