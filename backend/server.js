require('dotenv').config(); // Cargar las variables de entorno
const express = require('express');
const cors = require('cors'); // Importar cors
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());
app.use(cors()); // Habilitar CORS

// Rutas
const usuariosRoutes = require('./usuarios');
const cursosRoutes = require('./cursos');
const inscripcionesRoutes = require('./inscripciones');

app.use('/usuarios', usuariosRoutes);
app.use('/cursos', cursosRoutes);
app.use('/inscripciones', inscripcionesRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});









