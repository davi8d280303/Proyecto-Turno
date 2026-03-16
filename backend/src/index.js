/**
 * Servidor principal - Express
 */
require('dotenv').config();
const express = require('express');
const corsMiddleware = require('./middleware/corsConfig');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const indexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging básico
app.use((req, res, next) => {
  console.log(`\n📍 ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api', indexRoutes);

// Rutas no encontradas
app.use(notFoundHandler);

// Manejador de errores (debe ser último)
app.use(errorHandler);

// Iniciar servidor con manejo de errores de bind (p. ej. EADDRINUSE)
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}/api`);
  console.log(`🔄 Health check: http://localhost:${PORT}/api/health\n`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`\n⛔ Error: puerto ${PORT} ya está en uso. Mata el proceso que lo utiliza o cambia la variable PORT.`);
    console.error('Sugerencias: `netstat -ano | findstr :5000` -> `taskkill /PID <pid> /F` o `npx kill-port 5000`.');
    process.exit(1);
  }
  console.error(err);
  process.exit(1);
});

module.exports = app;
