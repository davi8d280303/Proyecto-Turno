export default function PanelPage() {
  const items = [
    { title: "Inventario", description: "Gestiona tu inventario" },
    { title: "Préstamos", description: "Administra préstamos" },
    { title: "Usuarios", description: "Gestiona usuarios" },
    { title: "Configuración", description: "Configura el sistema" }
  ];

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
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Acceder →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}