<<<<<<< HEAD
'use client';

import Link from 'next/link';
import { motion } from "motion/react";

export default function PanelPage() {
<<<<<<< Updated upstream
=======
  // ... resto del código usando <motion.div>
=======
export default function PanelPage() {
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes
  const items = [
    { title: "Inventario", description: "Gestiona tu inventario", href: "/panel/inventario" },
    { title: "Préstamos", description: "Administra préstamos", href: "/panel/prestamos" },
    { title: "Usuarios", description: "Gestiona usuarios", href: "/panel/usuarios" },
    { title: "Configuración", description: "Configura el sistema", href: "/panel/configuracion" }
  ];

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
  // Configuración de "Spring" (elástico) para que se sienta natural
>>>>>>> Stashed changes
  const springConfig = { type: "spring", stiffness: 300, damping: 20 };

  return (
    <div className="p-6">
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={springConfig}
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel principal</h1>
        <div className="w-20 h-1 bg-blue-600 mb-8"></div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-8">Bienvenido</h2>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, index) => (
<<<<<<< Updated upstream
          <Link href={item.href} key={item.title}>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 15 }
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-2xl border border-gray-100 cursor-pointer h-full border-t-4 border-t-blue-500"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-blue-600 font-medium">Acceder →</span>
              </div>
            </motion.div>
          </Link>
=======
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
=======
  return (
    <div className="p-6">
      {/* Título principal */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel principal</h1>
      <div className="w-20 h-1 bg-blue-600 mb-8"></div>
      
      {/* Subtítulo */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-8">Bienvenido</h2>
      
      {/* Grid de elementos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div 
            key={item.title} 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
>>>>>>> 20fed7f (commit backend sistema de prestamos)
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
<<<<<<< HEAD
              <button className="text-blue-600 font-medium">
                Acceder →
              </button>
            </div>
          </motion.div>
=======
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Acceder →
              </button>
            </div>
          </div>
>>>>>>> 20fed7f (commit backend sistema de prestamos)
>>>>>>> Stashed changes
        ))}
      </div>
    </div>
  );
}