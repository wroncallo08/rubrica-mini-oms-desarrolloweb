import sqlite3
import os
from werkzeug.security import generate_password_hash

POSTGRES_URL = os.environ.get('POSTGRES_URL') or os.environ.get('POSTGRES_URL_URL')
IS_POSTGRES = POSTGRES_URL is not None

if IS_POSTGRES:
    import psycopg2
    from psycopg2.extras import DictCursor

if os.environ.get('VERCEL'):
    DB_PATH = '/tmp/oms.db'
else:
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
                user_id INTEGER REFERENCES users(id),
                client_name TEXT NOT NULL,
                product TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                unit_price REAL NOT NULL,
                total_price REAL NOT NULL,
                status TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        try:
            cursor.execute('ALTER TABLE orders ADD COLUMN user_id INTEGER REFERENCES users(id)')
            conn.commit()
        except Exception:
            conn.rollback()
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
                user_id INTEGER,
                client_name TEXT NOT NULL,
                product TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                unit_price REAL NOT NULL,
                total_price REAL NOT NULL,
                status TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        try:
            cursor.execute('ALTER TABLE orders ADD COLUMN user_id INTEGER REFERENCES users(id)')
        except Exception:
            pass
    
    placeholder = '%s' if IS_POSTGRES else '?'
    
    cursor.execute(f"SELECT id FROM users WHERE email = {placeholder}", ('admin@example.com',))
    user = cursor.fetchone()
    
    if not user:
        hashed_password = generate_password_hash('admin123')
        if IS_POSTGRES:
            cursor.execute(f'''
                INSERT INTO users (name, email, password, role)
                VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}) RETURNING id
            ''', ('Administrador OMS', 'admin@example.com', hashed_password, 'admin'))
            admin_id = cursor.fetchone()[0]
        else:
            cursor.execute(f'''
                INSERT INTO users (name, email, password, role)
                VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder})
            ''', ('Administrador OMS', 'admin@example.com', hashed_password, 'admin'))
            admin_id = cursor.lastrowid
        
        cursor.execute(f'''
            INSERT INTO orders (user_id, client_name, product, quantity, unit_price, total_price, status)
            VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})
        ''', (admin_id, 'Juan Perez', 'Laptop Dell XPS 13', 1, 1200.00, 1200.00, 'Pendiente'))
        
        cursor.execute(f'''
            INSERT INTO orders (user_id, client_name, product, quantity, unit_price, total_price, status)
            VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})
        ''', (admin_id, 'María Gomez', 'Monitor UltraWide LG 34"', 2, 450.00, 900.00, 'En Progreso'))
        
        cursor.execute(f'''
            INSERT INTO orders (user_id, client_name, product, quantity, unit_price, total_price, status)
            VALUES ({placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder}, {placeholder})
        ''', (admin_id, 'Carlos Lopez', 'Teclado Mecánico Keychron K2', 3, 95.00, 285.00, 'Completado'))
        
        conn.commit()
    else:
        admin_id = user[0] if isinstance(user, tuple) else user['id']
        cursor.execute(f"UPDATE orders SET user_id = {placeholder} WHERE user_id IS NULL", (admin_id,))
        conn.commit()
        
    conn.close()

if __name__ == '__main__':
    init_db()
