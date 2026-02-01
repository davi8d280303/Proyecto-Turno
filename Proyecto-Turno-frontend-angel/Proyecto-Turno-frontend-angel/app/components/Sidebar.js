"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-60 bg-blue-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Sistema</h2>

      <nav className="flex flex-col gap-3 text-sm">
        <Link href="/panel" className="hover:bg-blue-800 p-2 rounded">
          Panel
        </Link>
        <Link href="/recursos" className="hover:bg-blue-800 p-2 rounded">
          Recursos
        </Link>
        <Link href="/prestamos" className="hover:bg-blue-800 p-2 rounded">
          Mis Préstamos
        </Link>
        <Link href="/historial" className="hover:bg-blue-800 p-2 rounded">
          Historial
        </Link>
        <Link href="/perfil" className="hover:bg-blue-800 p-2 rounded">
          Perfil
        </Link>
      </nav>
    </aside>
  );
}
