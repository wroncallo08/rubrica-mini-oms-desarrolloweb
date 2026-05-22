from flask import Flask, jsonify
from flask_cors import CORS
from database.connection import init_db
from routes.auth_routes import auth_bp
from routes.order_routes import orders_bp

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    with app.app_context():
        init_db()
    
    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(orders_bp, url_prefix='/api/v1/orders')
    
    @app.route('/')
    def index():
        return jsonify({
            "name": "Mini-OMS API",
            "version": "1.0.0",
            "status": "online",
            "message": "Bienvenido al Sistema de Gestión de Pedidos"
        })

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='127.0.0.1', port=5000, debug=True)
