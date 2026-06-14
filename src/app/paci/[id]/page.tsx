"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PACIAccionesPanel } from "@/components/paci/PACIAccionesPanel";
import { PACIBorradorEditor } from "@/components/paci/PACIBorradorEditor";
import { PACIEvaluacionReferenciaPanel } from "@/components/paci/PACIEvaluacionReferenciaPanel";
import { PACIIndicadoresCard } from "@/components/paci/PACIIndicadoresCard";
import { PACIObjetivoTrazabilidadBlock } from "@/components/paci/PACIObjetivoTrazabilidadBlock";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import { getPACIById } from "@/lib/paci/paci-storage";
import { getPACIDetalleView } from "@/lib/paci/paci-view";
import { getEstudianteById } from "@/lib/students-storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";

const COPY = GLOSSARY.paci;

type PACIDetallePageProps = {
  params: Promise<{ id: string }>;
};

export default function PACIDetallePage({ params }: PACIDetallePageProps) {
  const { id: paciId } = use(params);
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  useEffect(() => {
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  void refreshKey;

  const paci = getPACIById(paciId);
  const detalle = getPACIDetalleView(paciId);
  const estudiante = paci ? getEstudianteById(paci.estudianteId) : null;

  function handleActionComplete() {
    const estudianteIdRef = paci?.estudianteId ?? estudiante?.id ?? "";
    const current = getPACIById(paciId);
    if (!current) {
      if (estudianteIdRef) {
        router.push(ROUTES.estudiantePaciTab(estudianteIdRef));
      } else {
        router.push(ROUTES.estudiantes);
      }
      return;
    }
    refresh();
  }

  if (!paci || !detalle) {
    return (
      <AppShell activeNav="estudiantes">
        <main className="flex flex-1 items-center justify-center px-8 py-10">
          <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">{COPY.noEncontrado}</p>
            <Link
              href={ROUTES.estudiantes}
              className="mt-4 inline-flex text-sm font-medium text-teal-700"
            >
              {COPY.volverEstudiante}
            </Link>
          </div>
        </main>
      </AppShell>
    );
  }

  const selectedObjetivoIds = detalle.objetivos.map(
    (item) => item.trazabilidad.objetivo.id
  );

  return (
    <AppShell activeNav="estudiantes">
      <main className="flex-1 px-8 py-10">
        <div className="mx-auto max-w-3xl">
          <Link
            href={ROUTES.estudiantePaciTab(paci.estudianteId)}
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← {COPY.volverEstudiante}
          </Link>

          <header className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
              {COPY.tituloCorto}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              {COPY.detalleTitulo} · {paci.periodoLabel}
            </h1>
            {estudiante ? (
              <p className="mt-1 text-sm text-slate-600">{estudiante.nombre}</p>
            ) : null}
          </header>

          <div className="mt-8 space-y-6">
            <PACIAccionesPanel
              paci={paci}
              validationRevision={refreshKey}
              onActionComplete={handleActionComplete}
            />

            <PACIIndicadoresCard indicadores={detalle.metricas.indicadores} />

            {paci.estado === "borrador" ? (
              <PACIBorradorEditor
                paci={paci}
                selectedObjetivoIds={selectedObjetivoIds}
                onSaved={refresh}
              />
            ) : (
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-sm font-semibold text-slate-900">
                  {COPY.sintesisInstitucional}
                </h2>
                <p className="mt-2 text-sm text-slate-800 whitespace-pre-wrap">
                  {detalle.sintesisInstitucional ?? COPY.sintesisVacia}
                </p>
              </section>
            )}

            <PACIEvaluacionReferenciaPanel
              evaluacionReferencia={detalle.evaluacionReferencia}
            />

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                {COPY.objetivosIncluidos}
              </h2>
              {detalle.objetivos.length === 0 ? (
                <p className="mt-4 text-sm text-slate-600">{COPY.sinObjetivos}</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {detalle.objetivos.map((item) => (
                    <PACIObjetivoTrazabilidadBlock key={item.paciObjetivo.id} item={item} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
