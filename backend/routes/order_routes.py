from flask import Blueprint, request, jsonify
from functools import wraps
from app.controllers import AuthController, OrderController

orders_bp = Blueprint('orders', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
        
        if not token:
            return jsonify({"error": "Token de autenticación faltante"}), 401
        
        user_info = AuthController.verify_token(token)
        if not user_info:
            return jsonify({"error": "Token inválido o expirado"}), 401
            
        return f(user_info, *args, **kwargs)
    return decorated

@orders_bp.route('', methods=['GET'])
@token_required
def get_orders(user_info):
    response, status_code = OrderController.get_all_orders()
    return jsonify(response), status_code

@orders_bp.route('', methods=['POST'])
@token_required
def create_order(user_info):
    data = request.get_json() or {}
    response, status_code = OrderController.create_order(data)
    return jsonify(response), status_code

@orders_bp.route('/<int:order_id>/status', methods=['PATCH'])
@token_required
def update_order_status(user_info, order_id):
    data = request.get_json() or {}
    new_status = data.get('status')
    if not new_status:
        return jsonify({"error": "El nuevo estado es obligatorio"}), 400
        
    response, status_code = OrderController.update_order_status(order_id, new_status)
    return jsonify(response), status_code
