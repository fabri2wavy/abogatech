"use client";

import React from "react";

interface ClienteDashboardProps {
  nombre: string;
}

export default function ClienteDashboard({ nombre }: ClienteDashboardProps) {
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Banner Cliente */}
      <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-r-lg shadow-sm flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <div>
            <h2 className="font-bold text-lg">Portal del Cliente</h2>
            <p className="text-sm opacity-90">Seguimiento de sus trámites legales</p>
          </div>
        </div>
      </div>

      <div className="mb-8 animate-fade-up">
        <h1 className="text-3xl font-bold mb-1" style={{ color: "var(--color-text-primary)" }}>
          Bienvenido, {nombre}
        </h1>
        <p className="text-sm mt-1 capitalize" style={{ color: "var(--color-text-muted)" }}>
          {today}
        </p>
      </div>

      <div className="p-12 text-center rounded-xl border-2 border-dashed border-[var(--color-border-subtle)] bg-[var(--color-surface-card)]">
        <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Aquí verás el estado de tu caso</h3>
        <p className="text-[var(--color-text-secondary)]">Próximamente podrás visualizar el avance de tu expediente en tiempo real.</p>
      </div>
    </div>
  );
}
