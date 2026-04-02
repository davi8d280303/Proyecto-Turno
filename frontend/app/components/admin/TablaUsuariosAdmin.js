'use client';

import Link from 'next/link';
import Badge from '../shared/Badge';

export default function TablaUsuariosAdmin({ usuarios }) {
  if (!usuarios || usuarios.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-sm text-gray-400">
        No hay usuarios con ese criterio
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
      {usuarios.map((u) => {
        const iniciales = u.nombre
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

        return (
          <div
            key={u.id}
            className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
          >
            {/* Avatar + info */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {iniciales}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {u.nombre}
                </p>

                <p className="text-xs text-gray-400 truncate">
                  {u.email} · {u.prestamos} préstamo
                  {u.prestamos !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Estado + acción */}
            <div className="flex items-center gap-3 ml-4 flex-shrink-0">
              <Badge estado={u.ultimoEstado} />

              <Link
                href={`/admin/prestamos?q=${encodeURIComponent(u.nombre)}`}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Ver préstamos
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}