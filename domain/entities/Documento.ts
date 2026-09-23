export interface Documento {
  id: string;
  nombre: string;
  ruta: string;
  tamaño: number;
  visibleCliente: boolean;
  subidoPor: string;
  fechaSubida: Date;
}
