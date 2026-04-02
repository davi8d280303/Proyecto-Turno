'use client';

import { useState } from 'react';
import Boton from '@/components/shared/Boton';
import Alerta from '@/components/shared/Alerta';

export default function FormCrearAdmin({ onCrear, onCancelar }) {
  const [form,  setForm]  = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [mostrarPass, setMostrarPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = () => {
    const err = onCrear(form);
    if (err) setError(err);
  };

  return (
    <div className="space-y-4">
      {error && <Alerta tipo="error" mensaje={error} onCerrar={() => setError(null)} />}

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Nombre completo</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej. Admin García"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Correo electrónico</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="admin@sistema.com"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Contraseña inicial</label>
        <div className="relative">
          <input
            name="password"
            type={mostrarPass ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={() => setMostrarPass(!mostrarPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
          >
            {mostrarPass ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Boton variante="secundario" onClick={onCancelar} className="flex-1">
          Cancelar
        </Boton>
        <Boton variante="primario" onClick={handleSubmit} className="flex-1"
          style={{ backgroundColor: '#7c3aed' }}
        >
          Crear admin
        </Boton>
      </div>
    </div>
  );
}