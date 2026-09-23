// domain/entities/Finanzas.ts

/* ══════════════════════════════════════════════════════════════
   Tipos de dominio estricto (reflejan ENUMs de PostgreSQL)
   ══════════════════════════════════════════════════════════════ */

export type EstadoContrato = 'vigente' | 'finalizado';

export type MonedaHonorario = 'BS' | 'USD';

export type EstadoCuota = 'pendiente' | 'pagado' | 'atrasado';

/* ══════════════════════════════════════════════════════════════
   Entidad: Honorario — mapeo 1:1 con `public.honorarios`
   ══════════════════════════════════════════════════════════════ */

export interface Honorario {
   id: string;
   expedienteId: string;
   montoTotal: number;
   moneda: MonedaHonorario;
   estadoContrato: EstadoContrato;
   creadoEn: string; // ISO 8601
   autorizadoAdministracion?: boolean;
   porcentajeFondo?: number;
   distribucionAbogados?: any; // JSON object representing lawyer ID to percentage mapping
}

/* ══════════════════════════════════════════════════════════════
   Entidad: CuotaPago — mapeo 1:1 con `public.cuotas_pago`
   ══════════════════════════════════════════════════════════════ */

export interface CuotaPago {
   id: string;
   honorarioId: string;
   descripcion: string;
   monto: number;
   tipoVencimiento?: 'fecha' | 'hito';
   hitoVencimiento?: string | null;
   fechaVencimiento?: string | null; // ISO 8601
   estado: EstadoCuota;
   fechaPago: string | null;  // ISO 8601
   creadoEn: string;         // ISO 8601
}

/* ══════════════════════════════════════════════════════════════
   Entidad: GastoExpediente — mapeo 1:1 con `public.gastos_expediente`
   ══════════════════════════════════════════════════════════════ */

export interface GastoExpediente {
   id: string;
   expedienteId: string;
   concepto: string;
   monto: number;
   fecha: string;              // ISO 8601
   reembolsado: boolean;
   comprobanteUrl: string | null;
   creadoEn: string;           // ISO 8601
   /** Notas adicionales: justificación, proveedor, estado de reembolso, etc. */
   observaciones: string | null;
}

/* ══════════════════════════════════════════════════════════════
   Composición estructural: Hidratación de estado de cuenta
   para la vista del expediente (agrupa las 3 entidades).
   ══════════════════════════════════════════════════════════════ */

export interface EstadoCuentaExpediente {
   honorario: Honorario | null;
   cuotas: CuotaPago[];
   gastos: GastoExpediente[];
}

/* ══════════════════════════════════════════════════════════════
   DTOs de escritura — excluyen campos autogenerados por la DB.
   Usados exclusivamente por las funciones del repositorio.
   ══════════════════════════════════════════════════════════════ */

export type CreateHonorarioDTO = Omit<Honorario, 'id' | 'creadoEn'>;

export type CreateCuotaDTO = Omit<CuotaPago, 'id' | 'honorarioId' | 'creadoEn'>;

export type CreateGastoDTO = Omit<GastoExpediente, 'id' | 'creadoEn'>;

/* ══════════════════════════════════════════════════════════════
   Reporte Financiero Global — Dashboard de dirección
   ══════════════════════════════════════════════════════════════ */

export type EstadoPagoExpediente = 'al_dia' | 'en_proceso' | 'moroso';

export interface FilaReporteFinanciero {
  expedienteId: string;
  numeroCaso: string;
  tituloExpediente: string;
  nombreCliente: string;
  abogadoNombre: string;
  montoTotal: number;
  moneda: MonedaHonorario;
  totalPagado: number;
  totalPendiente: number;
  cuotasAtrasadas: number;
  estadoPago: EstadoPagoExpediente;
}

export interface ReporteFinancieroGlobal {
  filas: FilaReporteFinanciero[];
  totalFacturado: number;
  totalPendiente: number;
  totalMora: number;
}

/* ══════════════════════════════════════════════════════════════
   Entidad: AlertaCuotaVencida — Cuota próxima a vencer o vencida
   ══════════════════════════════════════════════════════════════ */

export type UrgenciaCuota = 'vencida' | 'vence_hoy' | 'proxima' | 'hito_pendiente';

export interface AlertaCuotaVencida {
  cuotaId: string;
  descripcion: string;
  monto: number;
  moneda: MonedaHonorario;
  fechaVencimiento: string;      // ISO 8601
  estado: EstadoCuota;
  diasRestantes: number;          // Negativo si ya venció
  urgencia: UrgenciaCuota;
  expedienteId: string;
  numeroCaso: string;
  tituloExpediente: string;
  nombreCliente: string;
  abogadoNombre: string;
}
