/* ══════════════════════════════════════════════════════════════
   Repositorio de Autenticación (Client-Side)
   ──────────────────────────────────────────────────────────────
   Centraliza TODA interacción con supabase.auth para que los
   componentes de la capa de presentación (app/, components/)
   NUNCA importen ni instancien el cliente de Supabase.

   Regla de Arquitectura:
     UI → authRepository → Supabase Client SDK
   ══════════════════════════════════════════════════════════════ */

import { createClient } from '@/infrastructure/supabase/client';

/* ── Iniciar sesión ─────────────────────────────────────────── */
export async function iniciarSesion(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/* ── Registrar usuario (dev-only) ───────────────────────────── */
export async function registrarUsuario(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/* ── Cerrar sesión ──────────────────────────────────────────── */
export async function cerrarSesion(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}

/* ── Obtener ID del usuario autenticado actual ──────────────── */
export async function obtenerUsuarioActualId(): Promise<string | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/* ── Obtener perfil completo con rol (para sidebar/header) ──── */
export interface PerfilConRol {
  email: string;
  rol: string;
}

export async function obtenerPerfilConRol(): Promise<PerfilConRol | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .maybeSingle();

  if (!perfil) return null;

  return {
    email: user.email || '',
    rol: perfil.rol,
  };
}
