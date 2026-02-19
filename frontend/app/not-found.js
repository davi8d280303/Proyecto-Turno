import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-5">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center" role="main">
        <div className="text-6xl mb-4">🚀</div>
        <h1 
          className="text-3xl font-bold text-slate-800 mb-4" 
          aria-live="polite"
        >
          ¡Ups! Te has perdido en el espacio
        </h1>
        <p className="text-slate-600 mb-8">
          La página que buscas no existe o fue movida a un nuevo lugar. 
          No te preocupes, ¡vamos a llevarte de vuelta!
        </p>
        <Link 
          href="/" 
          className="inline-block w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors focus:ring-4 focus:ring-blue-300 outline-none"
        >
          Volver a un lugar seguro
        </Link>
      </div>
    </div>
  );
}