"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Layers, MapPin, Package, Search,
  ChevronRight, X, Clock, CheckCircle2,
  AlertTriangle, ArrowLeft,
} from "lucide-react";
import apiService, { getSessionUser } from "@/lib/api";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const ESTADO_CFG = {
  disponible:    { label: "Disponible",    color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2  },
  en_uso:        { label: "En uso",        color: "bg-yellow-50  text-yellow-700  border-yellow-200",  icon: Clock         },
  mantenimiento: { label: "Mantenimiento", color: "bg-red-50     text-red-600     border-red-200",     icon: AlertTriangle },
};

function EstadoBadge({ estado }) {
  const cfg  = ESTADO_CFG[estado] || ESTADO_CFG.disponible;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase border px-2 py-0.5 rounded-full ${cfg.color}`}>
      <Icon size={10} /> {cfg.label}
    </span>
  );
}

// ─────────────────────────────────────────────
// VISTA DETALLE DE UN ÁREA
// ─────────────────────────────────────────────
function DetalleArea({ area, articulos, onVolver }) {
  const [busqueda,     setBusqueda]     = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const articulosFiltrados = articulos.filter((item) => {
    const matchEstado  = filtroEstado === "todos" || item.estado === filtroEstado;
    const matchBusqueda = item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                          item.categoria?.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchBusqueda;
  });

  const disponibles = articulos.filter((i) => i.estado === "disponible").length;
  const enUso       = articulos.filter((i) => i.estado === "en_uso").length;
  const mantto      = articulos.filter((i) => i.estado === "mantenimiento").length;

  return (
    <motion.div
      key="detalle"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
    >
      {/* Cabecera detalle */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onVolver}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-500
                     hover:text-[#002B49] uppercase tracking-wide transition-colors"
        >
          <ArrowLeft size={13} /> Todas las áreas
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-xs font-bold text-[#002B49] uppercase">{area.name}</span>
      </div>

      {/* Info del área */}
      <div className="bg-[#002B49] rounded-xl p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <MapPin size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black">{area.name}</h2>
            {area.description && <p className="text-blue-200 text-sm">{area.description}</p>}
          </div>
        </div>
        {/* Contadores */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Disponibles",    value: disponibles, color: "bg-emerald-500/20 text-emerald-300" },
            { label: "En uso",         value: enUso,       color: "bg-yellow-500/20  text-yellow-300"  },
            { label: "Mantenimiento",  value: mantto,      color: "bg-red-500/20     text-red-300"     },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-lg p-3 text-center ${color}`}>
              <p className="text-2xl font-black">{value}</p>
              <p className="text-[10px] font-bold uppercase opacity-80">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar artículo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-lg
                       text-sm focus:border-[#002B49] outline-none"
          />
        </div>
        <div className="flex gap-1 bg-gray-200 p-1 rounded-lg">
          {[
            { key: "todos",         label: `Todos (${articulos.length})`   },
            { key: "disponible",    label: `Disponibles (${disponibles})`  },
            { key: "en_uso",        label: `En uso (${enUso})`             },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFiltroEstado(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
                filtroEstado === key ? "bg-white text-[#002B49] shadow-sm" : "text-gray-500"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de artículos */}
      {articulosFiltrados.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-white">
          <Package size={28} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-bold text-sm">
            {busqueda || filtroEstado !== "todos" ? "Sin resultados." : "Esta área no tiene artículos asignados."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#002B49] text-white text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-bold">Artículo</th>
                <th className="px-4 py-3 text-left font-bold">Categoría</th>
                <th className="px-4 py-3 text-center font-bold">Cantidad</th>
                <th className="px-4 py-3 text-center font-bold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articulosFiltrados.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-800">{item.nombre}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{item.categoria || "—"}</td>
                  <td className="px-4 py-3 text-center font-mono font-bold text-gray-700">{item.cantidad}</td>
                  <td className="px-4 py-3 text-center">
                    <EstadoBadge estado={item.estado || "disponible"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// TARJETA DE ÁREA (vista lista)
// ─────────────────────────────────────────────
function AreaCard({ area, articulos, onClick, index }) {
  const disponibles = articulos.filter((i) => i.estado === "disponible").length;
  const enUso       = articulos.filter((i) => i.estado === "en_uso").length;

  return (
    <motion.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={onClick}
      className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#002B49]
                 p-5 text-left w-full shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#002B49]/10 group-hover:bg-[#002B49]
                          flex items-center justify-center transition-colors">
            <MapPin size={18} className="text-[#002B49] group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="font-black text-gray-800 text-base">{area.name}</h3>
            {area.description && <p className="text-xs text-gray-400">{area.description}</p>}
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-300 group-hover:text-[#002B49] transition-colors" />
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-50 rounded-lg p-2 text-center">
          <p className="text-lg font-black text-gray-700">{articulos.length}</p>
          <p className="text-[9px] font-bold text-gray-400 uppercase">Total</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-2 text-center">
          <p className="text-lg font-black text-emerald-600">{disponibles}</p>
          <p className="text-[9px] font-bold text-emerald-500 uppercase">Disponibles</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-2 text-center">
          <p className="text-lg font-black text-yellow-600">{enUso}</p>
          <p className="text-[9px] font-bold text-yellow-500 uppercase">En uso</p>
        </div>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────
export default function RecursosPage() {
  const [areas,      setAreas]      = useState([]);
  const [inventario, setInventario] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [areaSeleccionada, setAreaSeleccionada] = useState(null);
  const [vistaActiva,      setVistaActiva]      = useState("areas"); // "areas" | "catalogo"
  const [busquedaCatalogo, setBusquedaCatalogo] = useState("");

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resAreas, resInv] = await Promise.all([
        apiService.getAreas(),
        apiService.getInventario(),
      ]);
      if (resAreas.success) setAreas(resAreas.data);
      if (resInv.success)   setInventario(resInv.data);
      if (!resAreas.success) setError(resAreas.error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const articulosPorArea = (areaId) => inventario.filter((i) => i.area_id === areaId);

  const catalogoFiltrado = inventario.filter((item) => {
    const q = busquedaCatalogo.toLowerCase();
    return item.nombre?.toLowerCase().includes(q) || item.categoria?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">

      <AnimatePresence mode="wait">

        {/* ── VISTA DETALLE DE ÁREA ── */}
        {areaSeleccionada ? (
          <DetalleArea
            key="detalle"
            area={areaSeleccionada}
            articulos={articulosPorArea(areaSeleccionada.id)}
            onVolver={() => setAreaSeleccionada(null)}
          />
        ) : (

          /* ── VISTA LISTA ── */
          <motion.div key="lista" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* Encabezado */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                  <Layers size={26} /> Recursos
                </h2>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                  Explora las áreas y el catálogo de artículos
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-200 p-1 rounded-lg w-fit mb-6">
              {[
                { key: "areas",    label: `Áreas (${areas.length})`,         icon: MapPin  },
                { key: "catalogo", label: `Catálogo (${inventario.length})`, icon: Package },
              ].map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setVistaActiva(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold
                              uppercase transition-all ${
                    vistaActiva === key ? "bg-white text-[#002B49] shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}>
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />)}
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm font-bold">{error}</div>
            ) : (
              <AnimatePresence mode="wait">

                {/* ÁREAS */}
                {vistaActiva === "areas" && (
                  <motion.div key="areas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {areas.length === 0 ? (
                      <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                        <MapPin size={32} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-bold">No hay áreas creadas aún.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {areas.map((area, i) => (
                          <AreaCard
                            key={area.id}
                            area={area}
                            articulos={articulosPorArea(area.id)}
                            onClick={() => setAreaSeleccionada(area)}
                            index={i}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* CATÁLOGO */}
                {vistaActiva === "catalogo" && (
                  <motion.div key="catalogo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div className="relative mb-4">
                      <Search size={15} className="absolute left-3 top-3 text-gray-400" />
                      <input type="text" placeholder="Buscar por nombre o categoría..."
                        value={busquedaCatalogo} onChange={(e) => setBusquedaCatalogo(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-lg
                                   text-sm focus:border-[#002B49] outline-none" />
                    </div>

                    {catalogoFiltrado.length === 0 ? (
                      <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                        <Package size={32} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-bold">
                          {busquedaCatalogo ? "Sin resultados." : "El inventario está vacío."}
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
                                <tr key={item.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 font-semibold text-gray-800">{item.nombre}</td>
                                  <td className="px-4 py-3 text-xs text-gray-500">{item.categoria || "—"}</td>
                                  <td className="px-4 py-3 text-xs">
                                    {area
                                      ? <span className="font-semibold text-[#002B49]">{area.name}</span>
                                      : <span className="text-gray-300 italic">Sin área</span>
                                    }
                                  </td>
                                  <td className="px-4 py-3 text-center font-mono font-bold text-gray-700">{item.cantidad}</td>
                                  <td className="px-4 py-3 text-center">
                                    <EstadoBadge estado={item.estado || "disponible"} />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        <div className="px-4 py-3 bg-gray-50 border-t text-xs text-gray-500">
                          Mostrando <strong>{catalogoFiltrado.length}</strong> de <strong>{inventario.length}</strong> artículos
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
