'use client';

import Badge from '@/components/shared/Badge';

export default function TablaAdmins({ admins, onToggleEstado, onEliminar }) {
  if (admins.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-sm text-gray-400">
        No hay admins registrados
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
      {admins.map((admin) => (
        <div key={admin.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
          {/* Avatar inicial */}
          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {admin.nombre[0]}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{admin.nombre}</p>
            <p className="text-xs text-gray-400 truncate">{admin.email}</p>
          </div>

          {/* Préstamos gestionados */}
          <div className="hidden sm:block text-center w-24">
            <p className="text-xs text-gray-400">Gestionados</p>
            <p className="text-sm font-semibold text-gray-700">{admin.prestamosGestionados}</p>
          </div>

          {/* Fecha creación */}
          <div className="hidden md:block text-center w-28">
            <p className="text-xs text-gray-400">Desde</p>
            <p className="text-xs text-gray-600">{admin.fechaCreacion}</p>
          </div>

          {/* Badge estado */}
          <Badge estado={admin.estado} />

          {/* Acciones */}
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={() => onToggleEstado(admin.id)}
              className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              {admin.estado === 'activo' ? 'Desactivar' : 'Activar'}
            </button>
            <button
              onClick={() => onEliminar(admin.id)}
              className="text-xs px-3 py-1.5 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}