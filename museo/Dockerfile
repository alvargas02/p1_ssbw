# ───────────────────────────────────────────────────────────────────────────
# Etapa 1: instalar deps (incluyendo dev) y generar Prisma Client
# ───────────────────────────────────────────────────────────────────────────
FROM node:23-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate

# ───────────────────────────────────────────────────────────────────────────
# Etapa 2: imagen de producción con postgresql-client instalado
# ───────────────────────────────────────────────────────────────────────────
FROM node:23-alpine AS release

WORKDIR /app

# Instala el cliente de Postgres para poder usar pg_isready
RUN apk add --no-cache postgresql-client

# Copiar package.json y prod-deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar artefactos de Prisma y código fuente
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma       ./prisma
COPY --from=deps /app/src          ./src
COPY --from=deps /app/views        ./views
COPY --from=deps /app/public       ./public


# Copiar entrypoint
COPY --from=deps /app/entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Variables y puerto
ENV NODE_ENV=production
ENV PORT=${MUSEO_PORT:-8000}
EXPOSE ${PORT}

# Arranque: aplica migraciones, seed y luego tu app
ENTRYPOINT ["./entrypoint.sh"]
