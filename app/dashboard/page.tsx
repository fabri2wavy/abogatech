"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { obtenerPerfilActual, UsuarioPerfil } from "@/infrastructure/repositories/usuarioRepository";
import { obtenerExpedientes } from "@/infrastructure/repositories/expedienteRepository";
import { obtenerEventos } from "@/infrastructure/repositories/agendaRepository";
import AdminDashboard from "./views/AdminDashboard";
import AbogadoDashboard from "./views/AbogadoDashboard";
import ClienteDashboard from "./views/ClienteDashboard";

export default function DashboardInicio() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [cargando, setCargando] = useState(true);

  const [expedientes, setExpedientes] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);

  useEffect(() => {
    async function verificarSesion() {
      const data = await obtenerPerfilActual();
      
      if (!data) {
        router.push("/login");
        return;
      }

      setPerfil(data);

      const esAbogadoOAsociado = ["abogado", "asociado_senior", "finanzas"].includes(data.rol);

      if (esAbogadoOAsociado) {
        try {
          const [expData, evtData] = await Promise.all([
            obtenerExpedientes(),
            obtenerEventos({ abogadoId: data.id }),
          ]);
          setExpedientes(expData);
          setEventos(evtData);
        } catch (err) {
          console.error("Error cargando datos del abogado:", err);
        }
      } else if (data.rol === "admin") {
        try {
          const evtData = await obtenerEventos();
          setEventos(evtData);
        } catch (err) {
          console.error("Error cargando eventos del admin:", err);
        }
      }

      setCargando(false);
    }

    verificarSesion();
  }, [router]);

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-transparent border-[var(--color-primary)]"></div>
        <p className="mt-4 text-[var(--color-text-muted)]">Verificando credenciales...</p>
      </div>
    );
  }

  switch (perfil?.rol) {
    case 'admin':
      return <AdminDashboard nombre={perfil.nombre_completo} eventos={eventos} />;
    case 'abogado':
    case 'asociado_senior':
    case 'finanzas':
      return (
        <AbogadoDashboard
          usuario={perfil}
          expedientes={expedientes}
          eventos={eventos}
        />
      );
    case 'cliente':
      return <ClienteDashboard nombre={perfil.nombre_completo} />;
    default:
      return <ClienteDashboard nombre={perfil?.nombre_completo || "Usuario"} />;
  }
}