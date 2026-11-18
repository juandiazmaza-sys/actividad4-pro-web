import "dotenv/config";
import express from "express";
import { db } from "./db.js";

// Probar conexión a MySQL al iniciar
try {
  await db.query("SELECT 1");
  console.log("✅ Conexión exitosa a MySQL");
} catch (error) {
  console.error("❌ Error de conexión a MySQL:");
  console.error(error);
}

const app = express();
const PORT = 3000;

app.use(express.json());

// GET /productos
app.get("/productos", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM productos"
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      error: "Error en la base de datos"
    });
  }
});

// GET /productos/:id
app.get("/productos/:id", async (req, res) => {
  try {
    const [filas] = await db.query(
      "SELECT * FROM productos WHERE id = ?",
      [req.params.id]
    );

    if (filas.length === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.status(200).json(filas[0]);
  } catch (error) {
    res.status(500).json({
      error: "Error en la base de datos"
    });
  }
});

// POST /productos
app.post("/productos", async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;

    const [resultado] = await db.query(
      "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)",
      [nombre, precio, stock]
    );

    res.status(201).json({
      id: resultado.insertId,
      nombre,
      precio,
      stock
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en la base de datos"
    });
  }
});

// PUT /productos/:id
app.put("/productos/:id", async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;

    const [resultado] = await db.query(
      "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?",
      [nombre, precio, stock, req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.json({
      mensaje: "Producto actualizado"
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en la base de datos"
    });
  }
});

// PATCH /productos/:id
app.patch("/productos/:id", async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;

    const [resultado] = await db.query(
      "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?",
      [nombre, precio, stock, req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.json({
      mensaje: "Producto actualizado"
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en la base de datos"
    });
  }
});

// DELETE /productos/:id
app.delete("/productos/:id", async (req, res) => {
  try {
    const [resultado] = await db.query(
      "DELETE FROM productos WHERE id = ?",
      [req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        error: "Producto no encontrado"
      });
    }

    res.json({
      mensaje: "Producto eliminado"
    });
  } catch (error) {
    res.status(500).json({
      error: "Error en la base de datos"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});