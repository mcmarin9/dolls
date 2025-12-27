# Dolls Collection Backend - Go Edition

Backend refactorizado en Go para el sistema de gestión de colección de muñecas.

## 🚀 Características

- **Alta performance**: Servidor HTTP nativo de Go con enrutamiento eficiente
- **Gestión de muñecas**: CRUD completo con imágenes
- **Gestión de lotes**: Organización de muñecas en grupos
- **Gestión de marcas y fabricantes**: Catálogo completo
- **Procesamiento de imágenes**: Redimensionamiento y optimización automática
- **CORS configurado**: Listo para frontend React

## 📋 Requisitos

- **Go**: 1.21 o superior
- **MySQL**: 5.7 o superior
- **XAMPP**: Para MySQL (opcional)

## 🔧 Instalación

### 1. Instalar Go

**Windows:**
1. Descargar desde: https://go.dev/dl/
2. Ejecutar el instalador
3. Verificar instalación:
```powershell
go version
```

### 2. Clonar y configurar el proyecto

```bash
cd backend-go
cp .env.example .env
```

### 3. Configurar variables de entorno

Edita el archivo `.env` con tus credenciales:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=dolls_db
SERVER_PORT=5000
```

### 4. Instalar dependencias

```bash
go mod download
```

### 5. Ejecutar el servidor

```bash
go run main.go
```

O compilar y ejecutar:

```bash
go build -o dolls-server
./dolls-server     # Linux/Mac
dolls-server.exe   # Windows
```

## 📁 Estructura del proyecto

```
backend-go/
├── main.go              # Punto de entrada
├── go.mod               # Dependencias
├── config/
│   └── config.go        # Configuración
├── database/
│   └── database.go      # Conexión y queries
├── models/
│   └── models.go        # Estructuras de datos
├── handlers/
│   ├── dolls.go         # Handlers de muñecas
│   ├── lotes.go         # Handlers de lotes
│   ├── marcas.go        # Handlers de marcas
│   └── images.go        # Servir imágenes
├── utils/
│   ├── logger.go        # Sistema de logs
│   ├── validators.go    # Validaciones
│   └── image_handler.go # Procesamiento de imágenes
└── uploads/             # Directorio de imágenes
```

## 🔌 API Endpoints

### Dolls
- `GET /api/dolls` - Obtener todas las muñecas
- `GET /api/dolls/:id` - Obtener una muñeca
- `POST /api/dolls` - Crear muñeca (multipart/form-data)
- `PUT /api/dolls/:id` - Actualizar muñeca (multipart/form-data)
- `DELETE /api/dolls/:id` - Eliminar muñeca

### Lotes
- `GET /api/lotes` - Obtener todos los lotes
- `GET /api/lotes/:id` - Obtener un lote
- `POST /api/lotes` - Crear lote (JSON)
- `PUT /api/lotes/:id` - Actualizar lote (JSON)
- `DELETE /api/lotes/:id` - Eliminar lote

### Marcas
- `GET /api/marcas` - Obtener todas las marcas
- `POST /api/marcas` - Crear marca (JSON)
- `PUT /api/marcas/:id` - Actualizar marca (JSON)
- `DELETE /api/marcas/:id` - Eliminar marca

### Fabricantes
- `GET /api/fabricantes` - Obtener todos los fabricantes
- `GET /api/fabricantes/:id/marcas` - Obtener marcas de un fabricante

### Images
- `GET /uploads/:filename` - Servir imagen

### Health Check
- `GET /api/health` - Verificar estado del servidor

## 🔨 Compilación para producción

### Linux
```bash
GOOS=linux GOARCH=amd64 go build -o dolls-server-linux
```

### Windows
```bash
GOOS=windows GOARCH=amd64 go build -o dolls-server.exe
```

### macOS
```bash
GOOS=darwin GOARCH=amd64 go build -o dolls-server-mac
```

## 📦 Dependencias principales

- **gorilla/mux**: Router HTTP
- **go-sql-driver/mysql**: Driver MySQL
- **rs/cors**: Middleware CORS
- **joho/godotenv**: Variables de entorno
- **google/uuid**: Generación de UUIDs
- **nfnt/resize**: Redimensionamiento de imágenes

## 🐛 Debug

El servidor incluye logging detallado. Para habilitar/deshabilitar:

```env
DEBUG=true  # Logs detallados
DEBUG=false # Solo logs importantes
```

## 🔄 Migración desde Python

Este backend es un reemplazo directo del backend Python. La API es compatible, solo necesitas:

1. Mantener la misma base de datos
2. Cambiar el puerto del frontend si es necesario
3. Actualizar las variables de entorno

## 📝 Notas

- Las imágenes se optimizan automáticamente a 800x800px
- Formatos soportados: JPG, PNG, GIF
- Tamaño máximo de archivo: 16MB
- Las imágenes se guardan en formato JPEG con calidad 85

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto.

## 👨‍💻 Autor

Refactorizado de Python a Go - 2025
