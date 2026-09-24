"use client";

import { useFirm } from "@/components/firm/FirmProvider";
import { roleLabels } from "@/components/firm/roleLabels";

export default function DashboardInicio() {
  const context = useFirm();
  if (context.status !== "ready") return null;

  const { firm, role, user } = context;

  return (
    <section aria-labelledby="dashboard-title" className="space-y-6 text-[var(--color-text-primary)]">
      <header className="space-y-2">
        <h1 id="dashboard-title" className="text-2xl font-semibold">Bienvenido a Abogatech</h1>
        <p className="break-words text-[var(--color-text-secondary)]">{user.nombreCompleto}</p>
      </header>
      <dl className="space-y-4 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-6">
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">Firma activa</dt>
          <dd className="break-words text-lg font-semibold">{firm.nombre}</dd>
        </div>
        <div>
          <dt className="text-sm text-[var(--color-text-muted)]">Rol</dt>
          <dd className="font-medium">{roleLabels[role]}</dd>
        </div>
      </dl>
    </section>
  );
}
