'use server';

import { createClient } from '@/infrastructure/supabase/server';
import type { ConfiguracionGlobal } from '@/domain/entities/ConfiguracionGlobal';
import type { RepositoryResponse } from '@/domain/types/RepositoryResponse';
import { revalidatePath } from 'next/cache';

export type CreateConfiguracionDTO = Omit<ConfiguracionGlobal, 'id' | 'creado_en'>;
export type UpdateConfiguracionDTO = Partial<CreateConfiguracionDTO>;

/* ══════════════════════════════════════════════════════════════
   HELPER: Validación de seguridad (Admin-Only)
   ──────────────────────────────────────────────────────────────
   Principio Fail-Fast: Aborta cualquier mutación si el usuario
   no está autenticado o no tiene rol 'admin' en la tabla perfiles.
   ══════════════════════════════════════════════════════════════ */
async function asegurarAccesoAdmin(supabase: any): Promise<RepositoryResponse<boolean>> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: 'No autorizado: Sesión expirada o inválida.' };
  }

  const { data: perfil, error: perfilError } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single();

  if (perfilError || !perfil) {
    return { data: null, error: 'No se pudo verificar el perfil del usuario.' };
  }

  if (perfil.rol !== 'admin') {
    return { data: null, error: 'Acceso denegado: Se requiere rol de administrador para mutar la configuración.' };
  }

  return { data: true, error: null };
}

/* ══════════════════════════════════════════════════════════════
   QUERY: Obtener configuraciones globales
   ──────────────────────────────────────────────────────────────
   Lectura abierta o restringida dependiendo de RLS, pero el
   repositorio permite la consulta filtrada.
   ══════════════════════════════════════════════════════════════ */
export async function obtenerConfiguraciones(
  categoria?: string
): Promise<RepositoryResponse<ConfiguracionGlobal[]>> {
  try {
    const supabase = await createClient();
    
    let query = supabase.from('configuracion_global').select('*').order('categoria');
    
    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: `Error al obtener configuraciones: ${error.message}` };
    }

    return { data: data as ConfiguracionGlobal[], error: null };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al obtener configuraciones.';
    return { data: null, error: mensaje };
  }
}

/* ══════════════════════════════════════════════════════════════
   MUTATION: Crear configuración
   ══════════════════════════════════════════════════════════════ */
export async function crearConfiguracion(
  payload: CreateConfiguracionDTO
): Promise<RepositoryResponse<ConfiguracionGlobal>> {
  try {
    const supabase = await createClient();
    
    const adminCheck = await asegurarAccesoAdmin(supabase);
    if (adminCheck.error) return { data: null, error: adminCheck.error };

    const { data, error } = await supabase
      .from('configuracion_global')
      .insert({
        categoria: payload.categoria,
        valor: payload.valor,
        activo: payload.activo ?? true,
      })
      .select()
      .single();

    if (error || !data) {
      return { data: null, error: `Error al crear configuración: ${error?.message}` };
    }

    revalidatePath('/dashboard'); // Ejemplo de revalidación
    return { data: data as ConfiguracionGlobal, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Error desconocido.' };
  }
}

/* ══════════════════════════════════════════════════════════════
   MUTATION: Actualizar configuración
   ══════════════════════════════════════════════════════════════ */
export async function actualizarConfiguracion(
  id: string,
  payload: UpdateConfiguracionDTO
): Promise<RepositoryResponse<ConfiguracionGlobal>> {
  try {
    const supabase = await createClient();
    
    const adminCheck = await asegurarAccesoAdmin(supabase);
    if (adminCheck.error) return { data: null, error: adminCheck.error };

    if (Object.keys(payload).length === 0) {
      return { data: null, error: 'No se enviaron campos para actualizar.' };
    }

    const { data, error } = await supabase
      .from('configuracion_global')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return { data: null, error: `Error al actualizar configuración: ${error?.message}` };
    }

    revalidatePath('/dashboard');
    return { data: data as ConfiguracionGlobal, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Error desconocido.' };
  }
}

/* ══════════════════════════════════════════════════════════════
   MUTATION: Eliminar configuración
   ══════════════════════════════════════════════════════════════ */
export async function eliminarConfiguracion(
  id: string
): Promise<RepositoryResponse<boolean>> {
  try {
    const supabase = await createClient();
    
    const adminCheck = await asegurarAccesoAdmin(supabase);
    if (adminCheck.error) return { data: null, error: adminCheck.error };

    const { error } = await supabase
      .from('configuracion_global')
      .delete()
      .eq('id', id);

    if (error) {
      return { data: null, error: `Error al eliminar configuración: ${error.message}` };
    }

    revalidatePath('/dashboard');
    return { data: true, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Error desconocido.' };
  }
}
