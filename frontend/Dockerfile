FROM node:20-alpine AS base

# 1. Dependencias COMPLETAS (dev + prod)
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Producción - versión SIMPLIFICADA (RECOMENDADA)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copiar SOLO lo necesario para producción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# NO instalar nada más, ya tenemos node_modules del builder

EXPOSE 3000

CMD ["npm", "start"]