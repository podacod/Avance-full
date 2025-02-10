require('dotenv').config(); // Cargar variables de entorno desde .env
const mysql = require('mysql2');

// Crear un pool de conexiones para manejar múltiples solicitudes
const pool = mysql.createPool({
  host: process.env.DB_HOST, // Dirección de la base de datos
  user: process.env.DB_USER, // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña de la base de datos
  database: process.env.DB_NAME, // Nombre de la base de datos
  waitForConnections: true, // Esperar conexiones libres si el pool está lleno
  connectionLimit: 10, // Máximo de conexiones en el pool
  queueLimit: 0, // Límite de solicitudes en cola (0 = sin límite)
});

// Probar la conexión inicial
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error al conectar al pool de MySQL:', err.message);
    return;
  }
  console.log('✅ Conexión al pool de MySQL establecida correctamente');
  connection.release(); // Liberar la conexión al pool
});

// Exportar el pool para usarlo en otros archivos
module.exports = pool;





