import { createClient } from '@/infrastructure/supabase/client';
import type { UsuarioPerfil } from '@/domain/entities/UsuarioPerfil';

function mapearUsuario(fila: any): UsuarioPerfil {
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

export async function obtenerAbogadosYSocios(): Promise<UsuarioPerfil[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('perfiles')
    .select('id, nombres, apellido_paterno, apellido_materno, rol')
    .in('rol', ['abogado', 'admin', 'asociado_senior', 'finanzas'])
    .order('nombres', { ascending: true });

  if (error || !data) {
    console.error('Error al obtener abogados y socios:', error?.message);
    return [];
  }

  return data.map(mapearUsuario);
}

export async function compartirExpediente(
  expedienteId: string,
  abogadoId: string,
  otorgadoPor?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const idUsuarioActual = user?.id || otorgadoPor;

  if (!idUsuarioActual) {
    return { success: false, error: 'No se pudo verificar la sesión del usuario actual.' };
  }

  // Verificar si ya existe acceso
  const { data: existente } = await supabase
    .from('expediente_accesos')
    .select('id')
    .eq('expediente_id', expedienteId)
    .eq('abogado_id', abogadoId)
    .single();

  if (existente) {
    return { success: false, error: 'Este usuario ya tiene acceso al expediente.' };
  }

  const { error } = await supabase
    .from('expediente_accesos')
    .insert({
      expediente_id: expedienteId,
      abogado_id: abogadoId,
      otorgado_por: idUsuarioActual,
    });

  if (error) {
    console.error('Error al compartir expediente:', error.message);
    if (error.code === '42501' || error.message.includes('row-level security')) {
      return {
        success: false,
        error: 'No tienes permisos de seguridad suficientes para compartir este expediente. Solo el abogado principal del caso o un socio pueden otorgar accesos.',
      };
    }
    return { success: false, error: 'Error al compartir el expediente.' };
  }

  return { success: true };
}
