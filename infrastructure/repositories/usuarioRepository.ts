import { createClient } from '@/infrastructure/supabase/client';
import type { UsuarioPerfil } from '@/domain/entities/UsuarioPerfil';
import { obtenerContextoUsuarioActual } from './firmRepository';

export type { UsuarioPerfil };

/** Mapper del listado de abogados legado; no resuelve identidad ni permisos de sesión. */
export function mapearUsuario(fila: {
  id: string; nombres: string | null; apellido_paterno: string | null;
  apellido_materno: string | null; rol: string;
}): UsuarioPerfil {
  const nombreCompleto = [fila.nombres, fila.apellido_paterno, fila.apellido_materno]
    .filter(Boolean)
    .join(' ')
    .trim() || 'Sin registrar';

  return {
    id: fila.id,
    nombre_completo: nombreCompleto,
    rol: fila.rol,
  };
}

export async function obtenerAbogados(): Promise<UsuarioPerfil[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('perfiles')
    .select('id, nombres, apellido_paterno, apellido_materno, rol')
    .in('rol', ['abogado', 'admin', 'asociado_senior', 'finanzas'])
    .order('nombres', { ascending: true });

  if (error || !data) {
    console.error('Error al obtener abogados:', error?.message);
    return [];
  }

  return data.map(mapearUsuario);
}

/** Compatibilidad transitoria: rol pertenece exclusivamente a la firma ACTIVA.
 * Sin membership/contexto ready no se devuelve ningún perfil operativo.
 * Las pantallas nuevas deben consumir useFirm().
 */
export async function obtenerPerfilActual(): Promise<UsuarioPerfil | null> {
  const context = await obtenerContextoUsuarioActual();
  if (context.status !== 'ready') return null;
  return {
    id: context.user.userId,
    nombre_completo: context.user.nombreCompleto,
    rol: context.role,
  };
}

/* ══════════════════════════════════════════════════════════════
   QUERY: Obtener perfil editable del usuario autenticado
   ──────────────────────────────────────────────────────────────
   Retorna campos granulares (nombres, apellidos, teléfono)
   para la pantalla de "Mi Perfil".
   ══════════════════════════════════════════════════════════════ */

export interface PerfilEditable {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  telefono: string;
  email: string;
  rol: string;
}

export async function obtenerPerfilEditable(): Promise<PerfilEditable | null> {
  const context = await obtenerContextoUsuarioActual();
  if (context.status !== 'ready') return null;
  const supabase = createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', context.user.userId)
    .maybeSingle();

  if (error || !data) {
    console.error('Error al obtener perfil editable:', error?.message);
    return null;
  }

  return {
    id: data.id,
    nombres: typeof data.nombres === 'string' ? data.nombres : '',
    apellidoPaterno: typeof data.apellido_paterno === 'string' ? data.apellido_paterno : '',
    apellidoMaterno: typeof data.apellido_materno === 'string' ? data.apellido_materno : '',
    telefono: typeof data.telefono === 'string' ? data.telefono : '',
    email: context.user.email,
    rol: context.role,
  };
}

/* ══════════════════════════════════════════════════════════════
   MUTATION: Actualizar perfil propio
   ══════════════════════════════════════════════════════════════ */

export async function actualizarPerfilPropio(
  datos: { nombres: string; apellidoPaterno: string; apellidoMaterno: string; telefono: string }
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Sesión expirada.' };

  // El contrato entregado no confirma los campos editables adicionales de profiles.
  // Verificarlos en la fila visible evita escribir columnas inventadas o volver a perfiles.
  const { data: profile, error: profileError } = await supabase.from('profiles')
    .select('*').eq('id', user.id).maybeSingle();
  if (profileError || !profile) {
    return { success: false, error: 'No se pudo cargar tu perfil.' };
  }
  if (!['nombres', 'apellido_paterno', 'apellido_materno', 'telefono'].every((field) => Object.hasOwn(profile, field))) {
    return { success: false, error: 'La edición de estos datos personales todavía no está disponible.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      nombres: datos.nombres || null,
      apellido_paterno: datos.apellidoPaterno || null,
      apellido_materno: datos.apellidoMaterno || null,
      telefono: datos.telefono || null,
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error al actualizar perfil propio:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/* ══════════════════════════════════════════════════════════════
   MUTATION: Cambiar contraseña del usuario autenticado
   ══════════════════════════════════════════════════════════════ */

export async function cambiarContrasena(
  nuevaContrasena: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.auth.updateUser({
    password: nuevaContrasena,
  });

  if (error) {
    console.error('Error al cambiar contraseña:', error.message);
    return { success: false, error: error.message };
  }

  return { success: true };
}
