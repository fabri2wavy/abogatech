"use client";

import React from "react";
import {
  Briefcase,
  CalendarClock,
  CheckSquare,
  Scale,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Expediente, EstadoExpediente } from "@/domain/entities/Expediente";
import { EventoAgendaDetallado } from "@/domain/entities/EventoAgenda";
import { UsuarioPerfil } from "@/domain/entities/UsuarioPerfil";
import { Alert } from "@/components/ui/Alert";

/* ══════════════════════════════════════════════════════════════
   Tipo extendido de expediente — refleja el shape real
   devuelto por `obtenerExpedientes()` en el repositorio
   (incluye campos hidratados como `nombreCliente`).
   ══════════════════════════════════════════════════════════════ */

interface ExpedienteListado {
  id: string;
  numeroCaso: string;
  titulo: string;
  estado: EstadoExpediente;
  nombreCliente: string;
  abogado_nombre?: string;
  materia: string;
  fechaCreacion: Date;
}

/* ══════════════════════════════════════════════════════════════
   Props — datos pre-cargados por el componente padre
   ══════════════════════════════════════════════════════════════ */

export interface AbogadoDashboardProps {
  usuario: UsuarioPerfil;
  expedientes: ExpedienteListado[];
  eventos: EventoAgendaDetallado[];
}

/* ══════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════ */

const ESTADO_CONFIG: Record<EstadoExpediente, { label: string; className: string }> = {
  en_espera: {
    label: "En espera",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  mediacion: {
    label: "Mediación",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  juicio: {
    label: "Juicio",
    className: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  cerrado: {
    label: "Cerrado",
    className: "bg-gray-50 text-gray-500 border border-gray-200",
  },
};

function esHoy(fechaISO: string): boolean {
  const fecha = new Date(fechaISO);
  const hoy = new Date();
  return (
    fecha.getFullYear() === hoy.getFullYear() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getDate() === hoy.getDate()
  );
}

function formatearHora(fechaISO: string): string {
  return new Date(fechaISO).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatearFechaCorta(fechaISO: string): string {
  return new Date(fechaISO).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
  });
}

/* ══════════════════════════════════════════════════════════════
   Componente Principal
   ══════════════════════════════════════════════════════════════ */

export default function AbogadoDashboard({
  usuario,
  expedientes,
  eventos,
}: AbogadoDashboardProps) {
  const hoy = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const casosActivos = expedientes.filter((e) => e.estado !== "cerrado").length;
  const eventosHoy = eventos.filter((e) => esHoy(e.fechaInicio));

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Bienvenido, Dr/a. {usuario.nombre_completo}
        </h1>
        <p className="text-sm text-gray-500 mt-1 capitalize">{hoy}</p>
      </div>

      {/* ── Métricas (3 cards) ──────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Mis Casos Activos */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex flex-col justify-center transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-medium text-gray-500 tracking-wide">
              Mis Casos Activos
            </h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">{casosActivos}</p>
        </div>

        {/* Card 2: Audiencias / Eventos */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex flex-col justify-center transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-sky-50 rounded-lg">
              <CalendarClock className="w-5 h-5 text-sky-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-medium text-gray-500 tracking-wide">
              Audiencias / Eventos
            </h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">{eventos.length}</p>
        </div>

        {/* Card 3: Tareas Hoy */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex flex-col justify-center transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckSquare className="w-5 h-5 text-emerald-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-medium text-gray-500 tracking-wide">
              Tareas Hoy
            </h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">
            {eventosHoy.length}
          </p>
        </div>
      </div>

      {/* ── Grid Principal ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Sección Casos (col-span-2) ──────────────────────── */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Scale className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
            Expedientes Asignados
          </h2>

          {expedientes.length === 0 ? (
            <Alert variant="info">
              No tienes expedientes asignados actualmente. Los casos que te
              sean asignados aparecerán aquí.
            </Alert>
          ) : (
            <div className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Caso (Nro)
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Título
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">
                      Cliente
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expedientes.map((exp) => {
                    const estadoCfg = ESTADO_CONFIG[exp.estado] ?? ESTADO_CONFIG.en_espera;
                    return (
                      <tr
                        key={exp.id}
                        className="transition-colors duration-150 hover:bg-slate-50/80 cursor-default"
                      >
                        <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">
                          {exp.numeroCaso}
                        </td>
                        <td className="px-4 py-3 text-gray-900 font-medium max-w-[220px] truncate">
                          {exp.titulo}
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell max-w-[180px] truncate">
                          {exp.nombreCliente}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estadoCfg.className}`}
                          >
                            {estadoCfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Sección Agenda (col-span-1) ─────────────────────── */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
            Agenda Próxima
          </h2>

          {eventos.length === 0 ? (
            <Alert variant="info">
              No hay eventos programados próximamente.
            </Alert>
          ) : (
            <div className="space-y-3">
              {eventos.map((evento) => {
                const esEventoHoy = esHoy(evento.fechaInicio);
                return (
                  <div
                    key={evento.id}
                    className={`rounded-xl border p-4 transition-shadow duration-150 hover:shadow-md bg-white ${
                      esEventoHoy
                        ? "border-red-200 shadow-sm"
                        : "border-slate-200 shadow-sm"
                    }`}
                  >
                    {/* Badge Urgente */}
                    {esEventoHoy && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                          <AlertCircle className="w-3 h-3" />
                          Urgente — Hoy
                        </span>
                      </div>
                    )}

                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {evento.titulo}
                    </h4>

                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                      <CalendarClock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>
                        {formatearFechaCorta(evento.fechaInicio)} ·{" "}
                        {formatearHora(evento.fechaInicio)} –{" "}
                        {formatearHora(evento.fechaFin)}
                      </span>
                    </div>

                    {evento.expediente && (
                      <p className="mt-1.5 text-xs text-gray-400 truncate">
                        Caso {evento.expediente.numeroCaso} — {evento.expediente.titulo}
                      </p>
                    )}

                    <span className="mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                      {evento.tipoEvento}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
