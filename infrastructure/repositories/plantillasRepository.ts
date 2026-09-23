'use server';

import { createClient } from '../supabase/server';
import type { Plantilla, TipoPlantilla } from '@/domain/entities/Plantilla';
import { procesarPlantilla } from '@/domain/services/documentGenerator';
import type { DatosExpediente } from '@/domain/services/documentGenerator';
import { registrarLog } from '@/infrastructure/repositories/auditoriaRepository';

/* ══════════════════════════════════════════════════════════════
   Contrato de respuesta canónico
   ──────────────────────────────────────────────────────────────
   Cada función pública retorna este shape para que la UI
   pueda discriminar éxito/fallo sin try/catch.
   ══════════════════════════════════════════════════════════════ */

import type { RepositoryResponse } from '@/domain/types/RepositoryResponse';

/* ══════════════════════════════════════════════════════════════
   DTO de creación
   ══════════════════════════════════════════════════════════════ */

export interface CreatePlantillaDTO {
  nombre: string;
  tipo: TipoPlantilla;
  descripcion?: string;
  contenido: string;
}

export interface UpdatePlantillaDTO {
  nombre?: string;
  tipo?: TipoPlantilla;
  descripcion?: string;
  contenido?: string;
}

/* ══════════════════════════════════════════════════════════════
   QUERY: Obtener todas las plantillas
   ══════════════════════════════════════════════════════════════ */

export async function obtenerPlantillas(): Promise<RepositoryResponse<Plantilla[]>> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('plantillas_documentos')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) {
      return { data: null, error: `Error al obtener plantillas: ${error.message}` };
    }

    return { data: (data ?? []) as Plantilla[], error: null };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al obtener plantillas.';
    return { data: null, error: mensaje };
  }
}

/* ══════════════════════════════════════════════════════════════
   MUTATION: Crear una nueva plantilla
   ──────────────────────────────────────────────────────────────
   El campo `creado_por` se inyecta forzosamente desde la sesión
   del servidor. Prohibido aceptarlo desde el cliente.
   ══════════════════════════════════════════════════════════════ */

export async function crearPlantilla(
  payload: CreatePlantillaDTO
): Promise<RepositoryResponse<Plantilla>> {
  const supabase = await createClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: 'No autorizado: Sesión expirada o inválida.' };
    }

    const { data: plantillaInsertada, error: insertError } = await supabase
      .from('plantillas_documentos')
      .insert({
        nombre: payload.nombre,
        tipo: payload.tipo,
        descripcion: payload.descripcion ?? null,
        contenido: payload.contenido,
        creado_por: user.id,
      })
      .select()
      .single();

    if (insertError || !plantillaInsertada) {
      return {
        data: null,
        error: `Error al crear plantilla: ${insertError?.message ?? 'No se recibieron datos.'}`,
      };
    }

    /* ── Audit Log (non-blocking) ──────────────────────────────── */
    try {
      await registrarLog({
        accion: 'CREAR',
        entidad: 'plantillas',
        entidad_id: plantillaInsertada.id,
        detalles: {
          nombre: payload.nombre,
          tipo: payload.tipo,
          timestamp_operacion: new Date().toISOString(),
        },
      });
    } catch { /* El log no debe bloquear la operación principal */ }

    return { data: plantillaInsertada as Plantilla, error: null };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al crear plantilla.';
    return { data: null, error: mensaje };
  }
}

/* ══════════════════════════════════════════════════════════════
   MUTATION: Actualizar una plantilla existente por ID
   ══════════════════════════════════════════════════════════════ */

export async function actualizarPlantilla(
  id: string,
  payload: UpdatePlantillaDTO
): Promise<RepositoryResponse<Plantilla>> {
  const supabase = await createClient();

  try {
    const camposActualizar: Record<string, string> = {};

    if (payload.nombre !== undefined) camposActualizar.nombre = payload.nombre;
    if (payload.tipo !== undefined) camposActualizar.tipo = payload.tipo;
    if (payload.descripcion !== undefined) camposActualizar.descripcion = payload.descripcion;
    if (payload.contenido !== undefined) camposActualizar.contenido = payload.contenido;

    if (Object.keys(camposActualizar).length === 0) {
      return { data: null, error: 'No se proporcionaron campos para actualizar.' };
    }

    const { data: plantillaActualizada, error: updateError } = await supabase
      .from('plantillas_documentos')
      .update(camposActualizar)
      .eq('id', id)
      .select()
      .single();

    if (updateError || !plantillaActualizada) {
      return {
        data: null,
        error: `Error al actualizar plantilla: ${updateError?.message ?? 'Plantilla no encontrada.'}`,
      };
    }

    return { data: plantillaActualizada as Plantilla, error: null };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al actualizar plantilla.';
    return { data: null, error: mensaje };
  }
}

/* ══════════════════════════════════════════════════════════════
   MUTATION: Eliminar una plantilla por ID
   ══════════════════════════════════════════════════════════════ */

export async function eliminarPlantilla(
  id: string
): Promise<RepositoryResponse<boolean>> {
  const supabase = await createClient();

  try {
    /* ── Audit Log ANTES de la purga ──────────────────────────── */
    try {
      await registrarLog({
        accion: 'ELIMINAR',
        entidad: 'plantillas',
        entidad_id: id,
        detalles: {
          timestamp_operacion: new Date().toISOString(),
        },
      });
    } catch { /* El log no debe bloquear la operación principal */ }

    const { error } = await supabase
      .from('plantillas_documentos')
      .delete()
      .eq('id', id);

    if (error) {
      return { data: null, error: `Error al eliminar plantilla: ${error.message}` };
    }

    return { data: true, error: null };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al eliminar plantilla.';
    return { data: null, error: mensaje };
  }
}

/* ══════════════════════════════════════════════════════════════
   CORE: Motor de generación de documentos
   ──────────────────────────────────────────────────────────────
   Flujo secuencial:
     1. Recupera el contenido de la plantilla por ID.
     2. Resuelve el grafo completo de relaciones del expediente.
     3. Delega la inyección de variables a procesarPlantilla().
   ══════════════════════════════════════════════════════════════ */

interface ExpedienteConRelaciones {
  numero_caso: string | null;
  materia: string | null;
  juzgado: string | null;
  cliente: {
    nombres: string | null;
    apellido_paterno: string | null;
    apellido_materno: string | null;
    detalles: {
      ci: string | null;
      expedido: string | null;
      direccion: string | null;
    };
  };
}

export async function generarDocumento(
  plantillaId: string,
  expedienteId: string
): Promise<RepositoryResponse<string>> {
  const supabase = await createClient();

  try {
    /* ── Paso 1: Obtención de la plantilla ─────────────────────── */
    const { data: plantilla, error: plantillaError } = await supabase
      .from('plantillas_documentos')
      .select('contenido')
      .eq('id', plantillaId)
      .single();

    if (plantillaError || !plantilla) {
      return {
        data: null,
        error: `Error al obtener plantilla: ${plantillaError?.message ?? 'Plantilla no encontrada.'}`,
      };
    }

    /* ── Paso 2: Resolución del grafo de relaciones (JOIN) ────── */
    const { data: exp, error: expError } = await supabase
      .from('expedientes')
      .select(`
        numero_caso,
        materia,
        juzgado,
        cliente:perfiles!cliente_id!inner (
          nombres,
          apellido_paterno,
          apellido_materno,
          detalles:detalles_cliente!inner (
            ci,
            expedido,
            direccion
          )
        )
      `)
      .eq('id', expedienteId)
      .single();

    if (expError || !exp) {
      return {
        data: null,
        error: `Error al obtener expediente: ${expError?.message ?? 'Expediente no encontrado.'}`,
      };
    }

    const expediente = exp as unknown as ExpedienteConRelaciones;

    /* ── Paso 3: Delegar procesamiento al motor de plantillas ── */
    const datosExpediente: DatosExpediente = {
      nombreCliente: [
        expediente.cliente?.nombres,
        expediente.cliente?.apellido_paterno,
        expediente.cliente?.apellido_materno,
      ]
        .filter(Boolean)
        .join(' ')
        .trim(),
      ciCliente: [
        expediente.cliente?.detalles?.ci,
        expediente.cliente?.detalles?.expedido,
      ]
        .filter(Boolean)
        .join(' ')
        .trim(),
      numeroCaso: expediente.numero_caso ?? '',
      materia: expediente.materia ?? '',
      juzgado: expediente.juzgado ?? '',
      domicilioCliente: expediente.cliente?.detalles?.direccion ?? '',
    };

    const documentoGenerado = procesarPlantilla(plantilla.contenido, datosExpediente);

    return { data: documentoGenerado, error: null };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al generar documento.';
    return { data: null, error: mensaje };
  }
}
