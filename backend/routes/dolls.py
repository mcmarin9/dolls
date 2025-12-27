from flask import Blueprint, request, jsonify
from database import Database
from utils import save_image, delete_image, DollValidator, ValidationError, get_logger

dolls_bp = Blueprint('dolls', __name__)
db = Database()
logger = get_logger(__name__)


@dolls_bp.route('/api/dolls', methods=['GET'])
def get_dolls():
    """Obtiene todas las muñecas con sus información asociada"""
    try:
        query = """
            SELECT 
                d.*,
                m.nombre AS marca_nombre,
                f.nombre AS fabricante_nombre,
                GROUP_CONCAT(l.id) as lote_ids,
                GROUP_CONCAT(l.nombre) as lote_nombres
            FROM dolls d
            LEFT JOIN marca m ON d.marca_id = m.id
            LEFT JOIN fabricantes f ON d.fabricante_id = f.id
            LEFT JOIN lote_doll ld ON d.id = ld.doll_id
            LEFT JOIN lotes l ON ld.lote_id = l.id
            GROUP BY d.id
            ORDER BY d.created_at DESC
        """
        
        dolls = db.execute_query(query, fetch_all=True)
        
        # Procesar datos de lotes
        for doll in dolls:
            if doll['lote_ids']:
                lote_ids = doll['lote_ids'].split(',')
                lote_nombres = doll['lote_nombres'].split(',')
                doll['lotes'] = [
                    {'id': int(id), 'nombre': nombre}
                    for id, nombre in zip(lote_ids, lote_nombres)
                ]
            else:
                doll['lotes'] = []
            
            del doll['lote_ids']
            del doll['lote_nombres']
        
        return jsonify(dolls), 200
        
    except Exception as e:
        logger.error(f"Error en get_dolls: {str(e)}", exc_info=True)
        return jsonify({"error": "Error al obtener muñecas"}), 500


@dolls_bp.route('/api/dolls', methods=['POST'])
def add_doll():
    """Agrega una nueva muñeca"""
    try:
        data = request.form.to_dict()
        
        # Validar datos
        DollValidator.validate(data)
        
        # Obtener el fabricante_id de la marca seleccionada
        query = """
            SELECT mf.fabricante_id
            FROM marca_fabricante mf
            WHERE mf.marca_id = %s
            LIMIT 1
        """
        result = db.execute_query(query, (data['marca_id'],), fetch_one=True)
        fabricante_id = result['fabricante_id'] if result else None

        # Convertir precios a float o None
        precio_compra = float(data['precio_compra']) if 'precio_compra' in data and data['precio_compra'] else None
        precio_venta = float(data['precio_venta']) if 'precio_venta' in data and data['precio_venta'] else None

        # Manejar carga de imagen
        image_path = None
        if 'imagen' in request.files:
            image_path = save_image(request.files['imagen'])

        insert_query = """
            INSERT INTO dolls (
                nombre, marca_id, fabricante_id, modelo, personaje, anyo, estado, 
                precio_compra, precio_venta, comentarios, imagen
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        values = (
            data['nombre'],
            data['marca_id'],
            fabricante_id,
            data.get('modelo'),
            data.get('personaje'),
            data.get('anyo'),
            data.get('estado', 'guardada'),
            precio_compra,
            precio_venta,
            data.get('comentarios'),
            image_path
        )
        
        doll_id = db.execute_insert(insert_query, values)
        return jsonify({"id": doll_id, "message": "Muñeca creada exitosamente"}), 201

    except ValidationError as e:
        logger.warning(f"Validación fallida al crear muñeca: {e}")
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Error agregando muñeca: {e}", exc_info=True)
        return jsonify({"error": "Error al crear muñeca"}), 500


@dolls_bp.route('/api/dolls/<int:doll_id>/lotes', methods=['GET'])
def get_doll_lotes(doll_id):
    """Obtiene los lotes asociados a una muñeca específica"""
    try:
        query = """
            SELECT l.*
            FROM lotes l
            JOIN lote_doll ld ON l.id = ld.lote_id
            WHERE ld.doll_id = %s
        """
        
        lotes = db.execute_query(query, (doll_id,), fetch_all=True)
        return jsonify(lotes), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo lotes para muñeca {doll_id}: {e}", exc_info=True)
        return jsonify({"error": "Error al obtener lotes"}), 500


@dolls_bp.route('/api/dolls/<int:doll_id>', methods=['PUT'])
def update_doll(doll_id):
    """Actualiza una muñeca existente"""
    try:
        data = request.form.to_dict()
        logger.info(f"Datos recibidos para actualizar: {data}")
        
        # Manejar carga de imagen
        if 'imagen' in request.files:
            # Obtener imagen actual
            old_query = "SELECT imagen FROM dolls WHERE id = %s"
            old_result = db.execute_query(old_query, (doll_id,), fetch_one=True)
            old_image = old_result['imagen'] if old_result else None
            
            # Guardar nueva imagen
            image_path = save_image(request.files['imagen'])
            if image_path:
                data['imagen'] = image_path
                # Borrar imagen antigua
                if old_image:
                    delete_image(old_image)

        # Construir query dinámicamente
        update_fields = []
        values = []
        for field in ['nombre', 'marca_id', 'fabricante_id', 'modelo', 'personaje', 
                     'anyo', 'estado', 'comentarios', 'precio_compra', 'precio_venta']:
            if field in data and data[field] != '':
                if field in ['precio_compra', 'precio_venta']:
                    value = float(data[field]) if data[field] else None
                else:
                    value = data[field]
                update_fields.append(f"{field} = %s")
                values.append(value)

        # Agregar actualización de imagen si está presente
        if 'imagen' in data:
            update_fields.append("imagen = %s")
            values.append(data['imagen'])

        if not update_fields:
            return jsonify({"error": "No hay campos para actualizar"}), 400

        values.append(doll_id)
        
        query = f"UPDATE dolls SET {', '.join(update_fields)} WHERE id = %s"
        logger.info(f"Query de actualización: {query}")
        logger.info(f"Valores: {values}")
        
        db.execute_update(query, values)
        
        # Obtener la muñeca actualizada
        select_query = """
            SELECT d.*, m.nombre as marca_nombre, f.nombre as fabricante_nombre
            FROM dolls d
            LEFT JOIN marca m ON d.marca_id = m.id
            LEFT JOIN fabricantes f ON d.fabricante_id = f.id
            WHERE d.id = %s
        """
        updated_doll = db.execute_query(select_query, (doll_id,), fetch_one=True)
        
        return jsonify(updated_doll), 200
        
    except Exception as e:
        logger.error(f"Error actualizando muñeca {doll_id}: {e}", exc_info=True)
        return jsonify({"error": "Error al actualizar muñeca"}), 500


@dolls_bp.route('/api/dolls/<int:doll_id>', methods=['DELETE'])
def delete_doll(doll_id):
    """Borra una muñeca y sus asociaciones"""
    try:
        # Obtener imagen para borrarla
        query = "SELECT imagen FROM dolls WHERE id = %s"
        doll = db.execute_query(query, (doll_id,), fetch_one=True)
        
        queries = [
            ("DELETE FROM lote_doll WHERE doll_id = %s", (doll_id,)),
            ("DELETE FROM dolls WHERE id = %s", (doll_id,))
        ]
        
        db.execute_transaction(queries)
        
        # Borrar imagen asociada
        if doll and doll['imagen']:
            delete_image(doll['imagen'])
        
        return jsonify({"message": "Muñeca borrada exitosamente"}), 200
        
    except Exception as e:
        logger.error(f"Error borrando muñeca {doll_id}: {e}", exc_info=True)
        return jsonify({"error": "Error al borrar muñeca"}), 500
