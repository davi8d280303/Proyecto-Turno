'use client';

import { useState } from 'react';
import Link from 'next/link';

const MIS_PRESTAMOS = [
  { id: 'P-099', tipo: 'Personal',   monto: 5000,  estado: 'pendiente', fecha: '30 mar 2026', descripcion: 'Para gastos personales' },
  { id: 'P-085', tipo: 'Educativo',  monto: 3500,  estado: 'aprobado',  fecha: '10 feb 2026', descripcion: 'Pago de posgrado' },
  { id: 'P-070', tipo: 'Negocio',    monto: 3000,  estado: 'aprobado',  fecha: '05 ene 2026', descripcion: 'Capital de trabajo' },
  { id: 'P-055', tipo: 'Emergencia', monto: 1500,  estado: 'rechazado', fecha: '10 dic 2025', descripcion: 'Gastos médicos', motivoRechazo: 'Documentación incompleta' },
];

const ESTADO_STYLES = { aprobado: 'bg-green-100 text-green-800', pendiente: 'bg-yellow-100 text-yellow-800', rechazado: 'bg-red-100 text-red-800' };

export default function MisPrestamos() {
  const [filtro,   setFiltro]   = useState('todos');
  const [expandido, setExpandido] = useState(null);

  const filtrados = MIS_PRESTAMOS.filter(p => filtro === 'todos' || p.estado === filtro);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Mis préstamos</h2>
        <p className="text-sm text-gray-500 mt-1">Historial completo de tus solicitudes</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {['todos', 'pendiente', 'aprobado', 'rechazado'].map((f) => (
          <button key={f} onClick={() => setFiltro(f)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition
              ${filtro === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filtrados.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-400">
            No tienes préstamos en ese estado
          </div>
        ) : filtrados.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <button onClick={() => setExpandido(expandido === p.id ? null : p.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left">
              <div>
                <p className="text-sm font-semibold text-gray-800">{p.tipo}</p>
                <p className="text-xs text-gray-400">{p.id} · {p.fecha}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-800">${p.monto.toLocaleString()}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ESTADO_STYLES[p.estado]}`}>{p.estado}</span>
                <span className="text-gray-300 text-xs">{expandido === p.id ? '▲' : '▼'}</span>
              </div>
            </button>

            {expandido === p.id && (
              <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
                <div className="pt-3 space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Descripción</p>
                    <p className="text-sm text-gray-700">{p.descripcion}</p>
                  </div>
                  {p.motivoRechazo && (
                    <div>
                      <p className="text-xs text-gray-500">Motivo de rechazo</p>
                      <p className="text-sm font-medium text-red-600">{p.motivoRechazo}</p>
                    </div>
                  )}
                  {p.estado === 'pendiente' && (
                    <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                      Tu solicitud está siendo revisada por el administrador
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Link href="/usuario/solicitar"
        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3.5 rounded-2xl font-semibold transition text-sm">
        + Solicitar nuevo préstamo
      </Link>
    </div>
  );
}