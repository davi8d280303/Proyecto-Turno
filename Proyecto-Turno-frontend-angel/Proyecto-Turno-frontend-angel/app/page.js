"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();

    // 🔹 SIMULAMOS LOGIN CORRECTO
    router.push("/panel");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-600">
          Iniciar sesión
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <input
            type="email"
            placeholder="Correo"
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/registro" className="text-blue-600">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
