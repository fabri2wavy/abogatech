"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, FileSignature, CheckCircle2 } from "lucide-react";
import { ExpedienteForm, ExpedienteFormValues } from "@/components/casos/ExpedienteForm";
import type { ConfiguracionGlobal } from "@/domain/entities/ConfiguracionGlobal";
import type { UsuarioPerfil } from "@/domain/entities/UsuarioPerfil";

const FORM_ID = "modal-crear-expediente-form";

interface ModalCrearExpedienteProps {
  listaClientes: { id: string; nombreCompleto: string }[];
  listaAbogados: { id: string; nombre_completo: string }[];
  juzgadosDB: ConfiguracionGlobal[];
  materiasDB: ConfiguracionGlobal[];
  perfilActual: UsuarioPerfil | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: ExpedienteFormValues) => Promise<void>;
}

export function ModalCrearExpediente({
  listaClientes,
  listaAbogados,
  juzgadosDB,
  materiasDB,
  perfilActual,
  isSubmitting,
  onClose,
  onSubmit,
}: ModalCrearExpedienteProps) {
  /* ESC cierre deshabilitado: el modal solo se cierra con X o Cancelar */

  /* Prevent body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6"
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 flex-shrink-0">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-600">
              <FileSignature className="w-5 h-5" />
            </span>
            Apertura de Expediente
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <ExpedienteForm
            formId={FORM_ID}
            listaClientes={listaClientes}
            listaAbogados={listaAbogados}
            juzgadosDB={juzgadosDB}
            materiasDB={materiasDB}
            perfilActual={perfilActual}
            isLoading={isSubmitting}
            onSubmit={onSubmit}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form={FORM_ID}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-60 min-w-[160px] justify-center"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
            )}
            {isSubmitting ? "Guardando..." : "Registrar Expediente"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
