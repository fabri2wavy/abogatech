"use client";

import { useState } from "react";
import { cerrarSesion } from "@/infrastructure/repositories/authRepository";
import { Button } from "@/components/ui/Button";

export default function BotonSalir() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await cerrarSesion();
      window.location.assign('/login');
    } catch {
      setError('No se pudo cerrar la sesión. Intenta nuevamente.');
      setLoading(false);
    }
  };

  return (
    <>
    {error && <p role="alert" className="text-[var(--color-danger)]">{error}</p>}
    <Button
      variant="ghost"
      fullWidth
      onClick={handleLogout}
      loading={loading}
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
    </>
  );
}
