/* ══════════════════════════════════════════════════════════════
   Entidades de Dominio: Módulo de Reportes (BI)
   ──────────────────────────────────────────────────────────────
   Shapes de solo lectura para el módulo de analítica de negocio.
   Extraídas de reportesRepository para mantener la independencia
   de la capa de dominio respecto a la infraestructura.
   ══════════════════════════════════════════════════════════════ */

export interface KpisFinancieros {
  totalFacturado: number;
  totalCobrado: number;
  totalEnMora: number;
}

export interface CargaAbogado {
  abogado: string;
  casosActivos: number;
}

export interface DistribucionMateria {
  materia: string;
  cantidad: number;
}
