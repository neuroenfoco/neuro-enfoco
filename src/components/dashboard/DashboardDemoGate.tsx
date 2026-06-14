"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import { getSesiones } from "@/lib/sessions-storage";
import { getEstudiantes } from "@/lib/students-storage";
import Link from "next/link";
import { useEffect, useState } from "react";

function hasInstitutionalData(): boolean {
  return getEstudiantes().length > 0 || getSesiones().length > 0;
}

type DashboardDemoGateProps = {
  children: React.ReactNode;
};

export function DashboardDemoGate({ children }: DashboardDemoGateProps) {
  const [hasData, setHasData] = useState<boolean | null>(null);

  useEffect(() => {
    function refresh() {
      setHasData(hasInstitutionalData());
    }

    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (hasData === null) {
    return null;
  }

  if (!hasData) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-slate-600">
          {GLOSSARY.dashboard.sinDatosInstitucionales}
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/estudiantes/ingreso"
            className="inline-flex rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            {GLOSSARY.dashboard.irIngresoPie}
          </Link>
          <Link
            href={ROUTES.estudiantes}
            className="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
          >
            {GLOSSARY.dashboard.verEstudiantes}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <div
        className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900"
        role="status"
      >
        {GLOSSARY.dashboard.avisoMetricasDemo}
      </div>
      {children}
    </div>
  );
}
