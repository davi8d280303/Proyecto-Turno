# ─────────────────────────────────────────────────────────────
# Dockerfile — Frontend Next.js
# Imagen multietapa optimizada para producción
#
# Etapas:
#   1. deps    → instala dependencias
#   2. builder → compila Next.js con output standalone
#   3. runner  → imagen final mínima (~80MB) sin node_modules
# ─────────────────────────────────────────────────────────────

# Imagen base Alpine — mínima y segura
FROM node:20-alpine AS base

# ── ETAPA 1: Dependencias ─────────────────────────────────────
FROM base AS deps

# libc6-compat es necesario en Alpine para algunas dependencias nativas
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar solo los manifiestos primero para aprovechar el cache de capas.
# Si package.json no cambia, Docker reutiliza esta capa sin reinstalar.
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline

# ── ETAPA 2: Builder ──────────────────────────────────────────
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variable de entorno para el build.
# Si no se pasa como build-arg, usa un placeholder.
# El valor real se inyecta en runtime como variable de entorno del contenedor.
ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Desactivar telemetría de Next.js en el build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── ETAPA 3: Runner (imagen final) ────────────────────────────
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Crear usuario y grupo sin privilegios — nunca correr como root
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copiar archivos estáticos públicos
COPY --from=builder /app/public ./public

# Copiar el output standalone — contiene el servidor Node.js mínimo
# y solo las dependencias que realmente se usan en producción
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Cambiar al usuario sin privilegios antes de arrancar
USER nextjs

EXPOSE 3000

# server.js es generado por Next.js en .next/standalone
# Es más eficiente que `npm start` porque no carga npm
CMD ["node", "server.js"]
