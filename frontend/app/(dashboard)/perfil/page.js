"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  User, Mail, Shield, MapPin, Clock,
  Edit3, Lock, ChevronRight, LogOut,
  CheckCircle, X, Eye, EyeOff, History,
  ShieldCheck, UserCircle,
} from "lucide-react";
import apiService, { getSessionUser, saveSession } from "@/lib/api";
import Link from "next/link";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatFecha(dateStr) {
  if (!dateStr) return "Nunca";
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(dateStr));
}

const ROL_CONFIG = {
  super_admin: { label: "Super Administrador", icon: ShieldCheck, color: "text-yellow-600 bg-yellow-50 border-yellow-300" },
  admin:       { label: "Administrador",        icon: Shield,      color: "text-blue-700   bg-blue-50   border-blue-300"   },
  usuario:     { label: "Usuario",              icon: UserCircle,  color: "text-gray-600   bg-gray-50   border-gray-300"   },
};

function RolChip({ role }) {
  const cfg  = ROL_CONFIG[role] || ROL_CONFIG.usuario;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cfg.color}`}>
      <Icon size={13} /> {cfg.label}
    </span>
  );
}

// Iniciales para el avatar
function Iniciales({ nombre }) {
  const partes  = (nombre || "?").trim().split(" ");
  const iniciales = partes.length >= 2
    ? partes[0][0] + partes[1][0]
    : partes[0].slice(0, 2);
  return iniciales.toUpperCase();
}

// ─────────────────────────────────────────────
// PANEL: EDITAR NOMBRE
// ─────────────────────────────────────────────
function PanelEditarNombre({ user, onGuardado, onCerrar }) {
  const [nombre,  setNombre]  = useState(user.full_name || "");
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setSaving(true);
    setError(null);
    try {
      // Llamamos al endpoint de perfil — necesita un PATCH /api/auth/me
      const res = await apiService.actualizarPerfil({ full_name: nombre.trim() });
      if (res.success) {
        onGuardado({ ...user, full_name: nombre.trim() });
      } else {
        setError(res.error || "Error al guardar.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
        {error && (
          <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded">{error}</p>
        )}
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
            Nombre completo
          </label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 text-sm
                       focus:border-[#002B49] outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCerrar}
            className="flex-1 py-2 border-2 border-gray-200 text-gray-600 font-bold
                       text-xs uppercase rounded-lg hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || !nombre.trim()}
            className="flex-1 py-2 bg-[#002B49] text-white font-bold text-xs uppercase
                       rounded-lg hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PANEL: CAMBIAR CONTRASEÑA
// ─────────────────────────────────────────────
function PanelCambiarPassword({ onGuardado, onCerrar }) {
  const [form,    setForm]    = useState({ actual: "", nueva: "", confirmar: "" });
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);
  const [mostrar, setMostrar] = useState({ actual: false, nueva: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.nueva.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (form.nueva !== form.confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await apiService.cambiarPassword({
        currentPassword: form.actual,
        newPassword:     form.nueva,
      });
      if (res.success) {
        onGuardado();
      } else {
        setError(res.error || "Error al cambiar la contraseña.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
        {error && (
          <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded">{error}</p>
        )}

        {/* Contraseña actual */}
        <div className="relative">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
            Contraseña actual
          </label>
          <input
            type={mostrar.actual ? "text" : "password"}
            value={form.actual}
            onChange={(e) => setForm({ ...form, actual: e.target.value })}
            required
            className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 pr-10
                       text-sm focus:border-[#002B49] outline-none"
          />
          <button
            type="button"
            onClick={() => setMostrar((p) => ({ ...p, actual: !p.actual }))}
            className="absolute right-3 top-8 text-gray-400"
          >
            {mostrar.actual ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* Nueva contraseña */}
        <div className="relative">
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
            Nueva contraseña
          </label>
          <input
            type={mostrar.nueva ? "text" : "password"}
            value={form.nueva}
            onChange={(e) => setForm({ ...form, nueva: e.target.value })}
            required
            minLength={6}
            className="w-full border-2 border-gray-200 rounded-lg px-3 py-2.5 pr-10
                       text-sm focus:border-[#002B49] outline-none"
          />
          <button
            type="button"
            onClick={() => setMostrar((p) => ({ ...p, nueva: !p.nueva }))}
            className="absolute right-3 top-8 text-gray-400"
          >
            {mostrar.nueva ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* Confirmar */}
        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">
            Confirmar nueva contraseña
          </label>
          <input
            type="password"
            value={form.confirmar}
            onChange={(e) => setForm({ ...form, confirmar: e.target.value })}
            required
            className={`w-full border-2 rounded-lg px-3 py-2.5 text-sm outline-none
              ${form.confirmar && form.nueva !== form.confirmar
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 focus:border-[#002B49]"
              }`}
          />
          {form.confirmar && form.nueva !== form.confirmar && (
            <p className="text-[10px] text-red-500 mt-1">Las contraseñas no coinciden</p>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onCerrar}
            className="flex-1 py-2 border-2 border-gray-200 text-gray-600 font-bold
                       text-xs uppercase rounded-lg hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2 bg-[#002B49] text-white font-bold text-xs uppercase
                       rounded-lg hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ─────────────────────────────────────────────
export default function PerfilPage() {
  const router  = useRouter();
  const [user,          setUser]          = useState(null);
  const [area,          setArea]          = useState(null);
  const [misPrestamos,  setMisPrestamos]  = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [panelAbierto,  setPanelAbierto]  = useState(null); // "nombre" | "password" | null
  const [toast,         setToast]         = useState(null);

  const mostrarToast = (msg, tipo = "success") => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Cargar perfil real desde backend ──────
  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [resPerfil, resPrestamos, resAreas] = await Promise.all([
        apiService.getProfile(),
        apiService.getPrestamos(),
        apiService.getAreas(),
      ]);

      if (resPerfil.success) {
        const userData = resPerfil.data;
        setUser(userData);
        // Actualizar localStorage con datos frescos del servidor
        saveSession({ user: userData });

        // Buscar el nombre del área del usuario
        if (userData.area_id && resAreas.success) {
          const areaEncontrada = resAreas.data.find((a) => a.id === userData.area_id);
          setArea(areaEncontrada || null);
        }
      }

      if (resPrestamos.success) {
        setMisPrestamos(resPrestamos.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // ── Nombre actualizado ─────────────────────
  const handleNombreGuardado = (updatedUser) => {
    setUser(updatedUser);
    saveSession({ user: updatedUser }); // Actualizar localStorage también
    setPanelAbierto(null);
    mostrarToast("Nombre actualizado correctamente.");
  };

  // ── Contraseña actualizada ─────────────────
  const handlePasswordGuardada = () => {
    setPanelAbierto(null);
    mostrarToast("Contraseña cambiada correctamente.");
  };

  // ── Logout ─────────────────────────────────
  const handleLogout = async () => {
    await apiService.logoutUsuario();
    router.replace("/");
  };

  // ── Toggle de paneles ──────────────────────
  const togglePanel = (panel) => {
    setPanelAbierto((actual) => (actual === panel ? null : panel));
  };

  const activosCount   = misPrestamos.filter((p) => p.estado === "activo").length;
  const totalCount     = misPrestamos.length;

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-4">
        <div className="h-40 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-20 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        No se pudo cargar el perfil.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-5 py-3
                       bg-emerald-600 text-white rounded-xl shadow-lg text-sm font-bold"
          >
            <CheckCircle size={16} /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* TARJETA PRINCIPAL — Avatar + datos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">

        {/* Cabecera con gradiente */}
        <div className="bg-gradient-to-r from-[#002B49] to-blue-800 p-8 flex items-center gap-6">
          {/* Avatar con iniciales */}
          <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40
                          flex items-center justify-center text-white text-2xl font-black
                          flex-shrink-0 select-none">
            <Iniciales nombre={user.full_name} />
          </div>

          <div className="text-white min-w-0">
            <h2 className="text-2xl font-black truncate">{user.full_name}</h2>
            <p className="text-blue-200 text-sm mt-0.5 truncate">{user.email}</p>
            <div className="mt-2">
              <RolChip role={user.role} />
            </div>
          </div>
        </div>

        {/* Datos de la cuenta */}
        <div className="divide-y divide-gray-100">

          {/* Área */}
          <div className="flex items-center gap-3 px-5 py-4">
            <MapPin size={16} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Área asignada</p>
              <p className="text-sm font-semibold text-gray-800">
                {area?.name || <span className="text-gray-400 italic">Sin área (acceso global)</span>}
              </p>
            </div>
          </div>

          {/* Último acceso */}
          <div className="flex items-center gap-3 px-5 py-4">
            <Clock size={16} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Último acceso</p>
              <p className="text-sm font-semibold text-gray-800">{formatFecha(user.last_login_at)}</p>
            </div>
          </div>

          {/* Estado de la cuenta */}
          <div className="flex items-center gap-3 px-5 py-4">
            <CheckCircle size={16} className={user.is_active ? "text-emerald-500" : "text-red-500"} />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Estado de la cuenta</p>
              <p className={`text-sm font-semibold ${user.is_active ? "text-emerald-600" : "text-red-600"}`}>
                {user.is_active ? "Activa" : "Desactivada"}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ESTADÍSTICAS DE PRÉSTAMOS */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-black text-yellow-600">{activosCount}</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1">
            Préstamos activos
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-3xl font-black text-[#002B49]">{totalCount}</p>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-1">
            Total histórico
          </p>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">

        {/* Editar nombre */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => togglePanel("nombre")}
            className="w-full flex items-center justify-between px-5 py-4
                       hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 text-gray-700 font-semibold text-sm">
              <Edit3 size={16} className="text-gray-400" /> Editar nombre
            </div>
            <motion.div
              animate={{ rotate: panelAbierto === "nombre" ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={16} className="text-gray-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {panelAbierto === "nombre" && (
              <PanelEditarNombre
                user={user}
                onGuardado={handleNombreGuardado}
                onCerrar={() => setPanelAbierto(null)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Cambiar contraseña */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => togglePanel("password")}
            className="w-full flex items-center justify-between px-5 py-4
                       hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 text-gray-700 font-semibold text-sm">
              <Lock size={16} className="text-gray-400" /> Cambiar contraseña
            </div>
            <motion.div
              animate={{ rotate: panelAbierto === "password" ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={16} className="text-gray-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {panelAbierto === "password" && (
              <PanelCambiarPassword
                onGuardado={handlePasswordGuardada}
                onCerrar={() => setPanelAbierto(null)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Ir al historial */}
        <Link
          href="/historial"
          className="w-full flex items-center justify-between px-5 py-4
                     hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3 text-gray-700 font-semibold text-sm">
            <History size={16} className="text-gray-400" /> Ver historial de préstamos
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </Link>

      </div>

      {/* CERRAR SESIÓN */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5
                   bg-white border-2 border-red-200 text-red-600 font-bold
                   text-sm uppercase rounded-xl hover:bg-red-600 hover:text-white
                   hover:border-red-600 transition-all"
      >
        <LogOut size={16} /> Cerrar sesión
      </button>

    </div>
  );
}
