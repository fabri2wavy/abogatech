"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShieldAlert, Gavel, Hash, AlertTriangle } from "lucide-react";
import type { ConfiguracionGlobal } from "@/domain/entities/ConfiguracionGlobal";
import type { UsuarioPerfil } from "@/domain/entities/UsuarioPerfil";

/* ── Flujo Legal ─────────────────────────────────────────────── */
export const FLUJO_LEGAL: Record<string, string[]> = {
  Civil: ["Etapa preliminar","Conciliación","Demanda presentada","En etapa probatoria","Con sentencia","En apelación","En ejecución","Concluido","Archivado"],
  Penal: ["Etapa Preliminar","Etapa Preparatoria","Juicio","Apelación","Casación","Ejecución Penal"],
  Familia: ["Estudio del caso","Demanda presentada","En conciliación","En audiencia","En etapa probatoria","Con sentencia","En ejecución","Concluido","Archivado"],
  Laboral: ["Estudio del caso","Demanda presentada","En conciliación","En audiencia","Con sentencia","En ejecución","Concluido","Archivado"],
  Comercial: ["Estudio del caso","Demanda presentada","En conciliación","En audiencia","Con sentencia","En ejecución","Concluido","Archivado"],
  "Trámites administrativos": ["Estudio del caso","Trámite presentado","En revisión","En observación","En aprobación","En firma","Aprobado","Rechazado","Concluido"],
  Otros: [],
};
export const MATERIAS_BASE = Object.keys(FLUJO_LEGAL);

/* ── Zod Schema ──────────────────────────────────────────────── */
const expedienteSchema = z.object({
  clienteId:            z.string().min(1, "Seleccione un cliente."),
  abogado_id:           z.string().min(1, "Seleccione un abogado responsable."),
  numeroCaso:           z.string().min(1, "El número de caso es obligatorio."),
  titulo:               z.string().min(1, "La síntesis del caso es obligatoria."),
  juzgado:              z.string().min(1, "El juzgado es obligatorio."),
  parteContraria:       z.string().min(1, "La parte contraria es obligatoria."),
  materia:              z.string().min(1, "Seleccione la materia."),
  etapaProcesal:        z.string().optional(),
  rolCliente:           z.string().optional(),
  tipoProceso:          z.string().optional(),
  nurej:                z.string().optional(),
  numeroFiscalia:       z.string().optional(),
  numeroFelcc:          z.string().optional(),
  juezActual:           z.string().optional(),
  secretarioActuario:   z.string().optional(),
  fiscalActual:         z.string().optional(),
  investigadorAsignado: z.string().optional(),
  informeDespacho:      z.string().optional(),
  informeCliente:       z.string().optional(),
  cuantia:              z.string().optional(),
  oficiosSolicitados:   z.string().optional(),
  medidasPreviasRemate: z.string().optional(),
});
export type ExpedienteFormValues = z.infer<typeof expedienteSchema>;

/* ── Props ───────────────────────────────────────────────────── */
export interface ExpedienteFormProps {
  formId: string;
  defaultValues?: Partial<ExpedienteFormValues>;
  listaClientes: { id: string; nombreCompleto: string }[];
  listaAbogados: { id: string; nombre_completo: string }[];
  juzgadosDB: ConfiguracionGlobal[];
  materiasDB: ConfiguracionGlobal[];
  perfilActual: UsuarioPerfil | null;
  isLoading: boolean;
  onSubmit: (values: ExpedienteFormValues) => Promise<void>;
}

/* ── Primitive helpers ───────────────────────────────────────── */
function Label({ children, req }: { children: React.ReactNode; req?: boolean }) {
  return (
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
      {children}{req && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
  );
}
function FErr({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
      <AlertTriangle className="w-3 h-3 flex-shrink-0" />{msg}
    </p>
  );
}
const inp = "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-150 disabled:bg-slate-50";
const sel = "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-150 appearance-none cursor-pointer";

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4 pb-2 border-b border-slate-100">
      {children}
    </h4>
  );
}

/* ── Component ───────────────────────────────────────────────── */
export function ExpedienteForm({
  formId, defaultValues, listaClientes, listaAbogados,
  juzgadosDB, materiasDB, perfilActual, isLoading, onSubmit,
}: ExpedienteFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<ExpedienteFormValues>({
      resolver: zodResolver(expedienteSchema),
      defaultValues: {
        materia: "Civil",
        etapaProcesal: FLUJO_LEGAL["Civil"][0],
        informeDespacho: "Caso iniciado en plataforma corporativa.",
        informeCliente: "Su expediente ha sido ingresado al sistema de seguimiento legal.",
        ...defaultValues,
      },
    });

  const materia = watch("materia");
  const esPenal = materia === "Penal";
  const mostrarCuantia = ["Civil", "Comercial", "Laboral"].includes(materia);

  /* Auto-assign abogado */
  useEffect(() => {
    if (perfilActual?.rol === "abogado") setValue("abogado_id", perfilActual.id);
  }, [perfilActual, setValue]);

  /* Reset etapa + clear stale penal fields on materia change */
  useEffect(() => {
    setValue("etapaProcesal", FLUJO_LEGAL[materia]?.[0] ?? "");
    if (!esPenal) {
      (["numeroFiscalia","numeroFelcc","fiscalActual","investigadorAsignado"] as const)
        .forEach(f => setValue(f, ""));
    }
    if (!["Civil", "Comercial", "Laboral"].includes(materia)) {
      setValue("cuantia", "");
    }
  }, [materia, esPenal, setValue]);

  const todasMaterias = [
    ...MATERIAS_BASE,
    ...materiasDB.filter(m => !MATERIAS_BASE.includes(m.valor)).map(m => m.valor),
  ];
  const etapas = FLUJO_LEGAL[materia] ?? [];

  return (
    <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

      {/* SECCIÓN 1: Sujetos */}
      <section>
        <SectionHead>Sujetos del proceso</SectionHead>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <Label req>Cliente Patrocinado</Label>
            {listaClientes.length === 0
              ? <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 text-sm"><ShieldAlert className="w-4 h-4 flex-shrink-0"/>No hay clientes registrados.</div>
              : <select {...register("clienteId")} className={sel} disabled={isLoading}>
                  <option value="">Seleccione un cliente...</option>
                  {listaClientes.map(c => <option key={c.id} value={c.id}>{c.nombreCompleto}</option>)}
                </select>
            }
            <FErr msg={errors.clienteId?.message} />
          </div>

          <div>
            <Label req>Abogado Responsable</Label>
            {perfilActual?.rol === "abogado"
              ? <input type="text" readOnly disabled value={perfilActual.nombre_completo} className={inp} />
              : <select {...register("abogado_id")} className={sel} disabled={isLoading}>
                  <option value="">Seleccione un abogado...</option>
                  {listaAbogados.map(a => <option key={a.id} value={a.id}>{a.nombre_completo}</option>)}
                </select>
            }
            <FErr msg={errors.abogado_id?.message} />
          </div>

          <div className="md:col-span-2">
            <Label req>Parte Contraria</Label>
            <input {...register("parteContraria")} type="text" placeholder="Ej: Empresa XYZ S.R.L. / Juan Pérez" className={inp} disabled={isLoading} />
            <FErr msg={errors.parteContraria?.message} />
          </div>

          <div>
            <Label>Rol del Cliente</Label>
            <select {...register("rolCliente")} className={sel} disabled={isLoading}>
              <option value="">Sin especificar</option>
              {["Demandante","Demandado","Imputado","Víctima","Querellante","Tercero interesado"].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <Label>Tipo de Proceso</Label>
            <select {...register("tipoProceso")} className={sel} disabled={isLoading}>
              <option value="">Sin especificar</option>
              {["Oral","Escrito","Extraordinario","Ejecutivo"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: Identificación */}
      <section>
        <SectionHead>Identificación del caso</SectionHead>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <Label req>Nº Control Interno</Label>
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input {...register("numeroCaso")} type="text" placeholder="2025-..." className={`${inp} pl-9`} disabled={isLoading} />
            </div>
            <FErr msg={errors.numeroCaso?.message} />
          </div>

          <div>
            <Label>NUREJ Judicial</Label>
            <input {...register("nurej")} type="text" placeholder="Número único del poder judicial" className={inp} disabled={isLoading} />
          </div>

          <div>
            <Label req>Juzgado</Label>
            <div className="relative">
              <Gavel className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {juzgadosDB.length > 0
                ? <select {...register("juzgado")} className={`${sel} pl-9`} disabled={isLoading}>
                    <option value="">Seleccione un juzgado...</option>
                    {juzgadosDB.map(j => <option key={j.id} value={j.valor}>{j.valor}</option>)}
                  </select>
                : <input {...register("juzgado")} type="text" placeholder="Ej. 3ro Civil de la Capital" className={`${inp} pl-9`} disabled={isLoading} />
              }
            </div>
            <FErr msg={errors.juzgado?.message} />
          </div>

          <div>
            <Label req>Síntesis del Caso (Título)</Label>
            <input {...register("titulo")} type="text" placeholder="Ej. Demanda por resolución de contrato..." className={inp} disabled={isLoading} />
            <FErr msg={errors.titulo?.message} />
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: Clasificación Legal */}
      <section>
        <SectionHead>Clasificación legal y flujo procesal</SectionHead>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <Label req>Materia</Label>
            <select {...register("materia")} className={sel} disabled={isLoading}>
              {todasMaterias.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <FErr msg={errors.materia?.message} />
          </div>

          <div>
            <Label>Etapa Procesal</Label>
            {etapas.length > 0
              ? <select {...register("etapaProcesal")} className={sel} disabled={isLoading}>
                  {etapas.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              : <input {...register("etapaProcesal")} type="text" placeholder="Especifique la etapa..." className={inp} disabled={isLoading} />
            }
          </div>

          <div>
            <Label>Juez / Tribunal Actual</Label>
            <input {...register("juezActual")} type="text" placeholder="Nombre del juez a cargo" className={inp} disabled={isLoading} />
          </div>

          <div>
            <Label>Secretario Actuario</Label>
            <input {...register("secretarioActuario")} type="text" placeholder="Nombre del secretario actuario" className={inp} disabled={isLoading} />
          </div>
        </div>

        {/* Cuantía condicional (Civil, Comercial, Laboral) */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${mostrarCuantia ? "max-h-[120px] opacity-100 mt-4" : "max-h-0 opacity-0 pointer-events-none"}`}>
          <div>
            <Label>Cuantía (Bs.)</Label>
            <input {...register("cuantia")} type="text" placeholder="Ej. 150.000,00" className={inp} disabled={isLoading} />
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: Bloque Penal (condicional) */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${esPenal ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
        <section className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-4 pb-2 border-b border-slate-200 flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            Datos específicos — Proceso Penal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>N° Fiscalía</Label>
              <input {...register("numeroFiscalia")} type="text" placeholder="Número asignado por la Fiscalía" className={inp} disabled={isLoading} />
            </div>
            <div>
              <Label>N° FELCC</Label>
              <input {...register("numeroFelcc")} type="text" placeholder="Número registrado en la FELCC" className={inp} disabled={isLoading} />
            </div>
            <div>
              <Label>Fiscal Asignado</Label>
              <input {...register("fiscalActual")} type="text" placeholder="Nombre del Fiscal de Materia" className={inp} disabled={isLoading} />
            </div>
            <div>
              <Label>Investigador FELCC</Label>
              <input {...register("investigadorAsignado")} type="text" placeholder="Nombre del investigador asignado" className={inp} disabled={isLoading} />
            </div>
          </div>
        </section>
      </div>

      {/* SECCIÓN 5: Informes y Control Adicional */}
      <section>
        <SectionHead>Informes y control de oficios (Opcionales)</SectionHead>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Oficios Solicitados / Entregados</Label>
            <textarea {...register("oficiosSolicitados")} rows={2} placeholder="Registro de oficios..." className={`${inp} resize-none`} disabled={isLoading} />
          </div>
          <div>
            <Label>Medidas previas al remate</Label>
            <textarea {...register("medidasPreviasRemate")} rows={2} placeholder="Detalle de medidas..." className={`${inp} resize-none`} disabled={isLoading} />
          </div>
          <div>
            <Label>Informe Despacho</Label>
            <textarea {...register("informeDespacho")} rows={3} className={`${inp} resize-none`} disabled={isLoading} />
          </div>
          <div>
            <Label>Informe Cliente</Label>
            <textarea {...register("informeCliente")} rows={3} className={`${inp} resize-none`} disabled={isLoading} />
          </div>
        </div>
      </section>
    </form>
  );
}
