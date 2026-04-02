'use client';

import { useState } from 'react';
import Link from 'next/link';

const PRESTAMOS = [
  { id: 'P-092', usuario: 'Laura Jiménez',   email: 'laura@mail.com',  monto: 3200,  tipo: 'Educación',  estado: 'pendiente', dias: 2 },
  { id: 'P-095', usuario: 'Diego Herrera',   email: 'diego@mail.com',  monto: 2000,  tipo: 'Emergencia', estado: 'pendiente', dias: 1 },
  { id: 'P-099', usuario: 'Diana Flores',    email: 'diana@mail.com',  monto: 5500,  tipo: 'Personal',   estado: 'pendiente', dias: 0 },
  { id: 'P-091', usuario: 'Carlos Mendoza',  email: 'carlos@mail.com', monto: 8500,  tipo: 'Personal',   estado: 'aprobado',  dias: null },
  { id: 'P-094', usuario: 'Sofía Castillo',  email: 'sofia@mail.com',  monto: 5750,  tipo: 'Personal',   estado: 'aprobado',  dias: null },
  { id: 'P-093', usuario: 'Miguel Ríos',     email: 'miguel@mail.com', monto: 12000, tipo: 'Negocio',    estado: 'rechazado', dias: null },
];

const ESTADO_STYLES = { aprobado: 'bg-green-100 text-green-800', pendiente: 'bg-yellow-100 text-yellow-800', rechazado: 'bg-red-100 text-red-800' };

export default function AdminPrestamos() {
  const [filtro,   setFiltro]   = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const filtrados = PRESTAMOS.filter((p) => {
    const okEstado   = filtro === 'todos' || p.estado === filtro;
    const okBusqueda = p.usuario.toLowerCase().includes(busqueda.toLowerCase()) || p.id.toLowerCase().includes(busqueda.toLowerCase());
    return okEstado && okBusqueda;
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Préstamos</h2>
        <p className="text-sm text-gray-500 mt-1">Gestiona y resuelve las solicitudes asignadas</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Buscar usuario o ID..."
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        <div className="flex gap-2 flex-wrap">
          {['todos', 'pendiente', 'aprobado', 'rechazado'].map((f) => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition
                ${filtro === f ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtrados.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">No hay resultados</div>
        ) : filtrados.map((p) => (
          <Link key={p.id} href={`/admin/prestamos/${p.id}`}
            className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 px-5 py-4 hover:shadow-md transition">
            <div>
              <p className="text-sm font-semibold text-gray-800">{p.usuario}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {p.id} · {p.tipo}
                {p.estado === 'pendiente' && p.dias !== null && (
                  <span className={`ml-2 ${p.dias >= 2 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                    · {p.dias === 0 ? 'hoy' : `hace ${p.dias} día${p.dias > 1 ? 's' : ''}`}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-800">${p.monto.toLocaleString()}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ESTADO_STYLES[p.estado]}`}>{p.estado}</span>
              {p.estado === 'pendiente' && (
                <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg font-medium">Revisar →</span>
              )}
              {p.estado !== 'pendiente' && <span className="text-gray-300">›</span>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}