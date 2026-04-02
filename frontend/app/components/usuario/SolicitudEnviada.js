'use client';

import { useRouter } from 'next/navigation';
import Boton from '@/components/shared/Boton';

export default function SolicitudEnviada({ monto, tipo, onNuevaSolicitud }) {
  const router = useRouter();

  return (
    <div className="max-w-lg mx-auto text-center py-16 space-y-5">
      {/* Ícono de éxito */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <span className="text-4xl">✓</span>
      </div>

      {/* Títulos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">¡Solicitud enviada!</h2>
        <p className="text-gray-500 text-sm">
          Tu solicitud de{' '}
          <span className="font-semibold text-gray-700">{tipo}</span> por{' '}
          <span className="font-semibold text-gray-700">${Number(monto).toLocaleString('es-MX')}</span> fue recibida.
        </p>
      </div>

      {/* Aviso tiempo */}
      <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
        Un administrador la revisará en las próximas <strong>24–48 horas</strong> hábiles.
        Puedes ver el estado en <em>Mis préstamos</em>.
      </p>

      {/* Acciones */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Boton variante="secundario" onClick={onNuevaSolicitud}>
          Nueva solicitud
        </Boton>
        <Boton variante="primario" onClick={() => router.push('/usuario/mis-prestamos')}>
          Ver mis préstamos →
        </Boton>
      </div>
    </div>
  );
}