'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../components/MainLayout';
import { getAccessToken, getRefreshToken, clearSession } from '@/lib/api';

export default function DashboardLayout({ children }) {
  const router    = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Movemos la lógica a una función interna async para
    // evitar el warning de setState directo en el cuerpo del efecto
    function verificarSesion() {
      const accessToken  = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken && !refreshToken) {
        clearSession();
        router.replace('/');
        return;
      }

      setChecking(false);
    }

    verificarSesion();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-blue-900 font-bold uppercase tracking-widest animate-pulse text-sm">
          Verificando sesión...
        </div>
      </div>
    );
  }

  return <MainLayout>{children}</MainLayout>;
}