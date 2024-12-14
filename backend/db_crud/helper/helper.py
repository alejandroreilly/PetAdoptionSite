"""Helper functions for CRUD functions"""

import sqlite3

def find_entry_by_id(table, args):
    """Find an entry in the specified table by primary key value

    Args:
        table (str): the name of the table to search
        args (dict): the dictionary containing key-value pairs, including the primary key

    Returns:
        dict: the matching entry or None if not found
        str: the primary key name or None if not found
        value: the value of the primary key from args or None if not found
    """

    conn = sqlite3.connect('app_database.db')
    cursor = conn.cursor()

    try:
        cursor.execute(f"PRAGMA table_info({table})")
        columns_info = cursor.fetchall()
        primary_key = None

        for column in columns_info:
            if column[5]:
                primary_key = column[1]
                break

        if primary_key is None:
            raise ValueError(f"No primary key found for table {table}")

        value = args.get(primary_key)
        if value is None:
            return None, None, None

        sql = f"SELECT * FROM {table} WHERE {primary_key} = ?"

        cursor.execute(sql, (value,))
        result = cursor.fetchone()

        if result:
            columns = [column[0] for column in cursor.description]
            return dict(zip(columns, result)), primary_key, value

    except sqlite3.Error:
        print(f"Database error: {sqlite3.Error}")
        raise
    finally:
        cursor.close()
        conn.close()

    return None, None, None

def generate_unique_id(table):
    """Generate a unique ID for the primary key in the specified table

    Args:
        table (str): the name of the table to generate an ID for

    Returns:
        int: a unique ID for the new entry
    """

    conn = sqlite3.connect('app_database.db')
    cursor = conn.cursor()

    try:
        cursor.execute(f"PRAGMA table_info({table})")
        columns_info = cursor.fetchall()
        primary_key = None

        for column in columns_info:
            if column[5]:
                primary_key = column[1]
                break

        if primary_key is None:
            raise ValueError(f"No primary key found for table {table}")

        cursor.execute(f"SELECT MAX({primary_key}) FROM {table}")
        result = cursor.fetchone()

        new_id = (result[0] + 1) if result[0] is not None else 1
        return primary_key, new_id

    except sqlite3.Error:
        print(f"Error fetching max ID from {table}: {str(sqlite3.Error)}")
        raise

    finally:
        cursor.close()
        conn.close()

def get_table_list():
    """Retrieves the list of tables in the SQLite database

    Returns:
        list: contains name of tables in database
    """

    conn = sqlite3.connect('app_database.db')
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]

    cursor.close()
    conn.close()

    return tables
