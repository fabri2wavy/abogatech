"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Save, Gavel } from "lucide-react";
import { actualizarExpediente } from "@/infrastructure/repositories/expedienteRepository";

function ModalPortal({ children }: { children: React.ReactNode }) {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

export function ModalEditarExpediente({
  expediente,
  onClose,
  onSuccess,
}: {
  expediente: any;
  onClose: () => void;
  onSuccess: (updatedData: any) => void;
}) {
  const [numeroCaso, setNumeroCaso] = useState(expediente.numeroCaso || "");
  const [juzgado, setJuzgado] = useState(expediente.juzgado || "");
  const [titulo, setTitulo] = useState(expediente.titulo || "");
  const [materia, setMateria] = useState(expediente.materia || "");
  const [parteContraria, setParteContraria] = useState(expediente.parteContraria || "");
  
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState("");

  const handleGuardar = async () => {
    setFormError("");
    setGuardando(true);

    const datosActualizados = {
      numeroCaso: numeroCaso.trim(),
      juzgado: juzgado.trim(),
      titulo: titulo.trim(),
      materia: materia.trim(),
      parteContraria: parteContraria.trim(),
    };

    const exito = await actualizarExpediente(expediente.id, datosActualizados);

    if (!exito) {
      setFormError("Error al actualizar el expediente. Inténtalo de nuevo.");
      setGuardando(false);
      return;
    }

    onSuccess(datosActualizados);
    onClose();
  };

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
        <div
          className="relative w-full max-w-lg bg-[var(--color-surface-card)] rounded-xl shadow-2xl
                     max-h-[90vh] overflow-y-auto animate-fade-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[var(--color-surface-card)] px-6 py-4 border-b border-[var(--color-surface-border)] flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Gavel className="w-5 h-5 text-[var(--color-gold)]" strokeWidth={2} />
              Editar Expediente
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Error */}
            {formError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">
                NUREJ / Nº Caso
              </label>
              <input
                type="text"
                value={numeroCaso}
                onChange={(e) => setNumeroCaso(e.target.value)}
                placeholder="Ej. 12345678"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--color-surface-border)]
                           bg-[var(--color-surface-card)] text-[var(--color-text-primary)]
                           focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]
                           transition-all placeholder:text-[var(--color-text-muted)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">
                Juzgado
              </label>
              <input
                type="text"
                value={juzgado}
                onChange={(e) => setJuzgado(e.target.value)}
                placeholder="Ej. Juzgado Público Civil y Comercial"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--color-surface-border)]
                           bg-[var(--color-surface-card)] text-[var(--color-text-primary)]
                           focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]
                           transition-all placeholder:text-[var(--color-text-muted)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">
                Título / Síntesis
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Breve descripción del caso"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--color-surface-border)]
                           bg-[var(--color-surface-card)] text-[var(--color-text-primary)]
                           focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]
                           transition-all placeholder:text-[var(--color-text-muted)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">
                  Materia
                </label>
                <input
                  type="text"
                  value={materia}
                  onChange={(e) => setMateria(e.target.value)}
                  placeholder="Ej. Civil, Penal"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--color-surface-border)]
                             bg-[var(--color-surface-card)] text-[var(--color-text-primary)]
                             focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]
                             transition-all placeholder:text-[var(--color-text-muted)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-1.5">
                  Parte Contraria
                </label>
                <input
                  type="text"
                  value={parteContraria}
                  onChange={(e) => setParteContraria(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--color-surface-border)]
                             bg-[var(--color-surface-card)] text-[var(--color-text-primary)]
                             focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]
                             transition-all placeholder:text-[var(--color-text-muted)]"
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-[var(--color-surface-card)] px-6 py-4 border-t border-[var(--color-surface-border)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="px-4 py-2.5 text-sm font-semibold rounded-lg border border-[var(--color-surface-border)]
                         text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]
                         transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleGuardar}
              disabled={guardando}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg
                         bg-[var(--color-navy)] text-[var(--color-gold-light)]
                         shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]
                         transition-all disabled:opacity-50"
            >
              {guardando ? (
                <div className="w-4 h-4 rounded-full border-2 border-[var(--color-gold-light)]/30 border-t-[var(--color-gold-light)] animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
