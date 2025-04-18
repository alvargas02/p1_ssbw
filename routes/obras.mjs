import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /obras/buscar?busqueda=palabra
 */
router.get('/buscar', async (req, res) => {
  const { busqueda } = req.query;

  if (!busqueda || typeof busqueda !== 'string') {
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

    res.render('resultados.njk', { resultados, termino: busqueda });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error interno en la búsqueda');
  }
});

export default router;
