'use client';

import Link from 'next/link';

export default function NavItem({
  href,
  label,
  icon,
  activo,
  colapsado = false,
  estiloActivo  = 'bg-white/15 text-white',
  estiloInactivo = 'text-white/60 hover:bg-white/10 hover:text-white',
}) {
  return (
    <Link
      href={href}
      title={colapsado ? label : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
        activo ? estiloActivo : estiloInactivo
      } ${colapsado ? 'justify-center' : ''}`}
    >
      <span className="text-base flex-shrink-0">{icon}</span>
      {!colapsado && <span className="truncate">{label}</span>}
    </Link>
  );
}