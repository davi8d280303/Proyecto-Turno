'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Loader from '../../lib/shared/Loader';
import { Home, ClipboardList, Plus, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'; // <-- iconos Lucide

const NAV = [
  { href: '/usuario/dashboard',     label: 'Inicio',         icon: <Home className="w-5 h-5" /> },
  { href: '/usuario/mis-prestamos', label: 'Mis préstamos',  icon: <ClipboardList className="w-5 h-5" /> },
  { href: '/usuario/solicitar',     label: 'Solicitar',      icon: <Plus className="w-5 h-5" /> },
  { href: '/usuario/perfil',        label: 'Mi perfil',      icon: <User className="w-5 h-5" /> },
];

export default function UsuarioLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [usuario,  setUsuario]  = useState(null);
  const [abierto,  setAbierto]  = useState(true);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem('usuario');
    if (!data) { router.replace('/login'); return; }
    const parsed = JSON.parse(data);
    if (parsed.role !== 'usuario') { router.replace('/login'); return; }
    setUsuario(parsed);
    setCargando(false);
  }, []);

  if (cargando) return <Loader mensaje="Cargando..." />;

  const paginaActual = NAV.find((n) => pathname.startsWith(n.href))?.label ?? 'Panel';

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* SIDEBAR */}
      <aside className={`flex flex-col bg-[#1a56db] text-white transition-all duration-300 ${abierto ? 'w-56' : 'w-16'}`}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          {abierto && (
            <div>
              <p className="text-sm font-bold">Sistema</p>
              <span className="text-[10px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-semibold">usuario</span>
            </div>
          )}
          <button onClick={() => setAbierto(!abierto)} className="text-white/60 hover:text-white p-1 rounded">
            {abierto ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV.map((item) => {
            const activo = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${activo ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                <span className="text-base w-5 text-center">{item.icon}</span>
                {abierto && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          {abierto && usuario && (
            <div className="mb-3 px-1">
              <p className="text-xs font-medium text-white truncate">{usuario.nombre ?? usuario.email}</p>
              <p className="text-[10px] text-white/50">Usuario</p>
            </div>
          )}
          <button
            onClick={() => { localStorage.removeItem('usuario'); router.push('/login'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition">
            <LogOut className="w-4 h-4" />
            {abierto && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <h1 className="text-sm font-semibold text-gray-700">{paginaActual}</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{usuario?.nombre ?? usuario?.email}</span>
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              {(usuario?.nombre ?? usuario?.email ?? 'U').slice(0, 2).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}