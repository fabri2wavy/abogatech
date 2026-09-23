import { createClient } from '../supabase/client';
import { Documento } from '../../domain/entities/Documento';
import { registrarLog } from '@/infrastructure/repositories/auditoriaRepository';

function construirNombre(n?: string | null, p?: string | null, m?: string | null): string {
  return [n, p, m].filter(Boolean).join(' ').trim() || 'Desconocido';
}

const BUCKET = 'documentos';

export async function obtenerDocumentos(
  expedienteId: string
): Promise<Documento[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('documentos')
    .select('*, subido_por_perfil:perfiles!subido_por(nombres, apellido_paterno, apellido_materno)')
    .eq('expediente_id', expedienteId)
    .order('creado_en', { ascending: false });

  if (error || !data) {
    console.error('Error al listar documentos:', error?.message);
    return [];
  }

  return data.map(fila => ({
    id: fila.id,
    nombre: fila.nombre_archivo,
    ruta: fila.ruta_storage,
    tamaño: fila.tamano_bytes ?? 0,
    visibleCliente: fila.visible_cliente ?? false,
    subidoPor: construirNombre(fila.subido_por_perfil?.nombres, fila.subido_por_perfil?.apellido_paterno, fila.subido_por_perfil?.apellido_materno),
    fechaSubida: new Date(fila.creado_en),
  }));
}

export async function subirDocumento(
  expedienteId: string,
  file: File,
  visibleCliente: boolean
): Promise<Documento | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('Error: No hay usuario autenticado para subir documento.');
    return null;
  }
  const timestamp = Date.now();
  const nombreLimpio = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.-]/g, '_');
  const rutaStorage = `${expedienteId}/${timestamp}_${nombreLimpio}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(rutaStorage, file, { upsert: false });

  if (uploadError) {
    console.error('Error al subir archivo a Storage:', uploadError.message);
    return null;
  }
  const { data: insertData, error: insertError } = await supabase
    .from('documentos')
    .insert([{
      expediente_id: expedienteId,
      nombre_archivo: file.name,
      ruta_storage: rutaStorage,
      tipo_archivo: file.type || 'application/octet-stream',
      tamano_bytes: file.size,
      visible_cliente: visibleCliente,
      subido_por: user.id,
    }])
    .select('*, subido_por_perfil:perfiles!subido_por(nombres, apellido_paterno, apellido_materno)')
    .single();

  if (insertError || !insertData) {
    console.error('Error al registrar documento en BD:', insertError?.message);
    await supabase.storage.from(BUCKET).remove([rutaStorage]);
    return null;
  }

  /* ── Audit Log (non-blocking) ──────────────────────────────── */
  try {
    await registrarLog({
      accion: 'CREAR',
      entidad: 'documentos',
      entidad_id: insertData.id,
      detalles: {
        nombre_archivo: file.name,
        expediente_id: expedienteId,
        tamano_bytes: file.size,
        tipo_archivo: file.type,
        timestamp_operacion: new Date().toISOString(),
      },
    });
  } catch { /* El log no debe bloquear la operación principal */ }

  return {
    id: insertData.id,
    nombre: insertData.nombre_archivo,
    ruta: insertData.ruta_storage,
    tamaño: insertData.tamano_bytes ?? file.size,
    visibleCliente: insertData.visible_cliente ?? false,
    subidoPor: insertData.subido_por_perfil 
      ? (construirNombre(insertData.subido_por_perfil.nombres, insertData.subido_por_perfil.apellido_paterno, insertData.subido_por_perfil.apellido_materno) === 'Desconocido' ? 'Tú' : construirNombre(insertData.subido_por_perfil.nombres, insertData.subido_por_perfil.apellido_paterno, insertData.subido_por_perfil.apellido_materno))
      : 'Tú',
    fechaSubida: new Date(insertData.creado_en),
  };
}

export async function obtenerUrlDescarga(
  ruta: string
): Promise<string | null> {
  const supabase = createClient();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(ruta, 3600, { download: true });

  if (error || !data?.signedUrl) {
    console.error('Error al generar URL de descarga:', error?.message);
    return null;
  }

  return data.signedUrl;
}
export async function eliminarDocumento(
  id: string,
  ruta: string
): Promise<boolean> {
  const supabase = createClient();

  /* ── Audit Log ANTES de la purga (captura ID mientras existe) ── */
  try {
    await registrarLog({
      accion: 'ELIMINAR',
      entidad: 'documentos',
      entidad_id: id,
      detalles: {
        ruta_storage: ruta,
        timestamp_operacion: new Date().toISOString(),
      },
    });
  } catch { /* El log no debe bloquear la operación principal */ }

  const { error: dbError } = await supabase
    .from('documentos')
    .delete()
    .eq('id', id);

  if (dbError) {
    console.error('Error al eliminar registro de BD:', dbError.message);
    return false;
  }
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([ruta]);

  if (storageError) {
    console.error('Error al eliminar archivo de Storage (registro BD ya eliminado):', storageError.message);
  }

  return true;
}
export async function actualizarVisibilidad(
  id: string,
  visibleCliente: boolean
): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('documentos')
    .update({ visible_cliente: visibleCliente })
    .eq('id', id);

  if (error) {
    console.error('Error al cambiar visibilidad:', error.message);
    return false;
  }

  return true;
}
