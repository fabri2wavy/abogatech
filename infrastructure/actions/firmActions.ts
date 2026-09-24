'use server';

import { resolveActiveFirm } from '@/domain/entities/FirmContext';
import { obtenerContextoUsuarioActualServer, persistirPreferenciaFirma } from '@/infrastructure/repositories/firmRepository.server';

export async function sincronizarFirmaActiva() {
  const context = await obtenerContextoUsuarioActualServer();
  await persistirPreferenciaFirma(context);
  return context;
}

export async function cambiarFirmaActiva(firmId: string): Promise<{ success: boolean; error?: string }> {
  const context = await obtenerContextoUsuarioActualServer();
  if (!context.user || !context.memberships.some((membership) => membership.firmId === firmId)) {
    return { success: false, error: 'La firma seleccionada no está disponible para tu sesión.' };
  }
  await persistirPreferenciaFirma(resolveActiveFirm(context.user, firmId));
  return { success: true };
}
