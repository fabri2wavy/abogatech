import { createClient } from '@/infrastructure/supabase/client';
import type { UsuarioPerfil } from '@/domain/entities/UsuarioPerfil';

export type { UsuarioPerfil };

export function mapearUsuario(fila: any): UsuarioPerfil {
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

let cachePerfil: UsuarioPerfil | null = null;
let currentUserId: string | null = null;

export async function obtenerPerfilActual(): Promise<UsuarioPerfil | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    cachePerfil = null;
    currentUserId = null;
    return null;
  }

  if (cachePerfil && currentUserId === user.id) {
    return cachePerfil;
  }

  const { data, error } = await supabase
    .from('perfiles')
    .select('id, nombres, apellido_paterno, apellido_materno, rol')
    .eq('id', user.id)
    .maybeSingle();

  if (!data && user) {
    const fallback = { id: user.id, nombre_completo: 'Socio Director', rol: 'admin' };
    cachePerfil = fallback;
    currentUserId = user.id;
    return fallback;
  }

  const perfil = data ? mapearUsuario(data) : null;
  if (perfil) {
    cachePerfil = perfil;
    currentUserId = user.id;
  }
  return perfil;
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
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('perfiles')
    .select('id, nombres, apellido_paterno, apellido_materno, telefono, rol')
    .eq('id', user.id)
    .maybeSingle();

  if (error || !data) {
    console.error('Error al obtener perfil editable:', error?.message);
    return null;
  }

  return {
    id: data.id,
    nombres: data.nombres ?? '',
    apellidoPaterno: data.apellido_paterno ?? '',
    apellidoMaterno: data.apellido_materno ?? '',
    telefono: data.telefono ?? '',
    email: user.email ?? '',
    rol: data.rol,
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

  const { error } = await supabase
    .from('perfiles')
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
