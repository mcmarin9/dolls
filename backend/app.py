"""
Dolls Collection Management System - Backend
Aplicación principal con enrutamiento modular
"""
import logging
from flask import Flask
from flask_cors import CORS
from config import DEBUG, CORS_ORIGINS, UPLOAD_FOLDER
from routes import images_bp, dolls_bp, lotes_bp, marcas_bp
import os

# Inicializar Flask app
app = Flask(__name__)

# Configuración
app.config['DEBUG'] = DEBUG
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Crear directorio de uploads si no existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurar CORS
cors_origins = [origin.strip() for origin in CORS_ORIGINS]
CORS(app, resources={
    r"/*": {
        "origins": cors_origins,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Range", "X-Content-Range"],
        "supports_credentials": True
    }
})

# Registrar blueprints
app.register_blueprint(images_bp)
app.register_blueprint(dolls_bp)
app.register_blueprint(lotes_bp)
app.register_blueprint(marcas_bp)

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    """Verifica que el servidor esté activo"""
    return {"status": "online", "message": "Backend is running"}, 200

if __name__ == '__main__':
    logger.info(f"Starting server with DEBUG={DEBUG}")
    logger.info(f"CORS Origins: {cors_origins}")
    app.run(debug=DEBUG, host='localhost', port=5000)
