"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  History, Search, Filter, Download,
  Package, User, Clock, CheckCircle2,
  TrendingUp, RotateCcw, Calendar,
} from "lucide-react";
import apiService, { getSessionUser } from "@/lib/api";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatFecha(dateStr) {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateStr));
}

function formatFechaCorta(dateStr) {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "short" }).format(new Date(dateStr));
}

// Calcula cuántos días/horas duró un préstamo
function duracion(inicio, fin) {
  if (!inicio || !fin) return "—";
  const ms      = new Date(fin) - new Date(inicio);
  const horas   = Math.floor(ms / (1000 * 60 * 60));
  const dias    = Math.floor(horas / 24);
  if (dias > 0)  return `${dias}d ${horas % 24}h`;
  if (horas > 0) return `${horas}h`;
  return "< 1h";
}

function EstadoBadge({ estado }) {
  if (estado === "activo") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase
                       bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full">
        <Clock size={10} /> En préstamo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase
                     bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
      <CheckCircle2 size={10} /> Devuelto
    </span>
  );
}

// ─────────────────────────────────────────────
// TARJETAS DE ESTADÍSTICAS
// ─────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border-2 p-4 flex items-center gap-4 ${color}`}
    >
      <div className="w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center flex-shrink-0">
        <Icon size={22} className="opacity-80" />
      </div>
      <div>
        <p className="text-3xl font-black">{value}</p>
        <p className="text-xs font-bold uppercase tracking-wide opacity-70">{label}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// EXPORTAR CSV
// ─────────────────────────────────────────────
function exportarCSV(datos) {
  const encabezados = ["ID", "Artículo", "Categoría", "Usuario", "Email", "Estado", "Prestado", "Devuelto", "Duración", "Notas"];
  const filas = datos.map((p) => [
    p.id,
    p.articulo?.nombre    || "—",
    p.articulo?.categoria || "—",
    p.usuario?.full_name  || "—",
    p.usuario?.email      || "—",
    p.estado,
    formatFechaCorta(p.prestado_en),
    formatFechaCorta(p.devuelto_en),
    duracion(p.prestado_en, p.devuelto_en),
    p.notas || "",
  ]);

  const contenido = [encabezados, ...filas]
    .map((fila) => fila.map((v) => `"${v}"`).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + contenido], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `historial_prestamos_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────
// FILA DE LA TABLA
// ─────────────────────────────────────────────
function FilaPrestamo({ prestamo, index }) {
  return (
    <motion.tr
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
    >
      {/* Artículo */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Package size={14} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">{prestamo.articulo?.nombre || "—"}</p>
            {prestamo.articulo?.categoria && (
              <p className="text-[10px] text-gray-400">{prestamo.articulo.categoria}</p>
            )}
          </div>
        </div>
      </td>

      {/* Usuario */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <User size={14} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800 text-sm">{prestamo.usuario?.full_name || "—"}</p>
            <p className="text-[10px] text-gray-400">{prestamo.usuario?.email}</p>
          </div>
        </div>
      </td>

      {/* Estado */}
      <td className="px-4 py-3">
        <EstadoBadge estado={prestamo.estado} />
      </td>

      {/* Fecha préstamo */}
      <td className="px-4 py-3 text-xs text-gray-600">
        {formatFecha(prestamo.prestado_en)}
      </td>

      {/* Fecha devolución */}
      <td className="px-4 py-3 text-xs text-gray-600">
        {prestamo.devuelto_en ? formatFecha(prestamo.devuelto_en) : (
          <span className="text-yellow-600 font-bold">Pendiente</span>
        )}
      </td>

      {/* Duración */}
      <td className="px-4 py-3 text-xs text-gray-600 font-mono">
        {prestamo.devuelto_en
          ? duracion(prestamo.prestado_en, prestamo.devuelto_en)
          : <span className="text-yellow-600">En curso</span>
        }
      </td>

      {/* Notas */}
      <td className="px-4 py-3 text-xs text-gray-500 max-w-[150px] truncate" title={prestamo.notas}>
        {prestamo.notas || <span className="text-gray-300">—</span>}
      </td>
    </motion.tr>
  );
}

// ─────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────
export default function HistorialPage() {
  const [prestamos,    setPrestamos]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [busqueda,     setBusqueda]     = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState("todo"); // "hoy" | "semana" | "mes" | "todo"

  const user    = getSessionUser();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  // ── Cargar todos los préstamos ─────────────
  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getPrestamos();
      if (res.success) setPrestamos(res.data);
      else setError(res.error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // ── Filtros combinados con useMemo ─────────
  // useMemo evita recalcular el filtro en cada render,
  // solo lo recalcula cuando cambian los datos o los filtros
  const prestamosFiltrados = useMemo(() => {
    const ahora = new Date();

    return prestamos.filter((p) => {
      // Filtro de estado
      if (filtroEstado !== "todos" && p.estado !== filtroEstado) return false;

      // Filtro de período
      if (filtroPeriodo !== "todo") {
        const fecha = new Date(p.prestado_en);
        if (filtroPeriodo === "hoy") {
          if (fecha.toDateString() !== ahora.toDateString()) return false;
        } else if (filtroPeriodo === "semana") {
          const hace7Dias = new Date(ahora);
          hace7Dias.setDate(ahora.getDate() - 7);
          if (fecha < hace7Dias) return false;
        } else if (filtroPeriodo === "mes") {
          if (
            fecha.getMonth()    !== ahora.getMonth() ||
            fecha.getFullYear() !== ahora.getFullYear()
          ) return false;
        }
      }

      // Filtro de búsqueda
      const q = busqueda.toLowerCase();
      if (!q) return true;
      return (
        p.articulo?.nombre?.toLowerCase().includes(q)    ||
        p.usuario?.full_name?.toLowerCase().includes(q)  ||
        p.usuario?.email?.toLowerCase().includes(q)      ||
        p.notas?.toLowerCase().includes(q)
      );
    });
  }, [prestamos, filtroEstado, filtroPeriodo, busqueda]);

  // ── Estadísticas ───────────────────────────
  const stats = useMemo(() => ({
    total:     prestamos.length,
    activos:   prestamos.filter((p) => p.estado === "activo").length,
    devueltos: prestamos.filter((p) => p.estado === "devuelto").length,
    // Artículo más prestado
    masUsado: (() => {
      const conteo = {};
      prestamos.forEach((p) => {
        const nombre = p.articulo?.nombre;
        if (nombre) conteo[nombre] = (conteo[nombre] || 0) + 1;
      });
      const top = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0];
      return top ? `${top[0]} (${top[1]}x)` : "—";
    })(),
  }), [prestamos]);

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <History size={26} /> Historial de Préstamos
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
            {isAdmin ? "Vista completa del sistema" : "Tus préstamos"}
          </p>
        </div>

        {/* Exportar CSV — solo admins */}
        {isAdmin && prestamosFiltrados.length > 0 && (
          <button
            onClick={() => exportarCSV(prestamosFiltrados)}
            className="flex items-center gap-2 border-2 border-[#002B49] text-[#002B49] px-5 py-2.5
                       font-bold text-xs uppercase rounded-lg hover:bg-[#002B49] hover:text-white
                       transition-colors"
          >
            <Download size={14} /> Exportar CSV
          </button>
        )}
      </div>

      {/* ESTADÍSTICAS */}
      {!loading && !error && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total préstamos"  value={stats.total}     icon={History}      color="text-blue-900 border-blue-100"    />
          <StatCard label="En préstamo"      value={stats.activos}   icon={Clock}        color="text-yellow-700 border-yellow-100" />
          <StatCard label="Devueltos"        value={stats.devueltos} icon={RotateCcw}    color="text-emerald-700 border-emerald-100" />
          <StatCard label="Más prestado"     value={stats.masUsado}  icon={TrendingUp}   color="text-purple-700 border-purple-100" />
        </div>
      )}

      {/* BARRA DE FILTROS */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row gap-3">

        {/* Buscador */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar artículo, usuario, email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-lg
                       text-sm focus:border-[#002B49] outline-none transition-colors"
          />
        </div>

        {/* Filtro estado */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-400" />
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm
                       focus:border-[#002B49] outline-none"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">En préstamo</option>
            <option value="devuelto">Devueltos</option>
          </select>
        </div>

        {/* Filtro período */}
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <select
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
            className="border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm
                       focus:border-[#002B49] outline-none"
          >
            <option value="todo">Todo el tiempo</option>
            <option value="hoy">Hoy</option>
            <option value="semana">Últimos 7 días</option>
            <option value="mes">Este mes</option>
          </select>
        </div>
      </div>

      {/* RESULTADO DEL FILTRO */}
      <p className="text-xs text-gray-500 mb-3 px-1">
        Mostrando <strong>{prestamosFiltrados.length}</strong> de{" "}
        <strong>{prestamos.length}</strong> registros
      </p>

      {/* TABLA */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm font-bold">
          {error}
        </div>
      ) : prestamosFiltrados.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-white">
          <History size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-bold">
            {busqueda || filtroEstado !== "todos" || filtroPeriodo !== "todo"
              ? "Sin resultados para los filtros aplicados."
              : "Aún no hay préstamos registrados."}
          </p>
          {(busqueda || filtroEstado !== "todos" || filtroPeriodo !== "todo") && (
            <button
              onClick={() => { setBusqueda(""); setFiltroEstado("todos"); setFiltroPeriodo("todo"); }}
              className="mt-3 text-xs font-bold text-[#002B49] underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#002B49] text-white text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-bold">Artículo</th>
                  <th className="px-4 py-3 text-left font-bold">Usuario</th>
                  <th className="px-4 py-3 text-left font-bold">Estado</th>
                  <th className="px-4 py-3 text-left font-bold">Prestado</th>
                  <th className="px-4 py-3 text-left font-bold">Devuelto</th>
                  <th className="px-4 py-3 text-left font-bold">Duración</th>
                  <th className="px-4 py-3 text-left font-bold">Notas</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {prestamosFiltrados.map((p, i) => (
                    <FilaPrestamo key={p.id} prestamo={p} index={i} />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}