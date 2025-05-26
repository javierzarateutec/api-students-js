const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const PORT = 8000;

// Middleware para parsear datos de formularios
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Crear conexión a la base de datos
const db = new sqlite3.Database("students.sqlite", (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite");
  }
});

// 📌 GET /students - obtener todos los estudiantes
app.get("/students", (req, res) => {
  db.all("SELECT * FROM students", [], (err, rows) => {
    if (err) {
      res.status(500).send("Error al obtener estudiantes");
    } else {
      const students = rows.map((row) => ({
        id: row.id,
        firstname: row.firstname,
        lastname: row.lastname,
        gender: row.gender,
        age: row.age
      }));
      res.json(students);
    }
  });
});

// 📌 POST /students - crear un nuevo estudiante
app.post("/students", (req, res) => {
  const { firstname, lastname, gender, age } = req.body;
  const sql = "INSERT INTO students (firstname, lastname, gender, age) VALUES (?, ?, ?, ?)";
  db.run(sql, [firstname, lastname, gender, age], function (err) {
    if (err) {
      res.status(500).send("Error al insertar estudiante");
    } else {
      res.send(`Student with id: ${this.lastID} created successfully`);
    }
  });
});

// 📌 GET /student/:id - obtener un estudiante por ID
app.get("/student/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).send("Error al obtener estudiante");
    } else if (!row) {
      res.status(404).send("Estudiante no encontrado");
    } else {
      res.json(row);
    }
  });
});

// 📌 PUT /student/:id - actualizar un estudiante
app.put("/student/:id", (req, res) => {
  const id = req.params.id;
  const { firstname, lastname, gender, age } = req.body;

  const sql = `UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?`;
  db.run(sql, [firstname, lastname, gender, age, id], function (err) {
    if (err) {
      res.status(500).send("Error al actualizar estudiante");
    } else {
      res.json({
        id: id,
        firstname,
        lastname,
        gender,
        age
      });
    }
  });
});

// 📌 DELETE /student/:id - eliminar un estudiante
app.delete("/student/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM students WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).send("Error al eliminar estudiante");
    } else {
      res.send(`The Student with id: ${id} has been deleted.`);
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${PORT}`);
});
