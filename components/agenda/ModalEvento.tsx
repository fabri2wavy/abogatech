"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Plus, Save, X } from "lucide-react";
import {
  EventoAgenda,
  TipoEventoAgenda,
} from "@/domain/entities/EventoAgenda";
import {
  crearEvento,
  actualizarEvento,
} from "@/infrastructure/repositories/agendaRepository";
import {
  obtenerAbogados,
  obtenerPerfilActual,
} from "@/infrastructure/repositories/usuarioRepository";
import { obtenerExpedientes } from "@/infrastructure/repositories/expedienteRepository";
import { obtenerConfiguraciones } from "@/infrastructure/repositories/configuracionRepository";
import type { ConfiguracionGlobal } from "@/domain/entities/ConfiguracionGlobal";
import type { UsuarioPerfil } from "@/infrastructure/repositories/usuarioRepository";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/SelectField";

/* ══════════════════════════════════════════════════════════════
   Tipos públicos
   ══════════════════════════════════════════════════════════════ */

export interface ToastData {
  message: string;
  type: "success" | "error";
}

export interface ModalEventoProps {
  isOpen: boolean;
  onClose: () => void;
  modo: "crear" | "editar";
  datosIniciales?: Partial<EventoAgenda> & { id?: string };
  onGuardar: () => void;
  onToast: (toast: ToastData) => void;
}

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */

interface ExpedienteOption {
  id: string;
  numeroCaso: string;
  titulo: string;
}

/** Convierte ISO string a formato datetime-local (YYYY-MM-DDTHH:mm) */
function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ══════════════════════════════════════════════════════════════
   COMPONENTE: Modal unificado para Crear / Editar Evento
   ══════════════════════════════════════════════════════════════ */

export default function ModalEvento({
  isOpen,
  onClose,
  modo,
  datosIniciales,
  onGuardar,
  onToast,
}: ModalEventoProps) {
  /* ── Estado del formulario ─────────────────────────────────── */
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoEvento, setTipoEvento] = useState<TipoEventoAgenda>("tarea");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [expedienteId, setExpedienteId] = useState("");
  const [asignadoA, setAsignadoA] = useState("");
  const [guardando, setGuardando] = useState(false);

  /* ── Opciones para selects ─────────────────────────────────── */
  const [asignables, setAsignables] = useState<UsuarioPerfil[]>([]);
  const [expedientes, setExpedientes] = useState<ExpedienteOption[]>([]);
  const [tiposEventoDB, setTiposEventoDB] = useState<ConfiguracionGlobal[]>([]);
  const [cargandoOpciones, setCargandoOpciones] = useState(true);

  /* ── Sincronizar formulario con datosIniciales ─────────────── */
  useEffect(() => {
    if (!isOpen) return;

    if (modo === "editar" && datosIniciales) {
      setTitulo(datosIniciales.titulo ?? "");
      setDescripcion(datosIniciales.descripcion ?? "");
      setTipoEvento(datosIniciales.tipoEvento ?? "tarea");
      setFechaInicio(
        datosIniciales.fechaInicio
          ? toDatetimeLocal(datosIniciales.fechaInicio)
          : ""
      );
      setFechaFin(
        datosIniciales.fechaFin
          ? toDatetimeLocal(datosIniciales.fechaFin)
          : ""
      );
      setExpedienteId(datosIniciales.expedienteId ?? "");
      setAsignadoA(datosIniciales.asignadoA ?? "");
    } else if (modo === "crear") {
      setTitulo("");
      setDescripcion("");
      setTipoEvento("tarea");
      setExpedienteId("");
      setAsignadoA("");

      if (datosIniciales?.fechaInicio) {
        setFechaInicio(toDatetimeLocal(datosIniciales.fechaInicio));
        // Default: +1h de duración
        const finDate = new Date(datosIniciales.fechaInicio);
        finDate.setHours(finDate.getHours() + 1);
        setFechaFin(toDatetimeLocal(finDate.toISOString()));
      } else {
        setFechaInicio("");
        setFechaFin("");
      }
    }
  }, [isOpen, modo, datosIniciales]);

  /* ── Cargar opciones de selects al abrir ────────────────────── */
  useEffect(() => {
    if (!isOpen) return;

    let cancelado = false;

    async function cargarOpciones() {
      setCargandoOpciones(true);
      try {
        const [asignablesData, expedientesData, resTiposEvento, perfilActual] =
          await Promise.all([
            obtenerAbogados(),
            obtenerExpedientes(),
            obtenerConfiguraciones("tipo_evento"),
            obtenerPerfilActual(),
          ]);

        if (cancelado) return;

        setAsignables(asignablesData);
        if (resTiposEvento.data) setTiposEventoDB(resTiposEvento.data);
        setExpedientes(
          expedientesData.map(
            (e: { id: string; numeroCaso: string; titulo: string }) => ({
              id: e.id,
              numeroCaso: e.numeroCaso,
              titulo: e.titulo,
            })
          )
        );

        // Auto-seleccionar al usuario actual en modo crear si aún no hay uno elegido.
        // Esto garantiza que el admin pueda crear eventos para sí mismo
        // incluso cuando el sistema aún no tiene más miembros registrados.
        if (modo === "crear" && !asignadoA && perfilActual) {
          setAsignadoA(perfilActual.id);
        }
      } catch {
        if (!cancelado) {
          onToast({
            message: "Error al cargar opciones del formulario.",
            type: "error",
          });
        }
      } finally {
        if (!cancelado) setCargandoOpciones(false);
      }
    }

    cargarOpciones();
    return () => {
      cancelado = true;
    };
  }, [isOpen, onToast]);

  /* ── Submit ────────────────────────────────────────────────── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!titulo.trim() || !fechaInicio || !fechaFin || !asignadoA) {
      onToast({
        message: "Completa todos los campos obligatorios.",
        type: "error",
      });
      return;
    }

    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      onToast({
        message: "La fecha de fin debe ser posterior a la de inicio.",
        type: "error",
      });
      return;
    }

    setGuardando(true);

    try {
      if (modo === "crear") {
        await crearEvento({
          titulo: titulo.trim(),
          descripcion: descripcion.trim() || null,
          tipoEvento,
          estado: "pendiente",
          fechaInicio: new Date(fechaInicio).toISOString(),
          fechaFin: new Date(fechaFin).toISOString(),
          expedienteId: expedienteId || null,
          asignadoA,
        });
        onToast({
          message: "Evento guardado en la agenda.",
          type: "success",
        });
      } else {
        await actualizarEvento(datosIniciales!.id!, {
          titulo: titulo.trim(),
          descripcion: descripcion.trim() || null,
          tipoEvento,
          fechaInicio: new Date(fechaInicio).toISOString(),
          fechaFin: new Date(fechaFin).toISOString(),
          expedienteId: expedienteId || null,
          asignadoA,
        });
        onToast({
          message: "Evento actualizado correctamente.",
          type: "success",
        });
      }

      onGuardar();
      onClose();
    } catch (err) {
      onToast({
        message:
          err instanceof Error
            ? err.message
            : "Error inesperado al guardar el evento.",
        type: "error",
      });
    } finally {
      setGuardando(false);
    }
  }

  if (!isOpen) return null;

  const esEdicion = modo === "editar";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                esEdicion ? "bg-amber-50" : "bg-blue-50"
              }`}
            >
              <CalendarDays
                className={`w-5 h-5 ${
                  esEdicion ? "text-amber-600" : "text-blue-600"
                }`}
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {esEdicion ? "Editar Evento" : "Nuevo Evento"}
              </h2>
              <p className="text-xs text-gray-400">
                {esEdicion
                  ? "Modifica los datos del evento seleccionado"
                  : "Programa una actividad en la agenda legal"}
              </p>
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

        {/* ── Formulario ──────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-1">
          <FormField
            label="Título del evento"
            id={`${modo}-evento-titulo`}
            variant="light"
            placeholder="Ej: Audiencia inicial – Caso García"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <FormField
            label="Descripción (opcional)"
            id={`${modo}-evento-descripcion`}
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
              id={`${modo}-evento-tipo`}
              variant="light"
              options={[
                { value: "audiencia", label: "Audiencia" },
                { value: "reunion", label: "Reunión" },
                { value: "vencimiento", label: "Vencimiento" },
                { value: "tarea", label: "Tarea" },
                ...tiposEventoDB
                  .filter(
                    (t) =>
                      !["audiencia", "reunion", "vencimiento", "tarea"].includes(
                        t.valor.toLowerCase()
                      )
                  )
                  .map((t) => ({ value: t.valor, label: t.valor })),
              ]}
              value={tipoEvento}
              onChange={(e) =>
                setTipoEvento(e.target.value as TipoEventoAgenda)
              }
            />

            <SelectField
              label="Asignado a"
              id={`${modo}-evento-asignado`}
              variant="light"
              placeholder={cargandoOpciones ? "Cargando..." : "Seleccionar"}
              options={asignables.map((m) => ({
                value: m.id,
                label: m.nombre_completo,
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
              id={`${modo}-evento-fecha-inicio`}
              type="datetime-local"
              variant="light"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
            <FormField
              label="Fecha y hora fin"
              id={`${modo}-evento-fecha-fin`}
              type="datetime-local"
              variant="light"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
            />
          </div>

          <SelectField
            label="Expediente vinculado (opcional)"
            id={`${modo}-evento-expediente`}
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

          {/* ── Acciones ──────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              disabled={guardando}
            >
              Cancelar
            </Button>
            <Button variant="primary" type="submit" loading={guardando}>
              {esEdicion ? (
                <>
                  <Save className="w-4 h-4 mr-1.5" />
                  Guardar Cambios
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1.5" />
                  Crear Evento
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
