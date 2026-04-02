'use client';

export default function FiltroBusqueda({
  busqueda,
  onBusqueda,
  placeholder = 'Buscar...',
  opciones,
  filtroActivo,
  onFiltro,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Input de búsqueda */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Filtros de estado */}
      {opciones && onFiltro && (
        <div className="flex gap-2 flex-wrap">
          {opciones.map((op) => (
            <button
              key={op}
              onClick={() => onFiltro(op)}
              className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition border ${
                filtroActivo === op
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {op}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}