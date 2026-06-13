"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  DEFAULT_PROFESIONAL_ID,
  formatProfesionalNombreCompleto,
  getProfesionalRolNombre,
  getProfesionales,
  type Profesional,
} from "@/lib/institucional/profesionales-storage";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProfesionalesPage() {
  const copy = GLOSSARY.profesional;
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);

  useEffect(() => {
    function refresh() {
      setProfesionales(getProfesionales());
    }

    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <AppShell activeNav="intervenciones">
      <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-6 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href={ROUTES.intervenciones}
              className="text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              ← {copy.volverIntervenciones}
            </Link>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
              {copy.tituloListado}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{copy.subtituloListado}</p>
          </div>
          <Link
            href={ROUTES.profesionalesNuevo}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700"
          >
            {copy.nuevo}
          </Link>
        </div>
      </header>

      <main className="flex-1 px-8 py-8">
        {profesionales.length === 0 ? (
          <p className="text-sm text-slate-500">{copy.sinRegistros}</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      {copy.columnaNombre}
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      {copy.rolPrincipal}
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      {copy.email}
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      {copy.columnaEstado}
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      {copy.columnaAcciones}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profesionales.map((profesional) => (
                    <tr
                      key={profesional.id}
                      className="transition hover:bg-teal-50/20"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {formatProfesionalNombreCompleto(profesional)}
                        </p>
                        {profesional.id === DEFAULT_PROFESIONAL_ID && (
                          <p className="mt-1 text-xs text-slate-500">
                            {copy.profesionalTransicion}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {getProfesionalRolNombre(profesional)}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {profesional.email ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            profesional.activo
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {profesional.activo ? copy.estadoActivo : copy.estadoInactivo}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={ROUTES.profesionalEditar(profesional.id)}
                          className="text-sm font-medium text-teal-700 hover:text-teal-800"
                        >
                          {copy.editar}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
