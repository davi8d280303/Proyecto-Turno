"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegistroPage() {
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado");
    router.push("/panel");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      {/* Tarjeta principal con más padding vertical */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-12 border border-gray-200 my-8">
        
        {/* Encabezado con más margen inferior */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Crear Cuenta
          </h1>
          <p className="text-gray-600 text-lg">
            Completa tus datos para registrarte
          </p>
        </div>

        {/* Formulario con más espacio alrededor */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Campo Nombre */}
          <div className="space-y-3">
            <label className="block text-gray-700 font-medium text-sm uppercase tracking-wide">
              Nombre completo
            </label>
            <input
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

          {/* Campo Correo */}
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

          {/* Campo Contraseña */}
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

          {/* Campo Confirmar Contraseña */}
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

          {/* Botón con más margen superior */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 
                       text-white font-semibold py-4 rounded-xl
                       hover:from-blue-700 hover:to-blue-800 
                       active:scale-[0.98] transition-all duration-200
                       shadow-lg hover:shadow-xl shadow-blue-200 hover:shadow-blue-300 mt-8"
          >
            Registrarse
          </button>

        </form>

        {/* Enlace inferior con más espacio arriba */}
        <div className="pt-8 border-t border-gray-200 text-center">
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