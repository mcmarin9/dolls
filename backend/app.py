from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
import pymysql
from pymysql.err import OperationalError
import logging

# Initialize Flask app first
app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = app.logger
logger.setLevel(logging.INFO)

# Enable debug mode
app.debug = True


# Configure CORS
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Range", "X-Content-Range"],
        "supports_credentials": True
    }
})

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
    
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route('/api/dolls', methods=['GET'])
def get_dolls():
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with connection.cursor() as cursor:
            # Get all dolls with optional filtering
            query = """
                SELECT id, nombre, marca, modelo, personaje, anyo, 
                       estado, commentarios, imagen, created_at 
                FROM dolls
            """
            
            # Add filters if provided in query parameters
            filters = []
            params = []
            
            if request.args.get('estado'):
                filters.append("estado = %s")
                params.append(request.args.get('estado'))
            
            if request.args.get('marca'):
                filters.append("marca = %s")
                params.append(request.args.get('marca'))
                
            if filters:
                query += " WHERE " + " AND ".join(filters)
            
            cursor.execute(query, params)
            dolls = cursor.fetchall()
            
            # Convert datetime objects to string for JSON serialization
            for doll in dolls:
                if doll['created_at']:
                    doll['created_at'] = doll['created_at'].isoformat()
                    
            return jsonify(dolls)
            
    except Exception as e:
        logger.error(f"Error fetching dolls: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        connection.close()

@app.route('/api/dolls', methods=['POST'])
def add_doll():
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        data = request.get_json()
        required_fields = ['nombre', 'marca', 'modelo', 'personaje', 'anyo', 'estado']
        
        # Validate required fields
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        with connection.cursor() as cursor:
            query = """
                INSERT INTO dolls (nombre, marca, modelo, personaje, anyo, estado, commentarios, imagen)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            
            cursor.execute(query, (
                data['nombre'],
                data['marca'],
                data['modelo'],
                data['personaje'],
                data['anyo'],
                data['estado'],
                data.get('commentarios', None),  # Optional field
                data.get('imagen', None)         # Optional field
            ))
            
            connection.commit()
            
            # Return the newly created doll
            new_doll_id = cursor.lastrowid
            cursor.execute("SELECT * FROM dolls WHERE id = %s", (new_doll_id,))
            new_doll = cursor.fetchone()
            
            # Convert datetime objects to string for JSON serialization
            if new_doll['created_at']:
                new_doll['created_at'] = new_doll['created_at'].isoformat()
                
            return jsonify(new_doll), 201
            
    except Exception as e:
        logger.error(f"Error adding doll: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
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
        
if __name__ == '__main__':
    app.run(debug=True)


