"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  deleteObjetivoPIE,
  formatImpactoPromedio,
  getObjetivosPIEResumen,
  type ObjetivoPIEResumen,
} from "@/lib/pie-objectives-storage";
import { getEstudianteById } from "@/lib/students-storage";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ObjetivosPage() {
  const [objetivos, setObjetivos] = useState<ObjetivoPIEResumen[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  function refreshObjetivos() {
    setObjetivos(getObjetivosPIEResumen());
  }

  useEffect(() => {
    refreshObjetivos();
    window.addEventListener("focus", refreshObjetivos);
    window.addEventListener("storage", refreshObjetivos);

    return () => {
      window.removeEventListener("focus", refreshObjetivos);
      window.removeEventListener("storage", refreshObjetivos);
    };
  }, []);

  function handleConfirmDelete() {
    if (!pendingDeleteId) return;

    const deleted = deleteObjetivoPIE(pendingDeleteId);
    setPendingDeleteId(null);

    if (deleted) {
      refreshObjetivos();
      setDeleteMessage("Objetivo eliminado correctamente.");
      window.setTimeout(() => setDeleteMessage(null), 4000);
    }
  }

  return (
    <AppShell activeNav="objetivos">
      <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-6 backdrop-blur-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Objetivos PIE
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                {GLOSSARY.objetivo.vinculadosDimensiones}
              </p>
            </div>
            <Link
              href="/objetivos/nuevo"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700"
            >
              Nuevo objetivo
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

          {objetivos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-slate-600">
                Aún no hay objetivos PIE registrados.
              </p>
              <Link
                href="/objetivos/nuevo"
                className="mt-4 inline-flex text-sm font-medium text-teal-700 hover:text-teal-800"
              >
                Crear el primer objetivo
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {objetivos.map((resumen) => {
                const estudiante = getEstudianteById(resumen.objetivo.estudianteId);
                return (
                  <li key={resumen.objetivo.id}>
                    <ObjetivoCard
                      resumen={resumen}
                      estudianteNombre={estudiante?.nombre ?? "Estudiante no encontrado"}
                      onDelete={() => setPendingDeleteId(resumen.objetivo.id)}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </main>

      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-objetivo-dialog-title"
          >
            <h2
              id="delete-objetivo-dialog-title"
              className="text-base font-semibold text-slate-900"
            >
              ¿Deseas eliminar este objetivo?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {GLOSSARY.intervencion.objetivosNoEliminan}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function ObjetivoCard({
  resumen,
  estudianteNombre,
  onDelete,
}: {
  resumen: ObjetivoPIEResumen;
  estudianteNombre: string;
  onDelete: () => void;
}) {
  const { objetivo, estado, cantidadEvidencias, impactoPromedio, ultimaEvidencia } =
    resumen;

  return (
    <article className="rounded-2xl border border-violet-200/50 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500">{estudianteNombre}</p>
          <h2 className="mt-0.5 text-lg font-semibold text-slate-900">
            <Link
              href={`/objetivos/${objetivo.id}`}
              className="transition hover:text-violet-800"
            >
              {objetivo.nombre}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-violet-700">
            {objetivo.dimensionRelacionada}
          </p>
          {objetivo.descripcion && (
            <p className="mt-2 text-sm text-slate-600">{objetivo.descripcion}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
        >
          <span aria-hidden>🗑</span>
          Eliminar
        </button>
      </div>

      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Estado" value={estado} />
        <Metric
          label="Impacto promedio"
          value={`${formatImpactoPromedio(impactoPromedio)} niveles`}
        />
        <Metric label="Evidencias" value={String(cantidadEvidencias)} />
        <Metric label="Última evidencia" value={ultimaEvidencia} />
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
