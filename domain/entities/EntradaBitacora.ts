export interface EntradaBitacora {
  id: string;
  expedienteId: string;
  contenido: string;
  visibleCliente: boolean;
  creadoPor: string;
  autorNombre: string;
  creadoEn: Date;
}
