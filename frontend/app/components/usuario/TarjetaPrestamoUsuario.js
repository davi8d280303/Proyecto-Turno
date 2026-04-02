'use client';

import { useState } from 'react';
import Badge from '@/components/shared/Badge';

export default function TarjetaPrestamoUsuario({ prestamo }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Fila principal — clickeable para expandir */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left"
      >
        <div>
          <p className="text-sm font-semibold text-gray-800">{prestamo.tipo}</p>
          <p className="text-xs text-gray-400 mt-0.5">{prestamo.id} · {prestamo.fecha}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-800">
            ${prestamo.monto.toLocaleString('es-MX')}
          </span>
          <Badge estado={prestamo.estado} />
          <span className="text-gray-300 text-xs">{expandido ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Detalle expandido */}
      {expandido && (
        <div className="px-5 pb-5 bg-gray-50 border-t border-gray-100">
          <div className="pt-3 space-y-3">
            {/* Descripción */}
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Descripción</p>
              <p className="text-sm text-gray-700">{prestamo.descripcion}</p>
            </div>

            {/* Motivo de rechazo */}
            {prestamo.motivoRechazo && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-xs text-red-400 mb-0.5">Motivo de rechazo</p>
                <p className="text-sm font-medium text-red-600">{prestamo.motivoRechazo}</p>
              </div>
            )}

            {/* Aviso pendiente */}
            {prestamo.estado === 'pendiente' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
                <p className="text-xs text-yellow-700">
                  ⏳ Tu solicitud está siendo revisada por el administrador. Recibirás una respuesta en 24–48 hrs.
                </p>
              </div>
            )}

            {/* Aviso aprobado */}
            {prestamo.estado === 'aprobado' && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <p className="text-xs text-green-700">
                  ✓ Préstamo aprobado. Contacta a tu administrador para los siguientes pasos.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}