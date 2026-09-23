"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FileText, X, Plus, Pencil } from "lucide-react";
import type { Plantilla, TipoPlantilla } from "@/domain/entities/Plantilla";
import {
  crearPlantillaAction,
  actualizarPlantillaAction,
} from "@/infrastructure/actions/plantillasActions";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { SelectField } from "@/components/ui/SelectField";
import { TAGS_DISPONIBLES } from "@/domain/services/documentGenerator";

/* ══════════════════════════════════════════════════════════════
   Opciones del selector de tipo (enum SQL)
   ══════════════════════════════════════════════════════════════ */

const TIPO_OPTIONS: { value: TipoPlantilla; label: string }[] = [
  { value: "memorial", label: "Memorial" },
  { value: "contrato", label: "Contrato" },
  { value: "poder", label: "Poder" },
  { value: "otro", label: "Otro" },
];

/* ══════════════════════════════════════════════════════════════
   COMPONENTE: PlantillaModal (Crear / Editar)
   ══════════════════════════════════════════════════════════════ */

interface PlantillaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardado: () => void;
  onToast: (variant: "success" | "error", text: string) => void;
  plantillaEditar?: Plantilla | null;
}

export default function PlantillaModal({
  isOpen,
  onClose,
  onGuardado,
  onToast,
  plantillaEditar,
}: PlantillaModalProps) {
  const esEdicion = !!plantillaEditar;

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<TipoPlantilla>("memorial");
  const [descripcion, setDescripcion] = useState("");
  const [contenido, setContenido] = useState("");
  const [guardando, setGuardando] = useState(false);

  /* ── Poblar formulario al abrir en modo edición ─────────── */
  useEffect(() => {
    if (isOpen && plantillaEditar) {
      setNombre(plantillaEditar.nombre);
      setTipo(plantillaEditar.tipo);
      setDescripcion(plantillaEditar.descripcion ?? "");
      setContenido(plantillaEditar.contenido);
    } else if (isOpen) {
      setNombre("");
      setTipo("memorial");
      setDescripcion("");
      setContenido("");
    }
  }, [isOpen, plantillaEditar]);

  /** Inserta un tag en la posición del cursor del textarea */
  function insertarTag(tag: string) {
    const textarea = document.getElementById(
      "plantilla-contenido"
    ) as HTMLTextAreaElement | null;

    if (!textarea) {
      setContenido((prev) => prev + tag);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nuevoContenido =
      contenido.substring(0, start) + tag + contenido.substring(end);

    setContenido(nuevoContenido);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nombre.trim()) {
      onToast("error", "El nombre de la plantilla es obligatorio.");
      return;
    }

    if (!contenido.trim()) {
      onToast("error", "El contenido no puede estar vacío.");
      return;
    }

    setGuardando(true);

    try {
      if (esEdicion && plantillaEditar) {
        const res = await actualizarPlantillaAction(plantillaEditar.id, {
          nombre: nombre.trim(),
          tipo,
          descripcion: descripcion.trim(),
          contenido: contenido.trim(),
        });

        if (!res.success) {
          onToast("error", res.error ?? "Error al actualizar.");
          return;
        }

        onToast("success", "Plantilla actualizada exitosamente.");
      } else {
        const res = await crearPlantillaAction({
          nombre: nombre.trim(),
          tipo,
          descripcion: descripcion.trim(),
          contenido: contenido.trim(),
        });

        if (!res.success) {
          onToast("error", res.error ?? "Error al crear.");
          return;
        }

        onToast("success", "Plantilla creada exitosamente.");
      }

      onGuardado();
    } catch {
      onToast("error", "Error inesperado. Intenta de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4 sm:p-6"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {esEdicion ? "Editar Plantilla" : "Nueva Plantilla"}
              </h2>
              <p className="text-xs text-gray-400">
                {esEdicion
                  ? "Modifica el contenido de la plantilla"
                  : "Crea una plantilla reutilizable para documentos legales"}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Nombre"
              id="plantilla-nombre"
              variant="light"
              placeholder="Ej: Poder General Amplio"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <SelectField
              label="Tipo"
              id="plantilla-tipo"
              variant="light"
              options={TIPO_OPTIONS}
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoPlantilla)}
            />
          </div>

          <FormField
            label="Descripción (opcional)"
            id="plantilla-descripcion"
            variant="light"
            placeholder="Breve descripción del uso de esta plantilla..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />

          {/* ── Editor + Panel de Tags ────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-4">
            {/* Textarea */}
            <div>
              <label
                htmlFor="plantilla-contenido"
                className="block text-[0.7rem] font-medium uppercase tracking-[0.14em] text-[var(--color-text-muted)] mb-2"
              >
                Contenido de la plantilla
              </label>
              <textarea
                id="plantilla-contenido"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Escribe el contenido del documento. Usa los tags del panel derecho para insertar datos dinámicos..."
                className="w-full px-4 py-3 rounded-lg border border-[var(--color-surface-border)] bg-slate-50 text-[var(--color-text-primary)] text-sm leading-relaxed focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)] transition-all resize-y font-mono"
                style={{ minHeight: "400px" }}
                required
              />
            </div>

            {/* Panel de Tags Dinámicos */}
            <div className="lg:pt-7">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)] mb-2">
                Tags Dinámicos
              </p>
              <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">
                Haz click en un tag para insertarlo en la posición del cursor.
              </p>
              <div className="flex flex-col gap-1.5">
                {TAGS_DISPONIBLES.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => insertarTag(tag)}
                    className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-[10px] font-mono border border-slate-200 hover:bg-slate-200 hover:border-slate-300 transition-colors cursor-pointer text-left"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
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
                  <Pencil className="w-4 h-4 mr-1.5" />
                  Guardar Cambios
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1.5" />
                  Crear Plantilla
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
