"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  ClipboardList,
  X,
  ShieldX,
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import type { AuditoriaLog } from "@/domain/entities/AuditoriaLog";
import { obtenerLogs } from "@/infrastructure/repositories/auditoriaRepository";
import { obtenerPerfilActual } from "@/infrastructure/repositories/usuarioRepository";
import { ToastContainer, useToasts } from "@/components/ui/Toast";

const ACCION_BADGE: Record<
  string,
  { bg: string; text: string; border: string; icon: React.ElementType }
> = {
  INSERT: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: Plus,
  },
  UPDATE: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: Pencil,
  },
  DELETE: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: Trash2,
  },
};

function getAccionBadge(accion: string) {
  const upper = accion.toUpperCase();
  return (
    ACCION_BADGE[upper] ?? {
      bg: "bg-slate-50",
      text: "text-slate-600",
      border: "border-slate-200",
      icon: Eye,
    }
  );
}

function ActionBadge({ accion }: { accion: string }) {
  const badge = getAccionBadge(accion);
  const Icon = badge.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}
    >
      <Icon className="w-3 h-3" />
      {accion}
    </span>
  );
}

function JsonDetailsModal({
  log,
  onClose,
}: {
  log: AuditoriaLog | null;
  onClose: () => void;
}) {
  if (!log) return null;

  const jsonFormateado = JSON.stringify(log.detalles, null, 2);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[80vh] flex flex-col animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                Detalles del Registro
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <ActionBadge accion={log.accion} />
                <span className="text-xs text-gray-400">
                  {log.entidad} · {log.entidad_id?.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata */}
        <div className="px-6 pt-4 pb-2 grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
              Usuario ID
            </p>
            <p className="text-xs text-gray-700 font-mono">
              {log.usuario_id}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
              Fecha
            </p>
            <p className="text-xs text-gray-700">
              {new Date(log.creado_en).toLocaleString("es-MX", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* JSON Viewer */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Payload (JSON)
          </p>
          <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
            {jsonFormateado === "{}" ? "Sin detalles adicionales." : jsonFormateado}
          </pre>
        </div>
      </div>
    </div>,
    document.body
  );
}

function AuditSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 last:border-0">
          <td className="py-1 px-2">
            <div className="skeleton h-4 w-28 rounded" />
          </td>
          <td className="py-1 px-2">
            <div className="skeleton h-5 w-16 rounded-full" />
          </td>
          <td className="py-1 px-2">
            <div className="skeleton h-4 w-24 rounded" />
          </td>
          <td className="py-1 px-2 hidden md:table-cell">
            <div className="skeleton h-4 w-20 rounded" />
          </td>
          <td className="py-1 px-2 hidden lg:table-cell">
            <div className="skeleton h-4 w-36 rounded" />
          </td>
        </tr>
      ))}
    </>
  );
}

function AccesoDenegado() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="mx-auto w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-5 border border-red-100">
        <ShieldX className="w-10 h-10 text-red-400" strokeWidth={1.2} />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">
        Acceso Denegado
      </h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
        Los registros de auditoría son exclusivos para administradores del
        sistema.
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        className="px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-lg hover:bg-[var(--color-navy-light)] transition-colors"
      >
        Volver al Inicio
      </button>
    </div>
  );
}

export default function AuditoriaPage() {
  const [verificando, setVerificando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [logs, setLogs] = useState<AuditoriaLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [logSeleccionado, setLogSeleccionado] = useState<AuditoriaLog | null>(
    null
  );

  const { toasts, addToast, removeToast } = useToasts();

  const cargarLogs = useCallback(async () => {
    setCargando(true);
    setError(null);

    const res = await obtenerLogs();

    if (res.error) {
      setError(res.error);
    } else {
      setLogs(res.data ?? []);
    }

    setCargando(false);
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function init() {
      const perfil = await obtenerPerfilActual();
      if (cancelado) return;

      if (!perfil || perfil.rol !== "admin") {
        setAutorizado(false);
        setVerificando(false);
        return;
      }

      setAutorizado(true);
      setVerificando(false);
      await cargarLogs();
    }

    init();
    return () => {
      cancelado = true;
    };
  }, [cargarLogs]);

  if (verificando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gold)]" />
        <p className="mt-4 text-[var(--color-text-muted)]">
          Verificando permisos...
        </p>
      </div>
    );
  }

  if (!autorizado) {
    return <AccesoDenegado />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-[var(--color-gold)]" />
            Auditoría del Sistema
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Registro inmutable de todas las operaciones realizadas en el CRM.
          </p>
        </div>
        {!cargando && !error && (
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full shrink-0">
            {logs.length} registro{logs.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Error ─────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3 text-red-800 text-sm font-medium">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* ── Tabla de Auditoría ────────────────────────────────── */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="py-2 px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                  Fecha
                </th>
                <th className="py-2 px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                  Acción
                </th>
                <th className="py-2 px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
                  Entidad
                </th>
                <th className="py-2 px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest hidden md:table-cell">
                  ID Entidad
                </th>
                <th className="py-2 px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest hidden lg:table-cell">
                  Usuario
                </th>
                <th className="py-2 px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest text-right">
                  Detalle
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cargando && <AuditSkeleton />}

              {!cargando && !error && logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                      <ClipboardList
                        className="w-8 h-8 text-gray-300"
                        strokeWidth={1.2}
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Sin registros de auditoría
                    </p>
                    <p className="text-xs text-gray-500">
                      Los eventos del sistema se registrarán aquí automáticamente.
                    </p>
                  </td>
                </tr>
              )}

              {!cargando &&
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-1 px-2">
                      <span className="text-xs text-gray-600">
                        {new Date(log.creado_en).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="py-1 px-2">
                      <ActionBadge accion={log.accion} />
                    </td>
                    <td className="py-1 px-2">
                      <span className="text-xs font-semibold text-gray-700">
                        {log.entidad}
                      </span>
                    </td>
                    <td className="py-1 px-2 hidden md:table-cell">
                      <span className="text-xs text-gray-400 font-mono">
                        {log.entidad_id?.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="py-1 px-2 hidden lg:table-cell">
                      <span className="text-xs text-gray-400 font-mono">
                        {log.usuario_id?.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="py-1 px-2 text-right">
                      <button
                        onClick={() => setLogSeleccionado(log)}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400
                                   hover:text-[var(--color-gold)] transition-colors px-2 py-1 rounded"
                      >
                        <Eye className="w-3 h-3" />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal de Detalle ──────────────────────────────────── */}
      <JsonDetailsModal
        log={logSeleccionado}
        onClose={() => setLogSeleccionado(null)}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
