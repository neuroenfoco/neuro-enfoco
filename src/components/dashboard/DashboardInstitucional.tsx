"use client";

import { DashboardActividadReciente } from "@/components/dashboard/DashboardActividadReciente";
import { DashboardAlertasPanel } from "@/components/dashboard/DashboardAlertasPanel";
import { DashboardBarrerasApoyosCard } from "@/components/dashboard/DashboardBarrerasApoyosCard";
import { DashboardIndicadoresCard } from "@/components/dashboard/DashboardIndicadoresCard";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import { getDashboardView, type DashboardView } from "@/lib/dashboard/dashboard-view";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export function DashboardInstitucional() {
  const [view, setView] = useState<DashboardView | null>(null);

  const refresh = useCallback(() => {
    setView(getDashboardView());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  if (!view) {
    return null;
  }

  if (!view.tieneEstudiantes) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          {GLOSSARY.dashboard.estadoVacio.titulo}
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          {GLOSSARY.dashboard.estadoVacio.descripcion}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={ROUTES.estudiantesNuevo}
            className="inline-flex rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            {GLOSSARY.dashboard.irNuevoEstudiante}
          </Link>
          <Link
            href={ROUTES.estudiantesIngreso}
            className="inline-flex rounded-lg border border-teal-200 bg-white px-4 py-2.5 text-sm font-semibold text-teal-800"
          >
            {GLOSSARY.dashboard.irIngresoPie}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardIndicadoresCard indicadores={view.indicadores} />
      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardAlertasPanel alertas={view.alertas} />
        <DashboardActividadReciente items={view.actividadReciente} />
      </div>
      <DashboardBarrerasApoyosCard barrerasApoyos={view.barrerasApoyos} />
    </div>
  );
}
