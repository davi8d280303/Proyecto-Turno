"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, ShieldCheck, Shield, UserCircle,
  Edit3, ToggleLeft, ToggleRight, X, Search,
  CheckCircle, XCircle,
} from "lucide-react";
import apiService, { getSessionUser } from "@/lib/api";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const ROLES = [
  { value: "super_admin", label: "Super Admin", icon: ShieldCheck, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  { value: "admin",       label: "Admin",       icon: Shield,      color: "text-blue-600   bg-blue-50   border-blue-200"   },
  { value: "usuario",     label: "Usuario",     icon: UserCircle,  color: "text-gray-600   bg-gray-50   border-gray-200"   },
];

function RoleBadge({ role }) {
  const cfg = ROLES.find((r) => r.value === role) || ROLES[2];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${cfg.color}`}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(new Date(dateStr));
}

// ─────────────────────────────────────────────
// MODAL DE EDICIÓN
// ─────────────────────────────────────────────
function EditModal({ user, areas, onClose, onSave }) {
  const [form, setForm] = useState({
    role:    user.role,
    area_id: user.area_id || "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        role:    form.role,
        area_id: form.area_id || null,
      };
      const res = await apiService.actualizarUsuario(user.id, payload);
      if (res.success) {
        onSave(res.data);
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
        className="bg-white w-full max-w-md rounded-lg shadow-2xl border-t-4 border-blue-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="font-bold text-gray-800">Editar usuario</h3>
            <p className="text-xs text-gray-500 mt-0.5">{user.full_name} · {user.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded">
              {error}
            </div>
          )}

          {/* Rol */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
              Rol
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon;
                const selected = form.role === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 text-xs font-bold transition-all ${
                      selected
                        ? "border-blue-800 bg-blue-50 text-blue-800"
                        : "border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    <Icon size={18} />
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Área */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
              Área asignada
            </label>
            <select
              value={form.area_id}
              onChange={(e) => setForm({ ...form, area_id: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-800 outline-none"
            >
              <option value="">Sin área (acceso global)</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-gray-400 mt-1">
              Sin área: el usuario verá todo. Con área: solo verá su área.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 font-bold text-xs uppercase rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-blue-800 text-white font-bold text-xs uppercase rounded-lg hover:bg-blue-900 disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
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
export default function UsuariosPage() {
  const [usuarios,  setUsuarios]  = useState([]);
  const [areas,     setAreas]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [busqueda,  setBusqueda]  = useState("");
  const [editando,  setEditando]  = useState(null); // usuario que se está editando

  const currentUser = getSessionUser();

  // Solo super_admin puede entrar aquí
  // (el Sidebar ya lo oculta, pero por si acaso)
  const isSuperAdmin = currentUser?.role === "super_admin";

  // ── Carga inicial ──────────────────────────
  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [resUsuarios, resAreas] = await Promise.all([
        apiService.getUsuarios(),
        apiService.getAreas(),
      ]);

      if (resUsuarios.success) setUsuarios(resUsuarios.data);
      else setError(resUsuarios.error);

      if (resAreas.success) setAreas(resAreas.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // ── Activar / Desactivar ───────────────────
  const handleToggle = async (usuario) => {
    const accion = usuario.is_active ? "desactivar" : "activar";
    if (!confirm(`¿Seguro que quieres ${accion} a ${usuario.full_name}?`)) return;

    const res = await apiService.toggleUsuario(usuario.id);
    if (res.success) {
      // Actualizar localmente sin recargar toda la lista
      setUsuarios((prev) =>
        prev.map((u) => (u.id === usuario.id ? { ...u, is_active: !u.is_active } : u))
      );
    } else {
      alert("Error: " + res.error);
    }
  };

  // ── Guardar edición ────────────────────────
  const handleSave = (updatedUser) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
    );
    setEditando(null);
  };

  // ── Filtrado ───────────────────────────────
  const usuariosFiltrados = usuarios.filter((u) => {
    const q = busqueda.toLowerCase();
    return (
      u.full_name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  // Mapa de área para mostrar el nombre en la tabla
  const areaMap = Object.fromEntries(areas.map((a) => [a.id, a.name]));

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  if (!isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 font-bold uppercase text-sm">
        No tienes permisos para ver esta sección.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ENCABEZADO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Users size={26} /> Gestión de Usuarios
          </h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
            {usuariosFiltrados.length} usuarios encontrados
          </p>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o rol..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm
                       focus:border-blue-800 outline-none transition-colors"
          />
        </div>
      </div>

      {/* CONTENIDO */}
      {loading ? (
        // Skeleton loader
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm font-bold">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-900 text-white text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-bold">Usuario</th>
                  <th className="px-4 py-3 text-left font-bold">Rol</th>
                  <th className="px-4 py-3 text-left font-bold">Área</th>
                  <th className="px-4 py-3 text-center font-bold">Estado</th>
                  <th className="px-4 py-3 text-center font-bold">Último acceso</th>
                  <th className="px-4 py-3 text-right font-bold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((u) => {
                    const esMismoUsuario = u.id === currentUser?.id;
                    return (
                      <tr
                        key={u.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          !u.is_active ? "opacity-50" : ""
                        }`}
                      >
                        {/* Nombre + email */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-gray-800">{u.full_name}</div>
                          <div className="text-xs text-gray-400">{u.email}</div>
                          {esMismoUsuario && (
                            <span className="text-[10px] text-blue-500 font-bold">(tú)</span>
                          )}
                        </td>

                        {/* Rol */}
                        <td className="px-4 py-3">
                          <RoleBadge role={u.role} />
                        </td>

                        {/* Área */}
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {areaMap[u.area_id] || (
                            <span className="text-gray-400 italic">Sin área</span>
                          )}
                        </td>

                        {/* Estado */}
                        <td className="px-4 py-3 text-center">
                          {u.is_active ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              <CheckCircle size={11} /> Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                              <XCircle size={11} /> Inactivo
                            </span>
                          )}
                        </td>

                        {/* Último acceso */}
                        <td className="px-4 py-3 text-center text-xs text-gray-500">
                          {formatDate(u.last_login_at)}
                        </td>

                        {/* Acciones */}
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            {/* Editar rol y área */}
                            <button
                              onClick={() => setEditando(u)}
                              disabled={esMismoUsuario}
                              title={esMismoUsuario ? "No puedes editarte a ti mismo" : "Editar"}
                              className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors
                                         disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Edit3 size={15} />
                            </button>

                            {/* Activar / Desactivar */}
                            <button
                              onClick={() => handleToggle(u)}
                              disabled={esMismoUsuario}
                              title={esMismoUsuario ? "No puedes desactivarte a ti mismo" : u.is_active ? "Desactivar" : "Activar"}
                              className={`p-2 rounded-lg transition-colors
                                disabled:opacity-30 disabled:cursor-not-allowed
                                ${u.is_active
                                  ? "hover:bg-red-50 text-red-500"
                                  : "hover:bg-emerald-50 text-emerald-600"
                                }`}
                            >
                              {u.is_active ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                      No se encontraron usuarios con ese criterio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      <AnimatePresence>
        {editando && (
          <EditModal
            user={editando}
            areas={areas}
            onClose={() => setEditando(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
