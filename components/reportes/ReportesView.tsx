'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { DollarSign, Pickaxe, AlertCircle } from 'lucide-react';

import type { KpisFinancieros, CargaAbogado, DistribucionMateria } from '@/domain/entities/Reportes';

interface ReportesViewProps {
  kpis: KpisFinancieros;
  cargaLaboral: CargaAbogado[];
  distribucionCasos: DistribucionMateria[];
}

/* ══════════════════════════════════════════════════════════════
   Configuración de Recharts y UI
   ══════════════════════════════════════════════════════════════ */

const COLORS_MATERIAS = ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'];
const COLOR_PRIMARY = '#0ea5e9'; // Tailwind sky-500 para las barras

const formatearMoneda = (monto: number) => {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
  }).format(monto);
};

/* ══════════════════════════════════════════════════════════════
   Subcomponente: KpiCard
   ══════════════════════════════════════════════════════════════ */

interface KpiCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  isAlert?: boolean;
}

function KpiCard({ title, value, icon: Icon, isAlert = false }: KpiCardProps) {
  const containerClasses = `border border-gray-200 bg-white shadow-sm rounded-xl p-6 flex items-center justify-between transition-colors ${
    isAlert ? 'bg-red-50 border-red-100' : ''
  }`;

  const valueClasses = `text-3xl font-bold mt-2 ${
    isAlert ? 'text-red-700' : 'text-slate-900'
  }`;

  const iconContainerClasses = `p-3 rounded-xl ${
    isAlert ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
  }`;

  return (
    <div className={containerClasses}>
      <div>
        <p className={`text-sm font-medium ${isAlert ? 'text-red-600' : 'text-slate-500'}`}>
          {title}
        </p>
        <p className={valueClasses}>{formatearMoneda(value)}</p>
      </div>
      <div className={iconContainerClasses}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main Component: ReportesView
   ══════════════════════════════════════════════════════════════ */

export default function ReportesView({ kpis, cargaLaboral, distribucionCasos }: ReportesViewProps) {
  return (
    // Agregamos pb-10 o similar para asegurar espacio de sobra abajo
    <div className="grid gap-6 p-6">
      {/* ── Fila Superior: KPIs Financieros ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Total Facturado"
          value={kpis.totalFacturado}
          icon={DollarSign}
        />
        <KpiCard
          title="Total Cobrado"
          value={kpis.totalCobrado}
          icon={Pickaxe}
        />
        <KpiCard
          title="Total en Mora"
          value={kpis.totalEnMora}
          icon={AlertCircle}
          isAlert={true}
        />
      </div>

      {/* ── Fila Inferior: Gráficos ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico 1: Carga Laboral por Abogado (Barras) */}
        <div className="border border-gray-200 bg-white rounded-xl shadow-sm p-6 min-h-[350px] flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Carga Laboral por Abogado</h3>
          
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
            {cargaLaboral.length === 0 ? (
              <p className="text-slate-500 text-sm text-center">No hay datos suficientes para generar esta gráfica.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cargaLaboral} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="abogado" type="category" width={100} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }} 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="casosActivos" fill={COLOR_PRIMARY} radius={[0, 4, 4, 0]} barSize={24} name="Casos Activos" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Gráfico 2: Distribución por Materia (Doughnut) */}
        <div className="border border-gray-200 bg-white rounded-xl shadow-sm p-6 min-h-[350px] flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Distribución de Casos por Materia</h3>
          
          <div className="flex-1 flex items-center justify-center min-h-[250px]">
            {distribucionCasos.length === 0 ? (
              <p className="text-slate-500 text-sm text-center">No hay datos suficientes para generar esta gráfica.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribucionCasos}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="cantidad"
                    nameKey="materia"
                  >
                    {distribucionCasos.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS_MATERIAS[index % COLORS_MATERIAS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }}/>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
