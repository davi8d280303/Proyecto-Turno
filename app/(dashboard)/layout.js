"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar"; 
import Topbar from "../components/Topbar";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const mainRef = useRef(null);

  // CONTROLAR FOCO: Cada vez que cambia la ruta → mover foco al contenido
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
      // MANIPULACIÓN DOM: Asegurar que el scroll vuelva arriba al cambiar de página
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Navegación lateral SPA */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Barra superior fija */}
        <Topbar />

        {/* MANIPULACIÓN DOM SIN RECARGAR: 
            Se añade tabIndex para el foco y una animación de entrada suave (fade-in)
        */}
        <main
          ref={mainRef}
          tabIndex={-1}
          role="main"
          className="p-6 outline-none animate-in fade-in duration-700 ease-in-out"
          key={pathname} // La 'key' fuerza la animación al cambiar de ruta
        >
          {children}
        </main>
      </div>
    </div>
  );
}