'use server';

import { createClient, } from '../supabase/server';
import {
  Honorario,
  CuotaPago,
  GastoExpediente,
  EstadoCuentaExpediente,
  MonedaHonorario,
  EstadoContrato,
  EstadoCuota,
  CreateHonorarioDTO,
  CreateCuotaDTO,
  CreateGastoDTO,
  FilaReporteFinanciero,
  ReporteFinancieroGlobal,
  EstadoPagoExpediente,
  AlertaCuotaVencida,
} from '../../domain/entities/Finanzas';

/* ══════════════════════════════════════════════════════════════
   Contrato de respuesta monolítico
   ──────────────────────────────────────────────────────────────
   Cada método del repositorio retorna este shape para que la UI
   pueda discriminar éxito/fallo sin try/catch.
   ══════════════════════════════════════════════════════════════ */

interface RepositoryResponse<T> {
  data: T | null;
  error: string | null;
}

/* ══════════════════════════════════════════════════════════════
   Helpers internos de mapeo snake_case → camelCase
   ══════════════════════════════════════════════════════════════ */

interface FilaHonorario {
  id: string;
  expediente_id: string;
  monto_total: number;
  moneda: string;
  estado_contrato: string;
  creado_en: string;
  autorizado_administracion?: boolean;
  porcentaje_fondo?: number;
  distribucion_abogados?: any;
  cuotas_pago?: FilaCuota[];
}

interface FilaCuota {
  id: string;
  honorario_id: string;
  descripcion: string;
  monto: number;
  tipo_vencimiento?: 'fecha' | 'hito';
  hito_vencimiento?: string | null;
  fecha_vencimiento?: string | null;
  estado: string;
  fecha_pago: string | null;
  creado_en: string;
}

interface FilaGasto {
  id: string;
  expediente_id: string;
  concepto: string;
  monto: number;
  fecha: string;
  reembolsado: boolean;
  comprobante_url: string | null;
  creado_en: string;
  observaciones: string | null;
}

function mapearHonorario(fila: FilaHonorario): Honorario {
  return {
    id: fila.id,
    expedienteId: fila.expediente_id,
    montoTotal: fila.monto_total,
    moneda: fila.moneda as MonedaHonorario,
    estadoContrato: fila.estado_contrato as EstadoContrato,
    creadoEn: fila.creado_en,
    autorizadoAdministracion: fila.autorizado_administracion,
    porcentajeFondo: fila.porcentaje_fondo,
    distribucionAbogados: fila.distribucion_abogados,
  };
}

function mapearCuota(fila: FilaCuota): CuotaPago {
  return {
    id: fila.id,
    honorarioId: fila.honorario_id,
    descripcion: fila.descripcion,
    monto: fila.monto,
    tipoVencimiento: fila.tipo_vencimiento ?? 'fecha',
    hitoVencimiento: fila.hito_vencimiento,
    fechaVencimiento: fila.fecha_vencimiento,
    estado: fila.estado as EstadoCuota,
    fechaPago: fila.fecha_pago,
    creadoEn: fila.creado_en,
  };
}

function mapearGasto(fila: FilaGasto): GastoExpediente {
  return {
    id: fila.id,
    expedienteId: fila.expediente_id,
    concepto: fila.concepto,
    monto: fila.monto,
    fecha: fila.fecha,
    reembolsado: fila.reembolsado,
    comprobanteUrl: fila.comprobante_url,
    creadoEn: fila.creado_en,
    observaciones: fila.observaciones ?? null,
  };
}

/* ══════════════════════════════════════════════════════════════
   QUERY: Obtener estado de cuenta completo de un expediente
   ──────────────────────────────────────────────────────────────
   Consulta relacional profunda:
     • honorarios con cuotas_pago(*) anidadas
     • gastos_expediente por expediente_id
   Ordena cuotas y gastos por fecha ascendente.
   ══════════════════════════════════════════════════════════════ */

export async function obtenerEstadoCuenta(
  expedienteId: string
): Promise<RepositoryResponse<EstadoCuentaExpediente>> {
  const supabase = await createClient();

  try {
    /* ── Honorario + cuotas anidadas (relación 1:N) ──────────── */
    const { data: honorarioRaw, error: honorarioError } = await supabase
      .from('honorarios')
      .select('*, cuotas_pago(*)')
      .eq('expediente_id', expedienteId)
      .maybeSingle();

    if (honorarioError) {
      return { data: null, error: `Error al obtener honorario: ${honorarioError.message}` };
    }

    /* ── Gastos operativos del expediente ─────────────────────── */
    const { data: gastosRaw, error: gastosError } = await supabase
      .from('gastos_expediente')
      .select('*')
      .eq('expediente_id', expedienteId)
      .order('fecha', { ascending: true });

    if (gastosError) {
      return { data: null, error: `Error al obtener gastos: ${gastosError.message}` };
    }

    /* ── Mapeo a entidades de dominio ─────────────────────────── */
    const honorarioFila = honorarioRaw as FilaHonorario | null;

    const cuotasOrdenadas = (honorarioFila?.cuotas_pago ?? [])
      .sort((a, b) => (a.fecha_vencimiento || '9999-12-31').localeCompare(b.fecha_vencimiento || '9999-12-31'))
      .map(mapearCuota);

    const estadoCuenta: EstadoCuentaExpediente = {
      honorario: honorarioFila ? mapearHonorario(honorarioFila) : null,
      cuotas: cuotasOrdenadas,
      gastos: ((gastosRaw ?? []) as FilaGasto[]).map(mapearGasto),
    };

    return { data: estadoCuenta, error: null };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al obtener estado de cuenta.';
    return { data: null, error: mensaje };
  }
}

/* ══════════════════════════════════════════════════════════════
   MUTATION: Crear honorario con su bloque de cuotas
   ──────────────────────────────────────────────────────────────
   Flujo controlado en 2 pasos:
     1. Valida identidad del usuario autenticado (SSR cookies).
     2. Inserta el contrato principal → captura `id` retornado.
     3. Inserta las N cuotas vinculadas al honorario_id.
   
   El campo `creado_por` se inyecta forzosamente desde la sesión
   del servidor. Prohibido aceptarlo desde el cliente.
   ══════════════════════════════════════════════════════════════ */

export async function crearHonorarioConCuotas(
  data: CreateHonorarioDTO,
  cuotas: CreateCuotaDTO[]
): Promise<RepositoryResponse<{ honorario: Honorario; cuotas: CuotaPago[] }>> {
  const supabase = await createClient();

  try {
    /* ── Validación asíncrona de identidad (Early Return) ─────── */
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        data: null,
        error: 'No autorizado: Sesión expirada o inválida.',
      };
    }

    const userId = user.id;

    /* ══════════════════════════════════════════════════════════
       VALIDADOR MATEMÁTICO ESTRICTO (Barrera Server-Side)
       ──────────────────────────────────────────────────────────
       Regla de oro financiera: la suma de las cuotas DEBE
       coincidir exactamente con el monto total del contrato.
       Tolerancia de 0.01 para errores de punto flotante.
       ══════════════════════════════════════════════════════════ */
    const sumaCuotas = cuotas.reduce((sum, c) => sum + c.monto, 0);
    const diferencia = Math.abs(sumaCuotas - data.montoTotal);

    if (diferencia >= 0.01) {
      const simbolo = data.moneda === 'USD' ? '$' : 'Bs.';
      const fmtTotal = data.montoTotal.toLocaleString('es-BO', { minimumFractionDigits: 2 });
      const fmtSuma = sumaCuotas.toLocaleString('es-BO', { minimumFractionDigits: 2 });
      const fmtDiff = Math.abs(sumaCuotas - data.montoTotal).toLocaleString('es-BO', { minimumFractionDigits: 2 });

      const direccion = sumaCuotas < data.montoTotal
        ? `Faltan ${simbolo} ${fmtDiff} por distribuir.`
        : `Exceso de ${simbolo} ${fmtDiff}.`;

      return {
        data: null,
        error: `Error de integridad financiera: las cuotas suman ${simbolo} ${fmtSuma} pero el contrato es por ${simbolo} ${fmtTotal}. ${direccion}`,
      };
    }

    /* ── Paso 1: Insertar honorario con creado_por inyectado ─── */
    const { data: honorarioInsertado, error: honorarioError } = await supabase
      .from('honorarios')
      .insert({
        expediente_id: data.expedienteId,
        monto_total: data.montoTotal,
        moneda: data.moneda,
        estado_contrato: data.estadoContrato,
        creado_por: userId,
        autorizado_administracion: data.autorizadoAdministracion,
        porcentaje_fondo: data.porcentajeFondo,
        distribucion_abogados: data.distribucionAbogados,
      })
      .select()
      .single();

    if (honorarioError || !honorarioInsertado) {
      return {
        data: null,
        error: `Error al crear honorario: ${honorarioError?.message ?? 'No se recibieron datos de la inserción.'}`,
      };
    }

    const honorarioId: string = honorarioInsertado.id;

    /* ── Paso 2: Insertar cuotas vinculadas ──────────────────── */
    const cuotasParaInsertar = cuotas.map((cuota) => ({
      honorario_id: honorarioId,
      descripcion: cuota.descripcion,
      monto: cuota.monto,
      tipo_vencimiento: cuota.tipoVencimiento ?? 'fecha',
      hito_vencimiento: cuota.hitoVencimiento ?? null,
      fecha_vencimiento: cuota.fechaVencimiento ?? null,
      estado: cuota.estado,
      fecha_pago: cuota.fechaPago ?? null,
    }));

    const { data: cuotasInsertadas, error: cuotasError } = await supabase
      .from('cuotas_pago')
      .insert(cuotasParaInsertar)
      .select();

    if (cuotasError) {
      return {
        data: null,
        error: `Honorario creado pero falló la inserción de cuotas: ${cuotasError.message}`,
      };
    }

    /* ── Mapeo a dominio ─────────────────────────────────────── */
    return {
      data: {
        honorario: mapearHonorario(honorarioInsertado as FilaHonorario),
        cuotas: ((cuotasInsertadas ?? []) as FilaCuota[]).map(mapearCuota),
      },
      error: null,
    };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al crear honorario.';
    return { data: null, error: mensaje };
  }
}

/* ══════════════════════════════════════════════════════════════
   MUTATION: Registrar gasto operativo de un expediente
   ──────────────────────────────────────────────────────────────
   El campo `creado_por` se inyecta forzosamente desde la sesión
   del servidor. Prohibido aceptarlo desde el cliente.
   ══════════════════════════════════════════════════════════════ */

export async function registrarGasto(
  gasto: CreateGastoDTO
): Promise<RepositoryResponse<GastoExpediente>> {
  const supabase = await createClient();

  try {
    /* ── Validación asíncrona de identidad (Early Return) ─────── */
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        data: null,
        error: 'No autorizado: Sesión expirada o inválida.',
      };
    }

    const userId = user.id;

    /* ── Inserción DML con creado_por inyectado ───────────────────── */
    const { data: gastoInsertado, error: gastoError } = await supabase
      .from('gastos_expediente')
      .insert({
        expediente_id: gasto.expedienteId,
        concepto: gasto.concepto,
        monto: gasto.monto,
        fecha: gasto.fecha,
        reembolsado: gasto.reembolsado,
        comprobante_url: gasto.comprobanteUrl,
        observaciones: gasto.observaciones ?? null,
        creado_por: userId,
      })
      .select()
      .single();

    if (gastoError || !gastoInsertado) {
      return {
        data: null,
        error: `Error al registrar gasto: ${gastoError?.message ?? 'No se recibieron datos de la inserción.'}`,
      };
    }

    return {
      data: mapearGasto(gastoInsertado as FilaGasto),
      error: null,
    };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al registrar gasto.';
    return { data: null, error: mensaje };
  }
}

/* ══════════════════════════════════════════════════════════════
   QUERY: Reporte financiero global para dashboard de dirección
   ──────────────────────────────────────────────────────────────
   Consolida todos los honorarios activos con sus cuotas,
   expedientes y perfiles (cliente + abogado) para generar
   métricas agregadas de la firma.
   ══════════════════════════════════════════════════════════════ */

interface FilaHonorarioGlobal {
  id: string;
  expediente_id: string;
  monto_total: number;
  moneda: string;
  estado_contrato: string;
  creado_en: string;
  cuotas_pago: FilaCuota[];
  expedientes: {
    id: string;
    numero_caso: string;
    titulo: string;
    cliente: { nombres: string; apellido_paterno: string; apellido_materno: string } | null;
    abogado: { nombres: string; apellido_paterno: string; apellido_materno: string } | null;
  } | null;
}

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

function clasificarEstadoPago(cuotas: FilaCuota[]): EstadoPagoExpediente {
  if (cuotas.length === 0) return 'al_dia';

  const tieneAtrasadas = cuotas.some((c) => c.estado === 'atrasado');
  if (tieneAtrasadas) return 'moroso';

  const tienePendientes = cuotas.some((c) => c.estado === 'pendiente');
  if (tienePendientes) return 'en_proceso';

  return 'al_dia';
}

export async function obtenerReporteFinancieroGlobal(): Promise<RepositoryResponse<ReporteFinancieroGlobal>> {
  const supabase = await createClient();

  try {
    const { data: honorariosRaw, error: queryError } = await supabase
      .from('honorarios')
      .select(`
        *,
        cuotas_pago(*),
        expedientes!expediente_id(
          id, numero_caso, titulo,
          cliente:perfiles!cliente_id(nombres, apellido_paterno, apellido_materno),
          abogado:perfiles!abogado_asignado_id(nombres, apellido_paterno, apellido_materno)
        )
      `)
      .eq('estado_contrato', 'vigente')
      .order('creado_en', { ascending: false });

    if (queryError) {
      return { data: null, error: `Error al obtener reporte financiero: ${queryError.message}` };
    }

    const filas: FilaReporteFinanciero[] = ((honorariosRaw ?? []) as unknown as FilaHonorarioGlobal[]).map((fila) => {
      const cuotas = fila.cuotas_pago ?? [];
      const expediente = fila.expedientes;

      const totalPagado = cuotas
        .filter((c) => c.estado === 'pagado')
        .reduce((s, c) => s + c.monto, 0);

      const cuotasAtrasadas = cuotas.filter((c) => c.estado === 'atrasado').length;

      return {
        expedienteId: fila.expediente_id,
        numeroCaso: expediente?.numero_caso ?? '—',
        tituloExpediente: expediente?.titulo ?? '—',
        nombreCliente: construirNombre(
          expediente?.cliente?.nombres,
          expediente?.cliente?.apellido_paterno,
          expediente?.cliente?.apellido_materno,
          'Cliente desconocido'
        ),
        abogadoNombre: construirNombre(
          expediente?.abogado?.nombres,
          expediente?.abogado?.apellido_paterno,
          expediente?.abogado?.apellido_materno,
          'Sin asignar'
        ),
        montoTotal: fila.monto_total,
        moneda: fila.moneda as MonedaHonorario,
        totalPagado,
        totalPendiente: fila.monto_total - totalPagado,
        cuotasAtrasadas,
        estadoPago: clasificarEstadoPago(cuotas),
      };
    });

    const totalFacturado = filas.reduce((s, f) => s + f.montoTotal, 0);
    const totalPendiente = filas.reduce((s, f) => s + f.totalPendiente, 0);
    const totalMora = filas
      .filter((f) => f.estadoPago === 'moroso')
      .reduce((s, f) => s + f.totalPendiente, 0);

    return {
      data: { filas, totalFacturado, totalPendiente, totalMora },
      error: null,
    };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al obtener reporte financiero.';
    return { data: null, error: mensaje };
  }
}

/* ══════════════════════════════════════════════════════════════
   QUERY: Alertas de cuotas próximas a vencer o vencidas
   ──────────────────────────────────────────────────────────────
   Consulta todas las cuotas con estado 'pendiente' o 'atrasado'
   cuya fecha_vencimiento sea ≤ 7 días en el futuro o ya pasada.
   Incluye contexto completo: expediente, cliente y abogado.
   ══════════════════════════════════════════════════════════════ */

interface FilaCuotaAlerta {
  id: string;
  honorario_id: string;
  descripcion: string;
  monto: number;
  fecha_vencimiento: string;
  estado: string;
  fecha_pago: string | null;
  creado_en: string;
  honorarios: {
    id: string;
    monto_total: number;
    moneda: string;
    expediente_id: string;
    expedientes: {
      id: string;
      numero_caso: string;
      titulo: string;
      cliente: { nombres: string; apellido_paterno: string; apellido_materno: string } | null;
      abogado: { nombres: string; apellido_paterno: string; apellido_materno: string } | null;
    } | null;
  } | null;
}

export async function obtenerAlertasCuotasVencidas(): Promise<RepositoryResponse<AlertaCuotaVencida[]>> {
  const supabase = await createClient();

  try {
    // Fecha límite: 7 días a partir de hoy
    const hoy = new Date();
    const limite = new Date(hoy);
    limite.setDate(limite.getDate() + 7);
    const limiteISO = limite.toISOString().split('T')[0];

    const { data: cuotasRaw, error: queryError } = await supabase
      .from('cuotas_pago')
      .select(`
        *,
        honorarios!honorario_id(
          id, monto_total, moneda, expediente_id,
          expedientes!expediente_id(
            id, numero_caso, titulo,
            cliente:perfiles!cliente_id(nombres, apellido_paterno, apellido_materno),
            abogado:perfiles!abogado_asignado_id(nombres, apellido_paterno, apellido_materno)
          )
        )
      `)
      .in('estado', ['pendiente', 'atrasado'])
      .lte('fecha_vencimiento', limiteISO)
      .order('fecha_vencimiento', { ascending: true });

    if (queryError) {
      return { data: null, error: `Error al obtener alertas de cuotas: ${queryError.message}` };
    }

    const alertas: AlertaCuotaVencida[] = ((cuotasRaw ?? []) as unknown as FilaCuotaAlerta[]).map((fila) => {
      const honorario = fila.honorarios;
      const expediente = honorario?.expedientes;

      const hoyDate = new Date();
      hoyDate.setHours(0, 0, 0, 0);
      const vencimiento = new Date(fila.fecha_vencimiento);
      vencimiento.setHours(0, 0, 0, 0);
      const diffMs = vencimiento.getTime() - hoyDate.getTime();
      const diasRestantes = Math.round(diffMs / (1000 * 60 * 60 * 24));

      let urgencia: AlertaCuotaVencida['urgencia'];
      if (diasRestantes < 0) urgencia = 'vencida';
      else if (diasRestantes === 0) urgencia = 'vence_hoy';
      else urgencia = 'proxima';

      return {
        cuotaId: fila.id,
        descripcion: fila.descripcion,
        monto: fila.monto,
        moneda: (honorario?.moneda ?? 'BS') as MonedaHonorario,
        fechaVencimiento: fila.fecha_vencimiento,
        estado: fila.estado as EstadoCuota,
        diasRestantes,
        urgencia,
        expedienteId: honorario?.expediente_id ?? '',
        numeroCaso: expediente?.numero_caso ?? '—',
        tituloExpediente: expediente?.titulo ?? '—',
        nombreCliente: construirNombre(
          expediente?.cliente?.nombres,
          expediente?.cliente?.apellido_paterno,
          expediente?.cliente?.apellido_materno,
          'Cliente desconocido'
        ),
        abogadoNombre: construirNombre(
          expediente?.abogado?.nombres,
          expediente?.abogado?.apellido_paterno,
          expediente?.abogado?.apellido_materno,
          'Sin asignar'
        ),
      };
    });

    return { data: alertas, error: null };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al obtener alertas.';
    return { data: null, error: mensaje };
  }
}
