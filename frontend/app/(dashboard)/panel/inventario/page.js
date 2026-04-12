"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Search, Plus, ArrowLeft, Package, Trash2, Edit3, X } from "lucide-react";
import apiService from "@/lib/api";

// ─────────────────────────────────────────────
// HELPER: leer y parsear el usuario del localStorage
// ─────────────────────────────────────────────
function getSessionUser() {
  try {
    const raw = localStorage.getItem("usuario");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────
export default function InventarioPage() {
  const [items, setItems] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    cantidad: 0,
    descripcion: "",
  });

  // Leer rol del usuario — determina qué puede ver/hacer
  const user = getSessionUser();
  const esAdmin = user?.role === "admin" || user?.role === "super_admin";

  // ─────────────────────────────────────────
  // Cargar inventario
  // useCallback evita recrear la función en cada render
  // ─────────────────────────────────────────
  const cargarInventario = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("No hay sesión activa. Por favor inicia sesión.");
        return;
      }

      const res = await apiService.getInventario(token);

      if (res.success) {
        setItems(res.data);
      } else {
        setError(res.error || "Error al cargar el inventario.");
      }
    } catch (err) {
      setError("Error inesperado al cargar el inventario.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarInventario();
  }, [cargarInventario]);

  // ─────────────────────────────────────────
  // Crear item
  // ─────────────────────────────────────────
  const handleCrear = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const dataToSend = { ...formData, cantidad: Number(formData.cantidad) };
    const res = await apiService.crearItemInventario(dataToSend, token);

    if (res.success) {
      setIsModalOpen(false);
      setFormData({ nombre: "", categoria: "", cantidad: 0, descripcion: "" });
      cargarInventario(); // Recargar lista
    } else {
      alert("Error al guardar: " + res.error);
    }
  };

  // ─────────────────────────────────────────
  // Eliminar item
  // ─────────────────────────────────────────
  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este recurso?")) return;

    const token = localStorage.getItem("accessToken");
    const res = await apiService.eliminarItemInventario(id, token);

    if (res.success) {
      cargarInventario();
    } else {
      alert("Error al eliminar: " + res.error);
    }
  };

  // ─────────────────────────────────────────
  // Filtrado local por búsqueda
  // ─────────────────────────────────────────
  const itemsFiltrados = items.filter(
    (item) =>
      item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#e5e5e5] p-8 font-sans">

      {/* HEADER */}
      <div className="flex justify-between items-end mb-8 max-w-6xl mx-auto">
        <div>
          <h2 className="font-black text-3xl uppercase text-black tracking-tighter flex items-center gap-2">
            <Package size={32} /> INVENTARIO DE RECURSOS
          </h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
            {esAdmin ? "Control Administrativo" : "Vista de consulta"}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          {/* Solo admins ven el botón de agregar */}
          {esAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#002B49] text-white px-6 py-2 font-bold text-xs hover:bg-slate-800 transition-all uppercase flex items-center gap-2 shadow-xl"
            >
              <Plus size={16} /> AGREGAR RECURSO
            </button>
          )}
          <Link
            href="/panel"
            className="text-[10px] font-black text-gray-400 hover:text-black uppercase border-b-2 border-gray-300 flex items-center gap-1 pb-1 transition-all"
          >
            <ArrowLeft size={12} /> Volver al Panel
          </Link>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="max-w-6xl mx-auto mb-6 relative">
        <input
          type="text"
          placeholder="BUSCAR HERRAMIENTA O CATEGORÍA..."
          className="w-full p-4 pl-12 bg-white border-2 border-gray-300 outline-none focus:border-[#002B49] transition-all font-bold text-xs uppercase shadow-sm"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Search size={18} className="absolute left-4 top-4 text-gray-400" />
      </div>

      {/* TABLA */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-[#002B49] font-bold animate-pulse uppercase tracking-widest">
            Cargando base de datos...
          </div>
        ) : error ? (
          <div className="bg-red-50 border-2 border-red-300 text-red-700 p-6 text-center font-bold text-sm uppercase">
            {error}
          </div>
        ) : (
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-white text-[10px] uppercase tracking-[0.2em]">
                <th className="bg-[#002B49] p-4 text-left font-bold">Nombre del Recurso</th>
                <th className="bg-[#002B49] p-4 text-left font-bold">Categoría</th>
                <th className="bg-[#002B49] p-4 text-center font-bold">Stock</th>
                <th className="bg-[#002B49] p-4 text-center font-bold">Estado</th>
                {/* Columna acciones solo visible para admins */}
                {esAdmin && (
                  <th className="bg-[#002B49] p-4 text-right font-bold">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="text-xs font-bold uppercase">
              {itemsFiltrados.length > 0 ? (
                itemsFiltrados.map((item) => (
                  <tr key={item.id} className="text-white">
                    <td className="bg-[#002B49] p-4 border-r border-white/5">
                      {item.nombre}
                    </td>
                    <td className="bg-[#002B49] p-4 border-r border-white/5 text-slate-400">
                      {item.categoria || "S/C"}
                    </td>
                    <td className="bg-[#002B49] p-4 border-r border-white/5 text-center font-mono text-emerald-400">
                      {item.cantidad}
                    </td>
                    <td className="bg-[#002B49] p-4 border-r border-white/5 text-center">
                      <span className="text-[10px] bg-emerald-500/20 px-2 py-1 rounded text-emerald-400">
                        {item.estado || "DISPONIBLE"}
                      </span>
                    </td>
                    {/* Botones de acción: solo para admins */}
                    {esAdmin && (
                      <td className="bg-[#002B49] p-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            title="Editar"
                            className="hover:text-emerald-400 transition-colors"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            title="Eliminar"
                            onClick={() => handleEliminar(item.id)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={esAdmin ? 5 : 4}
                    className="bg-white text-[#002B49] p-10 text-center border-2 border-dashed border-gray-300"
                  >
                    NO SE ENCONTRARON REGISTROS
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL CREAR — solo accesible para admins */}
      <AnimatePresence>
        {isModalOpen && esAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002B49]/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-8 w-full max-w-md border-t-[10px] border-[#002B49] relative"
            >
              {/* Botón cerrar */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black mb-6 uppercase text-[#002B49] tracking-tighter">
                Registrar Recurso
              </h2>

              <form onSubmit={handleCrear} className="space-y-4">
                <input
                  className="w-full p-3 border-b-2 border-gray-200 outline-none focus:border-[#002B49] uppercase font-bold text-xs"
                  placeholder="NOMBRE *"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
                <input
                  className="w-full p-3 border-b-2 border-gray-200 outline-none focus:border-[#002B49] uppercase font-bold text-xs"
                  placeholder="CATEGORÍA"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                />
                <input
                  type="number"
                  min="0"
                  className="w-full p-3 border-b-2 border-gray-200 outline-none focus:border-[#002B49] font-bold text-xs"
                  placeholder="CANTIDAD *"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  required
                />
                <textarea
                  className="w-full p-3 border-2 border-gray-100 outline-none focus:border-[#002B49] font-bold text-xs min-h-[100px] uppercase"
                  placeholder="DESCRIPCIÓN BREVE"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                />
                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 text-red-600 font-black text-xs uppercase hover:bg-red-50"
                  >
                    CANCELAR
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#002B49] text-white font-black text-xs uppercase hover:bg-slate-800 transition-all"
                  >
                    GUARDAR
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
