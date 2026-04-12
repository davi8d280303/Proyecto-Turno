"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { logoutUsuario, getSessionUser } from "@/lib/api";

const TITLES = {
  "/panel":                "Panel principal",
  "/panel/inventario":     "Inventario",
  "/panel/usuarios":       "Gestión de usuarios",
  "/panel/configuracion":  "Configuración",
  "/recursos":             "Recursos",
  "/prestamos":            "Préstamos activos",
  "/historial":            "Historial",
  "/perfil":               "Mi perfil",
};

export default function Topbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getSessionUser());
  }, [pathname]); // Re-lee al navegar por si el perfil cambió

  const title = TITLES[pathname] || "Sistema";

  const handleLogout = async () => {
    await logoutUsuario();
    router.replace("/");
  };

  return (
    <header className="h-14 bg-blue-800 text-white flex justify-between items-center px-6 shadow-md">
      <h1 className="font-semibold text-sm uppercase tracking-wide">{title}</h1>

      <div className="flex items-center gap-4">
        {user && (
          <span className="text-xs text-blue-200 hidden sm:block">
            Hola, <strong className="text-white">{user.full_name?.split(" ")[0] || user.email}</strong>
          </span>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-xs text-blue-200 hover:text-white
                     hover:bg-red-600 px-3 py-1.5 rounded transition-all duration-200"
          title="Cerrar sesión"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  );
}
