'use server';

import { createClient } from '@/infrastructure/supabase/server';
import type { AuditoriaLog } from '@/domain/entities/AuditoriaLog';
import type { RepositoryResponse } from '@/domain/types/RepositoryResponse';

export type CreateAuditoriaLogDTO = Omit<AuditoriaLog, 'id' | 'creado_en' | 'usuario_id'>;

/* ══════════════════════════════════════════════════════════════
   QUERY: Obtener todos los logs de auditoría
   ──────────────────────────────────────────────────────────────
   Restringido a administradores. Falla rápido si no cumple.
   ══════════════════════════════════════════════════════════════ */
export async function obtenerLogs(): Promise<RepositoryResponse<AuditoriaLog[]>> {
  try {
    const supabase = await createClient();
    
    // 1. Verificación Fail-Fast: Administrador requerido
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { data: null, error: 'No autorizado: Sesión expirada o inválida.' };
    }

    const { data: perfil, error: perfilError } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single();

    if (perfilError || !perfil || perfil.rol !== 'admin') {
      return { data: null, error: 'Acceso denegado: Se requiere rol de administrador para ver la auditoría.' };
    }

    // 2. Consulta de logs
    const { data, error } = await supabase
      .from('auditoria_logs')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) {
      return { data: null, error: `Error al obtener logs de auditoría: ${error.message}` };
    }

    return { data: data as AuditoriaLog[], error: null };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al obtener auditoría.';
    return { data: null, error: mensaje };
  }
}

/* ══════════════════════════════════════════════════════════════
   MUTATION: Registrar un log de auditoría
   ──────────────────────────────────────────────────────────────
   Cualquier usuario autenticado puede registrar un log. El ID de
   usuario se inyecta desde la sesión, siendo imposible de falsificar.
   MÉTODOS DE ACTUALIZACIÓN Y BORRADO ESTÁN ESTRICTAMENTE PROHIBIDOS.
   ══════════════════════════════════════════════════════════════ */
export async function registrarLog(
  payload: CreateAuditoriaLogDTO
): Promise<RepositoryResponse<AuditoriaLog>> {
  try {
    const supabase = await createClient();
    
    // 1. Obtener usuario de forma segura server-side
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { data: null, error: 'No autorizado para registrar acciones.' };
    }

    // 2. Insertar en la caja negra (auditoria_logs)
    const { data, error } = await supabase
      .from('auditoria_logs')
      .insert({
        usuario_id: user.id,
        accion: payload.accion,
        entidad: payload.entidad,
        entidad_id: payload.entidad_id,
        detalles: payload.detalles,
      })
      .select()
      .single();

    if (error || !data) {
      return { data: null, error: `Error al registrar auditoría: ${error?.message}` };
    }

    return { data: data as AuditoriaLog, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Error desconocido al registrar.' };
  }
}
