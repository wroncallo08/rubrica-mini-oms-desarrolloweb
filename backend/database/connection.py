import sqlite3
import os
from werkzeug.security import generate_password_hash

POSTGRES_URL = os.environ.get('POSTGRES_URL') or os.environ.get('POSTGRES_URL_URL')
IS_POSTGRES = POSTGRES_URL is not None

if IS_POSTGRES:
    import psycopg2
    from psycopg2.extras import DictCursor

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'oms.db')

def get_db_connection():
    if IS_POSTGRES:
        conn = psycopg2.connect(POSTGRES_URL)
        return conn
    else:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

def init_db():
    conn = get_db_connection()
    if IS_POSTGRES:
        cursor = conn.cursor(cursor_factory=DictCursor)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                client_name TEXT NOT NULL,
                product TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                unit_price REAL NOT NULL,
                total_price REAL NOT NULL,
                status TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
    else:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_name TEXT NOT NULL,
                product TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                unit_price REAL NOT NULL,
                total_price REAL NOT NULL,
                status TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
    
    placeholder = '%s' if IS_POSTGRES else '?'
    
    cursor.execute(f"SELECT id FROM users WHERE email = {placeholder}", ('admin@example.com',))
    user = cursor.fetchone()
    
    if not user:
        hashed_password = generate_password_hash('admin123')
        cursor.execute(f'''
            INSERT INTO users (name, email, password, role)
            VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder})
        ''', ('Administrador OMS', 'admin@example.com', hashed_password, 'admin'))
        
        cursor.execute(f'''
            INSERT INTO orders (client_name, product, quantity, unit_price, total_price, status)
            VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})
        ''', ('Juan Perez', 'Laptop Dell XPS 13', 1, 1200.00, 1200.00, 'Pendiente'))
        
        cursor.execute(f'''
            INSERT INTO orders (client_name, product, quantity, unit_price, total_price, status)
            VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})
        ''', ('María Gomez', 'Monitor UltraWide LG 34"', 2, 450.00, 900.00, 'En Progreso'))
        
        cursor.execute(f'''
            INSERT INTO orders (client_name, product, quantity, unit_price, total_price, status)
            VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})
        ''', ('Carlos Lopez', 'Teclado Mecánico Keychron K2', 3, 95.00, 285.00, 'Completado'))
        
        conn.commit()
        
    conn.close()

if __name__ == '__main__':
    init_db()
