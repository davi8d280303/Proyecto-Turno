<<<<<<< Updated upstream
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../components/MainLayout';
=======
<<<<<<< HEAD
"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar"; 
import Topbar from "../components/Topbar";
>>>>>>> Stashed changes

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/');
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) return null; // Evita flash de contenido no autorizado

<<<<<<< Updated upstream
  return <MainLayout>{children}</MainLayout>;
}
=======
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
=======
'use client';

import MainLayout from '../components/MainLayout';

export default function DashboardLayout({ children }) {
  return <MainLayout>{children}</MainLayout>;
}
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes
