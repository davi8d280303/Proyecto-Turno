'use client';

import { useEffect, useState } from 'react';
import { getPrestamos } from '@/lib/api';
import Loader, { SkeletonCard } from '@/app/components/Loader';

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState('');

  // Cargar préstamos al montar el componente (asincronía)
  useEffect(() => {
    const cargarPrestamos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Consumir API del backend
        const resultado = await getPrestamos();

        if (!resultado.success) {
          // Si falla, usar datos de demostración
          console.warn('No se pudo cargar desde API:', resultado.error);
          setPrestamos(DATOS_DEMO);
        } else {
          setPrestamos(resultado.data || DATOS_DEMO);
        }
      } catch (err) {
        console.error('Error cargando préstamos:', err);
        setError(
          'No se pudieron cargar los préstamos. Mostrando demostración.'
        );
        setPrestamos(DATOS_DEMO);
      } finally {
        setIsLoading(false);
      }
    };

    cargarPrestamos();
  }, []);

  // Filtrar préstamos según búsqueda (no asincrónico, solo filtrado)
  const prestamosFiltrados = prestamos.filter(
    (item) =>
      (item.equipo || item.equipment || '').toLowerCase().includes(filtro.toLowerCase()) ||
      (item.ubicacion || item.location || '').toLowerCase().includes(filtro.toLowerCase())
  );

  // Manejar cambio de filtro
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Barra de navegación superior (Header) */}
      <header className="bg-[#002B49] text-white p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="border border-white p-1 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
          </div>
          <span className="font-bold">Mis Préstamos</span>
        </div>
        <div className="flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <div className="bg-gray-400 rounded p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#002B49]"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </header>

      {/* Cuerpo de la página */}
      <main className="max-w-4xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Mis Préstamos</h2>

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

        {/* Buscador */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar equipo o ubicación..."
            value={filtro}
            onChange={handleFiltroChange}
            disabled={isLoading}
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-1 focus:ring-blue-500
                       disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Buscar préstamos"
          />
        </div>

        {/* Estado de carga */}
        {isLoading ? (
          <SkeletonCard count={3} />
        ) : prestamosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {filtro
                ? 'No se encontraron préstamos que coincidan con tu búsqueda'
                : 'No hay préstamos para mostrar'}
            </p>
          </div>
        ) : (
          <>
            {/* Lista de Tarjetas */}
            <div className="space-y-4" role="list" aria-label="Lista de préstamos">
              {prestamosFiltrados.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  role="listitem"
                >
                  {/* Cabecera de la tarjeta */}
                  <div className="bg-[#AAB8C2] p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-10 bg-gray-300 rounded flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-500"
                        >
                          <rect width="18" height="12" x="3" y="4" rx="2" ry="2" />
                          <line x1="3" x2="21" y1="16" y2="16" />
                          <line x1="9" x2="15" y1="16" y2="16" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">
                          {item.equipo || item.equipment || 'No especificado'}
                        </h3>
                        <p className="text-sm opacity-90">
                          {item.ubicacion || item.location || 'Ubicación desconocida'}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`${item.colorEstado || 'bg-[#002B49]'} text-xs px-3 py-1 rounded-full flex items-center gap-2`}
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      {item.estado || item.status || 'Desconocido'}
                    </span>
                  </div>

                  {/* Info inferior de la tarjeta */}
                  <div className="p-4 grid grid-cols-2 text-sm text-gray-600">
                    <div className="border-r border-gray-200 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                      <span>
                        Prestado el{' '}
                        <span className="font-semibold">
                          {item.fecha || item.date || 'N/A'}
                        </span>
                      </span>
                    </div>
                    <div className="pl-4 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <polyline points="16 11 18 13 22 9" />
                      </svg>
                      <span>
                        Autorizado por:{' '}
                        <span className="font-semibold">
                          {item.autorizado || item.authorizedBy || 'N/A'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Información de resultados */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-600">
              <p>
                Mostrando <strong>{prestamosFiltrados.length}</strong> de{' '}
                <strong>{prestamos.length}</strong> préstamos
              </p>
            </div>
          </>
        )}

        {/* Botón Solicitar */}
        <div className="mt-8 flex justify-center">
          <button
            className="bg-[#002B49] text-white px-10 py-3 rounded-md font-bold 
                       hover:bg-opacity-90 transition-all 
                       disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isLoading}
            aria-label="Solicitar nuevo préstamo"
          >
            {isLoading ? 'Cargando...' : 'Solicitar nuevo préstamo'}
          </button>
        </div>
      </main>
    </div>
  );
}

// Datos de demostración si la API falla
const DATOS_DEMO = [
  {
    id: 1,
    equipo: 'Proyector Epson',
    ubicacion: 'Laboratorio 2',
    estado: 'En uso',
    colorEstado: 'bg-[#002B49]',
    fecha: '24 abril 2024',
    autorizado: 'Juan Pérez',
  },
  {
    id: 2,
    equipo: 'Laptop Lenovo',
    ubicacion: 'Sala de Juntas',
    estado: 'Retrasado',
    colorEstado: 'bg-[#7F1D1D]',
    fecha: '22 abril 2024',
    autorizado: 'María Gómez',
  },
  {
    id: 3,
    equipo: 'Micrófonos Inalámbricos',
    ubicacion: 'Auditorio',
    estado: 'Disponible',
    colorEstado: 'bg-[#065F46]',
    fecha: '20 abril 2024',
    autorizado: 'José Martínez',
  },
];
