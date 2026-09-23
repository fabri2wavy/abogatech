'use server';

import { createClient as createAdminSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '../supabase/server';
import crypto from 'crypto';

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Faltan variables de entorno SUPABASE_URL o SERVICE_ROLE_KEY');
  }

  return createAdminSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function crearUsuarioDesdeAdmin(
  email: string
): Promise<{ userId: string } | { error: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { error: 'No autorizado. Debe iniciar sesión.' };
    }

    const { data: perfilData, error: perfilError } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single();

    if (perfilError || !perfilData || (perfilData.rol !== 'admin' && perfilData.rol !== 'abogado')) {
      return { error: 'Permisos insuficientes. Solo administradores y abogados pueden crear clientes.' };
    }

    const securePassword = crypto.randomBytes(16).toString('base64').slice(0, 16) + 'A1!';
    const adminClient = createAdminClient();

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password: securePassword,
      email_confirm: true,
    });

    if (error) {
      console.error('[adminAuth] Error creando usuario:', error.message);
      return { error: error.message };
    }

    if (!data.user?.id) {
      return { error: 'No se pudo obtener el ID del usuario creado.' };
    }

    // Notificación temporal (placeholder) mientras no haya proveedor de 
    // email/SMS conectado. Este es el ÚNICO registro de la contraseña 
    // generada, ya que email_confirm:true no envía correo de Supabase.
    console.log('[NOTIFICACION_CLIENTE_NUEVO]', {
      email,
      passwordTemporal: securePassword,
      timestamp: new Date().toISOString(),
    });

    return { userId: data.user.id };
  } catch (e: any) {
    console.error('[adminAuth] Excepción inesperada:', e.message);
    return { error: `Error interno: ${e.message}` };
  }
}

export async function obtenerEmailUsuarioPorId(
  userId: string
): Promise<string> {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient.auth.admin.getUserById(userId);

    if (error || !data.user?.email) {
      console.error('[adminAuth] Error obteniendo email:', error?.message);
      return '';
    }

    return data.user.email;
  } catch (e: any) {
    console.error('[adminAuth] Excepción inesperada al obtener email:', e.message);
    return '';
  }
}

/* ── Obtener emails en lote (para el directorio) ─────────────── */
export async function obtenerEmailsUsuariosPorIds(
  userIds: string[]
): Promise<Record<string, string>> {
  try {
    const adminClient = createAdminClient();
    const resultado: Record<string, string> = {};

    /* Supabase Admin listUsers trae todos; filtramos en memoria */
    const { data, error } = await adminClient.auth.admin.listUsers({
      perPage: 1000,
    });

    if (error || !data.users) {
      console.error('[adminAuth] Error listando usuarios:', error?.message);
      return resultado;
    }

    const idsSet = new Set(userIds);
    for (const user of data.users) {
      if (idsSet.has(user.id) && user.email) {
        resultado[user.id] = user.email;
      }
    }

    return resultado;
  } catch (e: any) {
    console.error('[adminAuth] Excepción al obtener emails en lote:', e.message);
    return {};
  }
}
