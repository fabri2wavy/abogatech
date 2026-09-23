// domain/entities/EventoAgenda.ts
export type TipoEventoAgenda =
  | 'audiencia'
  | 'reunion'
  | 'vencimiento'
  | 'tarea';

export type EstadoEventoAgenda =
  | 'pendiente'
  | 'completado'
  | 'cancelado';

export interface EventoAgenda {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipoEvento: TipoEventoAgenda;
  estado: EstadoEventoAgenda;
  fechaInicio: string;   // ISO 8601
  fechaFin: string;      // ISO 8601
  expedienteId: string | null;
  asignadoA: string;     // UUID → perfiles(id)
  creadoPor: string;     // UUID → perfiles(id)
  creadoEn: string;      // ISO 8601
}

export interface EventoAgendaDetallado extends EventoAgenda {
  expediente: {
    numeroCaso: string;
    titulo: string;
  } | null;
  asignado: {
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
}
