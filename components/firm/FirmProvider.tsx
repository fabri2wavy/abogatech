'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { FirmContextState } from '@/domain/entities/FirmContext';
import { cambiarFirmaActiva, sincronizarFirmaActiva } from '@/infrastructure/actions/firmActions';
import { FirmAccessState } from './FirmAccessState';

type FirmContextValue = FirmContextState & {
  isSwitching: boolean;
  switchFirm: (firmId: string) => Promise<void>;
};
const FirmContext = createContext<FirmContextValue | null>(null);

export function FirmProvider({ initialContext, needsCookieSync, children }: {
  initialContext: FirmContextState;
  needsCookieSync: boolean;
  children: React.ReactNode;
}) {
  const [isSwitching, setIsSwitching] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const switching = useRef(false);

  useEffect(() => {
    if (!needsCookieSync) return;
    let cancelled = false;
    sincronizarFirmaActiva().then((context) => {
      if (cancelled) return;
      if (context.status === 'error') {
        setOperationError(context.message);
      } else if (JSON.stringify(context) !== JSON.stringify(initialContext)) {
        // La sesión o los memberships cambiaron durante la hidratación.
        window.location.reload();
      }
    }).catch(() => {
      if (!cancelled) setOperationError('No se pudo guardar la firma activa. Recarga para reintentar.');
    });
    return () => { cancelled = true; };
  }, [initialContext, needsCookieSync]);

  async function switchFirm(firmId: string) {
    if (switching.current) return;
    if (!initialContext.memberships.some((membership) => membership.firmId === firmId)) {
      throw new Error('La firma seleccionada no está disponible.');
    }
    switching.current = true;
    setIsSwitching(true);
    setOperationError(null);
    try {
      const result = await cambiarFirmaActiva(firmId);
      if (!result.success) throw new Error(result.error);
      // Reinicia también los estados y caches de los módulos todavía sin migrar.
      window.location.assign('/dashboard');
    } catch (error) {
      switching.current = false;
      setIsSwitching(false);
      setOperationError(error instanceof Error ? error.message : 'No se pudo cambiar de firma.');
      throw error;
    }
  }

  return (
    <FirmContext.Provider value={{ ...initialContext, isSwitching, switchFirm }}>
      {operationError && (
        <div role="alert" className="p-4 text-[var(--color-danger)]">
          {operationError}{' '}
          <button type="button" className="underline" onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      )}
      {isSwitching
        ? <p role="status" className="p-6">Cambiando de firma…</p>
        : initialContext.status === 'ready' ? children : <FirmAccessState />}
    </FirmContext.Provider>
  );
}

export function useFirm(): FirmContextValue {
  const context = useContext(FirmContext);
  if (!context) throw new Error('useFirm debe usarse dentro de FirmProvider.');
  return context;
}
