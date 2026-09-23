import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import Link from 'next/link';

import {
  obtenerKpisFinancieros,
  obtenerCargaLaboralPorAbogado,
  obtenerDistribucionCasos,
} from '@/infrastructure/repositories/reportesRepository';

import ReportesView from '@/components/reportes/ReportesView';

/* ══════════════════════════════════════════════════════════════
   Empty State de Seguridad (RBAC)
   ══════════════════════════════════════════════════════════════ */
function AccesoDenegadoState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <Lock className="w-16 h-16 text-red-500" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Acceso Denegado</h2>
      <p className="text-slate-600 mb-8 mt-2 text-center max-w-md">
        Esta vista es exclusiva para la Dirección.
      </p>
      <Link 
        href="/dashboard"
        className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Server Component Orquestador
   ══════════════════════════════════════════════════════════════ */
export default async function ReportesPage() {
  /* 
     Ejecutamos en paralelo para optimizar TTI (Time to Interactive).
     Si alguna falla por RBAC, las otras también lo harán (todas verifican `admin`).
  */
  const [kpisResponse, cargaResponse, distribucionResponse] = await Promise.all([
    obtenerKpisFinancieros(),
    obtenerCargaLaboralPorAbogado(),
    obtenerDistribucionCasos(),
  ]);

  // Si cualquiera de las peticiones retorna un error (como `No autorizado`), bloqueamos.
  const hayErrorDeAcceso = 
    kpisResponse.error || 
    cargaResponse.error || 
    distribucionResponse.error;

  if (hayErrorDeAcceso) {
    return <AccesoDenegadoState />;
  }

  // Fallbacks defensivos si las props llegan en nulo de alguna manera atípica
  const kpis = kpisResponse.data ?? { totalFacturado: 0, totalCobrado: 0, totalEnMora: 0 };
  const cargaLaboral = cargaResponse.data ?? [];
  const distribucionCasos = distribucionResponse.data ?? [];

  return (
    <div className="flex flex-col space-y-4">
      <div className="px-6 pt-6">
        <h1 className="text-2xl font-bold text-slate-900">Inteligencia de Negocios</h1>
        <p className="text-sm text-slate-500 mt-1">Panel de control gerencial y analítica legal.</p>
      </div>

      <ReportesView 
        kpis={kpis}
        cargaLaboral={cargaLaboral}
        distribucionCasos={distribucionCasos}
      />
    </div>
  );
}
