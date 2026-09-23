"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Plus, X } from "lucide-react";
import {
  EventoAgendaDetallado,
  TipoEventoAgenda,
} from "@/domain/entities/EventoAgenda";
import { actualizarEvento } from "@/infrastructure/repositories/agendaRepository";
import { obtenerEquipo } from "@/infrastructure/repositories/equipoRepository";
import { obtenerExpedientes } from "@/infrastructure/repositories/expedienteRepository";
import { MiembroEquipo } from "@/domain/entities/MiembroEquipo";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/SelectField";

interface EditarEventoModalProps {
  isOpen: boolean;
  evento: EventoAgendaDetallado;
  onClose: () => void;
  onActualizado: () => void;
  onToast: (toast: { message: string; type: "success" | "error" }) => void;
}

interface ExpedienteOption {
  id: string;
  numeroCaso: string;
  titulo: string;
}

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EditarEventoModal({
  isOpen,
  evento,
  onClose,
  onActualizado,
  onToast,
}: EditarEventoModalProps) {
  const [titulo, setTitulo] = useState(evento.titulo);
  const [descripcion, setDescripcion] = useState(evento.descripcion ?? "");
  const [tipoEvento, setTipoEvento] = useState<TipoEventoAgenda>(evento.tipoEvento);
  const [fechaInicio, setFechaInicio] = useState(toDatetimeLocal(evento.fechaInicio));
  const [fechaFin, setFechaFin] = useState(toDatetimeLocal(evento.fechaFin));
  const [expedienteId, setExpedienteId] = useState(evento.expedienteId ?? "");
  const [asignadoA, setAsignadoA] = useState(evento.asignadoA);
  const [guardando, setGuardando] = useState(false);
  const [miembros, setMiembros] = useState<MiembroEquipo[]>([]);
  const [expedientes, setExpedientes] = useState<ExpedienteOption[]>([]);
  const [cargandoOpciones, setCargandoOpciones] = useState(true);

  useEffect(() => {
    setTitulo(evento.titulo);
    setDescripcion(evento.descripcion ?? "");
    setTipoEvento(evento.tipoEvento);
    setFechaInicio(toDatetimeLocal(evento.fechaInicio));
    setFechaFin(toDatetimeLocal(evento.fechaFin));
    setExpedienteId(evento.expedienteId ?? "");
    setAsignadoA(evento.asignadoA);
  }, [evento]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelado = false;

    async function cargarOpciones() {
      setCargandoOpciones(true);
      try {
        const [equipoData, expedientesData] = await Promise.all([
          obtenerEquipo(),
          obtenerExpedientes(),
        ]);

        if (cancelado) return;

        setMiembros(equipoData);
        setExpedientes(
          expedientesData.map((e: { id: string; numeroCaso: string; titulo: string }) => ({
            id: e.id,
            numeroCaso: e.numeroCaso,
            titulo: e.titulo,
          }))
        );
      } catch {
        if (!cancelado) {
          onToast({ message: "Error al cargar opciones del formulario.", type: "error" });
        }
      } finally {
        if (!cancelado) setCargandoOpciones(false);
      }
    }

    cargarOpciones();
    return () => { cancelado = true; };
  }, [isOpen, onToast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!titulo.trim() || !fechaInicio || !fechaFin || !asignadoA) {
      onToast({ message: "Completa todos los campos obligatorios.", type: "error" });
      return;
    }

    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      onToast({ message: "La fecha de fin debe ser posterior a la de inicio.", type: "error" });
      return;
    }

    setGuardando(true);

    try {
      await actualizarEvento(evento.id, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim() || null,
        tipoEvento,
        fechaInicio: new Date(fechaInicio).toISOString(),
        fechaFin: new Date(fechaFin).toISOString(),
        expedienteId: expedienteId || null,
        asignadoA,
      });

      onToast({ message: "Evento actualizado correctamente.", type: "success" });
      onActualizado();
      onClose();
    } catch (err) {
      onToast({
        message: err instanceof Error ? err.message : "Error inesperado al actualizar el evento.",
        type: "error",
      });
    } finally {
      setGuardando(false);
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Editar Evento</h2>
              <p className="text-xs text-gray-400">Modifica los datos del evento seleccionado</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-1">
          <FormField  
            label="Título del evento de"
            id="editar-evento-titulo"
            variant="light"
            placeholder="Ej: Audiencia inicial – Caso García"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <FormField
            label="Descripción (opcional)"
            id="editar-evento-descripcion"
            as="textarea"
            variant="light"
            placeholder="Detalles relevantes del evento..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Tipo de evento"
              id="editar-evento-tipo"
              variant="light"
              options={[
                { value: "audiencia", label: "Audiencia" },
                { value: "reunion", label: "Reunión" },
                { value: "vencimiento", label: "Vencimiento" },
                { value: "tarea", label: "Tarea" },
              ]}
              value={tipoEvento}
              onChange={(e) => setTipoEvento(e.target.value as TipoEventoAgenda)}
            />

            <SelectField
              label="Asignado a"
              id="editar-evento-asignado"
              variant="light"
              placeholder={cargandoOpciones ? "Cargando..." : "Seleccionar"}
              options={miembros.map((m) => ({
                value: m.id,
                label: `${m.nombres} ${m.apellidoPaterno}`,
              }))}
              value={asignadoA}
              onChange={(e) => setAsignadoA(e.target.value)}
              disabled={cargandoOpciones}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Fecha y hora inicio"
              id="editar-evento-fecha-inicio"
              type="datetime-local"
              variant="light"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
            <FormField
              label="Fecha y hora fin"
              id="editar-evento-fecha-fin"
              type="datetime-local"
              variant="light"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
            />
          </div>

          <SelectField
            label="Expediente vinculado (opcional)"
            id="editar-evento-expediente"
            variant="light"
            placeholder={cargandoOpciones ? "Cargando..." : "Ninguno"}
            options={expedientes.map((exp) => ({
              value: exp.id,
              label: `${exp.numeroCaso} — ${exp.titulo}`,
            }))}
            value={expedienteId}
            onChange={(e) => setExpedienteId(e.target.value)}
            disabled={cargandoOpciones}
          />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <Button variant="ghost" type="button" onClick={onClose} disabled={guardando}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={guardando}>
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
