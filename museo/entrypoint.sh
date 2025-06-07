#!/bin/sh
set -e

echo "⏳ Esperando a PostgreSQL en psql:5432…"
# Bucle hasta que pg_isready confirme
until pg_isready -h psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" > /dev/null 2>&1; do
  echo "  esperando..."
  sleep 1
done

echo "✅ PostgreSQL está listo"

echo "🚀 Aplicando migraciones de Prisma…"
npx prisma migrate deploy
echo "✔ Migraciones aplicadas"

echo "🌱 Ejecutando seed.mjs…"
node src/scripts/seed.mjs
echo "✔ Seed completado"

echo "📡 Arrancando servidor Express…"
exec node src/index.mjs
