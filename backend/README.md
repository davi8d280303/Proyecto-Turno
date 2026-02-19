# Backend - Sistema de Préstamos

## 📁 Estructura

```
backend/
├── src/
│   ├── loaders/          # Funciones reutilizables para cargar datos
│   │   └── apiLoader.js  # Loaders para consumir APIs
│   ├── middleware/       # Middlewares de Express
│   │   ├── errorHandler.js  # Manejo global de errores
│   │   └── corsConfig.js    # Configuración CORS
│   ├── routes/           # Rutas de la API
│   │   └── index.js      # Rutas principales
│   ├── services/         # Servicios (próximamente)
│   └── index.js          # Archivo principal
├── .env.example
├── .gitignore
└── package.json
```

## 🚀 Instalación y Uso

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
```

### 3. Ejecutar en desarrollo
```bash
npm run dev
```

### 4. Ejecutar en producción
```bash
npm start
```

## 📡 Loaders Disponibles

### `loadFromAPI(endpoint)`
Carga datos de una API externa.
```javascript
const { loadFromAPI } = require('./loaders/apiLoader');
const data = await loadFromAPI('https://api.ejemplo.com/datos');
```

### `loadMultiple(endpoints)`
Carga datos de múltiples APIs en paralelo.
```javascript
const results = await loadMultiple([
  'https://api.com/usuarios',
  'https://api.com/prestamos'
]);
```

### `loadWithRetry(endpoint, retries)`
Carga datos con reintentos automáticos.
```javascript
const data = await loadWithRetry('https://api.ejemplo.com/datos', 3);
```

## 🛣️ Rutas Disponibles

- `GET /api` - Información del servidor
- `GET /api/health` - Health check

## ⚙️ Configuración

Variables de entorno en `.env`:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## ❌ Manejo de Errores

Los errores se manejan globalmente y retornan:
```json
{
  "success": false,
  "error": "Descripción del error",
  "timestamp": "2024-02-19T10:30:00.000Z",
  "path": "/api/endpoint"
}
```

## 🔜 Próximos Pasos

1. Crear rutas para usuarios
2. Crear rutas para préstamos
3. Integrar consumo de APIs externas
4. Añadir validación de datos
5. Implementar autenticación
