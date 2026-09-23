import { createClient } from '../supabase/client';
import {
  EventoAgenda,
  EventoAgendaDetallado,
  TipoEventoAgenda,
  EstadoEventoAgenda,
} from '../../domain/entities/EventoAgenda';

/* ══════════════════════════════════════════════════════════════
   Tipo de payload para creación (campos generados excluidos)
   ══════════════════════════════════════════════════════════════ */

type CrearEventoPayload = Omit<EventoAgenda, 'id' | 'creadoEn' | 'creadoPor'>;

/* ══════════════════════════════════════════════════════════════
   Contrato de Filtros — campos opcionales para consultas
   dinámicas sobre la tabla `agenda_eventos`.
   ══════════════════════════════════════════════════════════════ */

export interface FiltrosAgenda {
  abogadoId?: string;
  fechaInicio?: string;  // ISO 8601 — límite inferior (>=)
  fechaFin?: string;     // ISO 8601 — límite superior (<=)
  tipo?: TipoEventoAgenda;
}

/* ══════════════════════════════════════════════════════════════
   Helpers internos de mapeo snake_case → camelCase
   ══════════════════════════════════════════════════════════════ */

interface FilaEventoDetallado {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo_evento: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin: string;
  expediente_id: string | null;
  asignado_a: string;
  creado_por: string;
  creado_en: string;
  expedientes: { numero_caso: string; titulo: string } | null;
  asignado: {
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string;
  } | null;
}

function mapearEventoDetallado(fila: FilaEventoDetallado): EventoAgendaDetallado {
  return {
    id: fila.id,
    titulo: fila.titulo,
    descripcion: fila.descripcion,
    tipoEvento: fila.tipo_evento as TipoEventoAgenda,
    estado: fila.estado as EstadoEventoAgenda,
    fechaInicio: fila.fecha_inicio,
    fechaFin: fila.fecha_fin,
    expedienteId: fila.expediente_id,
    asignadoA: fila.asignado_a,
    creadoPor: fila.creado_por,
    creadoEn: fila.creado_en,
    expediente: fila.expedientes
      ? { numeroCaso: fila.expedientes.numero_caso, titulo: fila.expedientes.titulo }
      : null,
    asignado: {
      nombres: fila.asignado?.nombres ?? '',
      apellidoPaterno: fila.asignado?.apellido_paterno ?? '',
      apellidoMaterno: fila.asignado?.apellido_materno ?? '',
    },
  };
}

/* ══════════════════════════════════════════════════════════════
   QUERY: Obtener eventos con filtrado dinámico
   ──────────────────────────────────────────────────────────────
   Relaciones:
     • expedientes (LEFT JOIN — puede ser null)
     • perfiles via FK asignado_a (!inner — INNER JOIN obligatorio)

   Filtros aplicados condicionalmente:
     • abogadoId  → .eq('asignado_a', ...)
     • fechaInicio → .gte('fecha_inicio', ...)
     • fechaFin    → .lte('fecha_inicio', ...)
     • tipo        → .eq('tipo_evento', ...)
   ══════════════════════════════════════════════════════════════ */

export async function obtenerEventos(
  filtros?: FiltrosAgenda
): Promise<EventoAgendaDetallado[]> {
  const supabase = createClient();

  let query = supabase
    .from('agenda_eventos')
    .select(`
      *,
      expedientes(numero_caso, titulo),
      asignado:perfiles!asignado_a!inner(nombres, apellido_paterno, apellido_materno)
    `);

  /* ── Inyección condicional de cláusulas ──────────────────── */
  if (filtros?.abogadoId) {
    query = query.eq('asignado_a', filtros.abogadoId);
  }

  if (filtros?.fechaInicio) {
    query = query.gte('fecha_inicio', filtros.fechaInicio);
  }

  if (filtros?.fechaFin) {
    query = query.lte('fecha_inicio', filtros.fechaFin);
  }

  if (filtros?.tipo) {
    query = query.eq('tipo_evento', filtros.tipo);
  }

  const { data, error } = await query.order('fecha_inicio', { ascending: true });

  if (error) {
    throw new Error(`Error al obtener eventos de la agenda: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  return (data as unknown as FilaEventoDetallado[]).map(mapearEventoDetallado);
}

/* ══════════════════════════════════════════════════════════════
   MUTATION: Crear un nuevo evento en la agenda
   ──────────────────────────────────────────────────────────────
   • El campo `creado_por` se inyecta desde la sesión activa.
   • El payload del cliente NO incluye id, creado_en ni creado_por.
   ══════════════════════════════════════════════════════════════ */

export async function crearEvento(
  payload: CrearEventoPayload
): Promise<EventoAgenda> {
  const supabase = createClient();

  /* ── Extraer usuario autenticado ─────────────────────────── */
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error(
      `No se pudo verificar la sesión del usuario: ${authError?.message ?? 'Usuario no autenticado.'}`
    );
  }

  const userId = user.id;

  /* ── Inserción DML ───────────────────────────────────────── */
  const { data, error } = await supabase
    .from('agenda_eventos')
    .insert({
      titulo: payload.titulo,
      descripcion: payload.descripcion,
      tipo_evento: payload.tipoEvento,
      estado: payload.estado,
      fecha_inicio: payload.fechaInicio,
      fecha_fin: payload.fechaFin,
      expediente_id: payload.expedienteId,
      asignado_a: payload.asignadoA,
      creado_por: userId,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(
      `Error al crear el evento: ${error?.message ?? 'No se recibieron datos de la inserción.'}`
    );
  }

  /* ── Mapeo de respuesta → entidad de dominio ─────────────── */
  return {
    id: data.id,
    titulo: data.titulo,
    descripcion: data.descripcion,
    tipoEvento: data.tipo_evento as TipoEventoAgenda,
    estado: data.estado as EstadoEventoAgenda,
    fechaInicio: data.fecha_inicio,
    fechaFin: data.fecha_fin,
    expedienteId: data.expediente_id,
    asignadoA: data.asignado_a,
    creadoPor: data.creado_por,
    creadoEn: data.creado_en,
  };
}
export async function actualizarEvento(
  id: string,
  payload: Partial<CrearEventoPayload>
): Promise<void> {
  const supabase = createClient();

  // Convertimos el payload camelCase a snake_case para Supabase
  const updateData: any = {};
  if (payload.titulo) updateData.titulo = payload.titulo;
  if (payload.descripcion !== undefined) updateData.descripcion = payload.descripcion;
  if (payload.tipoEvento) updateData.tipo_evento = payload.tipoEvento;
  if (payload.estado) updateData.estado = payload.estado;
  if (payload.fechaInicio) updateData.fecha_inicio = payload.fechaInicio;
  if (payload.fechaFin) updateData.fecha_fin = payload.fechaFin;
  if (payload.expedienteId !== undefined) updateData.expediente_id = payload.expedienteId;
  if (payload.asignadoA) updateData.asignado_a = payload.asignadoA;

  const { error } = await supabase
    .from('agenda_eventos')
    .update(updateData)
    .eq('id', id);

  if (error) throw new Error(`Error al actualizar el evento: ${error.message}`);
}

/* ══════════════════════════════════════════════════════════════
   MUTATION: Eliminar un evento
   ══════════════════════════════════════════════════════════════ */
export async function eliminarEvento(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('agenda_eventos')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Error al eliminar el evento: ${error.message}`);
}
