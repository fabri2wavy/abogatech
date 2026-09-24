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
import type { FirmRole } from '@/domain/entities/FirmContext';
import { obtenerContextoUsuarioActual } from './firmRepository';

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
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
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
  rol: FirmRole;
}

/** Compatibilidad transitoria: el rol es de la firma activa, no del profile. */
export async function obtenerPerfilConRol(): Promise<PerfilConRol | null> {
  const context = await obtenerContextoUsuarioActual();
  if (context.status !== 'ready') return null;
  return { email: context.user.email, rol: context.role };
}
