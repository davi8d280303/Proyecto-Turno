"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  Settings, MapPin, Plus, Edit3, X, Check,
  ToggleLeft, ToggleRight, ArrowLeft, Package,
  ChevronDown, ChevronUp,
} from "lucide-react";
import apiService, { getSessionUser } from "@/lib/api";

// ─────────────────────────────────────────────
// BOTÓN VOLVER AL PANEL — reutilizable
// ─────────────────────────────────────────────
function BotonVolver() {
  return (
    <Link
      href="/panel"
      className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500
                 hover:text-[#002B49] uppercase tracking-wide transition-colors mb-6"
    >
      <ArrowLeft size={13} /> Volver al panel
    </Link>
  );
}

// ─────────────────────────────────────────────
// MODAL CREAR / EDITAR ÁREA
// ─────────────────────────────────────────────
function ModalArea({ area, onClose, onGuardada }) {
  const editando = Boolean(area);
  const [form,   setForm]   = useState({ name: area?.name || "", description: area?.description || "" });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { name: form.name.trim(), description: form.description.trim() || null };
      const res = editando
        ? await apiService.editarArea(area.id, payload)
        : await apiService.crearArea(payload);
      if (res.success) onGuardada(res.data, editando);
      else setError(res.error || "Error al guardar.");
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
          <h3 className="font-black text-[#002B49] text-lg uppercase">
            {editando ? "Editar área" : "Nueva área"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && <p className="text-xs text-red-600 font-bold bg-red-50 border border-red-200 p-3 rounded-lg">{error}</p>}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Nombre *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej. Laboratorio de Cómputo" required
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-[#002B49] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Descripción</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Describe brevemente esta área..."
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-[#002B49] outline-none resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-bold text-xs uppercase rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-[#002B49] text-white font-bold text-xs uppercase rounded-lg hover:bg-slate-800 disabled:opacity-60">
              {saving ? "Guardando..." : editando ? "Guardar cambios" : "Crear área"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TARJETA DE ÁREA con asignación de artículos
// ─────────────────────────────────────────────
function AreaCard({ area, inventarioSinArea, inventarioDelArea, onEditar, onToggle, onAsignar, onDesasignar }) {
  const [expandida, setExpandida] = useState(false);
  const [asignando, setAsignando] = useState(false);
  const [seleccion, setSeleccion] = useState("");

  const handleAsignar = async () => {
    if (!seleccion) return;
    setAsignando(true);
    await onAsignar(seleccion, area.id);
    setSeleccion("");
    setAsignando(false);
  };

  return (
    <div className={`bg-white rounded-xl border-2 transition-colors ${
      area.is_active ? "border-gray-200" : "border-gray-100 opacity-60"
    }`}>
      {/* Cabecera */}
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            area.is_active ? "bg-[#002B49]" : "bg-gray-300"
          }`}>
            <MapPin size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-black text-gray-800 truncate">{area.name}</h4>
              {!area.is_active && (
                <span className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full font-bold uppercase">
                  Inactiva
                </span>
              )}
            </div>
            {area.description && <p className="text-xs text-gray-400 truncate">{area.description}</p>}
            <p className="text-xs text-gray-400 mt-0.5">
              <span className="font-bold text-gray-600">{inventarioDelArea.length}</span> artículo{inventarioDelArea.length !== 1 ? "s" : ""} asignado{inventarioDelArea.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onEditar(area)} title="Editar"
            className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
            <Edit3 size={15} />
          </button>
          <button onClick={() => onToggle(area)} title={area.is_active ? "Desactivar" : "Activar"}
            className={`p-2 rounded-lg transition-colors ${area.is_active ? "hover:bg-red-50 text-red-400" : "hover:bg-emerald-50 text-emerald-500"}`}>
            {area.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
          </button>
          <button onClick={() => setExpandida(!expandida)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            {expandida ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* Panel expandible: artículos asignados + asignar nuevo */}
      <AnimatePresence>
        {expandida && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="p-4 space-y-4">

              {/* Asignar artículo */}
              {area.is_active && (
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                    Asignar artículo a esta área
                  </p>
                  {inventarioSinArea.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">
                      No hay artículos sin área disponibles.
                    </p>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        value={seleccion}
                        onChange={(e) => setSeleccion(e.target.value)}
                        className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-xs
                                   focus:border-[#002B49] outline-none"
                      >
                        <option value="">Selecciona un artículo...</option>
                        {inventarioSinArea.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.nombre} {item.categoria ? `· ${item.categoria}` : ""}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAsignar}
                        disabled={!seleccion || asignando}
                        className="px-4 py-2 bg-[#002B49] text-white font-bold text-xs uppercase
                                   rounded-lg hover:bg-slate-800 disabled:opacity-40 transition-colors"
                      >
                        {asignando ? "..." : "Asignar"}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Lista de artículos del área */}
              {inventarioDelArea.length > 0 ? (
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
                    Artículos en esta área
                  </p>
                  <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                    {inventarioDelArea.map((item) => (
                      <li key={item.id}
                        className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Package size={13} className="text-gray-400" />
                          <span className="text-xs font-semibold text-gray-700">{item.nombre}</span>
                          {item.categoria && (
                            <span className="text-[10px] text-gray-400">· {item.categoria}</span>
                          )}
                        </div>
                        <button
                          onClick={() => onDesasignar(item.id)}
                          title="Quitar del área"
                          className="text-gray-300 hover:text-red-500 transition-colors ml-2"
                        >
                          <X size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">Sin artículos asignados aún.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────
export default function ConfiguracionPage() {
  const [areas,      setAreas]      = useState([]);
  const [inventario, setInventario] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [modalArea,  setModalArea]  = useState(null);
  const [toast,      setToast]      = useState(null);

  const user         = getSessionUser();
  const isSuperAdmin = user?.role === "super_admin";
  const isAdmin      = user?.role === "admin" || isSuperAdmin;

  const mostrarToast = (msg, tipo = "success") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resAreas, resInv] = await Promise.all([
        apiService.getTodasLasAreas(),
        apiService.getInventario(),
      ]);
      if (resAreas.success) setAreas(resAreas.data);
      else setError(resAreas.error);
      if (resInv.success) setInventario(resInv.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // Artículos sin área asignada
  const inventarioSinArea = inventario.filter((i) => !i.area_id);

  // Artículos de un área específica
  const inventarioDeArea = (areaId) => inventario.filter((i) => i.area_id === areaId);

  // Asignar artículo a un área
  const handleAsignar = async (inventarioId, areaId) => {
    const res = await apiService.actualizarItemInventario(inventarioId, { area_id: areaId });
    if (res.success) {
      setInventario((prev) => prev.map((i) => i.id === inventarioId ? { ...i, area_id: areaId } : i));
      mostrarToast("Artículo asignado correctamente.");
    } else {
      mostrarToast(res.error || "Error al asignar.", "error");
    }
  };

  // Desasignar artículo (quitar del área)
  const handleDesasignar = async (inventarioId) => {
    const res = await apiService.actualizarItemInventario(inventarioId, { area_id: null });
    if (res.success) {
      setInventario((prev) => prev.map((i) => i.id === inventarioId ? { ...i, area_id: null } : i));
      mostrarToast("Artículo removido del área.");
    } else {
      mostrarToast(res.error || "Error al remover.", "error");
    }
  };

  // Área creada o editada
  const handleGuardada = (areaData, fueEdicion) => {
    if (fueEdicion) {
      setAreas((prev) => prev.map((a) => a.id === areaData.id ? areaData : a));
      mostrarToast("Área actualizada.");
    } else {
      setAreas((prev) => [...prev, areaData]);
      mostrarToast("Área creada.");
    }
    setModalArea(null);
  };

  // Activar / desactivar área
  const handleToggle = async (area) => {
    const res = await apiService.editarArea(area.id, { is_active: !area.is_active });
    if (res.success) {
      setAreas((prev) => prev.map((a) => a.id === area.id ? { ...a, is_active: !a.is_active } : a));
      mostrarToast(`Área "${area.name}" ${!area.is_active ? "activada" : "desactivada"}.`);
    } else {
      mostrarToast(res.error || "Error.", "error");
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-6 text-center text-gray-500 font-bold uppercase text-sm">
        No tienes permisos para ver esta sección.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-3
                        rounded-xl shadow-lg text-sm font-bold text-white
                        ${toast.tipo === "error" ? "bg-red-600" : "bg-emerald-600"}`}
          >
            <Check size={15} /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <BotonVolver />

      {/* ENCABEZADO */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Settings size={26} /> Configuración
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
            Gestión de áreas y asignación de artículos
          </p>
        </div>
        {isSuperAdmin && (
          <button onClick={() => setModalArea("nuevo")}
            className="flex items-center gap-2 bg-[#002B49] text-white px-5 py-2.5
                       font-bold text-xs uppercase rounded-lg hover:bg-slate-800 transition-colors shadow-md">
            <Plus size={15} /> Nueva área
          </button>
        )}
      </div>

      {/* Artículos sin área — aviso si hay */}
      {inventarioSinArea.length > 0 && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800
                        rounded-xl p-4 mb-4 text-sm">
          <Package size={16} className="flex-shrink-0" />
          <p>
            <strong>{inventarioSinArea.length}</strong> artículo{inventarioSinArea.length > 1 ? "s" : ""} sin área asignada.
            Expande un área para asignarlos.
          </p>
        </div>
      )}

      {/* ÁREAS */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm font-bold">{error}</div>
      ) : areas.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-white">
          <MapPin size={28} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-bold text-sm">No hay áreas creadas.</p>
          {isSuperAdmin && (
            <button onClick={() => setModalArea("nuevo")}
              className="mt-3 text-xs font-bold text-[#002B49] underline">
              Crear la primera
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {areas.map((area, i) => (
            <motion.div key={area.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <AreaCard
                area={area}
                inventarioSinArea={inventarioSinArea}
                inventarioDelArea={inventarioDeArea(area.id)}
                onEditar={(a) => setModalArea(a)}
                onToggle={handleToggle}
                onAsignar={handleAsignar}
                onDesasignar={handleDesasignar}
              />
            </motion.div>
          ))}
        </div>
      )}

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
