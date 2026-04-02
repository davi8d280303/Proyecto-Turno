'use client';

const ESTADOS = ['todos', 'aprobado', 'rechazado'];

export default function FiltrosHistorialSuperAdmin({
  busqueda,
  onBusqueda,
  filtroAdmin,
  onFiltroAdmin,
  filtroEstado,
  onFiltroEstado,
  admins,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Búsqueda */}
      <div className="relative flex-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onBusqueda(e.target.value)}
          placeholder="Buscar usuario o ID..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
        />
      </div>

      {/* Selector de admin */}
      <select
        value={filtroAdmin}
        onChange={(e) => onFiltroAdmin(e.target.value)}
        className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
      >
        {admins.map((a) => <option key={a}>{a}</option>)}
      </select>

      {/* Filtro de estado */}
      <div className="flex gap-2">
        {ESTADOS.map((e) => (
          <button
            key={e}
            onClick={() => onFiltroEstado(e)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border capitalize transition ${
              filtroEstado === e
                ? 'bg-purple-700 text-white border-purple-700'
                : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
            }`}
          >
            {e}
          </button>
        ))}
      </div>
    </div>
  );
}