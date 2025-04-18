import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

import logger from '../utils/logger.mjs'

const router = express.Router();
const prisma = new PrismaClient();

// Mostrar formulario de login
router.get('/login', (req, res) => {
  logger.info('GET /usuarios/login');
  res.render('login.njk');
});

// Procesar login
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;
  logger.info(`Intento de login para correo: ${correo}`);
  try {
    const user = await prisma.usuario.findUnique({ where: { correo } });
    if (!user) {
      logger.warn(`Usuario no encontrado: ${correo}`);
      return res.status(401).render('login.njk', { error: 'Credenciales inválidas' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      logger.warn(`Contraseña incorrecta para usuario: ${correo}`);
      return res.status(401).render('login.njk', { error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { usuario: user.nombre, rol: user.rol },
      process.env.SECRET_KEY,
      { expiresIn: '2h' }
    );
    logger.info(`Login exitoso para usuario: ${user.nombre}`);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.IN === 'production',
      maxAge: 2 * 60 * 60 * 1000,
    }).redirect('/');

  } catch (e) {
    logger.error(`Error en POST /usuarios/login: ${e.message}`);
    res.status(500).render('login.njk', { error: 'Error interno del servidor' });
  }
});

// Logout: borrar cookie
router.get('/logout', (req, res) => {
  logger.info('GET /usuarios/logout');
  res.clearCookie('access_token');
  res.redirect('/');
});

// Mostrar formulario de registro
router.get('/registro', (req, res) => {
  logger.info('GET /usuarios/registro');
  res.render('registro.njk');
});

// Procesar registro
router.post('/registro', async (req, res) => {
  const { correo, nombre, password } = req.body;
  logger.info(`Intento de registro para correo: ${correo}`);
  try {
    const hashed = await bcrypt.hash(password, 10);
    await prisma.usuario.create({ data: { correo, nombre, password: hashed } });
    logger.info(`Registro exitoso de usuario: ${correo}`);
    res.redirect('/usuarios/login');
  } catch (e) {
    logger.error(`Error en POST /usuarios/registro para ${correo}: ${e.message}`);
    res.status(400).render('registro.njk', { error: 'Ya existe ese correo' });
  }
});

export default router;
