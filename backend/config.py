import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de Base de Datos
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'dolls_db'),
    'charset': 'utf8mb4',
    'cursorclass': 'DictCursor'
}

# Configuración de archivos
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

# Configuración de la app
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(',')
IMAGE_MAX_SIZE = (800, 800)
IMAGE_QUALITY = 85

# Clave maestra (no usar en producción)
MASTER_KEY = os.getenv('MASTER_KEY', 'dev-key-change-me')
