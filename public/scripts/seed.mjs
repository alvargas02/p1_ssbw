// seed.mjs
import { readFileSync, writeFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";
import https from "https";

const prisma = new PrismaClient();

// Crear un agente HTTPS que no verifique el certificado (solo para desarrollo)
const agent = new https.Agent({
  rejectUnauthorized: false,
});

// Leer el archivo JSON
const obras = JSON.parse(readFileSync('./info_obras.json', 'utf-8'));

async function seed() {
  for (const obra of obras) {
    // Descargar la imagen usando el agente personalizado y response.arrayBuffer()
    const response = await fetch(obra.imagen, { agent });
    const buffer = Buffer.from(await response.arrayBuffer());
    const fileName = obra.titulo.replace(/\s/g, '_') + '.jpg';
    const filePath = `./public/images/${fileName}`;
    writeFileSync(filePath, buffer);
    
    // Guardar los datos en la BD usando los nombres de campo sin acento
    await prisma.obra.create({
      data: {
        titulo: obra.titulo,
        imagen: filePath, // o la URL, según prefieras
        descripcion: obra.descripcion,
        procedencia: obra.procedencia,
        comentario: obra.comentario,
      },
    });
  }
  console.log("Seed completado");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
