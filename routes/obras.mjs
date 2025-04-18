import express from 'express';
import { PrismaClient } from '@prisma/client';

import logger from '../public/scripts/logger.mjs'

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /obras/buscar?busqueda=palabra
 */
router.get('/buscar', async (req, res) => {
  const { busqueda } = req.query;
  logger.info(`GET /obras/buscar?busqueda=${busqueda}`);

  if (!busqueda || typeof busqueda !== 'string') {
    logger.warn('Parámetro de búsqueda inválido');
    return res.status(400).send('Parámetro de búsqueda inválido');
  }

  try {
    // Utilizamos SQL puro para full‑text search con ranking
    const resultados = await prisma.$queryRaw`
      SELECT
        id,
        titulo,
        imagen,
        descripcion,
        procedencia,
        comentario,
        ts_rank(
          to_tsvector('simple',
            coalesce(titulo,'') || ' ' ||
            coalesce(descripcion,'') || ' ' ||
            coalesce(procedencia,'') || ' ' ||
            coalesce(comentario,'')
          ),
          plainto_tsquery('simple', ${busqueda})
        ) AS rank
      FROM "Obra"
      WHERE to_tsvector('simple',
            coalesce(titulo,'') || ' ' ||
            coalesce(descripcion,'') || ' ' ||
            coalesce(procedencia,'') || ' ' ||
            coalesce(comentario,'')
          ) @@ plainto_tsquery('simple', ${busqueda})
      ORDER BY rank DESC
      LIMIT 3;
    `;
    logger.debug(`Encontrados ${resultados.length} resultados para "${busqueda}"`);
    res.render('resultados.njk', { resultados, termino: busqueda });

  } catch (err) {
    logger.error(`Error en búsqueda: ${err.message}`);
    res.status(500).send('Error interno en la búsqueda');
  }
});

export default router;
