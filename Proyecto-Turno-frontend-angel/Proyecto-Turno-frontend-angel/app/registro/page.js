"use client";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();

    // 🔹 SIMULAMOS REGISTRO CORRECTO
    router.push("/panel");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-gray-500 text-2xl font-semibold text-center">
          Registro
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          <input className="border p-2 w-full rounded" placeholder="Nombre" />
          <input className="border p-2 w-full rounded" placeholder="Correo" />
          <input className="border p-2 w-full rounded" placeholder="Contraseña" />
          <input className="border p-2 w-full rounded" placeholder="Confirmar contraseña" />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
