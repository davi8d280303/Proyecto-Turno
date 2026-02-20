'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Loader, { SkeletonCard } from '@/app/components/Loader';

export default function RecursosPage() {
  const [recursos, setRecursos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');

  // Cargar recursos al montar el componente (asincronía)
  useEffect(() => {
    const cargarRecursos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simular consumo de API (cuando sea disponible)
        // const resultado = await getRecursos();
        // if (!resultado.success) {
        //   setRecursos(DATOS_DEMO);
        // } else {
        //   setRecursos(resultado.data || DATOS_DEMO);
        // }

        // Por ahora usar datos de demostración
        await new Promise((resolve) => setTimeout(resolve, 600));
        setRecursos(DATOS_DEMO);
      } catch (err) {
        console.error('Error cargando recursos:', err);
        setError('No se pudieron cargar los recursos. Mostrando demostración.');
        setRecursos(DATOS_DEMO);
      } finally {
        setIsLoading(false);
      }
    };

    cargarRecursos();
  }, []);

  // Filtrar recursos según búsqueda (no asincrónico)
  const recursosFiltrados = recursos.filter(
    (item) =>
      (item.nombre || '').toLowerCase().includes(filtro.toLowerCase()) ||
      (item.tipo || '').toLowerCase().includes(filtro.toLowerCase())
  );

  // Manejar cambio de filtro
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  // Manejar eliminación con confirmación
  const handleEliminar = async (id, nombre) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${nombre}"?`)) {
      try {
        // Aquí iría la llamada a la API para eliminar
        // await deleteRecurso(id);
        setRecursos(recursos.filter((r) => r.id !== id));
        alert('Recurso eliminado exitosamente');
      } catch (err) {
        alert('Error al eliminar el recurso: ' + err.message);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Mostrar error si existe */}
      {error && (
        <div
          className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm"
          role="alert"
          aria-live="polite"
        >
          <p className="font-semibold">Aviso:</p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Título y Buscador superior */}
      <div className="flex justify-between items-center mb-8 flex-col gap-4 md:flex-row">
        <h2 className="font-bold text-2xl text-black uppercase tracking-tight">
          LISTA DE RECURSOS
        </h2>
        <div className="relative w-full md:w-80">
          <input
            className="w-full border-2 border-gray-300 rounded px-3 py-1 outline-none focus:border-[#002B49] disabled:opacity-60"
            placeholder="Buscar recurso..."
            value={filtro}
            onChange={handleFiltroChange}
            disabled={isLoading}
            aria-label="Buscar recursos"
          />
          <span className="absolute right-2 top-1 text-gray-400 font-bold text-xl">
            🔍
          </span>
        </div>
      </div>

      {/* Estado de carga */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-200 rounded animate-pulse"
              role="status"
              aria-label="Contenido cargando"
            />
          ))}
        </div>
      ) : recursosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-lg font-semibold">
            {filtro
              ? 'No se encontraron recursos que coincidan con tu búsqueda'
              : 'No hay recursos para mostrar'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {!filtro && (
              <>
                Haz clic en{' '}
                <Link href="/recursos/nuevo" className="text-blue-600 hover:underline">
                  AGREGAR+
                </Link>{' '}
                para crear uno
              </>
            )}
          </p>
        </div>
      ) : (
        <>
          {/* Tabla con diseño de bloques oscuros */}
          <div className="overflow-x-auto">
            <table
              className="w-full border-separate border-spacing-y-2"
              role="grid"
              aria-label="Tabla de recursos"
            >
              <thead>
                <tr className="text-white text-xs uppercase tracking-widest">
                  <th className="bg-[#002B49] p-4 font-bold border-r border-gray-500/30 text-left">
                    Nombre
                  </th>
                  <th className="bg-[#002B49] p-4 font-bold border-r border-gray-500/30 text-left">
                    Tipo
                  </th>
                  <th className="bg-[#002B49] p-4 font-bold border-r border-gray-500/30 text-left">
                    Fecha de Creación
                  </th>
                  <th colSpan="3" className="bg-[#002B49] p-4 font-bold text-center">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {recursosFiltrados.map((r) => (
                  <tr key={r.id} className="text-white text-xs text-center uppercase">
                    <td className="bg-[#002B49] p-5 border-r border-gray-600/50 text-left">
                      {r.nombre}
                    </td>
                    <td className="bg-[#002B49] p-5 border-r border-gray-600/50 text-left">
                      <span className="px-3 py-1 bg-blue-700/50 rounded text-xs">
                        {r.tipo}
                      </span>
                    </td>
                    <td className="bg-[#002B49] p-5 border-r border-gray-600/50 text-left">
                      {r.fecha}
                    </td>

                    {/* Acciones */}
                    <td className="bg-[#002B49] p-5 border-r border-gray-600/50">
                      <Link
                        href={`/recursos/${r.id}`}
                        className="hover:text-gray-300 transition-colors font-semibold"
                        aria-label={`Ver detalles de ${r.nombre}`}
                      >
                        VER
                      </Link>
                    </td>
                    <td className="bg-[#002B49] p-5 border-r border-gray-600/50">
                      <Link
                        href={`/recursos/${r.id}/edit`}
                        className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                        aria-label={`Editar ${r.nombre}`}
                      >
                        EDITAR
                      </Link>
                    </td>
                    <td className="bg-[#002B49] p-5">
                      <button
                        onClick={() => handleEliminar(r.id, r.nombre)}
                        className="text-red-400 font-bold hover:text-red-300 transition-colors cursor-pointer"
                        aria-label={`Eliminar ${r.nombre}`}
                      >
                        ELIMINAR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Información de resultados */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-600">
            <p>
              Mostrando <strong>{recursosFiltrados.length}</strong> de{' '}
              <strong>{recursos.length}</strong> recursos
            </p>
          </div>
        </>
      )}

      {/* Botón AGREGAR+ abajo a la derecha */}
      <div className="mt-8 flex justify-end">
        <Link
          href="/recursos/nuevo"
          className="bg-[#002B49] text-white px-6 py-2 font-bold shadow-lg hover:bg-slate-800 transition-all uppercase text-sm rounded"
          aria-label="Agregar nuevo recurso"
        >
          AGREGAR+
        </Link>
      </div>
    </div>
  );
}

// Datos de demostración
const DATOS_DEMO = [
  {
    id: '1',
    nombre: 'Proyector Epson X12',
    tipo: 'Proyector',
    fecha: '2024-04-01',
  },
  {
    id: '2',
    nombre: 'Laptop Dell Inspiron',
    tipo: 'Laptop',
    fecha: '2024-02-10',
  },
  {
    id: '3',
    nombre: 'Micrófono Shure SM7B',
    tipo: 'Audio',
    fecha: '2024-03-15',
  },
];
