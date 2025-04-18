// public/scripts/seed.mjs
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const prisma = new PrismaClient();

// ----- Resolución de rutas basadas en este archivo -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta al JSON de datos
const datosPath = join(__dirname, 'info_obras.json');

// Carpeta de destino para las imágenes: ../images (desde public/scripts → public/images)
const imagesDir = join(__dirname, '..', 'images');

// Asegurarnos de que existe public/images
if (!existsSync(imagesDir)) {
  mkdirSync(imagesDir, { recursive: true });
}

// Configuramos agente HTTPS (si hace falta para descargas con cert no válidos)
const agent = new https.Agent({ rejectUnauthorized: false });

// Leemos los datos
const obras = JSON.parse(readFileSync(datosPath, 'utf-8'));

async function seed() {
  // Opcional: borrar registros previos
  await prisma.obra.deleteMany();

  for (const obra of obras) {
    // 1) Descarga la imagen
    const response = await fetch(obra.imagen, { agent });
    const buffer = Buffer.from(await response.arrayBuffer());

    // 2) Genera un nombre de archivo "slugificado" (sin tildes ni espacios)
    const slug = obra.titulo
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')   // quitar acentos
      .replace(/\s+/g, '_')              // espacios → barras bajas
      .replace(/[^a-zA-Z0-9_]/g, '');    // limpiar otros caracteres
    const fileName = `${slug}.jpg`;

    // 3) Ruta absoluta en disco donde escribimos la imagen
    const outPath = join(imagesDir, fileName);
    writeFileSync(outPath, buffer);

    // 4) Ruta pública que guardamos en la BD
    const publicPath = `/images/${fileName}`;

    // 5) Creamos el registro en la BD
    await prisma.obra.create({
      data: {
        titulo: obra.titulo,
        imagen: publicPath,
        descripcion: obra.descripcion,
        procedencia: obra.procedencia,
        comentario: obra.comentario,
      },
    });

    console.log(`Semilla: ${obra.titulo} → ${publicPath}`);
  }

  console.log('Seed completado');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
