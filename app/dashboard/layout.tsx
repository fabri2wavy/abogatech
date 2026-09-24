import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACTIVE_FIRM_COOKIE, obtenerContextoUsuarioActualServer } from "@/infrastructure/repositories/firmRepository.server";
import { FirmProvider } from "@/components/firm/FirmProvider";
import DashboardClientLayout from "./DashboardClientLayout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = await obtenerContextoUsuarioActualServer();
  if (context.status === 'unauthenticated') redirect('/login');
  const savedFirmId = (await cookies()).get(ACTIVE_FIRM_COOKIE)?.value;
  const resolvedFirmId = context.status === 'ready' ? context.firmId : undefined;
  const needsCookieSync = context.status !== 'error' && savedFirmId !== resolvedFirmId;

  return (
    <FirmProvider key={`${context.user?.userId}:${context.firmId}:${context.role}`}
      initialContext={context} needsCookieSync={needsCookieSync}>
      {context.status === 'ready' && (
        <DashboardClientLayout>{children}</DashboardClientLayout>
      )}
    </FirmProvider>
  );
}
