'use client';

// Estilos por estado
const ESTILOS = {
  aprobado:   'bg-green-100 text-green-800',
  pendiente:  'bg-yellow-100 text-yellow-800',
  rechazado:  'bg-red-100 text-red-800',
  activo:     'bg-blue-100 text-blue-800',
  inactivo:   'bg-gray-100 text-gray-500',
  suspendido: 'bg-orange-100 text-orange-700',
};

export default function Badge({ estado, className = '' }) {
  const base = ESTILOS[estado] ?? 'bg-gray-100 text-gray-600';

  return (
    <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium capitalize ${base} ${className}`}>
      {estado}
    </span>
  );
}