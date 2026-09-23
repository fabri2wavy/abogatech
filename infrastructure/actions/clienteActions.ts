'use server';

import { createClient as createServerClient } from '@/infrastructure/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

/* ── Cliente Admin (service_role — bypass RLS) ───────────────── */
const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Convierte un cliente potencial a activo.
 * Solo puede ser ejecutado por 'admin' o 'abogado'.
 * Genera una contraseña temporal y actualiza `auth.users`.
 */
export async function convertirClienteActivo(
  clienteId: string,
  datosGeneralesLey: any
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();
    
    // 1. Validar sesión del usuario que invoca la acción
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'No autorizado o sesión expirada.' };
    }
    const loggedInUserId = user.id;

    // 2. Validar el rol (solo admin o abogado)
    // Utilizamos el cliente autenticado (sujeto a RLS) o un rpc para verificar el rol.
    const { data: perfilInvocador, error: perfilError } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', loggedInUserId)
      .single();

    if (perfilError || !perfilInvocador) {
      return { success: false, error: 'No se pudo verificar tu rol.' };
    }

    if (perfilInvocador.rol !== 'admin' && perfilInvocador.rol !== 'abogado') {
      return { success: false, error: 'Privilegios insuficientes para realizar esta acción.' };
    }

    // 3. Generar una contraseña temporal segura
    // Para simplificar, generamos un string aleatorio alfanumérico + carácter especial
    const array = new Uint32Array(3);
    crypto.getRandomValues(array);
    const tempPassword = Array.from(array, dec => dec.toString(36)).join('').substring(0, 10) + 'A1!';

    // 4. Actualizar la contraseña en auth.users (bypass RLS con Admin API)
    const { error: updateAuthError, data: updateAuthData } = await supabaseAdmin.auth.admin.updateUserById(
      clienteId,
      { password: tempPassword }
    );

    if (updateAuthError) {
      console.error('[clienteActions] Error al actualizar password en auth.users:', updateAuthError.message);
      return { success: false, error: `Error de autenticación: ${updateAuthError.message}` };
    }

    // 5. Actualizar detalles_cliente (cambiar etapa a 'activo' y guardar datos de ley)
    // Extraemos campos, limpiando los nulos si los hay, o usando datosGeneralesLey tal cual.
    const updatePayload = {
      ...datosGeneralesLey,
      etapa_comercial: 'activo'
    };

    const { error: updateDetalleError } = await supabaseAdmin
      .from('detalles_cliente')
      .update(updatePayload)
      .eq('perfil_id', clienteId);

    if (updateDetalleError) {
      console.error('[clienteActions] Error actualizando detalles_cliente:', updateDetalleError.message);
      return { success: false, error: `Error al actualizar BD: ${updateDetalleError.message}` };
    }

    // 6. Enviar notificación (Placeholder estructurado)
    const emailToNotify = updateAuthData?.user?.email || 'email_no_encontrado@ejemplo.com';
    const telefonoToNotify = datosGeneralesLey.telefono || 'teléfono no registrado';
    
    console.log(`
      ===============================================================
      [NOTIFICACIÓN] CONVERSIÓN DE CLIENTE A ACTIVO
      ---------------------------------------------------------------
      Cliente ID: ${clienteId}
      Email: ${emailToNotify}
      Teléfono: ${telefonoToNotify}
      Contraseña Temporal Asignada: ${tempPassword}
      ---------------------------------------------------------------
      * Esta es una salida simulada. Aquí debes integrar Resend, 
        Nodemailer, o tu API SMS preferida.
      ===============================================================
    `);

    // Refrescar caché de las rutas afectadas
    revalidatePath('/dashboard/clientes');
    revalidatePath(`/dashboard/clientes/${clienteId}`);

    return { success: true };
  } catch (e: any) {
    console.error('[clienteActions] Excepción inesperada:', e.message);
    return { success: false, error: `Error interno: ${e.message}` };
  }
}
