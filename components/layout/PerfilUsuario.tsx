"use client";

import { useEffect, useState } from "react";
import { obtenerPerfilConRol } from "@/infrastructure/repositories/authRepository";

export default function PerfilUsuario() {
  const [rol, setRol] = useState<string>("Cargando...");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    async function obtenerPerfil() {
      const perfil = await obtenerPerfilConRol();

      if (perfil) {
        setEmail(perfil.email);
        setRol(perfil.rol);
      } else {
        setRol("Sin rol asignado");
      }
    }

    obtenerPerfil();
  }, []);

  /* Generar iniciales del email para el avatar */
  const iniciales = email
    ? email.substring(0, 2).toUpperCase()
    : "??";

  return (
    <div
      className="mb-3 p-3 rounded-lg"
      style={{
        background: "var(--color-navy-card)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="flex items-center gap-3">
        {/* Avatar con iniciales */}
        <div
          className="flex items-center justify-center w-9 h-9 rounded-full text-xs font-semibold shrink-0"
          style={{
            background: "var(--color-gold-dim)",
            color: "var(--color-gold-light)",
            border: "1px solid rgba(204, 0, 0, 0.3)",
          }}
        >
          {iniciales}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-xs truncate"
            style={{ color: "var(--color-text-muted)" }}
          >
            {email}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="flex h-2 w-2 rounded-full shrink-0"
              style={{ background: "var(--color-success)" }}
            />
            <p
              className="text-sm font-semibold capitalize truncate"
              style={{ color: "var(--color-text-on-dark)" }}
            >
              {rol}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}