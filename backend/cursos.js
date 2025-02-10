const express = require('express');
const router = express.Router();
const db = require('./db'); // Conexión a la base de datos
const authMiddleware = require('./middleware/authMiddleware'); // Middleware para proteger rutas

// **Ruta protegida: Crear un curso**
router.post('/', authMiddleware, (req, res) => {
  const { nombre, duracion } = req.body;

  if (!nombre || !duracion) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  const query = 'INSERT INTO cursos (nombre, duracion) VALUES (?, ?)';
  db.query(query, [nombre, duracion], (err, result) => {
    if (err) {
      console.error('Error al crear curso:', err.message);
      return res.status(500).json({ mensaje: 'Error al crear el curso' });
    }

    res.status(201).json({
      mensaje: 'Curso creado',
      curso: {
        id: result.insertId,
        nombre,
        duracion,
      },
    });
  });
});

// **Ruta pública: Leer todos los cursos**
router.get('/', (req, res) => {
  const query = 'SELECT * FROM cursos';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al listar cursos:', err.message);
      return res.status(500).json({ mensaje: 'Error al listar los cursos' });
    }

    res.json(results);
  });
});

module.exports = router;












