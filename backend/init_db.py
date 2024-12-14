"""init file for database"""

import sqlite3

def initialize_database():
    """Creates database for app"""

    connection = sqlite3.connect('app_database.db')
    cursor = connection.cursor()

    cursor.execute("PRAGMA foreign_keys = ON")

    #error log table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS error_logs (
            error_id INTEGER PRIMARY KEY,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            error_message TEXT,
            severity_level TEXT DEFAULT 'low',
            user_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    ''')

    #application table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            application_id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL,
            questionnaire TEXT,
            status TEXT DEFAULT 'pending',
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            comments TEXT,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    ''')

    #pet table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pets (
            pet_id INTEGER PRIMARY KEY,
            user_id INTEGER,
            name TEXT NOT NULL,
            species TEXT NOT NULL,
            breed TEXT,
            age INTEGER,
            status TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )
    ''')

    #user table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            data TEXT
        )
    ''')

     #Schedule visits table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS visits (
            visit_id INTEGER PRIMARY KEY,
            visit_time TEXT NOT NULL,
            visit_date TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            pet_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(user_id)
            FOREIGN KEY (pet_id) REFERENCES pets(pet_id)
        )
    ''')

    connection.commit()
    connection.close()
