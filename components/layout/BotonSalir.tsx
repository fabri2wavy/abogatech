"use client";

import { useRouter } from "next/navigation";
import { cerrarSesion } from "@/infrastructure/repositories/authRepository";
import { Button } from "@/components/ui/Button";

export default function BotonSalir() {
  const router = useRouter();

  const handleLogout = async () => {
    await cerrarSesion();
    router.refresh();
    router.push("/login");
  };

  return (
    <Button
      variant="ghost"
      fullWidth
      onClick={handleLogout}
      className="justify-start px-4 text-[var(--color-danger)] hover:!text-red-400 hover:!bg-red-500/10"
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      Cerrar Sesión
    </Button>
  );
}