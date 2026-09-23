export interface AuditoriaLog {
  id: string;
  usuario_id: string;
  accion: string;
  entidad: string;
  entidad_id: string;
  detalles: Record<string, any>;
  creado_en: string;
}
