# Backend Refactoring - Documentación de Estructura

## Resumen de Cambios

El backend ha sido refactorizado de un archivo monolítico de 738 líneas a una arquitectura modular y escalable.

### Antes
- **app.py**: 738 líneas con toda la lógica

### Después
- **app.py**: 50 líneas (solo inicialización y blueprints)
- **config.py**: Configuración centralizada con variables de entorno
- **database.py**: Clase Database para abstracción de operaciones BD
- **utils/**: Módulos reutilizables (manejo de imágenes, validaciones)
- **routes/**: Blueprints organizados por característica (dolls, lotes, marcas, images)

## Estructura de Carpetas

```
backend/
├── app.py                 # Flask app principal
├── config.py             # Configuración y variables de entorno
├── database.py           # Clase Database para abstraer conexiones
├── requirements.txt      # Dependencias Python
├── .env                  # Variables de entorno (no versionado)
├── uploads/              # Directorio para imágenes
├── utils/
│   ├── __init__.py
│   ├── image_handler.py  # Optimización y gestión de imágenes
│   └── validators.py     # Clases de validación para Doll, Lote, Marca, Fabricante
└── routes/
    ├── __init__.py
    ├── images.py         # Endpoints para servir y borrar imágenes
    ├── dolls.py          # CRUD de muñecas
    ├── lotes.py          # CRUD de lotes
    └── marcas.py         # CRUD de marcas y fabricantes
```

## Módulos Principales

### app.py
- Inicializa Flask
- Configura CORS
- Registra blueprints
- Define route de salud (/api/health)
- **Responsabilidad**: Punto de entrada único y configuración global

### config.py
- Carga variables de .env con python-dotenv
- Centraliza DB_CONFIG, UPLOAD_FOLDER, ALLOWED_EXTENSIONS
- Define constantes como IMAGE_MAX_SIZE, IMAGE_QUALITY
- **Responsabilidad**: Configuración centralizada

### database.py
- Clase `Database` con métodos:
  - `get_connection()`: Obtiene conexión a BD
  - `execute_query()`: SELECT queries
  - `execute_insert()`: INSERT con lastrowid
  - `execute_update()`: UPDATE/DELETE
  - `execute_transaction()`: Transacciones multi-query
- **Responsabilidad**: Abstracción de operaciones de base de datos

### utils/image_handler.py
- `allowed_file()`: Valida extensiones
- `optimize_image()`: Redimensiona y comprime
- `save_image()`: Guarda imagen optimizada
- `delete_image()`: Borra imagen del servidor
- **Responsabilidad**: Toda la lógica de manejo de imágenes

### utils/validators.py
- Clases: `DollValidator`, `LoteValidator`, `MarcaValidator`, `FabricanteValidator`
- Método `validate()` en cada clase
- `ValidationError` excepción personalizada
- **Responsabilidad**: Validación consistente de datos

### routes/images.py
- GET `/uploads/<filename>`: Sirve imágenes
- POST `/api/delete-image`: Borra imágenes
- **Responsabilidad**: Endpoints de imágenes

### routes/dolls.py
- GET `/api/dolls`: Lista todas las muñecas
- POST `/api/dolls`: Crea muñeca
- PUT `/api/dolls/<id>`: Actualiza muñeca
- DELETE `/api/dolls/<id>`: Borra muñeca
- GET `/api/dolls/<id>/lotes`: Obtiene lotes de una muñeca
- **Responsabilidad**: CRUD de muñecas

### routes/lotes.py
- GET `/api/lotes`: Lista lotes
- POST `/api/lotes`: Crea lote
- PUT `/api/lotes/<id>`: Actualiza lote
- DELETE `/api/lotes/<id>`: Borra lote
- GET `/api/lotes/<id>/dolls`: Obtiene muñecas de un lote
- **Responsabilidad**: CRUD de lotes

### routes/marcas.py
- GET `/api/marcas`: Lista marcas con fabricantes
- POST `/api/marcas`: Crea marca
- PUT `/api/marcas/<id>`: Actualiza marca
- GET `/api/fabricantes`: Lista fabricantes
- POST `/api/fabricantes`: Crea fabricante
- **Responsabilidad**: CRUD de marcas y fabricantes

## Ventajas del Refactoring

1. **Modularidad**: Cada módulo tiene una responsabilidad única
2. **Reutilización**: Utils pueden usarse en múltiples rutas
3. **Mantenibilidad**: Más fácil encontrar y modificar código
4. **Testing**: Más fácil crear tests unitarios
5. **Escalabilidad**: Agregar nuevas rutas es trivial
6. **Separación de Responsabilidades**: Config separada, validación separada, BD separada
7. **Manejo de Errores**: Validación consistente con ValidationError
8. **Seguridad**: Preparadas para SQL injection (parametrizadas)

## Configuración de Variables de Entorno (.env)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=dolls_db
DEBUG=True
CORS_ORIGINS=http://localhost:5173
MASTER_KEY=dev-key-change-me
```

## Instalación de Dependencias

```bash
pip install -r requirements.txt
```

## Ejecución

```bash
python app.py
```

El servidor corrará en `localhost:5000` (configurable en app.py)

## Mejoras Implementadas

✅ **Eliminación de repetición**: `get_db_connection()` reemplazado por classe Database  
✅ **Validación centralizada**: Validators para cada entidad  
✅ **Manejo de imágenes modular**: image_handler.py con lógica de optimización  
✅ **Blueprints por característica**: Cada feature en su propio módulo  
✅ **Variables de entorno**: Cargadas desde .env  
✅ **Mejor logging**: Cada módulo con su logger  
✅ **Código limpio**: app.py reducido de 738 a 50 líneas  

## Siguientes Mejoras Potenciales

1. **Tests unitarios**: Crear tests para cada validador y función
2. **Paginación**: Agregar limit/offset a endpoints GET
3. **Autenticación**: Agregar JWT o sesiones
4. **Rate limiting**: Proteger endpoints de abuso
5. **Caching**: Redis para queries frecuentes
6. **API versioning**: Cambiar a /api/v1/ para versionado
7. **Swagger/OpenAPI**: Documentación automática de API
8. **Error handling mejorado**: Custom error responses
9. **Logging estructurado**: JSON logging para logs
10. **Database pooling**: Reutilizar conexiones más eficientemente
