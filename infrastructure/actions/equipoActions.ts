'use server';

import { createClient } from '@supabase/supabase-js';
import { MiembroEquipo } from '../../domain/entities/MiembroEquipo';

/* ══════════════════════════════════════════════════════════════
   Cliente Admin (service_role — bypass RLS)
   ══════════════════════════════════════════════════════════════ */

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/* ══════════════════════════════════════════════════════════════
   Tipo de entrada (sin campos generados por el servidor)
   ══════════════════════════════════════════════════════════════ */

type DatosNuevoMiembro = Omit<MiembroEquipo, 'id' | 'estadoLaboral'> & {
  /** Contraseña temporal asignada por el admin para el primer inicio de sesión */
  password: string;
};

/* ══════════════════════════════════════════════════════════════
   SERVER ACTION: Registrar nuevo miembro del equipo
   ──────────────────────────────────────────────────────────────
   Transacción de 3 pasos:
     1. auth.admin.createUser → genera el UUID en auth.users
     2. Insert en `perfiles` con ese UUID
     3. Insert en `detalles_equipo` con ese UUID

   Si falla el paso 2 o 3, se elimina el usuario de Auth
   para no dejar datos huérfanos.
   ══════════════════════════════════════════════════════════════ */

export async function registrarNuevoMiembro(
  datos: DatosNuevoMiembro
): Promise<{ success: true; data: MiembroEquipo } | { success: false; error: string }> {
  let userId: string | null = null;

  try {
    /* ── Paso 1: Crear usuario en Auth ────────────────────────── */
    const email = datos.email?.trim();
    if (!email) {
      return { success: false, error: 'El correo electrónico es obligatorio para crear la cuenta.' };
    }

    const password = datos.password?.trim();
    if (!password || password.length < 6) {
      return { success: false, error: 'La contraseña temporal debe tener al menos 6 caracteres.' };
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('[equipoActions] Error auth.admin.createUser:', authError.message);
      return { success: false, error: `Error al crear la cuenta: ${authError.message}` };
    }

    if (!authData.user?.id) {
      return { success: false, error: 'No se pudo obtener el ID del usuario creado.' };
    }

    userId = authData.user.id;

    /* ── Paso 2: Insertar en `perfiles` ──────────────────────── */
    /* ── Paso 2: Insertar o Actualizar en `perfiles` ──────────────────────── */
    const { error: perfilError } = await supabaseAdmin
      .from('perfiles')
      .upsert({ // Cambiamos update() por upsert()
        id: userId, // ¡CRÍTICO! Debemos enviar el ID
        nombres: datos.nombres,
        apellido_paterno: datos.apellidoPaterno,
        apellido_materno: datos.apellidoMaterno || null,
        telefono: datos.telefono || null,
        rol: datos.rol,
      });

    if (perfilError) {
      console.error('[equipoActions] Error upsert perfiles:', perfilError.message);
      /* Rollback: eliminar el usuario de Auth */
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return { success: false, error: `Error al crear el perfil: ${perfilError.message}` };
    }

    /* ── Paso 3: Insertar en `detalles_equipo` ───────────────── */
    const { error: detalleError } = await supabaseAdmin
      .from('detalles_equipo')
      .insert({
        id: userId,
        cargo: datos.cargo,
        especialidad: datos.especialidad || null,
        estado_laboral: 'activo',
      });

    if (detalleError) {
      console.error('[equipoActions] Error insert detalles_equipo:', detalleError.message);
      /* Rollback: eliminar perfil y usuario de Auth */
      await supabaseAdmin.from('perfiles').delete().eq('id', userId);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return { success: false, error: `Error al crear los detalles: ${detalleError.message}` };
    }

    /* ── Éxito: retornar la entidad de dominio completa ───────── */
    return {
      success: true,
      data: {
        id: userId,
        nombres: datos.nombres,
        apellidoPaterno: datos.apellidoPaterno,
        apellidoMaterno: datos.apellidoMaterno,
        email: email,
        telefono: datos.telefono || null,
        rol: datos.rol,
        cargo: datos.cargo,
        especialidad: datos.especialidad || null,
        estadoLaboral: 'activo',
      },
    };
  } catch (err: any) {
    console.error('[equipoActions] Excepción inesperada:', err.message);

    /* Rollback de emergencia si hay userId */
    if (userId) {
      await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => {});
    }

    return { success: false, error: `Error inesperado: ${err.message}` };
  }
}

/* ══════════════════════════════════════════════════════════════
   SERVER ACTION: Actualizar miembro del equipo
   ══════════════════════════════════════════════════════════════ */
export async function actualizarMiembroAction(
  id: string,
  datos: Partial<MiembroEquipo>
): Promise<{ success: boolean; error?: string }> {
  try {
    const datosPerfil: any = {};
    if (datos.nombres !== undefined) datosPerfil.nombres = datos.nombres;
    if (datos.apellidoPaterno !== undefined) datosPerfil.apellido_paterno = datos.apellidoPaterno;
    if (datos.apellidoMaterno !== undefined) datosPerfil.apellido_materno = datos.apellidoMaterno;
    if (datos.telefono !== undefined) datosPerfil.telefono = datos.telefono;
    if (datos.rol !== undefined) datosPerfil.rol = datos.rol;

    if (Object.keys(datosPerfil).length > 0) {
      const { error } = await supabaseAdmin.from('perfiles').update(datosPerfil).eq('id', id);
      if (error) throw new Error(error.message);
    }

    const datosDetalle: any = {};
    if (datos.cargo !== undefined) datosDetalle.cargo = datos.cargo;
    if (datos.especialidad !== undefined) datosDetalle.especialidad = datos.especialidad;
    if (datos.estadoLaboral !== undefined) datosDetalle.estado_laboral = datos.estadoLaboral;

    if (Object.keys(datosDetalle).length > 0) {
      const { error } = await supabaseAdmin.from('detalles_equipo').update(datosDetalle).eq('id', id);
      if (error) throw new Error(error.message);
    }

    return { success: true };
  } catch (err: any) {
    console.error('[equipoActions] Error en actualizarMiembroAction:', err.message);
    return { success: false, error: err.message };
  }
}

/* ══════════════════════════════════════════════════════════════
   SERVER ACTION: Eliminar miembro del equipo
   ──────────────────────────────────────────────────────────────
   Orden estricto para evitar errores de integridad:
   1. detalles_equipo
   2. perfiles
   3. auth.users
   ══════════════════════════════════════════════════════════════ */
export async function eliminarMiembroAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Eliminar de detalles_equipo
    const { error: detError } = await supabaseAdmin.from('detalles_equipo').delete().eq('id', id);
    if (detError) throw new Error(`Error al eliminar detalles: ${detError.message}`);

    // 2. Eliminar de perfiles
    const { error: perfError } = await supabaseAdmin.from('perfiles').delete().eq('id', id);
    if (perfError) throw new Error(`Error al eliminar perfil: ${perfError.message}`);

    // 3. Eliminar de auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authError) throw new Error(`Error al eliminar usuario de autenticación: ${authError.message}`);

    return { success: true };
  } catch (err: any) {
    console.error('[equipoActions] Error en eliminarMiembroAction:', err.message);
    return { success: false, error: err.message };
  }
}
