const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.header('Authorization');
  
  // Log para verificar si el encabezado de autorización está presente
  console.log('Encabezado de autorización recibido:', authHeader);

  if (!authHeader) {
    return res.status(403).json({ mensaje: 'Acceso denegado. No se proporcionó un token.' });
  }

  // Extraer el token del encabezado Authorization
  const token = authHeader.split(' ')[1];
  
  // Log para verificar el token extraído
  console.log('Token extraído:', token);

  if (!token) {
    return res.status(403).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Verificar el token con la clave secreta
    const usuario = jwt.verify(token, process.env.JWT_SECRET);

    // Log para verificar el usuario decodificado
    console.log('Usuario decodificado:', usuario);

    req.usuario = usuario; // Guardar los datos del usuario en la solicitud
    next(); // Continuar con la solicitud
  } catch (err) {
    console.error('Error al verificar el token:', err.message);
    res.status(401).json({ mensaje: 'Token inválido o expirado.' });
  }
}

module.exports = verificarToken;




