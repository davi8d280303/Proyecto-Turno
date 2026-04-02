'use client';

const ESTILOS = {
  exito:       'bg-green-50 border-green-200 text-green-700',
  error:       'bg-red-50 border-red-200 text-red-700',
  advertencia: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info:        'bg-blue-50 border-blue-200 text-blue-700',
};

const ICONOS = {
  exito:       '✓',
  error:       '✕',
  advertencia: '⚠️',
  info:        'ℹ️',
};

export default function Alerta({ tipo = 'exito', mensaje, onCerrar }) {
  return (
    <div
      className={`flex items-start justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
        ESTILOS[tipo]
      }`}
    >
      <span>
        {ICONOS[tipo]} {mensaje}
      </span>

      {onCerrar && (
        <button
          onClick={onCerrar}
          className="opacity-60 hover:opacity-100 transition text-base leading-none mt-0.5"
        >
          ✕
        </button>
      )}
    </div>
  );
}