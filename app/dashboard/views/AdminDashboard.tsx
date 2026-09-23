"use client";

import React, { useEffect, useState } from "react";
import { Briefcase, Users, Calendar, CalendarClock, Clock, AlertCircle, Coffee } from "lucide-react";
import { obtenerTotalClientes } from "@/infrastructure/repositories/clienteRepository";
import { obtenerTotalExpedientes } from "@/infrastructure/repositories/expedienteRepository";
import { EventoAgendaDetallado } from "@/domain/entities/EventoAgenda";

/* ══════════════════════════════════════════════════════════════
   Helpers de fecha / hora
   ══════════════════════════════════════════════════════════════ */

function obtenerInicioDeHoy(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function esHoy(fechaISO: string): boolean {
  const fecha = new Date(fechaISO);
  const hoy = new Date();
  return (
    fecha.getFullYear() === hoy.getFullYear() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getDate() === hoy.getDate()
  );
}

function esManana(fechaISO: string): boolean {
  const fecha = new Date(fechaISO);
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  return (
    fecha.getFullYear() === manana.getFullYear() &&
    fecha.getMonth() === manana.getMonth() &&
    fecha.getDate() === manana.getDate()
  );
}

function formatearHora(fechaISO: string): string {
  return new Date(fechaISO).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TIPO_EVENTO_LABEL: Record<string, { label: string; className: string }> = {
  audiencia: {
    label: "Audiencia",
    className: "bg-purple-100 text-purple-700 border border-purple-200",
  },
  reunion: {
    label: "Reunión",
    className: "bg-sky-100 text-sky-700 border border-sky-200",
  },
  vencimiento: {
    label: "Vencimiento",
    className: "bg-rose-100 text-rose-700 border border-rose-200",
  },
  tarea: {
    label: "Tarea",
    className: "bg-amber-100 text-amber-700 border border-amber-200",
  },
};

/* ══════════════════════════════════════════════════════════════
   Props
   ══════════════════════════════════════════════════════════════ */

interface AdminDashboardProps {
  nombre: string;
  eventos: EventoAgendaDetallado[];
}

/* ══════════════════════════════════════════════════════════════
   Componente: Panel de Próximos Eventos
   ══════════════════════════════════════════════════════════════ */

function PanelProximosEventos({ eventos }: { eventos: EventoAgendaDetallado[] }) {
  const eventosHoy = eventos.filter((e) => esHoy(e.fechaInicio));
  const eventosManana = eventos.filter((e) => esManana(e.fechaInicio));
  const hayEventos = eventosHoy.length > 0 || eventosManana.length > 0;

  if (!hayEventos) {
    return (
      <div
        id="panel-proximos-eventos-vacio"
        className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50
                   p-6 shadow-sm animate-in fade-in duration-500"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <Coffee className="w-6 h-6 text-emerald-600" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-base font-bold text-emerald-900">
              Agenda libre para hoy
            </h3>
            <p className="text-sm text-emerald-700/80 mt-0.5">
              No hay audiencias ni vencimientos programados para hoy o mañana. ¡Buen momento para avanzar!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="panel-proximos-eventos"
      className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden
                 animate-in fade-in duration-500"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50/60 to-sky-50/60">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
            <CalendarClock className="w-5 h-5 text-indigo-600" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Próximos Eventos</h3>
            <p className="text-xs text-gray-500">
              {eventosHoy.length} hoy · {eventosManana.length} mañana
            </p>
          </div>
        </div>
      </div>

      {/* Eventos de HOY */}
      {eventosHoy.length > 0 && (
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
              <AlertCircle className="w-3 h-3" />
              Hoy
            </span>
          </div>
          <div className="space-y-2">
            {eventosHoy.map((evento) => {
              const tipoCfg = TIPO_EVENTO_LABEL[evento.tipoEvento] ?? TIPO_EVENTO_LABEL.tarea;
              return (
                <div
                  key={evento.id}
                  className="flex items-center gap-4 rounded-lg border border-red-100 bg-red-50/40
                             px-4 py-3 transition-all duration-150 hover:shadow-sm hover:bg-red-50/70"
                >
                  {/* Hora */}
                  <div className="flex-shrink-0 text-center min-w-[52px]">
                    <span className="text-sm font-bold text-gray-900">
                      {formatearHora(evento.fechaInicio)}
                    </span>
                  </div>

                  {/* Separador */}
                  <div className="w-px h-8 bg-red-200 flex-shrink-0" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate" title={evento.titulo}>
                      {evento.titulo}
                    </p>
                    {evento.expediente && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        Caso {evento.expediente.numeroCaso} — {evento.expediente.titulo}
                      </p>
                    )}
                  </div>

                  {/* Badge tipo */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${tipoCfg.className}`}>
                    {tipoCfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Eventos de MAÑANA */}
      {eventosManana.length > 0 && (
        <div className={`px-5 py-3 ${eventosHoy.length > 0 ? "border-t border-gray-100" : ""}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
              <Clock className="w-3 h-3" />
              Mañana
            </span>
          </div>
          <div className="space-y-2">
            {eventosManana.map((evento) => {
              const tipoCfg = TIPO_EVENTO_LABEL[evento.tipoEvento] ?? TIPO_EVENTO_LABEL.tarea;
              return (
                <div
                  key={evento.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50/50
                             px-4 py-3 transition-all duration-150 hover:shadow-sm hover:bg-gray-50"
                >
                  {/* Hora */}
                  <div className="flex-shrink-0 text-center min-w-[52px]">
                    <span className="text-sm font-bold text-gray-900">
                      {formatearHora(evento.fechaInicio)}
                    </span>
                  </div>

                  {/* Separador */}
                  <div className="w-px h-8 bg-gray-200 flex-shrink-0" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate" title={evento.titulo}>
                      {evento.titulo}
                    </p>
                    {evento.expediente && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        Caso {evento.expediente.numeroCaso} — {evento.expediente.titulo}
                      </p>
                    )}
                  </div>

                  {/* Badge tipo */}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${tipoCfg.className}`}>
                    {tipoCfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Componente Principal: AdminDashboard
   ══════════════════════════════════════════════════════════════ */

export default function AdminDashboard({ nombre, eventos }: AdminDashboardProps) {
  const [totalCasos, setTotalCasos] = useState<number | null>(null);
  const [totalClientes, setTotalClientes] = useState<number | null>(null);

  /* Conteo de audiencias Hoy + Mañana (dato real) */
  const audienciasProximas = eventos.filter(
    (e) => esHoy(e.fechaInicio) || esManana(e.fechaInicio)
  ).length;

  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    async function cargarMetricas() {
      // Cargamos ambas en paralelo para mayor velocidad
      const [casos, clientes] = await Promise.all([
        obtenerTotalExpedientes(),
        obtenerTotalClientes()
      ]);
      setTotalCasos(casos);
      setTotalClientes(clientes);
    }
    cargarMetricas();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Banner Administrador */}
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-900 p-5 rounded-r-xl shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Modo Administrador</h2>
            <p className="text-sm opacity-80 mt-0.5">Acceso total al sistema</p>
          </div>
        </div>
      </div>

      {/* Sección de Bienvenida Minimalista */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Bienvenido, {nombre}
        </h1>
        <p className="text-gray-500 mt-1 capitalize">
          {today}
        </p>
      </div>

      {/* ── Panel de Próximos Eventos (Hoy + Mañana) ──────────── */}
      <PanelProximosEventos eventos={eventos} />

      {/* Tarjetas de Métricas Corporativas Minimalistas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Casos Activos */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-center transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gray-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-medium text-gray-500 tracking-wide">
              Casos Activos
            </h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">
            {totalCasos === null ? (
              <span className="text-gray-300 animate-pulse block h-10 w-16 bg-gray-100 rounded"></span>
            ) : totalCasos}
          </p>
        </div>

        {/* Clientes Registrados */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-center transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-medium text-gray-500 tracking-wide">
              Clientes Registrados
            </h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">
            {totalClientes === null ? (
              <span className="text-gray-300 animate-pulse block h-10 w-16 bg-gray-100 rounded"></span>
            ) : totalClientes}
          </p>
        </div>

        {/* Audiencias Próximas (Hoy + Mañana — dato real) */}
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex flex-col justify-center transition-shadow hover:shadow-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-medium text-gray-500 tracking-wide">
              Eventos Próximos
            </h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">
            {audienciasProximas}
          </p>
        </div>
      </div>
    </div>
  );
}
