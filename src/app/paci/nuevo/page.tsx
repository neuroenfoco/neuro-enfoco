"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  createPACI,
  getDefaultPeriodoLabel,
  getPACIBorradorByEstudianteYPeriodo,
} from "@/lib/paci/paci-storage";
import { getEstudiantes } from "@/lib/students-storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const COPY = GLOSSARY.paci;

export default function NuevoPACIPage() {
  const router = useRouter();
  const [estudiantes, setEstudiantes] = useState(
    () => (typeof window !== "undefined" ? getEstudiantes() : [])
  );
  const [estudianteId, setEstudianteId] = useState("");
  const [periodoLabel, setPeriodoLabel] = useState(getDefaultPeriodoLabel());
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const borradorExistente = useMemo(() => {
    if (!estudianteId || !periodoLabel.trim()) return null;
    return getPACIBorradorByEstudianteYPeriodo(estudianteId, periodoLabel);
  }, [estudianteId, periodoLabel]);

  useEffect(() => {
    setEstudiantes(getEstudiantes());
    const preselected = new URLSearchParams(window.location.search).get(
      "estudianteId"
    );
    if (preselected) {
      setEstudianteId(preselected);
    }
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isCreating) return;

    if (!estudianteId) {
      setError(COPY.seleccionaEstudiante);
      return;
    }

    setIsCreating(true);
    setError(null);

    if (borradorExistente) {
      router.push(ROUTES.paciDetalle(borradorExistente.id));
      return;
    }

    const paci = createPACI({
      estudianteId,
      periodoLabel: periodoLabel.trim(),
    });

    setIsCreating(false);

    if (!paci) {
      setError(COPY.estudianteRequerido);
      return;
    }

    router.push(ROUTES.paciDetalle(paci.id));
  }

  return (
    <AppShell activeNav="estudiantes">
      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-lg">
          <Link
            href={estudianteId ? ROUTES.estudiantePaciTab(estudianteId) : ROUTES.estudiantes}
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← {COPY.volverEstudiante}
          </Link>

          <header className="mt-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {COPY.nuevoTitulo}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{COPY.nuevoSubtitulo}</p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <label className="block text-sm font-medium text-slate-700">
              Estudiante
              <select
                value={estudianteId}
                onChange={(event) => setEstudianteId(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">{COPY.seleccionaEstudiante}</option>
                {estudiantes.map((estudiante) => (
                  <option key={estudiante.id} value={estudiante.id}>
                    {estudiante.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-slate-700">
              {COPY.periodo}
              <input
                type="text"
                value={periodoLabel}
                onChange={(event) => setPeriodoLabel(event.target.value)}
                placeholder={getDefaultPeriodoLabel()}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            {borradorExistente ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {COPY.borradorExistente}
              </p>
            ) : null}

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isCreating}
              className="w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              {borradorExistente ? COPY.verDetalle : COPY.crearPaci}
            </button>
          </form>
        </div>
      </main>
    </AppShell>
  );
}
