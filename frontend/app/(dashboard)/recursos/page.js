import Link from "next/link";

export default function RecursosPage() {
  const demo = [
    { id: "1", nombre: "Proyector Epson X12", tipo: "Proyector", fecha: "2024-04-01" },
    { id: "2", nombre: "Laptop Dell Inspiron", tipo: "Laptop", fecha: "2024-02-10" },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Título y Buscador superior */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-bold text-2xl text-black uppercase tracking-tight">LISTA DE RECURSOS</h2>
        <div className="relative w-80">
          <input 
            className="w-full border-2 border-gray-300 rounded px-3 py-1 outline-none focus:border-[#002B49]" 
            placeholder="" 
          />
          <span className="absolute right-2 top-1 text-gray-400 font-bold text-xl">🔍</span>
        </div>
      </div>

      {/* Tabla con diseño de bloques oscuros */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-white text-xs uppercase tracking-widest">
              <th className="bg-[#002B49] p-4 font-bold border-r border-gray-500/30">Nombre</th>
              <th className="bg-[#002B49] p-4 font-bold border-r border-gray-500/30">Tipo</th>
              <th className="bg-[#002B49] p-4 font-bold border-r border-gray-500/30">Fecha de Creación</th>
              <th className="bg-[#002B49] p-4 font-bold border-r border-gray-500/30"></th>
              <th className="bg-[#002B49] p-4 font-bold border-r border-gray-500/30"></th>
              <th className="bg-[#002B49] p-4 font-bold"></th>
            </tr>
          </thead>

          <tbody>
            {demo.map(r => (
              <tr key={r.id} className="text-white text-xs text-center uppercase">
                <td className="bg-[#002B49] p-5 border-r border-gray-600/50">{r.nombre}</td>
                <td className="bg-[#002B49] p-5 border-r border-gray-600/50">{r.tipo}</td>
                <td className="bg-[#002B49] p-5 border-r border-gray-600/50">{r.fecha}</td>
                
                {/* Acciones con los colores del diseño */}
                <td className="bg-[#002B49] p-5 border-r border-gray-600/50">
                  <Link href={`/recursos/${r.id}`} className="hover:text-gray-300 transition-colors">
                    VER
                  </Link>
                </td>
                <td className="bg-[#002B49] p-5 border-r border-gray-600/50">
                  <button className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors">
                    EDITAR
                  </button>
                </td>
                <td className="bg-[#002B49] p-5">
                  <button className="text-red-500 font-bold hover:text-red-400 transition-colors">
                    ELIMINAR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botón AGREGAR+ abajo a la derecha */}
      <div className="mt-8 flex justify-end">
        <Link href="/recursos/nuevo" className="bg-[#002B49] text-white px-6 py-2 font-bold shadow-lg hover:bg-slate-800 transition-all uppercase text-sm">
          AGREGAR+
        </Link>
      </div>
    </div>
  );
}