"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput, EventClickArg, EventDropArg } from "@fullcalendar/core";
import type { DateClickArg, EventResizeDoneArg } from "@fullcalendar/interaction";
import {
  CheckSquare,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  EventoAgendaDetallado,
  TipoEventoAgenda,
} from "@/domain/entities/EventoAgenda";
import {
  obtenerEventos,
  actualizarEvento,
  eliminarEvento,
} from "@/infrastructure/repositories/agendaRepository";
import ModalEvento from "@/components/agenda/ModalEvento";
import type { ToastData } from "@/components/agenda/ModalEvento";
import EliminarEventoDialog from "@/app/dashboard/agenda/Modals/EliminarEventoDialog";

/* ══════════════════════════════════════════════════════════════
   CONSTANTES: Paleta de colores semánticos por tipo de evento
   ══════════════════════════════════════════════════════════════ */

const COLORES_TIPO: Record<TipoEventoAgenda, string> = {
  audiencia: "#dc2626",   // Rojo corporativo — Urgencia / Inamovible
  vencimiento: "#f97316", // Naranja — Alerta temporal
  reunion: "#2563eb",     // Azul corporativo — Coordinación
  tarea: "#64748b",       // Gris pizarra — Trabajo interno
};

/* ══════════════════════════════════════════════════════════════
   MAPEO: EventoAgendaDetallado → EventInput de FullCalendar
   ══════════════════════════════════════════════════════════════ */

function mapearAEventoFullCalendar(
  evento: EventoAgendaDetallado
): EventInput {
  return {
    id: evento.id,
    title: evento.titulo,
    start: evento.fechaInicio,
    end: evento.fechaFin,
    backgroundColor: COLORES_TIPO[evento.tipoEvento] ?? "#64748b",
    borderColor: COLORES_TIPO[evento.tipoEvento] ?? "#64748b",
    textColor: "#ffffff",
    extendedProps: {
      tipoEvento: evento.tipoEvento,
      estado: evento.estado,
      descripcion: evento.descripcion,
      expediente: evento.expediente,
      asignado: evento.asignado,
      asignadoA: evento.asignadoA,
      expedienteId: evento.expedienteId,
      creadoPor: evento.creadoPor,
      creadoEn: evento.creadoEn,
    },
  };
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: Toast de retroalimentación
   ══════════════════════════════════════════════════════════════ */

function Toast({ data, onClose }: { data: ToastData; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = data.type === "success";

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border
        animate-slide-in
        ${isSuccess ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"}
      `}
    >
      {isSuccess ? (
        <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
      )}
      <p className="text-sm font-medium">{data.message}</p>
      <button
        onClick={onClose}
        className="ml-2 p-1 rounded-lg hover:bg-black/5 transition-colors"
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: Skeleton de carga del calendario
   ══════════════════════════════════════════════════════════════ */

function CalendarioSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-fade-in">
      {/* Toolbar skeleton */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="skeleton h-8 w-8 rounded-md" />
          <div className="skeleton h-8 w-8 rounded-md" />
          <div className="skeleton h-8 w-16 rounded-md" />
        </div>
        <div className="skeleton h-6 w-40 rounded" />
        <div className="flex items-center gap-2">
          <div className="skeleton h-8 w-14 rounded-md" />
          <div className="skeleton h-8 w-16 rounded-md" />
          <div className="skeleton h-8 w-12 rounded-md" />
        </div>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="py-3 flex justify-center">
            <div className="skeleton h-3 w-8 rounded" />
          </div>
        ))}
      </div>

      {/* Grid cells */}
      {Array.from({ length: 5 }).map((_, row) => (
        <div key={row} className="grid grid-cols-7 border-b border-gray-50">
          {Array.from({ length: 7 }).map((_, col) => (
            <div
              key={col}
              className="h-24 p-2 border-r border-gray-50 last:border-r-0"
            >
              <div className="skeleton h-3 w-5 rounded mb-2" />
              {row % 2 === 0 && col % 3 === 0 && (
                <div className="skeleton h-4 w-full rounded mb-1" />
              )}
              {row % 3 === 1 && col % 2 === 0 && (
                <>
                  <div className="skeleton h-4 w-full rounded mb-1" />
                  <div className="skeleton h-4 w-3/4 rounded" />
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL: CalendarioInteractivo
   ══════════════════════════════════════════════════════════════ */

export interface CalendarioInteractivoProps {
  eventosIniciales: EventoAgendaDetallado[];
  onEventosCambiaron: () => void;
}

export default function CalendarioInteractivo({
  eventosIniciales,
  onEventosCambiaron,
}: CalendarioInteractivoProps) {
  /* ── Estado ─────────────────────────────────────────────────── */
  const [eventos, setEventos] = useState<EventoAgendaDetallado[]>(eventosIniciales);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  /* ── Modal de creación / edición ────────────────────────────── */
  const [modalModo, setModalModo] = useState<"crear" | "editar" | null>(null);
  const [datosModal, setDatosModal] = useState<
    (Partial<import("@/domain/entities/EventoAgenda").EventoAgenda> & { id?: string }) | undefined
  >(undefined);

  /* ── Diálogo de eliminación ─────────────────────────────────── */
  const [eventoEliminar, setEventoEliminar] = useState<EventoAgendaDetallado | null>(null);

  /* ── Ref al calendario para acceso imperativo ──────────────── */
  const calendarRef = useRef<FullCalendar>(null);

  /* ── Sincronizar cuando cambian los eventos iniciales ──────── */
  useEffect(() => {
    setEventos(eventosIniciales);
  }, [eventosIniciales]);

  /* ── Convertir eventos del dominio al formato FullCalendar ─── */
  const eventosFC: EventInput[] = eventos.map(mapearAEventoFullCalendar);

  /* ── Toast handlers ─────────────────────────────────────────── */
  const handleToast = useCallback((data: ToastData) => setToast(data), []);
  const handleCerrarToast = useCallback(() => setToast(null), []);

  /* ── Re-fetch de eventos ────────────────────────────────────── */
  const refetchEventos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await obtenerEventos();
      setEventos(data);
      onEventosCambiaron();
    } catch {
      handleToast({
        message: "Error al recargar los eventos.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onEventosCambiaron, handleToast]);

  /* ══════════════════════════════════════════════════════════════
     HANDLERS INTERACTIVOS DE FULLCALENDAR
     ══════════════════════════════════════════════════════════════ */

  /** Clic en celda vacía → Abrir modal de creación con fecha pre-inyectada */
  const handleDateClick = useCallback((info: DateClickArg) => {
    const fechaClickeada = new Date(info.dateStr);
    // Si la vista es dayGrid (todo el día), setear hora 09:00 por defecto
    if (!info.dateStr.includes("T")) {
      fechaClickeada.setHours(9, 0, 0, 0);
    }

    setDatosModal({
      fechaInicio: fechaClickeada.toISOString(),
    });
    setModalModo("crear");
  }, []);

  /** Clic en evento → Abrir modal de edición con datos del evento */
  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      const eventoId = info.event.id;
      const eventoCompleto = eventos.find((e) => e.id === eventoId);

      if (!eventoCompleto) return;

      setDatosModal({
        id: eventoCompleto.id,
        titulo: eventoCompleto.titulo,
        descripcion: eventoCompleto.descripcion,
        tipoEvento: eventoCompleto.tipoEvento,
        estado: eventoCompleto.estado,
        fechaInicio: eventoCompleto.fechaInicio,
        fechaFin: eventoCompleto.fechaFin,
        expedienteId: eventoCompleto.expedienteId,
        asignadoA: eventoCompleto.asignadoA,
      });
      setModalModo("editar");
    },
    [eventos]
  );

  /** Drag & drop: actualización optimista con rollback en error */
  const handleEventDrop = useCallback(
    async (info: EventDropArg) => {
      const eventoId = info.event.id;
      const nuevaInicio = info.event.start;
      const nuevaFin = info.event.end;

      if (!nuevaInicio) {
        info.revert();
        return;
      }

      try {
        await actualizarEvento(eventoId, {
          fechaInicio: nuevaInicio.toISOString(),
          fechaFin: nuevaFin
            ? nuevaFin.toISOString()
            : nuevaInicio.toISOString(),
        });

        // Actualizar estado local
        setEventos((prev) =>
          prev.map((e) =>
            e.id === eventoId
              ? {
                  ...e,
                  fechaInicio: nuevaInicio.toISOString(),
                  fechaFin: nuevaFin
                    ? nuevaFin.toISOString()
                    : nuevaInicio.toISOString(),
                }
              : e
          )
        );

        handleToast({
          message: "Evento guardado en la agenda.",
          type: "success",
        });
        onEventosCambiaron();
      } catch {
        info.revert();
        handleToast({
          message: "No se pudo actualizar el evento. Revisa tu conexión.",
          type: "error",
        });
      }
    },
    [handleToast, onEventosCambiaron]
  );

  /** Resize: misma lógica que drag & drop */
  const handleEventResize = useCallback(
    async (info: EventResizeDoneArg) => {
      const eventoId = info.event.id;
      const nuevaInicio = info.event.start;
      const nuevaFin = info.event.end;

      if (!nuevaInicio || !nuevaFin) {
        info.revert();
        return;
      }

      try {
        await actualizarEvento(eventoId, {
          fechaInicio: nuevaInicio.toISOString(),
          fechaFin: nuevaFin.toISOString(),
        });

        setEventos((prev) =>
          prev.map((e) =>
            e.id === eventoId
              ? {
                  ...e,
                  fechaInicio: nuevaInicio.toISOString(),
                  fechaFin: nuevaFin.toISOString(),
                }
              : e
          )
        );

        handleToast({
          message: "Evento guardado en la agenda.",
          type: "success",
        });
        onEventosCambiaron();
      } catch {
        info.revert();
        handleToast({
          message: "No se pudo actualizar el evento. Revisa tu conexión.",
          type: "error",
        });
      }
    },
    [handleToast, onEventosCambiaron]
  );

  /* ── Modal handlers ─────────────────────────────────────────── */
  const handleCerrarModal = useCallback(() => {
    setModalModo(null);
    setDatosModal(undefined);
  }, []);

  const handleGuardadoModal = useCallback(() => {
    refetchEventos();
  }, [refetchEventos]);

  /* ── Eliminación ────────────────────────────────────────────── */
  const handleConfirmarEliminar = useCallback(async () => {
    if (!eventoEliminar) return;
    try {
      await eliminarEvento(eventoEliminar.id);
      handleToast({
        message: "Evento eliminado correctamente.",
        type: "success",
      });
      setEventoEliminar(null);
      refetchEventos();
    } catch (err) {
      handleToast({
        message:
          err instanceof Error
            ? err.message
            : "No se pudo eliminar el evento.",
        type: "error",
      });
    }
  }, [eventoEliminar, refetchEventos, handleToast]);

  /* ══════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════ */

  if (isLoading && eventos.length === 0) {
    return <CalendarioSkeleton />;
  }

  return (
    <>
      {/* ── Leyenda de colores ──────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        {(
          [
            { tipo: "audiencia", label: "Audiencia" },
            { tipo: "vencimiento", label: "Vencimiento" },
            { tipo: "reunion", label: "Reunión" },
            { tipo: "tarea", label: "Tarea" },
          ] as const
        ).map(({ tipo, label }) => (
          <div key={tipo} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: COLORES_TIPO[tipo] }}
            />
            <span className="text-xs font-medium text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Calendario FullCalendar ─────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 sm:p-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="es"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            buttonText={{
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
            }}
            events={eventosFC}
            editable={true}
            selectable={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            dayMaxEvents={3}
            height="auto"
            contentHeight="auto"
            firstDay={1}
            nowIndicator={true}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
              hour12: false,
            }}
            slotLabelFormat={{
              hour: "2-digit",
              minute: "2-digit",
              meridiem: false,
              hour12: false,
            }}
            allDayText="Todo el día"
            noEventsText="Sin eventos"
            moreLinkText={(n) => `+${n} más`}
          />
        </div>
      </div>

      {/* ── Modal Crear / Editar ────────────────────────────────── */}
      <ModalEvento
        isOpen={modalModo !== null}
        onClose={handleCerrarModal}
        modo={modalModo ?? "crear"}
        datosIniciales={datosModal}
        onGuardar={handleGuardadoModal}
        onToast={handleToast}
      />

      {/* ── Diálogo de eliminación ──────────────────────────────── */}
      {eventoEliminar && (
        <EliminarEventoDialog
          isOpen={true}
          tituloEvento={eventoEliminar.titulo}
          onConfirm={handleConfirmarEliminar}
          onClose={() => setEventoEliminar(null)}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────────── */}
      {toast && <Toast data={toast} onClose={handleCerrarToast} />}
    </>
  );
}
