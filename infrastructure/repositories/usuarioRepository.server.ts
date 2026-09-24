import 'server-only';
import type { UsuarioPerfil } from '@/domain/entities/UsuarioPerfil';
import { obtenerContextoUsuarioActualServer } from './firmRepository.server';

/** Compatibilidad transitoria: rol del membership de la firma activa, nunca global. */
export async function obtenerPerfilActualServer(): Promise<UsuarioPerfil | null> {
  const context = await obtenerContextoUsuarioActualServer();
  if (context.status !== 'ready') return null;
  return {
    id: context.user.userId,
    nombre_completo: context.user.nombreCompleto,
    rol: context.role,
  };
}
