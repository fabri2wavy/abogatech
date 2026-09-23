"use client";

import { useState, useEffect } from "react";
import { Share2, AlertTriangle, Users } from "lucide-react";
import { obtenerAbogadosYSocios, compartirExpediente } from "@/infrastructure/repositories/expedienteAccesoRepository";
import type { UsuarioPerfil } from "@/domain/entities/UsuarioPerfil";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

interface Props {
  expedienteId: string;
  usuarioActualId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalCompartirExpediente({ expedienteId, usuarioActualId, onClose, onSuccess }: Props) {
  const [colegas, setColegas] = useState<UsuarioPerfil[]>([]);
  const [cargando, setCargando] = useState(true);
  const [abogadoSeleccionado, setAbogadoSeleccionado] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function cargarColegas() {
      const data = await obtenerAbogadosYSocios();
      // Filtrar al usuario actual si está en la lista
      setColegas(data.filter((c) => c.id !== usuarioActualId));
      setCargando(false);
    }
    cargarColegas();
  }, [usuarioActualId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!abogadoSeleccionado) {
      setErrorMsg("Debes seleccionar un abogado o asociado senior.");
      return;
    }

    setGuardando(true);
    setErrorMsg("");

    const resultado = await compartirExpediente(expedienteId, abogadoSeleccionado, usuarioActualId);

    if (resultado.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(resultado.error || "Ocurrió un error al compartir el expediente.");
    }
    setGuardando(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <div
        className="relative w-full max-w-md bg-[var(--color-surface)] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[var(--color-surface-border)] flex items-center justify-between bg-[var(--color-surface-card)]">
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
            <Share2 className="w-5 h-5 text-[var(--color-gold)]" />
            Compartir Expediente
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] rounded-full p-1.5 transition-colors"
          >
            <span className="sr-only">Cerrar</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6">
            <Alert variant="error" visible={!!errorMsg}>
              {errorMsg}
            </Alert>

            <div className="space-y-4">
              <div>
                <label htmlFor="abogado" className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                  Seleccionar Abogado o Asociado Senior
                </label>
                
                {cargando ? (
                  <div className="flex items-center gap-3 p-3 border border-[var(--color-surface-border)] rounded-lg text-sm text-[var(--color-text-muted)]">
                    <div className="w-4 h-4 rounded-full border-2 border-[var(--color-surface-border)] border-t-[var(--color-gold)] animate-spin" />
                    Cargando lista...
                  </div>
                ) : colegas.length === 0 ? (
                  <div className="p-4 border border-[var(--color-surface-border)] rounded-lg text-sm text-[var(--color-text-muted)] text-center bg-[var(--color-surface-hover)]">
                    <Users className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    No hay otros abogados o asociados senior disponibles.
                  </div>
                ) : (
                  <select
                    id="abogado"
                    value={abogadoSeleccionado}
                    onChange={(e) => {
                      setAbogadoSeleccionado(e.target.value);
                      setErrorMsg("");
                    }}
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-[var(--color-surface-border)]
                               bg-[var(--color-surface-card)] text-[var(--color-text-primary)]
                               focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]
                               transition-all"
                    disabled={guardando}
                  >
                    <option value="">-- Selecciona --</option>
                    {colegas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre_completo} ({c.rol === 'asociado_senior' ? 'Asociado Senior' : 'Abogado'})
                      </option>
                    ))}
                  </select>
                )}
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  Al compartir, este usuario podrá ver y gestionar el caso desde su panel "Mis Casos".
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-[var(--color-surface-hover)] border-t border-[var(--color-surface-border)] flex justify-end gap-3 rounded-b-xl">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={guardando}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={guardando}
              disabled={!abogadoSeleccionado || guardando || colegas.length === 0}
            >
              Compartir
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
