const express = require('express');
const router = express.Router();
const db = require('./db'); // Conexión a la base de datos
const authMiddleware = require('./middleware/authMiddleware'); // Middleware para autenticar usuarios

// Inscribirse a un curso
router.post('/', authMiddleware, (req, res) => {
  const usuarioId = req.usuario.id; // Extraer el ID del usuario desde el token
  const { curso_id } = req.body;

  if (!curso_id) {
    return res.status(400).json({ mensaje: 'El ID del curso es obligatorio' });
  }

  // Verificar si el cliente tiene más de 3 cursos inscritos
  const queryContar = 'SELECT COUNT(*) AS total FROM inscripciones WHERE usuario_id = ?';
  db.query(queryContar, [usuarioId], (err, results) => {
    if (err) {
      console.error('Error al contar inscripciones:', err.message);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

    if (results[0].total >= 3) {
      return res.status(400).json({ mensaje: 'No puedes inscribirte a más de 3 cursos.' });
    }

    // Verificar si el usuario ya está inscrito en el curso
    const queryBuscar = 'SELECT * FROM inscripciones WHERE usuario_id = ? AND curso_id = ?';
    db.query(queryBuscar, [usuarioId, curso_id], (err, results) => {
      if (err) {
        console.error('Error al buscar inscripción:', err.message);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
      }

      if (results.length > 0) {
        return res.status(400).json({ mensaje: 'Ya estás inscrito en este curso.' });
      }

      // Insertar inscripción en la base de datos
      const queryInsertar = 'INSERT INTO inscripciones (usuario_id, curso_id) VALUES (?, ?)';
      db.query(queryInsertar, [usuarioId, curso_id], (err, result) => {
        if (err) {
          console.error('Error al crear inscripción:', err.message);
          return res.status(500).json({ mensaje: 'Error al crear inscripción.' });
        }

        res.status(201).json({ mensaje: 'Inscripción creada con éxito.' });
      });
    });
  });
});

module.exports = router;

