"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const emailRef = useRef(null);

  // foco automático al cargar
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    router.push("/panel");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ¡Bienvenido de nuevo!
          </h1>
          <p className="text-gray-600 text-lg">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-2">
            <label 
              htmlFor="email"
              className="block text-gray-700 font-medium text-sm uppercase tracking-wide"
            >
              Correo electrónico
            </label>
            <input
              ref={emailRef}
              id="email"
              name="email"
              type="email"
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 
                         rounded-xl text-gray-800 placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-2">
            <label 
              htmlFor="password"
              className="block text-gray-700 font-medium text-sm uppercase tracking-wide"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 
                         rounded-xl text-gray-800 placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 
                       text-white font-semibold py-3.5 rounded-xl
                       hover:from-blue-700 hover:to-blue-800 
                       active:scale-[0.98] transition-all duration-200
                       shadow-lg hover:shadow-xl shadow-blue-200 hover:shadow-blue-300"
          >
            Enviar al sistema
          </button>

        </form>

        <div className="mt-10 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link 
              href="/registro" 
              className="font-semibold text-blue-600 hover:text-blue-700 
                         underline underline-offset-4 decoration-2 
                         hover:decoration-blue-700 transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
