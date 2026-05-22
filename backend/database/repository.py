from database.connection import get_db_connection, IS_POSTGRES
from app.models import User, Order

if IS_POSTGRES:
    from psycopg2.extras import DictCursor

class UserRepository:
    @staticmethod
    def get_by_email(email):
        conn = get_db_connection()
        placeholder = '%s' if IS_POSTGRES else '?'
        if IS_POSTGRES:
            cursor = conn.cursor(cursor_factory=DictCursor)
        else:
            cursor = conn.cursor()
            
        cursor.execute(f"SELECT * FROM users WHERE email = {placeholder}", (email,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return User(
                id=row['id'],
                name=row['name'],
                email=row['email'],
                password=row['password'],
                role=row['role']
            )
        return None

    @staticmethod
    def create(user):
        conn = get_db_connection()
        if IS_POSTGRES:
            cursor = conn.cursor(cursor_factory=DictCursor)
            cursor.execute('''
                INSERT INTO users (name, email, password, role)
                VALUES (%s, %s, %s, %s) RETURNING id
            ''', (user.name, user.email, user.password, user.role))
            user.id = cursor.fetchone()[0]
        else:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO users (name, email, password, role)
                VALUES (?, ?, ?, ?)
            ''', (user.name, user.email, user.password, user.role))
            user.id = cursor.lastrowid
            
        conn.commit()
        conn.close()
        return user

class OrderRepository:
    @staticmethod
    def get_all():
        conn = get_db_connection()
        if IS_POSTGRES:
            cursor = conn.cursor(cursor_factory=DictCursor)
        else:
            cursor = conn.cursor()
            
        cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()
        
        orders = []
        for row in rows:
            orders.append(Order(
                id=row['id'],
                client_name=row['client_name'],
                product=row['product'],
                quantity=row['quantity'],
                unit_price=row['unit_price'],
                total_price=row['total_price'],
                status=row['status'],
                created_at=row['created_at']
            ))
        return orders

    @staticmethod
    def create(order):
        conn = get_db_connection()
        order.calculate_total()
        
        if IS_POSTGRES:
            cursor = conn.cursor(cursor_factory=DictCursor)
            cursor.execute('''
                INSERT INTO orders (client_name, product, quantity, unit_price, total_price, status)
                VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, created_at
            ''', (order.client_name, order.product, order.quantity, order.unit_price, order.total_price, order.status))
            row = cursor.fetchone()
            order.id = row[0]
            order.created_at = row[1]
        else:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO orders (client_name, product, quantity, unit_price, total_price, status)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (order.client_name, order.product, order.quantity, order.unit_price, order.total_price, order.status))
            order.id = cursor.lastrowid
            cursor.execute("SELECT created_at FROM orders WHERE id = ?", (order.id,))
            row = cursor.fetchone()
            if row:
                order.created_at = row['created_at']
                
        conn.commit()
        conn.close()
        return order

    @staticmethod
    def update_status(order_id, new_status):
        conn = get_db_connection()
        placeholder = '%s' if IS_POSTGRES else '?'
        
        if IS_POSTGRES:
            cursor = conn.cursor(cursor_factory=DictCursor)
            cursor.execute('''
                UPDATE orders
                SET status = %s
                WHERE id = %s
            ''', (new_status, order_id))
        else:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE orders
                SET status = ?
                WHERE id = ?
            ''', (new_status, order_id))
            
        conn.commit()
        
        cursor.execute(f"SELECT * FROM orders WHERE id = {placeholder}", (order_id,))
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return Order(
                id=row['id'],
                client_name=row['client_name'],
                product=row['product'],
                quantity=row['quantity'],
                unit_price=row['unit_price'],
                total_price=row['total_price'],
                status=row['status'],
                created_at=row['created_at']
            )
        return None
