"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import { getEquipoApoyoEstudianteView } from "@/lib/institucional/equipo-apoyo-view";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.equipoApoyo;

type EquipoApoyoResumenCardProps = {
  estudianteId: string;
  onVerEquipoCompleto?: () => void;
};

export function EquipoApoyoResumenCard({
  estudianteId,
  onVerEquipoCompleto,
}: EquipoApoyoResumenCardProps) {
  const [resumen, setResumen] = useState(() => {
    if (typeof window === "undefined") return null;
    return getEquipoApoyoEstudianteView(estudianteId)?.resumen ?? null;
  });

  const refresh = useCallback(() => {
    setResumen(getEquipoApoyoEstudianteView(estudianteId)?.resumen ?? null);
  }, [estudianteId]);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  if (!resumen) return null;

  return (
    <section className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
        {COPY.resumenTitulo}
      </p>
      <dl className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {COPY.resumenResponsablePie}
          </dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-900">
            {resumen.responsablePie?.profesionalNombre ??
              COPY.resumenSinResponsablePie}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {COPY.resumenProfesionalesActivos}
          </dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-900">
            {resumen.cantidadProfesionalesActivos}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-slate-500">
            {COPY.resumenAmbitosActivos}
          </dt>
          <dd className="mt-0.5 text-sm font-semibold text-slate-900">
            {resumen.cantidadAmbitosActivos}
          </dd>
        </div>
      </dl>
      {onVerEquipoCompleto ? (
        <button
          type="button"
          onClick={onVerEquipoCompleto}
          className="mt-5 text-sm font-medium text-teal-700 hover:text-teal-900"
        >
          {COPY.verEquipoCompleto}
        </button>
      ) : (
        <Link
          href={`/estudiantes/${estudianteId}?tab=equipo-apoyo`}
          className="mt-5 inline-block text-sm font-medium text-teal-700 hover:text-teal-900"
        >
          {COPY.verEquipoCompleto}
        </Link>
      )}
    </section>
  );
}
