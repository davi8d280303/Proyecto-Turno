"use client";
import { useRouter } from "next/navigation";

export default function NuevoRecurso() {
  const router = useRouter();

  function onSubmit(e) {
    e.preventDefault();
    // Simulamos el guardado y volvemos a la lista
    router.push("/recursos");
  }

  return (
    <div className="min-h-screen bg-[#e5e5e5] p-8">
      <h2 className="font-bold text-2xl mb-6 uppercase text-black">AGREGAR NUEVO RECURSO</h2>

      {/* Contenedor Principal Azul Marino */}
      <form 
        onSubmit={onSubmit} 
        className="bg-[#002B49] p-10 max-w-4xl mx-auto shadow-2xl text-white"
      >
        <div className="space-y-8">
          
          {/* Nombre del Recurso */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold tracking-widest uppercase">NOMBRE DEL RECURSO:</label>
            <input 
              type="text"
              className="bg-transparent border-b border-white outline-none p-1 w-full text-white placeholder:text-white/20" 
              placeholder="Ej. Proyector Epson X12"
              required 
            />
          </div>

          {/* Tipo (Ahora cuadro de texto) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold tracking-widest uppercase">TIPO:</label>
            <input 
              type="text"
              className="bg-transparent border-b border-white outline-none p-1 w-full text-white placeholder:text-white/20" 
              placeholder="Ej. Multimedia"
              required 
            />
          </div>

          {/* Categoría (Ahora cuadro de texto) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold tracking-widest uppercase">CATEGORÍA:</label>
            <input 
              type="text"
              className="bg-transparent border-b border-white outline-none p-1 w-full text-white placeholder:text-white/20" 
              placeholder="Ej. Equipo de oficina"
              required 
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold uppercase tracking-wider uppercase">DESCRIPCIÓN:</label>
            <textarea 
              className="bg-transparent border border-white/30 p-3 h-32 outline-none rounded-sm text-white resize-none" 
              placeholder="Detalles adicionales..."
              required
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-between items-center pt-10 font-bold">
            <button 
              type="submit" 
              className="text-emerald-500 text-xl hover:text-emerald-400 transition-colors tracking-tighter"
            >
              GUARDAR
            </button>
            <button 
              type="button" 
              onClick={() => router.back()} 
              className="text-red-500 text-xl hover:text-red-400 transition-colors tracking-tighter"
            >
              CANCELAR
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}