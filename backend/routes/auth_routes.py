from flask import Blueprint, request, jsonify
from app.controllers import AuthController

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    
    response, status_code = AuthController.authenticate_user(email, password)
    return jsonify(response), status_code
