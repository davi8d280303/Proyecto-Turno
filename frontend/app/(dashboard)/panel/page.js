'use client';

import { motion, useReducedMotion } from "framer-motion"; // <-- Importamos el Hook

export default function PanelPage() {
  // 1. Detectamos si el usuario tiene activado "Reducir movimiento" en su Windows/Mac
  const shouldReduceMotion = useReducedMotion();

  const items = [
    { title: "Inventario", description: "Gestiona tu inventario" },
    { title: "Préstamos", description: "Administra préstamos" },
    { title: "Usuarios", description: "Gestiona usuarios" },
    { title: "Configuración", description: "Configura el sistema" }
  ];

  // 2. Definimos variantes: si prefiere movimiento reducido, quitamos el desplazamiento (y)
  const hoverAnimation = shouldReduceMotion 
    ? { opacity: 0.8 } // Solo un cambio sutil de opacidad
    : { scale: 1.05, y: -5 }; // La animación completa con movimiento

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel principal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
          <motion.div 
            key={item.title} 
            // Animación de entrada
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            
            // Usamos la lógica de accesibilidad aquí:
            whileHover={hoverAnimation}
            whileTap={{ scale: 0.95 }}
            
            className="bg-white p-6 rounded-lg shadow-md border border-gray-100 cursor-pointer"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}