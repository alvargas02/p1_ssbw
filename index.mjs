import express  from 'express';
import nunjucks from 'nunjucks';

const IN = process.env.IN || 'development';
const app = express();

// Configurar Nunjucks para usar la carpeta 'views'
nunjucks.configure('views', {
  autoescape: true,
  noCache:    IN === 'development',
  watch:      IN === 'development',
  express: app
});
app.set('view engine', 'html');

// Middleware para servir archivos estáticos (CSS, JS, imágenes, etc.)
app.use(express.static('public'));

// Ruta para la landing page
app.get('/', (req, res) => {
  res.render("index.njk");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT} en modo ${IN}`);
});
