"""Delete operation helper function"""

import sqlite3

from db_crud.helper.helper import find_entry_by_id
from input_validation import verify_input

@verify_input
def db_delete(table, args):
    """Deletes an entry in the SQLite database

    Args:
        table (string): table in database to delete entry
        args (dict): dict of key-value pairs to delete entry

    Returns:
        dict: contains message related to status
        int: status code
    """

    entry, primary_key, key_value = find_entry_by_id(table, args)

    if entry is None:
        return {'message': f'failure | could not delete from {table}'}, 404

    conn = sqlite3.connect('app_database.db')
    cursor = conn.cursor()

    sql = f"DELETE FROM {table} WHERE {primary_key} = ?"

    try:
        cursor.execute(sql, (key_value,))
        conn.commit()

        return {'message': f'success | deleted from {table}'}, 200

    except sqlite3.Error:
        return {'message': f'error while attempting DELETE | {str(sqlite3.Error)}'}, 500

    finally:
        cursor.close()
        conn.close()
