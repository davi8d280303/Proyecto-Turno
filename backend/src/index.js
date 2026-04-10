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

// Manejador de errores
app.use(errorHandler);

// Servidor
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
});