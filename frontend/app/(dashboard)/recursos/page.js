"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Boxes, Plus, X, Search, MapPin,
  Package, ChevronDown, ChevronUp, Layers,
} from "lucide-react";
import apiService, { getSessionUser } from "@/lib/api";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function EstadoBadge({ estado }) {
  const cfg = {
    disponible:   "bg-emerald-50 text-emerald-700 border-emerald-200",
    en_uso:       "bg-yellow-50  text-yellow-700  border-yellow-200",
    mantenimiento:"bg-red-50     text-red-600     border-red-200",
  };
  const label = {
    disponible:    "Disponible",
    en_uso:        "En uso",
    mantenimiento: "Mantenimiento",
  };
  return (
    <span className={`text-[10px] font-bold uppercase border px-2 py-0.5 rounded ${cfg[estado] || cfg.disponible}`}>
      {label[estado] || estado}
    </span>
  );
}

// ─────────────────────────────────────────────
// MODAL: CREAR ÁREA
// ─────────────────────────────────────────────
function ModalCrearArea({ inventario, onClose, onCreada }) {
  const [form,    setForm]    = useState({ name: "", description: "" });
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await apiService.crearArea({
        name:        form.name.trim(),
        description: form.description.trim() || null,
      });
      if (res.success) {
        onCreada(res.data);
      } else {
        setError(res.error || "Error al crear el área.");
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="font-black text-[#002B49] text-lg uppercase tracking-tight">
              Nueva Área
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Las áreas agrupan recursos del inventario
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
              Nombre del área *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej. Laboratorio de Cómputo"
              required
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm
                         focus:border-[#002B49] outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descripción breve del área..."
              rows={3}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm
                         focus:border-[#002B49] outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-bold
                         text-xs uppercase rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-[#002B49] text-white font-bold text-xs uppercase
                         rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              {saving ? "Creando..." : "Crear área"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TARJETA DE ÁREA
// ─────────────────────────────────────────────
function AreaCard({ area, inventario }) {
  const [expandida, setExpandida] = useState(false);

  // Artículos que pertenecen a esta área
  const articulos = inventario.filter((item) => item.area_id === area.id);
  const disponibles = articulos.filter((i) => i.estado === "disponible").length;
  const enUso       = articulos.filter((i) => i.estado === "en_uso").length;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#002B49]
                    transition-colors shadow-sm overflow-hidden">
      {/* Cabecera de la tarjeta */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#002B49] flex items-center justify-center flex-shrink-0">
              <MapPin size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-black text-gray-800 text-base uppercase tracking-tight">
                {area.name}
              </h3>
              {area.description && (
                <p className="text-xs text-gray-400 mt-0.5">{area.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-black text-[#002B49]">{articulos.length}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase">Total</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-black text-emerald-600">{disponibles}</p>
            <p className="text-[10px] font-bold text-emerald-600 uppercase">Disponibles</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-black text-yellow-600">{enUso}</p>
            <p className="text-[10px] font-bold text-yellow-600 uppercase">En uso</p>
          </div>
        </div>
      </div>

      {/* Botón expandir artículos */}
      {articulos.length > 0 && (
        <>
          <button
            onClick={() => setExpandida(!expandida)}
            className="w-full flex items-center justify-between px-5 py-3
                       bg-gray-50 hover:bg-gray-100 transition-colors border-t border-gray-200
                       text-xs font-bold text-gray-600 uppercase tracking-wide"
          >
            <span>Ver artículos ({articulos.length})</span>
            {expandida ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <AnimatePresence>
            {expandida && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <ul className="divide-y divide-gray-100 max-h-52 overflow-y-auto">
                  {articulos.map((item) => (
                    <li key={item.id} className="flex items-center justify-between px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <Package size={13} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs font-semibold text-gray-700">{item.nombre}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 font-mono">×{item.cantidad}</span>
                        <EstadoBadge estado={item.estado} />
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {articulos.length === 0 && (
        <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400 italic">
          Sin artículos asignados aún.
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────
export default function RecursosPage() {
  const [areas,       setAreas]       = useState([]);
  const [inventario,  setInventario]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [busqueda,    setBusqueda]    = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [vistaActiva, setVistaActiva] = useState("areas"); // "areas" | "catalogo"

  const user     = getSessionUser();
  const isAdmin  = user?.role === "admin" || user?.role === "super_admin";

  // ── Carga inicial ──────────────────────────
  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resAreas, resInv] = await Promise.all([
        apiService.getAreas(),
        apiService.getInventario(),
      ]);
      if (resAreas.success)  setAreas(resAreas.data);
      if (resInv.success)    setInventario(resInv.data);
      if (!resAreas.success) setError(resAreas.error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // ── Área creada ────────────────────────────
  const handleAreaCreada = (nuevaArea) => {
    setAreas((prev) => [...prev, nuevaArea]);
    setModalAbierto(false);
  };

  // ── Filtrado del catálogo ──────────────────
  const catalogoFiltrado = inventario.filter((item) => {
    const q = busqueda.toLowerCase();
    return (
      item.nombre?.toLowerCase().includes(q) ||
      item.categoria?.toLowerCase().includes(q)
    );
  });

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Layers size={26} /> Recursos
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
            Áreas y catálogo de artículos
          </p>
        </div>

        {/* Botón nueva área — solo admins */}
        {isAdmin && (
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 bg-[#002B49] text-white px-5 py-2.5
                       font-bold text-xs uppercase rounded-lg hover:bg-slate-800
                       transition-colors shadow-md"
          >
            <Plus size={15} /> Nueva área
          </button>
        )}
      </div>

      {/* TABS */}
      <div className="flex gap-1 bg-gray-200 p-1 rounded-lg w-fit mb-6">
        {[
          { key: "areas",    label: `Áreas (${areas.length})`,           icon: MapPin  },
          { key: "catalogo", label: `Catálogo (${inventario.length})`,   icon: Package },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setVistaActiva(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold
                        uppercase transition-all ${
              vistaActiva === key
                ? "bg-white text-[#002B49] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* CONTENIDO */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm font-bold">
          {error}
        </div>
      ) : (
        <>
          {/* ── VISTA: ÁREAS ── */}
          {vistaActiva === "areas" && (
            <AnimatePresence mode="wait">
              <motion.div
                key="areas"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {areas.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                    <MapPin size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-bold">No hay áreas creadas aún.</p>
                    {isAdmin && (
                      <button
                        onClick={() => setModalAbierto(true)}
                        className="mt-4 text-xs font-bold text-[#002B49] underline"
                      >
                        Crear la primera área
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {areas.map((area) => (
                      <AreaCard key={area.id} area={area} inventario={inventario} />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}

          {/* ── VISTA: CATÁLOGO ── */}
          {vistaActiva === "catalogo" && (
            <AnimatePresence mode="wait">
              <motion.div
                key="catalogo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Buscador */}
                <div className="relative mb-4">
                  <Search size={15} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o categoría..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-lg
                               text-sm focus:border-[#002B49] outline-none transition-colors"
                  />
                </div>

                {catalogoFiltrado.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                    <Package size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-bold">
                      {busqueda ? "Sin resultados para esa búsqueda." : "El inventario está vacío."}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#002B49] text-white text-xs uppercase tracking-wider">
                          <th className="px-4 py-3 text-left font-bold">Artículo</th>
                          <th className="px-4 py-3 text-left font-bold">Categoría</th>
                          <th className="px-4 py-3 text-left font-bold">Área</th>
                          <th className="px-4 py-3 text-center font-bold">Cantidad</th>
                          <th className="px-4 py-3 text-center font-bold">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {catalogoFiltrado.map((item) => {
                          const area = areas.find((a) => a.id === item.area_id);
                          return (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 font-semibold text-gray-800">
                                {item.nombre}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500">
                                {item.categoria || "—"}
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500">
                                {area?.name || <span className="italic text-gray-300">Sin área</span>}
                              </td>
                              <td className="px-4 py-3 text-center font-mono font-bold text-gray-700">
                                {item.cantidad}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <EstadoBadge estado={item.estado || "disponible"} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">
                      Mostrando <strong>{catalogoFiltrado.length}</strong> de{" "}
                      <strong>{inventario.length}</strong> artículos
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}

      {/* MODAL CREAR ÁREA */}
      <AnimatePresence>
        {modalAbierto && (
          <ModalCrearArea
            inventario={inventario}
            onClose={() => setModalAbierto(false)}
            onCreada={handleAreaCreada}
          />
        )}
      </AnimatePresence>
    </div>
  );
}