"use client";
import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Package, ClipboardList, Users, Settings,
  Clock, CheckCircle2, TrendingUp, ArrowRight,
  AlertCircle,
} from "lucide-react";
import apiService, { getSessionUser } from "@/lib/api";

function MetricCard({ label, value, icon: Icon, color, loading }) {
  return (
    <div className={`bg-white rounded-xl border-2 p-5 flex items-center gap-4 ${color}`}>
      <div className="w-12 h-12 rounded-xl bg-current/10 flex items-center justify-center flex-shrink-0">
        <Icon size={22} className="opacity-80" />
      </div>
      <div>
        {loading
          ? <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-1" />
          : <p className="text-3xl font-black leading-none">{value}</p>
        }
        <p className="text-xs font-bold uppercase tracking-wide opacity-60 mt-1">{label}</p>
      </div>
    </div>
  );
}

function NavCard({ title, description, href, icon: Icon, delay }) {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#002B49]
                   p-6 cursor-pointer shadow-sm hover:shadow-lg transition-shadow
                   flex flex-col h-full group"
      >
        <div className="w-10 h-10 rounded-lg bg-[#002B49]/10 flex items-center justify-center mb-4
                        group-hover:bg-[#002B49] transition-colors">
          <Icon size={20} className="text-[#002B49] group-hover:text-white transition-colors" />
        </div>
        <h3 className="font-black text-gray-800 text-lg mb-1">{title}</h3>
        <p className="text-gray-500 text-sm flex-1">{description}</p>
        <div className="flex items-center gap-1 mt-4 text-[#002B49] font-bold text-xs uppercase
                        tracking-wide group-hover:gap-2 transition-all">
          Acceder <ArrowRight size={13} />
        </div>
      </motion.div>
    </Link>
  );
}

export default function PanelPage() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  const user         = getSessionUser();
  const isSuperAdmin = user?.role === "super_admin";
  const isAdmin      = user?.role === "admin" || isSuperAdmin;
  const nombre       = user?.full_name?.split(" ")[0] || "Usuario";

  const saludo = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
  })();

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [resInv, resPrestamos] = await Promise.all([
        apiService.getInventario(),
        apiService.getPrestamos(),
      ]);
      const inventario = resInv.success      ? resInv.data      : [];
      const prestamos  = resPrestamos.success ? resPrestamos.data : [];
      setStats({
        totalInventario:  inventario.length,
        disponibles:      inventario.filter((i) => i.estado === "disponible").length,
        enUso:            inventario.filter((i) => i.estado === "en_uso").length,
        prestamosActivos: prestamos.filter((p)  => p.estado === "activo").length,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  // Tarjetas según rol — sin "Recursos" aquí
  const navCards = [
    {
      title:       "Inventario",
      description: "Consulta y gestiona los artículos registrados.",
      href:        "/panel/inventario",
      icon:        Package,
      visible:     true,
    },
    {
      title:       "Préstamos",
      description: isAdmin
        ? "Registra préstamos y gestiona devoluciones."
        : "Consulta tus préstamos activos.",
      href:        "/prestamos",
      icon:        ClipboardList,
      visible:     true,
    },
    {
      title:       "Usuarios",
      description: "Administra cuentas, roles y áreas.",
      href:        "/panel/usuarios",
      icon:        Users,
      visible:     isSuperAdmin,
    },
    {
      title:       "Configuración",
      description: "Gestiona las áreas y asigna artículos del inventario.",
      href:        "/panel/configuracion",
      icon:        Settings,
      visible:     isSuperAdmin,
    },
  ].filter((c) => c.visible);

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* ENCABEZADO */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <p className="text-sm text-gray-500 font-medium">{saludo},</p>
        <h1 className="text-3xl font-black text-gray-800">{nombre}</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-10 h-1 bg-[#002B49] rounded-full" />
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            {isSuperAdmin ? "Super Administrador" : isAdmin ? "Administrador" : "Usuario"}
          </p>
        </div>
      </motion.div>

      {/* MÉTRICAS */}
      {isAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <MetricCard label="Total artículos"  value={stats?.totalInventario  ?? "—"} icon={Package}      color="text-[#002B49] border-blue-100"      loading={loading} />
          <MetricCard label="Disponibles"      value={stats?.disponibles      ?? "—"} icon={CheckCircle2} color="text-emerald-700 border-emerald-100"  loading={loading} />
          <MetricCard label="En uso"           value={stats?.enUso            ?? "—"} icon={Clock}        color="text-yellow-700 border-yellow-100"    loading={loading} />
          <MetricCard label="Préstamos activos" value={stats?.prestamosActivos ?? "—"} icon={TrendingUp}  color="text-purple-700 border-purple-100"    loading={loading} />
        </div>
      )}

      {/* ALERTA préstamos activos para usuario normal */}
      {!isAdmin && stats?.prestamosActivos > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-yellow-50 border border-yellow-200
                     text-yellow-800 rounded-xl p-4 mb-6"
        >
          <AlertCircle size={18} className="flex-shrink-0" />
          <p className="text-sm font-semibold">
            Tienes <strong>{stats.prestamosActivos}</strong> artículo{stats.prestamosActivos > 1 ? "s" : ""} en préstamo.{" "}
            <Link href="/prestamos" className="underline font-bold">Ver →</Link>
          </p>
        </motion.div>
      )}

      {/* TARJETAS */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          Accesos rápidos
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {navCards.map((card, i) => (
            <NavCard key={card.href} {...card} delay={i * 0.07} />
          ))}
        </div>
      </div>

    </div>
  );
}
