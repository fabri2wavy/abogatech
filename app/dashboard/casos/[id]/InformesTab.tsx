"use client";

import { useEffect, useState, useCallback } from "react";
import { Send, Clock, Eye, Lock, User } from "lucide-react";
import { EntradaBitacora } from "@/domain/entities/EntradaBitacora";
import {
  obtenerBitacoraPorExpediente,
  crearEntradaBitacora,
} from "@/infrastructure/repositories/bitacoraRepository";
import { obtenerUsuarioActualId } from "@/infrastructure/repositories/authRepository";

/* ── Helpers ───────────────────────────────────────────────── */
function formatearFechaHora(fecha: Date): string {
  return fecha.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }) + " · " + fecha.toLocaleTimeString("es-BO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── Props ─────────────────────────────────────────────────── */
interface InformesTabProps {
  expedienteId: string;
}

/* ── Componente ────────────────────────────────────────────── */
export default function InformesTab({ expedienteId }: InformesTabProps) {
  const [entradas, setEntradas] = useState<EntradaBitacora[]>([]);
  const [cargando, setCargando] = useState(true);
  const [contenido, setContenido] = useState("");
  const [visibleCliente, setVisibleCliente] = useState(false);
  const [publicando, setPublicando] = useState(false);
  const [error, setError] = useState("");

  /* ── Cargar entradas ─────────────────────────────────────── */
  const cargarEntradas = useCallback(async () => {
    setCargando(true);
    try {
      const data = await obtenerBitacoraPorExpediente(expedienteId);
      setEntradas(data);
    } catch {
      setError("Error al cargar las comunicaciones.");
    } finally {
      setCargando(false);
    }
  }, [expedienteId]);

  useEffect(() => {
    cargarEntradas();
  }, [cargarEntradas]);

  /* ── Publicar nota ───────────────────────────────────────── */
  const handlePublicar = async () => {
    const textoLimpio = contenido.trim();
    if (!textoLimpio) return;

    setPublicando(true);
    setError("");

    try {
      const userId = await obtenerUsuarioActualId();

      if (!userId) {
        setError("No se pudo identificar tu sesión. Inicia sesión nuevamente.");
        setPublicando(false);
        return;
      }

      const resultado = await crearEntradaBitacora(
        expedienteId,
        textoLimpio,
        visibleCliente,
        userId
      );

      if (resultado) {
        setContenido("");
        setVisibleCliente(false);
        await cargarEntradas();
      } else {
        setError("No se pudo publicar la nota. Intenta de nuevo.");
      }
    } catch {
      setError("Error inesperado al publicar.");
    } finally {
      setPublicando(false);
    }
  };

  /* ── Atajos de teclado: Ctrl+Enter para publicar ─────────── */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handlePublicar();
    }
  };

  return (
    <div className="space-y-6">

      {/* ═══════════ ÁREA DE PUBLICACIÓN ═══════════ */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5">
        <textarea
          id="bitacora-nueva-nota"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe una actualización del caso..."
          rows={3}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3
                     text-sm leading-relaxed text-gray-800 placeholder:text-gray-400
                     focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100
                     transition-all duration-200"
        />

        {/* Barra inferior: Switch + Botón */}
        <div className="mt-3 flex items-center justify-between">

          {/* Toggle Visible para el cliente */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={visibleCliente}
              onClick={() => setVisibleCliente(!visibleCliente)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
                          border-2 border-transparent transition-colors duration-200
                          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                          ${visibleCliente ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white
                            shadow-md transform transition-transform duration-200
                            ${visibleCliente ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
            <span
              className={`text-sm font-medium transition-colors duration-200
                          ${visibleCliente ? "text-green-700" : "text-gray-500"}`}
            >
              {visibleCliente ? "Visible para el cliente" : "Solo uso interno"}
            </span>
          </div>

          {/* Botón de Publicar */}
          <button
            id="bitacora-publicar-btn"
            onClick={handlePublicar}
            disabled={publicando || !contenido.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5
                       text-sm font-semibold text-white shadow-sm
                       hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                       focus:ring-blue-500 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {publicando ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {publicando ? "Publicando..." : "Publicar Nota"}
          </button>
        </div>

        {/* Hint de atajo */}
        <p className="mt-2 text-xs text-gray-400">
          Ctrl + Enter para publicar rápidamente
        </p>
      </div>

      {/* ═══════════ ERROR ═══════════ */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ═══════════ TIMELINE ═══════════ */}
      {cargando ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin" />
        </div>
      ) : entradas.length === 0 ? (
        /* Estado vacío */
        <div className="flex flex-col items-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
            <Clock className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-gray-500">
            Aún no hay mensajes en las comunicaciones
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Publica la primera actualización del caso.
          </p>
        </div>
      ) : (
        /* Lista de entradas */
        <div className="relative">
          {/* Línea vertical de timeline */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gray-200" />

          <div className="space-y-1">
            {entradas.map((entrada, index) => (
              <div
                key={entrada.id}
                className="relative pl-12 group"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Punto del timeline */}
                <div
                  className={`absolute left-2.5 top-5 h-3 w-3 rounded-full border-2 border-white shadow-sm
                              ${entrada.visibleCliente ? "bg-green-500" : "bg-gray-400"}`}
                />

                {/* Tarjeta de la nota */}
                <div
                  className={`rounded-xl p-4 transition-all duration-200 border
                              ${
                                entrada.visibleCliente
                                  ? "bg-green-50/50 border-l-4 border-l-green-500 border-t-gray-100 border-r-gray-100 border-b-gray-100"
                                  : "bg-white border-l-4 border-l-gray-300 border-t-gray-100 border-r-gray-100 border-b-gray-100"
                              }
                              hover:shadow-sm`}
                >
                  {/* Cabecera: Autor + Fecha + Badge */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
                      <span className="text-sm font-semibold text-gray-800">
                        {entrada.autorNombre}
                      </span>
                    </div>

                    <span className="text-xs text-gray-400">
                      {formatearFechaHora(entrada.creadoEn)}
                    </span>

                    {/* Badge visibilidad */}
                    {entrada.visibleCliente ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                        <Eye className="w-3 h-3" />
                        Público
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                        <Lock className="w-3 h-3" />
                        Interno
                      </span>
                    )}
                  </div>

                  {/* Contenido */}
                  <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {entrada.contenido}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
