// index.mjs (Backend)
import 'dotenv/config';
import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import cors from 'cors';
import logger from './utils/logger.mjs';
import usuariosRouter from './routes/usuarios.mjs';
import apiRouter from './routes/api.mjs';

const app = express();
const IN = process.env.IN || 'development';

logger.info(`Iniciando servidor en modo ${IN}`);

// ─── Configuración de CORS ───────────────────────────────────────────────
// Permitimos orígenes según el entorno:
// - En desarrollo: http://localhost:3000 (Astro en dev)
// - En producción: http://localhost (o el dominio real que uses con Caddy)
const whiteList = [
  'http://localhost:3000',
  'http://localhost',             // Caddy en Docker Compose
];

app.use(cors({
  origin: function(origin, callback) {
    // Si la petición viene sin origin (Postman, backend a backend), permitirla
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origen ${origin} no permitido`));
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));
// ─────────────────────────────────────────────────────────────────────────

nunjucks.configure('views', {
  autoescape: true,
  noCache: IN === 'development',
  watch: IN === 'development',
  express: app
});
app.set('view engine', 'html');

app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware de autenticación (igual que antes)
app.use((req, res, next) => {
  const token = req.cookies.access_token;
  if (token) {
    try {
      const data = jwt.verify(token, process.env.SECRET_KEY);
      req.usuario        = data.usuario;
      req.rol            = data.rol;
      res.locals.usuario = data.usuario;
      res.locals.rol     = data.rol;
      logger.debug(`Usuario autenticado: ${data.usuario} con rol ${data.rol}`);
    } catch (e) {
      logger.warn(`Token no válido: ${e.message}`);
      console.warn('Token no válido', e);
    }
  }
  next();
});

app.get('/', (req, res) => {
  logger.info('GET / → landing page');
  res.render('index.njk');
});

app.use('/usuarios', usuariosRouter);
app.use('/api', apiRouter);

const PORT = process.env.MUSEO_PORT || 8000;
app.listen(PORT, () =>
  logger.info(`Servidor escuchando en http://localhost:${PORT}`)
);
