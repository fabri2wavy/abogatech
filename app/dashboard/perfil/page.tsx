"use client";

import { useEffect, useState } from "react";
import { User, Save, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import {
  obtenerPerfilEditable,
  actualizarPerfilPropio,
  cambiarContrasena,
} from "@/infrastructure/repositories/usuarioRepository";
import type { PerfilEditable } from "@/infrastructure/repositories/usuarioRepository";
import { Button } from "@/components/ui/Button";

/* ── Estilos reutilizables (sistema existente) ───────────────── */
const INPUT =
  "w-full text-base lg:text-lg px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 placeholder:text-gray-400";
const LABEL = "text-base font-semibold text-gray-900 block";
const INPUT_DISABLED =
  "w-full text-base lg:text-lg px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed outline-none";

/* ══════════════════════════════════════════════════════════════
   PÁGINA: Mi Perfil
   ──────────────────────────────────────────────────────────────
   Permite al usuario autenticado (abogado o admin) actualizar
   sus datos personales y contraseña.
   ══════════════════════════════════════════════════════════════ */

export default function PerfilPage() {
  /* ── Estado de carga ───────────────────────────────────────── */
  const [cargando, setCargando] = useState(true);
  const [perfil, setPerfil] = useState<PerfilEditable | null>(null);

  /* ── Estado del formulario de datos ─────────────────────────── */
  const [formData, setFormData] = useState({
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefono: "",
  });
  const [guardando, setGuardando] = useState(false);
  const [mensajePerfil, setMensajePerfil] = useState<{
    tipo: "success" | "error";
    texto: string;
  } | null>(null);

  /* ── Estado del formulario de contraseña ─────────────────────── */
  const [passwordData, setPasswordData] = useState({
    nueva: "",
    confirmar: "",
  });
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [guardandoPassword, setGuardandoPassword] = useState(false);
  const [mensajePassword, setMensajePassword] = useState<{
    tipo: "success" | "error";
    texto: string;
  } | null>(null);

  /* ── Carga inicial ──────────────────────────────────────────── */
  useEffect(() => {
    async function cargar() {
      const data = await obtenerPerfilEditable();
      if (data) {
        setPerfil(data);
        setFormData({
          nombres: data.nombres,
          apellidoPaterno: data.apellidoPaterno,
          apellidoMaterno: data.apellidoMaterno,
          telefono: data.telefono,
        });
      }
      setCargando(false);
    }
    cargar();
  }, []);

  /* ── Auto-dismiss mensajes ──────────────────────────────────── */
  useEffect(() => {
    if (!mensajePerfil) return;
    const t = setTimeout(() => setMensajePerfil(null), 5000);
    return () => clearTimeout(t);
  }, [mensajePerfil]);

  useEffect(() => {
    if (!mensajePassword) return;
    const t = setTimeout(() => setMensajePassword(null), 5000);
    return () => clearTimeout(t);
  }, [mensajePassword]);

  /* ── Handlers ───────────────────────────────────────────────── */
  const handleGuardarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombres.trim() || !formData.apellidoPaterno.trim()) {
      setMensajePerfil({
        tipo: "error",
        texto: "Los nombres y el apellido paterno son obligatorios.",
      });
      return;
    }

    setGuardando(true);
    setMensajePerfil(null);

    const result = await actualizarPerfilPropio({
      nombres: formData.nombres.trim(),
      apellidoPaterno: formData.apellidoPaterno.trim(),
      apellidoMaterno: formData.apellidoMaterno.trim(),
      telefono: formData.telefono.trim(),
    });

    if (result.success) {
      setMensajePerfil({ tipo: "success", texto: "Perfil actualizado correctamente." });
    } else {
      setMensajePerfil({
        tipo: "error",
        texto: result.error || "Error al actualizar el perfil.",
      });
    }
    setGuardando(false);
  };

  const handleCambiarContrasena = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.nueva.trim()) {
      setMensajePassword({ tipo: "error", texto: "La nueva contraseña es obligatoria." });
      return;
    }
    if (passwordData.nueva.length < 6) {
      setMensajePassword({ tipo: "error", texto: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }
    if (passwordData.nueva !== passwordData.confirmar) {
      setMensajePassword({ tipo: "error", texto: "Las contraseñas no coinciden." });
      return;
    }

    setGuardandoPassword(true);
    setMensajePassword(null);

    const result = await cambiarContrasena(passwordData.nueva);

    if (result.success) {
      setMensajePassword({ tipo: "success", texto: "Contraseña actualizada correctamente." });
      setPasswordData({ nueva: "", confirmar: "" });
    } else {
      setMensajePassword({
        tipo: "error",
        texto: result.error || "Error al cambiar la contraseña.",
      });
    }
    setGuardandoPassword(false);
  };

  /* ── Loading state ──────────────────────────────────────────── */
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-400" />
        <p className="mt-4 text-gray-500 text-sm">Cargando perfil...</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error al cargar el perfil</h2>
        <p className="text-gray-500">
          No se pudo obtener la información de tu cuenta. Intenta recargar la página.
        </p>
      </div>
    );
  }

  const rolLabel =
    perfil.rol === "admin"
      ? "Administrador"
      : perfil.rol === "abogado"
        ? "Abogado"
        : perfil.rol.charAt(0).toUpperCase() + perfil.rol.slice(1);

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* ── Cabecera ───────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mi Perfil</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administra tu información personal y credenciales de acceso.
        </p>
      </div>

      {/* ── Tarjeta de identidad ───────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
            {(perfil.nombres.charAt(0) + perfil.apellidoPaterno.charAt(0)).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {[perfil.nombres, perfil.apellidoPaterno, perfil.apellidoMaterno]
                .filter(Boolean)
                .join(" ")}
            </h2>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-sm text-gray-500">{perfil.email}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {rolLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECCIÓN 1: Datos Personales
         ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Datos Personales
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Actualiza tus nombres, apellidos y teléfono de contacto.
          </p>
        </div>

        <form onSubmit={handleGuardarPerfil} className="p-6 space-y-6">
          {mensajePerfil && (
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
                mensajePerfil.tipo === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {mensajePerfil.tipo === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              {mensajePerfil.texto}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombres */}
            <div className="space-y-2">
              <label htmlFor="perfilNombres" className={LABEL}>
                Nombres *
              </label>
              <input
                id="perfilNombres"
                type="text"
                className={INPUT}
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                placeholder="Ej. María Elena"
              />
            </div>

            {/* Apellido Paterno */}
            <div className="space-y-2">
              <label htmlFor="perfilApellidoPaterno" className={LABEL}>
                Apellido Paterno *
              </label>
              <input
                id="perfilApellidoPaterno"
                type="text"
                className={INPUT}
                value={formData.apellidoPaterno}
                onChange={(e) => setFormData({ ...formData, apellidoPaterno: e.target.value })}
                placeholder="Ej. García"
              />
            </div>

            {/* Apellido Materno */}
            <div className="space-y-2">
              <label htmlFor="perfilApellidoMaterno" className={LABEL}>
                Apellido Materno
              </label>
              <input
                id="perfilApellidoMaterno"
                type="text"
                className={INPUT}
                value={formData.apellidoMaterno}
                onChange={(e) => setFormData({ ...formData, apellidoMaterno: e.target.value })}
                placeholder="Ej. Soliz"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <label htmlFor="perfilTelefono" className={LABEL}>
                Teléfono / Celular
              </label>
              <input
                id="perfilTelefono"
                type="tel"
                className={INPUT}
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej. 70012345"
              />
            </div>
          </div>

          {/* Campos de solo lectura */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={LABEL}>Correo Electrónico</label>
              <input type="text" disabled readOnly value={perfil.email} className={INPUT_DISABLED} />
              <p className="text-xs text-gray-400">El correo no puede ser modificado.</p>
            </div>
            <div className="space-y-2">
              <label className={LABEL}>Rol</label>
              <input type="text" disabled readOnly value={rolLabel} className={INPUT_DISABLED} />
              <p className="text-xs text-gray-400">Solo un administrador puede cambiar tu rol.</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" loading={guardando}>
              <Save className="w-4 h-4 mr-1.5" />
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECCIÓN 2: Cambio de Contraseña
         ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600" />
            Seguridad
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Actualiza tu contraseña de acceso al sistema.
          </p>
        </div>

        <form onSubmit={handleCambiarContrasena} className="p-6 space-y-6">
          {mensajePassword && (
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
                mensajePassword.tipo === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {mensajePassword.tipo === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              {mensajePassword.texto}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nueva contraseña */}
            <div className="space-y-2">
              <label htmlFor="nuevaContrasena" className={LABEL}>
                Nueva Contraseña *
              </label>
              <div className="relative">
                <input
                  id="nuevaContrasena"
                  type={mostrarPassword ? "text" : "password"}
                  className={INPUT + " pr-12"}
                  value={passwordData.nueva}
                  onChange={(e) => setPasswordData({ ...passwordData, nueva: e.target.value })}
                  placeholder="Mín. 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {mostrarPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar contraseña */}
            <div className="space-y-2">
              <label htmlFor="confirmarContrasena" className={LABEL}>
                Confirmar Contraseña *
              </label>
              <input
                id="confirmarContrasena"
                type={mostrarPassword ? "text" : "password"}
                className={INPUT}
                value={passwordData.confirmar}
                onChange={(e) => setPasswordData({ ...passwordData, confirmar: e.target.value })}
                placeholder="Repite la contraseña"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" loading={guardandoPassword}>
              <Lock className="w-4 h-4 mr-1.5" />
              Cambiar Contraseña
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
