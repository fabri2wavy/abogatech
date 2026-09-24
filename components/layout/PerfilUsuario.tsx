"use client";

import { useFirm } from "@/components/firm/FirmProvider";
import { roleLabels } from "@/components/firm/roleLabels";

export default function PerfilUsuario() {
  const { role, user } = useFirm();
  const rol = role ? roleLabels[role] : 'Sin rol asignado';
  const email = user?.email ?? '';
  const nombre = user?.nombreCompleto ?? '';

  const iniciales = nombre.trim()
    ? nombre.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    : email.substring(0, 2).toUpperCase();

  return (
    <div
      className="mb-3 p-3 rounded-lg"
      style={{
        background: "var(--color-navy-card)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Avatar con iniciales */}
        <div
          className="flex items-center justify-center w-9 h-9 rounded-full text-xs font-semibold shrink-0"
          style={{
            background: "var(--color-gold-dim)",
            color: "var(--color-gold-light)",
            border: "1px solid rgba(204, 0, 0, 0.3)",
          }}
        >
          {iniciales}
        </div>
        <div className="min-w-0 flex-1">
          <p title={nombre} className="truncate text-sm font-semibold text-[var(--color-text-on-dark)]">
            {nombre}
          </p>
          <p
            title={email}
            className="text-xs truncate"
            style={{ color: "var(--color-text-muted)" }}
          >
            {email}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="flex h-2 w-2 rounded-full shrink-0"
              style={{ background: "var(--color-success)" }}
            />
            <p
              className="text-sm truncate"
              style={{ color: "var(--color-text-on-dark)" }}
            >
              {rol}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
