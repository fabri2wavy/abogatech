/* ══════════════════════════════════════════════════════════════
   Entidad de Dominio: UsuarioPerfil
   ──────────────────────────────────────────────────────────────
   Representación del perfil de un usuario del sistema.
   Extraída de la capa de infraestructura para mantener la
   independencia de la capa de dominio.
   ══════════════════════════════════════════════════════════════ */

export interface UsuarioPerfil {
  id: string;
  nombre_completo: string;
  rol: string;
}
