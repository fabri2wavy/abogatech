"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  FolderOpen, Search, Filter, FileText, RefreshCw, Trash2, ArrowLeft, AlertTriangle
} from "lucide-react";
import { 
  obtenerExpedientesArchivados, 
  restaurarExpediente, 
  eliminarExpedienteDefinitivo 
} from "@/infrastructure/repositories/expedienteRepository";
import { obtenerPerfilActual } from "@/infrastructure/repositories/usuarioRepository";
import { Button } from "@/components/ui/Button";
import { ToastContainer, useToasts } from "@/components/ui/Toast";

/* ── Estado badge design ────────────────────────────────────── */
function getEstadoDesign(estado: string | undefined | null) {
  if (!estado) return "bg-gray-100 text-gray-800";
  const st = estado.toLowerCase();
  if (st.includes("concluido") || st.includes("archivado") || st.includes("cerrado") || st.includes("aprobado"))
    return "bg-gray-100 text-gray-600";
  if (st.includes("juicio") || st.includes("denuncia") || st.includes("demanda") || st.includes("rechazado"))
    return "bg-rose-50 text-rose-700";
  if (st.includes("conciliación") || st.includes("estudio") || st.includes("preliminar") || st.includes("revisión") || st.includes("espera"))
    return "bg-amber-50 text-amber-700";
  return "bg-blue-50 text-blue-700";
}

export default function PapeleraExpedientesPage() {
  const [expedientes, setExpedientes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [accesoDenegado, setAccesoDenegado] = useState(false);
  
  /* ── Modals State ─────────────────────────────────────────── */
  const [expedienteARestaurar, setExpedienteARestaurar] = useState<any>(null);
  const [procesandoRestauracion, setProcesandoRestauracion] = useState(false);

  const [expedienteAEliminar, setExpedienteAEliminar] = useState<any>(null);
  const [procesandoEliminacion, setProcesandoEliminacion] = useState(false);
  const [textoConfirmacion, setTextoConfirmacion] = useState("");

  const { toasts, addToast, removeToast } = useToasts();

  /* ── Carga inicial ────────────────────────────────────────── */
  useEffect(() => {
    async function init() {
      const perfil = await obtenerPerfilActual();
      if (perfil?.rol !== "admin") {
        setAccesoDenegado(true);
        setCargando(false);
        return;
      }
      
      const dataCasos = await obtenerExpedientesArchivados();
      setExpedientes(dataCasos);
      setCargando(false);
    }
    init();
  }, []);

  /* ── Filtrado ─────────────────────────────────────────────── */
  const expedientesFiltrados = useMemo(() =>
    expedientes.filter((caso) => {
      if (searchTerm) {
        const t = searchTerm.toLowerCase();
        return (
          (caso.numeroCaso ?? "").toLowerCase().includes(t) ||
          (caso.titulo ?? "").toLowerCase().includes(t) ||
          (caso.nombreCliente ?? "").toLowerCase().includes(t) ||
          (caso.parteContraria ?? "").toLowerCase().includes(t)
        );
      }
      return true;
    }),
    [expedientes, searchTerm]
  );

  /* ── Handlers ─────────────────────────────────────────────── */
  const handleRestaurar = async () => {
    if (!expedienteARestaurar) return;
    setProcesandoRestauracion(true);
    try {
      const exito = await restaurarExpediente(expedienteARestaurar.id);
      if (exito) {
        setExpedientes(prev => prev.filter(c => c.id !== expedienteARestaurar.id));
        addToast("success", "Expediente restaurado correctamente.");
      } else {
        addToast("error", "No se pudo restaurar el expediente.");
      }
    } catch {
      addToast("error", "Error de conexión.");
    } finally {
      setProcesandoRestauracion(false);
      setExpedienteARestaurar(null);
    }
  };

  const handleEliminarDefinitivo = async () => {
    if (!expedienteAEliminar) return;
    if (textoConfirmacion.trim().toUpperCase() !== "ELIMINAR") {
      addToast("error", "Debes escribir ELIMINAR para confirmar.");
      return;
    }
    
    setProcesandoEliminacion(true);
    try {
      const res = await eliminarExpedienteDefinitivo(expedienteAEliminar.id);
      if (res.success) {
        setExpedientes(prev => prev.filter(c => c.id !== expedienteAEliminar.id));
        addToast("success", "Expediente eliminado de forma permanente.");
      } else {
        addToast("error", res.error || "No se pudo eliminar el expediente.");
      }
    } catch {
      addToast("error", "Error de conexión.");
    } finally {
      setProcesandoEliminacion(false);
      setExpedienteAEliminar(null);
      setTextoConfirmacion("");
    }
  };

  /* ── Render Acceso Denegado ───────────────────────────────── */
  if (accesoDenegado) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <div className="inline-flex w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
        <p className="text-gray-500 mb-6">Solo los administradores pueden acceder a la Papelera de Expedientes.</p>
        <Link href="/dashboard/casos">
          <Button variant="primary">Volver a Expedientes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-2">
        <div>
          <Link href="/dashboard/casos" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-2 group">
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Volver a Expedientes Activos
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
            <Trash2 className="w-8 h-8 text-red-500" strokeWidth={2.5} />
            Papelera de Expedientes
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra los casos archivados. Puedes restaurarlos o eliminarlos permanentemente.
          </p>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm flex">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar en la papelera por N° caso, título, partes..."
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest">Identificador</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest">Partes y Juzgado</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest">Materia</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest text-right">Acciones (Admin)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cargando && (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
                      <p className="text-gray-500 text-sm">Cargando papelera...</p>
                    </div>
                  </td>
                </tr>
              )}

              {!cargando && expedientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <FolderOpen className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">La papelera está vacía</h3>
                    <p className="text-sm text-gray-500">No hay expedientes archivados en este momento.</p>
                  </td>
                </tr>
              )}

              {!cargando && expedientesFiltrados.map((caso) => (
                <tr key={caso.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 border border-gray-100 rounded-md text-gray-400 group-hover:bg-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 tracking-tight">{caso.numeroCaso}</div>
                        <div className="text-xs text-gray-500 max-w-50 truncate" title={caso.titulo}>{caso.titulo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-800">
                      {caso.nombreCliente} <span className="text-gray-400 font-normal mx-1">vs</span> {caso.parteContraria}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-62.5">{caso.juzgado}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {caso.materia}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setExpedienteARestaurar(caso)}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-md hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
                        title="Restaurar Expediente"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">Restaurar</span>
                      </button>
                      <button
                        onClick={() => setExpedienteAEliminar(caso)}
                        className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors flex items-center gap-1.5"
                        title="Eliminar Definitivamente"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Restaurar */}
      {expedienteARestaurar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">¿Restaurar expediente?</h3>
                  <p className="text-sm text-gray-500 font-mono mt-0.5">{expedienteARestaurar.numeroCaso}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Este expediente volverá al flujo normal y estará visible nuevamente para los abogados asignados.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setExpedienteARestaurar(null)} disabled={procesandoRestauracion} className="px-5">
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleRestaurar} disabled={procesandoRestauracion} className="px-5 bg-emerald-600 hover:bg-emerald-700 border-transparent focus:ring-emerald-500">
                  {procesandoRestauracion ? "Restaurando..." : "Sí, Restaurar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar Definitivamente (Peligro Extremo) */}
      {expedienteAEliminar && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-red-100">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-700">Peligro Extremo</h3>
                  <p className="text-sm text-red-600/70 font-mono mt-0.5">{expedienteAEliminar.numeroCaso}</p>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 mb-5">
                <p className="text-sm text-red-800 leading-relaxed font-medium">
                  Estás a punto de borrar definitivamente el expediente <strong>{expedienteAEliminar.titulo || expedienteAEliminar.numeroCaso}</strong>.
                </p>
                <p className="text-sm text-red-700 mt-2">
                  Esta acción es irreversible y borrará el registro principal de la base de datos (junto a datos vinculados, si están configurados en cascada).
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Escribe <span className="text-red-600 font-bold select-none">ELIMINAR</span> para confirmar
                </label>
                <input
                  type="text"
                  value={textoConfirmacion}
                  onChange={(e) => setTextoConfirmacion(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-colors font-mono uppercase"
                  placeholder="ELIMINAR"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => { setExpedienteAEliminar(null); setTextoConfirmacion(""); }} disabled={procesandoEliminacion} className="px-5">
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleEliminarDefinitivo} 
                  disabled={procesandoEliminacion || textoConfirmacion.trim().toUpperCase() !== "ELIMINAR"} 
                  className="px-5 bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white border-transparent disabled:bg-red-300 disabled:text-white/70"
                >
                  {procesandoEliminacion ? "Borrando..." : "Eliminar Definitivamente"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
