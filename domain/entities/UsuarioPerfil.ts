/* ══════════════════════════════════════════════════════════════
   Entidad de Dominio: UsuarioPerfil
   ──────────────────────────────────────────────────────────────
   Representación del perfil de un usuario del sistema.
   Extraída de la capa de infraestructura para mantener la
   independencia de la capa de dominio.
   ══════════════════════════════════════════════════════════════ */

/** DTO legado de compatibilidad. En las APIs de sesión `rol` es el role del
 * membership de la firma activa. La identidad SaaS usa CurrentSaaSUser sin rol global.
 * También se conserva para listados de módulos todavía no migrados.
 */
export interface UsuarioPerfil {
  id: string;
  nombre_completo: string;
  rol: string;
}
