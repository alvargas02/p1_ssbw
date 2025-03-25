import express   from 'express'
import nunjucks  from 'nunjucks'

const IN = process.env.IN || 'development'
const app = express()

// Configurar Nunjucks para utilizar la carpeta 'views'
nunjucks.configure('views', {
	autoescape: true,
	noCache:    IN === 'development',
	watch:      IN === 'development',
	express: app
})
app.set('view engine', 'html')

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'))

// Ruta de prueba para mostrar que el servidor funciona
app.get('/hola', (req, res) => {
	res.send('Hola desde el servidor');
})

// Ruta para la Landing Page, renderizando la plantilla index.njk
app.get('/', (req, res) => {
	res.render("index.njk", { saludo: 'Bienvenido al Museo Arqueológico de Granada' })
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`Servidor ejecutándose en http://localhost:${PORT} en modo ${IN}`);
})
