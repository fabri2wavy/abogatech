"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { User, Mail, Phone, ExternalLink, Gavel, Hash, FileText, Pencil, Users, UploadCloud, Download, Trash2, FileImage, File, FileSpreadsheet, AlertTriangle, Share2 } from "lucide-react";
import InformesTab from "./InformesTab";
import InformesAvanceTab from "./InformesAvanceTab";
import FinanzasTab from "./FinanzasTab";
import PlantillasTab from "./PlantillasTab";
import { ModalEditarExpediente } from "./ModalEditarExpediente";
import { ModalCompartirExpediente } from "./ModalCompartirExpediente";
import { obtenerExpedientePorId, actualizarExpediente } from "@/infrastructure/repositories/expedienteRepository";
import { 
  obtenerDocumentos, 
  subirDocumento, 
  obtenerUrlDescarga, 
  eliminarDocumento,
  actualizarVisibilidad 
} from "@/infrastructure/repositories/documentoRepository";
import { Documento } from "@/domain/entities/Documento";
import { obtenerAbogados, obtenerPerfilActual } from "@/infrastructure/repositories/usuarioRepository";
import { Alert } from "@/components/ui/Alert";

/* ── Mapa de clases Tailwind neutras por estado ─────────────────── */
const ESTADO_CLASSES: Record<string, string> = {
  en_espera: "bg-slate-100 text-slate-700 border-slate-200",
  mediacion: "bg-slate-100 text-slate-800 border-slate-300",
  juicio:    "bg-slate-200 text-slate-900 border-slate-300",
  cerrado:   "bg-gray-100 text-gray-500 border-gray-200",
};

const TAB_ICONS: Record<string, React.ReactNode> = {
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  docs: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  informe: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  finanzas: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  plantillas: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  ),
  avance: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

const TAB_ITEMS = [
  { key: "info", label: "Información" },
  { key: "docs", label: "Documentos" },
  { key: "informe", label: "Comunicaciones" },
  { key: "avance", label: "Informes Avance" },
  { key: "finanzas", label: "Finanzas" },
  { key: "plantillas", label: "Plantillas" },
];

export default function DetalleExpedientePage() {
  const params = useParams();
  const idCaso = params.id as string;

  const [caso, setCaso] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [pestañaActiva, setPestañaActiva] = useState("info");
  const [abogados, setAbogados] = useState<any[]>([]);
  const [perfilUsuario, setPerfilUsuario] = useState<any>(null);
  const [cambiandoAbogado, setCambiandoAbogado] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  /* ── Estados para Documentos ────────────────────────────────── */
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [cargandoDocs, setCargandoDocs] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [docError, setDocError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [visibleParaCliente, setVisibleParaCliente] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  /* ── Modal de Eliminación de Documentos ─────────────────────── */
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentoToDelete, setDocumentoToDelete] = useState<Documento | null>(null);
  const [eliminandoDoc, setEliminandoDoc] = useState(false);

  /* ── Modal Edición de Expediente ────────────────────────────── */
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  /* ── Modal Compartir Expediente ─────────────────────────────── */
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  /* ── Helpers para íconos de tipo de archivo ─────────────────── */
  const getFileIcon = (nombre: string) => {
    const ext = nombre.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return <FileImage className="w-5 h-5" />;
    if (['xls', 'xlsx', 'csv'].includes(ext)) return <FileSpreadsheet className="w-5 h-5" />;
    if (['doc', 'docx', 'txt', 'pdf'].includes(ext)) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const handleToggleVisibilidad = async (docId: string, nuevoValor: boolean) => {
    const exito = await actualizarVisibilidad(docId, nuevoValor);
    if (exito) {
      setDocumentos(prev => prev.map(d => d.id === docId ? { ...d, visibleCliente: nuevoValor } : d));
    } else {
      setDocError('No se pudo cambiar la visibilidad del documento.');
    }
  };

  /* ── Drag & Drop handlers ───────────────────────────────────── */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Reutiliza la lógica existente: simula un evento de input
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        fileInputRef.current.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }, []);

  useEffect(() => {
    async function cargarDetalle() {
      const [data, listaAbogados, perfil] = await Promise.all([
        obtenerExpedientePorId(idCaso),
        obtenerAbogados(),
        obtenerPerfilActual()
      ]);
      setCaso(data);
      setAbogados(listaAbogados);
      setPerfilUsuario(perfil);
      setCargando(false);
    }
    cargarDetalle();
  }, [idCaso]);

  const handleChangeAbogado = async (nuevoId: string) => {
    setErrorMsg("");
    setCambiandoAbogado(true);
    const exito = await actualizarExpediente(idCaso, { abogado_id: nuevoId });
    if (exito) {
      const abogadoSel = abogados.find(a => a.id === nuevoId);
      setCaso((prev: any) => ({ ...prev, abogado_id: nuevoId, abogado_nombre: abogadoSel?.nombre_completo || "Sin asignar" }));
    } else {
      setErrorMsg("Error al reasignar el abogado.");
    }
    setCambiandoAbogado(false);
  };

  /* ── Efecto para Cargar Documentos ──────────────────────────── */
  useEffect(() => {
    if (pestañaActiva === "docs") {
      cargarListaDocumentos();
    }
  }, [pestañaActiva, idCaso]);

  const cargarListaDocumentos = async () => {
    setCargandoDocs(true);
    setDocError("");
    try {
      const docs = await obtenerDocumentos(idCaso);
      setDocumentos(docs);
    } catch (err) {
      setDocError("Error al cargar los documentos.");
    } finally {
      setCargandoDocs(false);
    }
  };

  /* ── Handlers de Documentos ────────────────────────────────── */
  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubirArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendo(true);
    setDocError("");
    
    try {
      const nuevoDoc = await subirDocumento(idCaso, file, visibleParaCliente);
      if (nuevoDoc) {
        await cargarListaDocumentos();
      } else {
        setDocError("No se pudo subir el archivo. Verifica el formato o intenta nuevamente.");
      }
    } catch (err) {
      setDocError("Error inesperado al subir el archivo.");
    } finally {
      e.target.value = ""; // Permite seleccionar el mismo archivo después
      setSubiendo(false);
    }
  };

  const handleDescargar = async (ruta: string) => {
    setDocError("");
    const url = await obtenerUrlDescarga(ruta);
    if (url) {
      window.open(url, "_blank");
    } else {
      setDocError("No se pudo generar el enlace de descarga.");
    }
  };

  const handleEliminar = (doc: Documento) => {
    setDocumentoToDelete(doc);
    setIsDeleteModalOpen(true);
  };

  const cancelarEliminacion = () => {
    setIsDeleteModalOpen(false);
    setDocumentoToDelete(null);
  };

  const confirmarEliminacion = async () => {
    if (!documentoToDelete) return;
    
    setEliminandoDoc(true);
    setDocError("");
    
    const exito = await eliminarDocumento(documentoToDelete.id, documentoToDelete.ruta);
    if (exito) {
      await cargarListaDocumentos();
      setIsDeleteModalOpen(false);
      setDocumentoToDelete(null);
    } else {
      setDocError("No se pudo eliminar el archivo. Puede que otra persona ya lo haya borrado.");
      setIsDeleteModalOpen(false);
    }
    setEliminandoDoc(false);
  };

  /* ── Cambiar estado del expediente ──────────────────────────── */
  const handleCambiarEstado = async (nuevoEstado: string) => {
    setErrorMsg("");
    const exito = await actualizarExpediente(idCaso, { estado: nuevoEstado });
    if (exito) {
      setCaso({ ...caso, estado: nuevoEstado });
    } else {
      setErrorMsg("Error al cambiar el estado. Verifica tu conexión e intenta de nuevo.");
    }
  };



  /* ── Loading state ──────────────────────────────────────────── */
  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[var(--color-surface-border)]
                        border-t-[var(--color-gold)] animate-spin" />
        <span className="text-[var(--color-text-muted)]">Cargando expediente...</span>
      </div>
    );
  }

  /* ── Not found state ────────────────────────────────────────── */
  if (!caso) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="opacity-50">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <p className="font-medium text-[var(--color-danger)]">
          Expediente no encontrado.
        </p>
      </div>
    );
  }

  const estadoActual = caso?.estado || "en_espera";
  const estadoClass = ESTADO_CLASSES[estadoActual] || ESTADO_CLASSES.en_espera;

  return (
    <div className="max-w-5xl mx-auto">
      {/* ── Error Alert global ──────────────────────────────── */}
      <div className="mb-4">
        <Alert variant="error" visible={!!errorMsg}>
          {errorMsg}
        </Alert>
      </div>

      {/* ── Link de retorno ───────────────────────────────────── */}
      <a
        href="/dashboard/casos"
        className="inline-flex items-center gap-2 text-sm font-medium mb-5 px-3 py-1.5 rounded-md
                   transition-all duration-200 text-[var(--color-gold)] hover:bg-[var(--color-gold-dim)]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Volver a todos los casos
      </a>

      {/* ── Cabecera del Caso con Selector de Estado ──────────── */}
      <div
        className="p-5 sm:p-6 rounded-xl mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4
                   animate-fade-up bg-[var(--color-surface-card)] border border-[var(--color-surface-border)]
                   shadow-[var(--shadow-md)]"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
            {caso.cliente.nombre_completo}
          </h1>
          <p className="text-base sm:text-lg font-medium mt-1 text-[var(--color-text-secondary)]">
            vs. {caso.parteContraria}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 text-xs rounded-full font-bold bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
              {caso.numeroCaso}
            </span>
            <span className="px-3 py-1 text-xs rounded-full font-bold bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
              {caso.materia}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <div className="flex items-center gap-2">
            {(perfilUsuario?.rol === 'admin' || perfilUsuario?.rol === 'socio' || perfilUsuario?.rol === 'asociado_senior') && (
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[var(--color-gold)] bg-transparent border border-[var(--color-gold)] rounded-lg hover:bg-[var(--color-gold-dim)] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Compartir</span>
              </button>
            )}
            <select
              value={caso.estado}
              onChange={(e) => handleCambiarEstado(e.target.value)}
              className={`px-4 py-2.5 rounded-lg font-bold uppercase text-xs cursor-pointer outline-none border transition-all duration-200 ${estadoClass}`}
            >
              <option value="en_espera">En Espera</option>
              <option value="mediacion">Mediación</option>
              <option value="juicio">En Juicio</option>
              <option value="cerrado">Caso Cerrado</option>
            </select>
          </div>
          <p className="text-xs text-[var(--color-text-muted)]">
            Creado: {caso.fechaCreacion.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────── */}
      <div
        className="flex gap-1 mb-6 overflow-x-auto pb-1 animate-fade-up"
        style={{ animationDelay: "100ms" }}
      >
        {TAB_ITEMS.filter((tab) => !(tab.key === "finanzas" && perfilUsuario?.rol === "abogado")).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setPestañaActiva(tab.key)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium
                        transition-all duration-200 whitespace-nowrap border
                        ${
                          pestañaActiva === tab.key
                            ? "bg-[var(--color-navy)] text-[var(--color-gold-light)] border-[var(--color-navy-border)]"
                            : "bg-transparent text-[var(--color-text-muted)] border-transparent hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                        }`}
          >
            {TAB_ICONS[tab.key]}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Contenido del tab ─────────────────────────────────── */}
      <div
        className="rounded-xl p-5 sm:p-6 min-h-[300px] animate-fade-up
                   bg-[var(--color-surface-card)] border border-[var(--color-surface-border)]
                   shadow-[var(--shadow-sm)]"
        style={{ animationDelay: "150ms" }}
      >

        {pestañaActiva === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── TARJETA 1: Datos del Cliente (Solo Lectura, Accionable) ── */}
            <div className="p-5 sm:p-6 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-surface-border)] shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--color-surface-border)]">
                <h3 className="text-base font-bold flex items-center gap-2.5 text-[var(--color-text-primary)]">
                  <User className="w-[18px] h-[18px] text-[var(--color-gold)]" strokeWidth={2} />
                  Datos del Cliente
                </h3>
                <Link
                  href={`/dashboard/clientes/${caso.clienteId || ''}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-gold)] hover:text-[var(--color-text-primary)] transition-colors px-2.5 py-1.5 rounded-md hover:bg-[var(--color-gold-dim)]"
                >
                  Ir al Perfil
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] block mb-1">Nombre</span>
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" strokeWidth={1.5} />
                    <p className="text-base font-medium text-[var(--color-text-primary)]">{caso.cliente?.nombre_completo || "—"}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] block mb-1">Email</span>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" strokeWidth={1.5} />
                    {caso.cliente?.email ? (
                      <a
                        href={`mailto:${caso.cliente.email}`}
                        className="text-base font-medium text-[var(--color-info)] hover:underline transition-colors"
                      >
                        {caso.cliente.email}
                      </a>
                    ) : (
                      <p className="text-base font-medium text-[var(--color-text-muted)] italic">No registrado</p>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] block mb-1">Teléfono</span>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" strokeWidth={1.5} />
                    {caso.cliente?.telefono ? (
                      <a
                        href={`https://wa.me/${caso.cliente.telefono.replace(/\s+/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-base font-medium text-[#25D366] hover:underline transition-colors"
                      >
                        {caso.cliente.telefono}
                      </a>
                    ) : (
                      <p className="text-base font-medium text-[var(--color-text-muted)] italic">No registrado</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── TARJETA 2: Detalles Judiciales (Con NUREJ y Editar) ── */}
            <div className="p-5 sm:p-6 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-surface-border)] shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--color-surface-border)]">
                <h3 className="text-base font-bold flex items-center gap-2.5 text-[var(--color-text-primary)]">
                  <Gavel className="w-[18px] h-[18px] text-[var(--color-gold)]" strokeWidth={2} />
                  Detalles Judiciales
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors px-2.5 py-1.5 rounded-md hover:bg-[var(--color-surface-hover)]"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Editar
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] block mb-1">NUREJ / Nº Caso</span>
                  <div className="flex items-center gap-2.5">
                    <Hash className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" strokeWidth={1.5} />
                    <p className="text-base font-medium text-[var(--color-text-primary)]">{caso.numeroCaso || "—"}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] block mb-1">Juzgado</span>
                  <div className="flex items-center gap-2.5">
                    <Gavel className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" strokeWidth={1.5} />
                    <p className="text-base font-medium text-[var(--color-text-primary)]">{caso.juzgado || "—"}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] block mb-1">Título / Síntesis</span>
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" strokeWidth={1.5} />
                    <p className="text-base font-medium text-[var(--color-text-primary)]">{caso.titulo || "—"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── TARJETA 3: Asignación Interna (col-span completo) ── */}
            {perfilUsuario?.rol === 'admin' && (
              <div className="lg:col-span-2 p-5 sm:p-6 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-surface-border)] shadow-[var(--shadow-sm)]">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-[var(--color-surface-border)]">
                  <h3 className="text-base font-bold flex items-center gap-2.5 text-[var(--color-text-primary)]">
                    <Users className="w-[18px] h-[18px] text-[var(--color-gold)]" strokeWidth={2} />
                    Asignación Interna
                  </h3>
                </div>
                <div className="max-w-md">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] block mb-2">Abogado Responsable</span>
                  <div className="flex items-center gap-3">
                    <select
                      value={caso.abogado_id || ""}
                      onChange={(e) => handleChangeAbogado(e.target.value)}
                      disabled={cambiandoAbogado}
                      className="w-full px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-200
                                 bg-[var(--color-surface-card)] text-[var(--color-text-primary)] shadow-sm
                                 focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]
                                 disabled:opacity-50 transition-all"
                    >
                      <option value="" disabled>Seleccione un abogado</option>
                      {abogados.map(a => (
                        <option key={a.id} value={a.id}>{a.nombre_completo}</option>
                      ))}
                    </select>
                    {cambiandoAbogado && (
                      <div className="w-5 h-5 rounded-full border-2 border-[var(--color-surface-border)] border-t-[var(--color-gold)] animate-spin shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {pestañaActiva === "docs" && (
          <div className="space-y-6">

            {/* ── Zona de Drag & Drop + Toggle de Visibilidad ──── */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isDragging
                  ? 'border-blue-400 bg-blue-50/60 scale-[1.01]'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400'
              }`}
            >
              <UploadCloud className={`w-10 h-10 mx-auto mb-3 transition-colors ${
                isDragging ? 'text-blue-500' : 'text-gray-400'
              }`} strokeWidth={1.5} />
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Arrastra un archivo aquí
              </p>
              <p className="text-xs text-gray-500 mb-4">
                o selecciona uno desde tu equipo
              </p>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleSubirArchivo}
                disabled={subiendo}
              />
              <button
                onClick={handleTriggerFileInput}
                disabled={subiendo}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50"
              >
                {subiendo ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                {subiendo ? 'Subiendo...' : 'Seleccionar Archivo'}
              </button>

              {/* ── Toggle: Visible para el cliente ──────────────── */}
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  type="button"
                  role="switch"
                  aria-checked={visibleParaCliente}
                  onClick={() => setVisibleParaCliente(!visibleParaCliente)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    visibleParaCliente ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      visibleParaCliente ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium transition-colors ${
                  visibleParaCliente ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {visibleParaCliente ? 'Visible para el cliente' : 'Solo uso interno'}
                </span>
              </div>
            </div>

            <Alert variant="error" visible={!!docError}>
              {docError}
            </Alert>

            {/* ── Tabla de Documentos (Datos Reales) ─────────────── */}
            <div className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
              {cargandoDocs ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-blue-500 animate-spin" />
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200">
                      <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Fecha</th>
                      <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Subido Por</th>
                      <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Visibilidad</th>
                      <th className="py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {documentos.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-16 text-center">
                          <File className="w-10 h-10 mx-auto text-gray-300 mb-3" strokeWidth={1.5} />
                          <p className="text-sm font-medium text-gray-500">No hay documentos aún</p>
                          <p className="text-xs text-gray-400 mt-1">Sube el primer archivo para este expediente.</p>
                        </td>
                      </tr>
                    ) : (
                      documentos.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors group">
                          {/* Nombre + Ícono */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <div className="text-gray-400 group-hover:text-blue-500 transition-colors shrink-0">
                                {getFileIcon(doc.nombre)}
                              </div>
                              <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={doc.nombre}>
                                {doc.nombre}
                              </span>
                            </div>
                          </td>
                          {/* Fecha */}
                          <td className="py-3.5 px-5 hidden sm:table-cell">
                            <span className="text-sm text-gray-600">{doc.fechaSubida.toLocaleDateString()}</span>
                          </td>
                          {/* Subido Por */}
                          <td className="py-3.5 px-5 hidden md:table-cell">
                            <span className="text-sm text-gray-600">{doc.subidoPor}</span>
                          </td>
                          {/* Visibilidad Badge + Mini Toggle */}
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2.5">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                doc.visibleCliente
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {doc.visibleCliente ? 'Público' : 'Interno'}
                              </span>
                              <button
                                type="button"
                                role="switch"
                                aria-checked={doc.visibleCliente}
                                onClick={() => handleToggleVisibilidad(doc.id, !doc.visibleCliente)}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                                  doc.visibleCliente ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                    doc.visibleCliente ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                            </div>
                          </td>
                          {/* Acciones */}
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleDescargar(doc.ruta)}
                                className="p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Descargar"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleEliminar(doc)}
                                className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {pestañaActiva === "informe" && (
          <InformesTab expedienteId={idCaso} />
        )}

        {pestañaActiva === "avance" && (
          <InformesAvanceTab expedienteId={idCaso} />
        )}

        {pestañaActiva === "finanzas" && perfilUsuario?.rol !== "abogado" && (
          <FinanzasTab expedienteId={idCaso} expediente={caso} />
        )}

        {pestañaActiva === "plantillas" && (
          <PlantillasTab expedienteId={idCaso} />
        )}
      </div>

      {/* ── Modal de Confirmación de Eliminación ────────────────────── */}
      {isDeleteModalOpen && documentoToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
        >
          <div
            className="relative w-full max-w-md bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 mb-5">
                <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¿Eliminar permanentemente?
              </h3>
              <p className="text-sm text-gray-500 mb-6 px-2">
                Estás a punto de eliminar el archivo <span className="font-semibold text-gray-800">'{documentoToDelete.nombre}'</span>. Esta acción es irreversible y el documento se borrará del Storage y de la base de datos.
              </p>
              
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={cancelarEliminacion}
                  disabled={eliminandoDoc}
                  className="w-full inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:w-auto transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmarEliminacion}
                  disabled={eliminandoDoc}
                  className="w-full inline-flex justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 sm:w-auto transition-colors disabled:opacity-50"
                >
                  {eliminandoDoc ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Eliminando...
                    </div>
                  ) : (
                    "Sí, eliminar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Edición de Expediente ─────────────────────────── */}
      {isEditModalOpen && (
        <ModalEditarExpediente
          expediente={caso}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={(datosActualizados) => {
            setCaso((prev: any) => ({ ...prev, ...datosActualizados }));
          }}
        />
      )}

      {/* ── Modal Compartir Expediente ────────────────────────── */}
      {isShareModalOpen && perfilUsuario && (
        <ModalCompartirExpediente
          expedienteId={idCaso}
          usuarioActualId={perfilUsuario.id}
          onClose={() => setIsShareModalOpen(false)}
          onSuccess={() => {
            // Se puede agregar un toast global de éxito aquí si lo deseas
          }}
        />
      )}

    </div>
  );
}