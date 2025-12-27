import pymysql
from pymysql.err import OperationalError
import logging
from config import DB_CONFIG

logger = logging.getLogger(__name__)


class Database:
    """Clase para manejar conexiones a la base de datos"""
    
    @staticmethod
    def get_connection():
        """Obtiene una conexión a la base de datos"""
        try:
            connection = pymysql.connect(
                host=DB_CONFIG['host'],
                user=DB_CONFIG['user'],
                password=DB_CONFIG['password'],
                database=DB_CONFIG['database'],
                cursorclass=pymysql.cursors.DictCursor
            )
            logger.info("Conexión a base de datos exitosa")
            return connection
        except OperationalError as e:
            logger.error(f"Error al conectar a la base de datos: {e}")
            raise
    
    @staticmethod
    def execute_query(query, params=None, fetch_one=False, fetch_all=True):
        """
        Ejecuta una query y retorna los resultados
        
        Args:
            query: Query SQL
            params: Parámetros para la query (tupla o lista)
            fetch_one: Si True, retorna solo un resultado
            fetch_all: Si True, retorna todos los resultados (ignorado si fetch_one=True)
        """
        connection = None
        try:
            connection = Database.get_connection()
            with connection.cursor() as cursor:
                cursor.execute(query, params)
                
                if fetch_one:
                    return cursor.fetchone()
                elif fetch_all:
                    return cursor.fetchall()
                else:
                    return None
                    
        except Exception as e:
            logger.error(f"Error ejecutando query: {e}")
            raise
        finally:
            if connection:
                connection.close()
    
    @staticmethod
    def execute_insert(query, params=None):
        """Ejecuta un INSERT y retorna el ID insertado"""
        connection = None
        try:
            connection = Database.get_connection()
            with connection.cursor() as cursor:
                cursor.execute(query, params)
                connection.commit()
                return cursor.lastrowid
        except Exception as e:
            if connection:
                connection.rollback()
            logger.error(f"Error en INSERT: {e}")
            raise
        finally:
            if connection:
                connection.close()
    
    @staticmethod
    def execute_update(query, params=None):
        """Ejecuta un UPDATE o DELETE"""
        connection = None
        try:
            connection = Database.get_connection()
            with connection.cursor() as cursor:
                cursor.execute(query, params)
                connection.commit()
                return cursor.rowcount
        except Exception as e:
            if connection:
                connection.rollback()
            logger.error(f"Error en UPDATE: {e}")
            raise
        finally:
            if connection:
                connection.close()
    
    @staticmethod
    def execute_transaction(queries_list):
        """
        Ejecuta múltiples queries en una transacción
        
        Args:
            queries_list: Lista de tuplas (query, params)
        """
        connection = None
        try:
            connection = Database.get_connection()
            connection.begin()
            
            with connection.cursor() as cursor:
                results = []
                for query, params in queries_list:
                    cursor.execute(query, params)
                    results.append({
                        'lastrowid': cursor.lastrowid,
                        'rowcount': cursor.rowcount
                    })
                
                connection.commit()
                return results
                
        except Exception as e:
            if connection:
                connection.rollback()
            logger.error(f"Error en transacción: {e}")
            raise
        finally:
            if connection:
                connection.close()
