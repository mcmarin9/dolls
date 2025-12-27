from flask import Blueprint, request, jsonify
from database import Database
from utils import MarcaValidator, FabricanteValidator, ValidationError, get_logger

marcas_bp = Blueprint('marcas', __name__)
db = Database()
logger = get_logger(__name__)


@marcas_bp.route('/api/marcas', methods=['GET'])
def get_marcas():
    """Obtiene todas las marcas con sus fabricantes asociados"""
    try:
        query = """
            SELECT m.id, m.nombre, 
                GROUP_CONCAT(f.id) as fabricante_ids,
                GROUP_CONCAT(f.nombre) as fabricante_nombres
            FROM marca m
            LEFT JOIN marca_fabricante mf ON m.id = mf.marca_id
            LEFT JOIN fabricantes f ON mf.fabricante_id = f.id
            GROUP BY m.id
        """
        
        marcas = db.execute_query(query, fetch_all=True)
        
        # Procesar fabricantes para cada marca
        for marca in marcas:
            if marca['fabricante_ids']:
                fabricante_ids = marca['fabricante_ids'].split(',')
                fabricante_nombres = marca['fabricante_nombres'].split(',')
                marca['fabricantes'] = [
                    {'id': int(id), 'nombre': nombre}
                    for id, nombre in zip(fabricante_ids, fabricante_nombres)
                ]
            else:
                marca['fabricantes'] = []
                
            # Eliminar campos innecesarios
            del marca['fabricante_ids']
            del marca['fabricante_nombres']
        
        return jsonify(marcas), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo marcas: {e}", exc_info=True)
        return jsonify({"error": "Error al obtener marcas"}), 500


@marcas_bp.route('/api/marcas', methods=['POST'])
def add_marca():
    """Crea una nueva marca con fabricantes asociados"""
    try:
        data = request.get_json()
        
        if not data or 'nombre' not in data:
            return jsonify({"error": "El nombre de la marca es requerido"}), 400
        
        # Validar datos
        MarcaValidator.validate(data)
        
        # Insertar marca
        insert_query = """
            INSERT INTO marca (nombre)
            VALUES (%s)
        """
        marca_id = db.execute_insert(insert_query, (data['nombre'],))
        
        # Agregar asociaciones con fabricantes si se proporcionan
        if 'fabricanteIds' in data and data['fabricanteIds']:
            values = [(marca_id, fab_id) for fab_id in data['fabricanteIds']]
            
            fabricante_query = """
                INSERT INTO marca_fabricante (marca_id, fabricante_id)
                VALUES (%s, %s)
            """
            
            for marca_id_val, fab_id in values:
                db.execute_insert(fabricante_query, (marca_id_val, fab_id))
        
        return jsonify({
            "id": marca_id,
            "message": "Marca creada exitosamente"
        }), 201
        
    except ValidationError as e:
        logger.warning(f"Validación fallida al crear marca: {e}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Error creando marca: {e}", exc_info=True)
        return jsonify({"error": "Error al crear marca"}), 500


@marcas_bp.route('/api/marcas/<int:marca_id>', methods=['PUT'])
def update_marca(marca_id):
    """Actualiza una marca existente"""
    try:
        data = request.get_json()
        
        if 'nombre' in data:
            update_query = """
                UPDATE marca 
                SET nombre = %s
                WHERE id = %s
            """
            db.execute_update(update_query, (data['nombre'], marca_id))
        
        if 'fabricanteIds' in data:
            # Eliminar asociaciones existentes
            delete_query = "DELETE FROM marca_fabricante WHERE marca_id = %s"
            db.execute_update(delete_query, (marca_id,))
            
            # Agregar nuevas asociaciones
            if data['fabricanteIds']:
                values = [(marca_id, fab_id) for fab_id in data['fabricanteIds']]
                
                insert_query = """
                    INSERT INTO marca_fabricante (marca_id, fabricante_id)
                    VALUES (%s, %s)
                """
                
                for marca_id_val, fab_id in values:
                    db.execute_insert(insert_query, (marca_id_val, fab_id))
        
        return jsonify({"message": "Marca actualizada exitosamente"}), 200
        
    except Exception as e:
        logger.error(f"Error actualizando marca {marca_id}: {e}", exc_info=True)
        return jsonify({"error": "Error al actualizar marca"}), 500


@marcas_bp.route('/api/fabricantes', methods=['GET'])
def get_fabricantes():
    """Obtiene todos los fabricantes"""
    try:
        query = "SELECT * FROM fabricantes ORDER BY nombre"
        fabricantes = db.execute_query(query, fetch_all=True)
        return jsonify(fabricantes), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo fabricantes: {e}", exc_info=True)
        return jsonify({"error": "Error al obtener fabricantes"}), 500


@marcas_bp.route('/api/fabricantes', methods=['POST'])
def add_fabricante():
    """Crea un nuevo fabricante"""
    try:
        data = request.get_json()
        
        # Validar datos
        FabricanteValidator.validate(data)
        
        insert_query = """
            INSERT INTO fabricantes (nombre, pais)
            VALUES (%s, %s)
        """
        
        fabricante_id = db.execute_insert(
            insert_query,
            (data['nombre'], data.get('pais', ''))
        )
        
        return jsonify({
            "id": fabricante_id,
            "message": "Fabricante creado exitosamente"
        }), 201
        
    except ValidationError as e:
        logger.warning(f"Validación fallida al crear fabricante: {e}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Error creando fabricante: {e}", exc_info=True)
        return jsonify({"error": "Error al crear fabricante"}), 500
