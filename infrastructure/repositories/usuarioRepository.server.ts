import { createClient as createServerClient } from '@/infrastructure/supabase/server';
import type { UsuarioPerfil } from '@/domain/entities/UsuarioPerfil';
import { mapearUsuario } from './usuarioRepository';

export async function obtenerPerfilActualServer(): Promise<UsuarioPerfil | null> {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('perfiles')
    .select('id, nombres, apellido_paterno, apellido_materno, rol')
    .eq('id', user.id)
    .maybeSingle();

  if (!data && user) {
    return { id: user.id, nombre_completo: 'Socio Director', rol: 'admin' };
  }

  return data ? mapearUsuario(data) : null;
}
