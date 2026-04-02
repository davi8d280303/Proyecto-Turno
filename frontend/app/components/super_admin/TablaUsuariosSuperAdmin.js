'use client';

import Badge from '@/components/shared/Badge';

export default function TablaUsuariosSuperAdmin({ usuarios, onToggleEstado }) {
  if (usuarios.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-sm text-gray-400">
        No hay usuarios que coincidan
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 px-5 py-2.5 bg-gray-50 text-xs font-medium text-gray-400 uppercase tracking-wide">
        <span className="col-span-4">Usuario</span>
        <span className="col-span-2 text-center hidden sm:block">Préstamos</span>
        <span className="col-span-2 text-center hidden md:block">Monto total</span>
        <span className="col-span-2 text-center">Estado</span>
        <span className="col-span-2 text-right">Acción</span>
      </div>

      {usuarios.map((u) => (
        <div key={u.id} className="grid grid-cols-12 items-center px-5 py-3.5 hover:bg-gray-50 transition">
          {/* Nombre + email */}
          <div className="col-span-4 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{u.nombre}</p>
            <p className="text-xs text-gray-400 truncate">{u.email}</p>
          </div>

          {/* Préstamos */}
          <div className="col-span-2 text-center hidden sm:block">
            <p className="text-sm font-semibold text-gray-700">{u.prestamos}</p>
          </div>

          {/* Monto total */}
          <div className="col-span-2 text-center hidden md:block">
            <p className="text-sm text-gray-600">${u.montoTotal.toLocaleString('es-MX')}</p>
          </div>

          {/* Estado */}
          <div className="col-span-2 flex justify-center">
            <Badge estado={u.estado} />
          </div>

          {/* Acción */}
          <div className="col-span-2 flex justify-end">
            <button
              onClick={() => onToggleEstado(u.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                u.estado === 'activo'
                  ? 'border-orange-200 text-orange-600 hover:bg-orange-50'
                  : 'border-green-200 text-green-600 hover:bg-green-50'
              }`}
            >
              {u.estado === 'activo' ? 'Suspender' : 'Activar'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}