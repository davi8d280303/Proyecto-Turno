"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings, MapPin, Plus, Edit3,
  ToggleLeft, ToggleRight, X, Check,
} from "lucide-react";
import apiService, { getSessionUser } from "@/lib/api";

// ─────────────────────────────────────────────
// MODAL CREAR / EDITAR ÁREA
// ─────────────────────────────────────────────
function ModalArea({ area, onClose, onGuardada }) {
  const editando = Boolean(area);
  const [form,   setForm]   = useState({
    name:        area?.name        || "",
    description: area?.description || "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name:        form.name.trim(),
        description: form.description.trim() || null,
      };

      const res = editando
        ? await apiService.editarArea(area.id, payload)
        : await apiService.crearArea(payload);

      if (res.success) {
        onGuardada(res.data, editando);
      } else {
        setError(res.error || "Error al guardar.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-md rounded-xl shadow-2xl border-t-4 border-[#002B49]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-black text-[#002B49] text-lg uppercase tracking-tight">
            {editando ? "Editar área" : "Nueva área"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <p className="text-xs text-red-600 font-bold bg-red-50 border border-red-200 p-3 rounded-lg">
              {error}
            </p>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
              Nombre *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej. Laboratorio de Cómputo"
              required
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm
                         focus:border-[#002B49] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe brevemente esta área..."
              rows={3}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm
                         focus:border-[#002B49] outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-bold
                         text-xs uppercase rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-[#002B49] text-white font-bold text-xs uppercase
                         rounded-lg hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Guardando..." : editando ? "Guardar cambios" : "Crear área"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────
export default function ConfiguracionPage() {
  const [areas,        setAreas]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [modalArea,    setModalArea]    = useState(null); // null | "nuevo" | {area object}
  const [toast,        setToast]        = useState(null);

  const user        = getSessionUser();
  const isSuperAdmin = user?.role === "super_admin";

  const mostrarToast = (msg, tipo = "success") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Cargar áreas ───────────────────────────
  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Traer todas las áreas incluyendo inactivas (endpoint con admin)
      const res = await apiService.getTodasLasAreas();
      if (res.success) setAreas(res.data);
      else setError(res.error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // ── Área guardada (crear o editar) ─────────
  const handleGuardada = (areaData, fueEdicion) => {
    if (fueEdicion) {
      setAreas((prev) => prev.map((a) => (a.id === areaData.id ? areaData : a)));
      mostrarToast("Área actualizada correctamente.");
    } else {
      setAreas((prev) => [...prev, areaData]);
      mostrarToast("Área creada correctamente.");
    }
    setModalArea(null);
  };

  // ── Activar / Desactivar área ──────────────
  const handleToggleArea = async (area) => {
    const res = await apiService.editarArea(area.id, { is_active: !area.is_active });
    if (res.success) {
      setAreas((prev) => prev.map((a) => (a.id === area.id ? { ...a, is_active: !a.is_active } : a)));
      mostrarToast(`Área "${area.name}" ${!area.is_active ? "activada" : "desactivada"}.`);
    } else {
      mostrarToast(res.error || "Error al actualizar.", "error");
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 font-bold uppercase text-sm">
        No tienes permisos para ver esta sección.
      </div>
    );
  }

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-3
                        rounded-xl shadow-lg text-sm font-bold text-white
                        ${toast.tipo === "error" ? "bg-red-600" : "bg-emerald-600"}`}
          >
            <Check size={15} /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ENCABEZADO */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Settings size={26} /> Configuración
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
            Gestión de áreas del sistema
          </p>
        </div>
        <button
          onClick={() => setModalArea("nuevo")}
          className="flex items-center gap-2 bg-[#002B49] text-white px-5 py-2.5
                     font-bold text-xs uppercase rounded-lg hover:bg-slate-800
                     transition-colors shadow-md"
        >
          <Plus size={15} /> Nueva área
        </button>
      </div>

      {/* SECCIÓN ÁREAS */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} className="text-[#002B49]" />
          <h3 className="font-black text-gray-700 uppercase tracking-wide text-sm">
            Áreas del sistema ({areas.length})
          </h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm font-bold">
            {error}
          </div>
        ) : areas.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-white">
            <MapPin size={28} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-bold text-sm">No hay áreas creadas.</p>
            <button
              onClick={() => setModalArea("nuevo")}
              className="mt-3 text-xs font-bold text-[#002B49] underline"
            >
              Crear la primera
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {areas.map((area, i) => (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-white rounded-xl border-2 p-5 flex items-center justify-between gap-4
                            transition-colors ${area.is_active ? "border-gray-200" : "border-gray-100 opacity-50"}`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                                   ${area.is_active ? "bg-[#002B49]" : "bg-gray-300"}`}>
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-gray-800 truncate">{area.name}</h4>
                      {!area.is_active && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200
                                         px-2 py-0.5 rounded-full font-bold uppercase flex-shrink-0">
                          Inactiva
                        </span>
                      )}
                    </div>
                    {area.description && (
                      <p className="text-xs text-gray-400 truncate">{area.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Editar */}
                  <button
                    onClick={() => setModalArea(area)}
                    className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Editar"
                  >
                    <Edit3 size={15} />
                  </button>

                  {/* Activar / Desactivar */}
                  <button
                    onClick={() => handleToggleArea(area)}
                    className={`p-2 rounded-lg transition-colors ${
                      area.is_active
                        ? "hover:bg-red-50 text-red-400"
                        : "hover:bg-emerald-50 text-emerald-500"
                    }`}
                    title={area.is_active ? "Desactivar" : "Activar"}
                  >
                    {area.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {modalArea && (
          <ModalArea
            area={modalArea === "nuevo" ? null : modalArea}
            onClose={() => setModalArea(null)}
            onGuardada={handleGuardada}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
