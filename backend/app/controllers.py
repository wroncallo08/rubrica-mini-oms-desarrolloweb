import jwt
import time
from werkzeug.security import check_password_hash, generate_password_hash
from database.repository import UserRepository, OrderRepository
from app.models import User, Order

JWT_SECRET = "super_secret_oms_key_2026_clean_architecture_system_key"
JWT_ALGORITHM = "HS256"

class AuthController:
    @staticmethod
    def authenticate_user(email, password):
        if not email or not password:
            return {"error": "El email y la contraseña son obligatorios"}, 400

        user = UserRepository.get_by_email(email)
        if not user:
            return {"error": "Credenciales inválidas"}, 401

        if not check_password_hash(user.password, password):
            return {"error": "Credenciales inválidas"}, 401

        payload = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
            "name": user.name,
            "exp": int(time.time()) + 28800
        }
        
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        return {
            "token": token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role
            }
        }, 200

    @staticmethod
    def register_user(name, email, password, role="user"):
        if not name or not email or not password:
            return {"error": "Todos los campos son obligatorios"}, 400

        existing_user = UserRepository.get_by_email(email)
        if existing_user:
            return {"error": "El correo ya está en uso"}, 400

        hashed_password = generate_password_hash(password)
        new_user = User(name=name, email=email, password=hashed_password, role=role)
        
        try:
            created_user = UserRepository.create(new_user)
            
            payload = {
                "sub": str(created_user.id),
                "email": created_user.email,
                "role": created_user.role,
                "name": created_user.name,
                "exp": int(time.time()) + 28800
            }
            
            token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
            
            return {
                "token": token,
                "user": {
                    "id": created_user.id,
                    "name": created_user.name,
                    "email": created_user.email,
                    "role": created_user.role
                }
            }, 201
        except Exception as e:
            return {"error": f"Error al crear usuario: {str(e)}"}, 500

    @staticmethod
    def verify_token(token):
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

class OrderController:
    @staticmethod
    def get_all_orders(user_id):
        orders = OrderRepository.get_by_user(user_id)
        return [order.to_dict() for order in orders], 200

    @staticmethod
    def create_order(order_data, user_id):
        try:
            order = Order.from_dict(order_data)
            order.user_id = user_id
            
            if not order.client_name:
                return {"error": "El nombre del cliente es obligatorio"}, 400
            if not order.product:
                return {"error": "El nombre del producto es obligatorio"}, 400
            if order.quantity <= 0:
                return {"error": "La cantidad debe ser mayor que cero"}, 400
            if order.unit_price < 0:
                return {"error": "El precio unitario no puede ser negativo"}, 400

            saved_order = OrderRepository.create(order)
            return saved_order.to_dict(), 201
        except ValueError as e:
            return {"error": f"Datos inválidos: {str(e)}"}, 400
        except Exception as e:
            return {"error": f"Error interno al crear el pedido: {str(e)}"}, 500

    @staticmethod
    def update_order_status(order_id, user_id, new_status):
        valid_statuses = ['Pendiente', 'En Progreso', 'Completado', 'Cancelado']
        if new_status not in valid_statuses:
            return {"error": f"Estado inválido. Debe ser uno de: {', '.join(valid_statuses)}"}, 400
            
        try:
            updated_order = OrderRepository.update_status(order_id, user_id, new_status)
            if not updated_order:
                return {"error": "Pedido no encontrado o no autorizado"}, 404
                
            return updated_order.to_dict(), 200
        except Exception as e:
            return {"error": f"Error interno al actualizar el estado del pedido: {str(e)}"}, 500
