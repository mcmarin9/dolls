from flask import Blueprint, send_from_directory, request, jsonify
import os
from config import UPLOAD_FOLDER
from utils import delete_image
from database import Database

images_bp = Blueprint('images', __name__)
db = Database()


@images_bp.route('/uploads/<filename>', methods=['GET'])
def get_image(filename):
    """Obtiene una imagen del servidor"""
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except FileNotFoundError:
        return jsonify({'error': 'Imagen no encontrada'}), 404


@images_bp.route('/api/delete-image', methods=['POST'])
def delete_image_route():
    """Borra una imagen del servidor"""
    try:
        data = request.json
        image_path = data.get('image_path')
        
        if not image_path:
            return jsonify({'error': 'Path de imagen requerido'}), 400
        
        if delete_image(image_path):
            return jsonify({'message': 'Imagen borrada exitosamente'}), 200
        else:
            return jsonify({'error': 'No se pudo borrar la imagen'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
