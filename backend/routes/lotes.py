from flask import Blueprint, request, jsonify
import logging
from database import Database
from utils import LoteValidator, ValidationError

lotes_bp = Blueprint('lotes', __name__)
db = Database()
logger = logging.getLogger(__name__)


@lotes_bp.route('/api/lotes', methods=['GET'])
def get_lotes():
    """Obtiene todos los lotes con sus muñecas asociadas"""
    try:
        query = """
            SELECT l.*, 
                   GROUP_CONCAT(d.id) as doll_ids,
                   COUNT(d.id) as doll_count
            FROM lotes l
            LEFT JOIN lote_doll ld ON l.id = ld.lote_id
            LEFT JOIN dolls d ON ld.doll_id = d.id
            GROUP BY l.id
        """
        
        lotes = db.execute_query(query, fetch_all=True)
        
        # Para cada lote, obtener sus muñecas
        for lote in lotes:
            if lote['doll_ids']:
                doll_ids_list = lote['doll_ids'].split(',')
                placeholders = ','.join(['%s'] * len(doll_ids_list))
                
                doll_query = f"""
                    SELECT d.*, m.nombre as marca_nombre
                    FROM dolls d
                    JOIN marca m ON d.marca_id = m.id
                    WHERE d.id IN ({placeholders})
                """
                lote['dolls'] = db.execute_query(doll_query, tuple(doll_ids_list), fetch_all=True)
            else:
                lote['dolls'] = []
            
            del lote['doll_ids']
            del lote['doll_count']
        
        return jsonify(lotes), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo lotes: {e}")
        return jsonify({"error": str(e)}), 500


@lotes_bp.route('/api/lotes', methods=['POST'])
def add_lote():
    """Crea un nuevo lote con muñecas asociadas"""
    try:
        data = request.get_json()

        # Validación básica
        LoteValidator.validate(data)

        if data['tipo'] not in ['compra', 'venta']:
            return jsonify({"error": "El tipo de lote debe ser 'compra' o 'venta'"}), 400

        if float(data['precio_base']) <= 0:
            return jsonify({"error": "El precio base debe ser mayor que 0"}), 400

        if not isinstance(data.get('dolls'), list) or len(data['dolls']) < 2:
            return jsonify({"error": "Un lote debe contener al menos 2 muñecas"}), 400

        # Validar que las muñecas no estén en otros lotes del mismo tipo
        check_query = """
            SELECT d.nombre 
            FROM dolls d 
            JOIN lote_doll ld ON d.id = ld.doll_id
            JOIN lotes l ON ld.lote_id = l.id
            WHERE d.id IN %s AND l.tipo = %s
            LIMIT 1
        """
        
        placeholders = ','.join(['%s'] * len(data['dolls']))
        check_query_filled = check_query.replace('%s', placeholders, 1)
        existing = db.execute_query(
            check_query_filled, 
            tuple(data['dolls']) + (data['tipo'],),
            fetch_one=True
        )

        if existing:
            return jsonify({
                "error": f"La muñeca '{existing['nombre']}' ya está en otro lote del mismo tipo"
            }), 400

        # Crear el lote
        insert_query = """
            INSERT INTO lotes (nombre, tipo, numero_referencia, cantidad, precio_base, precio_venta)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        
        values = (
            data['nombre'],
            data['tipo'],
            data.get('numero_referencia', ''),
            len(data['dolls']),
            data['precio_base'],
            data.get('precio_venta', data['precio_base'])
        )
        
        lote_id = db.execute_insert(insert_query, values)
        
        # Asociar muñecas al lote
        precio_por_doll = float(data['precio_base']) / len(data['dolls'])
        for doll_id in data['dolls']:
            # Insertar en lote_doll
            doll_lote_query = """
                INSERT INTO lote_doll (lote_id, doll_id)
                VALUES (%s, %s)
            """
            db.execute_insert(doll_lote_query, (lote_id, doll_id))
            
            # Actualizar precio y estado de la muñeca
            if data['tipo'] == 'compra':
                update_query = """
                    UPDATE dolls
                    SET precio_compra = %s
                    WHERE id = %s
                """
                db.execute_update(update_query, (precio_por_doll, doll_id))
            else:  # tipo venta
                update_query = """
                    UPDATE dolls
                    SET precio_venta = %s, estado = 'vendida'
                    WHERE id = %s
                """
                db.execute_update(update_query, (precio_por_doll, doll_id))
        
        return jsonify({"id": lote_id, "message": "Lote creado con éxito"}), 201

    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        logger.error(f"Error creando lote: {e}")
        return jsonify({"error": str(e)}), 500


@lotes_bp.route('/api/lotes/<int:lote_id>/dolls', methods=['GET'])
def get_lote_dolls(lote_id):
    """Obtiene las muñecas de un lote específico"""
    try:
        query = """
            SELECT d.*, m.nombre as marca_nombre
            FROM dolls d
            JOIN marca m ON d.marca_id = m.id
            JOIN lote_doll ld ON d.id = ld.doll_id
            WHERE ld.lote_id = %s
        """
        
        dolls = db.execute_query(query, (lote_id,), fetch_all=True)
        return jsonify(dolls), 200
        
    except Exception as e:
        logger.error(f"Error obteniendo muñecas del lote {lote_id}: {e}")
        return jsonify({"error": str(e)}), 500


@lotes_bp.route('/api/lotes/<int:lote_id>', methods=['PUT'])
def update_lote(lote_id):
    """Actualiza un lote existente"""
    try:
        data = request.get_json()
        
        # Validación de campos requeridos
        if not all(field in data for field in ['nombre', 'tipo', 'precio_base', 'dolls']):
            return jsonify({"error": "Campos requeridos faltando"}), 400
            
        if data['tipo'] not in ['compra', 'venta']:
            return jsonify({"error": "Tipo de lote inválido"}), 400

        # Actualizar detalles del lote
        update_query = """
            UPDATE lotes 
            SET nombre = %s, tipo = %s, precio_base = %s, cantidad = %s
            WHERE id = %s
        """
        db.execute_update(
            update_query,
            (data['nombre'], data['tipo'], data['precio_base'], len(data['dolls']), lote_id)
        )
        
        # Obtener muñecas antiguas del lote para restaurar su estado
        old_query = """
            SELECT d.id
            FROM dolls d
            JOIN lote_doll ld ON d.id = ld.doll_id
            WHERE ld.lote_id = %s
        """
        old_dolls = db.execute_query(old_query, (lote_id,), fetch_all=True)
        
        for old_doll in old_dolls:
            reset_query = """
                UPDATE dolls
                SET estado = 'guardada', precio_venta = NULL
                WHERE id = %s
            """
            db.execute_update(reset_query, (old_doll['id'],))
        
        # Eliminar asociaciones antiguas
        delete_query = "DELETE FROM lote_doll WHERE lote_id = %s"
        db.execute_update(delete_query, (lote_id,))
        
        # Agregar nuevas asociaciones de muñecas
        precio_por_doll = float(data['precio_base']) / len(data['dolls'])
        for doll_id in data['dolls']:
            # Insertar en lote_doll
            insert_query = """
                INSERT INTO lote_doll (lote_id, doll_id)
                VALUES (%s, %s)
            """
            db.execute_insert(insert_query, (lote_id, doll_id))
            
            # Actualizar precios y estado de la muñeca
            if data['tipo'] == 'compra':
                update_doll_query = """
                    UPDATE dolls
                    SET precio_compra = %s
                    WHERE id = %s
                """
                db.execute_update(update_doll_query, (precio_por_doll, doll_id))
            else:  # tipo venta
                update_doll_query = """
                    UPDATE dolls
                    SET precio_venta = %s, estado = 'vendida'
                    WHERE id = %s
                """
                db.execute_update(update_doll_query, (precio_por_doll, doll_id))
        
        return jsonify({"message": "Lote actualizado exitosamente"}), 200
        
    except Exception as e:
        logger.error(f"Error actualizando lote: {e}")
        return jsonify({"error": str(e)}), 500


@lotes_bp.route('/api/lotes/<int:lote_id>', methods=['DELETE'])
def delete_lote(lote_id):
    """Borra un lote y restaura los estados de las muñecas"""
    try:
        # Obtener las muñecas del lote para restaurar estados
        query = "SELECT doll_id FROM lote_doll WHERE lote_id = %s"
        doll_associations = db.execute_query(query, (lote_id,), fetch_all=True)
        
        # Restaurar estado de las muñecas
        for assoc in doll_associations:
            reset_query = """
                UPDATE dolls
                SET estado = 'guardada', precio_venta = NULL
                WHERE id = %s
            """
            db.execute_update(reset_query, (assoc['doll_id'],))
        
        # Eliminar lote
        queries = [
            ("DELETE FROM lote_doll WHERE lote_id = %s", (lote_id,)),
            ("DELETE FROM lotes WHERE id = %s", (lote_id,))
        ]
        
        db.execute_transaction(queries)
        return jsonify({"message": "Lote borrado exitosamente"}), 200
        
    except Exception as e:
        logger.error(f"Error borrando lote: {e}")
        return jsonify({"error": str(e)}), 500
