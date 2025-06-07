import express from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.mjs';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /buscar?busqueda=palabra   (se monta en /api/obras)
 */
router.get('/buscar', async (req, res) => {
  const { busqueda } = req.query;

  if (!busqueda || typeof busqueda !== 'string' || !busqueda.trim()) {
    return res
      .status(400)
      .json({ ok: false, msg: 'Parámetro "busqueda" inválido' });
  }

  try {
    // Búsqueda simple con ILIKE (sin unaccent)
    const resultados = await prisma.$queryRaw`
      SELECT
        id,
        titulo,
        imagen,
        descripcion,
        procedencia,
        comentario
      FROM "Obra"
      WHERE
        titulo ILIKE '%' || ${busqueda} || '%'
        OR descripcion ILIKE '%' || ${busqueda} || '%'
        OR procedencia ILIKE '%' || ${busqueda} || '%'
        OR coalesce(comentario, '') ILIKE '%' || ${busqueda} || '%'
      LIMIT 20
    `;

    return res.json({ ok: true, data: resultados });
  } catch (err) {
    logger.error(`Error /obras/buscar: ${err.message}`);
    return res.status(500).json({ ok: false, msg: 'Error interno' });
  }
});

export default router;
