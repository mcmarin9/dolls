from flask import Flask, request, jsonify, current_app, send_from_directory
from flask_cors import CORS
import pymysql
from pymysql.err import OperationalError
import logging
import os
import time
from werkzeug.utils import secure_filename

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = app.logger
logger.setLevel(logging.INFO)

# Configure file upload settings
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Enable debug mode
app.debug = True

# Configure CORS - Modificado para permitir acceso a las imágenes
CORS(app, resources={
    r"/*": {  # Cambiado de /api/* a /* para incluir /uploads
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Range", "X-Content-Range"],
        "supports_credentials": True
    }
})

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Modificada la ruta para servir imágenes
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        logger.error(f"Error serving image {filename}: {e}")
        return jsonify({"error": "Image not found"}), 404

def get_db_connection():
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            database='dolls_db',
            cursorclass=pymysql.cursors.DictCursor
        )
        print("Database connection successful!")
        return connection
    except OperationalError as e:
        print("Database connection failed!")
        logger.error(f"Database connection failed: {e}")
        return None

@app.route('/api/marcas', methods=['GET'])
def get_marcas():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, nombre FROM marca")
            marcas = cursor.fetchall()
            return jsonify(marcas)
    except Exception as e:
        logger.error(f"Error fetching marcas: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Update get_dolls route to include lotes information
@app.route('/api/dolls', methods=['GET'])
def get_dolls():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT 
                    d.id,
                    d.nombre,
                    d.marca_id,
                    d.modelo,
                    d.personaje,
                    d.anyo,
                    d.estado,
                    d.precio_compra,
                    d.precio_venta,
                    d.comentarios,
                    d.imagen,
                    d.created_at,
                    m.nombre AS marca_nombre,
                    GROUP_CONCAT(DISTINCT l.id) as lote_ids,
                    GROUP_CONCAT(DISTINCT l.nombre) as lote_nombres
                FROM dolls d
                LEFT JOIN marca m ON d.marca_id = m.id
                LEFT JOIN lote_doll ld ON d.id = ld.doll_id
                LEFT JOIN lotes l ON ld.lote_id = l.id
                GROUP BY d.id
            """)
            dolls = cursor.fetchall()
            
            # Process lotes data
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
                    
                # Remove unnecessary fields
                del doll['lote_ids']
                del doll['lote_nombres']
                
            return jsonify(dolls)
    except Exception as e:
        logger.error(f"Error in get_dolls: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()


@app.route('/api/dolls', methods=['POST'])
def add_doll():
    connection = get_db_connection()
    try:
        data = request.form.to_dict()
        required_fields = ['nombre', 'marca_id', 'modelo', 'personaje', 'anyo']

        # Validar campos requeridos
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos requeridos: {', '.join(missing_fields)}"}), 400

        # Manejar carga de imágenes
        image_path = None
        if 'imagen' in request.files:
            file = request.files['imagen']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                image_path = f'/uploads/{filename}'

        with connection.cursor() as cursor:
            # Insertar muñeca en la tabla `dolls`
            cursor.execute("""
                INSERT INTO dolls (
                    nombre, marca_id, modelo, personaje, anyo, estado, precio_compra, precio_venta, comentarios, imagen
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                data['nombre'],
                data['marca_id'],
                data['modelo'],
                data['personaje'],
                data['anyo'],
                data.get('estado', 'guardada'),  # Por defecto 'guardada'
                data.get('precio_compra'),
                data.get('precio_venta'),
                data.get('comentarios'),
                image_path
            ))
        
        connection.commit()
        return jsonify({"message": "Doll created successfully"}), 201

    except Exception as e:
        connection.rollback()
        logger.error(f"Error adding doll: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@app.route('/api/dolls/<int:doll_id>/lotes', methods=['GET'])
def get_doll_lotes(doll_id):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT l.*
                FROM lotes l
                JOIN lote_doll ld ON l.id = ld.lote_id
                WHERE ld.doll_id = %s
            """, (doll_id,))
            
            lotes = cursor.fetchall()
            return jsonify(lotes)
            
    except Exception as e:
        logger.error(f"Error fetching lotes for doll {doll_id}: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Add this new route for getting lotes
@app.route('/api/lotes', methods=['GET'])
def get_lotes():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # First get all lotes
            query = """
                SELECT l.*, 
                       GROUP_CONCAT(d.id) as doll_ids,
                       COUNT(d.id) as doll_count
                FROM lotes l
                LEFT JOIN lote_doll ld ON l.id = ld.lote_id
                LEFT JOIN dolls d ON ld.doll_id = d.id
                GROUP BY l.id
            """
            cursor.execute(query)
            lotes = cursor.fetchall()
            
            # For each lote, get its dolls
            for lote in lotes:
                if lote['doll_ids']:
                    cursor.execute("""
                        SELECT d.*, m.nombre as marca_nombre
                        FROM dolls d
                        JOIN marca m ON d.marca_id = m.id
                        WHERE d.id IN (%s)
                    """ % lote['doll_ids'])
                    lote['dolls'] = cursor.fetchall()
                else:
                    lote['dolls'] = []
                
                del lote['doll_ids']
                del lote['doll_count']
                
            return jsonify(lotes)
    except Exception as e:
        logger.error(f"Error fetching lotes: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()


@app.route('/api/lotes', methods=['POST'])
def add_lote():
    connection = get_db_connection()
    try:
        data = request.get_json()

        # Validación básica
        required_fields = ['nombre', 'tipo', 'precio_total', 'dolls']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        if data['tipo'] not in ['compra', 'venta']:
            return jsonify({"error": "El tipo de lote debe ser 'compra' o 'venta'"}), 400

        if float(data['precio_total']) <= 0:
            return jsonify({"error": "El precio total debe ser mayor que 0"}), 400

        if not isinstance(data['dolls'], list) or len(data['dolls']) < 2:
            return jsonify({"error": "Un lote debe contener al menos 2 muñecas"}), 400

        connection.begin()

        with connection.cursor() as cursor:
            # Insertar el lote
            cursor.execute("""
                INSERT INTO lotes (nombre, tipo, precio_total)
                VALUES (%s, %s, %s)
            """, (data['nombre'], data['tipo'], data['precio_total']))

            lote_id = cursor.lastrowid

            # Validar que las muñecas no estén en otros lotes del mismo tipo
            cursor.execute("""
                SELECT d.nombre 
                FROM dolls d 
                JOIN lote_doll ld ON d.id = ld.doll_id
                JOIN lotes l ON ld.lote_id = l.id
                WHERE d.id IN %s AND l.tipo = %s
            """, (tuple(data['dolls']), data['tipo']))

            existing = cursor.fetchone()
            if existing:
                connection.rollback()
                return jsonify({
                    "error": f"La muñeca '{existing['nombre']}' ya está en otro lote del mismo tipo"
                }), 400

            # Asociar las muñecas al lote
            for doll_id in data['dolls']:
                cursor.execute("""
                    INSERT INTO lote_doll (lote_id, doll_id)
                    VALUES (%s, %s)
                """, (lote_id, doll_id))

            # Calcular y asignar el precio individual por muñeca
            precio_por_doll = float(data['precio_total']) / len(data['dolls'])
            for doll_id in data['dolls']:
                if data['tipo'] == 'compra':
                    cursor.execute("""
                        UPDATE dolls
                        SET precio_compra = %s
                        WHERE id = %s
                    """, (precio_por_doll, doll_id))
                else:
                    cursor.execute("""
                        UPDATE dolls
                        SET precio_venta = %s
                        WHERE id = %s
                    """, (precio_por_doll, doll_id))

            connection.commit()
            return jsonify({"id": lote_id, "message": "Lote creado con éxito"}), 201

    except Exception as e:
        connection.rollback()
        logger.error(f"Error creating lote: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()


@app.route('/api/lotes/<int:lote_id>', methods=['DELETE'])
def delete_lote(lote_id):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # First delete from lote_doll table
            cursor.execute("DELETE FROM lote_doll WHERE lote_id = %s", (lote_id,))
            # Then delete the lote
            cursor.execute("DELETE FROM lotes WHERE id = %s", (lote_id,))
            connection.commit()
            return jsonify({"message": "Lote deleted successfully"}), 200
    except Exception as e:
        connection.rollback()
        logger.error(f"Error deleting lote: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()        

@app.route('/api/dolls/<int:doll_id>', methods=['PUT', 'OPTIONS'])
def update_doll(doll_id):
    if request.method == 'OPTIONS':
        return '', 200
        
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        data = request.form.to_dict()
        
        # Handle image upload
        image_path = None
        if 'imagen' in request.files:
            file = request.files['imagen']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                image_path = f'/uploads/{filename}'
                data['imagen'] = image_path

        # Build update query dynamically
        update_fields = []
        values = []
        for field in ['nombre', 'marca_id', 'modelo', 'personaje', 'anyo', 'estado', 'comentarios']:
            if field in data:
                update_fields.append(f"{field} = %s")
                values.append(data[field])
        
        if image_path:
            update_fields.append("imagen = %s")
            values.append(image_path)

        if not update_fields:
            return jsonify({"error": "No fields to update"}), 400

        # Add doll_id to values
        values.append(doll_id)
        
        # Execute update query
        with connection.cursor() as cursor:
            query = f"UPDATE dolls SET {', '.join(update_fields)} WHERE id = %s"
            cursor.execute(query, values)
            connection.commit()
            
            # Fetch updated doll
            cursor.execute("""
                SELECT d.*, m.nombre as marca_nombre
                FROM dolls d
                LEFT JOIN marca m ON d.marca_id = m.id
                WHERE d.id = %s
            """, (doll_id,))
            updated_doll = cursor.fetchone()
            
            return jsonify(updated_doll), 200
            
    except Exception as e:
        connection.rollback()
        logger.error(f"Error updating doll: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@app.route('/api/dolls/<int:doll_id>', methods=['DELETE'])
def delete_doll(doll_id):
    connection = get_db_connection()
    try:
        connection.begin()
        with connection.cursor() as cursor:
            # Eliminar asociaciones en lote_doll
            cursor.execute("DELETE FROM lote_doll WHERE doll_id = %s", (doll_id,))
            # Eliminar la muñeca
            cursor.execute("DELETE FROM dolls WHERE id = %s", (doll_id,))
        connection.commit()
        return jsonify({"message": "Doll deleted successfully"}), 200
    except Exception as e:
        connection.rollback()
        logger.error(f"Error deleting doll: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()


@app.route('/api/lotes/<int:lote_id>/dolls', methods=['GET'])
def get_lote_dolls(lote_id):
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            # Actualizamos la consulta para que no dependa de la tabla `transacciones`
            cursor.execute("""
                SELECT d.*, m.nombre as marca_nombre
                FROM dolls d
                JOIN marca m ON d.marca_id = m.id
                JOIN lote_doll ld ON d.id = ld.doll_id
                WHERE ld.lote_id = %s
            """, (lote_id,))
            
            dolls = cursor.fetchall()
            return jsonify(dolls)
            
    except Exception as e:
        logger.error(f"Error fetching dolls for lote {lote_id}: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@app.route('/api/lotes/<int:lote_id>', methods=['PUT'])
def update_lote(lote_id):
    connection = get_db_connection()
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['nombre', 'tipo', 'precio_total', 'dolls']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
            
        if data['tipo'] not in ['compra', 'venta']:
            return jsonify({"error": "Invalid lote type"}), 400
            
        connection.begin()
        with connection.cursor() as cursor:
            # Update lote basic info
            cursor.execute("""
                UPDATE lotes 
                SET nombre = %s, tipo = %s, precio_total = %s
                WHERE id = %s
            """, (data['nombre'], data['tipo'], data['precio_total'], lote_id))
            
            # Remove old doll associations
            cursor.execute("DELETE FROM lote_doll WHERE lote_id = %s", (lote_id,))
            
            # Add new doll associations
            precio_por_doll = float(data['precio_total']) / len(data['dolls'])
            for doll_id in data['dolls']:
                cursor.execute("""
                    INSERT INTO lote_doll (lote_id, doll_id)
                    VALUES (%s, %s)
                """, (lote_id, doll_id))
                
                # Update doll prices
                if data['tipo'] == 'compra':
                    cursor.execute("""
                        UPDATE dolls
                        SET precio_compra = %s
                        WHERE id = %s
                    """, (precio_por_doll, doll_id))
                else:
                    cursor.execute("""
                        UPDATE dolls
                        SET precio_venta = %s
                        WHERE id = %s
                    """, (precio_por_doll, doll_id))
            
            connection.commit()
            return jsonify({"message": "Lote updated successfully"}), 200
            
    except Exception as e:
        connection.rollback()
        logger.error(f"Error updating lote: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()
        
        # Add after the existing GET /api/marcas route

@app.route('/api/marcas', methods=['POST'])
def add_marca():
    connection = get_db_connection()
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'nombre' not in data:
            return jsonify({"error": "El nombre de la marca es requerido"}), 400
            
        # Insert new marca
        with connection.cursor() as cursor:
            sql = """
                INSERT INTO marca (nombre, fabricante)
                VALUES (%s, %s)
            """
            cursor.execute(sql, (
                data['nombre'],
                data.get('fabricante')  # Optional field
            ))
            
        connection.commit()
        return jsonify({
            "id": cursor.lastrowid,
            "message": "Marca created successfully"
        }), 201
        
    except Exception as e:
        logger.error(f"Error creating marca: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()

            import os
import os

@app.route('/api/delete-image', methods=['POST'])
def delete_image():
    try:
        data = request.json
        image_path = data.get('imagePath')
        if not image_path:
            return jsonify({'error': 'No image path provided'}), 400
            
        full_path = os.path.join(app.root_path, image_path.lstrip('/'))
        if os.path.exists(full_path):
            os.remove(full_path)
            return jsonify({'message': 'Image deleted successfully'})
        return jsonify({'error': 'Image not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
if __name__ == '__main__':
    app.run(debug=True)


