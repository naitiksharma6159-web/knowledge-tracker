import sqlite3
import os

# Set a default path for the SQLite database, allowing override via environment variable
DB_PATH = os.getenv("KNOWLEDGE_TRACKER_DB", os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "knowledge_tracker.db"))

def get_db_connection(db_path: str = None):
    """
    Establish a connection to the SQLite database.
    Sets row_factory to sqlite3.Row to support key-based column access.
    """
    path = db_path or DB_PATH
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(db_path: str = None):
    """
    Initialize the SQLite database schema by creating the users and notes tables if they do not exist.
    """
    conn = get_db_connection(db_path)
    cursor = conn.cursor()
    
    # Enable foreign keys
    cursor.execute("PRAGMA foreign_keys = ON;")
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        tags TEXT DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)
    
    conn.commit()
    conn.close()

