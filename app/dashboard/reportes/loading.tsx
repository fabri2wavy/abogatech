import React from 'react';

export default function LoadingReportes() {
  return (
    <div className="grid gap-6 p-6">
      {/* ── Fila Superior: KPIs (Skeleton) ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 bg-white shadow-sm rounded-xl p-6 flex items-center justify-between">
            <div className="space-y-4">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>

      {/* ── Fila Inferior: Gráficos (Skeleton) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="border border-gray-200 bg-white rounded-xl shadow-sm p-6 min-h-[350px] flex flex-col">
          <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-6" />
          <div className="flex-1 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>

        <div className="border border-gray-200 bg-white rounded-xl shadow-sm p-6 min-h-[350px] flex flex-col">
          <div className="h-6 w-56 bg-slate-200 rounded animate-pulse mb-6" />
          <div className="flex-1 w-full flex items-center justify-center bg-slate-50/50 rounded-lg animate-pulse">
            {/* Círculo interior simulando un donut skeleton */}
            <div className="w-48 h-48 rounded-full border-8 border-slate-200 bg-transparent flex items-center justify-center" />
          </div>
        </div>

      </div>
    </div>
  );
}
