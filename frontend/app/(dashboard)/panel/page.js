'use client';

import { useRouter } from 'next/navigation';
import { motion } from "motion/react"; // Importa desde "motion/react" directamente

export default function PanelPage() {
  // ... resto del código usando <motion.div>
  const items = [
    { title: "Inventario", description: "Gestiona tu inventario" },
    { title: "Préstamos", description: "Administra préstamos" },
    { title: "Usuarios", description: "Gestiona usuarios" },
    { title: "Configuración", description: "Configura el sistema" }
  ];

  // Configuración de "Spring" (elástico) para que se sienta natural
  const springConfig = { type: "spring", stiffness: 300, damping: 20 };

  return (
    <div className="p-6">
      {/* Título con entrada desde la izquierda */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={springConfig}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel principal</h1>
        <div className="w-20 h-1 bg-blue-600 mb-8"></div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-8">Bienvenido</h2>
      </motion.div>
      
      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <motion.div 
            key={item.title} 
            // 1. Entrada de abajo hacia arriba escalonada
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: index * 0.1 }}
            
            // 2. Efecto de "Motion" al pasar el mouse (elástico)
            whileHover={{ 
              scale: 1.05,
              transition: { type: "spring", stiffness: 400, damping: 15 }
            }}
            
            // 3. Efecto de "Click" (se hunde un poquito)
            whileTap={{ scale: 0.95 }}
            
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl border border-gray-100 cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="text-blue-600 font-medium">
                Acceder →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}