"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  MoreHorizontal,
  Briefcase,
  Shield,
  Pencil,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { MiembroEquipo } from "@/domain/entities/MiembroEquipo";
import { obtenerEquipo } from "@/infrastructure/repositories/equipoRepository";
import { obtenerPerfilActual } from "@/infrastructure/repositories/usuarioRepository";
import {
  registrarNuevoMiembro,
  actualizarMiembroAction,
  eliminarMiembroAction,
} from "@/infrastructure/actions/equipoActions";
import { Button } from "@/components/ui/Button";

/* ══════════════════════════════════════════════════════════════
   HELPERS: Configuración visual de Badges
   ══════════════════════════════════════════════════════════════ */
const ESTADO_CONFIG: Record<
  MiembroEquipo["estadoLaboral"],
  { label: string; dot: string; bg: string; text: string; border: string }
> = {
  activo: {
    label: "Activo",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  vacaciones: {
    label: "Vacaciones",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  inactivo: {
    label: "Inactivo",
    dot: "bg-gray-400",
    bg: "bg-gray-100",
    text: "text-gray-500",
    border: "border-gray-200",
  },
};

const ROL_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  admin: {
    label: "Admin",
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  asociado_senior: {
    label: "Asociado Senior",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  finanzas: {
    label: "Finanzas",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  abogado: {
    label: "Abogado",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
};

function getRolConfig(rol: string) {
  return (
    ROL_CONFIG[rol.toLowerCase()] ?? {
      label: rol.charAt(0).toUpperCase() + rol.slice(1),
      bg: "bg-gray-50",
      text: "text-gray-600",
      border: "border-gray-200",
    }
  );
}

const ROLES_OPTIONS = [
  { value: "admin", label: "Administrador" },
  { value: "asociado_senior", label: "Asociado Senior" },
  { value: "finanzas", label: "Administración / Finanzas" },
  { value: "abogado", label: "Abogado" },
];

const FORM_INIT = {
  nombres: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  email: "",
  password: "",
  telefono: "",
  rol: "abogado",
  cargo: "",
  especialidad: "",
};

const INPUT =
  "w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all bg-white placeholder:text-gray-400";
const LABEL = "text-sm font-semibold text-gray-700 block mb-1.5";

type ErroresForm = {
  nombres?: string;
  apellidoPaterno?: string;
  email?: string;
  password?: string;
  rol?: string;
  cargo?: string;
};

/* ══════════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL: Equipo Legal
   ══════════════════════════════════════════════════════════════ */
export default function EquipoPage() {
  const router = useRouter();

  /* ── Estado ─────────────────────────────────────────────────── */
  const [verificando, setVerificando] = useState(true);
  const [cargando, setCargando] = useState(true);
  const [equipo, setEquipo] = useState<MiembroEquipo[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* ── Estado de UI ───────────────────────────────────────────── */
  const [mostrarModal, setMostrarModal] = useState(false);
  const [miembroSeleccionado, setMiembroSeleccionado] =
    useState<MiembroEquipo | null>(null);
  const [mostrarAlertDialog, setMostrarAlertDialog] = useState(false);
  const [miembroAEliminar, setMiembroAEliminar] =
    useState<MiembroEquipo | null>(null);

  const [formData, setFormData] = useState({ ...FORM_INIT });
  const [erroresForm, setErroresForm] = useState<ErroresForm>({});
  const [enviando, setEnviando] = useState(false);
  const [errorFormGlobal, setErrorFormGlobal] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  /* ── Toast Auto-dismiss ─────────────────────────────────────── */
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  /* ── Inicialización ─────────────────────────────────────────── */
  async function cargarEquipo() {
    try {
      const data = await obtenerEquipo();
      setEquipo(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al cargar el equipo.",
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    let cancelado = false;
    async function inicializar() {
      const perfil = await obtenerPerfilActual();
      if (!perfil || perfil.rol !== "admin") {
        router.push("/dashboard");
        return;
      }
      if (cancelado) return;
      setVerificando(false);
      await cargarEquipo();
    }
    inicializar();
    return () => {
      cancelado = true;
    };
  }, [router]);

  /* ── Handlers de Modal de Formulario ────────────────────────── */
  const abrirModalCrear = () => {
    setMiembroSeleccionado(null);
    setFormData({ ...FORM_INIT });
    setErroresForm({});
    setErrorFormGlobal("");
    setMostrarModal(true);
  };

  const abrirModalEditar = (miembro: MiembroEquipo) => {
    setMiembroSeleccionado(miembro);
    setFormData({
      nombres: miembro.nombres,
      apellidoPaterno: miembro.apellidoPaterno,
      apellidoMaterno: miembro.apellidoMaterno,
      email: miembro.email || "",
      password: "", // No se precarga en edición
      telefono: miembro.telefono || "",
      rol: miembro.rol,
      cargo: miembro.cargo,
      especialidad: miembro.especialidad || "",
    });
    setErroresForm({});
    setErrorFormGlobal("");
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const actualizarCampo = (campo: string, valor: string) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
    if (campo in erroresForm) {
      setErroresForm((prev) => ({ ...prev, [campo]: undefined }));
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: ErroresForm = {};

    if (!formData.nombres.trim())
      nuevosErrores.nombres = "Los nombres son obligatorios.";
    if (!formData.apellidoPaterno.trim())
      nuevosErrores.apellidoPaterno = "El apellido paterno es obligatorio.";

    // Validaciones exclusivas de creación
    if (!miembroSeleccionado) {
      if (!formData.email.trim()) {
        nuevosErrores.email = "El correo es obligatorio para crear la cuenta.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        nuevosErrores.email = "Ingresa un correo electrónico válido.";
      }
      if (!formData.password.trim()) {
        nuevosErrores.password = "La contraseña temporal es obligatoria.";
      } else if (formData.password.trim().length < 6) {
        nuevosErrores.password =
          "La contraseña debe tener al menos 6 caracteres.";
      }
    }

    if (!formData.rol) nuevosErrores.rol = "Selecciona un rol.";
    if (!formData.cargo.trim())
      nuevosErrores.cargo = "El cargo es obligatorio.";

    setErroresForm(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const checkNoChanges = () => {
    if (!miembroSeleccionado) return false;
    return (
      formData.nombres === miembroSeleccionado.nombres &&
      formData.apellidoPaterno === miembroSeleccionado.apellidoPaterno &&
      formData.apellidoMaterno === miembroSeleccionado.apellidoMaterno &&
      formData.telefono === (miembroSeleccionado.telefono || "") &&
      formData.rol === miembroSeleccionado.rol &&
      formData.cargo === miembroSeleccionado.cargo &&
      formData.especialidad === (miembroSeleccionado.especialidad || "")
    );
  };

  const handleGuardarMiembro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    if (miembroSeleccionado && checkNoChanges()) {
      cerrarModal();
      setToast({ type: "success", msg: "No hubo cambios que guardar." });
      return;
    }

    setEnviando(true);
    setErrorFormGlobal("");

    if (miembroSeleccionado) {
      // MODO EDICIÓN
      const payload: Partial<MiembroEquipo> = {
        nombres: formData.nombres.trim(),
        apellidoPaterno: formData.apellidoPaterno.trim(),
        apellidoMaterno: formData.apellidoMaterno.trim(),
        telefono: formData.telefono.trim() || null,
        rol: formData.rol,
        cargo: formData.cargo.trim(),
        especialidad: formData.especialidad.trim() || null,
      };

      const result = await actualizarMiembroAction(
        miembroSeleccionado.id,
        payload,
      );
      if (result.success) {
        setToast({
          type: "success",
          msg: "Miembro actualizado correctamente.",
        });
        cerrarModal();
        await cargarEquipo();
        router.refresh();
      } else {
        setErrorFormGlobal(result.error || "Error al actualizar el miembro.");
      }
    } else {
      // MODO CREACIÓN
      const result = await registrarNuevoMiembro({
        nombres: formData.nombres.trim(),
        apellidoPaterno: formData.apellidoPaterno.trim(),
        apellidoMaterno: formData.apellidoMaterno.trim(),
        email: formData.email.trim() || null,
        password: formData.password.trim(),
        telefono: formData.telefono.trim() || null,
        rol: formData.rol,
        cargo: formData.cargo.trim(),
        especialidad: formData.especialidad.trim() || null,
      });

      if (result.success) {
        setToast({ type: "success", msg: "Miembro registrado correctamente." });
        cerrarModal();
        await cargarEquipo();
        router.refresh();
      } else {
        setErrorFormGlobal(result.error || "Error al registrar el miembro.");
      }
    }

    setEnviando(false);
  };

  /* ── Handlers de Eliminación ────────────────────────────────── */
  const confirmarEliminar = async () => {
    if (!miembroAEliminar) return;
    setIsDeleting(true);

    const result = await eliminarMiembroAction(miembroAEliminar.id);
    if (result.success) {
      setToast({ type: "success", msg: "Miembro eliminado permanentemente." });
      setMostrarAlertDialog(false);
      await cargarEquipo();
      router.refresh();
    } else {
      setToast({
        type: "error",
        msg: result.error || "Error al eliminar el miembro.",
      });
    }

    setIsDeleting(false);
  };

  const inputClass = (campo: keyof ErroresForm) =>
    `${INPUT} ${erroresForm[campo] ? "!border-rose-300 !ring-rose-50 focus:!border-rose-400 focus:!ring-rose-100" : ""}`;

  /* ── Guard ──────────────────────────────────────────────────── */
  if (verificando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
        <p className="mt-4 text-[var(--color-text-muted)]">
          Verificando permisos...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* ── Toast Global ────────────────────────────────────────── */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-2 min-w-[280px] max-w-[420px] ${
              toast.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
            />
            {toast.msg}
            <button
              onClick={() => setToast(null)}
              className="ml-auto text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ── Cabecera ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Equipo Legal
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Directorio de abogados y personal de la firma.
          </p>
        </div>
        <Button variant="primary" onClick={abrirModalCrear}>
          <Plus className="w-5 h-5 mr-2" /> Añadir Miembro
        </Button>
      </div>

      {/* ── Error global ──────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3 text-red-800 text-sm font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* ── Tabla de Datos ────────────────────────────────────── */}
      <div className="w-full overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200">
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Miembro
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Cargo / Especialidad
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Rol de Sistema
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Estado
              </th>
              <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 relative">
            {cargando && (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
                    <p className="text-gray-500 text-sm">Cargando equipo...</p>
                  </div>
                </td>
              </tr>
            )}
            {!cargando && !error && equipo.length === 0 && (
              <tr>
                <td colSpan={5} className="py-24 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Users
                      className="w-8 h-8 text-gray-300"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    No hay miembros registrados
                  </h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                    Registra al primer miembro de tu equipo legal para comenzar
                    a gestionar la firma.
                  </p>
                  <Button variant="primary" onClick={abrirModalCrear}>
                    <Plus className="w-4 h-4 mr-1.5" /> Añadir Miembro
                  </Button>
                </td>
              </tr>
            )}
            {!cargando &&
              equipo.map((miembro) => (
                <TableRow
                  key={miembro.id}
                  miembro={miembro}
                  onEdit={() => abrirModalEditar(miembro)}
                  onDelete={() => {
                    setMiembroAEliminar(miembro);
                    setMostrarAlertDialog(true);
                  }}
                />
              ))}
          </tbody>
        </table>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MODAL: CREAR / EDITAR MIEMBRO
         ═══════════════════════════════════════════════════════════ */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
          <div
            className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {miembroSeleccionado ? (
                  <Pencil className="w-5 h-5 text-blue-600" />
                ) : (
                  <Plus className="w-5 h-5 text-blue-600" />
                )}
                {miembroSeleccionado
                  ? "Editar Miembro"
                  : "Registrar Nuevo Miembro"}
              </h3>
              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-gray-900 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleGuardarMiembro}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {errorFormGlobal && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex gap-3 text-rose-800 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {errorFormGlobal}
                </div>
              )}

              {/* Sección 1 */}
              <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
                  Identidad y Contacto
                </h4>

                <div className="space-y-1">
                  <label htmlFor="nombres" className={LABEL}>
                    Nombres <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="nombres"
                    type="text"
                    className={inputClass("nombres")}
                    value={formData.nombres}
                    onChange={(e) => actualizarCampo("nombres", e.target.value)}
                  />
                  {erroresForm.nombres && (
                    <p className="text-xs text-red-500 mt-1">
                      {erroresForm.nombres}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="apellidoPaterno" className={LABEL}>
                      Apellido Paterno <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="apellidoPaterno"
                      type="text"
                      className={inputClass("apellidoPaterno")}
                      value={formData.apellidoPaterno}
                      onChange={(e) =>
                        actualizarCampo("apellidoPaterno", e.target.value)
                      }
                    />
                    {erroresForm.apellidoPaterno && (
                      <p className="text-xs text-red-500 mt-1">
                        {erroresForm.apellidoPaterno}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="apellidoMaterno" className={LABEL}>
                      Apellido Materno
                    </label>
                    <input
                      id="apellidoMaterno"
                      type="text"
                      className={INPUT}
                      value={formData.apellidoMaterno}
                      onChange={(e) =>
                        actualizarCampo("apellidoMaterno", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="telefono" className={LABEL}>
                      Teléfono / Celular
                    </label>
                    <input
                      id="telefono"
                      type="tel"
                      className={INPUT}
                      value={formData.telefono}
                      onChange={(e) =>
                        actualizarCampo("telefono", e.target.value)
                      }
                    />
                  </div>
                  {!miembroSeleccionado && (
                    <div className="space-y-1">
                      <label htmlFor="email" className={LABEL}>
                        Correo Electrónico{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={inputClass("email")}
                        value={formData.email}
                        onChange={(e) =>
                          actualizarCampo("email", e.target.value)
                        }
                      />
                      {erroresForm.email && (
                        <p className="text-xs text-red-500 mt-1">
                          {erroresForm.email}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {!miembroSeleccionado && (
                  <div className="space-y-1">
                    <label htmlFor="password" className={LABEL}>
                      Contraseña Temporal{" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Mín. 6 caracteres"
                      className={inputClass("password")}
                      value={formData.password}
                      onChange={(e) =>
                        actualizarCampo("password", e.target.value)
                      }
                    />
                    {erroresForm.password && (
                      <p className="text-xs text-red-500 mt-1">
                        {erroresForm.password}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Sección 2 */}
              <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
                  Información Profesional
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="rol" className={LABEL}>
                      Rol de Sistema <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="rol"
                      className={inputClass("rol")}
                      value={formData.rol}
                      onChange={(e) => actualizarCampo("rol", e.target.value)}
                    >
                      {ROLES_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                    {erroresForm.rol && (
                      <p className="text-xs text-red-500 mt-1">
                        {erroresForm.rol}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="cargo" className={LABEL}>
                      Cargo <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="cargo"
                      type="text"
                      className={inputClass("cargo")}
                      value={formData.cargo}
                      onChange={(e) => actualizarCampo("cargo", e.target.value)}
                    />
                    {erroresForm.cargo && (
                      <p className="text-xs text-red-500 mt-1">
                        {erroresForm.cargo}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="especialidad" className={LABEL}>
                    Especialidad
                  </label>
                  <input
                    id="especialidad"
                    type="text"
                    className={INPUT}
                    value={formData.especialidad}
                    onChange={(e) =>
                      actualizarCampo("especialidad", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Acciones */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={cerrarModal}
                  disabled={enviando}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" loading={enviando}>
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  {miembroSeleccionado
                    ? "Guardar Cambios"
                    : "Registrar Miembro"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          ALERT DIALOG: ELIMINAR MIEMBRO
         ═══════════════════════════════════════════════════════════ */}
      {mostrarAlertDialog && miembroAEliminar && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Eliminar miembro del equipo?
                </h3>
                <p className="text-sm text-gray-500">
                  Estás a punto de eliminar a{" "}
                  <span className="font-semibold text-gray-800">
                    {miembroAEliminar.nombres}{" "}
                    {miembroAEliminar.apellidoPaterno}
                  </span>
                  .
                </p>
                <p className="text-sm text-red-600 font-medium mt-2 bg-red-50 p-2 rounded-lg border border-red-100">
                  Esta acción eliminará permanentemente el acceso del abogado al
                  sistema y borrará su perfil profesional. Esta operación no se
                  puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => setMostrarAlertDialog(false)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                onClick={confirmarEliminar}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : (
                  "Sí, Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   COMPONENTE: Fila de Tabla con Dropdown
   ══════════════════════════════════════════════════════════════ */
function TableRow({
  miembro,
  onEdit,
  onDelete,
}: {
  miembro: MiembroEquipo;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const estado = ESTADO_CONFIG[miembro.estadoLaboral];
  const rol = getRolConfig(miembro.rol);
  const iniciales = (
    miembro.nombres.charAt(0) + miembro.apellidoPaterno.charAt(0)
  ).toUpperCase();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <tr className="hover:bg-gray-50/70 transition-colors group">
      <td className="py-3.5 px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold tracking-wide shrink-0 shadow-sm">
            {iniciales}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {miembro.nombres} {miembro.apellidoPaterno}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {miembro.email ?? "Sin correo"}
            </p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-6">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm text-gray-700 truncate">
            {miembro.cargo || "—"}
          </span>
          {miembro.especialidad && (
            <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 border border-gray-200 shrink-0">
              {miembro.especialidad}
            </span>
          )}
        </div>
      </td>
      <td className="py-3.5 px-6">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${rol.bg} ${rol.text} ${rol.border}`}
        >
          <Shield className="w-3 h-3" />
          {rol.label}
        </span>
      </td>
      <td className="py-3.5 px-6">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${estado.bg} ${estado.text} ${estado.border}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${estado.dot}`} />
          {estado.label}
        </span>
      </td>
      <td className="py-3.5 px-6 text-right relative">
        <div className="inline-block" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none"
            title="Opciones"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-6 top-10 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-100 text-left">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push(`/dashboard/equipo/${miembro.id}`);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-gray-400" /> Ver Detalles
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Pencil className="w-4 h-4 text-gray-400" /> Editar
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4 text-red-400" /> Eliminar
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
