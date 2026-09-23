import { createClient } from '../supabase/client';
import { InformeAvance } from '../../domain/entities/InformeAvance';
import { registrarLog } from '@/infrastructure/repositories/auditoriaRepository';

export async function crearInforme(
  informeData: Omit<InformeAvance, 'id' | 'createdAt'>
): Promise<InformeAvance | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('informes_avance')
    .insert([{
      expediente_id: informeData.expedienteId,
      mes_anio: informeData.mesAnio,
      resumen_proceso: informeData.resumenProceso ?? null,
      estado_actual: informeData.estadoActual ?? null,
      medidas_precautorias: informeData.medidasPrecautorias ?? null,
      comentario: informeData.comentario ?? null,
      creado_por: informeData.creadoPor,
    }])
    .select()
    .single();

  if (error) {
    console.error("Error al crear informe de avance:", error.message);
    return null;
  }

  /* ── Audit Log (non-blocking) ──────────────────────────────── */
  try {
    await registrarLog({
      accion: 'CREAR',
      entidad: 'informes_avance',
      entidad_id: data.id,
      detalles: {
        expediente_id: data.expediente_id,
        mes_anio: data.mes_anio,
        timestamp_operacion: new Date().toISOString(),
      },
    });
  } catch { /* El log no debe bloquear la operación principal */ }

  return {
    id: data.id,
    expedienteId: data.expediente_id,
    mesAnio: data.mes_anio,
    resumenProceso: data.resumen_proceso ?? undefined,
    estadoActual: data.estado_actual ?? undefined,
    medidasPrecautorias: data.medidas_precautorias ?? undefined,
    comentario: data.comentario ?? undefined,
    creadoPor: data.creado_por,
    createdAt: data.created_at,
  };
}

export async function obtenerInformesPorExpediente(expedienteId: string): Promise<InformeAvance[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('informes_avance')
    .select('*')
    .eq('expediente_id', expedienteId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error("Error al obtener informes:", error?.message);
    return [];
  }

  return data.map(fila => ({
    id: fila.id,
    expedienteId: fila.expediente_id,
    mesAnio: fila.mes_anio,
    resumenProceso: fila.resumen_proceso ?? undefined,
    estadoActual: fila.estado_actual ?? undefined,
    medidasPrecautorias: fila.medidas_precautorias ?? undefined,
    comentario: fila.comentario ?? undefined,
    creadoPor: fila.creado_por,
    createdAt: fila.created_at,
  }));
}
