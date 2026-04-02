'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { RUTAS_POR_ROL } from '../../lib/constants/roles';

export default function LoginPage() {
  const router   = useRouter();
  const emailRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState(null);
  const [formData,  setFormData]  = useState({ email: '', password: '' });

  useEffect(() => {
    localStorage.removeItem('usuario');
    emailRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.email || !formData.password)
        throw new Error('Por favor completa todos los campos');

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email))
        throw new Error('Correo inválido');

      await new Promise((r) => setTimeout(r, 800));

      // Detección de rol por email (simulación)
      let role = 'usuario';
      if (formData.email.includes('super')) role = 'super_admin';
      else if (formData.email.includes('admin')) role = 'admin';

      localStorage.setItem('usuario', JSON.stringify({
        email: formData.email,
        role,
        loginTime: new Date().toISOString(),
      }));

      router.push(RUTAS_POR_ROL[role]);

    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className={`w-full max-w-lg bg-white rounded-2xl shadow-xl p-10 border transition-all
        ${error ? 'border-red-400' : 'border-gray-200'}`}>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Bienvenido!</h1>
          <p className="text-gray-500">Ingresa tus credenciales</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
            <input
              ref={emailRef}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isLoading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-blue-600 font-semibold hover:underline">
            Regístrate
          </Link>
        </div>

      </div>
    </div>
  );
}