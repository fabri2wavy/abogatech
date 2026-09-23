import { createClient } from '../supabase/client';
import { Expediente, EstadoExpediente } from '../../domain/entities/Expediente';
import { obtenerClientePorId } from './clienteRepository';
import { registrarLog } from '@/infrastructure/repositories/auditoriaRepository';

function construirNombre(
  nombres?: string | null,
  apellidoPaterno?: string | null,
  apellidoMaterno?: string | null,
  fallback = 'Sin registrar'
): string {
  return [nombres, apellidoPaterno, apellidoMaterno]
    .filter(Boolean)
    .join(' ')
    .trim() || fallback;
}

export async function crearExpediente(expedienteData: Omit<Expediente, 'id' | 'fechaCreacion' | 'fechaActualizacion' | 'estado'>): Promise<Expediente | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error("Error: No hay un usuario autenticado.");
    return null;
  }

  const { data, error } = await supabase
    .from('expedientes')
    .insert([{
      numero_caso: expedienteData.numeroCaso,
      titulo: expedienteData.titulo,
      materia: expedienteData.materia,
      juzgado: expedienteData.juzgado,
      parte_contraria: expedienteData.parteContraria,
      informe_despacho: expedienteData.informeDespacho,
      informe_cliente: expedienteData.informeCliente,
      cliente_id: expedienteData.clienteId,
      abogado_asignado_id: expedienteData.abogado_id,
      // ── Campos legales opcionales ─────────────────────────────
      rol_cliente: expedienteData.rolCliente ?? null,
      tipo_proceso: expedienteData.tipoProceso ?? null,
      nurej: expedienteData.nurej ?? null,
      numero_fiscalia: expedienteData.numeroFiscalia ?? null,
      numero_felcc: expedienteData.numeroFelcc ?? null,
      juez_actual: expedienteData.juezActual ?? null,
      secretario_actuario: expedienteData.secretarioActuario ?? null,
      fiscal_actual: expedienteData.fiscalActual ?? null,
      investigador_asignado: expedienteData.investigadorAsignado ?? null,
      etapa_procesal: expedienteData.etapaProcesal ?? null,
      cuantia: expedienteData.cuantia ?? null,
    }])
    .select()
    .single();

  if (error) {
    console.error("Error al crear expediente:", error.message);
    return null;
  }

  /* ── Audit Log (non-blocking) ──────────────────────────────── */
  try {
    await registrarLog({
      accion: 'CREAR',
      entidad: 'expedientes',
      entidad_id: data.id,
      detalles: {
        numero_caso: data.numero_caso,
        titulo: data.titulo,
        materia: data.materia,
        timestamp_operacion: new Date().toISOString(),
      },
    });
  } catch { /* El log no debe bloquear la operación principal */ }

  return {
    id: data.id,
    numeroCaso: data.numero_caso,
    titulo: data.titulo,
    materia: data.materia,
    juzgado: data.juzgado,
    parteContraria: data.parte_contraria,
    informeDespacho: data.informe_despacho,
    informeCliente: data.informe_cliente,
    estado: data.estado as EstadoExpediente,
    clienteId: data.cliente_id,
    abogado_id: data.abogado_asignado_id,
    fechaCreacion: new Date(data.fecha_creacion),
    fechaActualizacion: new Date(data.fecha_actualizacion),
    rolCliente: data.rol_cliente ?? undefined,
    tipoProceso: data.tipo_proceso ?? undefined,
    nurej: data.nurej ?? undefined,
    numeroFiscalia: data.numero_fiscalia ?? undefined,
    numeroFelcc: data.numero_felcc ?? undefined,
    juezActual: data.juez_actual ?? undefined,
    secretarioActuario: data.secretario_actuario ?? undefined,
    fiscalActual: data.fiscal_actual ?? undefined,
    investigadorAsignado: data.investigador_asignado ?? undefined,
    etapaProcesal: data.etapa_procesal ?? undefined,
    cuantia: data.cuantia ?? undefined,
    archivado: data.archivado ?? false,
  };
}

export async function obtenerExpedientes(): Promise<any[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('expedientes')
    .select(`
      *, 
      cliente:perfiles!cliente_id(nombres, apellido_paterno, apellido_materno), 
      abogado:perfiles!abogado_asignado_id(nombres, apellido_paterno, apellido_materno)
    `)
    .is('archivado', false)
    .order('fecha_creacion', { ascending: false });

  if (error || !data) {
    console.error("Error al obtener expedientes:", error?.message);
    return [];
  }

  return data.map(fila => ({
    id: fila.id,
    numeroCaso: fila.numero_caso,
    titulo: fila.titulo,
    materia: fila.materia,
    juzgado: fila.juzgado,
    parteContraria: fila.parte_contraria,
    estado: fila.estado,
    nombreCliente: construirNombre(
      fila.cliente?.nombres,
      fila.cliente?.apellido_paterno,
      fila.cliente?.apellido_materno,
      'Cliente Desconocido'
    ),
    abogado_id: fila.abogado_asignado_id,
    abogado_nombre: construirNombre(
      fila.abogado?.nombres,
      fila.abogado?.apellido_paterno,
      fila.abogado?.apellido_materno,
      'Sin asignar'
    ),
    fechaCreacion: new Date(fila.fecha_creacion),
    // ── Campos legales opcionales ───────────────────────────────
    rolCliente: fila.rol_cliente ?? undefined,
    tipoProceso: fila.tipo_proceso ?? undefined,
    nurej: fila.nurej ?? undefined,
    numeroFiscalia: fila.numero_fiscalia ?? undefined,
    numeroFelcc: fila.numero_felcc ?? undefined,
    juezActual: fila.juez_actual ?? undefined,
    secretarioActuario: fila.secretario_actuario ?? undefined,
    fiscalActual: fila.fiscal_actual ?? undefined,
    investigadorAsignado: fila.investigador_asignado ?? undefined,
    etapaProcesal: fila.etapa_procesal ?? undefined,
    cuantia: fila.cuantia ?? undefined,
    archivado: fila.archivado ?? false,
  }));
}

export async function obtenerExpedientePorId(id: string): Promise<any | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('expedientes')
    .select(`
      *, 
      cliente:perfiles!cliente_id(id, nombres, apellido_paterno, apellido_materno, telefono), 
      abogado:perfiles!abogado_asignado_id(id, nombres, apellido_paterno, apellido_materno, telefono)
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error("Error al obtener el expediente:", error?.message);
    return null;
  }
  let nombreCliente = construirNombre(
    data.cliente?.nombres,
    data.cliente?.apellido_paterno,
    data.cliente?.apellido_materno,
    'Cliente no asignado'
  );
  let emailCliente = '';
  if (data.cliente_id) {
    const clienteCompleto = await obtenerClientePorId(data.cliente_id);
    emailCliente = clienteCompleto?.email ?? '';
    if (clienteCompleto?.nombreCompleto) {
      nombreCliente = clienteCompleto.nombreCompleto;
    }
  }

  return {
    id: data.id,
    numeroCaso: data.numero_caso,
    titulo: data.titulo,
    materia: data.materia,
    juzgado: data.juzgado,
    parteContraria: data.parte_contraria,
    informeDespacho: data.informe_despacho,
    informeCliente: data.informe_cliente,
    estado: data.estado,
    clienteId: data.cliente_id,
    cliente: {
      id: data.cliente?.id ?? '',
      nombre_completo: nombreCliente,
      telefono: data.cliente?.telefono ?? '',
      email: emailCliente,
    },
    abogado_id: data.abogado_asignado_id,
    abogado_nombre: construirNombre(
      data.abogado?.nombres,
      data.abogado?.apellido_paterno,
      data.abogado?.apellido_materno,
      'Sin asignar'
    ),
    fechaCreacion: new Date(data.fecha_creacion),
    // ── Campos legales opcionales ───────────────────────────────
    rolCliente: data.rol_cliente ?? undefined,
    tipoProceso: data.tipo_proceso ?? undefined,
    nurej: data.nurej ?? undefined,
    numeroFiscalia: data.numero_fiscalia ?? undefined,
    numeroFelcc: data.numero_felcc ?? undefined,
    juezActual: data.juez_actual ?? undefined,
    secretarioActuario: data.secretario_actuario ?? undefined,
    fiscalActual: data.fiscal_actual ?? undefined,
    investigadorAsignado: data.investigador_asignado ?? undefined,
    etapaProcesal: data.etapa_procesal ?? undefined,
    cuantia: data.cuantia ?? undefined,
    archivado: data.archivado ?? false,
  };
}

export async function actualizarExpediente(
  id: string,
  datosActualizados: {
    numeroCaso?: string;
    titulo?: string;
    juzgado?: string;
    materia?: string;
    parteContraria?: string;
    estado?: string;
    informeDespacho?: string;
    informeCliente?: string;
    abogado_id?: string;
    // ── Campos legales opcionales ─────────────────────────────
    rolCliente?: string;
    tipoProceso?: string;
    nurej?: string;
    numeroFiscalia?: string;
    numeroFelcc?: string;
    juezActual?: string;
    secretarioActuario?: string;
    fiscalActual?: string;
    investigadorAsignado?: string;
    etapaProcesal?: string;
    cuantia?: string;
  }
): Promise<boolean> {
  const supabase = createClient();
  const paqueteActualizacion: any = {};

  if (datosActualizados.numeroCaso !== undefined) paqueteActualizacion.numero_caso = datosActualizados.numeroCaso;
  if (datosActualizados.titulo !== undefined) paqueteActualizacion.titulo = datosActualizados.titulo;
  if (datosActualizados.juzgado !== undefined) paqueteActualizacion.juzgado = datosActualizados.juzgado;
  if (datosActualizados.materia !== undefined) paqueteActualizacion.materia = datosActualizados.materia;
  if (datosActualizados.parteContraria !== undefined) paqueteActualizacion.parte_contraria = datosActualizados.parteContraria;
  if (datosActualizados.estado) paqueteActualizacion.estado = datosActualizados.estado;
  if (datosActualizados.informeDespacho !== undefined) paqueteActualizacion.informe_despacho = datosActualizados.informeDespacho;
  if (datosActualizados.informeCliente !== undefined) paqueteActualizacion.informe_cliente = datosActualizados.informeCliente;
  if (datosActualizados.abogado_id !== undefined) paqueteActualizacion.abogado_asignado_id = datosActualizados.abogado_id;
  if (datosActualizados.rolCliente !== undefined) paqueteActualizacion.rol_cliente = datosActualizados.rolCliente;
  if (datosActualizados.tipoProceso !== undefined) paqueteActualizacion.tipo_proceso = datosActualizados.tipoProceso;
  if (datosActualizados.nurej !== undefined) paqueteActualizacion.nurej = datosActualizados.nurej;
  if (datosActualizados.numeroFiscalia !== undefined) paqueteActualizacion.numero_fiscalia = datosActualizados.numeroFiscalia;
  if (datosActualizados.numeroFelcc !== undefined) paqueteActualizacion.numero_felcc = datosActualizados.numeroFelcc;
  if (datosActualizados.juezActual !== undefined) paqueteActualizacion.juez_actual = datosActualizados.juezActual;
  if (datosActualizados.secretarioActuario !== undefined) paqueteActualizacion.secretario_actuario = datosActualizados.secretarioActuario;
  if (datosActualizados.fiscalActual !== undefined) paqueteActualizacion.fiscal_actual = datosActualizados.fiscalActual;
  if (datosActualizados.investigadorAsignado !== undefined) paqueteActualizacion.investigador_asignado = datosActualizados.investigadorAsignado;
  if (datosActualizados.etapaProcesal !== undefined) paqueteActualizacion.etapa_procesal = datosActualizados.etapaProcesal;
  if (datosActualizados.cuantia !== undefined) paqueteActualizacion.cuantia = datosActualizados.cuantia;

  const { error } = await supabase
    .from('expedientes')
    .update(paqueteActualizacion)
    .eq('id', id);

  if (error) {
    console.error("Error al actualizar:", error.message);
    return false;
  }

  /* ── Audit Log (non-blocking) ──────────────────────────────── */
  try {
    await registrarLog({
      accion: 'EDITAR',
      entidad: 'expedientes',
      entidad_id: id,
      detalles: {
        campos_actualizados: datosActualizados,
        timestamp_operacion: new Date().toISOString(),
      },
    });
  } catch { /* El log no debe bloquear la operación principal */ }

  return true;
}

export async function obtenerTotalExpedientes(): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from('expedientes')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error("Error al obtener el recuento de expedientes:", error.message);
    return 0;
  }

  return count || 0;
}

/* ══════════════════════════════════════════════════════════════
   PAPELERA DE EXPEDIENTES (SOFT DELETE Y HARD DELETE)
   ══════════════════════════════════════════════════════════════ */

export async function obtenerExpedientesArchivados(): Promise<any[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('expedientes')
    .select(`
      *, 
      cliente:perfiles!cliente_id(nombres, apellido_paterno, apellido_materno), 
      abogado:perfiles!abogado_asignado_id(nombres, apellido_paterno, apellido_materno)
    `)
    .eq('archivado', true)
    .order('fecha_actualizacion', { ascending: false });

  if (error || !data) {
    console.error("Error al obtener expedientes archivados:", error?.message);
    return [];
  }

  return data.map(fila => ({
    id: fila.id,
    numeroCaso: fila.numero_caso,
    titulo: fila.titulo,
    materia: fila.materia,
    juzgado: fila.juzgado,
    parteContraria: fila.parte_contraria,
    estado: fila.estado,
    nombreCliente: construirNombre(
      fila.cliente?.nombres,
      fila.cliente?.apellido_paterno,
      fila.cliente?.apellido_materno,
      'Cliente Desconocido'
    ),
    abogado_id: fila.abogado_asignado_id,
    abogado_nombre: construirNombre(
      fila.abogado?.nombres,
      fila.abogado?.apellido_paterno,
      fila.abogado?.apellido_materno,
      'Sin asignar'
    ),
    fechaCreacion: new Date(fila.fecha_creacion),
    fechaActualizacion: new Date(fila.fecha_actualizacion),
    archivado: fila.archivado ?? false,
  }));
}

export async function archivarExpediente(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('expedientes')
    .update({ archivado: true })
    .eq('id', id);

  if (error) {
    console.error("Error al archivar expediente:", error.message);
    return false;
  }

  try {
    await registrarLog({
      accion: 'ARCHIVAR',
      entidad: 'expedientes',
      entidad_id: id,
      detalles: { timestamp_operacion: new Date().toISOString() },
    });
  } catch { /* log fail */ }
  return true;
}

export async function restaurarExpediente(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('expedientes')
    .update({ archivado: false })
    .eq('id', id);

  if (error) {
    console.error("Error al restaurar expediente:", error.message);
    return false;
  }

  try {
    await registrarLog({
      accion: 'RESTAURAR',
      entidad: 'expedientes',
      entidad_id: id,
      detalles: { timestamp_operacion: new Date().toISOString() },
    });
  } catch { /* log fail */ }
  return true;
}

export async function eliminarExpedienteDefinitivo(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  try {
    // 1. Manejo de honorarios y sus cuotas_pago
    const { data: honorarios } = await supabase.from('honorarios').select('id').eq('expediente_id', id);
    if (honorarios && honorarios.length > 0) {
      const honorarioIds = honorarios.map(h => h.id);
      const { error: errCuotas } = await supabase.from('cuotas_pago').delete().in('honorario_id', honorarioIds);
      if (errCuotas) return { success: false, error: `Error al eliminar cuotas de pago: ${errCuotas.message}` };
      
      const { error: errHon } = await supabase.from('honorarios').delete().eq('expediente_id', id);
      if (errHon) return { success: false, error: `Error al eliminar honorarios: ${errHon.message}` };
    }

    // 2. Limpieza de otras tablas dependientes
    const tablasDependientes = [
      'documentos', 
      'agenda_eventos', 
      'bitacora', 
      'gastos_expediente', 
      'informes_avance'
    ];
    
    for (const tabla of tablasDependientes) {
      const { error } = await supabase.from(tabla).delete().eq('expediente_id', id);
      if (error) {
        return { success: false, error: `Error al eliminar registros dependientes en la tabla ${tabla}: ${error.message}` };
      }
    }

    // 3. Eliminación final del expediente
    const { error: errorFinal } = await supabase
      .from('expedientes')
      .delete()
      .eq('id', id);

    if (errorFinal) {
      console.error("Error al eliminar expediente definitivamente:", errorFinal.message);
      return { success: false, error: errorFinal.message };
    }

    // Audit log
    try {
      await registrarLog({
        accion: 'ELIMINAR',
        entidad: 'expedientes',
        entidad_id: id,
        detalles: { motivo: 'Borrado definitivo desde papelera', timestamp_operacion: new Date().toISOString() },
      });
    } catch { /* log fail */ }
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Excepción desconocida al intentar eliminar.' };
  }
}