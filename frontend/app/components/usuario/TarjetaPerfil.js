'use client';

import Link from 'next/link';

const OPCIONES = [
  { label: 'Mis préstamos',      sub: 'Ver tus solicitudes activas',   href: '/usuario/mis-prestamos', icon: '📋' },
  { label: 'Solicitar préstamo', sub: 'Crear una nueva solicitud',     href: '/usuario/solicitar',     icon: '➕' },
  { label: 'Cambiar contraseña', sub: 'Actualiza tu contraseña',       href: '#',                      icon: '🔑' },
];

function formatFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function TarjetaPerfil({ usuario, onCerrarSesion }) {
  const iniciales = usuario.nombre
    ? usuario.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : usuario.email.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Tarjeta principal */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-20" />
        <div className="px-6 pb-6">
          {/* Avatar + nombre */}
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow flex items-center justify-center">
              <span className="text-xl font-bold text-blue-700">{iniciales}</span>
            </div>
            <div className="pb-1">
              <p className="text-lg font-bold text-gray-800">{usuario.nombre ?? 'Usuario'}</p>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Usuario
              </span>
            </div>
          </div>

          {/* Datos */}
          <div className="space-y-1.5 text-sm text-gray-600">
            <p>✉ {usuario.email}</p>
            <p>📅 Miembro desde {formatFecha(usuario.loginTime)}</p>
          </div>
        </div>
      </div>

      {/* Opciones de navegación */}
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {OPCIONES.map((op) => (
          <Link
            key={op.label}
            href={op.href}
            className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">{op.icon}</span>
              <div>
                <p className="text-sm font-medium text-gray-800">{op.label}</p>
                <p className="text-xs text-gray-400">{op.sub}</p>
              </div>
            </div>
            <span className="text-gray-300 text-sm">›</span>
          </Link>
        ))}
      </div>

      {/* Cerrar sesión */}
      <button
        onClick={onCerrarSesion}
        className="w-full bg-red-50 border border-red-200 text-red-600 font-semibold py-3 rounded-2xl hover:bg-red-100 transition text-sm"
      >
        Cerrar sesión
      </button>
    </div>
  );
}