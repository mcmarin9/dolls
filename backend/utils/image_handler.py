import io
import os
import uuid
from PIL import Image
from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS, IMAGE_MAX_SIZE, IMAGE_QUALITY
from .logger import get_logger

logger = get_logger(__name__)


def allowed_file(filename):
    """Verifica si el archivo tiene una extensión permitida"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def optimize_image(image_file, max_size=IMAGE_MAX_SIZE):
    """
    Optimiza una imagen redimensionándola y comprimiéndola
    
    Args:
        image_file: Objeto de archivo de Flask
        max_size: Tupla (width, height) para redimensionar
    
    Returns:
        BytesIO object con la imagen optimizada, o None si hay error
    """
    try:
        img = Image.open(image_file)
        
        # Convertir a RGB si es necesario
        if img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')
        
        # Redimensionar manteniendo proporción
        try:
            img.thumbnail(max_size, Image.Resampling.LANCZOS)
        except AttributeError:
            img.thumbnail(max_size, Image.ANTIALIAS)
        
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=IMAGE_QUALITY, optimize=True)
        buffer.seek(0)
        
        return buffer
        
    except Exception as e:
        logger.error(f"Error optimizando imagen: {e}")
        return None


def save_image(file):
    """
    Guarda una imagen en el servidor
    
    Args:
        file: Objeto de archivo de Flask
    
    Returns:
        Path de la imagen guardada (/uploads/filename) o None si hay error
    """
    try:
        if not file or not allowed_file(file.filename):
            logger.warning(f"Archivo no permitido: {file.filename if file else 'Sin archivo'}")
            return None
        
        # Crear directorio si no existe
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        
        unique_filename = f"{uuid.uuid4().hex}.jpg"
        optimized = optimize_image(file)
        
        if optimized:
            filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
            with open(filepath, 'wb') as f:
                f.write(optimized.getvalue())
            
            logger.info(f"Imagen guardada: {unique_filename}")
            return f'/uploads/{unique_filename}'
        
        return None
        
    except Exception as e:
        logger.error(f"Error guardando imagen: {e}")
        return None


def delete_image(image_path):
    """
    Borra una imagen del servidor
    
    Args:
        image_path: Path de la imagen (/uploads/filename)
    
    Returns:
        True si se borró, False en caso contrario
    """
    if not image_path:
        return False
    
    try:
        full_path = os.path.join(os.path.dirname(__file__), '..', image_path.lstrip('/'))
        full_path = os.path.abspath(full_path)
        
        if os.path.exists(full_path):
            os.remove(full_path)
            logger.info(f"Imagen borrada: {image_path}")
            return True
        else:
            logger.warning(f"Imagen no encontrada: {image_path}")
            return False
            
    except Exception as e:
        logger.error(f"Error borrando imagen: {e}")
        return False
