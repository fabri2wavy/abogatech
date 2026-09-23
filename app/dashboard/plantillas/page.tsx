import { redirect } from "next/navigation";
import type { Plantilla } from "@/domain/entities/Plantilla";
import { verificarAccesoPlantillas, fetchPlantillas } from "@/infrastructure/actions/plantillasActions";
import PlantillasTable from "@/components/plantillas/PlantillasTable";

/* ══════════════════════════════════════════════════════════════
   PAGE: Plantillas de Documentos (Server Component)
   ──────────────────────────────────────────────────────────────
   Responsabilidades:
     1. Verificar acceso (admin + abogado) server-side.
     2. Fetch inicial de datos.
     3. Delegar rendering al Client Component PlantillasTable.
   ══════════════════════════════════════════════════════════════ */

export default async function PlantillasPage() {
  /* ── 1. Guard de acceso ─────────────────────────────────── */
  const acceso = await verificarAccesoPlantillas();

  if (!acceso.success) {
    redirect("/dashboard");
  }

  /* ── 2. Fetch inicial de plantillas ─────────────────────── */
  const res = await fetchPlantillas();
  const plantillas: Plantilla[] = res.success && res.data ? res.data : [];

  /* ── 3. Delegar al Client Component ─────────────────────── */
  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <PlantillasTable initialData={plantillas} />
    </div>
  );
}
