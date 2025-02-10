const express = require('express');
const router = express.Router();
const db = require('./db'); // Conexión a MySQL
const bcrypt = require('bcryptjs'); // Para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Para manejar tokens JWT

// **Ruta para registrar un usuario**
router.post('/register', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  // Validar que los campos no estén vacíos
  if (!nombre || !correo || !contraseña) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  // Verificar si el correo ya está registrado
  const queryBuscar = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(queryBuscar, [correo], async (err, results) => {
    if (err) {
      console.error('❌ Error al buscar usuario:', err.message);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

    if (results.length > 0) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    // Insertar el usuario en la base de datos con rol predeterminado
    const queryInsertar = 'INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, "cliente")';
    db.query(queryInsertar, [nombre, correo, hashedPassword], (err, result) => {
      if (err) {
        console.error('❌ Error al registrar usuario:', err.message);
        return res.status(500).json({ mensaje: 'Error al registrar usuario' });
      }

      res.status(201).json({
        mensaje: 'Usuario registrado con éxito',
        usuario: {
          id: result.insertId,
          nombre,
          correo,
          rol: 'cliente', // El rol predeterminado
        },
      });
    });
  });
});

// **Ruta para iniciar sesión**
router.post('/login', (req, res) => {
  const { correo, contraseña } = req.body;

  // Validar que los campos no estén vacíos
  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  // Buscar al usuario en la base de datos
  const queryBuscar = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(queryBuscar, [correo], async (err, results) => {
    if (err) {
      console.error('❌ Error al buscar usuario:', err.message);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const usuario = results[0];

    // Verificar la contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    // Crear el token JWT
    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  });
});

// **Ruta protegida: Obtener todos los usuarios (solo para administradores)**
router.get('/', (req, res) => {
  const query = 'SELECT id, nombre, correo, rol FROM usuarios';
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error al listar usuarios:', err.message);
      return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

    res.json(results);
  });
});

module.exports = router;










