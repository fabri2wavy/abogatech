"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { iniciarSesion } from "@/infrastructure/repositories/authRepository";

import { AuthCard } from "@/components/ui/AuthCard";
import { FormField } from "@/components/ui/FormField";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    const resultado = await iniciarSesion(email, password);

    if (!resultado.success) {
      setMensaje("Error al iniciar sesión: " + resultado.error);
      setLoading(false);
    } else {
      setMensaje("¡Login exitoso! Entrando al sistema...");
      router.push("/dashboard");
    }
  };

  const isError = mensaje.toLowerCase().includes("error");

  return (
    <AuthCard>
      <Alert
        variant={isError ? "error" : "success"}
        visible={!!mensaje}
      >
        {mensaje}
      </Alert>

      <form onSubmit={handleLogin} className={styles.form}>
        <FormField
          label="Correo Electrónico"
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="admin@iturri.com"
        />

        <FormField
          label="Contraseña"
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />

        <div className={styles.buttonGroup}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
          >
            {loading ? "Procesando…" : "Iniciar Sesión"}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}