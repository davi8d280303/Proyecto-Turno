'use client';

export default function SinResultados({
  mensaje = 'No hay elementos para mostrar',
  icono = '📭',
  accion,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-4xl mb-3">{icono}</span>
      <p className="text-sm text-gray-500 mb-4">{mensaje}</p>
      {accion && (
        <button
          onClick={accion.onClick}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          {accion.label}
        </button>
      )}
    </div>
  );
}