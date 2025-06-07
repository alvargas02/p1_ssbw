# ───────────────────────────────────────────────────────────────────────────
# 1) Etapa de build de Astro (incluye devDependencies)
# ───────────────────────────────────────────────────────────────────────────
FROM node:23-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar todas las dependencias (incluye postcss, tailwindcss, etc.)
RUN npm ci

# Copiar configuración y código completo
COPY . .

# Ejecutar el build para SSR
RUN npm run build:server

# ───────────────────────────────────────────────────────────────────────────
# 2) Imagen runtime con solo dependencies de producción
# ───────────────────────────────────────────────────────────────────────────
FROM node:23-alpine AS release
WORKDIR /app

# Copiamos deps de prod y /dist
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Node usará process.env.PORT
CMD ["node", "./dist/server/entry.mjs"]
