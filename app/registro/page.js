"use client";

export default function RegistroPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-gray-500 text-2xl font-semibold text-center">
          Registro
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Crea una nueva cuenta
        </p>

        <hr className="my-6" />

        <form className="space-y-5">
          <div>
            <label className="text-gray-500 block text-sm font-medium">
              Nombre
            </label>
            <input
              type="text"
              className="text-gray-500 mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="text-gray-500 block text-sm font-medium">
              Correo
            </label>
            <input
              type="email"
              placeholder="user@acme.com"
              className="text-gray-500 mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="text-gray-500 block text-sm font-medium">
              Contraseña
            </label>
            <input
              type="password"
              className="text-gray-500 mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="text-gray-500 block text-sm font-medium">
              Confirmar contraseña
            </label>
            <input
              type="password"
              className="text-gray-500 mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md border py-2 text-gray-600"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
