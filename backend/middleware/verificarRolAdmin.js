function verificarRolAdmin(req, res, next) {
  const usuario = req.usuario;

  if (!usuario || usuario.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado. No tienes permisos de administrador.' });
  }

  next();
}

module.exports = verificarRolAdmin;

  