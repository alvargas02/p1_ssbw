import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Mostrar formulario de login
router.get('/login', (req, res) => {
  res.render('login.njk');
});

// Procesar login
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;
  const user = await prisma.usuario.findUnique({ where: { correo } });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).render('login.njk', { error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { usuario: user.nombre, rol: user.rol },
    process.env.SECRET_KEY,
    { expiresIn: '2h' }
  );

  res
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.IN === 'production',
      maxAge: 2 * 60 * 60 * 1000
    })
    .redirect('/'); // o donde quieras
});

// Logout: borrar cookie
router.get('/logout', (req, res) => {
  res.clearCookie('access_token').redirect('/');
});

// Mostrar formulario de registro
router.get('/registro', (req, res) => {
  res.render('registro.njk');
});

// Procesar registro
router.post('/registro', async (req, res) => {
  const { correo, nombre, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    await prisma.usuario.create({
      data: { correo, nombre, password: hashed }
    });
    res.redirect('/usuarios/login');
  } catch (e) {
    console.error(e);
    res.status(400).render('registro.njk', { error: 'Ya existe ese correo' });
  }
});

export default router;
