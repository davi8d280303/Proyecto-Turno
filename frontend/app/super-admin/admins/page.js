'use client';

import { useState } from 'react';

const ADMINS_INICIALES = [
  { id: 'A-01', nombre: 'Admin Ruiz',   email: 'ruiz@sistema.com',   estado: 'activo',   prestamosGestionados: 43, fechaCreacion: '10 ene 2026' },
  { id: 'A-02', nombre: 'Admin Torres', email: 'torres@sistema.com', estado: 'activo',   prestamosGestionados: 31, fechaCreacion: '15 ene 2026' },
  { id: 'A-03', nombre: 'Admin López',  email: 'lopez@sistema.com',  estado: 'inactivo', prestamosGestionados: 12, fechaCreacion: '20 ene 2026' },
];

export default function AdminsPage() {
  const [admins,    setAdmins]    = useState(ADMINS_INICIALES);
  const [modal,     setModal]     = useState(false);
  const [confirmar, setConfirmar] = useState(null);
  const [form,      setForm]      = useState({ nombre: '', email: '', password: '' });
  const [error,     setError]     = useState(null);
  const [exito,     setExito]     = useState(null);

  const handleCrear = () => {
    setError(null);
    if (!form.nombre || !form.email || !form.password) { setError('Completa todos los campos'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) { setError('Correo inválido'); return; }
    if (admins.some((a) => a.email === form.email)) { setError('Ese correo ya está registrado'); return; }

    const nuevo = {
      id: `A-0${admins.length + 1}`,
      nombre: form.nombre, email: form.email,
      estado: 'activo', prestamosGestionados: 0,
      fechaCreacion: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setAdmins([...admins, nuevo]);
    setForm({ nombre: '', email: '', password: '' });
    setModal(false);
    setExito(`Admin "${nuevo.nombre}" creado correctamente`);
    setTimeout(() => setExito(null), 3000);
  };

  const handleEliminar = (id) => {
    setAdmins(admins.filter((a) => a.id !== id));
    setConfirmar(null);
    setExito('Admin eliminado del sistema');
    setTimeout(() => setExito(null), 3000);
  };

  const toggleEstado = (id) => {
    setAdmins(admins.map((a) => a.id === id ? { ...a, estado: a.estado === 'activo' ? 'inactivo' : 'activo' } : a));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de admins</h2>
          <p className="text-sm text-gray-500 mt-1">Crea, activa o elimina administradores</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-800 transition">
          + Nuevo admin
        </button>
      </div>

      {exito && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">✓ {exito}</div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total admins', valor: admins.length,                                    color: 'text-purple-700' },
          { label: 'Activos',      valor: admins.filter(a => a.estado === 'activo').length,  color: 'text-green-700'  },
          { label: 'Inactivos',    valor: admins.filter(a => a.estado === 'inactivo').length, color: 'text-gray-500'   },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className={`text-2xl font-bold ${m.color}`}>{m.valor}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
        {admins.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {a.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{a.nombre}</p>
                <p className="text-xs text-gray-400">{a.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.prestamosGestionados} préstamos · desde {a.fechaCreacion}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${a.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {a.estado}
              </span>
              <button onClick={() => toggleEstado(a.id)} className="text-xs text-blue-600 hover:underline">
                {a.estado === 'activo' ? 'Desactivar' : 'Activar'}
              </button>
              <button onClick={() => setConfirmar(a.id)} className="text-xs text-red-500 hover:text-red-700 hover:underline">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal crear */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800">Nuevo administrador</h3>
              <button onClick={() => { setModal(false); setError(null); }} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
            <div className="space-y-4">
              {[
                { label: 'Nombre completo', name: 'nombre', type: 'text',     placeholder: 'Nombre del admin'   },
                { label: 'Correo',          name: 'email',  type: 'email',    placeholder: 'admin@sistema.com'  },
                { label: 'Contraseña',      name: 'password', type: 'password', placeholder: 'Mínimo 6 caracteres' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.name]}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setModal(false); setError(null); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={handleCrear}
                className="flex-1 py-2.5 rounded-xl bg-purple-700 text-white text-sm font-semibold hover:bg-purple-800 transition">Crear admin</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminar */}
      {confirmar && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">¿Eliminar admin?</h3>
            <p className="text-sm text-gray-500 mb-6">Esta acción no se puede deshacer. El admin perderá acceso inmediatamente.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmar(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">Cancelar</button>
              <button onClick={() => handleEliminar(confirmar)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}