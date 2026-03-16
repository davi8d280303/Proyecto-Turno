import Link from "next/link";

export default function DetalleRecurso({ params }) {
  // Datos de ejemplo
  const data = { 
    nombre: "PROYECTOR EPSON X12", 
    tipo: "PROYECTOR", 
    categoria: "AUDIO/VIDEO", 
    descripcion: "EQUIPO EN BUEN ESTADO, INCLUYE MALETÍN Y CABLES ORIGINALES. LENTE LIMPIO." 
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] p-8">
      <h2 className="font-bold text-2xl mb-6 uppercase text-black tracking-tight">DETALLES DEL RECURSO</h2>

      {/* Bloque Principal Azul (Igual al de Agregar y Lista) */}
      <div className="bg-[#002B49] p-10 max-w-4xl mx-auto shadow-2xl text-white">
        <div className="space-y-8">
          
          {/* Nombre */}
          <div className="border-b border-white/20 pb-2">
            <div className="text-xs font-bold text-gray-400 tracking-widest mb-1 uppercase">Nombre del recurso:</div>
            <div className="text-xl font-semibold text-white uppercase">{data.nombre}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tipo */}
            <div className="border-b border-white/20 pb-2">
              <div className="text-xs font-bold text-gray-400 tracking-widest mb-1 uppercase">Tipo:</div>
              <div className="text-lg text-white uppercase">{data.tipo}</div>
            </div>

            {/* Categoría */}
            <div className="border-b border-white/20 pb-2">
              <div className="text-xs font-bold text-gray-400 tracking-widest mb-1 uppercase">Categoría:</div>
              <div className="text-lg text-white uppercase">{data.categoria}</div>
            </div>
          </div>

          {/* Descripción */}
          <div className="border border-white/20 p-4 rounded-sm bg-white/5">
            <div className="text-xs font-bold text-gray-400 tracking-widest mb-2 uppercase">Descripción:</div>
            <div className="text-sm leading-relaxed text-slate-200">
              {data.descripcion}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-between items-center pt-10">
            <div className="flex gap-8">
              <button className="text-emerald-500 font-black text-xl hover:text-emerald-400 transition-colors tracking-tighter uppercase">
                EDITAR
              </button>
              <button className="text-red-500 font-black text-xl hover:text-red-400 transition-colors tracking-tighter uppercase">
                ELIMINAR
              </button>
            </div>

            <Link 
              href="/recursos" 
              className="text-white/60 font-bold hover:text-white transition-colors uppercase tracking-widest text-sm border-b border-white/20 pb-1"
            >
              ← Volver
            </Link>
          </div>

        </div>
      </div>

      <p className="text-center text-gray-400 text-[10px] mt-12 tracking-widest uppercase">
        Vista de Detalle • Sistema de Inventario
      </p>
    </div>
  );
}