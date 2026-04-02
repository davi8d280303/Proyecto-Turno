'use client';

import { useState } from 'react';
import Boton from '@/components/shared/Boton';
import Alerta from '@/components/shared/Alerta';

const TIPOS = ['Personal', 'Educativo', 'Negocio', 'Emergencia', 'Otro'];

export default function FormSolicitud({ onEnviado }) {
  const [form, setForm] = useState({ tipo: '', monto: '', descripcion: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!form.tipo) {
      setError('Selecciona un tipo de préstamo');
      return;
    }
    if (!form.monto || isNaN(Number(form.monto)) || Number(form.monto) <= 0) {
      setError('Ingresa un monto válido mayor a $0');
      return;
    }
    if (!form.descripcion.trim()) {
      setError('Describe el motivo de tu solicitud');
      return;
    }
    if (form.descripcion.trim().length < 10) {
      setError('La descripción debe tener al menos 10 caracteres');
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onEnviado(form);
  };

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {error && <Alerta tipo="error" mensaje={error} onCerrar={() => setError(null)} />}

      {/* Tipo */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Tipo de préstamo <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {TIPOS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setForm({ ...form, tipo: t }); setError(null); }}
              className={`py-2.5 rounded-xl text-xs font-medium border-2 transition ${
                form.tipo === t
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-blue-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Monto */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Monto solicitado (MXN) <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
          <input
            name="monto"
            type="number"
            min="1"
            value={form.monto}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {form.monto && !isNaN(Number(form.monto)) && Number(form.monto) > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            ${Number(form.monto).toLocaleString('es-MX')} MXN
          </p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          Motivo de la solicitud <span className="text-red-400">*</span>
        </label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          rows={4}
          placeholder="Describe brevemente para qué necesitas el préstamo (mínimo 10 caracteres)..."
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className={`text-xs mt-1 ${form.descripcion.length < 10 && form.descripcion.length > 0 ? 'text-red-400' : 'text-gray-400'}`}>
          {form.descripcion.length} / 10 mínimo
        </p>
      </div>

      <Boton variante="primario" cargando={loading} onClick={handleSubmit} className="w-full justify-center py-3">
        Enviar solicitud
      </Boton>

      <p className="text-xs text-center text-gray-400">
        Un administrador revisará tu solicitud en 24–48 horas hábiles.
      </p>
    </div>
  );
}