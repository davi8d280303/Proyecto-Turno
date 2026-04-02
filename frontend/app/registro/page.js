'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { RUTAS_POR_ROL } from '../../lib/constants/roles';

export default function RegistroPage() {
  const router    = useRouter();
  const nombreRef = useRef(null);
  const [error,     setError]     = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { nombreRef.current?.focus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData        = new FormData(e.target);
    const nombre          = formData.get('nombre');
    const email           = formData.get('email');
    const password        = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (!nombre || !email || !password || !confirmPassword) {
      setError('Completa todos los campos');
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    await new Promise((r) => setTimeout(r, 1000));

    // Siempre rol usuario — los admins los crea el super_admin
    localStorage.setItem('usuario', JSON.stringify({
      nombre,
      email,
      role: 'usuario',
      loginTime: new Date().toISOString(),
    }));

    router.push(RUTAS_POR_ROL['usuario']);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className={`w-full max-w-lg bg-white rounded-2xl shadow-xl p-10 border transition-all my-8
        ${error ? 'border-red-400' : 'border-gray-200'}`}>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Crear cuenta</h1>
          <p className="text-gray-500">Completa tus datos para registrarte</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input
              ref={nombreRef}
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Repite tu contraseña"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isLoading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}