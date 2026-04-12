"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ClipboardList, Plus, RotateCcw, X,
  Search, User, Package, Clock, CheckCircle2,
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

function EstadoBadge({ estado }) {
  if (estado === "activo") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase
                       bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded">
        <Clock size={10} /> En préstamo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase
                     bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
      <CheckCircle2 size={10} /> Devuelto
    </span>
  );
}

// ─────────────────────────────────────────────
// MODAL: REGISTRAR PRÉSTAMO
// ─────────────────────────────────────────────
function ModalNuevoPrestamo({ onClose, onRegistrado }) {
  const [inventario, setInventario] = useState([]);
  const [usuarios,   setUsuarios]   = useState([]);
  const [form,       setForm]       = useState({ inventario_id: "", usuario_id: "", notas: "" });
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState(null);
  const [cargando,   setCargando]   = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const [resInv, resUsr] = await Promise.all([
        apiService.getInventario(),
        apiService.getUsuarios(),
      ]);
      // Solo mostrar artículos disponibles
      if (resInv.success) setInventario(resInv.data.filter((i) => i.estado === "disponible"));
      if (resUsr.success) setUsuarios(resUsr.data);
      setCargando(false);
    };
    cargar();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await apiService.crearPrestamo({
        inventario_id: form.inventario_id,
        usuario_id:    form.usuario_id,
        notas:         form.notas || null,
      });
      if (res.success) {
        onRegistrado(res.data, res.message);
      } else {
        setError(res.error || "Error al registrar el préstamo.");
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
          <div>
            <h3 className="font-black text-[#002B49] text-lg uppercase tracking-tight">
              Nuevo Préstamo
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Solo artículos disponibles están en la lista
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

          {cargando ? (
            <div className="py-8 text-center text-sm text-gray-400 animate-pulse">
              Cargando artículos y usuarios...
            </div>
          ) : (
            <>
              {/* Artículo */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Artículo a prestar *
                </label>
                {inventario.length === 0 ? (
                  <p className="text-xs text-red-500 font-bold p-3 bg-red-50 rounded-lg">
                    No hay artículos disponibles en este momento.
                  </p>
                ) : (
                  <select
                    value={form.inventario_id}
                    onChange={(e) => setForm({ ...form, inventario_id: e.target.value })}
                    required
                    className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5
                               text-sm focus:border-[#002B49] outline-none"
                  >
                    <option value="">Selecciona un artículo...</option>
                    {inventario.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.nombre} {item.categoria ? `· ${item.categoria}` : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Usuario receptor */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Quién lo recibe *
                </label>
                <select
                  value={form.usuario_id}
                  onChange={(e) => setForm({ ...form, usuario_id: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5
                             text-sm focus:border-[#002B49] outline-none"
                >
                  <option value="">Selecciona un usuario...</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name} — {u.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                  Notas (opcional)
                </label>
                <textarea
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                  placeholder="Ej. Devolver el viernes, aula 204..."
                  rows={2}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2
                             text-sm focus:border-[#002B49] outline-none resize-none"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
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
              disabled={saving || cargando || inventario.length === 0}
              className="flex-1 py-2.5 bg-[#002B49] text-white font-bold text-xs uppercase
                         rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {saving ? "Registrando..." : "Registrar préstamo"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TARJETA DE PRÉSTAMO
// ─────────────────────────────────────────────
function TarjetaPrestamo({ prestamo, isAdmin, onDevolver }) {
  const [devolviendo, setDevolviendo] = useState(false);

  const handleDevolver = async () => {
    if (!confirm(`¿Confirmas la devolución de "${prestamo.articulo?.nombre}"?`)) return;
    setDevolviendo(true);
    await onDevolver(prestamo.id);
    setDevolviendo(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className={`bg-white rounded-xl border-2 shadow-sm overflow-hidden transition-colors ${
        prestamo.estado === "activo"
          ? "border-yellow-200 hover:border-yellow-400"
          : "border-gray-100 opacity-70"
      }`}
    >
      {/* Franja de color según estado */}
      <div className={`h-1.5 w-full ${prestamo.estado === "activo" ? "bg-yellow-400" : "bg-emerald-400"}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          {/* Artículo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#002B49]/10 flex items-center justify-center flex-shrink-0">
              <Package size={18} className="text-[#002B49]" />
            </div>
            <div>
              <p className="font-black text-gray-800 text-base leading-tight">
                {prestamo.articulo?.nombre || "Artículo eliminado"}
              </p>
              {prestamo.articulo?.categoria && (
                <p className="text-xs text-gray-400">{prestamo.articulo.categoria}</p>
              )}
            </div>
          </div>
          <EstadoBadge estado={prestamo.estado} />
        </div>

        {/* Quién lo tiene */}
        <div className="flex items-center gap-2 mb-3 p-3 bg-gray-50 rounded-lg">
          <User size={14} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500">En manos de</p>
            <p className="text-sm font-bold text-gray-800">
              {prestamo.usuario?.full_name || "—"}
            </p>
            <p className="text-[10px] text-gray-400">{prestamo.usuario?.email}</p>
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-4">
          <div>
            <p className="font-bold uppercase text-[10px] tracking-wide text-gray-400">Prestado</p>
            <p>{formatFecha(prestamo.prestado_en)}</p>
          </div>
          {prestamo.devuelto_en && (
            <div>
              <p className="font-bold uppercase text-[10px] tracking-wide text-gray-400">Devuelto</p>
              <p>{formatFecha(prestamo.devuelto_en)}</p>
            </div>
          )}
        </div>

        {/* Notas */}
        {prestamo.notas && (
          <p className="text-xs text-gray-500 italic border-t pt-3 mb-4">
            &ldquo;{prestamo.notas}&rdquo;
          </p>
        )}

        {/* Botón devolver — solo si está activo y es admin */}
        {isAdmin && prestamo.estado === "activo" && (
          <button
            onClick={handleDevolver}
            disabled={devolviendo}
            className="w-full flex items-center justify-center gap-2 py-2.5
                       bg-emerald-600 hover:bg-emerald-700 text-white font-bold
                       text-xs uppercase rounded-lg transition-colors disabled:opacity-60"
          >
            <RotateCcw size={13} />
            {devolviendo ? "Procesando..." : "Registrar devolución"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────
export default function PrestamosPage() {
  const [prestamos,    setPrestamos]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [busqueda,     setBusqueda]     = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activo"); // "activo" | "devuelto" | "todos"
  const [modalAbierto, setModalAbierto] = useState(false);
  const [toast,        setToast]        = useState(null);

  const user    = getSessionUser();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  // ── Mostrar notificación temporal ─────────
  const mostrarToast = (msg, tipo = "success") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Cargar préstamos ───────────────────────
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

  // ── Nuevo préstamo registrado ──────────────
  const handleRegistrado = (_, mensaje) => {
    setModalAbierto(false);
    mostrarToast(mensaje || "Préstamo registrado correctamente.");
    cargar();
  };

  // ── Devolución ─────────────────────────────
  const handleDevolver = async (id) => {
    const res = await apiService.devolverPrestamo(id);
    if (res.success) {
      // Actualizar localmente
      setPrestamos((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, estado: "devuelto", devuelto_en: new Date().toISOString() }
            : p
        )
      );
      mostrarToast("Devolución registrada. Artículo disponible nuevamente.");
    } else {
      mostrarToast(res.error || "Error al registrar devolución.", "error");
    }
  };

  // ── Filtrado ───────────────────────────────
  const prestamosFiltrados = prestamos
    .filter((p) => filtroEstado === "todos" || p.estado === filtroEstado)
    .filter((p) => {
      const q = busqueda.toLowerCase();
      return (
        p.articulo?.nombre?.toLowerCase().includes(q) ||
        p.usuario?.full_name?.toLowerCase().includes(q) ||
        p.usuario?.email?.toLowerCase().includes(q)
      );
    });

  const activos   = prestamos.filter((p) => p.estado === "activo").length;
  const devueltos = prestamos.filter((p) => p.estado === "devuelto").length;

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-bold
              ${toast.tipo === "error"
                ? "bg-red-600 text-white"
                : "bg-emerald-600 text-white"
              }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <ClipboardList size={26} /> Préstamos
          </h2>
          <div className="flex gap-4 mt-1 text-xs text-gray-500">
            <span><strong className="text-yellow-600">{activos}</strong> activos</span>
            <span><strong className="text-emerald-600">{devueltos}</strong> devueltos</span>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => setModalAbierto(true)}
            className="flex items-center gap-2 bg-[#002B49] text-white px-5 py-2.5
                       font-bold text-xs uppercase rounded-lg hover:bg-slate-800
                       transition-colors shadow-md"
          >
            <Plus size={15} /> Nuevo préstamo
          </button>
        )}
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Tabs estado */}
        <div className="flex gap-1 bg-gray-200 p-1 rounded-lg">
          {[
            { key: "activo",   label: `Activos (${activos})`     },
            { key: "devuelto", label: `Devueltos (${devueltos})`  },
            { key: "todos",    label: "Todos"                     },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFiltroEstado(key)}
              className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${
                filtroEstado === key
                  ? "bg-white text-[#002B49] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Buscador */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por artículo o usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-lg
                       text-sm focus:border-[#002B49] outline-none"
          />
        </div>
      </div>

      {/* CONTENIDO */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-52 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm font-bold">
          {error}
        </div>
      ) : prestamosFiltrados.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-white">
          <ClipboardList size={32} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-bold">
            {busqueda ? "Sin resultados para esa búsqueda." : "No hay préstamos en esta categoría."}
          </p>
          {isAdmin && filtroEstado === "activo" && (
            <button
              onClick={() => setModalAbierto(true)}
              className="mt-4 text-xs font-bold text-[#002B49] underline"
            >
              Registrar el primer préstamo
            </button>
          )}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {prestamosFiltrados.map((p) => (
              <TarjetaPrestamo
                key={p.id}
                prestamo={p}
                isAdmin={isAdmin}
                onDevolver={handleDevolver}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {modalAbierto && (
          <ModalNuevoPrestamo
            onClose={() => setModalAbierto(false)}
            onRegistrado={handleRegistrado}
          />
        )}
      </AnimatePresence>
    </div>
  );
}