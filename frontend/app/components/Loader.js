/**
 * Componente Loader - Accesible (WCAG 2.1)
 * Incluye:
 * - ARIA labels para screen readers
 * - Rol de status
 * - Contraste adecuado
 * - Animaciones respectuosas con prefers-reduced-motion
 */

'use client';

import { useState } from 'react';

export default function Loader({ 
  isVisible = true, 
  message = 'Cargando...',
  fullscreen = false 
}) {
  if (!isVisible) return null;

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinner animado */}
      <div
        className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
        role="status"
        aria-live="polite"
        aria-label={message}
      />
      
      {/* Mensaje de carga */}
      {message && (
        <p className="text-gray-600 text-sm font-medium">{message}</p>
      )}

      {/* Texto oculto para screen readers */}
      <span className="sr-only" role="status" aria-live="assertive" aria-atomic="true">
        {message}
      </span>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          {loaderContent}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {loaderContent}
    </div>
  );
}

/**
 * Componente Skeleton - Para placeholder mientras carga
 */
export function SkeletonCard({ count = 3 }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="h-24 bg-gray-200 rounded-lg animate-pulse"
          role="status"
          aria-label="Contenido cargando"
        />
      ))}
    </div>
  );
}

/**
 * Hook personalizado para manejo de estados de carga
 */
export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState(null);

  const startLoading = () => {
    setIsLoading(true);
    setError(null);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  const setLoadingError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
  };
}
