import type { FirmContextState } from '@/domain/entities/FirmContext';

let pendingContext: Promise<FirmContextState> | null = null;

/** Compatibilidad para pantallas antiguas. Las nuevas pantallas consumen useFirm().
 * Solo deduplica peticiones simultáneas; no conserva roles entre firmas o sesiones.
 */
export function obtenerContextoUsuarioActual(): Promise<FirmContextState> {
  if (!pendingContext) {
    pendingContext = fetch('/api/firm-context', { cache: 'no-store', credentials: 'same-origin' })
      .then(async (response) => {
        if (!response.ok && response.status !== 401 && response.status !== 503) {
          throw new Error('No se pudo cargar el contexto de firma.');
        }
        return await response.json() as FirmContextState;
      })
      .finally(() => { pendingContext = null; });
  }
  return pendingContext;
}
