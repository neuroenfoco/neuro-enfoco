"use client";

import { EvaluacionCapturaPasoCierre } from "@/components/evaluacion-integral/EvaluacionCapturaPasoCierre";
import { EvaluacionCapturaPasoConclusiones } from "@/components/evaluacion-integral/EvaluacionCapturaPasoConclusiones";
import { EvaluacionCapturaPasoEncuadre } from "@/components/evaluacion-integral/EvaluacionCapturaPasoEncuadre";
import { EvaluacionCapturaPasoHallazgos } from "@/components/evaluacion-integral/EvaluacionCapturaPasoHallazgos";
import { EVALUACION_CAPTURA_PASOS } from "@/components/evaluacion-integral/evaluacion-captura-config";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import { cerrarEvaluacionIntegral } from "@/lib/evaluacion-integral/evaluacion-integral-consolidacion";
import type { EvaluacionIntegralTipo } from "@/lib/evaluacion-integral/evaluacion-integral-types";
import {
  getEvaluacionConDetalle,
  getEvaluacionIntegralTipoLabel,
  type EvaluacionIntegralDetalleView,
} from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { updateEvaluacionIntegral } from "@/lib/evaluacion-integral/evaluacion-integral-storage";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";
import { getEstudianteById } from "@/lib/students-storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.evaluacionCaptura;

type EvaluacionCapturaWizardProps = {
  evaluacionId: string;
};

export function EvaluacionCapturaWizard({
  evaluacionId,
}: EvaluacionCapturaWizardProps) {
  const router = useRouter();
  const [paso, setPaso] = useState<1 | 2 | 3 | 4>(1);
  const [detalle, setDetalle] = useState<EvaluacionIntegralDetalleView | null>(
    null
  );
  const [pendingHallazgoId, setPendingHallazgoId] = useState<string | undefined>(
    undefined
  );
  const [tipo, setTipo] = useState<EvaluacionIntegralTipo>("reevaluacion");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaTermino, setFechaTermino] = useState("");
  const [sintesis, setSintesis] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [cerradaOk, setCerradaOk] = useState(false);

  const refresh = useCallback(() => {
    const loaded = getEvaluacionConDetalle(evaluacionId);
    setDetalle(loaded);
    if (loaded) {
      setTipo(loaded.evaluacion.tipo);
      setFechaInicio(loaded.evaluacion.fechaInicio);
      setFechaTermino(loaded.evaluacion.fechaTermino ?? "");
      setSintesis(loaded.evaluacion.observacionesEvaluacion ?? "");
    }
  }, [evaluacionId]);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  if (!detalle) {
    return (
      <p className="text-sm text-slate-600">{GLOSSARY.evaluacionIntegral.sinEvaluacion}</p>
    );
  }

  const { evaluacion, resumen } = detalle;
  const estudiante = getEstudianteById(evaluacion.estudianteId);

  if (evaluacion.estado === "cerrada" || cerradaOk) {
    return (
      <section className="rounded-2xl border border-emerald-200/70 bg-emerald-50/40 p-8 text-center">
        <h2 className="text-lg font-semibold text-slate-900">
          {COPY.evaluacionCerradaTitulo}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{COPY.evaluacionCerradaDetalle}</p>
        <Link
          href={`/estudiantes/${evaluacion.estudianteId}?tab=evaluacion-integral`}
          className="mt-6 inline-flex rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white"
        >
          {COPY.verEnFicha}
        </Link>
      </section>
    );
  }

  if (evaluacion.estado !== "borrador") {
    return (
      <p className="text-sm text-slate-600">
        Esta evaluación no está disponible para edición.
      </p>
    );
  }

  function persistEncuadre(): boolean {
    const updated = updateEvaluacionIntegral(evaluacionId, {
      tipo,
      fechaInicio,
      fechaTermino: fechaTermino || undefined,
      observacionesEvaluacion: sintesis || undefined,
    });
    if (!updated) {
      setError(COPY.errorGuardar);
      return false;
    }
    refresh();
    return true;
  }

  function handleSiguiente() {
    setError(null);
    if (paso === 1 && !persistEncuadre()) return;
    if (paso === 2 || paso === 3) {
      if (!persistEncuadre()) return;
    }
    setPaso((current) =>
      current < 4 ? ((current + 1) as 1 | 2 | 3 | 4) : current
    );
  }

  function handleAnterior() {
    setError(null);
    setPaso((current) =>
      current > 1 ? ((current - 1) as 1 | 2 | 3 | 4) : current
    );
  }

  function handleDerivarConclusion(hallazgoId: string) {
    setPendingHallazgoId(hallazgoId);
    setPaso(3);
    setError(null);
  }

  function handleCerrar() {
    if (isClosing) return;
    setError(null);
    setIsClosing(true);

    const saved = updateEvaluacionIntegral(evaluacionId, {
      tipo,
      fechaInicio,
      fechaTermino: fechaTermino || undefined,
      observacionesEvaluacion: sintesis || undefined,
    });
    if (!saved) {
      setError(COPY.errorGuardar);
      setIsClosing(false);
      return;
    }

    const result = cerrarEvaluacionIntegral(evaluacionId);
    setIsClosing(false);

    if (!result.ok) {
      setError(result.error ?? COPY.errorCerrar);
      return;
    }

    setCerradaOk(true);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-800">
          {estudiante?.nombre ?? "Estudiante"}
          {estudiante?.curso ? ` · ${estudiante.curso}` : ""}
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          {COPY.tituloCaptura}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {getEvaluacionIntegralTipoLabel(tipo)} ·{" "}
          {formatMarcoFechaDisplay(fechaInicio)}
        </p>
      </header>

      <nav aria-label="Pasos de captura" className="flex flex-wrap gap-2">
        {EVALUACION_CAPTURA_PASOS.map((step) => {
          const isActive = paso === step.id;
          const isDone = paso > step.id;
          return (
            <span
              key={step.id}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                isActive
                  ? "bg-violet-700 text-white"
                  : isDone
                    ? "bg-violet-100 text-violet-800"
                    : "bg-slate-100 text-slate-600"
              }`}
            >
              {step.id}. {step.label}
            </span>
          );
        })}
      </nav>

      {paso === 1 ? (
        <EvaluacionCapturaPasoEncuadre
          evaluacionId={evaluacionId}
          estudianteId={evaluacion.estudianteId}
          tipo={tipo}
          fechaInicio={fechaInicio}
          fechaTermino={fechaTermino}
          participantes={detalle.participantes}
          onEncuadreChange={({ tipo: nextTipo, fechaInicio: nextInicio, fechaTermino: nextTermino }) => {
            setTipo(nextTipo);
            setFechaInicio(nextInicio);
            setFechaTermino(nextTermino);
          }}
          onParticipantesChange={refresh}
        />
      ) : null}

      {paso === 2 ? (
        <EvaluacionCapturaPasoHallazgos
          evaluacionId={evaluacionId}
          estudianteId={evaluacion.estudianteId}
          hallazgosPorTipo={detalle.hallazgosPorTipo}
          onHallazgosChange={refresh}
          onDerivarConclusion={handleDerivarConclusion}
        />
      ) : null}

      {paso === 3 ? (
        <EvaluacionCapturaPasoConclusiones
          evaluacionId={evaluacionId}
          estudianteId={evaluacion.estudianteId}
          hallazgos={detalle.hallazgos}
          hallazgosPorTipo={detalle.hallazgosPorTipo}
          conclusiones={detalle.conclusiones}
          preselectedHallazgoId={pendingHallazgoId}
          onConclusionesChange={refresh}
          onPreselectedHallazgoConsumed={() => setPendingHallazgoId(undefined)}
        />
      ) : null}

      {paso === 4 ? (
        <EvaluacionCapturaPasoCierre
          resumen={resumen}
          fechaTermino={fechaTermino}
          sintesis={sintesis}
          onSintesisChange={setSintesis}
        />
      ) : null}

      {error ? (
        <p className="text-sm text-rose-700" role="alert">
          {error}
        </p>
      ) : null}

      <footer className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {paso > 1 ? (
            <button
              type="button"
              onClick={handleAnterior}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
            >
              {COPY.anterior}
            </button>
          ) : (
            <Link
              href={ROUTES.estudiantes}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
            >
              {COPY.volverEstudiantes}
            </Link>
          )}
        </div>

        <div className="flex gap-2">
          {paso < 4 ? (
            <button
              type="button"
              onClick={handleSiguiente}
              className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-semibold text-white"
            >
              {COPY.siguiente}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCerrar}
              disabled={isClosing}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isClosing ? COPY.cerrando : COPY.cerrarEvaluacion}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
