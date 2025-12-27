"""
Dolls Collection Management System - Backend
Aplicación principal con enrutamiento modular
"""
from flask import Flask
from flask_cors import CORS
from config import DEBUG, CORS_ORIGINS, UPLOAD_FOLDER
from routes import images_bp, dolls_bp, lotes_bp, marcas_bp
from utils import setup_logging, get_logger
import os

# Configurar sistema de logging primero
setup_logging('dolls_backend')
logger = get_logger(__name__)

# Inicializar Flask app
app = Flask(__name__)

# Configuración
app.config['DEBUG'] = DEBUG
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Crear directorio de uploads si no existe
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    logger.info(f"Directorio uploads creado: {UPLOAD_FOLDER}")

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
logger.info("Todos los blueprints registrados exitosamente")

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    """Verifica que el servidor esté activo"""
    return {"status": "online", "message": "Backend is running"}, 200

if __name__ == '__main__':
    logger.info("="*60)
    logger.info(f"Iniciando Dolls Backend Server")
    logger.info(f"DEBUG Mode: {DEBUG}")
    logger.info(f"CORS Origins: {cors_origins}")
    logger.info(f"Upload Folder: {UPLOAD_FOLDER}")
    logger.info("="*60)
    app.run(debug=DEBUG, host='localhost', port=5000)
