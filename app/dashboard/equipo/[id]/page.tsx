"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  FolderOpen,
  Trash2,
  Lock,
  ShieldAlert,
  KeyRound,
  Briefcase,
  Shield,
  GraduationCap
} from "lucide-react";
import { MiembroEquipo } from "@/domain/entities/MiembroEquipo";
import { obtenerMiembroPorId } from "@/infrastructure/repositories/equipoRepository";
import { actualizarMiembroAction, eliminarMiembroAction } from "@/infrastructure/actions/equipoActions";
import { Button } from "@/components/ui/Button";

/* ── Clases e inputs ─────────────────────────────────────────── */
const INPUT = "w-full text-sm px-3.5 py-2.5 rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-gray-50/50 placeholder:text-gray-400";
const LABEL = "text-xs font-semibold text-gray-700 block mb-1.5";

export default function DetalleMiembroPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  /* ── State ─────────────────────────────────────────────────── */
  const [miembro, setMiembro] = useState<MiembroEquipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [enviandoLink, setEnviandoLink] = useState(false);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  /* ── Formulario de edición (campos granulares) ───────────────── */
  const [formData, setFormData] = useState({
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefono: "",
    rol: "abogado",
    cargo: "",
    especialidad: "",
    estadoLaboral: "activo" as MiembroEquipo["estadoLaboral"],
  });

  /* ── Email (solo lectura, se muestra pero no se edita) ─────── */
  const [emailDisplay, setEmailDisplay] = useState("");

  /* ── Toast auto-dismiss (4s) ────────────────────────────────── */
  const showToast = useCallback((type: "success" | "error", msg: string) => {
    setToast({ type, msg });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  /* ── Initialization ─────────────────────────────────────────── */
  useEffect(() => {
    async function cargarData() {
      if (!id) return;

      const resMiembro = await obtenerMiembroPorId(id);

      if (resMiembro) {
        setMiembro(resMiembro);
        setFormData({
          nombres: resMiembro.nombres || "",
          apellidoPaterno: resMiembro.apellidoPaterno || "",
          apellidoMaterno: resMiembro.apellidoMaterno || "",
          telefono: resMiembro.telefono || "",
          rol: resMiembro.rol,
          cargo: resMiembro.cargo || "",
          especialidad: resMiembro.especialidad || "",
          estadoLaboral: resMiembro.estadoLaboral,
        });
        setEmailDisplay(resMiembro.email || "");
      }
      setLoading(false);
    }
    cargarData();
  }, [id]);

  /* ── Helpers ────────────────────────────────────────────────── */
  const actualizarCampo = (campo: string, valor: string) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
  };

  const construirNombre = (): string => {
    return (
      [formData.nombres, formData.apellidoPaterno, formData.apellidoMaterno]
        .filter(Boolean)
        .join(" ")
        .trim() || "Sin registrar"
    );
  };

  /* ── Guardar cambios ───────────────────────────────────────── */
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setToast(null);

    const payload: Partial<MiembroEquipo> = {
      nombres: formData.nombres.trim(),
      apellidoPaterno: formData.apellidoPaterno.trim(),
      apellidoMaterno: formData.apellidoMaterno.trim(),
      telefono: formData.telefono.trim() || null,
      rol: formData.rol,
      cargo: formData.cargo.trim(),
      especialidad: formData.especialidad.trim() || null,
      estadoLaboral: formData.estadoLaboral,
    };

    const result = await actualizarMiembroAction(id, payload);

    if (result.success) {
      setMiembro({
        ...miembro!,
        nombres: formData.nombres,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        telefono: formData.telefono,
        rol: formData.rol,
        cargo: formData.cargo,
        especialidad: formData.especialidad,
        estadoLaboral: formData.estadoLaboral,
      });
      showToast("success", "Perfil profesional actualizado correctamente.");
      router.refresh();
    } else {
      showToast("error", result.error || "Error al actualizar los datos del miembro.");
    }
    setGuardando(false);
  };

  /* ── Restablecer contraseña (simulado) ─────────────────────── */
  const handleResetPassword = async () => {
    setEnviandoLink(true);
    setToast(null);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    showToast(
      "success",
      `Se envió un enlace de restablecimiento a ${emailDisplay || "el correo del usuario"}.`
    );
    setEnviandoLink(false);
  };

  /* ── Eliminar miembro ──────────────────────────────────────── */
  const handleDelete = async () => {
    setEliminando(true);
    setToast(null);

    const result = await eliminarMiembroAction(id);

    if (result.success) {
      router.push("/dashboard/equipo");
    } else {
      setConfirmarEliminacion(false);
      showToast("error", result.error || "Error al intentar eliminar el miembro.");
      setEliminando(false);
    }
  };

  /* ── Render: Loading ───────────────────────────────────────── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="mt-4 text-gray-500 font-medium">Cargando perfil del equipo...</p>
      </div>
    );
  }

  /* ── Render: Not found ─────────────────────────────────────── */
  if (!miembro) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Miembro no encontrado</h2>
        <p className="text-gray-500 mb-6">El miembro del equipo que buscas no existe o fue eliminado.</p>
        <Link href="/dashboard/equipo">
          <Button variant="secondary">Volver al Directorio</Button>
        </Link>
      </div>
    );
  }

  const iniciales = (miembro.nombres.charAt(0) + miembro.apellidoPaterno.charAt(0)).toUpperCase();

  return (
    <div className="h-full flex flex-col overflow-hidden animate-in fade-in duration-500">
      
      {/* ─── Toast Flotante ────────────────────────────────────── */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 min-w-[280px] max-w-[420px] ${
            toast.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800"
          }`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
            {toast.msg}
            <button onClick={() => setToast(null)} className="ml-auto text-gray-400 hover:text-gray-600 transition-colors shrink-0">✕</button>
          </div>
        </div>
      )}

      {/* ─── Header ────────────────────────────────────────────── */}
      <header className="shrink-0 flex items-center gap-4 mb-3">
        <Link href="/dashboard/equipo">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Volver
          </Button>
        </Link>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold tracking-wide shrink-0 shadow-sm">
          {iniciales}
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight truncate">
          {miembro.nombres} {miembro.apellidoPaterno}
        </h1>
        <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          miembro.estadoLaboral === 'activo' ? 'bg-emerald-100 text-emerald-700' :
          miembro.estadoLaboral === 'vacaciones' ? 'bg-amber-100 text-amber-700' :
          'bg-gray-200 text-gray-600'
        }`}>
          {miembro.estadoLaboral.toUpperCase()}
        </span>
      </header>

      {/* ─── Layout Principal ──────────────────────────────────── */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch overflow-y-auto lg:overflow-hidden">
        
        {/* ─── COLUMNA IZQUIERDA: Formulario (h-full) ──────────── */}
        <div className="lg:col-span-5 lg:h-full flex flex-col min-h-0">
          <form onSubmit={handleUpdate} className="bg-white border border-gray-200 rounded-2xl shadow-sm lg:h-full flex flex-col overflow-hidden">
            
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Card Interna 1: Identidad */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" /> Identidad y Contacto
                </h2>
                
                <div className="space-y-1">
                  <label htmlFor="nombres" className={LABEL}>Nombres <span className="text-red-400">*</span></label>
                  <input id="nombres" type="text" className={INPUT} value={formData.nombres} onChange={(e) => actualizarCampo("nombres", e.target.value)} required />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="apellidoPaterno" className={LABEL}>Ap. Paterno <span className="text-red-400">*</span></label>
                    <input id="apellidoPaterno" type="text" className={INPUT} value={formData.apellidoPaterno} onChange={(e) => actualizarCampo("apellidoPaterno", e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="apellidoMaterno" className={LABEL}>Ap. Materno</label>
                    <input id="apellidoMaterno" type="text" className={INPUT} value={formData.apellidoMaterno} onChange={(e) => actualizarCampo("apellidoMaterno", e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> Correo Electrónico <Lock className="w-3 h-3 text-gray-400" />
                  </label>
                  <input id="email" type="email" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm cursor-not-allowed outline-none" value={emailDisplay} disabled title="El correo electrónico no se puede modificar desde esta vista." />
                </div>

                <div className="space-y-1">
                  <label htmlFor="telefono" className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" /> Teléfono / Celular
                  </label>
                  <input id="telefono" type="tel" className={INPUT} value={formData.telefono} onChange={(e) => actualizarCampo("telefono", e.target.value)} />
                </div>
              </div>

              {/* Card Interna 2: Información Profesional */}
              <div className="space-y-4 pt-2">
                <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" /> Información Académica / Cargo
                </h2>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="rol" className={LABEL}>Rol de Sistema</label>
                    <select id="rol" className={INPUT} value={formData.rol} onChange={(e) => actualizarCampo("rol", e.target.value)}>
                      <option value="admin">Administrador</option>
                      <option value="asociado_senior">Asociado Senior</option>
                      <option value="finanzas">Administración / Finanzas</option>
                      <option value="abogado">Abogado</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="estadoLaboral" className={LABEL}>Estado Laboral</label>
                    <select id="estadoLaboral" className={INPUT} value={formData.estadoLaboral} onChange={(e) => actualizarCampo("estadoLaboral", e.target.value)}>
                      <option value="activo">Activo</option>
                      <option value="vacaciones">Vacaciones</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="cargo" className={LABEL}>Cargo <span className="text-red-400">*</span></label>
                  <input id="cargo" type="text" className={INPUT} value={formData.cargo} onChange={(e) => actualizarCampo("cargo", e.target.value)} required />
                </div>

                <div className="space-y-1">
                  <label htmlFor="especialidad" className={LABEL}>Especialidad (opcional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                    </div>
                    <input id="especialidad" type="text" className={`${INPUT} pl-9`} value={formData.especialidad} onChange={(e) => actualizarCampo("especialidad", e.target.value)} placeholder="Ej. Derecho Penal, Civil..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit — anclado al fondo */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/30 mt-auto shrink-0">
              <Button type="submit" variant="primary" loading={guardando} fullWidth>
                {guardando ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </div>

        {/* ─── COLUMNA DERECHA: Historial y Admin ──────────────── */}
        <div className="lg:col-span-7 lg:h-full flex flex-col gap-4 min-h-0">
          
          {/* Tarjeta: Casos Asignados */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-blue-600" />
                Gestión de Casos Asignados
              </h2>
            </div>
            
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-gray-50/30">
              <FolderOpen className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Sin casos asignados</h3>
              <p className="text-xs text-gray-500 max-w-sm">
                La funcionalidad de asignación y visualización de expedientes específicos por abogado está en desarrollo o este miembro no tiene casos en curso.
              </p>
            </div>
          </div>

          {/* Tarjeta: Administración de Cuenta (Peligro) */}
          <div className="shrink-0 h-fit bg-red-50/30 border border-red-100 rounded-2xl p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Administración de Cuenta
            </h2>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-gray-800">Restablecer Contraseña</p>
                <p className="text-xs text-gray-500 mt-0.5">Enviar un enlace seguro para crear una nueva contraseña.</p>
              </div>
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={enviandoLink}
                className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0 w-full sm:w-auto"
              >
                {enviandoLink ? (
                  <>
                    <div className="w-3 h-3 rounded-full border-2 border-gray-300/40 border-t-gray-600 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-3.5 h-3.5" />
                    Restablecer Contraseña
                  </>
                )}
              </button>
            </div>

            <div className="border-t border-red-200/50 my-2" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-red-600">Eliminar Miembro Permanentemente</p>
                <p className="text-xs text-red-500/80 mt-0.5">Esta acción eliminará el acceso del abogado y borrará su perfil. Es irreversible.</p>
              </div>
              {!confirmarEliminacion ? (
                <button
                  type="button"
                  onClick={() => setConfirmarEliminacion(true)}
                  className="px-4 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 shrink-0 w-full sm:w-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar Miembro
                </button>
              ) : (
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setConfirmarEliminacion(false)}
                    className="flex-1 px-3 py-2 text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={eliminando}
                    className="flex-1 px-4 py-2 text-xs font-bold text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {eliminando ? (
                      <>
                        <div className="w-3 h-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        Eliminando...
                      </>
                    ) : (
                      "Confirmar"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
