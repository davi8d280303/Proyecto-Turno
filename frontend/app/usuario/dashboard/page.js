'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const MIS_PRESTAMOS = [
  { id: 'P-099', tipo: 'Personal',   monto: 5000,  estado: 'pendiente', fecha: '30 mar 2026' },
  { id: 'P-085', tipo: 'Educativo',  monto: 3500,  estado: 'aprobado',  fecha: '10 feb 2026' },
  { id: 'P-070', tipo: 'Negocio',    monto: 3000,  estado: 'aprobado',  fecha: '05 ene 2026' },
];

const ESTADO_STYLES = { aprobado: 'bg-green-100 text-green-800', pendiente: 'bg-yellow-100 text-yellow-800', rechazado: 'bg-red-100 text-red-800' };

export default function UsuarioDashboard() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('usuario');
    if (data) setUsuario(JSON.parse(data));
  }, []);

  const pendientes = MIS_PRESTAMOS.filter(p => p.estado === 'pendiente').length;
  const aprobados  = MIS_PRESTAMOS.filter(p => p.estado === 'aprobado').length;
  const total      = MIS_PRESTAMOS.reduce((a, p) => a + p.monto, 0);

  return (
    <div className="space-y-6">
      {/* Saludo */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Hola, {usuario?.nombre ?? 'Usuario'} 
        </h2>
        <p className="text-sm text-gray-500 mt-1">Aquí está el resumen de tus préstamos</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Activos',      valor: aprobados,           color: 'text-blue-700'   },
          { label: 'En revisión',  valor: pendientes,           color: 'text-yellow-600' },
          { label: 'Total pedido', valor: `$${total.toLocaleString()}`, color: 'text-gray-800' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className={`text-2xl font-bold ${m.color}`}>{m.valor}</p>
          </div>
        ))}
      </div>

      {/* Alerta si hay pendiente */}
      {pendientes > 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-sm">
          Tienes {pendientes} solicitud{pendientes > 1 ? 'es' : ''} en revisión por el administrador
        </div>
      )}

      {/* Préstamos recientes */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Mis préstamos recientes</h3>
          <Link href="/usuario/mis-prestamos" className="text-xs text-blue-600 hover:underline">Ver todos →</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {MIS_PRESTAMOS.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{p.tipo}</p>
                <p className="text-xs text-gray-400">{p.id} · {p.fecha}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">${p.monto.toLocaleString()}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ESTADO_STYLES[p.estado]}`}>{p.estado}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Acceso rápido */}
      <Link href="/usuario/solicitar"
        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3.5 rounded-2xl font-semibold transition text-sm">
        + Solicitar nuevo préstamo
      </Link>
    </div>
  );
}