"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EliminarEventoDialogProps {
  isOpen: boolean;
  tituloEvento: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export default function EliminarEventoDialog({
  isOpen,
  tituloEvento,
  onConfirm,
  onClose,
}: EliminarEventoDialogProps) {
  const [eliminando, setEliminando] = useState(false);

  if (!isOpen) return null;

  async function handleConfirm() {
    setEliminando(true);
    try {
      await onConfirm();
    } finally {
      setEliminando(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icono */}
        <div className="pt-8 pb-2 flex justify-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-600" />
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 pb-2 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Eliminar evento
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            ¿Estás seguro de eliminar{" "}
            <span className="font-semibold text-gray-700">
              &ldquo;{tituloEvento}&rdquo;
            </span>
            ? Esta acción es irreversible y el evento será removido permanentemente de la agenda.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-gray-100 mt-4">
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            disabled={eliminando}
          >
            Cancelar
          </Button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={eliminando}
            className="
              inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold
              bg-red-600 text-white rounded-lg shadow-sm
              hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            {eliminando ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Eliminando…
              </>
            ) : (
              "Sí, eliminar"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
