"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import BotonSalir from "@/components/layout/BotonSalir";
import PerfilUsuario from "@/components/layout/PerfilUsuario";
import WidgetAsistente from "@/components/WidgetAsistente";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
};

export default function DashboardClientLayout({
  children,
  rol,
  userId,
}: {
  children: React.ReactNode;
  rol: string;
  userId: string | null;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const getNavItems = (userRol: string): NavItem[] => {
    const inicioItem = {
      href: "/dashboard",
      label: "Inicio",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    };

    const casosIcon = (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    );

    const clientesIcon = (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );

    const equipoIcon = (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4.5a2.5 2.5 0 0 0-5 0v1a2.5 2.5 0 0 0 5 0v-1z" />
        <path d="M15 14.5a2.5 2.5 0 0 0-5 0v1a2.5 2.5 0 0 0 5 0v-1z" />
        <path d="M9 14.5a2.5 2.5 0 0 0-5 0v1a2.5 2.5 0 0 0 5 0v-1z" />
        <path d="M6 10c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5v1h-6v-1z" />
        <path d="M6 20c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5v1h-6v-1z" />
        <path d="M12 20c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5v1h-6v-1z" />
      </svg>
    );

    const reportesIcon = (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    );

    const agendaIcon = (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );

    const finanzasIcon = (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    );

    const plantillasIcon = (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M9 15l2 2 4-4" />
      </svg>
    );

    if (userRol === 'admin') {
      const configuracionIcon = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );

      const auditoriaIcon = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="9" y1="16" x2="13" y2="16" />
        </svg>
      );

      return [
        inicioItem,
        { href: "/dashboard/casos", label: "Expedientes", icon: casosIcon },
        { href: "/dashboard/clientes", label: "Clientes", icon: clientesIcon },
        { href: "/dashboard/agenda", label: "Agenda", icon: agendaIcon },
        { href: "/dashboard/finanzas", label: "Finanzas", icon: finanzasIcon },
        { href: "/dashboard/plantillas", label: "Plantillas", icon: plantillasIcon },
        { href: "/dashboard/equipo", label: "Equipo", icon: equipoIcon },
        { href: "/dashboard/reportes", label: "Reportes", icon: reportesIcon },
        { href: "/dashboard/configuracion", label: "Configuración", icon: configuracionIcon, section: "ADMINISTRACIÓN" },
        { href: "/dashboard/auditoria", label: "Auditoría", icon: auditoriaIcon },
      ];
    } else if (userRol === 'abogado' || userRol === 'asociado_senior') {
      const perfilIcon = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );

      const items: NavItem[] = [
        inicioItem,
        { href: "/dashboard/casos", label: "Mis Casos", icon: casosIcon },
        { href: "/dashboard/clientes", label: "Mis Clientes", icon: clientesIcon },
        { href: "/dashboard/agenda", label: "Agenda", icon: agendaIcon },
        { href: "/dashboard/plantillas", label: "Plantillas", icon: plantillasIcon },
      ];

      if (userRol === 'asociado_senior') {
        // Asociado Senior puede ver finanzas, equipo y reportes
        items.push({ href: "/dashboard/equipo", label: "Equipo", icon: equipoIcon });
        items.push({ href: "/dashboard/finanzas", label: "Finanzas", icon: finanzasIcon });
        items.push({ href: "/dashboard/reportes", label: "Reportes", icon: reportesIcon });
      }

      items.push({ href: "/dashboard/perfil", label: "Mi Perfil", icon: perfilIcon, section: "MI CUENTA" });

      return items;
    } else if (userRol === 'finanzas') {
      const perfilIcon = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
      return [
        inicioItem,
        { href: "/dashboard/finanzas", label: "Finanzas", icon: finanzasIcon },
        { href: "/dashboard/perfil", label: "Mi Perfil", icon: perfilIcon, section: "MI CUENTA" },
      ];
    } else {
      return [
        inicioItem,
        { href: "/dashboard/casos", label: "Mi Expediente", icon: casosIcon },
      ];
    }
  };

  const navItems = getNavItems(rol);

  return (
    <div className="flex h-screen" style={{ background: "var(--color-surface)" }}>
      {/* ── Overlay mobile ──────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(26, 26, 26, 0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[272px] flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          background: "linear-gradient(180deg, var(--color-navy) 0%, #111111 100%)",
          borderRight: "1px solid var(--color-navy-border)",
        }}
      >
        {/* Logo / brand */}
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-light tracking-wide"
            style={{
              background: "var(--color-gold-dim)",
              border: "1px solid var(--color-gold-light)",
              color: "var(--color-gold-light)",
              fontFamily: "var(--font-brand)",
            }}
          >
            I&A
          </div>
          <div>
            <h2
              className="text-lg font-semibold leading-tight"
              style={{
                color: "var(--color-text-on-dark)",
                fontFamily: "var(--font-brand)",
                letterSpacing: "0.02em",
              }}
            >
              Iturri <span style={{ color: "var(--color-gold)" }}>&</span> Asociados
            </h2>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--color-text-muted)", letterSpacing: "0.15em" }}
            >
              CRM Legal
            </p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto min-h-[50%]">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <div key={item.label}>
                {item.section && (
                  <p
                    className="text-[9px] font-bold uppercase tracking-[0.2em] px-4 pt-5 pb-2"
                    style={{ color: "rgba(163, 32, 32, 0.7)" }}
                  >
                    {item.section}
                  </p>
                )}
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: active
                      ? "rgba(163, 32, 32, 0.15)"
                      : "transparent",
                    color: active
                      ? "var(--color-gold-light)"
                      : "rgba(200, 200, 200, 0.7)",
                    borderLeft: active
                      ? "3px solid var(--color-gold)"
                      : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.color = "rgba(240, 240, 240, 0.95)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(200, 200, 200, 0.7)";
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
                </a>
              </div>
            );
          })}
        </nav>

        {/* Footer con perfil y salir */}
        <div
          className="px-4 py-4"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}
        >
          <PerfilUsuario />
          <BotonSalir />
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header
          className="lg:hidden flex items-center justify-between px-4 py-3"
          style={{
            background: "var(--color-navy)",
            borderBottom: "1px solid var(--color-navy-border)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: "var(--color-gold-light)" }}
            aria-label="Abrir menú"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-on-dark)", fontFamily: "var(--font-brand)" }}
          >
            I&A
          </span>
          <div className="w-10" /> {/* Spacer para centrar el título */}
        </header>

        {/* Área de contenido */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* ── Widget Asistente AI ─────────────────────────────── */}
      {userId && (rol === 'abogado' || rol === 'admin') && (
        <WidgetAsistente abogadoId={userId} />
      )}
    </div>
  );
}
