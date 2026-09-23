"use client";

import { useState } from "react";
import { FileText, Plus, Pencil, Trash2, AlertTriangle, X } from "lucide-react";
import type { Plantilla, TipoPlantilla } from "@/domain/entities/Plantilla";
import {
  crearPlantillaAction,
  actualizarPlantillaAction,
  eliminarPlantillaAction,
  fetchPlantillas,
} from "@/infrastructure/actions/plantillasActions";
import { Button } from "@/components/ui/Button";
import { ToastContainer, useToasts } from "@/components/ui/Toast";
import PlantillaModal from "./PlantillaModal";

/* ══════════════════════════════════════════════════════════════
   Constantes de configuración visual
   ══════════════════════════════════════════════════════════════ */

const TIPO_BADGE: Record<TipoPlantilla, { bg: string; text: string; border: string; label: string }> = {
  memorial:  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    label: "Memorial" },
  contrato:  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Contrato" },
  poder:     { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   label: "Poder" },
  otro:      { bg: "bg-slate-100",  text: "text-slate-600",   border: "border-slate-200",   label: "Otro" },
};

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: Skeleton de tabla
   ══════════════════════════════════════════════════════════════ */

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-b border-gray-100 last:border-0">
          <td className="py-2 px-4">
            <div className="flex flex-col gap-1.5">
              <div className="skeleton h-4 w-44 rounded" />
              <div className="skeleton h-3 w-28 rounded" />
            </div>
          </td>
          <td className="py-2 px-4">
            <div className="skeleton h-5 w-20 rounded-full" />
          </td>
          <td className="py-2 px-4 hidden md:table-cell">
            <div className="skeleton h-3 w-52 rounded" />
          </td>
          <td className="py-2 px-4 text-right">
            <div className="flex items-center justify-end gap-1">
              <div className="skeleton h-7 w-7 rounded-lg" />
              <div className="skeleton h-7 w-7 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: Empty State
   ══════════════════════════════════════════════════════════════ */

function EmptyState({ onCrear }: { onCrear: () => void }) {
  return (
    <tr>
      <td colSpan={4} className="py-20 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
          <FileText className="w-8 h-8 text-gray-300" strokeWidth={1.2} />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          No hay plantillas configuradas
        </h3>
        <p className="text-xs text-gray-500 mb-5 max-w-sm mx-auto leading-relaxed">
          Comienza creando una para automatizar tus procesos de generación de documentos legales.
        </p>
        <Button variant="primary" size="sm" onClick={onCrear}>
          <Plus className="w-4 h-4 mr-1.5" />
          Nueva Plantilla
        </Button>
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: Fila de plantilla
   ══════════════════════════════════════════════════════════════ */

function PlantillaRow({
  plantilla,
  onEditar,
  onEliminar,
}: {
  plantilla: Plantilla;
  onEditar: (p: Plantilla) => void;
  onEliminar: (p: Plantilla) => void;
}) {
  const badge = TIPO_BADGE[plantilla.tipo] ?? TIPO_BADGE["otro"];

  const fechaFormateada = new Date(plantilla.creado_en).toLocaleDateString(
    "es-MX",
    { day: "numeric", month: "short", year: "numeric" }
  );

  return (
    <tr className="hover:bg-gray-50/70 transition-colors group">
      {/* ── Nombre ──────────────────────────────────────────── */}
      <td className="py-2 px-4">
        <p
          className="text-sm font-bold text-gray-900 truncate max-w-[260px]"
          title={plantilla.nombre}
        >
          {plantilla.nombre}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{fechaFormateada}</p>
      </td>

      {/* ── Tipo Badge ─────────────────────────────────────── */}
      <td className="py-2 px-4">
        <span
          className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}
        >
          {badge.label}
        </span>
      </td>

      {/* ── Descripción ────────────────────────────────────── */}
      <td className="py-2 px-4 hidden md:table-cell">
        <span
          className="text-xs text-gray-500 truncate block max-w-[300px]"
          title={plantilla.descripcion || "—"}
        >
          {plantilla.descripcion || "—"}
        </span>
      </td>

      {/* ── Acciones ───────────────────────────────────────── */}
      <td className="py-2 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEditar(plantilla)}
            className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Editar plantilla"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEliminar(plantilla)}
            className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Eliminar plantilla"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: Modal de Confirmación de Eliminación
   ══════════════════════════════════════════════════════════════ */

function DeleteModal({
  plantilla,
  onClose,
  onConfirmar,
  eliminando,
}: {
  plantilla: Plantilla | null;
  onClose: () => void;
  onConfirmar: () => void;
  eliminando: boolean;
}) {
  if (!plantilla) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-7 w-7 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            ¿Eliminar plantilla?
          </h3>
          <p className="text-sm text-gray-500 mb-6 px-2">
            Se eliminará permanentemente{" "}
            <span className="font-semibold text-gray-800">
              &lsquo;{plantilla.nombre}&rsquo;
            </span>
            . Esta acción es irreversible.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              disabled={eliminando}
              className="px-4 py-2.5 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              disabled={eliminando}
              className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {eliminando ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Eliminando...
                </span>
              ) : (
                "Sí, eliminar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL: PlantillasTable
   ══════════════════════════════════════════════════════════════ */

interface PlantillasTableProps {
  initialData: Plantilla[];
}

export default function PlantillasTable({ initialData }: PlantillasTableProps) {
  /* ── Estado ─────────────────────────────────────────────────── */
  const [plantillas, setPlantillas] = useState<Plantilla[]>(initialData);
  const [cargando, setCargando] = useState(false);

  /* ── Modales ────────────────────────────────────────────────── */
  const [modalAbierto, setModalAbierto] = useState(false);
  const [plantillaEditar, setPlantillaEditar] = useState<Plantilla | null>(null);
  const [plantillaEliminar, setPlantillaEliminar] = useState<Plantilla | null>(null);
  const [eliminando, setEliminando] = useState(false);

  /* ── Toasts ─────────────────────────────────────────────────── */
  const { toasts, addToast, removeToast } = useToasts();

  /* ── Recargar datos ─────────────────────────────────────────── */
  async function recargar() {
    setCargando(true);
    const res = await fetchPlantillas();
    if (res.success && res.data) {
      setPlantillas(res.data);
    }
    setCargando(false);
  }

  /* ── Handlers ───────────────────────────────────────────────── */
  function handleNueva() {
    setPlantillaEditar(null);
    setModalAbierto(true);
  }

  function handleEditar(p: Plantilla) {
    setPlantillaEditar(p);
    setModalAbierto(true);
  }

  function handleCerrarModal() {
    setModalAbierto(false);
    setPlantillaEditar(null);
  }

  async function handleGuardado() {
    await recargar();
    handleCerrarModal();
  }

  async function handleConfirmarEliminar() {
    if (!plantillaEliminar) return;

    setEliminando(true);
    const res = await eliminarPlantillaAction(plantillaEliminar.id);

    if (!res.success) {
      addToast("error", res.error ?? "Error al eliminar plantilla.");
    } else {
      addToast("success", "Plantilla eliminada exitosamente.");
      await recargar();
    }

    setPlantillaEliminar(null);
    setEliminando(false);
  }

  return (
    <div className="space-y-6">
      {/* ── Cabecera ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Plantillas de Documentos
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra las plantillas institucionales para generación automatizada.
          </p>
        </div>
        <Button variant="primary" onClick={handleNueva}>
          <Plus className="w-5 h-5 mr-2" />
          Nueva Plantilla
        </Button>
      </div>

      {/* ── Tabla ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Nombre
                </th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  Tipo
                </th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest hidden md:table-cell">
                  Descripción
                </th>
                <th className="py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cargando && <TableSkeleton />}

              {!cargando && plantillas.length === 0 && (
                <EmptyState onCrear={handleNueva} />
              )}

              {!cargando &&
                plantillas.map((p) => (
                  <PlantillaRow
                    key={p.id}
                    plantilla={p}
                    onEditar={handleEditar}
                    onEliminar={setPlantillaEliminar}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modales ───────────────────────────────────────────── */}
      <PlantillaModal
        isOpen={modalAbierto}
        onClose={handleCerrarModal}
        onGuardado={handleGuardado}
        onToast={addToast}
        plantillaEditar={plantillaEditar}
      />

      <DeleteModal
        plantilla={plantillaEliminar}
        onClose={() => setPlantillaEliminar(null)}
        onConfirmar={handleConfirmarEliminar}
        eliminando={eliminando}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
