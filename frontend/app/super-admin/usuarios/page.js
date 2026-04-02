'use client';

import { useState } from 'react';

const USUARIOS_INICIALES = [
  { id: 'U-01', nombre: 'Carlos Mendoza',  email: 'carlos@mail.com', prestamos: 3, montoTotal: 17500, estado: 'activo',     fechaRegistro: '05 ene 2026' },
  { id: 'U-02', nombre: 'Laura Jiménez',   email: 'laura@mail.com',  prestamos: 2, montoTotal: 6400,  estado: 'activo',     fechaRegistro: '10 ene 2026' },
  { id: 'U-03', nombre: 'Miguel Ríos',     email: 'miguel@mail.com', prestamos: 1, montoTotal: 12000, estado: 'suspendido', fechaRegistro: '12 ene 2026' },
  { id: 'U-04', nombre: 'Sofía Castillo',  email: 'sofia@mail.com',  prestamos: 4, montoTotal: 22000, estado: 'activo',     fechaRegistro: '15 ene 2026' },
  { id: 'U-05', nombre: 'Diego Herrera',   email: 'diego@mail.com',  prestamos: 2, montoTotal: 4500,  estado: 'activo',     fechaRegistro: '20 ene 2026' },
  { id: 'U-06', nombre: 'Ana González',    email: 'ana@mail.com',    prestamos: 5, montoTotal: 31000, estado: 'activo',     fechaRegistro: '22 ene 2026' },
  { id: 'U-07', nombre: 'Pedro Salinas',   email: 'pedro@mail.com',  prestamos: 1, montoTotal: 4500,  estado: 'suspendido', fechaRegistro: '25 ene 2026' },
  { id: 'U-08', nombre: 'Valeria Reyes',   email: 'vale@mail.com',   prestamos: 3, montoTotal: 18000, estado: 'activo',     fechaRegistro: '28 ene 2026' },
];

export default function SuperAdminUsuarios() {
  const [lista,    setLista]    = useState(USUARIOS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [filtro,   setFiltro]   = useState('todos');
  const [exito,    setExito]    = useState(null);

  const filtrados = lista.filter((u) => {
    const okEstado   = filtro === 'todos' || u.estado === filtro;
    const okBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase())
      || u.email.toLowerCase().includes(busqueda.toLowerCase());
    return okEstado && okBusqueda;
  });

  const toggleEstado = (id) => {
    const user   = lista.find((u) => u.id === id);
    const nuevo  = user?.estado === 'activo' ? 'suspendido' : 'activo';
    setLista(lista.map((u) => u.id === id ? { ...u, estado: nuevo } : u));
    setExito(`Usuario ${user?.nombre} cambiado a ${nuevo}`);
    setTimeout(() => setExito(null), 3000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Usuarios registrados</h2>
        <p className="text-sm text-gray-500 mt-1">Todos los usuarios del sistema</p>
      </div>

      {exito && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">✓ {exito}</div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',       valor: lista.length,                                     color: 'text-purple-700' },
          { label: 'Activos',     valor: lista.filter(u => u.estado === 'activo').length,  color: 'text-green-700'  },
          { label: 'Suspendidos', valor: lista.filter(u => u.estado === 'suspendido').length, color: 'text-red-600' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-2xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500">{m.label}</p>
            <p className={`text-2xl font-bold ${m.color}`}>{m.valor}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input type="text" placeholder="Buscar por nombre o correo..."
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
        <div className="flex gap-2">
          {['todos', 'activo', 'suspendido'].map((f) => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition
                ${filtro === f ? 'bg-purple-700 text-white border-purple-700' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Usuario</th>
              <th className="px-4 py-3 text-left">Préstamos</th>
              <th className="px-4 py-3 text-left">Monto total</th>
              <th className="px-4 py-3 text-left">Registro</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtrados.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No hay usuarios con ese filtro</td></tr>
            ) : filtrados.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {u.nombre.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{u.nombre}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{u.prestamos}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">${u.montoTotal.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{u.fechaRegistro}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.estado}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleEstado(u.id)}
                    className={`text-xs font-medium hover:underline ${u.estado === 'activo' ? 'text-red-500' : 'text-green-600'}`}>
                    {u.estado === 'activo' ? 'Suspender' : 'Activar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Mostrando {filtrados.length} de {lista.length} usuarios
        </div>
      </div>
    </div>
  );
}