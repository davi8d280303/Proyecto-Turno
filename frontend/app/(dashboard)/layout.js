'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../components/MainLayout';
import { getAccessToken, getRefreshToken, clearSession } from '@/lib/api';

export default function DashboardLayout({ children }) {
  const router   = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const accessToken  = getAccessToken();
    const refreshToken = getRefreshToken();

    // Si no hay ningún token → login
    if (!accessToken && !refreshToken) {
      clearSession();
      router.replace('/');
      return;
    }

    // Si hay al menos un token, dejamos pasar.
    // El interceptor de authRequest en api.js se encargará de hacer
    // refresh automático si el accessToken ya expiró.
    setChecking(false);
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
