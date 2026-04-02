'use client';

import { useEffect } from 'react';

export default function Modal({ abierto, onCerrar, titulo, children, ancho = 'max-w-md' }) {
  // Cerrar con Escape
  useEffect(() => {
    if (!abierto) return;
    const handler = (e) => {
      if (e.key === 'Escape') onCerrar();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onCerrar}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full ${ancho} p-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">{titulo}</h3>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none transition"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}