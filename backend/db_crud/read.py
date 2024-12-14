"""Read operation helper function"""

import sqlite3
from input_validation import verify_input

@verify_input
def db_read(table, args):
    """Reads data in the database

    Args:
        table (str): table in database to read entries
        args (dict): dict of key-value pairs to read entries (filters)

    Returns:
        dict: contains requested entries
        int: status code
    """

    conn = sqlite3.connect('app_database.db')
    cursor = conn.cursor()

    if not args:
        cursor.execute(f"SELECT * FROM {table}")
        results = cursor.fetchall()
        columns = [column[0] for column in cursor.description]
        return [dict(zip(columns, row)) for row in results], 200

    where_clause = " AND ".join([f"{key} = ?" for key in args.keys()])
    sql = f"SELECT * FROM {table} WHERE {where_clause}"

    try:
        cursor.execute(sql, list(args.values()))
        results = cursor.fetchall()
        columns = [column[0] for column in cursor.description]

        filtered = [dict(zip(columns, row)) for row in results]

        return filtered, 200

    except sqlite3.Error:
        print(f"Database error: {sqlite3.Error}")
        return {'message': 'failure while attempting READ | database error'}, 500

    finally:
        cursor.close()
        conn.close()
