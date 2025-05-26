const sqlite3 = require("sqlite3").verbose();

// Crear la conexión
const db = new sqlite3.Database("students.sqlite", (err) => {
  if (err) {
    console.error("Error al crear la base de datos:", err.message);
    return;
  }
  console.log("Base de datos creada o conectada correctamente.");
});

// Crear la tabla
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT
  )
`;

db.run(createTableQuery, (err) => {
  if (err) {
    console.error("Error al crear la tabla:", err.message);
  } else {
    console.log("Tabla 'students' creada exitosamente (si no existía).");
  }

  // Cerrar la base de datos después de crear la tabla
  db.close((err) => {
    if (err) {
      console.error("Error al cerrar la base de datos:", err.message);
    } else {
      console.log("Conexión a la base de datos cerrada.");
    }
  });
});
