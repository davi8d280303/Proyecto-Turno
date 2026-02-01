export default function PanelPage() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-6">Bienvenido</h2>

      <div className="grid grid-cols-4 gap-4">
        {["Inventario", "Préstamos", "Usuarios", "Configuración"].map(item => (
          <div key={item} className="bg-white p-6 rounded shadow">
            {item}
          </div>
        ))}
      </div>
    </>
  );
}
