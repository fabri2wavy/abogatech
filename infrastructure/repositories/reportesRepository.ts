'use server';

import { createClient } from '@/infrastructure/supabase/server';
import type { KpisFinancieros, CargaAbogado, DistribucionMateria } from '@/domain/entities/Reportes';
import type { RepositoryResponse } from '@/domain/types/RepositoryResponse';

/* ══════════════════════════════════════════════════════════════
   Interfaces internas de filas (snake_case desde Supabase)
   ══════════════════════════════════════════════════════════════ */

interface FilaHonorario {
  monto_total: number;
}

interface FilaCuotaPago {
  monto: number;
  estado: string;
}

interface FilaExpedienteConAbogado {
  id: string;
  perfiles: {
    nombres: string;
    apellido_paterno: string;
    apellido_materno: string | null;
  };
}

interface FilaExpedienteMateria {
  materia: string | null;
}

/* ══════════════════════════════════════════════════════════════
   Helper: Verificación RBAC imperativa
   ──────────────────────────────────────────────────────────────
   Centraliza el chequeo de identidad + rol administrador.
   Si falla, retorna un string con el motivo del rechazo.
   Si pasa, retorna null (sin error).
   ══════════════════════════════════════════════════════════════ */

interface FilaPerfil {
  rol: string;
}

async function verificarAccesoAdmin(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<string | null> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return 'No autorizado: Sesión expirada o inválida.';
  }

  const { data: perfil, error: perfilError } = await supabase
    .from('perfiles')
    .select('rol')
    .eq('id', user.id)
    .single();

  if (perfilError || !perfil) {
    return 'No autorizado: No se pudo verificar el perfil del usuario.';
  }

  if ((perfil as FilaPerfil).rol !== 'admin') {
    return 'Acceso Denegado: Se requiere rol de administrador.';
  }

  return null;
}

/* ══════════════════════════════════════════════════════════════
   Helper: Construir nombre completo desde fragmentos
   ══════════════════════════════════════════════════════════════ */

function construirNombreCompleto(
  nombres: string,
  apellidoPaterno: string,
  apellidoMaterno: string | null
): string {
  return [nombres, apellidoPaterno, apellidoMaterno]
    .filter(Boolean)
    .join(' ')
    .trim() || 'Sin nombre';
}

/* ══════════════════════════════════════════════════════════════
   1. obtenerKpisFinancieros()
   ──────────────────────────────────────────────────────────────
   Extrae datasets completos de `honorarios` y `cuotas_pago`,
   luego aplica reducciones en memoria para calcular:
     • Total Facturado  → Σ monto_total (honorarios)
     • Total Cobrado    → Σ monto (cuotas_pago WHERE estado = 'pagado')
     • Total en Mora    → Σ monto (cuotas_pago WHERE estado = 'atrasado')
   ══════════════════════════════════════════════════════════════ */

export async function obtenerKpisFinancieros(): Promise<RepositoryResponse<KpisFinancieros>> {
  const supabase = await createClient();

  try {
    /* ── RBAC: Solo administradores ────────────────────────────── */
    const errorAcceso = await verificarAccesoAdmin(supabase);
    if (errorAcceso) {
      return { data: null, error: errorAcceso };
    }

    /* ── Extracción de datasets ────────────────────────────────── */
    const { data: honorariosRaw, error: honorariosError } = await supabase
      .from('honorarios')
      .select('monto_total');

    if (honorariosError) {
      return { data: null, error: `Error al obtener honorarios: ${honorariosError.message}` };
    }

    const { data: cuotasRaw, error: cuotasError } = await supabase
      .from('cuotas_pago')
      .select('monto, estado');

    if (cuotasError) {
      return { data: null, error: `Error al obtener cuotas de pago: ${cuotasError.message}` };
    }

    /* ── Reducciones en memoria ────────────────────────────────── */
    const honorarios = (honorariosRaw ?? []) as FilaHonorario[];
    const cuotas = (cuotasRaw ?? []) as FilaCuotaPago[];

    const totalFacturado = honorarios.reduce(
      (acumulador, fila) => acumulador + (fila.monto_total ?? 0),
      0
    );

    const totalCobrado = cuotas.reduce(
      (acumulador, fila) =>
        fila.estado === 'pagado' ? acumulador + (fila.monto ?? 0) : acumulador,
      0
    );

    const totalEnMora = cuotas.reduce(
      (acumulador, fila) =>
        fila.estado === 'atrasado' ? acumulador + (fila.monto ?? 0) : acumulador,
      0
    );

    return {
      data: { totalFacturado, totalCobrado, totalEnMora },
      error: null,
    };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al calcular KPIs financieros.';
    return { data: null, error: mensaje };
  }
}

/* ══════════════════════════════════════════════════════════════
   2. obtenerCargaLaboralPorAbogado()
   ──────────────────────────────────────────────────────────────
   Join relacional expedientes → perfiles (via abogado_asignado_id)
   con modificador !inner para descartar abogados sin expedientes.
   Excluye casos cerrados. Agrupa por nombre de abogado y cuenta
   ocurrencias para obtener la carga activa.
   ══════════════════════════════════════════════════════════════ */

export async function obtenerCargaLaboralPorAbogado(): Promise<RepositoryResponse<CargaAbogado[]>> {
  const supabase = await createClient();

  try {
    /* ── RBAC: Solo administradores ────────────────────────────── */
    const errorAcceso = await verificarAccesoAdmin(supabase);
    if (errorAcceso) {
      return { data: null, error: errorAcceso };
    }

    /* ── Join relacional con !inner ────────────────────────────── */
    const { data: expedientesRaw, error: expedientesError } = await supabase
      .from('expedientes')
      .select('id, perfiles!expedientes_abogado_asignado_id_fkey!inner(nombres, apellido_paterno, apellido_materno)')
      .neq('estado', 'cerrado');

    if (expedientesError) {
      return { data: null, error: `Error al obtener carga laboral: ${expedientesError.message}` };
    }

    /* ── Agrupamiento por abogado ─────────────────────────────── */
    const expedientes = (expedientesRaw ?? []) as unknown as FilaExpedienteConAbogado[];

    const mapaCarga = new Map<string, number>();

    for (const expediente of expedientes) {
      const perfil = expediente.perfiles;
      const nombreAbogado = construirNombreCompleto(
        perfil.nombres,
        perfil.apellido_paterno,
        perfil.apellido_materno
      );

      mapaCarga.set(nombreAbogado, (mapaCarga.get(nombreAbogado) ?? 0) + 1);
    }

    /* ── Transformación a array de dominio, ordenado descendente ── */
    const resultado: CargaAbogado[] = Array.from(mapaCarga.entries())
      .map(([abogado, casosActivos]) => ({ abogado, casosActivos }))
      .sort((a, b) => b.casosActivos - a.casosActivos);

    return { data: resultado, error: null };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al calcular carga laboral.';
    return { data: null, error: mensaje };
  }
}

/* ══════════════════════════════════════════════════════════════
   3. obtenerDistribucionCasos()
   ──────────────────────────────────────────────────────────────
   Extrae la columna escalar `materia` de todos los expedientes
   y construye un mapa de frecuencias. Valores nulos se agrupan
   bajo 'No especificada'.
   ══════════════════════════════════════════════════════════════ */

export async function obtenerDistribucionCasos(): Promise<RepositoryResponse<DistribucionMateria[]>> {
  const supabase = await createClient();

  try {
    /* ── RBAC: Solo administradores ────────────────────────────── */
    const errorAcceso = await verificarAccesoAdmin(supabase);
    if (errorAcceso) {
      return { data: null, error: errorAcceso };
    }

    /* ── Extracción de columna escalar ─────────────────────────── */
    const { data: expedientesRaw, error: expedientesError } = await supabase
      .from('expedientes')
      .select('materia');

    if (expedientesError) {
      return { data: null, error: `Error al obtener distribución de casos: ${expedientesError.message}` };
    }

    /* ── Mapa de frecuencias con fallback ─────────────────────── */
    const expedientes = (expedientesRaw ?? []) as FilaExpedienteMateria[];

    const mapaFrecuencias = expedientes.reduce<Record<string, number>>(
      (mapa, fila) => {
        const clave = fila.materia?.trim() || 'No especificada';
        mapa[clave] = (mapa[clave] ?? 0) + 1;
        return mapa;
      },
      {}
    );

    /* ── Transformación a array de dominio, ordenado descendente ── */
    const resultado: DistribucionMateria[] = Object.entries(mapaFrecuencias)
      .map(([materia, cantidad]) => ({ materia, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);

    return { data: resultado, error: null };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al calcular distribución de casos.';
    return { data: null, error: mensaje };
  }
}
