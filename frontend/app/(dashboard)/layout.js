'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '../components/MainLayout';

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

  return <MainLayout>{children}</MainLayout>;
}