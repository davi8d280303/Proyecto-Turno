'use client';

const VARIANTES = {
  primario:   'bg-blue-600 text-white hover:bg-blue-700 border-transparent',
  secundario: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200',
  peligro:    'bg-red-600 text-white hover:bg-red-700 border-transparent',
  ghost:      'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent',
};

export default function Boton({
  variante = 'primario',
  cargando = false,
  icono,
  children,
  className = '',
  disabled,
  ...props
}) {
  const estiloBase =
    'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      disabled={disabled || cargando}
      className={`${estiloBase} ${VARIANTES[variante]} ${className}`}
      {...props}
    >
      {cargando ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icono ? (
        <span>{icono}</span>
      ) : null}
      {children}
    </button>
  );
}