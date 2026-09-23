/* ══════════════════════════════════════════════════════════════
   Tipo Genérico de Dominio: RepositoryResponse<T>
   ──────────────────────────────────────────────────────────────
   Contrato de respuesta estándar para todas las operaciones
   de repositorio. Unifica el shape de retorno eliminando la
   duplicación entre auditoriaRepository y configuracionRepository.
   ══════════════════════════════════════════════════════════════ */

export interface RepositoryResponse<T> {
  data: T | null;
  error: string | null;
}
