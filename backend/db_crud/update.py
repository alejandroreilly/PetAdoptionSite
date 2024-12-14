"""Update operation helper function"""

import sqlite3
from db_crud.helper.helper import find_entry_by_id
from input_validation import verify_input

@verify_input
def db_update(table, args):
    """Updates an entry in the database

    Args:
        table (str): table in database to update entry
        args (dict): dict of key-value pairs to update entry

    Returns:
        dict: contains message related to status
        int: status code
    """

    entry, primary_key, primary_key_value = find_entry_by_id(table, args)
    if entry is None:
        return {'message': f'failure | could not update entry in {table}'}, 402

    set_clause = ", ".join([f"{key} = ?" for key in args.keys() if key != primary_key])
    sql = f"UPDATE {table} SET {set_clause} WHERE {primary_key} = ?"

    values = [value for key, value in args.items() if key != primary_key] + [primary_key_value]

    try:
        conn = sqlite3.connect('app_database.db')
        cursor = conn.cursor()

        cursor.execute(sql, values)
        conn.commit()

        return {'message': f'success | updated entry in {table}'}, 200

    except sqlite3.Error:
        print(f"Database error: {sqlite3.Error}")
        return {'message': 'failure while attempting UPDATE | database error'}, 500

    finally:
        cursor.close()
        conn.close()
