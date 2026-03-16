"use client";
import React, { useState } from 'react';

export default function GestionPrestamos() {
  // Estado para controlar qué pestaña está activa
  const [tabActiva, setTabActiva] = useState('activos');

  // Datos para la vista de Activos
  const prestamosActivos = [
    { id: "R-001", equipo: "Proyector Epson X12", usuario: "María López", estado: "En uso", color: "bg-emerald-100 text-emerald-700", desde: "2026-01-15 09:00", vence: "2026-01-15 16:00", notas: "Reunión aula 3" },
    { id: "R-023", equipo: "Laptop Dell Inspiron", usuario: "Juan Pérez", estado: "Overdue", color: "bg-red-100 text-red-700", desde: "2026-01-14 10:30", vence: "2026-01-20 18:00", notas: "Mantenimiento pendiente" }
  ];

  // Datos para la vista de Historial
  const historial = [
    { id: "H-100", recurso: "Equipo de sonido", usuario: "Claudia Ruiz", inicio: "2025-12-01 10:00", devuelto: "2025-12-02 15:00", condicion: "Bueno" },
    { id: "H-097", recurso: "Cámara Canon", usuario: "Diego Torres", inicio: "2025-11-28 09:00", devuelto: "2025-12-01 18:00", condicion: "Bien (sin daños)" },
    { id: "H-092", recurso: "Proyector Epson X12", usuario: "Ana Gómez", inicio: "2025-11-10 08:00", devuelto: "2025-11-10 14:30", condicion: "Con detalle en cable" }
  ];

  return (
    <div className="min-h-screen bg-[#e5e5e5] p-8 text-slate-800">
      
      {/* HEADER SUPERIOR CON BOTONES */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-2xl font-bold text-[#1D3557]">Prestamos</h1>
          <p className="text-sm text-slate-500 font-medium">Sección: Gestión de préstamos (Activos / Historial)</p>
        </div>

        <div className="flex gap-2 bg-gray-300/50 p-1 rounded-lg">
          <button 
            onClick={() => setTabActiva('activos')}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${tabActiva === 'activos' ? 'bg-[#1D3557] text-white shadow-md' : 'bg-white text-slate-600 border'}`}
          >
            Préstamos activos
          </button>
          <button 
            onClick={() => setTabActiva('historial')}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${tabActiva === 'historial' ? 'bg-[#1D3557] text-white shadow-md' : 'bg-white text-slate-600 border'}`}
          >
            Historial de préstamos
          </button>
        </div>
      </div>

      {/* CONTENIDO DINÁMICO */}
      {tabActiva === 'activos' ? (
        /* VISTA: PRÉSTAMOS ACTIVOS */
        <div className="animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#1D3557]">Préstamos activos</h2>
            <div className="flex gap-2">
              <input type="text" placeholder="Buscar recurso o usuario" className="px-4 py-2 rounded-lg border text-sm w-64 outline-none" />
              <select className="px-4 py-2 rounded-lg border text-sm bg-white outline-none">
                <option>Todos</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prestamosActivos.map((p) => (
              <div key={p.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 font-bold text-sm">{p.id}</span>
                  <span className={`px-4 py-1 rounded-full text-xs font-bold ${p.color}`}>{p.estado}</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{p.equipo}</h3>
                    <p className="text-gray-500 text-sm mb-4">Solicitado por: <span className="font-semibold text-slate-700">{p.usuario}</span></p>
                  </div>
                  <button className="bg-[#004B7A] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#003A5F]">
                    Registrar devolución
                  </button>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Desde: <span className="font-medium text-slate-700">{p.desde}</span></p>
                  <p>Vence: <span className="font-medium text-slate-700">{p.vence}</span></p>
                  <p className="mt-4 pt-4 border-t border-gray-100 italic text-xs">Notas: {p.notas}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* VISTA: HISTORIAL DE PRÉSTAMOS */
        <div className="animate-in fade-in duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1D3557]">Historial de préstamos</h2>
            <p className="text-sm text-slate-500">Registro de devoluciones y estado final de cada préstamo</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#7f93ab] text-white font-semibold">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Recurso</th>
                  <th className="p-4">Usuario</th>
                  <th className="p-4">Inicio</th>
                  <th className="p-4">Devuelto</th>
                  <th className="p-4">Condición</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-slate-700">
                {historial.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500">{item.id}</td>
                    <td className="p-4 font-bold">{item.recurso}</td>
                    <td className="p-4">{item.usuario}</td>
                    <td className="p-4">{item.inicio}</td>
                    <td className="p-4">{item.devuelto}</td>
                    <td className="p-4">{item.condicion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-6 text-sm text-slate-500">
            <span>Mostrando {historial.length} registros</span>
            <div className="flex gap-2">
              <button className="px-4 py-1 rounded-md border bg-gray-100 hover:bg-gray-200">Anterior</button>
              <button className="px-4 py-1 rounded-md border bg-gray-100 hover:bg-gray-200">Siguiente</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}