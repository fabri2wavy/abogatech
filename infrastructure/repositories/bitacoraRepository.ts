import { createClient } from '../supabase/client';
import { EntradaBitacora } from '../../domain/entities/EntradaBitacora';

function construirNombre(n?: string | null, p?: string | null, m?: string | null): string {
  return [n, p, m].filter(Boolean).join(' ').trim() || 'Desconocido';
}

export async function obtenerBitacoraPorExpediente(
  expedienteId: string
): Promise<EntradaBitacora[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bitacora')
    .select('*, autor:perfiles!creado_por(nombres, apellido_paterno, apellido_materno)')
    .eq('expediente_id', expedienteId)
    .order('creado_en', { ascending: false });

  if (error || !data) {
    console.error('Error al listar bitácora:', error?.message);
    return [];
  }

  return data.map(fila => ({
    id: fila.id,
    expedienteId: fila.expediente_id,
    contenido: fila.contenido,
    visibleCliente: fila.visible_cliente ?? false,
    creadoPor: fila.creado_por,
    autorNombre: construirNombre(fila.autor?.nombres, fila.autor?.apellido_paterno, fila.autor?.apellido_materno),
    creadoEn: new Date(fila.creado_en),
  }));
}

export async function crearEntradaBitacora(
  expedienteId: string,
  contenido: string,
  visibleCliente: boolean,
  usuarioId: string
): Promise<EntradaBitacora | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('bitacora')
    .insert([{
      expediente_id: expedienteId,
      contenido,
      visible_cliente: visibleCliente,
      creado_por: usuarioId,
    }])
    .select('*, autor:perfiles!creado_por(nombres, apellido_paterno, apellido_materno)')
    .single();

  if (error || !data) {
    console.error('Error al crear entrada de bitácora:', error?.message);
    return null;
  }

  return {
    id: data.id,
    expedienteId: data.expediente_id,
    contenido: data.contenido,
    visibleCliente: data.visible_cliente ?? false,
    creadoPor: data.creado_por,
    autorNombre: data.autor 
      ? (construirNombre(data.autor.nombres, data.autor.apellido_paterno, data.autor.apellido_materno) === 'Desconocido' ? 'Tú' : construirNombre(data.autor.nombres, data.autor.apellido_paterno, data.autor.apellido_materno))
      : 'Tú',
    creadoEn: new Date(data.creado_en),
  };
}
