'use client';

import { useState } from 'react';
import Boton from '../shared/Boton';
import Alerta from '../shared/Alerta';
import Badge from '../shared/Badge';

export default function PanelResolucion({
  prestamoId,
  estadoActual,
  onResolver,
}) {
  const [accion, setAccion] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Si ya está resuelto
  if (estadoActual !== 'pendiente') {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center space-y-2">
        <p className="text-sm text-gray-500">
          Esta solicitud ya fue procesada
        </p>
        <Badge estado={estadoActual} />
      </div>
    );
  }

  const handleConfirmar = async () => {
    if (!accion) return;

    if (accion === 'rechazar' && !motivo.trim()) {
      setErrorMsg('Debes indicar el motivo del rechazo');
      return;
    }

    setCargando(true);

    // simular API
    await new Promise((r) => setTimeout(r, 800));

    setCargando(false);

    onResolver(accion, motivo);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h4 className="text-sm font-bold text-gray-700">
        Tomar decisión
      </h4>

      {errorMsg && (
        <Alerta
          tipo="error"
          mensaje={errorMsg}
          onCerrar={() => setErrorMsg(null)}
        />
      )}

      {/* Acciones */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            setAccion('aprobar');
            setErrorMsg(null);
          }}
          className={`py-3 rounded-xl text-sm font-semibold border-2 ${
            accion === 'aprobar'
              ? 'border-green-500 bg-green-50 text-green-700'
              : 'border-gray-200 text-gray-500'
          }`}
        >
          ✓ Aprobar
        </button>

        <button
          onClick={() => {
            setAccion('rechazar');
            setErrorMsg(null);
          }}
          className={`py-3 rounded-xl text-sm font-semibold border-2 ${
            accion === 'rechazar'
              ? 'border-red-500 bg-red-50 text-red-700'
              : 'border-gray-200 text-gray-500'
          }`}
        >
          ✕ Rechazar
        </button>
      </div>

      {/* Motivo */}
      {accion === 'rechazar' && (
        <div>
          <label className="text-xs text-gray-600">
            Motivo del rechazo *
          </label>

          <textarea
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value);
              setErrorMsg(null);
            }}
            rows={3}
            placeholder="Explica el motivo..."
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />
        </div>
      )}

      {/* Confirmar */}
      {accion && (
        <Boton
          variante={accion === 'aprobar' ? 'primario' : 'peligro'}
          cargando={cargando}
          onClick={handleConfirmar}
          className="w-full"
        >
          Confirmar {accion === 'aprobar' ? 'aprobación' : 'rechazo'}
        </Boton>
      )}
    </div>
  );
}