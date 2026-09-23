import { redirect } from "next/navigation";

/* ══════════════════════════════════════════════════════════════
   Página Raíz: Redirect automático
   ──────────────────────────────────────────────────────────────
   La página raíz del sitio redirige inmediatamente al dashboard.
   El middleware de autenticación se encargará de redirigir a
   /login si el usuario no está autenticado.
   ══════════════════════════════════════════════════════════════ */

export default function Home() {
  redirect("/dashboard");
}