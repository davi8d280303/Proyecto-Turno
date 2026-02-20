"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const emailRef = useRef(null);
  const errorRef = useRef(null);

  // Estados formales
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");

  // Foco automático al cargar
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Foco automático al error
  useEffect(() => {
    if (status === "error") {
      errorRef.current?.focus();
    }
  }, [status]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      setStatus("success");
      router.push("/panel");

    } catch (err) {
      setErrorMessage(err.message);
      setStatus("error");
    }
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

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
          aria-busy={status === "loading"}
        >

          {/* EMAIL */}
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
              required
              disabled={status === "loading"}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 
                         rounded-xl text-gray-800 placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
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
              required
              disabled={status === "loading"}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 
                         rounded-xl text-gray-800 placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* MENSAJES */}
          {status === "loading" && (
            <p role="status" className="text-blue-600 text-sm text-center">
              Iniciando sesión...
            </p>
          )}

          {status === "error" && (
            <p
              ref={errorRef}
              role="alert"
              tabIndex={-1}
              className="text-red-600 text-sm text-center outline-none"
            >
              {errorMessage}
            </p>
          )}

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 
                       text-white font-semibold py-3.5 rounded-xl
                       disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Iniciando sesión..." : "Enviar al sistema"}
          </button>

        </form>

        <div className="mt-10 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{" "}
            <Link
              href="/registro"
              className="font-semibold text-blue-600 underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}