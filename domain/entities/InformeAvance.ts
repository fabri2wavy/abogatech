export interface InformeAvance {
  id: string;
  expedienteId: string;
  mesAnio: string;
  resumenProceso?: string;
  estadoActual?: string;
  medidasPrecautorias?: string;
  comentario?: string;
  creadoPor: string;
  createdAt?: string;
}
