import { obtenerPerfilActualServer } from "@/infrastructure/repositories/usuarioRepository.server";
import DashboardClientLayout from "./DashboardClientLayout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const perfil = await obtenerPerfilActualServer();
  const rol = perfil?.rol || "cliente";
  const userId = perfil?.id || null;

  return (
    <DashboardClientLayout rol={rol} userId={userId}>
      {children}
    </DashboardClientLayout>
  );
}
