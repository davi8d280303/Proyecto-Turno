'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "motion/react";
import Link from 'next/link';
import { Search, Plus, ArrowLeft, Package, Trash2, Edit3 } from 'lucide-react'; // Iconos profesionales
import apiService from '@/lib/api'; 

export default function InventarioAdminPage() {
  const [items, setItems] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nombre: '', categoria: '', cantidad: 0, descripcion: '' });

  useEffect(() => { 
  const token = localStorage.getItem('accessToken');
  console.log("TOKEN:", token); // 👈 DEBUG

  cargarInventario(); 
  }, []);

  const cargarInventario = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await apiService.getInventario(token); 
      if (res.success) setItems(res.data);
    } catch (error) {
      console.error("Error al cargar", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    
    // IMPORTANTE: Aseguramos que cantidad sea número
    const dataToSend = { ...formData, cantidad: Number(formData.cantidad) };
    
    const res = await apiService.crearItemInventario(dataToSend, token);
    if (res.success) {
      setIsModalOpen(false);
      setFormData({ nombre: '', categoria: '', cantidad: 0, descripcion: '' });
      cargarInventario(); // Recarga la lista automáticamente para mostrar el nuevo item
      alert("Recurso guardado exitosamente");
    } else {
      alert("Error al guardar: " + res.error);
    }
  };

  const itemsFiltrados = items.filter(item => 
    item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#e5e5e5] p-8 font-sans">
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8 max-w-6xl mx-auto">
        <div>
          <h2 className="font-black text-3xl uppercase text-black tracking-tighter flex items-center gap-2">
            <Package size={32} /> INVENTARIO DE RECURSOS
          </h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Control Administrativo</p>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#002B49] text-white px-6 py-2 font-bold text-xs hover:bg-slate-800 transition-all uppercase flex items-center gap-2 shadow-xl"
            >
                <Plus size={16} /> AGREGAR RECURSO
            </button>
            {/* CORRECCIÓN RUTA REGRESAR: Ruta absoluta al panel */}
            <Link 
              href="/dashboard/panel" 
              className="text-[10px] font-black text-gray-400 hover:text-black uppercase self-center border-b-2 border-gray-300 flex items-center gap-1 pb-1 transition-all"
            >
              <ArrowLeft size={12} /> Volver al Panel
            </Link>
        </div>
      </div>

      {/* BUSCADOR CON ICONO REAL */}
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
            <div className="text-center py-20 text-[#002B49] font-bold animate-pulse uppercase tracking-widest">Cargando base de datos...</div>
        ) : (
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-white text-[10px] uppercase tracking-[0.2em]">
                <th className="bg-[#002B49] p-4 text-left font-bold">Nombre del Recurso</th>
                <th className="bg-[#002B49] p-4 text-left font-bold">Categoría</th>
                <th className="bg-[#002B49] p-4 text-center font-bold">Stock</th>
                <th className="bg-[#002B49] p-4 text-center font-bold">Estado</th>
                <th className="bg-[#002B49] p-4 text-right font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold uppercase">
              {itemsFiltrados.length > 0 ? itemsFiltrados.map((item) => (
                <tr key={item.id || item._id} className="text-white">
                  <td className="bg-[#002B49] p-4 border-r border-white/5">{item.nombre}</td>
                  <td className="bg-[#002B49] p-4 border-r border-white/5 text-slate-400">{item.categoria || 'S/C'}</td>
                  <td className="bg-[#002B49] p-4 border-r border-white/5 text-center font-mono text-emerald-400">{item.cantidad}</td>
                  <td className="bg-[#002B49] p-4 border-r border-white/5 text-center">
                    <span className="text-[10px] bg-emerald-500/20 px-2 py-1 rounded text-emerald-400">ACTIVO</span>
                  </td>
                  <td className="bg-[#002B49] p-4 text-right">
                    <div className="flex justify-end gap-3">
                        <button title="Editar" className="hover:text-emerald-400 transition-colors"><Edit3 size={16}/></button>
                        <button title="Eliminar" className="hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="5" className="bg-white text-[#002B49] p-10 text-center border-2 border-dashed border-gray-300">
                        NO SE ENCONTRARON REGISTROS
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#002B49]/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-8 w-full max-w-md border-t-[10px] border-[#002B49]"
            >
              <h2 className="text-2xl font-black mb-6 uppercase text-[#002B49] tracking-tighter">Registrar Equipo</h2>
              <form onSubmit={handleCrear} className="space-y-4">
                <input className="w-full p-3 border-b-2 border-gray-200 outline-none focus:border-[#002B49] uppercase font-bold text-xs" placeholder="NOMBRE" onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                <input className="w-full p-3 border-b-2 border-gray-200 outline-none focus:border-[#002B49] uppercase font-bold text-xs" placeholder="CATEGORÍA" onChange={e => setFormData({...formData, categoria: e.target.value})} />
                <input type="number" className="w-full p-3 border-b-2 border-gray-200 outline-none focus:border-[#002B49] font-bold text-xs" placeholder="CANTIDAD" onChange={e => setFormData({...formData, cantidad: e.target.value})} required />
                <textarea className="w-full p-3 border-2 border-gray-100 outline-none focus:border-[#002B49] font-bold text-xs min-h-[100px] uppercase" placeholder="DESCRIPCIÓN BREVE" onChange={e => setFormData({...formData, descripcion: e.target.value})} />
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-red-600 font-black text-xs uppercase hover:bg-red-50">CANCELAR</button>
                  <button type="submit" className="flex-1 py-3 bg-[#002B49] text-white font-black text-xs uppercase hover:bg-slate-800 transition-all">GUARDAR EN BASE DE DATOS</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}