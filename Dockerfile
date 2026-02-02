# Usamos Node 20 como base (que es la que ya tenías)
FROM node:20-alpine AS base

# 1. Instalación de dependencias
FROM base AS deps
WORKDIR /app
# Copiamos los archivos de configuración de paquetes
COPY package.json package-lock.json* ./
RUN npm install

# 2. Construcción (Build) de Next.js
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Este comando es vital: genera la carpeta .next que contiene tu diseño y rutas
RUN npm run build

# 3. Producción (Imagen final ligera)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copiamos solo lo necesario para que la imagen sea pequeña
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Next.js por defecto se inicia con "npm start"
CMD ["npm", "start"]