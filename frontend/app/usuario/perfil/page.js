'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Calendar, ClipboardList, Plus, Key } from 'lucide-react'; // <-- importamos los iconos

export default function PerfilUsuario() {
  const router  = useRouter();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('usuario');
    if (!data) { router.replace('/login'); return; }
    setUsuario(JSON.parse(data));
  }, []);

  if (!usuario) return null;

  const iniciales = usuario.nombre
    ? usuario.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : usuario.email.slice(0, 2).toUpperCase();

  const formatFecha = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">Mi perfil</h2>

      {/* Tarjeta principal */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-20" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow flex items-center justify-center">
              <span className="text-xl font-bold text-blue-700">{iniciales}</span>
            </div>
            <div className="pb-1">
              <p className="text-lg font-bold text-gray-800">{usuario.nombre ?? 'Usuario'}</p>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Usuario</span>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600 flex flex-col gap-1">
            <div className="flex items-center gap-1"><Mail className="w-4 h-4" /> {usuario.email}</div>
            <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Miembro desde {formatFecha(usuario.loginTime)}</div>
          </div>
        </div>
      </div>

      {/* Opciones */}
      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {[
          { label: 'Mis préstamos',     sub: 'Ver tus solicitudes activas',     href: '/usuario/mis-prestamos', icon: <ClipboardList className="w-5 h-5" /> },
          { label: 'Solicitar préstamo', sub: 'Crear una nueva solicitud',      href: '/usuario/solicitar',     icon: <Plus className="w-5 h-5" /> },
          { label: 'Cambiar contraseña', sub: 'Actualiza tu contraseña',        href: '#',                      icon: <Key className="w-5 h-5" /> },
        ].map((op) => (
          <Link key={op.label} href={op.href}
            className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              {op.icon}
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
        onClick={() => { localStorage.removeItem('usuario'); router.push('/login'); }}
        className="w-full bg-red-50 border border-red-200 text-red-600 font-semibold py-3 rounded-2xl hover:bg-red-100 transition text-sm">
        Cerrar sesión
      </button>
    </div>
  );
}