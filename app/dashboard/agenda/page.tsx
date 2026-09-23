"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import {
  CalendarDays,
  Plus,
  Clock,
  AlertTriangle,
  CheckSquare,
} from "lucide-react";
import {
  EventoAgendaDetallado,
} from "@/domain/entities/EventoAgenda";
import { obtenerEventos } from "@/infrastructure/repositories/agendaRepository";
import { Button } from "@/components/ui/Button";
import CalendarioInteractivo from "@/components/agenda/CalendarioInteractivo";
import ModalEvento from "@/components/agenda/ModalEvento";
import type { ToastData } from "@/components/agenda/ModalEvento";

function esUrgente(fechaInicio: string): boolean {
  const ahora = new Date();
  const inicio = new Date(fechaInicio);
  const diferenciaMs = inicio.getTime() - ahora.getTime();
  const horasRestantes = diferenciaMs / (1000 * 60 * 60);
  return horasRestantes >= 0 && horasRestantes <= 48;
}

export default function AgendaPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto py-24 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-transparent border-gray-400 mx-auto" />
        </div>
      }
    >
      <AgendaPageContent />
    </Suspense>
  );
}

function AgendaPageContent() {
  const [eventos, setEventos] = useState<EventoAgendaDetallado[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const cargarEventos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await obtenerEventos();
      setEventos(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al cargar los eventos."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEventos();
  }, [cargarEventos]);

  const eventosPendientes = eventos.filter(
    (e) => e.estado === "pendiente"
  ).length;
  const eventosUrgentes = eventos.filter(
    (e) => e.estado === "pendiente" && esUrgente(e.fechaInicio)
  ).length;
  const eventosCompletados = eventos.filter(
    (e) => e.estado === "completado"
  ).length;

  const handleToast = useCallback((data: ToastData) => setToast(data), []);

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-up">
      {/* ── Cabecera ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Agenda Legal
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Centro de control visual — audiencias, reuniones, vencimientos y
            tareas.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setModalCrearAbierto(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Evento
        </Button>
      </div>

      {/* ── Error global ──────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3 text-red-800 text-sm font-medium">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* ── KPI Cards (compactas, inline) ──────────────────────── */}
      {!isLoading && !error && eventos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {/* Pendientes */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-amber-50 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold text-gray-900 leading-none">
                {eventosPendientes}
              </p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                Pendientes
              </p>
            </div>
          </div>

          {/* Urgentes (48h) */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold text-gray-900 leading-none">
                {eventosUrgentes}
              </p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                Próximos (48h)
              </p>
            </div>
          </div>

          {/* Completados */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-emerald-50 flex items-center justify-center shrink-0">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xl font-bold text-gray-900 leading-none">
                {eventosCompletados}
              </p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                Completados
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Calendario Interactivo ─────────────────────────────── */}
      {!error && (
        <CalendarioInteractivo
          eventosIniciales={eventos}
          onEventosCambiaron={cargarEventos}
        />
      )}

      {/* ── Modal de creación directa (botón cabecera) ─────────── */}
      <ModalEvento
        isOpen={modalCrearAbierto}
        onClose={() => setModalCrearAbierto(false)}
        modo="crear"
        onGuardar={cargarEventos}
        onToast={handleToast}
      />

      {/* ── Toast global ──────────────────────────────────────── */}
      {toast && (
        <div
          className={`
            fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border
            animate-slide-in
            ${toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}
          `}
        >
          {toast.type === "success" ? (
            <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="ml-2 p-1 rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Cerrar notificación"
          >
            <span className="text-sm">✕</span>
          </button>
        </div>
      )}
    </div>
  );
}
