const express = require("express");
const router = express.Router();
const { getSupabaseAdmin } = require("../config/supabaseClient");
const isAuth = require("../middleware/isAuth");

// 1. OBTENER TODO EL INVENTARIO
// URL: GET /api/inventario
router.get("/", isAuth, async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();
    const filters = {};

    const { role, area_id } = req.auth;

    if (role !== "admin") {
      filters.area_id = `eq.${area_id}`;
    }

    const data = await db.restSelect("inventario", { filters });

    res.json({ success: true, data });
  } catch (error) {
    console.error("Error en GET /inventario:", error);
    next(error);
  }
});

// 2. CREAR NUEVO ITEM
// URL: POST /api/inventario
router.post("/", isAuth, async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();
    const { nombre, cantidad, descripcion, categoria } = req.body;

    // Validación de seguridad
    if (!nombre || cantidad == null) {
      return res.status(400).json({
        success: false,
        message: "El nombre y la cantidad son campos obligatorios.",
      });
    }

    const { area_id } = req.auth;

    const payload = {
      nombre,
      cantidad: Number(cantidad),
      descripcion: descripcion || null,
      categoria: categoria || "GENERAL",
      area_id: req.auth.area_id, // Se asigna automáticamente el área del usuario que crea
    };

    const data = await db.restInsert("inventario", payload);

    res.status(201).json({
      success: true,
      data: data?.[0] || data,
    });
  } catch (error) {
    console.error("Error en POST /inventario:", error);
    next(error);
  }
});

// 3. ELIMINAR ITEM
// URL: DELETE /api/inventario/:id
router.delete("/:id", isAuth, async (req, res, next) => {
  try {
    const db = getSupabaseAdmin();

    // 👇 extraemos bien desde auth (FORMA PRO)
    const { role, area_id } = req.auth;

    const filters = {
      id: `eq.${req.params.id}`,
    };

    // 🔒 Seguridad por área
    if (role !== "admin") {
      filters.area_id = `eq.${area_id}`;
    }

    await db.restDelete("inventario", { filters });

    res.json({
      success: true,
      message: "Recurso eliminado correctamente",
    });
  } catch (error) {
    console.error("Error en DELETE /inventario:", error);
    next(error);
  }
}); 
// 09-04-26 abraham

module.exports = router;
