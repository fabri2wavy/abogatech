// domain/entities/Plantilla.ts

export type TipoPlantilla = 'memorial' | 'contrato' | 'poder' | 'otro';

export interface Plantilla {
  id: string;
  nombre: string;
  descripcion: string | null;
  contenido: string;
  tipo: TipoPlantilla;
  creado_por: string;
  creado_en: string;
}
