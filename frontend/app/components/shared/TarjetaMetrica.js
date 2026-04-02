'use client';

import Link from 'next/link';

function Contenido({ label, valor, color = 'text-gray-800', icono }) {
  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-500">{label}</p>
        {icono && <span className="text-lg">{icono}</span>}
      </div>
      <p className={`text-3xl font-bold ${color}`}>
        {typeof valor === 'number' ? valor.toLocaleString('es-MX') : valor}
      </p>
    </>
  );
}

export default function TarjetaMetrica({ href, ...props }) {
  const base = 'bg-white rounded-2xl border border-gray-200 p-5 transition';

  if (href) {
    return (
      <Link href={href} className={`${base} hover:shadow-md group block`}>
        <Contenido {...props} />
      </Link>
    );
  }

  return (
    <div className={base}>
      <Contenido {...props} />
    </div>
  );
}