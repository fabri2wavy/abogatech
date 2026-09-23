"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { UserPlus, CheckCircle2, Users, Plus, User, Building2, AlertTriangle } from "lucide-react";
import { Cliente } from "@/domain/entities/Cliente";
import { obtenerClientes, crearCliente } from "@/infrastructure/repositories/clienteRepository";
import type { DatosNuevoCliente } from "@/infrastructure/repositories/clienteRepository";
import { Button } from "@/components/ui/Button";
import { ClienteForm, ClienteFormValues } from "@/components/clientes/ClienteForm";
import css from "./page.module.css";

/* ══════════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL: Clientes
   ══════════════════════════════════════════════════════════════ */
export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState(true);

  /* ── Modal state ────────────────────────────────────────────── */
  const [mostrarModal, setMostrarModal] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState("");

  /* ── Carga inicial ──────────────────────────────────────────── */
  useEffect(() => {
    async function cargar() {
      const data = await obtenerClientes();
      setClientes(data);
      setCargando(false);
    }
    cargar();
  }, []);

  /* ── Búsqueda (client-side) ──────────────────────────────────── */
  const [searchTerm, setSearchTerm] = useState("");

  const clientesFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return clientes;
    const termino = searchTerm.toLowerCase();
    return clientes.filter((c) =>
      c.nombreCompleto.toLowerCase().includes(termino) ||
      (c.email && c.email.toLowerCase().includes(termino)) ||
      (c.telefono && c.telefono.toLowerCase().includes(termino))
    );
  }, [clientes, searchTerm]);

  /* ── Helpers ────────────────────────────────────────────────── */
  const cerrarModal = () => {
    setFormError("");
    setMostrarModal(false);
  };

  /* ── Enviar al Backend ──────────────────────────────────────── */
  const handleGuardar = async (valores: ClienteFormValues) => {
    setGuardando(true);
    setFormError("");

    try {
      const emailFinal = valores.email?.trim() || `lead_${Date.now()}@temp.local`;

      const payload: DatosNuevoCliente = {
        ...valores,
        email: emailFinal,
        nombres: valores.nombres || "",
        apellidoPaterno: valores.apellidoPaterno || "",
        apellidoMaterno: valores.apellidoMaterno || "",
        nombreEmpresa: valores.nombreEmpresa || null,
        representanteLegal: valores.representanteLegal || null,
        areaEspecialidad: valores.areaEspecialidad || null,
      };

      const resultado = await crearCliente(payload);

      if (resultado.success && resultado.data) {
        setClientes([resultado.data, ...clientes]);
        cerrarModal();
      } else {
        setFormError(resultado.error || "Error desconocido al registrar el cliente.");
      }
    } catch (err: any) {
      setFormError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">

      {/* ── Cabecera ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Directorio de Clientes</h1>
          <p className="mt-1 text-sm text-gray-500">Gestión de personas registradas en la firma.</p>
        </div>
        <Button variant="primary" onClick={() => setMostrarModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* ── Barra de Búsqueda ─────────────────────────────────── */}
      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre, correo o teléfono..."
            className="w-full pl-11 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ── Tabla ───────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest">Nombre Completo</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest">Correo Electrónico</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest">Teléfono</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest">Estado</th>
                <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!cargando && clientesFiltrados.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md border ${c.tipoCliente === 'empresa' ? 'bg-purple-50/50 border-purple-100' : 'bg-gray-50 border-gray-100'}`}>
                        {c.tipoCliente === 'empresa' ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>
                      <span className="text-sm font-bold text-gray-900">{c.nombreCompleto}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">{c.email && !c.email.includes('@temp.local') ? c.email : "—"}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">{c.telefono || "—"}</td>
                  <td className="py-4 px-6">
                    <span className={`${css.badge} ${c.etapaComercial === 'potencial' ? css.badgePotencial : css.badgeActivo}`}>
                      {c.etapaComercial === 'potencial' ? 'Potencial' : 'Activo'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link href={`/dashboard/clientes/${c.id}`}>
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Ver Detalles</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MODAL: REGISTRAR NUEVO CLIENTEt
         ═══════════════════════════════════════════════════════════ */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="px-8 py-5 flex items-center justify-between border-b border-gray-100 shrink-0">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <UserPlus className="w-6 h-6 text-blue-600" />
                Registrar Nuevo Cliente
              </h3>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-gray-900">&times;</button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden min-h-0">
              <div className="px-8 py-6 overflow-y-auto flex-1" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                {formError && (
                  <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 flex gap-3 text-red-800 text-base font-medium">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                    {formError}
                  </div>
                )}

                <ClienteForm
                  onSubmit={handleGuardar}
                  onCancel={cerrarModal}
                  isSubmitting={guardando}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
