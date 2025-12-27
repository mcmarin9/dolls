"""
Sistema de logging centralizado con rotación de archivos
"""
import logging
import logging.handlers
import os
import json
from datetime import datetime
from config import DEBUG


class JSONFormatter(logging.Formatter):
    """Formateador personalizado para logs en JSON"""
    
    def format(self, record):
        log_data = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno
        }
        
        # Agregar información de excepción si existe
        if record.exc_info:
            log_data['exception'] = self.formatException(record.exc_info)
        
        # Agregar campos personalizados
        if hasattr(record, 'user_id'):
            log_data['user_id'] = record.user_id
        if hasattr(record, 'request_id'):
            log_data['request_id'] = record.request_id
            
        return json.dumps(log_data, ensure_ascii=False)


def setup_logging(app_name='dolls_backend'):
    """
    Configura el sistema de logging con rotación de archivos
    
    Args:
        app_name: Nombre de la aplicación para los archivos de log
    """
    # Crear directorio de logs si no existe
    logs_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'logs')
    if not os.path.exists(logs_dir):
        os.makedirs(logs_dir)
    
    # Configurar logger raíz
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG if DEBUG else logging.INFO)
    
    # Limpiar handlers existentes
    root_logger.handlers = []
    
    # 1. Handler para consola (formato legible)
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG if DEBUG else logging.INFO)
    console_format = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(console_format)
    root_logger.addHandler(console_handler)
    
    # 2. Handler para archivo general (formato JSON, rotación)
    general_log_file = os.path.join(logs_dir, f'{app_name}.log')
    file_handler = logging.handlers.RotatingFileHandler(
        general_log_file,
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(JSONFormatter())
    root_logger.addHandler(file_handler)
    
    # 3. Handler para errores (solo ERROR y CRITICAL)
    error_log_file = os.path.join(logs_dir, f'{app_name}_errors.log')
    error_handler = logging.handlers.RotatingFileHandler(
        error_log_file,
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5,
        encoding='utf-8'
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(JSONFormatter())
    root_logger.addHandler(error_handler)
    
    # Silenciar logs excesivamente verbosos de librerías
    logging.getLogger('werkzeug').setLevel(logging.WARNING)
    logging.getLogger('PIL').setLevel(logging.WARNING)
    
    # Log de inicio
    logging.info(f"Sistema de logging configurado para {app_name}")
    logging.info(f"Nivel de logging: {'DEBUG' if DEBUG else 'INFO'}")
    logging.info(f"Directorio de logs: {logs_dir}")
    
    return root_logger


def get_logger(name):
    """
    Obtiene un logger con el nombre especificado
    
    Args:
        name: Nombre del módulo o componente
    
    Returns:
        Logger configurado
    """
    return logging.getLogger(name)
