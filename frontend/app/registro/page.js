"use client";

import { useRouter } from "next/navigation";
<<<<<<< Updated upstream
import { useEffect, useRef, useState } from "react";
=======
<<<<<<< HEAD
import { useEffect, useRef, useState } from "react"; 
=======
import { useEffect, useRef } from "react"; // 1. Importar hooks
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes
import Link from "next/link";
import { registrarUsuario } from "@/lib/api";

export default function RegistroPage() {
  const router = useRouter();
<<<<<<< HEAD
  const nombreRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

=======
  
  // 2. Crear la referencia para el primer input
  const nombreRef = useRef(null);

  // 3. Efecto para controlar el foco al cargar la página
>>>>>>> 20fed7f (commit backend sistema de prestamos)
  useEffect(() => {
    if (nombreRef.current) nombreRef.current.focus();
  }, []);

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData(e.target);
    const full_name = formData.get("nombre");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

<<<<<<< Updated upstream
    const result = await registrarUsuario(full_name, email, password);

    if (!result.success) {
      setError(result.error || "Error al registrarse");
      setIsLoading(false);
      return;
    }

    // Registro exitoso → ir al login
    router.push("/?registered=true");
=======
    // Simulación de envío
    await new Promise(resolve => setTimeout(resolve, 1000));
=======
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado");
>>>>>>> 20fed7f (commit backend sistema de prestamos)
    router.push("/panel");
>>>>>>> Stashed changes
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      {/* LÓGICA DE CLASES:
          1. 'animacion-login' entra suave al cargar.
          2. 'error-shake' se activa si el estado 'error' tiene texto.
          3. 'border-red-500' cambia el color del borde si falla.
      */}
<<<<<<< Updated upstream
      <div
        className={`w-full max-w-lg bg-white rounded-2xl shadow-xl p-12 border transition-all duration-300 my-8
        ${error ? "error-shake border-red-500" : "border-gray-200 animacion-login"}`}
      >
=======
      <div className={`w-full max-w-lg bg-white rounded-2xl shadow-xl p-12 border transition-all duration-300 my-8
        ${error ? 'error-shake border-red-500' : 'border-gray-200 animacion-login'}`}>
        
=======
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      {/* Tarjeta principal con más padding vertical */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-12 border border-gray-200 my-8">
        
        {/* Encabezado con más margen inferior */}
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Crear Cuenta
          </h1>
          <p className="text-gray-600 text-lg">
            Completa tus datos para registrarte
          </p>
        </div>

<<<<<<< HEAD
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold">
            ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
<<<<<<< Updated upstream
=======
          
=======
        {/* Formulario con más espacio alrededor */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Campo Nombre */}
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes
          <div className="space-y-3">
            <label className="block text-gray-700 font-medium text-sm uppercase tracking-wide">
              Nombre completo
            </label>
            <input
<<<<<<< HEAD
              ref={nombreRef}
=======
              ref={nombreRef} // 4. Asignar la referencia aquí
>>>>>>> 20fed7f (commit backend sistema de prestamos)
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

<<<<<<< HEAD
=======
          {/* Campo Correo */}
>>>>>>> 20fed7f (commit backend sistema de prestamos)
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

<<<<<<< HEAD
=======
          {/* Campo Contraseña */}
>>>>>>> 20fed7f (commit backend sistema de prestamos)
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

<<<<<<< HEAD
=======
          {/* Campo Confirmar Contraseña */}
>>>>>>> 20fed7f (commit backend sistema de prestamos)
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

<<<<<<< HEAD
          <button
            type="submit"
            disabled={isLoading}
=======
          {/* Botón con más margen superior */}
          <button
            type="submit"
>>>>>>> 20fed7f (commit backend sistema de prestamos)
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 
                       text-white font-semibold py-4 rounded-xl
                       hover:from-blue-700 hover:to-blue-800 
                       active:scale-[0.98] transition-all duration-200
<<<<<<< HEAD
                       shadow-lg hover:shadow-xl shadow-blue-200 hover:shadow-blue-300 mt-8
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Procesando..." : "Registrarse"}
=======
                       shadow-lg hover:shadow-xl shadow-blue-200 hover:shadow-blue-300 mt-8"
          >
            Registrarse
>>>>>>> 20fed7f (commit backend sistema de prestamos)
          </button>
        </form>

<<<<<<< HEAD
        <div className="pt-8 border-t border-gray-200 text-center mt-8">
=======
        {/* Enlace inferior con más espacio arriba */}
        <div className="pt-8 border-t border-gray-200 text-center">
>>>>>>> 20fed7f (commit backend sistema de prestamos)
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
