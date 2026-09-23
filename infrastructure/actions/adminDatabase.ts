"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function completarRegistroClienteAdmin(userId: string, datos: any, creadoPorId?: string) {
    try {
        const { error: perfilError } = await supabaseAdmin
            .from('perfiles')
            .upsert({
                id: userId,       
                nombres: datos.nombres || null,
                apellido_paterno: datos.apellidoPaterno || null,
                apellido_materno: datos.apellidoMaterno || null,
                telefono: datos.telefono || null,
                rol: 'cliente',
                creado_por: creadoPorId || null,
            }, { onConflict: 'id' });

        if (perfilError) throw new Error(perfilError.message);

        const { error: detalleError } = await supabaseAdmin
            .from('detalles_cliente')
            .insert([{
                perfil_id: userId,
                ci: datos.ci || null,
                expedido: datos.expedido || null,
                nacionalidad: datos.nacionalidad || null,
                fecha_nacimiento: datos.fechaNacimiento || null,
                estado_civil: datos.estadoCivil || null,
                profesion: datos.profesion || null,
                direccion: datos.direccion || null,
                telefono_laboral: datos.telefonoLaboral || null,
                direccion_oficina: datos.direccionOficina || null,
                referido_por: datos.referidoPor || null,
                contacto_referidor: datos.contactoReferidor || null,
                etapa_comercial: datos.etapaComercial || 'activo',
                tipo_cliente: datos.tipoCliente || 'persona',
                nombre_empresa: datos.nombreEmpresa || null,
                representante_legal: datos.representanteLegal || null,
                area_especialidad: datos.areaEspecialidad || null,
            }]);

        if (detalleError) throw new Error(detalleError.message);

        revalidatePath('/dashboard/casos');
        revalidatePath('/dashboard/casos/nuevo');

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/* ── Actualizar perfil de un cliente (bypass RLS) ────────────── */
export async function actualizarPerfilAdmin(
  userId: string,
  perfilData: {
    nombres?: string | null;
    apellido_paterno?: string | null;
    apellido_materno?: string | null;
    telefono?: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const updatePayload: Record<string, any> = {};
    if (perfilData.nombres !== undefined) updatePayload.nombres = perfilData.nombres;
    if (perfilData.apellido_paterno !== undefined) updatePayload.apellido_paterno = perfilData.apellido_paterno;
    if (perfilData.apellido_materno !== undefined) updatePayload.apellido_materno = perfilData.apellido_materno;
    if (perfilData.telefono !== undefined) updatePayload.telefono = perfilData.telefono;

    if (Object.keys(updatePayload).length === 0) {
      return { success: true };
    }

    const { error } = await supabaseAdmin
      .from('perfiles')
      .update(updatePayload)
      .eq('id', userId);

    if (error) {
      console.error('[adminDB] Error actualizando perfil:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e: any) {
    console.error('[adminDB] Excepción al actualizar perfil:', e.message);
    return { success: false, error: e.message };
  }
}

/* ── Eliminar perfil de un cliente (bypass RLS) ──────────────── */
export async function eliminarPerfilAdmin(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    /* 1. Verificar si tiene expedientes (FK constraint) */
    const { count, error: countError } = await supabaseAdmin
      .from('expedientes')
      .select('*', { count: 'exact', head: true })
      .eq('cliente_id', userId);

    if (countError) {
      console.error('[adminDB] Error verificando expedientes:', countError.message);
      return { success: false, error: countError.message };
    }

    if (count && count > 0) {
      return { success: false, error: 'HAS_CASES' };
    }

    /* 2. Eliminar detalles del cliente (tabla dependiente) */
    await supabaseAdmin
      .from('detalles_cliente')
      .delete()
      .eq('perfil_id', userId);

    /* 3. Eliminar perfil */
    const { error: deleteError } = await supabaseAdmin
      .from('perfiles')
      .delete()
      .eq('id', userId);

    if (deleteError) {
      console.error('[adminDB] Error eliminando perfil:', deleteError.message);
      return { success: false, error: deleteError.message };
    }

    /* 4. Eliminar usuario de Auth */
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error('[adminDB] Perfil eliminado pero error auth:', authError.message);
      /* No retornamos error porque el perfil ya se borró */
    }

    return { success: true };
  } catch (e: any) {
    console.error('[adminDB] Excepción al eliminar cliente:', e.message);
    return { success: false, error: e.message };
  }
}

/* ── Actualizar detalles de ley de un cliente (bypass RLS) ────── */
export async function actualizarDetallesAdmin(
  userId: string,
  detallesData: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (Object.keys(detallesData).length === 0) {
      return { success: true };
    }

    const { error } = await supabaseAdmin
      .from('detalles_cliente')
      .upsert({ perfil_id: userId, ...detallesData }, { onConflict: 'perfil_id' });

    if (error) {
      console.error('[adminDB] Error actualizando detalles:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e: any) {
    console.error('[adminDB] Excepción al actualizar detalles:', e.message);
    return { success: false, error: e.message };
  }
}