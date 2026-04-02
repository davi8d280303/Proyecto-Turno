'use client';

import Link from 'next/link';
import Badge from '../shared/Badge';

export default function TarjetaPrestamoAdmin({
  prestamo,
  rutaBase = '/admin/prestamos',
}) {
  const urgente = (prestamo?.dias ?? 0) >= 2;

  return (
    <div
      className={`bg-white rounded-2xl border p-5 flex flex-col gap-3 transition hover:shadow-sm ${
        urgente ? 'border-yellow-300' : 'border-gray-200'
      }`}
    >
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {prestamo.usuario}
          </p>
          <p className="text-xs text-gray-400">
            {prestamo.id} · {prestamo.fecha}
          </p>
        </div>

        <Badge estado={prestamo.estado} />
      </div>

      {/* Monto + tipo */}
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs text-gray-400">Monto</p>
          <p className="text-lg font-bold text-gray-800">
            ${prestamo.monto.toLocaleString('es-MX')}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">Tipo</p>
          <p className="text-sm text-gray-700">
            {prestamo.tipo}
          </p>
        </div>

        {urgente && (
          <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
            {prestamo.dias}d sin revisar
          </span>
        )}
      </div>

      {/* Acción */}
      {prestamo.estado === 'pendiente' && (
        <Link
          href={`${rutaBase}/${prestamo.id}`}
          className="w-full text-center py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
        >
          Revisar solicitud →
        </Link>
      )}
    </div>
  );
}