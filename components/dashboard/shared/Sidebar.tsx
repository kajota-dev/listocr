"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Home, Users, QrCode, BarChart2,
  CreditCard, Settings, Building2, Activity, LogOut, Menu, X, User,
  UserCheck, Receipt, History, AlertCircle,
} from "lucide-react";
import type { UserRole } from "@/types";

interface SidebarProps {
  role: UserRole;
  userName: string;
  fichaSlug?: string;
  planName?: string;
  pendingCount?: number;
}

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  external?: boolean;
  badge?: number;
};

function getSidebarItems(role: UserRole, fichaSlug?: string, pendingCount?: number): NavItem[] {
  if (role === "super_admin") {
    return [
      { label: "Dashboard",     href: "/dashboard/admin",                        icon: LayoutDashboard },
      { label: "Aprobaciones",  href: "/dashboard/admin/aprobaciones",            icon: UserCheck, badge: pendingCount },
      { label: "Usuarios",      href: "/dashboard/admin/usuarios",                icon: Users },
      { label: "Agencias",      href: "/dashboard/admin/agencias",                icon: Building2 },
      { label: "Suscripciones", href: "/dashboard/admin/suscripciones/vencidos",  icon: AlertCircle },
      { label: "Pagos",         href: "/dashboard/admin/pagos/verificacion",      icon: Receipt },
      { label: "Membresías",    href: "/dashboard/admin/membresias/registro",     icon: CreditCard },
      { label: "Métricas",      href: "/dashboard/admin/metricas",                icon: Activity },
      { label: "Configuración", href: "/dashboard/admin/config",                  icon: Settings },
    ];
  }

  if (role === "lider_agencia") {
    return [
      { label: "Dashboard",     href: "/dashboard/empresa",                       icon: LayoutDashboard },
      { label: "Propiedades",   href: "/dashboard/empresa/propiedades",           icon: Home },
      { label: "Mi Equipo",     href: "/dashboard/empresa/agentes",               icon: Users },
      { label: "Auditoría",     href: "/dashboard/empresa/auditoria",             icon: History },
      { label: "Mi Ficha",      href: fichaSlug ? `/u/${fichaSlug}` : "#",        icon: QrCode, external: true },
      { label: "Analytics",     href: "/dashboard/empresa/analytics",             icon: BarChart2 },
      { label: "Facturación",   href: "/dashboard/facturacion/comprobante",       icon: Receipt },
      { label: "Configuración", href: "/dashboard/empresa/config",                icon: Settings },
    ];
  }

  return [
    { label: "Dashboard",    href: "/dashboard/agente",                           icon: LayoutDashboard },
    { label: "Propiedades",  href: "/dashboard/agente/propiedades",               icon: Home },
    { label: "Mi Ficha",     href: fichaSlug ? `/u/${fichaSlug}` : "#",           icon: QrCode, external: true },
    { label: "Analytics",    href: "/dashboard/agente/analytics",                 icon: BarChart2 },
    { label: "Facturación",  href: "/dashboard/facturacion/comprobante",          icon: Receipt },
    { label: "Mi Cuenta",    href: "/dashboard/agente/cuenta",                    icon: User },
  ];
}

const PLAN_LABELS = { free: "Gratis", pro: "Pro", business: "Business" };

export default function Sidebar({ role, userName, fichaSlug, planName = "free", pendingCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const items = getSidebarItems(role, fichaSlug, pendingCount);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-brand">
          <span className="text-sm font-bold text-white">L</span>
        </div>
        <span className="text-lg font-bold text-brand-dark">Listo.cr</span>
      </div>

      {/* Usuario */}
      <div className="mb-6 rounded-2xl bg-brand-surface p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-muted">
            <User className="h-5 w-5 text-emerald-brand" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-brand-dark">{userName}</p>
            <span className="rounded-full bg-emerald-brand/10 px-2 py-0.5 text-xs font-medium text-emerald-dark">
              {PLAN_LABELS[planName as keyof typeof PLAN_LABELS] || "Gratis"}
            </span>
          </div>
        </div>
      </div>

      {/* Items de navegación */}
      <nav className="flex-1 space-y-1">
        {items.map(({ label, href, icon: Icon, external, badge }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return external ? (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-brand-muted transition-colors hover:bg-brand-surface hover:text-brand-dark"
            >
              <Icon className="h-5 w-5" />
              {label}
              <span className="ml-auto text-xs text-brand-muted">↗</span>
            </a>
          ) : (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-muted text-emerald-dark"
                  : "text-brand-muted hover:bg-brand-surface hover:text-brand-dark"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-emerald-brand" : ""}`} />
              {label}
              {badge != null && badge > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-white">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-6 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-brand-muted transition-colors hover:bg-red-50 hover:text-red-600"
      >
        <LogOut className="h-5 w-5" />
        Cerrar sesión
      </button>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-brand-border bg-brand-white p-6 lg:flex">
        <NavContent />
      </aside>

      {/* Mobile header */}
      <div className="flex items-center justify-between border-b border-brand-border bg-brand-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-brand">
            <span className="text-xs font-bold text-white">L</span>
          </div>
          <span className="font-bold text-brand-dark">Listo.cr</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-border"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-brand-white p-6 shadow-xl">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
