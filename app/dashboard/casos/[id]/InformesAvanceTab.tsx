"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, FileText, CalendarDays, ClipboardList, Shield, MessageSquare } from "lucide-react";
import type { InformeAvance } from "@/domain/entities/InformeAvance";
import {
  crearInforme,
  obtenerInformesPorExpediente,
} from "@/infrastructure/repositories/informesRepository";
import { obtenerUsuarioActualId } from "@/infrastructure/repositories/authRepository";
import CrearInformeModal from "./CrearInformeModal";
import { ToastContainer, useToasts } from "@/components/ui/Toast";

/* ── Props ─────────────────────────────────────────────────── */
interface InformesAvanceTabProps {
  expedienteId: string;
}

/* ── Skeleton de carga ─────────────────────────────────────── */
function InformesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 space-y-2 animate-pulse"
        >
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-full bg-gray-100 rounded" />
          <div className="h-3 w-3/4 bg-gray-100 rounded" />
          <div className="h-3 w-1/2 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

/* ── Componente principal ──────────────────────────────────── */
export default function InformesAvanceTab({ expedienteId }: InformesAvanceTabProps) {
  const [informes, setInformes] = useState<InformeAvance[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const { toasts, addToast, removeToast } = useToasts();

  /* ── Cargar informes y userId ────────────────────────────── */
  const cargarInformes = useCallback(async () => {
    setCargando(true);
    try {
      const data = await obtenerInformesPorExpediente(expedienteId);
      setInformes(data);
    } catch {
      addToast("error", "Error al cargar los informes de avance.");
    } finally {
      setCargando(false);
    }
  }, [expedienteId, addToast]);

  useEffect(() => {
    cargarInformes();
    obtenerUsuarioActualId().then(setUserId);
  }, [cargarInformes]);

  /* ── Guardar nuevo informe ──────────────────────────────── */
  const handleSave = async (payload: Omit<InformeAvance, "id" | "createdAt">) => {
    try {
      const resultado = await crearInforme(payload);
      if (resultado) {
        setModalAbierto(false);
        addToast("success", "Informe guardado correctamente.");
        /* FIX ESTRICTO: Obligar a recargar los datos de Supabase para actualizar la tabla */
        await cargarInformes();
      } else {
        addToast("error", "Error al guardar el informe. Intente de nuevo.");
      }
    } catch {
      addToast("error", "Error al guardar el informe. Intente de nuevo.");
    }
  };

  /* ── Render ──────────────────────────────────────────────── */
  return (
    <div className="space-y-5">
      {/* Header + Botón */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-[var(--color-gold)]" />
            Informes de Avance Mensual
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Registro periódico del estado y evolución del expediente.
          </p>
        </div>
        <button
          onClick={() => setModalAbierto(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white
                     bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     transition-all"
        >
          <Plus className="w-4 h-4" />
          Nuevo Informe
        </button>
      </div>

      {/* Contenido */}
      {cargando ? (
        <InformesSkeleton />
      ) : informes.length === 0 ? (
        /* ── Empty State ──────────────────────────────────── */
        <div className="flex flex-col items-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 mb-4">
            <FileText className="w-7 h-7 text-gray-300" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold text-gray-700">
            Sin informes registrados
          </p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            Presiona &quot;Nuevo Informe&quot; para registrar el primer avance del
            caso.
          </p>
        </div>
      ) : (
        /* ── Feed de informes ─────────────────────────────── */
        <div className="space-y-3">
          {informes.map((informe) => (
            <div
              key={informe.id}
              className="bg-white rounded-lg border border-gray-100 shadow-sm p-4
                         hover:shadow-md hover:border-gray-200 transition-all duration-200"
            >
              {/* Badge período */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded">
                  <CalendarDays className="w-3 h-3" />
                  {informe.mesAnio}
                </span>
                {informe.createdAt && (
                  <span className="text-[10px] text-gray-400">
                    {new Date(informe.createdAt).toLocaleDateString("es-BO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>

              {/* Secciones del informe */}
              <div className="space-y-3">
                {informe.resumenProceso && (
                  <InformeSection
                    icon={<FileText className="w-3.5 h-3.5" />}
                    titulo="Resumen del Proceso"
                    contenido={informe.resumenProceso}
                  />
                )}
                {informe.estadoActual && (
                  <InformeSection
                    icon={<ClipboardList className="w-3.5 h-3.5" />}
                    titulo="Estado Actual"
                    contenido={informe.estadoActual}
                  />
                )}
                {informe.medidasPrecautorias && (
                  <InformeSection
                    icon={<Shield className="w-3.5 h-3.5" />}
                    titulo="Medidas Precautorias"
                    contenido={informe.medidasPrecautorias}
                  />
                )}
                {informe.comentario && (
                  <InformeSection
                    icon={<MessageSquare className="w-3.5 h-3.5" />}
                    titulo="Comentario"
                    contenido={informe.comentario}
                  />
                )}
              </div>

              {/* Sin contenido (all fields empty) */}
              {!informe.resumenProceso &&
                !informe.estadoActual &&
                !informe.medidasPrecautorias &&
                !informe.comentario && (
                  <p className="text-xs text-gray-400 italic">
                    Informe registrado sin notas adicionales.
                  </p>
                )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalAbierto && userId && (
        <CrearInformeModal
          expedienteId={expedienteId}
          creadoPor={userId}
          onClose={() => setModalAbierto(false)}
          onSave={handleSave}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

/* ── Sub-componente: Sección del informe ───────────────────── */
function InformeSection({
  icon,
  titulo,
  contenido,
}: {
  icon: React.ReactNode;
  titulo: string;
  contenido: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-gray-400">{icon}</span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {titulo}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap pl-5">
        {contenido}
      </p>
    </div>
  );
}
