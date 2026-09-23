// domain/entities/Expediente.ts

export type EstadoExpediente = 'en_espera' | 'mediacion' | 'juicio' | 'cerrado';

export interface Expediente {
  id: string;
  numeroCaso: string;
  titulo: string;
  materia: string;
  juzgado: string;
  parteContraria: string;
  informeDespacho: string;
  informeCliente: string;
  estado: EstadoExpediente;
  clienteId: string;
  abogado_id?: string;
  abogado_nombre?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  archivado?: boolean;

  // ── Campos de nomenclatura legal (Flujo Civil / Penal) ──────────
  /** Rol del cliente en el proceso: Demandante, Demandado, Imputado, Víctima, etc. */
  rolCliente?: string;
  /** Tipo de proceso: Civil, Penal, Familiar, Laboral, etc. */
  tipoProceso?: string;
  /** Número Único de Registro Judicial (NUREJ) del poder judicial boliviano. */
  nurej?: string;
  /** Número de caso asignado por la Fiscalía (proceso penal). */
  numeroFiscalia?: string;
  /** Número de caso registrado en la FELCC (proceso penal). */
  numeroFelcc?: string;
  /** Nombre del Juez o Tribunal asignado actualmente. */
  juezActual?: string;
  /** Nombre del Secretario Actuario del juzgado. */
  secretarioActuario?: string;
  /** Nombre del Fiscal de Materia asignado (proceso penal). */
  fiscalActual?: string;
  /** Nombre del investigador FELCC asignado (proceso penal). */
  investigadorAsignado?: string;
  /** Etapa procesal actual: Investigación Preliminar, Acusación, Juicio Oral, etc. */
  etapaProcesal?: string;
  /** Cuantía o valor económico del proceso. */
  cuantia?: string;

  // ── Campos Adicionales (v1.1) ──────────
  historialJuzgados?: any[] | any;
  oficiosSolicitados?: string;
  medidasPreviasRemate?: string;
}