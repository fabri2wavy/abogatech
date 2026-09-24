'use client';

import { useFirm } from './FirmProvider';
import { Button } from '@/components/ui/Button';
import BotonSalir from '@/components/layout/BotonSalir';
import { roleLabels } from './roleLabels';

export function FirmAccessState() {
  const context = useFirm();
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[var(--color-surface)]">
      <section className="w-full max-w-lg space-y-4 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-card)] p-6">
        <p className="text-sm font-semibold tracking-widest text-[var(--color-text-secondary)]">ABOGATECH</p>
        {context.status === 'firm_selection_required' ? (
          <>
            <h1 className="text-2xl font-semibold">Selecciona una firma</h1>
            <p>Elige con qué organización deseas trabajar.</p>
            {context.memberships.map((membership) => (
              <Button key={membership.membershipId} fullWidth variant="secondary" disabled={context.isSwitching}
                onClick={() => { void context.switchFirm(membership.firmId).catch(() => { /* El Provider muestra el error. */ }); }}>
                <span className="min-w-0 text-left">
                  <span className="block break-words font-semibold">{membership.firm.nombre}</span>
                  <span className="block text-sm font-normal">{roleLabels[membership.role]}</span>
                </span>
              </Button>
            ))}
          </>
        ) : context.status === 'no_membership' ? (
          <>
            <h1 className="text-2xl font-semibold">No tienes una firma activa</h1>
            <p>Tu usuario no tiene una membresía activa disponible. Contacta al administrador de tu firma.</p>
          </>
        ) : context.status === 'error' ? (
          <>
            <h1 className="text-2xl font-semibold">No pudimos cargar tu cuenta</h1>
            <p role="alert">{context.message}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </>
        ) : <p>Tu sesión no está disponible. Inicia sesión nuevamente.</p>}
        <BotonSalir />
      </section>
    </main>
  );
}
