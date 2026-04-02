'use client';

import { useState } from 'react';
import Link from 'next/link';

const USUARIOS = [
  { id: 'U-01', nombre: 'Laura Jiménez',   email: 'laura@mail.com',  prestamos: 2, ultimoEstado: 'pendiente', fechaRegistro: '10 ene 2026' },
  { id: 'U-02', nombre: 'Diego Herrera',   email: 'diego@mail.com',  prestamos: 2, ultimoEstado: 'pendiente', fechaRegistro: '20 ene 2026' },
  { id: 'U-03', nombre: 'Diana Flores',    email: 'diana@mail.com',  prestamos: 1, ultimoEstado: 'pendiente', fechaRegistro: '01 feb 2026' },
  { id: 'U-04', nombre: 'Carlos Mendoza',  email: 'carlos@mail.com', prestamos: 3, ultimoEstado: 'aprobado',  fechaRegistro: '05 ene 2026' },
  { id: 'U-05', nombre: 'Sofía Castillo',  email: 'sofia@mail.com',  prestamos: 4, ultimoEstado: 'aprobado',  fechaRegistro: '15 ene 2026' },
  { id: 'U-06', nombre: 'Miguel Ríos',     email: 'miguel@mail.com', prestamos: 1, ultimoEstado: 'rechazado', fechaRegistro: '12 ene 2026' },
];

const ESTADO_STYLES = { aprobado: 'bg-green-100 text-green-800', pendiente: 'bg-yellow-100 text-yellow-800', rechazado: 'bg-red-100 text-red-800' };

export default function AdminUsuarios() {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = USUARIOS.filter((u) =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Usuarios</h2>
        <p className="text-sm text-gray-500 mt-1">Usuarios con préstamos asignados a tu gestión</p>
      </div>

      <input type="text" placeholder="Buscar por nombre o correo..."
        value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {filtrados.length === 0 ? (
          <p className="px-5 py-10 text-center text-gray-400 text-sm">No hay usuarios con ese criterio</p>
        ) : filtrados.map((u) => (
          <div key={u.id} className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {u.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{u.nombre}</p>
                <p className="text-xs text-gray-400">{u.email} · {u.prestamos} préstamo{u.prestamos !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ESTADO_STYLES[u.ultimoEstado]}`}>
                {u.ultimoEstado}
              </span>
              <Link href={`/admin/prestamos?q=${encodeURIComponent(u.nombre)}`}
                className="text-xs text-blue-600 hover:underline">Ver préstamos</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}