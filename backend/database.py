import pymysql
from pymysql.err import OperationalError
from config import DB_CONFIG
from utils.logger import get_logger

logger = get_logger(__name__)


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
                logger.debug(f"Ejecutando query: {query[:100]}...")
                cursor.execute(query, params)
                
                if fetch_one:
                    result = cursor.fetchone()
                    logger.debug(f"Query devolvió 1 resultado")
                    return result
                elif fetch_all:
                    results = cursor.fetchall()
                    logger.debug(f"Query devolvió {len(results) if results else 0} resultados")
                    return results
                else:
                    return None
                    
        except Exception as e:
            logger.error(f"Error ejecutando query: {e}", exc_info=True)
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
                logger.debug(f"Ejecutando INSERT: {query[:100]}...")
                cursor.execute(query, params)
                connection.commit()
                last_id = cursor.lastrowid
                logger.debug(f"INSERT exitoso, lastrowid: {last_id}")
                return last_id
        except Exception as e:
            if connection:
                connection.rollback()
            logger.error(f"Error en INSERT: {e}", exc_info=True)
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
                logger.debug(f"Ejecutando UPDATE/DELETE: {query[:100]}...")
                cursor.execute(query, params)
                connection.commit()
                rows_affected = cursor.rowcount
                logger.debug(f"UPDATE/DELETE exitoso, {rows_affected} filas afectadas")
                return rows_affected
        except Exception as e:
            if connection:
                connection.rollback()
            logger.error(f"Error en UPDATE: {e}", exc_info=True)
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
            logger.debug(f"Iniciando transacción con {len(queries_list)} queries")
            
            with connection.cursor() as cursor:
                results = []
                for idx, (query, params) in enumerate(queries_list):
                    logger.debug(f"Ejecutando query {idx+1}/{len(queries_list)} de transacción")
                    cursor.execute(query, params)
                    results.append({
                        'lastrowid': cursor.lastrowid,
                        'rowcount': cursor.rowcount
                    })
                
                connection.commit()
                logger.debug(f"Transacción completada exitosamente")
                return results
                
        except Exception as e:
            if connection:
                connection.rollback()
                logger.error(f"Error en transacción, rollback ejecutado: {e}", exc_info=True)
            raise
        finally:
            if connection:
                connection.close()
