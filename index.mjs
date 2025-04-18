import 'dotenv/config';
import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import obrasRouter from './routes/obras.mjs'; 

const IN = process.env.IN || 'development';
const app = express();

// Configurar Nunjucks
nunjucks.configure('views', {
  autoescape: true,
  noCache:    IN === 'development',
  watch:      IN === 'development',
  express: app
});
app.set('view engine', 'html');

// Servir estáticos
app.use(express.static(path.join(process.cwd(), 'public')));

// Landing page con el formulario de búsqueda
app.get('/', (req, res) => {
  res.render("index.njk");
});

// Usamos el router de obras para /obras
app.use('/obras', obrasRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT} en modo ${IN}`);
});
