'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

const PRESTAMOS_DB = {
  'P-092': { id: 'P-092', usuario: 'Laura Jiménez',  email: 'laura@mail.com',  monto: 3200,  tipo: 'Educación',  estado: 'pendiente', fecha: '30 mar 2026', descripcion: 'Necesito financiar mi posgrado en administración.' },
  'P-095': { id: 'P-095', usuario: 'Diego Herrera',  email: 'diego@mail.com',  monto: 2000,  tipo: 'Emergencia', estado: 'pendiente', fecha: '31 mar 2026', descripcion: 'Gastos médicos urgentes no cubiertos por seguro.' },
  'P-099': { id: 'P-099', usuario: 'Diana Flores',   email: 'diana@mail.com',  monto: 5500,  tipo: 'Personal',   estado: 'pendiente', fecha: '01 abr 2026', descripcion: 'Remodelación de vivienda principal.' },
  'P-091': { id: 'P-091', usuario: 'Carlos Mendoza', email: 'carlos@mail.com', monto: 8500,  tipo: 'Personal',   estado: 'aprobado',  fecha: '28 mar 2026', descripcion: 'Capital de trabajo para negocio familiar.' },
  'P-093': { id: 'P-093', usuario: 'Miguel Ríos',    email: 'miguel@mail.com', monto: 12000, tipo: 'Negocio',    estado: 'rechazado', fecha: '29 mar 2026', descripcion: 'Expansión de negocio de distribución.' },
};

const ESTADO_STYLES = { aprobado: 'bg-green-100 text-green-800', pendiente: 'bg-yellow-100 text-yellow-800', rechazado: 'bg-red-100 text-red-800' };

export default function DetallePrestamo() {
  const router = useRouter();
  const { id } = useParams();

  const [prestamo, setPrestamo] = useState(PRESTAMOS_DB[id] ?? null);
  const [motivo,   setMotivo]   = useState('');
  const [accion,   setAccion]   = useState(null); // 'aprobar' | 'rechazar'
  const [resuelto, setResuelto] = useState(false);

  if (!prestamo) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Préstamo no encontrado</p>
        <button onClick={() => router.back()} className="mt-4 text-blue-600 hover:underline text-sm">← Volver</button>
      </div>
    );
  }

  const handleResolver = () => {
    if (accion === 'rechazar' && !motivo.trim()) return;
    setPrestamo({ ...prestamo, estado: accion === 'aprobar' ? 'aprobado' : 'rechazado' });
    setResuelto(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Volver */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition">
        ← Volver a préstamos
      </button>

      {/* Cabecera */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{prestamo.usuario}</h2>
            <p className="text-sm text-gray-400 mt-0.5">{prestamo.email}</p>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${ESTADO_STYLES[prestamo.estado]}`}>
            {prestamo.estado}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'ID préstamo',   valor: prestamo.id    },
            { label: 'Tipo',          valor: prestamo.tipo  },
            { label: 'Monto',         valor: `$${prestamo.monto.toLocaleString()}` },
            { label: 'Fecha',         valor: prestamo.fecha },
          ].map((d) => (
            <div key={d.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">{d.label}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">{d.valor}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Descripción del solicitante</p>
          <p className="text-sm text-gray-700">{prestamo.descripcion}</p>
        </div>
      </div>

      {/* Acciones — solo si está pendiente */}
      {prestamo.estado === 'pendiente' && !resuelto && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Tomar decisión</h3>

          <div className="flex gap-3 mb-4">
            <button onClick={() => setAccion('aprobar')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition
                ${accion === 'aprobar' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-green-300'}`}>
              ✓ Aprobar
            </button>
            <button onClick={() => setAccion('rechazar')}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition
                ${accion === 'rechazar' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:border-red-300'}`}>
              ✕ Rechazar
            </button>
          </div>

          {accion === 'rechazar' && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Motivo de rechazo (obligatorio)</label>
              <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3}
                placeholder="Explica el motivo del rechazo..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400" />
            </div>
          )}

          {accion && (
            <button onClick={handleResolver}
              disabled={accion === 'rechazar' && !motivo.trim()}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50
                ${accion === 'aprobar' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}>
              Confirmar {accion === 'aprobar' ? 'aprobación' : 'rechazo'}
            </button>
          )}
        </div>
      )}

      {/* Resultado */}
      {resuelto && (
        <div className={`rounded-2xl border p-6 text-center ${prestamo.estado === 'aprobado' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-lg font-bold ${prestamo.estado === 'aprobado' ? 'text-green-700' : 'text-red-700'}`}>
            {prestamo.estado === 'aprobado' ? '✓ Préstamo aprobado' : '✕ Préstamo rechazado'}
          </p>
          <p className="text-sm text-gray-500 mt-1">La decisión ha sido registrada.</p>
          <button onClick={() => router.push('/admin/prestamos')}
            className="mt-4 text-blue-600 hover:underline text-sm">Volver a la lista</button>
        </div>
      )}
    </div>
  );
}