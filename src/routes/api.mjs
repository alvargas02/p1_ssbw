import express from 'express';
import { PrismaClient } from '@prisma/client';

import logger from '../utils/logger.mjs'

const router = express.Router();
const prisma = new PrismaClient();

// Comprobar existencia de usuario por correo
// GET /api/usuario/:correo
router.get('/usuario/:correo', async (req, res) => {
  const { correo } = req.params;
  logger.debug(`GET /api/usuario/${correo}`);
  try {
    const usuario = await prisma.usuario.findUnique({ where: { correo } });
    if (usuario) {
      return res.status(200).json({ ok: true, data: {
        correo: usuario.correo,
        nombre: usuario.nombre,
        rol: usuario.rol
      }});
    } else {
      return res.status(404).json({ ok: false, msg: `Usuario ${correo} no encontrado` });
    }
  } catch (error) {
    logger.error(`Error GET /api/usuario/${correo}: ${error.message}`);
    return res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
  }
});

// Contar total de obras
// GET /api/obra/cuantas
router.get('/obra/cuantas', async (req, res) => {
  logger.debug('GET /api/obra/cuantas');
  try {
    const count = await prisma.obra.count();
    return res.status(200).json({ ok: true, count });
  } catch (error) {
    logger.error(`Error GET /api/obra/cuantas: ${error.message}`);
    return res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
  }
});

// Paginación de obras
// GET /api/obra?desde=0&hasta=10
router.get('/obra', async (req, res) => {
  const { desde = '0', hasta = '10' } = req.query;
  const offset = parseInt(desde, 10);
  const limit = parseInt(hasta, 10) - offset;
  if (isNaN(offset) || isNaN(limit) || offset < 0 || limit < 0) {
    return res.status(400).json({ ok: false, msg: 'Parámetros inválidos' });
  }
  logger.debug(`GET /api/obra?desde=${offset}&hasta=${hasta}`);
  try {
    const obras = await prisma.obra.findMany({ skip: offset, take: limit });
    return res.status(200).json({ ok: true, data: obras });
  } catch (error) {
    logger.error(`Error GET /api/obra paginada: ${error.message}`);
    return res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
  }
});

// Obtener obra por ID
// GET /api/obra/:id
router.get('/obra/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: 'ID inválido' });
  }
  logger.debug(`GET /api/obra/${id}`);
  try {
    const obra = await prisma.obra.findUnique({ where: { id } });
    if (obra) {
      return res.status(200).json({ ok: true, data: obra });
    } else {
      return res.status(404).json({ ok: false, msg: `Obra con id ${id} no encontrada` });
    }
  } catch (error) {
    logger.error(`Error GET /api/obra/${id}: ${error.message}`);
    return res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
  }
});

// Borrar obra por ID
// DELETE /api/obra/:id
router.delete('/obra/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ ok: false, msg: 'ID inválido' });
  }
  logger.debug(`DELETE /api/obra/${id}`);
  try {
    const obra = await prisma.obra.findUnique({ where: { id } });
    if (!obra) {
      return res.status(404).json({ ok: false, msg: `Obra con id ${id} no encontrada` });
    }
    await prisma.obra.delete({ where: { id } });
    return res.status(200).json({ ok: true, msg: `Obra con id ${id} eliminada` });
  } catch (error) {
    logger.error(`Error DELETE /api/obra/${id}: ${error.message}`);
    return res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
  }
});

export default router;
