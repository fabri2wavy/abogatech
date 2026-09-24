'use client';

import { useFirm } from './FirmProvider';
import { roleLabels } from './roleLabels';

export function FirmSwitcher() {
  const context = useFirm();
  if (context.status !== 'ready') return null;
  const { firm, firmId, memberships, role, switchFirm, isSwitching } = context;

  async function selectFirm(nextFirmId: string) {
    if (isSwitching || nextFirmId === firmId) return;
    try {
      await switchFirm(nextFirmId);
    } catch {
      // FirmProvider informa del error y permite volver a intentarlo.
    }
  }

  return (
    <div className="space-y-2 border-b border-[var(--color-navy-border)] px-6 py-4">
      <label htmlFor={memberships.length > 1 ? 'active-firm' : undefined}
        className="block text-xs font-medium text-[var(--color-text-muted)]">
        Firma activa
      </label>
      {memberships.length > 1 ? (
        <select id="active-firm" value={isSwitching ? '' : firmId} disabled={isSwitching}
          aria-describedby="active-firm-role"
          onChange={(event) => { void selectFirm(event.target.value); }}
          className="w-full min-w-0 truncate rounded-md border border-[var(--color-navy-border)] bg-[var(--color-navy-card)] p-3 text-sm text-[var(--color-text-on-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-on-dark)] disabled:cursor-wait disabled:opacity-60">
          {isSwitching && <option value="">Cambiando de firma…</option>}
          {memberships.map((membership) => (
            <option key={membership.membershipId} value={membership.firmId}>
              {membership.firm.nombre}
            </option>
          ))}
        </select>
      ) : (
        <p className="break-words font-semibold text-[var(--color-text-on-dark)]">{isSwitching ? 'Cambiando de firma…' : firm.nombre}</p>
      )}
      <p id="active-firm-role" className="text-sm text-[var(--color-text-muted)]" aria-live="polite">
        {isSwitching ? 'Actualizando tu acceso…' : roleLabels[role]}
      </p>
    </div>
  );
}
