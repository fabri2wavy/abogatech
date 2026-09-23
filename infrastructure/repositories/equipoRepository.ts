import { createClient } from '../supabase/client';
import { MiembroEquipo } from '../../domain/entities/MiembroEquipo';

function mapearMiembro(fila: any): MiembroEquipo {
  const detalle = fila.detalles_equipo ?? {};

  return {
    id: fila.id,
    nombres: fila.nombres ?? '',
    apellidoPaterno: fila.apellido_paterno ?? '',
    apellidoMaterno: fila.apellido_materno ?? '',
    email: fila.email ?? null,
    telefono: fila.telefono ?? null,
    rol: fila.rol ?? 'abogado',
    cargo: detalle.cargo ?? '',
    especialidad: detalle.especialidad ?? null,
    estadoLaboral: detalle.estado_laboral ?? 'activo',
  };
}

export async function obtenerEquipo(): Promise<MiembroEquipo[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('perfiles')
    .select('*, detalles_equipo!inner(*)')
    .neq('rol', 'cliente')
    .order('nombres', { ascending: true });

  if (error) {
    throw new Error(`Error al obtener equipo legal: ${error.message}`);
  }

  if (!data) {
    return [];
  }

  return data.map(mapearMiembro);
}

/* ══════════════════════════════════════════════════════════════
   MUTACIÓN: Crear un nuevo miembro del equipo legal
   ──────────────────────────────────────────────────────────────
   Transacción de 2 pasos:
     1. Insert en `perfiles` → captura el UUID generado.
     2. Insert en `detalles_equipo` con ese UUID + campos profesionales.
   ══════════════════════════════════════════════════════════════ */

type DatosNuevoMiembro = Omit<MiembroEquipo, 'id' | 'estadoLaboral'>;

export async function crearMiembroEquipo(
  datos: DatosNuevoMiembro
): Promise<MiembroEquipo> {
  const supabase = createClient();

  try {
    /* ── Paso 1: Insertar en `perfiles` ──────────────────────── */
    const { data: perfil, error: errorPerfil } = await supabase
      .from('perfiles')
      .insert({
        nombres: datos.nombres,
        apellido_paterno: datos.apellidoPaterno,
        apellido_materno: datos.apellidoMaterno,
        email: datos.email || null,
        telefono: datos.telefono || null,
        rol: datos.rol,
      })
      .select('id')
      .single();

    if (errorPerfil || !perfil) {
      throw new Error(
        `Error al crear el perfil del miembro: ${errorPerfil?.message ?? 'No se obtuvo el ID del perfil.'}`
      );
    }

    /* ── Paso 2: Insertar en `detalles_equipo` ───────────────── */
    const { error: errorDetalle } = await supabase
      .from('detalles_equipo')
      .insert({
        id: perfil.id,
        cargo: datos.cargo,
        especialidad: datos.especialidad || null,
        estado_laboral: 'activo',
      });

    if (errorDetalle) {
      throw new Error(
        `Error al crear los detalles del miembro: ${errorDetalle.message}`
      );
    }

    /* ── Retornar la entidad de dominio completa ─────────────── */
    return {
      id: perfil.id,
      nombres: datos.nombres,
      apellidoPaterno: datos.apellidoPaterno,
      apellidoMaterno: datos.apellidoMaterno,
      email: datos.email || null,
      telefono: datos.telefono || null,
      rol: datos.rol,
      cargo: datos.cargo,
      especialidad: datos.especialidad || null,
      estadoLaboral: 'activo',
    };
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error('Error inesperado al crear el miembro del equipo.');
  }
}

export async function obtenerMiembroPorId(id: string): Promise<MiembroEquipo | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('perfiles')
    .select('*, detalles_equipo!inner(*)')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error(`Error al obtener miembro por ID (${id}):`, error?.message);
    return null;
  }
  return mapearMiembro(data);
}

export async function actualizarMiembro(
  id: string,
  datos: Partial<MiembroEquipo>
): Promise<boolean> {
  const supabase = createClient();

  const datosPerfil: any = {};
  if (datos.nombres !== undefined) datosPerfil.nombres = datos.nombres;
  if (datos.apellidoPaterno !== undefined) datosPerfil.apellido_paterno = datos.apellidoPaterno;
  if (datos.apellidoMaterno !== undefined) datosPerfil.apellido_materno = datos.apellidoMaterno;
  if (datos.telefono !== undefined) datosPerfil.telefono = datos.telefono;
  if (datos.rol !== undefined) datosPerfil.rol = datos.rol;

  if (Object.keys(datosPerfil).length > 0) {
    const { error } = await supabase.from('perfiles').update(datosPerfil).eq('id', id);
    if (error) {
      console.error("Error al actualizar perfil:", error.message);
      return false;
    }
  }

  const datosDetalle: any = {};
  if (datos.cargo !== undefined) datosDetalle.cargo = datos.cargo;
  if (datos.especialidad !== undefined) datosDetalle.especialidad = datos.especialidad;
  if (datos.estadoLaboral !== undefined) datosDetalle.estado_laboral = datos.estadoLaboral;

  if (Object.keys(datosDetalle).length > 0) {
    const { error } = await supabase.from('detalles_equipo').update(datosDetalle).eq('id', id);
    if (error) {
      console.error("Error al actualizar detalles_equipo:", error.message);
      return false;
    }
  }

  return true;
}

