"use client";

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Aquí podrías reportar el error a un servicio de log
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-rose-50 p-5">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center" role="alert">
        <div className="text-6xl mb-4">☁️</div>
        <h1 
          className="text-3xl font-bold text-slate-800 mb-4" 
          aria-live="assertive"
        >
          ¡Algo salió mal! ERROR 500
        </h1>
        <p className="text-slate-600 mb-8">
          Estamos teniendo algunas dificultades técnicas temporales. 
          Ya estamos trabajando para que todo vuelva a la normalidad.
        </p>
        <button 
          onClick={() => reset()}
          className="inline-block w-full py-3 px-6 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-rose-200 outline-none"
        >
          Reintentar ahora
        </button>
      </div>
    </div>
  );
}