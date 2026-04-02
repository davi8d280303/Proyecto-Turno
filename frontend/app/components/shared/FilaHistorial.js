'use client';

import { useState } from 'react';
import Badge from '@/components/shared/Badge';

export default function FilaHistorial({ registro, acento = 'teal' }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div>
      {/* Fila principal */}
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left"
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-800 truncate">{registro.usuario}</p>
          <p className="text-xs text-gray-400">
            {registro.id} · {registro.tipo}
            {registro.admin && <span className="ml-1">· {registro.admin}</span>}
          </p>
        </div>
        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-800">
            ${registro.monto.toLocaleString('es-MX')}
          </span>
          <Badge estado={registro.estado} />
          <span className="text-gray-300 text-xs">{expandido ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Detalle expandido */}
      {expandido && (
        <div className="px-5 pb-4 bg-gray-50 border-t border-gray-100">
          <div className="pt-3 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-400 mb-0.5">Fecha solicitud</p>
              <p className="text-gray-700 font-medium">{registro.fechaSolicitud}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-0.5">Fecha resolución</p>
              <p className="text-gray-700 font-medium">{registro.fechaResolucion}</p>
            </div>
            {registro.motivo && (
              <div className="col-span-2">
                <p className="text-gray-400 mb-0.5">Motivo de rechazo</p>
                <p className="text-red-600 font-medium">{registro.motivo}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}