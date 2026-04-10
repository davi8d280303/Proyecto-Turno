"use client";

import { usePathname } from "next/navigation";

const TITLES = {
  "/panel": "Panel principal",
  "/panel/inventario": "Inventario",
  "/panel/prestamos": "Préstamos",
  "/panel/usuarios": "Usuarios",
  "/panel/configuracion": "Configuración",
  "/recursos": "Recursos",
  "/prestamos": "Mis Préstamos",
  "/historial": "Historial",
  "/perfil": "Perfil",
};

export default function Topbar() {
  const pathname = usePathname();
  const title = TITLES[pathname] || "Sistema";

  return (
    <header className="h-14 bg-blue-800 text-white flex justify-between items-center px-6">
      <h1 className="font-semibold">{title}</h1>
      <div className="flex gap-4">
        <button>🔔</button>
        <button>⚙️</button>
      </div>
    </header>
  );
}