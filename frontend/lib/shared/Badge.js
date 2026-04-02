'use client';

import { ESTADO_STYLES } from '@/lib/constants/estados';

export default function Badge({ estado }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${ESTADO_STYLES[estado] ?? 'bg-gray-100 text-gray-600'}`}>
      {estado}
    </span>
  );
}