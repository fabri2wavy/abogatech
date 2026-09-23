"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DollarSign, AlertTriangle, Clock, Filter, ExternalLink, Banknote, Bell, Calendar, Target } from "lucide-react";
import {
  FilaReporteFinanciero,
  ReporteFinancieroGlobal,
  EstadoPagoExpediente,
  MonedaHonorario,
  AlertaCuotaVencida,
} from "@/domain/entities/Finanzas";
import { obtenerReporteFinancieroGlobal, obtenerAlertasCuotasVencidas } from "@/infrastructure/repositories/finanzasRepository";
import { obtenerAbogados, UsuarioPerfil, obtenerPerfilActual } from "@/infrastructure/repositories/usuarioRepository";
import { ToastContainer, useToasts } from "@/components/ui/Toast";

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */

function formatearMoneda(monto: number, moneda: MonedaHonorario = "BS"): string {
  const prefijo = moneda === "USD" ? "$" : "Bs.";
  return `${prefijo} ${monto.toLocaleString("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const ESTADO_PAGO_BADGE: Record<EstadoPagoExpediente, { bg: string; text: string; label: string }> = {
  al_dia:     { bg: "bg-emerald-100", text: "text-emerald-700", label: "Al Día" },
  en_proceso: { bg: "bg-blue-100",    text: "text-blue-700",    label: "En Proceso" },
  moroso:     { bg: "bg-rose-100",     text: "text-rose-700",    label: "Moroso" },
};

/* ══════════════════════════════════════════════════════════════
   Skeleton
   ══════════════════════════════════════════════════════════════ */

function GlobalFinanzasSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* 3 KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-6">
            <div className="skeleton h-3 w-24 mb-4" />
            <div className="skeleton h-9 w-36" />
          </div>
        ))}
      </div>
      {/* Filters skeleton */}
      <div className="flex gap-4">
        <div className="skeleton h-10 w-48 rounded-lg" />
        <div className="skeleton h-10 w-40 rounded-lg" />
      </div>
      {/* Table skeleton */}
      <div className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] overflow-hidden">
        <div className="p-4 border-b border-[var(--color-surface-border)]">
          <div className="skeleton h-4 w-32" />
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-[var(--color-surface-border)]">
            <div className="skeleton h-4 w-20" />
            <div className="skeleton h-4 flex-1" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   KPI Cards
   ══════════════════════════════════════════════════════════════ */

interface GlobalKPIProps {
  icon: React.ReactNode;
  label: string;
  valor: string;
  accentClass?: string;
  delay?: number;
}

function GlobalKPICard({ icon, label, valor, accentClass = "text-[var(--color-text-primary)]", delay = 0 }: GlobalKPIProps) {
  return (
    <div
      className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)]
                 p-6 shadow-[var(--shadow-sm)] animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          {label}
        </span>
      </div>
      <p className={`text-3xl font-bold ${accentClass}`}>{valor}</p>
    </div>
  );
}

function GlobalFinancialKPIs({ reporte, filasFiltradas, totalAlertasCobro }: { reporte: ReporteFinancieroGlobal; filasFiltradas: FilaReporteFinanciero[]; totalAlertasCobro: number }) {
  const totalFacturado = filasFiltradas.reduce((s, f) => s + f.montoTotal, 0);
  const totalPendiente = filasFiltradas.reduce((s, f) => s + f.totalPendiente, 0);
  const totalMora = filasFiltradas
    .filter((f) => f.estadoPago === "moroso")
    .reduce((s, f) => s + f.totalPendiente, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <GlobalKPICard
        icon={<DollarSign className="w-5 h-5 text-[var(--color-gold)]" strokeWidth={2} />}
        label="Total Facturado"
        valor={formatearMoneda(totalFacturado)}
        delay={0}
      />
      <GlobalKPICard
        icon={<Clock className="w-5 h-5 text-amber-500" strokeWidth={2} />}
        label="Total Pendiente"
        valor={formatearMoneda(totalPendiente)}
        accentClass="text-amber-600"
        delay={60}
      />
      <GlobalKPICard
        icon={<AlertTriangle className="w-5 h-5 text-rose-500" strokeWidth={2} />}
        label="Total en Mora"
        valor={formatearMoneda(totalMora)}
        accentClass="text-rose-600"
        delay={120}
      />
      <GlobalKPICard
        icon={<Bell className="w-5 h-5 text-orange-500" strokeWidth={2} />}
        label="Cuotas por Vencer"
        valor={totalAlertasCobro.toString()}
        accentClass={totalAlertasCobro > 0 ? "text-orange-600" : "text-emerald-600"}
        delay={180}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Panel de Alertas Globales
   ══════════════════════════════════════════════════════════════ */

function AlertasGlobalesPanel({ alertas }: { alertas: AlertaCuotaVencida[] }) {
  if (alertas.length === 0) return null;

  const vencidas = alertas.filter((a) => a.urgencia === 'vencida');
  const venceHoy = alertas.filter((a) => a.urgencia === 'vence_hoy');
  const proximas = alertas.filter((a) => a.urgencia === 'proxima');

  const URGENCIA_CONFIG = {
    vencida: { icon: <AlertTriangle className="w-4 h-4" strokeWidth={2} />, iconBg: 'bg-red-100', iconColor: 'text-red-600', rowBg: '' },
    vence_hoy: { icon: <Clock className="w-4 h-4" strokeWidth={2} />, iconBg: 'bg-orange-100', iconColor: 'text-orange-600', rowBg: '' },
    proxima: { icon: <Calendar className="w-4 h-4" strokeWidth={2} />, iconBg: 'bg-blue-100', iconColor: 'text-blue-600', rowBg: '' },
    hito_pendiente: { icon: <Target className="w-4 h-4" strokeWidth={2} />, iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', rowBg: '' },
  };

  return (
    <div
      className="rounded-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50
                 shadow-[var(--shadow-md)] overflow-hidden animate-fade-up"
      style={{ animationDelay: "60ms" }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-orange-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
            <Bell className="w-4 h-4 text-orange-600" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-orange-900">
              Alertas de Cobro
              <span className="ml-2 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-200 text-orange-800">
                {alertas.length}
              </span>
            </h3>
            <p className="text-xs text-orange-700/70 mt-0.5">
              {vencidas.length > 0 && <span className="font-semibold text-red-700">{vencidas.length} vencida{vencidas.length !== 1 ? 's' : ''}</span>}
              {vencidas.length > 0 && (venceHoy.length > 0 || proximas.length > 0) && ' · '}
              {venceHoy.length > 0 && <span className="font-semibold text-orange-700">{venceHoy.length} vence{venceHoy.length !== 1 ? 'n' : ''} hoy</span>}
              {venceHoy.length > 0 && proximas.length > 0 && ' · '}
              {proximas.length > 0 && <span className="font-semibold text-blue-700">{proximas.length} próxima{proximas.length !== 1 ? 's' : ''}</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="divide-y divide-orange-100 max-h-[320px] overflow-y-auto">
        {alertas.map((alerta) => {
          const config = URGENCIA_CONFIG[alerta.urgencia];
          return (
            <div key={alerta.cuotaId} className="px-5 py-3 flex items-center justify-between hover:bg-orange-50/80 transition-colors group">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.iconBg} ${config.iconColor}`}>
                  {config.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate max-w-[200px]" title={alerta.tituloExpediente}>
                      {alerta.tituloExpediente}
                    </p>
                    <span className="text-xs text-[var(--color-text-muted)] hidden sm:inline">{alerta.numeroCaso}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] truncate max-w-[240px]">
                    {alerta.descripcion} · {alerta.nombreCliente}
                  </p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold mt-0.5 ${
                    alerta.urgencia === 'vencida' ? 'bg-red-100 text-red-700 border border-red-200' :
                    alerta.urgencia === 'vence_hoy' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                    'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {alerta.urgencia === 'vencida' ? `Vencida hace ${Math.abs(alerta.diasRestantes)} día${Math.abs(alerta.diasRestantes) !== 1 ? 's' : ''}` :
                     alerta.urgencia === 'vence_hoy' ? '⚠️ Vence hoy' :
                     `Vence en ${alerta.diasRestantes} día${alerta.diasRestantes !== 1 ? 's' : ''}`}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-3 flex items-center gap-3">
                <div>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">
                    {formatearMoneda(alerta.monto, alerta.moneda)}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {new Date(alerta.fechaVencimiento).toLocaleDateString('es-BO', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
                <Link
                  href={`/dashboard/casos/${alerta.expedienteId}`}
                  className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-gold)]
                             hover:bg-[var(--color-gold-dim)] transition-all opacity-0 group-hover:opacity-100"
                  title="Ver expediente"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Filter Bar
   ══════════════════════════════════════════════════════════════ */

function FilterBar({
  abogados,
  filtroAbogado,
  filtroEstado,
  onAbogadoChange,
  onEstadoChange,
}: {
  abogados: UsuarioPerfil[];
  filtroAbogado: string;
  filtroEstado: string;
  onAbogadoChange: (val: string) => void;
  onEstadoChange: (val: string) => void;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 animate-fade-up"
      style={{ animationDelay: "180ms" }}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
        <Filter className="w-3.5 h-3.5" />
        Filtros
      </div>

      <select
        id="filtro-abogado-global"
        value={filtroAbogado}
        onChange={(e) => onAbogadoChange(e.target.value)}
        className="px-4 py-2.5 text-sm rounded-lg border border-[var(--color-surface-border)]
                   bg-[var(--color-surface-card)] text-[var(--color-text-primary)]
                   focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]
                   transition-all"
      >
        <option value="">Todos los abogados</option>
        {abogados.map((a) => (
          <option key={a.id} value={a.nombre_completo}>
            {a.nombre_completo}
          </option>
        ))}
      </select>

      <select
        id="filtro-estado-global"
        value={filtroEstado}
        onChange={(e) => onEstadoChange(e.target.value)}
        className="px-4 py-2.5 text-sm rounded-lg border border-[var(--color-surface-border)]
                   bg-[var(--color-surface-card)] text-[var(--color-text-primary)]
                   focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]
                   transition-all"
      >
        <option value="">Todos los estados</option>
        <option value="al_dia">Al Día</option>
        <option value="en_proceso">En Proceso</option>
        <option value="moroso">Moroso</option>
      </select>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Master Collections Table
   ══════════════════════════════════════════════════════════════ */

function MasterCollectionsTable({ filas }: { filas: FilaReporteFinanciero[] }) {
  return (
    <div
      className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-card)]
                 shadow-[var(--shadow-sm)] overflow-hidden animate-fade-up"
      style={{ animationDelay: "240ms" }}
    >
      <div className="px-5 py-4 border-b border-[var(--color-surface-border)]">
        <h3 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
          <Banknote className="w-4 h-4 text-[var(--color-gold)]" strokeWidth={2} />
          Contratos Activos
          <span className="text-xs font-normal text-[var(--color-text-muted)]">
            ({filas.length} expediente{filas.length !== 1 ? "s" : ""})
          </span>
        </h3>
      </div>

      {filas.length === 0 ? (
        <div className="py-16 text-center">
          <Banknote className="w-10 h-10 mx-auto text-[var(--color-text-muted)] opacity-40 mb-3" strokeWidth={1.5} />
          <p className="text-sm font-medium text-[var(--color-text-muted)]">
            No hay contratos que coincidan con los filtros.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="bg-[var(--color-surface-hover)] border-b border-[var(--color-surface-border)]">
                <th className="py-3 px-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-left">
                  Caso
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-left hidden md:table-cell">
                  Cliente
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-left hidden lg:table-cell">
                  Abogado
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-right">
                  Facturado
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-right hidden sm:table-cell">
                  Pendiente
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-center">
                  Estado
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-center w-10">
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-surface-border)]">
              {filas.map((fila) => {
                const badge = ESTADO_PAGO_BADGE[fila.estadoPago];
                return (
                  <tr key={fila.expedienteId} className="hover:bg-[var(--color-surface-hover)] transition-colors group">
                    <td className="py-3 px-4">
                      <div>
                        <span
                          className="text-sm font-semibold text-[var(--color-text-primary)] block truncate max-w-[200px]"
                          title={fila.tituloExpediente}
                        >
                          {fila.tituloExpediente}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)]">{fila.numeroCaso}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-[var(--color-text-secondary)] truncate block max-w-[180px]" title={fila.nombreCliente}>
                        {fila.nombreCliente}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-sm text-[var(--color-text-secondary)] truncate block max-w-[160px]" title={fila.abogadoNombre}>
                        {fila.abogadoNombre}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {formatearMoneda(fila.montoTotal, fila.moneda)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right hidden sm:table-cell">
                      <span className={`text-sm font-semibold ${fila.totalPendiente > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                        {formatearMoneda(fila.totalPendiente, fila.moneda)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/dashboard/casos/${fila.expedienteId}`}
                        className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-gold)]
                                   hover:bg-[var(--color-gold-dim)] transition-all opacity-0 group-hover:opacity-100"
                        title="Ver expediente"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE: Dashboard Financiero Global
   ══════════════════════════════════════════════════════════════ */

export default function FinanzasDashboardPage() {
  const [reporte, setReporte] = useState<ReporteFinancieroGlobal | null>(null);
  const [abogados, setAbogados] = useState<UsuarioPerfil[]>([]);
  const [alertasCobro, setAlertasCobro] = useState<AlertaCuotaVencida[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verificandoAcceso, setVerificandoAcceso] = useState(true);
  const [error, setError] = useState("");

  const [filtroAbogado, setFiltroAbogado] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  const { toasts, addToast, removeToast } = useToasts();
  const router = useRouter();

  /* ── Verificación de Acceso ────────────────────────────────── */
  useEffect(() => {
    async function verificarAcceso() {
      const perfil = await obtenerPerfilActual();
      if (!perfil || (perfil.rol !== 'admin' && perfil.rol !== 'finanzas')) {
        router.push('/dashboard');
      } else {
        setVerificandoAcceso(false);
      }
    }
    verificarAcceso();
  }, [router]);

  /* ── Carga inicial ─────────────────────────────────────────── */
  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const [reporteRes, abogadosRes, alertasRes] = await Promise.all([
      obtenerReporteFinancieroGlobal(),
      obtenerAbogados(),
      obtenerAlertasCuotasVencidas(),
    ]);

    if (reporteRes.error) {
      setError(reporteRes.error);
      setIsLoading(false);
      return;
    }

    setReporte(reporteRes.data);
    setAbogados(abogadosRes);
    setAlertasCobro(alertasRes.data ?? []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!verificandoAcceso) {
      cargarDatos();
    }
  }, [cargarDatos, verificandoAcceso]);

  /* ── Filtrado client-side ──────────────────────────────────── */
  const filasFiltradas = useMemo(() => {
    if (!reporte) return [];

    let resultado = reporte.filas;

    if (filtroAbogado) {
      resultado = resultado.filter((f) => f.abogadoNombre === filtroAbogado);
    }

    if (filtroEstado) {
      resultado = resultado.filter((f) => f.estadoPago === filtroEstado);
    }

    return resultado;
  }, [reporte, filtroAbogado, filtroEstado]);

  /* ── Render: Loading ───────────────────────────────────────── */
  if (verificandoAcceso || isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Finanzas</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Panel financiero de la firma</p>
        </div>
        {verificandoAcceso ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-[var(--color-surface-border)]
                            border-t-[var(--color-gold)] animate-spin" />
            <span className="text-[var(--color-text-muted)]">Verificando permisos...</span>
          </div>
        ) : (
          <GlobalFinanzasSkeleton />
        )}
      </div>
    );
  }

  /* ── Render: Error ─────────────────────────────────────────── */
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Finanzas</h1>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  /* ── Render: Empty ─────────────────────────────────────────── */
  if (!reporte || reporte.filas.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Finanzas</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Panel financiero de la firma</p>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 mb-5">
            <Banknote className="w-8 h-8 text-amber-500" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
            Sin datos financieros
          </h3>
          <p className="text-sm text-[var(--color-text-muted)] max-w-sm">
            No hay contratos de honorarios registrados aún. Crea contratos desde la pestaña Finanzas de cada expediente.
          </p>
        </div>
      </div>
    );
  }

  /* ── Render: Data View ─────────────────────────────────────── */
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Finanzas</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Visión consolidada de la salud financiera de la firma
        </p>
      </div>

      <div className="space-y-8">
        <GlobalFinancialKPIs reporte={reporte} filasFiltradas={filasFiltradas} totalAlertasCobro={alertasCobro.length} />

        <AlertasGlobalesPanel alertas={alertasCobro} />

        <FilterBar
          abogados={abogados}
          filtroAbogado={filtroAbogado}
          filtroEstado={filtroEstado}
          onAbogadoChange={setFiltroAbogado}
          onEstadoChange={setFiltroEstado}
        />

        <MasterCollectionsTable filas={filasFiltradas} />
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
