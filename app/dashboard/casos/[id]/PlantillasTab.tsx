"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  FileText,
  Zap,
  X,
  Copy,
  Download,
  Check,
  Loader2,
} from "lucide-react";
import type { Plantilla, TipoPlantilla } from "@/domain/entities/Plantilla";
import {
  fetchPlantillas,
  generarDocumentoAction,
} from "@/infrastructure/actions/plantillasActions";
import { TAGS_DISPONIBLES } from "@/domain/services/documentGenerator";
import { ToastContainer, useToasts } from "@/components/ui/Toast";

/* ══════════════════════════════════════════════════════════════
   Constantes de estilo por tipo de plantilla
   ══════════════════════════════════════════════════════════════ */

const TIPO_BADGE: Record<TipoPlantilla, { bg: string; text: string; border: string; label: string }> = {
  memorial:  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    label: "Memorial" },
  contrato:  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Contrato" },
  poder:     { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   label: "Poder" },
  otro:      { bg: "bg-slate-100",  text: "text-slate-600",   border: "border-slate-200",   label: "Otro" },
};

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: Skeleton de carga
   ══════════════════════════════════════════════════════════════ */

function PlantillasGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white p-4 space-y-3"
        >
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-3/4 rounded" />
          <div className="skeleton h-9 w-full rounded-lg mt-2" />
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: Empty State
   ══════════════════════════════════════════════════════════════ */

function PlantillasEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mx-auto w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-5 border border-gray-100">
        <FileText className="w-10 h-10 text-gray-300" strokeWidth={1.2} />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
        No hay plantillas disponibles
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
        Aún no se han creado plantillas de documentos. Un administrador puede
        configurarlas desde el panel de Plantillas.
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: Tarjeta de Plantilla
   ══════════════════════════════════════════════════════════════ */

function PlantillaCard({
  plantilla,
  onGenerar,
  isProcessing,
  processingId,
}: {
  plantilla: Plantilla;
  onGenerar: (p: Plantilla) => void;
  isProcessing: boolean;
  processingId: string | null;
}) {
  const badge = TIPO_BADGE[plantilla.tipo] ?? TIPO_BADGE["otro"];
  const esteEstaProcessing = isProcessing && processingId === plantilla.id;

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-2.5
                 transition-all duration-200 hover:border-[var(--color-gold)] hover:shadow-[var(--shadow-md)]
                 group cursor-default"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h4
          className="text-sm font-bold text-gray-900 truncate flex-1"
          title={plantilla.nombre}
        >
          {plantilla.nombre}
        </h4>
        <span
          className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Descripción */}
      <p
        className="text-xs text-gray-500 leading-relaxed line-clamp-2 min-h-[2rem]"
        title={plantilla.descripcion || "Sin descripción"}
      >
        {plantilla.descripcion || "Sin descripción disponible."}
      </p>

      {/* Tags preview */}
      <div className="flex flex-wrap gap-1">
        {TAGS_DISPONIBLES
          .filter((tag) => plantilla.contenido.includes(tag))
          .slice(0, 3)
          .map((tag) => (
            <span
              key={tag}
              className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[9px] font-mono border border-slate-200"
            >
              {tag.replace(/[{}]/g, "")}
            </span>
          ))}
      </div>

      {/* Botón Generar */}
      <button
        onClick={() => onGenerar(plantilla)}
        disabled={isProcessing}
        className="mt-auto w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold
                   rounded-lg border border-[var(--color-gold)] text-[var(--color-gold)]
                   hover:bg-[var(--color-gold-dim)] transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {esteEstaProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4" />
            Generar Documento
          </>
        )}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: PreviewModal del Documento Generado
   ══════════════════════════════════════════════════════════════ */

interface PreviewModalProps {
  isOpen: boolean;
  documentoGenerado: string;
  nombrePlantilla: string;
  expedienteId: string;
  onClose: () => void;
  onCopiar: () => void;
  onDescargar: () => void;
  copiado: boolean;
}

function PreviewModal({
  isOpen,
  documentoGenerado,
  nombrePlantilla,
  onClose,
  onCopiar,
  onDescargar,
  copiado,
}: PreviewModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4 sm:p-6"
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Documento Generado
              </h2>
              <p className="text-xs text-gray-400">{nombrePlantilla}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onCopiar}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg
                         border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              title="Copiar al portapapeles"
            >
              {copiado ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copiar
                </>
              )}
            </button>
            <button
              onClick={onDescargar}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg
                         border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              title="Descargar como .txt"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Cerrar preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido estilo "papel" */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <div
            className="mx-auto max-w-2xl bg-white border border-gray-100 rounded-lg shadow-[0_2px_20px_rgba(0,0,0,0.06)] px-12 py-10"
            style={{ minHeight: "400px" }}
          >
            <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed font-[var(--font-body)]">
              {documentoGenerado}
            </pre>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL: PlantillasTab
   ──────────────────────────────────────────────────────────────
   Integrado como tab en la vista de detalle de expediente.
   ══════════════════════════════════════════════════════════════ */

interface PlantillasTabProps {
  expedienteId: string;
}

export default function PlantillasTab({ expedienteId }: PlantillasTabProps) {
  /* ── Estado ─────────────────────────────────────────────────── */
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── Generación de documento ────────────────────────────────── */
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [documentoGenerado, setDocumentoGenerado] = useState("");
  const [nombrePlantillaActiva, setNombrePlantillaActiva] = useState("");
  const [previewAbierto, setPreviewAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  /* ── Toasts ─────────────────────────────────────────────────── */
  const { toasts, addToast, removeToast } = useToasts();

  /* ── Carga de plantillas ────────────────────────────────────── */
  const cargarPlantillas = useCallback(async () => {
    setCargando(true);
    setError(null);

    const res = await fetchPlantillas();

    if (!res.success) {
      setError(res.error ?? "Error al cargar plantillas.");
    } else {
      setPlantillas(res.data ?? []);
    }

    setCargando(false);
  }, []);

  useEffect(() => {
    cargarPlantillas();
  }, [cargarPlantillas]);

  /* ── Handler: Generar documento ─────────────────────────────── */
  async function handleGenerar(plantilla: Plantilla) {
    setIsProcessing(true);
    setProcessingId(plantilla.id);

    const res = await generarDocumentoAction(plantilla.id, expedienteId);

    if (!res.success) {
      addToast("error", res.error ?? "Error al generar documento.");
    } else if (res.data) {
      setDocumentoGenerado(res.data);
      setNombrePlantillaActiva(plantilla.nombre);
      setPreviewAbierto(true);
    }

    setIsProcessing(false);
    setProcessingId(null);
  }

  /* ── Handler: Copiar al portapapeles ────────────────────────── */
  async function handleCopiar() {
    try {
      await navigator.clipboard.writeText(documentoGenerado);
      setCopiado(true);
      addToast("success", "Documento copiado al portapapeles.");
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      addToast("error", "No se pudo copiar. Intenta seleccionarlo manualmente.");
    }
  }

  /* ── Handler: Descargar como .txt ───────────────────────────── */
  function handleDescargar() {
    const blob = new Blob([documentoGenerado], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const nombreArchivo = `${expedienteId}_${nombrePlantillaActiva.replace(/\s+/g, "_")}.txt`;

    link.href = url;
    link.download = nombreArchivo;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addToast("success", `Archivo "${nombreArchivo}" descargado.`);
  }

  /* ── Cerrar preview ─────────────────────────────────────────── */
  function handleCerrarPreview() {
    setPreviewAbierto(false);
    setDocumentoGenerado("");
    setNombrePlantillaActiva("");
    setCopiado(false);
  }

  /* ── Render: Loading ────────────────────────────────────────── */
  if (cargando) {
    return <PlantillasGridSkeleton />;
  }

  /* ── Render: Error ──────────────────────────────────────────── */
  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3 text-red-800 text-sm font-medium">
        <FileText className="w-5 h-5 flex-shrink-0 mt-0.5" />
        {error}
      </div>
    );
  }

  /* ── Render: Empty ──────────────────────────────────────────── */
  if (plantillas.length === 0) {
    return <PlantillasEmptyState />;
  }

  /* ── Render: Grid de plantillas ─────────────────────────────── */
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[var(--color-gold)]" />
            Generar Documento
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Selecciona una plantilla para generar un documento con los datos de
            este expediente.
          </p>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {plantillas.length} plantilla{plantillas.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plantillas.map((p) => (
          <PlantillaCard
            key={p.id}
            plantilla={p}
            onGenerar={handleGenerar}
            isProcessing={isProcessing}
            processingId={processingId}
          />
        ))}
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={previewAbierto}
        documentoGenerado={documentoGenerado}
        nombrePlantilla={nombrePlantillaActiva}
        expedienteId={expedienteId}
        onClose={handleCerrarPreview}
        onCopiar={handleCopiar}
        onDescargar={handleDescargar}
        copiado={copiado}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
