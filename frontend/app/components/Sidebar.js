"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, Boxes, ClipboardList,
  History, User, ChevronLeft, ChevronRight,
  LogOut, ShieldCheck, Shield, UserCircle, Settings,
} from "lucide-react";
import { logoutUsuario, getSessionUser } from "@/lib/api";

// Badge de rol
function RoleBadge({ role }) {
  const cfg = {
    super_admin: { label: "Super Admin", icon: ShieldCheck, color: "text-yellow-400" },
    admin:       { label: "Admin",       icon: Shield,      color: "text-blue-300"   },
    usuario:     { label: "Usuario",     icon: UserCircle,  color: "text-gray-400"   },
  };
  const { label, icon: Icon, color } = cfg[role] || cfg.usuario;
  return (
    <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${color}`}>
      <Icon size={12} /> {label}
    </span>
  );
}

// Ítem de navegación reutilizable
function NavItem({ item, pathname, collapsed }) {
  const Icon   = item.icon;
  const active = pathname === item.href || pathname.startsWith(item.href + "/");
  return (
    <Link href={item.href} prefetch={true}>
      <div className={`group relative flex items-center gap-3 px-3 py-3 rounded-md
                       cursor-pointer transition-all text-sm ${
        active
          ? "bg-white text-blue-900 font-semibold shadow"
          : "hover:bg-blue-800 text-white"
      }`}>
        <Icon size={18} />
        {!collapsed && <span>{item.label}</span>}
        {collapsed && (
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded
                           opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
            {item.label}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const pathname     = usePathname();
  const router       = useRouter();
  const [collapsed,  setCollapsed]  = useState(false);
  const [isMounted,  setIsMounted]  = useState(false);
  const [user,       setUser]       = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar");
    requestAnimationFrame(() => {
      if (saved) setCollapsed(saved === "true");
      setIsMounted(true);
    });
    setUser(getSessionUser());
  }, []);

  // Re-leer usuario cuando cambia la ruta (por si actualizó su nombre en perfil)
  useEffect(() => {
    setUser(getSessionUser());
  }, [pathname]);

  useEffect(() => {
    if (isMounted) localStorage.setItem("sidebar", collapsed);
  }, [collapsed, isMounted]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutUsuario();
    router.replace("/");
  };

  if (!isMounted) return <aside className="bg-blue-900 w-64 min-h-screen" />;

  const isSuperAdmin = user?.role === "super_admin";
  const isAdmin      = user?.role === "admin" || isSuperAdmin;

  // Navegación principal — visible para todos
  const navItems = [
    { label: "Panel",        href: "/panel",     icon: LayoutDashboard },
    { label: "Recursos",     href: "/recursos",  icon: Boxes           },
    { label: "Préstamos",    href: "/prestamos", icon: ClipboardList   },
    { label: "Historial",    href: "/historial", icon: History         },
    { label: "Perfil",       href: "/perfil",    icon: User            },
  ];

  // Administración — solo admin y super_admin
  const adminItems = isAdmin ? [
    { label: "Inventario",    href: "/panel/inventario",    icon: Boxes        },
    { label: "Usuarios",      href: "/panel/usuarios",      icon: User         },
    { label: "Configuración", href: "/panel/configuracion", icon: Settings     },
  ] : [];

  return (
    <aside className={`bg-blue-900 text-white min-h-screen flex flex-col transition-all duration-300 ${
      collapsed ? "w-20" : "w-64"
    }`}>

      {/* CABECERA */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-blue-800">
        {!collapsed && <h2 className="text-lg font-bold tracking-wide truncate">Sistema</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-blue-800 transition-colors ml-auto"
          aria-label="Colapsar menú"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* PERFIL RÁPIDO */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-b border-blue-800">
          <p className="text-sm font-semibold truncate">{user.full_name || user.email}</p>
          <RoleBadge role={user.role} />
        </div>
      )}

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav className="mt-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} collapsed={collapsed} />
        ))}
      </nav>

      {/* SECCIÓN ADMINISTRACIÓN */}
      {adminItems.length > 0 && (
        <div className="mt-4 px-2">
          {!collapsed && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 px-3 pb-1">
              Administración
            </p>
          )}
          {collapsed && <div className="border-t border-blue-800 my-2" />}
          <div className="space-y-1">
            {adminItems.map((item) => (
              <NavItem key={item.href} item={item} pathname={pathname} collapsed={collapsed} />
            ))}
          </div>

          {/* LOGOUT — justo después de Configuración */}
          <div className="mt-1">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="group relative w-full flex items-center gap-3 px-3 py-3 rounded-md
                         hover:bg-red-600 text-white transition-all duration-200 text-sm
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <LogOut size={18} />
              {!collapsed && (
                <span className="font-semibold">
                  {loggingOut ? "Cerrando..." : "Cerrar sesión"}
                </span>
              )}
              {collapsed && (
                <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded
                                 opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
                  Cerrar sesión
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* LOGOUT para usuarios sin sección admin — al fondo */}
      {!isAdmin && (
        <div className="mt-auto px-2 pb-4 border-t border-blue-800 pt-3">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="group relative w-full flex items-center gap-3 px-3 py-3 rounded-md
                       hover:bg-red-600 text-white transition-all text-sm
                       disabled:opacity-60"
          >
            <LogOut size={18} />
            {!collapsed && <span className="font-semibold">{loggingOut ? "Cerrando..." : "Cerrar sesión"}</span>}
            {collapsed && (
              <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded
                               opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">
                Cerrar sesión
              </span>
            )}
          </button>
        </div>
      )}

    </aside>
  );
}