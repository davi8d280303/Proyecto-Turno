"use client";

export default function Topbar() {
  return (
    <header className="h-14 bg-blue-800 text-white flex justify-between items-center px-6">
      <h1 className="font-semibold">Panel principal</h1>
      <div className="flex gap-4">
        <button>🔔</button>
        <button>⚙️</button>
      </div>
    </header>
  );
}
