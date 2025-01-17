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

@app.route('/api/dolls', methods=['GET'])
def get_dolls():
    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT d.*, m.nombre as marca_nombre
                FROM dolls d
                JOIN marca m ON d.marca_id = m.id
            """)
            dolls = cursor.fetchall()
            
            # Modificar las URLs de las imágenes y convertir fechas
            for doll in dolls:
                if doll.get('created_at'):
                    doll['created_at'] = doll['created_at'].isoformat()
                    
            return jsonify(dolls)
    except Exception as e:
        logger.error(f"Error fetching dolls: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if connection:
            connection.close()
            
@app.route('/api/dolls', methods=['POST'])
def add_doll():
    connection = get_db_connection()
    try:
        # Debug incoming request
        print("Request Method:", request.method)
        print("Content-Type:", request.headers.get('Content-Type'))
        print("Raw form data:", request.form)
        print("Files:", request.files)
        
        # Get form data
        data = request.form.to_dict()
        print("Processed data:", data)
        
        # Validate required fields
        required_fields = ['nombre', 'marca_id', 'modelo', 'personaje', 'anyo', 'estado']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({
                "error": f"Missing required fields: {', '.join(missing_fields)}",
                "received_data": data
            }), 400
            
        # Handle image upload
        image_path = None
        if 'imagen' in request.files:
            file = request.files['imagen']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                image_path = f'/uploads/{filename}'
        
        # Insert into database
        with connection.cursor() as cursor:
            sql = """
                INSERT INTO dolls (nombre, marca_id, modelo, personaje, anyo, estado, commentarios, imagen)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data['nombre'],
                data['marca_id'],
                data['modelo'],
                data['personaje'],
                data['anyo'],
                data['estado'],
                data.get('commentarios'),
                image_path
            ))
            
        connection.commit()
        return jsonify({"message": "Doll created successfully"}), 201
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500
        
    finally:
        if connection:
            connection.close()
    connection = get_db_connection()
    try:
        # Debug logging
        print("Raw form data:", request.form)
        print("Files:", request.files)
        
        # Validate required fields
        required_fields = ['nombre', 'marca_id', 'modelo', 'personaje', 'anyo', 'estado']
        data = request.form.to_dict()
        
        print("Processed data:", data)
        
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
            
        # Handle image upload
        image_path = None
        if 'imagen' in request.files:
            file = request.files['imagen']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                image_path = f'/uploads/{filename}'
        
        # Insert into database
        with connection.cursor() as cursor:
            sql = """
                INSERT INTO dolls (nombre, marca_id, modelo, personaje, anyo, estado, commentarios, imagen)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(sql, (
                data['nombre'],
                data['marca_id'],
                data['modelo'],
                data['personaje'],
                data['anyo'],
                data['estado'],
                data.get('commentarios'),
                image_path
            ))
            
        connection.commit()
        return jsonify({"message": "Doll created successfully"}), 201
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500
        
    finally:
        if connection:
            connection.close()
            

# Add this new route for getting lotes
@app.route('/api/lotes', methods=['GET'])
def get_lotes():
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with connection.cursor() as cursor:
            query = "SELECT * FROM lotes"
            cursor.execute(query)
            lotes = cursor.fetchall()
            return jsonify(lotes)
    except Exception as e:
        logger.error(f"Error fetching lotes: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

# Modify the existing add_lote function
@app.route('/api/lotes', methods=['POST'])
def add_lote():
    connection = get_db_connection()
    try:
        data = request.get_json()
        
        # Detailed request debugging
        logger.info("Request Headers: %s", request.headers)
        logger.info("Raw Request Data: %s", request.get_data())
        logger.info("Parsed JSON Data: %s", data)
        
        # Validate data structure
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        # Validate required fields
        required_fields = ['nombre', 'type', 'total_price', 'dolls']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400
        
        # Validate type enum
        if data.get('type') not in ['compra', 'venta']:
            return jsonify({"error": "El tipo debe ser 'compra' o 'venta'"}), 400
            
        # Validate dolls array
        if not isinstance(data.get('dolls', []), list):
            return jsonify({"error": "Dolls must be an array"}), 400
            
        # Previous validation
        if not data.get('dolls') or len(data.get('dolls')) < 2:
            return jsonify({
                "error": "Un lote debe contener al menos 2 muñecas"
            }), 400
            
            
        connection.begin()  # Start transaction
        
        with connection.cursor() as cursor:
            # Insert lote
            cursor.execute("""
                INSERT INTO lotes (nombre, type, total_price, quantity)
                VALUES (%s, %s, %s, %s)
            """, (data['nombre'], data['type'], data['total_price'], len(data['dolls'])))
            
            lote_id = cursor.lastrowid
            
            # Validate dolls aren't in lotes of same type
            cursor.execute("""
                SELECT l.type, d.nombre 
                FROM lotes l 
                JOIN lote_doll ld ON l.id = ld.lote_id 
                JOIN dolls d ON d.id = ld.doll_id 
                WHERE ld.doll_id IN %s AND l.type = %s
            """, (tuple(data['dolls']), data['type']))
            
            existing = cursor.fetchone()
            if existing:
                connection.rollback()
                return jsonify({
                    "error": f"La muñeca '{existing['nombre']}' ya está en un lote de {data['type']}"
                }), 400
            
            # Insert doll associations
            for doll_id in data['dolls']:
                cursor.execute("""
                    INSERT INTO lote_doll (lote_id, doll_id) 
                    VALUES (%s, %s)
                """, (lote_id, doll_id))
            
            connection.commit()
            return jsonify({"id": lote_id, "message": "Lote created successfully"}), 201
            
    except Exception as e:
        connection.rollback()
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
        data = request.get_json()
        lote_id = data['lote_id']
        
        connection.begin()  # Start transaction
        with connection.cursor() as cursor:
            # First, get the type of the new lote
            cursor.execute("SELECT type FROM lotes WHERE id = %s", (lote_id,))
            new_lote = cursor.fetchone()
            if not new_lote:
                connection.rollback()
                return jsonify({"error": "Lote not found"}), 404
            
            new_lote_type = new_lote['type']
            
            # Check if doll is already in a lote of the same type
            query = """
                SELECT l.type, d.nombre 
                FROM lotes l 
                JOIN lote_doll ld ON l.id = ld.lote_id 
                JOIN dolls d ON d.id = ld.doll_id 
                WHERE ld.doll_id = %s AND l.type = %s
            """
            cursor.execute(query, (doll_id, new_lote_type))
            existing_lote = cursor.fetchone()
            
            if existing_lote:
                connection.rollback()
                doll_name = existing_lote['nombre']
                return jsonify({
                    "error": f"La muñeca '{doll_name}' ya está en un lote de {new_lote_type}"
                }), 400
            
            # If validation passes, insert into lote_doll
            query = "INSERT INTO lote_doll (lote_id, doll_id) VALUES (%s, %s)"
            cursor.execute(query, (lote_id, doll_id))
            connection.commit()
            
            return jsonify({"message": "Doll added to lote successfully"}), 200
            
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
        with connection.cursor() as cursor:
            # First delete from lote_doll table to maintain referential integrity
            cursor.execute("DELETE FROM lote_doll WHERE doll_id = %s", (doll_id,))
            # Then delete the doll
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
            cursor.execute("""
                SELECT d.*, m.nombre as marca_nombre
                FROM dolls d
                JOIN marca m ON d.marca_id = m.id
                JOIN lote_doll ld ON d.id = ld.doll_id
                WHERE ld.lote_id = %s
            """, (lote_id,))
            
            dolls = cursor.fetchall()
            
            for doll in dolls:
                if doll.get('created_at'):
                    doll['created_at'] = doll['created_at'].isoformat()
                    
            return jsonify(dolls)
            
    except Exception as e:
        logger.error(f"Error fetching dolls for lote {lote_id}: {e}")
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
        
if __name__ == '__main__':
    app.run(debug=True)


