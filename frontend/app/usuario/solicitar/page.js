'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const TIPOS = ['Personal', 'Educativo', 'Negocio', 'Emergencia', 'Otro'];

export default function SolicitarPrestamo() {
  const router = useRouter();
  const [form,     setForm]     = useState({ tipo: '', monto: '', descripcion: '' });
  const [error,    setError]    = useState(null);
  const [enviado,  setEnviado]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.tipo)        { setError('Selecciona un tipo de préstamo'); return; }
    if (!form.monto || isNaN(form.monto) || Number(form.monto) <= 0)
                           { setError('Ingresa un monto válido mayor a 0'); return; }
    if (!form.descripcion.trim()) { setError('Describe el motivo de tu solicitud'); return; }
    if (form.descripcion.trim().length < 10) { setError('La descripción debe tener al menos 10 caracteres'); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Solicitud enviada!</h2>
        <p className="text-gray-500 text-sm mb-2">
          Tu solicitud de <span className="font-semibold">${Number(form.monto).toLocaleString()}</span> fue recibida.
        </p>
        <p className="text-gray-400 text-xs mb-8">Un administrador la revisará en las próximas 24–48 horas.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setEnviado(false); setForm({ tipo: '', monto: '', descripcion: '' }); }}
            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
            Nueva solicitud
          </button>
          <button onClick={() => router.push('/usuario/mis-prestamos')}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
            Ver mis préstamos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Solicitar préstamo</h2>
        <p className="text-sm text-gray-500 mt-1">Completa el formulario y un admin lo revisará pronto</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de préstamo</label>
          <div className="grid grid-cols-3 gap-2">
            {TIPOS.map((t) => (
              <button type="button" key={t} onClick={() => setForm({ ...form, tipo: t })}
                className={`py-2 rounded-xl text-xs font-medium border transition
                  ${form.tipo === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Monto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monto solicitado</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
            <input type="number" name="monto" value={form.monto} onChange={handleChange}
              placeholder="0.00" min="1"
              className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          {form.monto > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              ${Number(form.monto).toLocaleString()} pesos
            </p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo o descripción</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
            rows={4} placeholder="Explica brevemente para qué necesitas el préstamo..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-xs text-gray-400 mt-1 text-right">{form.descripcion.length} caracteres</p>
        </div>

        {/* Resumen */}
        {form.tipo && form.monto > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm">
            <p className="text-blue-800 font-medium">Resumen de tu solicitud</p>
            <p className="text-blue-700 text-xs mt-1">
              Tipo: <span className="font-semibold">{form.tipo}</span> ·
              Monto: <span className="font-semibold">${Number(form.monto).toLocaleString()}</span>
            </p>
          </div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 text-sm">
          {loading ? 'Enviando solicitud...' : 'Enviar solicitud'}
        </button>
      </form>
    </div>
  );
}