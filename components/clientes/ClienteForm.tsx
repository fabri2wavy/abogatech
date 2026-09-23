"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Building2, CheckCircle2, UserPlus, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import css from "@/app/dashboard/clientes/page.module.css";

const DEPARTAMENTOS = [
  { value: "LP", label: "La Paz" },
  { value: "SCZ", label: "Santa Cruz" },
  { value: "CBBA", label: "Cochabamba" },
  { value: "OR", label: "Oruro" },
  { value: "PT", label: "Potosí" },
  { value: "TJ", label: "Tarija" },
  { value: "CH", label: "Chuquisaca" },
  { value: "BE", label: "Beni" },
  { value: "PD", label: "Pando" },
];

const ESTADOS_CIVILES = [
  { value: "Soltero/a", label: "Soltero/a" },
  { value: "Casado/a", label: "Casado/a" },
  { value: "Divorciado/a", label: "Divorciado/a" },
  { value: "Viudo/a", label: "Viudo/a" },
];

/* ── Zod Schema ──────────────────────────────────────────────── */
export const clienteSchema = z.object({
  tipoCliente: z.enum(['persona', 'empresa']),
  etapaComercial: z.enum(['potencial', 'activo']),

  nombres: z.string().optional(),
  apellidoPaterno: z.string().optional(),
  apellidoMaterno: z.string().optional(),

  nombreEmpresa: z.string().optional(),
  representanteLegal: z.string().optional(),
  nit: z.string().optional(),

  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  telefono: z.string().min(1, "El teléfono es requerido"),
  direccion: z.string().optional(),
  areaEspecialidad: z.string().optional(),

  ci: z.string().optional(),
  expedido: z.string().optional(),

  estadoCivil: z.string().optional(),
  profesion: z.string().optional(),
  nacionalidad: z.string().optional(),
  fechaNacimiento: z.string().optional(),

  referidoPor: z.string().optional(),
  contactoReferidor: z.string().optional(),

  telefonoLaboral: z.string().optional(),
  direccionOficina: z.string().optional(),
  abogadoContacto: z.string().optional(),
}).superRefine((data, ctx) => {
  const isPersona = data.tipoCliente === 'persona';
  const isEmpresa = data.tipoCliente === 'empresa';
  const isActivo = data.etapaComercial === 'activo';
  const isPotencial = data.etapaComercial === 'potencial';

  // Nombres/Apellidos
  if (isPersona) {
    if (!data.nombres?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Los nombres son requeridos", path: ["nombres"] });
    if (!data.apellidoPaterno?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El apellido paterno es requerido", path: ["apellidoPaterno"] });
  }

  // Empresa
  if (isEmpresa) {
    if (!data.nombreEmpresa?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La razón social o nombre de empresa es requerido", path: ["nombreEmpresa"] });
    if (!data.representanteLegal?.trim()) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El representante legal es requerido", path: ["representanteLegal"] });
  }

  // Email
  if (isActivo && !data.email?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El email es requerido para clientes activos", path: ["email"] });
  }

  // Direccion
  if (isActivo || (isEmpresa && isPotencial)) {
    if (!data.direccion?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La dirección es requerida", path: ["direccion"] });
    }
  }

  // Area Especialidad
  if (isPotencial) {
    if (!data.areaEspecialidad?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El área o especialidad es requerida para potenciales", path: ["areaEspecialidad"] });
    }
  }

  // CI
  if (isPersona && isActivo) {
    if (!data.ci?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El CI es requerido para personas activas", path: ["ci"] });
    }
  }
});

export type ClienteFormValues = z.infer<typeof clienteSchema>;

/* ── Props ───────────────────────────────────────────────────── */
export interface ClienteFormProps {
  defaultValues?: Partial<ClienteFormValues>;
  onSubmit: (values: ClienteFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

/* ── Primitive helpers ───────────────────────────────────────── */
function Label({ children, req }: { children: React.ReactNode; req?: boolean }) {
  return (
    <label className="text-base font-semibold text-gray-900 block mb-1.5">
      {children}{req && <span className="text-rose-500 ml-0.5">*</span>}
    </label>
  );
}

function FErr({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className={css.fieldError + " flex items-center gap-1"}>
      <AlertTriangle className="w-3 h-3 flex-shrink-0" />{msg}
    </p>
  );
}

const inp = "w-full text-base lg:text-lg px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-500";
const sel = "w-full text-base lg:text-lg px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50/50 appearance-none cursor-pointer disabled:bg-gray-100 disabled:text-gray-500";

/* ── Component ───────────────────────────────────────────────── */
export function ClienteForm({ defaultValues, onSubmit, onCancel, isSubmitting }: ClienteFormProps) {
  const [mostrarExtra, setMostrarExtra] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      tipoCliente: "persona",
      etapaComercial: "potencial",
      nacionalidad: "Boliviana",
      ...defaultValues,
    },
  });

  const tipoCliente = watch("tipoCliente");
  const etapaComercial = watch("etapaComercial");

  const isPersona = tipoCliente === 'persona';
  const isEmpresa = tipoCliente === 'empresa';
  const isActivo = etapaComercial === 'activo';
  const isPotencial = etapaComercial === 'potencial';

  useEffect(() => {
    if (!isPersona) {
      setValue("nombres", "");
      setValue("apellidoPaterno", "");
      setValue("apellidoMaterno", "");
    }
    if (!isEmpresa) {
      setValue("nombreEmpresa", "");
      setValue("representanteLegal", "");
      setValue("nit", "");
    }
    if (!isActivo) {
      setValue("email", "");
      setValue("referidoPor", "");
      setValue("contactoReferidor", "");
      setValue("telefonoLaboral", "");
      setValue("direccionOficina", "");
    }
    if (!(isActivo || (isEmpresa && isPotencial))) {
      setValue("direccion", "");
    }
    if (!isPotencial) {
      setValue("areaEspecialidad", "");
    }
    if (!(isPersona && isActivo)) {
      setValue("ci", "");
      setValue("expedido", "");
      setValue("fechaNacimiento", "");
      setValue("nacionalidad", "");
      setValue("estadoCivil", "");
      setValue("profesion", "");
    }
  }, [isPersona, isEmpresa, isActivo, isPotencial, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* ── SELECCIÓN DE TIPO Y ETAPA ── */}
      <div className={css.stepGrid}>
        <div className="space-y-2 md:col-span-2">
          <Label req>Tipo de Cliente</Label>
          <div className={css.radioCardGroup}>
            <label className={`${css.radioCard} ${isPersona ? css.selected : ''}`}>
              <input
                type="radio"
                value="persona"
                {...register("tipoCliente")}
                className={css.radioCardInput}
              />
              <div className={css.radioCardIcon}>
                <User className="w-5 h-5" />
              </div>
              <span className={css.radioCardLabel}>Persona Natural</span>
              <span className={css.radioCardHint}>Cliente individual, persona física</span>
            </label>
            <label className={`${css.radioCard} ${isEmpresa ? css.selected : ''}`}>
              <input
                type="radio"
                value="empresa"
                {...register("tipoCliente")}
                className={css.radioCardInput}
              />
              <div className={css.radioCardIcon}>
                <Building2 className="w-5 h-5" />
              </div>
              <span className={css.radioCardLabel}>Empresa / Persona Jurídica</span>
              <span className={css.radioCardHint}>Sociedad, fundación o entidad legal</span>
            </label>
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label req>Etapa Comercial</Label>
          <div className={css.etapaPillGroup}>
            <button
              type="button"
              className={`${css.etapaPill} ${isActivo ? css.activoPill : ''}`}
              onClick={() => setValue('etapaComercial', 'activo', { shouldValidate: true })}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Cliente Activo
            </button>
            <button
              type="button"
              className={`${css.etapaPill} ${isPotencial ? css.potencialPill : ''}`}
              onClick={() => setValue('etapaComercial', 'potencial', { shouldValidate: true })}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Cliente Potencial
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-4" />

      {/* ── DATOS PRINCIPALES ── */}
      <div className={css.stepGrid}>

        {/* Renderizado Condicional: Persona */}
        {isPersona && (
          <div className={css.conditionalFields} style={{ display: 'contents' }}>
            <div className="space-y-2 md:col-span-2">
              <Label req>Nombres</Label>
              <input type="text" placeholder="Ej. María Elena" className={`${inp} ${errors.nombres ? css.inputError : ''}`} {...register("nombres")} />
              <FErr msg={errors.nombres?.message} />
            </div>
            <div className="space-y-2">
              <Label req>Apellido Paterno</Label>
              <input type="text" placeholder="Ej. García" className={`${inp} ${errors.apellidoPaterno ? css.inputError : ''}`} {...register("apellidoPaterno")} />
              <FErr msg={errors.apellidoPaterno?.message} />
            </div>
            <div className="space-y-2">
              <Label>Apellido Materno</Label>
              <input type="text" placeholder="Ej. Soliz" className={inp} {...register("apellidoMaterno")} />
            </div>
          </div>
        )}

        {/* Renderizado Condicional: Empresa */}
        {isEmpresa && (
          <div className={css.conditionalFields} style={{ display: 'contents' }}>
            <div className="space-y-2 md:col-span-2">
              <Label req>Nombre / Razón Social de Empresa</Label>
              <input type="text" placeholder="Ej. Grupo XYZ S.A." className={`${inp} ${errors.nombreEmpresa ? css.inputError : ''}`} {...register("nombreEmpresa")} />
              <FErr msg={errors.nombreEmpresa?.message} />
            </div>
            <div className="space-y-2">
              <Label>NIT</Label>
              <input type="text" placeholder="Ej. 1234567890" className={inp} {...register("nit")} />
            </div>
            <div className="space-y-2">
              <Label req>Representante Legal</Label>
              <input type="text" placeholder="Ej. Juan Pérez" className={`${inp} ${errors.representanteLegal ? css.inputError : ''}`} {...register("representanteLegal")} />
              <FErr msg={errors.representanteLegal?.message} />
            </div>
          </div>
        )}

        {/* Datos de Contacto */}
        <div className="space-y-2">
          <Label req={isActivo}>Correo Electrónico</Label>
          <input type="email" placeholder="Ej. correo@ejemplo.com" className={`${inp} ${errors.email ? css.inputError : ''}`} {...register("email")} />
          <FErr msg={errors.email?.message} />
        </div>

        <div className="space-y-2">
          <Label req>Teléfono / Celular</Label>
          <input type="tel" placeholder="Ej. 70012345" className={`${inp} ${errors.telefono ? css.inputError : ''}`} {...register("telefono")} />
          <FErr msg={errors.telefono?.message} />
        </div>

        {(isActivo || (isEmpresa && isPotencial)) && (
          <div className="space-y-2 md:col-span-2">
            <Label req>Dirección de Domicilio / Oficina Principal</Label>
            <textarea rows={2} placeholder="Ej. Av. Arce #2560" className={`${inp} resize-none ${errors.direccion ? css.inputError : ''}`} {...register("direccion")} />
            <FErr msg={errors.direccion?.message} />
          </div>
        )}

        {isPotencial && (
          <div className="space-y-2 md:col-span-2">
            <Label req>Área / Especialidad</Label>
            <input type="text" placeholder="Ej. Minería, Comercio, Penal" className={`${inp} ${errors.areaEspecialidad ? css.inputError : ''}`} {...register("areaEspecialidad")} />
            <FErr msg={errors.areaEspecialidad?.message} />
          </div>
        )}

      </div>

      {/* Renderizado Condicional: Generales de Ley (Solo Persona + Activo) */}
      {isPersona && isActivo && (
        <>
          <div className="border-t border-gray-200 my-4" />
          <div className={css.stepGrid}>
            <div className="space-y-2">
              <Label req>Cédula de Identidad</Label>
              <input type="text" placeholder="Ej. 12345678" className={`${inp} ${errors.ci ? css.inputError : ''}`} {...register("ci")} />
              <FErr msg={errors.ci?.message} />
            </div>
            <div className="space-y-2">
              <Label>Expedido</Label>
              <select className={sel} {...register("expedido")}>
                <option value="">Seleccione</option>
                {DEPARTAMENTOS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Fecha de Nacimiento</Label>
              <input type="date" className={inp} {...register("fechaNacimiento")} />
            </div>
            <div className="space-y-2">
              <Label>Nacionalidad</Label>
              <input type="text" className={inp} {...register("nacionalidad")} />
            </div>
            <div className="space-y-2">
              <Label>Estado Civil</Label>
              <select className={sel} {...register("estadoCivil")}>
                <option value="">Seleccione</option>
                {ESTADOS_CIVILES.map(ec => <option key={ec.value} value={ec.value}>{ec.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Profesión / Ocupación</Label>
              <input type="text" className={inp} {...register("profesion")} />
            </div>
          </div>
        </>
      )}

      {/* ── ACORDEÓN DE INFORMACIÓN ADICIONAL ── */}
      {isActivo && (
        <div className="border-t border-gray-200 mt-6 pt-6">
          <button
            type="button"
            onClick={() => setMostrarExtra(!mostrarExtra)}
            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors focus:outline-none"
          >
            {mostrarExtra ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            + Información adicional (opcional)
          </button>

          {mostrarExtra && (
            <div className="mt-4 space-y-6 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className={css.stepGrid}>
                <div className="space-y-2">
                  <Label>Referido por</Label>
                  <input type="text" className={inp} {...register("referidoPor")} />
                </div>
                <div className="space-y-2">
                  <Label>Contacto del Referidor</Label>
                  <input type="text" className={inp} {...register("contactoReferidor")} />
                </div>

                <div className="space-y-2">
                  <Label>Teléfono Laboral (Alternativo)</Label>
                  <input type="tel" className={inp} {...register("telefonoLaboral")} />
                </div>
                <div className="space-y-2">
                  <Label>Dirección de Oficina (Alternativa)</Label>
                  <input type="text" className={inp} {...register("direccionOficina")} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── FOOTER ACTIONS ── */}
      <div className="pt-6 mt-6 border-t border-gray-200 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center justify-center min-w-[160px]"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
              Guardar Cliente
            </>
          )}
        </button>
      </div>
    </form>
  );
}
