# Configuración para Deploy - Backend & Frontend

## 🚀 Estructura de Deploy

```
[Frontend: Vercel/Netlify]
        ↕ HTTPS
[API Gateway / Proxy]
        ↕ HTTP
[Backend: Node.js/Docker]
```

---

## 🔧 Backend - Preparación para Producción

### 1. Variables de Entorno (`.env`)

```env
# Desarrollo
NODE_ENV=development
PORT=5000

# Producción
NODE_ENV=production
PORT=5000

# Base de datos (cuando sea implementada)
DATABASE_URL=postgresql://user:pass@localhost:5432/sistema_prestamos

# Autenticación JWT (Próximo)
JWT_SECRET=tu-secreto-super-seguro-aqui
JWT_EXPIRE=7d

# CORS - IMPORTANTE
CORS_ORIGIN=https://tudominio.com,http://localhost:3000
```

### 2. Script de Build/Deploy

**package.json**
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "build": "echo 'Backend no necesita build'",
    "test": "jest --watch"
  }
}
```

### 3. Docker (Opcional pero Recomendado)

**Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

ENV NODE_ENV=production

CMD ["node", "src/index.js"]
```

**docker-compose.yml**
```yml
version: '3.9'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      PORT: 5000
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:5000/api
    depends_on:
      - backend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

---

## 🌐 Frontend - Preparación para Deploy

### 1. Variables de Entorno por Ambiente

**.env.local** (Desarrollo)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENV=development
```

**.env.staging** (Staging)
```env
NEXT_PUBLIC_API_URL=https://api-staging.tudominio.com/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENV=staging
```

**.env.production** (Producción)
```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com/api
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENV=production
```

### 2. Build Optimization

**next.config.mjs**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones de imagen
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: false
  },
  
  // Compresión
  compress: true,
  
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ]
  },

  // Redirects de API
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`
        }
      ]
    }
  }
};

export default nextConfig;
```

### 3. Scripts de Deploy

**package.json**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "analyze": "ANALYZE=true next build"
  }
}
```

---

## 📡 Nginx Configuration (Reverse Proxy)

**nginx.conf**
```nginx
upstream api_backend {
    server backend:5000;
}

upstream next_frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name _;
    client_max_body_size 10M;

    # Frontend
    location / {
        proxy_pass http://next_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API Backend
    location /api/ {
        proxy_pass http://api_backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS Headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    }

    # Health check
    location /health {
        proxy_pass http://api_backend/api/health;
        access_log off;
    }
}
```

---

## 🔐 CORS - Configuración Segura

**Backend (src/middleware/corsConfig.js)**
```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 3600 // 1 hora
};

module.exports = cors(corsOptions);
```

---

## 📊 Deployment Checklist

### Pre-Deploy ✅

- [ ] Variables de entorno correctas en ambos lados
- [ ] CORS origen coincide con dominio frontend
- [ ] API endpoints testeados manualmente
- [ ] Base de datos migrada (si aplica)
- [ ] Logs configurados
- [ ] Backups creados

### Backend

- [ ] `npm install --only=production`
- [ ] `npm run build` o `npm start`
- [ ] Health check: `GET /api/health`
- [ ] Logs monitoreados
- [ ] PM2 o supervisor configurado

```bash
# Con PM2 (Recomendado)
npm install -g pm2
pm2 start src/index.js --name "api"
pm2 save
pm2 startup
```

### Frontend

- [ ] `npm run build` exitoso
- [ ] `npm start` inicia servidor
- [ ] Conecta a API correcta
- [ ] Performance OK

```bash
# Vercel (Automático)
git push origin main

# Manual
npm run build
npm start
```

---

## 🔍 Monitoreo en Producción

### Logs Recomendados

**Backend (Winston/Pino)**
```javascript
const logger = require('winston');
logger.info('Servidor iniciado', {timestamp: new Date()});
logger.error('Error en API', {error: err.message});
```

### Métricas

- Request rate y tiempo de respuesta
- Error rate (4xx, 5xx)
- Uptime del servidor
- Uso de memoria y CPU
- Latencia de API

### Herramientas

- **Monitoring**: DataDog, New Relic, Sentry
- **Logs**: CloudWatch, Loggly, ELK Stack
- **Alertas**: PagerDuty, Slack webhooks

---

## 🚀 Guía Rápida de Deploy Local

### 1. Iniciar Backend
```bash
cd backend
npm install
npm run dev    # Desarrollo
# O
npm start      # Producción
```

### 2. Iniciar Frontend
```bash
cd frontend
npm install
npm run dev    # Desarrollo
# O
npm run build && npm start  # Producción
```

### 3. Verifica Conexión
```bash
# Prueba API
curl http://localhost:5000/api/health

# Prueba Frontend
curl http://localhost:3000
```

---

## 🌍 Deploy en Servidores Populares

### Heroku

**Backend:**
```bash
heroku create mi-api
git push heroku main
heroku config:set NODE_ENV=production
```

### Vercel (Solo Frontend)

```bash
npm i -g vercel
vercel
```

### AWS EC2 + RDS

1. Frontend en CloudFront + S3
2. Backend en EC2 + ALB
3. Base de datos en RDS

### Digital Ocean

App Platform o Droplets + Caprover

---

## 📝 Notas Importantes

1. **CORS**: Siempre espécifico en producción, nunca `*`
2. **JWT**: Implementar autenticación antes de producción
3. **Base de datos**: No comitear credenciales, usar `.env`
4. **HTTPS**: Obligatorio en producción
5. **Rate Limiting**: Implementar para proteger API

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // 100 requests por IP
});

app.use('/api/', limiter);
```

---

**Última actualización:** 19 de febrero de 2026
