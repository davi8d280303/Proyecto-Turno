"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react"; 
import Link from "next/link";

export default function RegistroPage() {
  const router = useRouter();
  const nombreRef = useRef(null);
  
  // ESTADOS PARA CONTROLAR LA MAGIA
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (nombreRef.current) {
      nombreRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // VALIDACIÓN PARA ACTIVAR LA SACUDIDA (SHAKE)
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    // Simulación de envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push("/panel");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      
      {/* LÓGICA DE CLASES:
          1. 'animacion-login' entra suave al cargar.
          2. 'error-shake' se activa si el estado 'error' tiene texto.
          3. 'border-red-500' cambia el color del borde si falla.
      */}
      <div className={`w-full max-w-lg bg-white rounded-2xl shadow-xl p-12 border transition-all duration-300 my-8
        ${error ? 'error-shake border-red-500' : 'border-gray-200 animacion-login'}`}>
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Crear Cuenta
          </h1>
          <p className="text-gray-600 text-lg">
            Completa tus datos para registrarte
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="space-y-3">
            <label className="block text-gray-700 font-medium text-sm uppercase tracking-wide">
              Nombre completo
            </label>
            <input
              ref={nombreRef}
              type="text"
              name="nombre"
              placeholder="Tu nombre completo"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl 
                         text-gray-800 placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-gray-700 font-medium text-sm uppercase tracking-wide">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl 
                         text-gray-800 placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-gray-700 font-medium text-sm uppercase tracking-wide">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl 
                         text-gray-800 placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="block text-gray-700 font-medium text-sm uppercase tracking-wide">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              className="w-full px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl 
                         text-gray-800 placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 
                       text-white font-semibold py-4 rounded-xl
                       hover:from-blue-700 hover:to-blue-800 
                       active:scale-[0.98] transition-all duration-200
                       shadow-lg hover:shadow-xl shadow-blue-200 hover:shadow-blue-300 mt-8
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Procesando..." : "Registrarse"}
          </button>

        </form>

        <div className="pt-8 border-t border-gray-200 text-center mt-8">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link 
              href="/"
              className="font-semibold text-blue-600 hover:text-blue-700 
                         underline underline-offset-4 decoration-2 
                         hover:decoration-blue-700 transition-colors"
            >
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}