"use client";

import { AppShell } from "@/components/layout/app-shell";
import { EVALUACION_TIPOS_CAPTURA } from "@/components/evaluacion-integral/evaluacion-captura-config";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  todayEvaluacionDateInput,
} from "@/lib/evaluacion-integral/evaluacion-integral-fechas";
import type { EvaluacionIntegralTipo } from "@/lib/evaluacion-integral/evaluacion-integral-types";
import {
  getEvaluacionIngresoCerradaByEstudianteId,
  saveEvaluacionIntegral,
} from "@/lib/evaluacion-integral/evaluacion-integral-storage";
import { getEvaluacionVigente } from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { getEstudiantes } from "@/lib/students-storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const COPY = GLOSSARY.evaluacionCaptura;

function defaultTipoForEstudiante(estudianteId: string): EvaluacionIntegralTipo {
  if (getEvaluacionIngresoCerradaByEstudianteId(estudianteId)) {
    return "reevaluacion";
  }
  return "ingreso";
}

export default function NuevaEvaluacionPage() {
  const router = useRouter();
  const [estudiantes, setEstudiantes] = useState(
    () => (typeof window !== "undefined" ? getEstudiantes() : [])
  );
  const [estudianteId, setEstudianteId] = useState("");
  const [tipo, setTipo] = useState<EvaluacionIntegralTipo>("reevaluacion");
  const [fechaInicio, setFechaInicio] = useState(todayEvaluacionDateInput());
  const [fechaTermino, setFechaTermino] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const borradorExistente = useMemo(() => {
    if (!estudianteId) return null;
    const vigente = getEvaluacionVigente(estudianteId);
    return vigente?.estado === "borrador" ? vigente : null;
  }, [estudianteId]);

  useEffect(() => {
    setEstudiantes(getEstudiantes());
    const preselected = new URLSearchParams(window.location.search).get(
      "estudianteId"
    );
    if (preselected) {
      setEstudianteId(preselected);
      setTipo(defaultTipoForEstudiante(preselected));
    }
  }, []);

  useEffect(() => {
    if (!estudianteId) return;
    setTipo(defaultTipoForEstudiante(estudianteId));
  }, [estudianteId]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isCreating) return;

    if (!estudianteId) {
      setError(COPY.seleccionaEstudiante);
      return;
    }

    if (borradorExistente) {
      setError(COPY.borradorExistente);
      return;
    }

    setIsCreating(true);
    setError(null);

    const created = saveEvaluacionIntegral({
      estudianteId,
      tipo,
      fechaInicio,
      fechaTermino: fechaTermino || undefined,
    });

    setIsCreating(false);

    if (!created) {
      setError(COPY.errorCrear);
      return;
    }

    router.push(ROUTES.evaluacionCaptura(created.id));
  }

  return (
    <AppShell activeNav="estudiantes">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            {COPY.tituloNueva}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{COPY.subtituloNueva}</p>
        </header>

        {borradorExistente ? (
          <section className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
            <p className="text-sm text-amber-900">{COPY.borradorExistente}</p>
            <Link
              href={ROUTES.evaluacionCaptura(borradorExistente.id)}
              className="mt-3 inline-flex text-sm font-semibold text-violet-700"
            >
              {GLOSSARY.evaluacionIntegral.continuarEvaluacion}
            </Link>
          </section>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-200/70 bg-white p-6 sm:p-8"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {COPY.campoEstudiante}
            </span>
            <select
              required
              value={estudianteId}
              onChange={(event) => setEstudianteId(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              <option value="">{COPY.seleccionaEstudiante}</option>
              {estudiantes.map((estudiante) => (
                <option key={estudiante.id} value={estudiante.id}>
                  {estudiante.nombre}
                  {estudiante.curso ? ` · ${estudiante.curso}` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              {COPY.campoTipo}
            </span>
            <select
              value={tipo}
              onChange={(event) =>
                setTipo(event.target.value as EvaluacionIntegralTipo)
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              {EVALUACION_TIPOS_CAPTURA.map((option) => {
                const ingresoCerrada =
                  estudianteId &&
                  option.id === "ingreso" &&
                  Boolean(getEvaluacionIngresoCerradaByEstudianteId(estudianteId));
                return (
                  <option
                    key={option.id}
                    value={option.id}
                    disabled={Boolean(ingresoCerrada)}
                  >
                    {option.label}
                  </option>
                );
              })}
            </select>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {COPY.campoFechaInicio}
              </span>
              <input
                type="date"
                required
                value={fechaInicio}
                onChange={(event) => setFechaInicio(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                {COPY.campoFechaCierrePrevista}
              </span>
              <input
                type="date"
                value={fechaTermino}
                onChange={(event) => setFechaTermino(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </label>
          </div>

          {error ? (
            <p className="text-sm text-rose-700" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-between">
            <Link
              href={ROUTES.estudiantes}
              className="rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-700"
            >
              {COPY.cancelar}
            </Link>
            <button
              type="submit"
              disabled={isCreating || Boolean(borradorExistente)}
              className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isCreating ? COPY.creando : COPY.crearEvaluacion}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
