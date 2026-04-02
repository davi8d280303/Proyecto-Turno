'use client';

import { useState } from 'react';

const PRESTAMOS = [
  { id: 'P-091', usuario: 'Carlos Mendoza',  email: 'carlos@mail.com', monto: 8500,  tipo: 'Personal',   estado: 'aprobado',  admin: 'Admin Ruiz',   fecha: '01 abr 2026' },
  { id: 'P-092', usuario: 'Laura Jiménez',   email: 'laura@mail.com',  monto: 3200,  tipo: 'Educación',  estado: 'pendiente', admin: 'Admin Torres', fecha: '01 abr 2026' },
  { id: 'P-093', usuario: 'Miguel Ríos',     email: 'miguel@mail.com', monto: 12000, tipo: 'Negocio',    estado: 'rechazado', admin: 'Admin Ruiz',   fecha: '31 mar 2026' },
  { id: 'P-094', usuario: 'Sofía Castillo',  email: 'sofia@mail.com',  monto: 5750,  tipo: 'Personal',   estado: 'aprobado',  admin: 'Admin Torres', fecha: '31 mar 2026' },
  { id: 'P-095', usuario: 'Diego Herrera',   email: 'diego@mail.com',  monto: 2000,  tipo: 'Emergencia', estado: 'pendiente', admin: 'Admin López',  fecha: '30 mar 2026' },
  { id: 'P-096', usuario: 'Ana González',    email: 'ana@mail.com',    monto: 15000, tipo: 'Negocio',    estado: 'aprobado',  admin: 'Admin Ruiz',   fecha: '29 mar 2026' },
  { id: 'P-097', usuario: 'Pedro Salinas',   email: 'pedro@mail.com',  monto: 4500,  tipo: 'Personal',   estado: 'rechazado', admin: 'Admin Torres', fecha: '28 mar 2026' },
  { id: 'P-098', usuario: 'Valeria Reyes',   email: 'vale@mail.com',   monto: 9000,  tipo: 'Educación',  estado: 'aprobado',  admin: 'Admin López',  fecha: '27 mar 2026' },
];

const ESTADO_STYLES = { aprobado: 'bg-green-100 text-green-800', pendiente: 'bg-yellow-100 text-yellow-800', rechazado: 'bg-red-100 text-red-800' };

export default function SuperAdminPrestamos() {
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda,     setBusqueda]     = useState('');

  const filtrados = PRESTAMOS.filter((p) => {
    const okEstado   = filtroEstado === 'todos' || p.estado === filtroEstado;
    const okBusqueda = p.usuario.toLowerCase().includes(busqueda.toLowerCase())
      || p.id.toLowerCase().includes(busqueda.toLowerCase())
      || p.admin.toLowerCase().includes(busqueda.toLowerCase());
    return okEstado && okBusqueda;
  });

  const total = filtrados.reduce((a, p) => a + p.monto, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Todos los préstamos</h2>
          <p className="text-sm text-gray-500 mt-1">Vista global · control total del sistema</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Suma filtrada</p>
          <p className="text-xl font-bold text-purple-700">${total.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input type="text" placeholder="Buscar por usuario, ID o admin..."
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
        <div className="flex gap-2 flex-wrap">
          {['todos', 'aprobado', 'pendiente', 'rechazado'].map((e) => (
            <button key={e} onClick={() => setFiltroEstado(e)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition
                ${filtroEstado === e ? 'bg-purple-700 text-white border-purple-700' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Monto</th>
              <th className="px-4 py-3 text-left">Admin</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtrados.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400">No hay resultados</td></tr>
            ) : filtrados.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{p.usuario}</p>
                  <p className="text-xs text-gray-400">{p.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">{p.tipo}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">${p.monto.toLocaleString()}</td>
                <td className="px-4 py-3 text-blue-600 text-xs">{p.admin}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{p.fecha}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ESTADO_STYLES[p.estado]}`}>{p.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Mostrando {filtrados.length} de {PRESTAMOS.length} préstamos
        </div>
      </div>
    </div>
  );
}