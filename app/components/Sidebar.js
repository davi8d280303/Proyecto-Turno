"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  History,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Evitar errores de hidratación al leer localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar");
    if (saved) setCollapsed(saved === "true");
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("sidebar", collapsed);
    }
  }, [collapsed, isMounted]);

  if (!isMounted) return <aside className="bg-blue-900 w-64 min-h-screen" />;

  const items = [
    { label: "Panel", href: "/panel", icon: LayoutDashboard },
    { label: "Recursos", href: "/recursos", icon: Boxes },
    { label: "Mis Préstamos", href: "/prestamos", icon: ClipboardList },
    { label: "Historial", href: "/historial", icon: History },
    { label: "Perfil", href: "/perfil", icon: User },
  ];

  return (
    <aside
      className={`bg-blue-900 text-white min-h-screen flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-blue-800">
        {!collapsed && <h2 className="text-lg font-bold tracking-wide">Sistema</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-blue-800 transition-colors"
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 mt-4 px-2 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} prefetch={true}>
              <div
                className={`group relative flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer transition-all ${
                  active ? "bg-white text-blue-900 font-semibold shadow" : "hover:bg-blue-800 text-white"
                }`}
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
                {collapsed && (
                  <span className="absolute left-14 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}