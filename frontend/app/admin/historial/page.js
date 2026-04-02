'use client';

import { useState } from 'react';

const HISTORIAL = [
  { id: 'P-091', usuario: 'Carlos Mendoza',  monto: 8500,  tipo: 'Personal',   estado: 'aprobado',  fechaSolicitud: '26 mar 2026', fechaResolucion: '28 mar 2026' },
  { id: 'P-093', usuario: 'Miguel Ríos',     monto: 12000, tipo: 'Negocio',    estado: 'rechazado', fechaSolicitud: '27 mar 2026', fechaResolucion: '29 mar 2026', motivo: 'Documentación insuficiente' },
  { id: 'P-094', usuario: 'Sofía Castillo',  monto: 5750,  tipo: 'Personal',   estado: 'aprobado',  fechaSolicitud: '29 mar 2026', fechaResolucion: '31 mar 2026' },
  { id: 'P-088', usuario: 'Pedro Herrera',   monto: 6000,  tipo: 'Personal',   estado: 'aprobado',  fechaSolicitud: '20 mar 2026', fechaResolucion: '22 mar 2026' },
  { id: 'P-085', usuario: 'Valeria Reyes',   monto: 3500,  tipo: 'Educación',  estado: 'rechazado', fechaSolicitud: '15 mar 2026', fechaResolucion: '17 mar 2026', motivo: 'Capacidad de pago insuficiente' },
  { id: 'P-080', usuario: 'Ana González',    monto: 11000, tipo: 'Negocio',    estado: 'aprobado',  fechaSolicitud: '10 mar 2026', fechaResolucion: '12 mar 2026' },
];

export default function AdminHistorial() {
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda,     setBusqueda]     = useState('');
  const [expandido,    setExpandido]    = useState(null);

  const filtrados = HISTORIAL.filter((h) => {
    const okEstado   = filtroEstado === 'todos' || h.estado === filtroEstado;
    const okBusqueda = h.usuario.toLowerCase().includes(busqueda.toLowerCase()) || h.id.toLowerCase().includes(busqueda.toLowerCase());
    return okEstado && okBusqueda;
  });

  const totalAprobado  = filtrados.filter(h => h.estado === 'aprobado').reduce((a, h) => a + h.monto, 0);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Mi historial</h2>
        <p className="text-sm text-gray-500 mt-1">Préstamos que has gestionado</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Total resueltos</p>
          <p className="text-2xl font-bold text-teal-700">{filtrados.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Monto aprobado</p>
          <p className="text-2xl font-bold text-green-700">${totalAprobado.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Rechazados</p>
          <p className="text-2xl font-bold text-red-600">{filtrados.filter(h => h.estado === 'rechazado').length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Buscar usuario o ID..."
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        <div className="flex gap-2">
          {['todos', 'aprobado', 'rechazado'].map((e) => (
            <button key={e} onClick={() => setFiltroEstado(e)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition
                ${filtroEstado === e ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'}`}>
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {filtrados.length === 0 ? (
          <p className="px-5 py-10 text-center text-gray-400 text-sm">No hay registros</p>
        ) : filtrados.map((h) => (
          <div key={h.id}>
            <button onClick={() => setExpandido(expandido === h.id ? null : h.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left">
              <div>
                <p className="text-sm font-medium text-gray-800">{h.usuario}</p>
                <p className="text-xs text-gray-400">{h.id} · {h.tipo}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">${h.monto.toLocaleString()}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${h.estado === 'aprobado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {h.estado}
                </span>
                <span className="text-gray-300 text-xs">{expandido === h.id ? '▲' : '▼'}</span>
              </div>
            </button>
            {expandido === h.id && (
              <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3">
                  <div><p className="text-xs text-gray-500">Fecha solicitud</p><p className="text-sm font-medium text-gray-700">{h.fechaSolicitud}</p></div>
                  <div><p className="text-xs text-gray-500">Fecha resolución</p><p className="text-sm font-medium text-gray-700">{h.fechaResolucion}</p></div>
                  {h.motivo && <div><p className="text-xs text-gray-500">Motivo rechazo</p><p className="text-sm font-medium text-red-600">{h.motivo}</p></div>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}