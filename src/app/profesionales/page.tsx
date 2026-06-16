"use client";

import { AppShell } from "@/components/layout/app-shell";
import { EliminarProfesionalDialog } from "@/components/profesionales/EliminarProfesionalDialog";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  DEFAULT_PROFESIONAL_ID,
  formatProfesionalNombreCompleto,
  getProfesionalRolNombre,
} from "@/lib/institucional/profesionales-storage";
import type { Profesional } from "@/lib/repositories/profesionales-repository";
import { getProfesionalesRepository } from "@/lib/repositories/repository-factory";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function ProfesionalesPage() {
  const copy = GLOSSARY.profesional;
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Profesional | null>(null);

  const refreshProfesionales = useCallback(() => {
    setProfesionales(getProfesionalesRepository().getAll());
  }, []);

  useEffect(() => {
    refreshProfesionales();
    window.addEventListener("focus", refreshProfesionales);
    window.addEventListener("storage", refreshProfesionales);

    return () => {
      window.removeEventListener("focus", refreshProfesionales);
      window.removeEventListener("storage", refreshProfesionales);
    };
  }, [refreshProfesionales]);

  const totalProfesionales = profesionales.length;
  const profesionalesActivos = useMemo(
    () => profesionales.filter((profesional) => profesional.activo).length,
    [profesionales]
  );
  const rolesRepresentados = useMemo(
    () => new Set(profesionales.map((profesional) => profesional.rolPrincipalId)).size,
    [profesionales]
  );

  return (
    <AppShell activeNav="profesionales">
      <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-6 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
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
        {deleteMessage && (
          <p
            className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
            role="status"
          >
            {deleteMessage}
          </p>
        )}

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {copy.indicadorTotal}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {totalProfesionales}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
              {copy.indicadorActivos}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {profesionalesActivos}
            </p>
          </div>
          <div className="rounded-2xl border border-violet-200/50 bg-gradient-to-br from-violet-50/40 via-white to-slate-50/30 p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-800">
              {copy.indicadorRoles}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              {rolesRepresentados}
            </p>
          </div>
        </section>

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
                        <div className="flex items-center gap-4">
                          <Link
                            href={ROUTES.profesionalEditar(profesional.id)}
                            className="text-sm font-medium text-teal-700 hover:text-teal-800"
                          >
                            {copy.editar}
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(profesional)}
                            className="text-sm font-medium text-rose-700 hover:text-rose-800"
                          >
                            {copy.eliminar}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {deleteTarget && (
        <EliminarProfesionalDialog
          open
          profesional={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setDeleteTarget(null);
            refreshProfesionales();
            setDeleteMessage(copy.eliminarExito);
            window.setTimeout(() => setDeleteMessage(null), 4000);
          }}
        />
      )}
    </AppShell>
  );
}
