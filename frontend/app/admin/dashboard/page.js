'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const PENDIENTES = [
  { id: 'P-092', usuario: 'Laura Jiménez',   monto: 3200,  tipo: 'Educación',  dias: 2 },
  { id: 'P-095', usuario: 'Diego Herrera',   monto: 2000,  tipo: 'Emergencia', dias: 1 },
  { id: 'P-099', usuario: 'Diana Flores',    monto: 5500,  tipo: 'Personal',   dias: 0 },
];

export default function AdminDashboard() {
  const [usuario, setUsuario] = useState(null);
  useEffect(() => {
    const data = localStorage.getItem('usuario');
    if (data) setUsuario(JSON.parse(data));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Hola, {usuario?.nombre ?? usuario?.email ?? 'Admin'} 
        </h2>
        <p className="text-sm text-gray-500 mt-1">Resumen de tu gestión</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pendientes',        valor: 12, color: 'text-yellow-600', href: '/admin/prestamos' },
          { label: 'Aprobados este mes', valor: 38, color: 'text-green-700',  href: '/admin/historial' },
          { label: 'Usuarios asignados', valor: 94, color: 'text-blue-700',   href: '/admin/usuarios'  },
        ].map((m) => (
          <Link key={m.label} href={m.href}
            className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className={`text-3xl font-bold ${m.color}`}>{m.valor}</p>
          </Link>
        ))}
      </div>

      {/* Alerta pendientes urgentes */}
      {PENDIENTES.some(p => p.dias >= 2) && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl text-sm">
          {PENDIENTES.filter(p => p.dias >= 2).length} solicitudes llevan más de 48 horas sin revisión
        </div>
      )}

      {/* Solicitudes pendientes */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Solicitudes pendientes</h3>
          <Link href="/admin/prestamos" className="text-xs text-blue-600 hover:underline">Ver todas →</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {PENDIENTES.map((p) => (
            <Link key={p.id} href={`/admin/prestamos/${p.id}`}
              className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition">
              <div>
                <p className="text-sm font-medium text-gray-800">{p.usuario}</p>
                <p className="text-xs text-gray-400">
                  {p.tipo} · {p.dias === 0 ? 'Hoy' : `Hace ${p.dias} día${p.dias > 1 ? 's' : ''}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">${p.monto.toLocaleString()}</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full font-medium">pendiente</span>
                <span className="text-gray-300">›</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Rendimiento */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Mi rendimiento este mes</h3>
        {[
          { label: 'Aprobados', pct: 74, color: 'bg-green-500', text: 'text-green-700' },
          { label: 'Rechazados', pct: 26, color: 'bg-red-400',  text: 'text-red-700'   },
        ].map((b) => (
          <div key={b.label} className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{b.label}</span>
              <span className={`font-semibold ${b.text}`}>{b.pct}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}