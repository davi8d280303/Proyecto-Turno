'use client';
import Link from 'next/link';

export default function AdminConfig() {
  return (
    <div className="min-h-screen bg-[#e5e5e5] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <h2 className="font-bold text-2xl uppercase text-black tracking-tight">AJUSTES DEL SISTEMA</h2>
          <Link href="/dashboard/panel" className="text-xs font-bold text-gray-500 hover:text-black uppercase border-b border-gray-400">← Volver al Panel</Link>
        </div>

        <div className="bg-[#002B49] p-12 shadow-2xl text-white text-center">
          <div className="border-2 border-dashed border-white/20 py-20 rounded-lg">
            <p className="text-3xl font-light tracking-[0.2em] mb-4 text-slate-300">CONFIGURACIÓN GENERAL</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Parámetros de base de datos y sistema</p>
          </div>
        </div>
      </div>
    </div>
  );
}