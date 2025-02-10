const connection = require('./db');

// Verificar las variables de entorno
console.log('Variables de entorno:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET, // Imprime la clave secreta para verificar
});

// Prueba de consulta a la base de datos
connection.query('SELECT 1 + 1 AS solution', (err, results) => {
  if (err) {
    console.error('❌ Error en la consulta:', err);
    return;
  }
  console.log('✅ Conexión exitosa, resultado:', results[0].solution);
  connection.end(); // Cierra la conexión después de la prueba
});

  

