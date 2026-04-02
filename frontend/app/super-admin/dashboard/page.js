'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const METRICAS = [
  { label: 'Total préstamos',      valor: 1284, color: 'text-purple-700', href: '/super-admin/prestamos' },
  { label: 'Pendientes',           valor: 47,   color: 'text-yellow-600', href: '/super-admin/prestamos' },
  { label: 'Admins activos',       valor: 6,    color: 'text-blue-700',   href: '/super-admin/admins'    },
  { label: 'Usuarios registrados', valor: 312,  color: 'text-green-700',  href: '/super-admin/usuarios'  },
];

const RECIENTES = [
  { id: 'P-091', usuario: 'Carlos Mendoza', monto: 8500,  estado: 'aprobado',  admin: 'Admin Ruiz',   fecha: '01 abr 2026' },
  { id: 'P-092', usuario: 'Laura Jiménez',  monto: 3200,  estado: 'pendiente', admin: 'Admin Torres', fecha: '01 abr 2026' },
  { id: 'P-093', usuario: 'Miguel Ríos',    monto: 12000, estado: 'rechazado', admin: 'Admin Ruiz',   fecha: '31 mar 2026' },
  { id: 'P-094', usuario: 'Sofía Castillo', monto: 5750,  estado: 'aprobado',  admin: 'Admin Torres', fecha: '31 mar 2026' },
  { id: 'P-095', usuario: 'Diego Herrera',  monto: 2000,  estado: 'pendiente', admin: 'Admin López',  fecha: '30 mar 2026' },
];

const ESTADO_STYLES = { aprobado: 'bg-green-100 text-green-800', pendiente: 'bg-yellow-100 text-yellow-800', rechazado: 'bg-red-100 text-red-800' };

export default function SuperAdminDashboard() {
  const [hora, setHora] = useState('');
  useEffect(() => {
    const act = () => setHora(new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }));
    act();
    const id = setInterval(act, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Panel de control</h2>
        <p className="text-sm text-gray-500 mt-1">
          Visión global · {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} · {hora}
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {METRICAS.map((m) => (
          <Link key={m.label} href={m.href}
            className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition group">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className={`text-3xl font-bold ${m.color}`}>{m.valor.toLocaleString()}</p>
          </Link>
        ))}
      </div>

      {/* Distribución */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribución de préstamos</h3>
        <div className="space-y-3">
          {[
            { label: 'Aprobados',  pct: 68, color: 'bg-green-500',  text: 'text-green-700'  },
            { label: 'Pendientes', pct: 18, color: 'bg-yellow-400', text: 'text-yellow-700' },
            { label: 'Rechazados', pct: 14, color: 'bg-red-400',    text: 'text-red-700'    },
          ].map((b) => (
            <div key={b.label}>
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

      {/* Actividad reciente */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Actividad reciente</h3>
          <Link href="/super-admin/prestamos" className="text-xs text-blue-600 hover:underline">Ver todos →</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {RECIENTES.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{p.usuario}</p>
                <p className="text-xs text-gray-400">{p.id} · {p.admin} · {p.fecha}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">${p.monto.toLocaleString()}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ESTADO_STYLES[p.estado]}`}>{p.estado}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}