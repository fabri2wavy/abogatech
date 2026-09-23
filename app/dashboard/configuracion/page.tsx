"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Plus,
  Trash2,
  AlertTriangle,
  Loader2,
  Gavel,
  Scale,
  CalendarClock,
  ShieldX,
} from "lucide-react";
import type { ConfiguracionGlobal } from "@/domain/entities/ConfiguracionGlobal";
import {
  obtenerConfiguraciones,
  crearConfiguracion,
  eliminarConfiguracion,
} from "@/infrastructure/repositories/configuracionRepository";
import { obtenerPerfilActual } from "@/infrastructure/repositories/usuarioRepository";
import { ToastContainer, useToasts } from "@/components/ui/Toast";

/* ══════════════════════════════════════════════════════════════
   Categorías del sistema
   ══════════════════════════════════════════════════════════════ */

const CATEGORIAS = [
  {
    key: "materia",
    label: "Materias",
    description: "Áreas del derecho manejadas por el bufete.",
    icon: Scale,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    key: "juzgado",
    label: "Juzgados",
    description: "Órganos jurisdiccionales registrados.",
    icon: Gavel,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  {
    key: "tipo_evento",
    label: "Tipos de Evento",
    description: "Clasificaciones de eventos de la agenda.",
    icon: CalendarClock,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
] as const;

type CategoriaKey = (typeof CATEGORIAS)[number]["key"];

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: Skeleton de categoría
   ══════════════════════════════════════════════════════════════ */

function CategorySkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
      <div className="skeleton h-5 w-32 rounded" />
      <div className="skeleton h-3 w-48 rounded" />
      <div className="space-y-2 mt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="skeleton h-4 w-36 rounded" />
            <div className="skeleton h-6 w-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: Quick Add Form (Formulario inline)
   ══════════════════════════════════════════════════════════════ */

function QuickAddForm({
  categoria,
  existingValues,
  onAdded,
  onToast,
}: {
  categoria: CategoriaKey;
  existingValues: string[];
  onAdded: (item: ConfiguracionGlobal) => void;
  onToast: (v: "success" | "error", msg: string) => void;
}) {
  const [valor, setValor] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedValor = valor.trim();

    if (!trimmedValor) {
      onToast("error", "El valor no puede estar vacío.");
      return;
    }

    /* Validar duplicados localmente */
    if (
      existingValues.some(
        (v) => v.toLowerCase() === trimmedValor.toLowerCase()
      )
    ) {
      onToast("error", `"${trimmedValor}" ya existe en esta categoría.`);
      return;
    }

    setGuardando(true);

    const res = await crearConfiguracion({
      categoria,
      valor: trimmedValor,
      activo: true,
    });

    if (res.error) {
      onToast("error", res.error);
    } else if (res.data) {
      onAdded(res.data);
      onToast("success", `"${trimmedValor}" agregado exitosamente.`);
      setValor("");
    }

    setGuardando(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-3">
      <input
        type="text"
        placeholder="Agregar nuevo valor..."
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        disabled={guardando}
        className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50
                   focus:outline-none focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]
                   transition-all disabled:opacity-50 placeholder:text-gray-400"
      />
      <button
        type="submit"
        disabled={guardando || !valor.trim()}
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg
                   bg-[var(--color-gold)] text-white hover:bg-[var(--color-gold-dark)]
                   transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        title="Agregar"
      >
        {guardando ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </button>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: ConfigCategoryCard
   ══════════════════════════════════════════════════════════════ */

function ConfigCategoryCard({
  categoriaConfig,
  items,
  onAdded,
  onDeleted,
  onToast,
}: {
  categoriaConfig: (typeof CATEGORIAS)[number];
  items: ConfiguracionGlobal[];
  onAdded: (item: ConfiguracionGlobal) => void;
  onDeleted: (id: string) => void;
  onToast: (v: "success" | "error", msg: string) => void;
}) {
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);
  const Icon = categoriaConfig.icon;

  async function handleEliminar(item: ConfiguracionGlobal) {
    setEliminandoId(item.id);

    const res = await eliminarConfiguracion(item.id);

    if (res.error) {
      onToast("error", res.error);
    } else {
      onDeleted(item.id);
      onToast("success", `"${item.valor}" eliminado.`);
    }

    setEliminandoId(null);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg ${categoriaConfig.bgColor} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${categoriaConfig.color}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-gray-900">
            {categoriaConfig.label}
          </h3>
          <p className="text-xs text-gray-400">
            {categoriaConfig.description}
          </p>
        </div>
        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      {/* Value List */}
      <div className="px-5 py-3">
        {items.length === 0 ? (
          <p className="text-xs text-gray-400 italic py-2">
            No hay valores configurados.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-1.5 group"
              >
                <span className="text-sm text-gray-700">{item.valor}</span>
                <button
                  onClick={() => handleEliminar(item)}
                  disabled={eliminandoId === item.id}
                  className="w-6 h-6 inline-flex items-center justify-center rounded text-gray-300
                             hover:text-red-500 hover:bg-red-50 transition-colors
                             opacity-0 group-hover:opacity-100 focus:opacity-100
                             disabled:opacity-50"
                  title={`Eliminar "${item.valor}"`}
                >
                  {eliminandoId === item.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Quick Add */}
        <QuickAddForm
          categoria={categoriaConfig.key}
          existingValues={items.map((i) => i.valor)}
          onAdded={onAdded}
          onToast={onToast}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTE: Acceso Denegado
   ══════════════════════════════════════════════════════════════ */

function AccesoDenegado() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="mx-auto w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-5 border border-red-100">
        <ShieldX className="w-10 h-10 text-red-400" strokeWidth={1.2} />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">
        Acceso Denegado
      </h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm leading-relaxed">
        No tienes los permisos necesarios para acceder a la configuración del
        sistema. Esta sección es exclusiva para administradores.
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        className="px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-navy)] rounded-lg hover:bg-[var(--color-navy-light)] transition-colors"
      >
        Volver al Inicio
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PÁGINA PRINCIPAL: Configuración Global
   ══════════════════════════════════════════════════════════════ */

export default function ConfiguracionPage() {
  /* ── Estado ─────────────────────────────────────────────────── */
  const [verificando, setVerificando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabActiva, setTabActiva] = useState<CategoriaKey>("materia");

  /* Estado de datos particionado por categoría */
  const [datos, setDatos] = useState<Record<CategoriaKey, ConfiguracionGlobal[]>>({
    materia: [],
    juzgado: [],
    tipo_evento: [],
  });

  const { toasts, addToast, removeToast } = useToasts();

  /* ── Verificación de acceso + carga ─────────────────────────── */
  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setError(null);

    const res = await obtenerConfiguraciones();

    if (res.error) {
      setError(res.error);
    } else if (res.data) {
      const particionado: Record<CategoriaKey, ConfiguracionGlobal[]> = {
        materia: [],
        juzgado: [],
        tipo_evento: [],
      };

      for (const item of res.data) {
        const key = item.categoria as CategoriaKey;
        if (particionado[key]) {
          particionado[key].push(item);
        }
      }

      setDatos(particionado);
    }

    setCargando(false);
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function init() {
      const perfil = await obtenerPerfilActual();

      if (cancelado) return;

      if (!perfil || perfil.rol !== "admin") {
        setAutorizado(false);
        setVerificando(false);
        return;
      }

      setAutorizado(true);
      setVerificando(false);
      await cargarDatos();
    }

    init();
    return () => {
      cancelado = true;
    };
  }, [cargarDatos]);

  /* ── Optimistic Handlers ────────────────────────────────────── */
  function handleAdded(categoria: CategoriaKey, item: ConfiguracionGlobal) {
    setDatos((prev) => ({
      ...prev,
      [categoria]: [...prev[categoria], item],
    }));
  }

  function handleDeleted(categoria: CategoriaKey, id: string) {
    setDatos((prev) => ({
      ...prev,
      [categoria]: prev[categoria].filter((i) => i.id !== id),
    }));
  }

  /* ── Guard: verificando acceso ──────────────────────────────── */
  if (verificando) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-gold)]" />
        <p className="mt-4 text-[var(--color-text-muted)]">
          Verificando permisos...
        </p>
      </div>
    );
  }

  if (!autorizado) {
    return <AccesoDenegado />;
  }

  /* ── Categoría activa ───────────────────────────────────────── */
  const categoriaActiva = CATEGORIAS.find((c) => c.key === tabActiva)!;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-[var(--color-gold)]" />
          Configuración Global
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Gestiona los parámetros y diccionarios dinámicos del sistema.
        </p>
      </div>

      {/* ── Tabs ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {CATEGORIAS.map((cat) => {
          const isActive = tabActiva === cat.key;
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => setTabActiva(cat.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? cat.color : ""}`} />
              {cat.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-gray-100 text-gray-600"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {datos[cat.key].length}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Error ─────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex gap-3 text-red-800 text-sm font-medium">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* ── Content: Tab Activa ────────────────────────────────── */}
      {cargando ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <CategorySkeleton />
          <CategorySkeleton />
          <CategorySkeleton />
        </div>
      ) : (
        <ConfigCategoryCard
          categoriaConfig={categoriaActiva}
          items={datos[tabActiva]}
          onAdded={(item) => handleAdded(tabActiva, item)}
          onDeleted={(id) => handleDeleted(tabActiva, id)}
          onToast={addToast}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
