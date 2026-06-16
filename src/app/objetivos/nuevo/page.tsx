"use client";

import { AppShell } from "@/components/layout/app-shell";
import {
  ObjetivoPIEPlanificacionForm,
  type ObjetivoPIEPlanificacionSubmitInput,
} from "@/components/objetivos/ObjetivoPIEPlanificacionForm";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  inputValueToFechaLineaBase,
  PIE_DIMENSION_OPTIONS,
  saveObjetivoPIE,
} from "@/lib/pie-objectives-storage";
import { getConclusionEvaluativaById } from "@/lib/evaluacion-integral/conclusion-evaluativa-storage";
import { linkConclusionesToObjetivo } from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import { mapConclusionDimensionToObjetivoDimension } from "@/lib/evaluacion-integral/planificacion-evaluativa-view";
import { getEstudiantesRepositoryAsync } from "@/lib/repositories/repository-factory";
import type { Estudiante } from "@/lib/students-storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function loadEstudiantesIncludingId(
  estudianteId?: string
): Promise<Estudiante[]> {
  const repo = getEstudiantesRepositoryAsync();
  const list = await repo.getAll();
  const trimmed = estudianteId?.trim();
  if (!trimmed || list.some((item) => item.id === trimmed)) {
    return list;
  }

  const selected = await repo.getById(trimmed);
  return selected ? [...list, selected] : list;
}

export default function NuevoObjetivoPage() {
  const router = useRouter();
  const copy = GLOSSARY.objetivo.planificacion;

  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [isLoadingEstudiantes, setIsLoadingEstudiantes] = useState(true);
  const [preselectedEstudianteId, setPreselectedEstudianteId] = useState("");
  const [preselectedConclusionIds, setPreselectedConclusionIds] = useState<
    string[]
  >([]);
  const [preselectedEvaluacionId, setPreselectedEvaluacionId] = useState("");
  const [suggestedDimension, setSuggestedDimension] = useState<string>(
    PIE_DIMENSION_OPTIONS[0]
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const params = new URLSearchParams(window.location.search);
      const preselected = params.get("estudianteId") ?? "";

      const conclusionId = params.get("conclusionId");
      const conclusionIdsParam = params.getAll("conclusionIds");
      const ids = [
        ...(conclusionId ? [conclusionId] : []),
        ...conclusionIdsParam,
      ].filter(Boolean);

      try {
        const list = await loadEstudiantesIncludingId(preselected || undefined);
        if (cancelled) return;

        setEstudiantes(list);
        if (preselected) {
          setPreselectedEstudianteId(preselected);
        }

        if (ids.length > 0) {
          setPreselectedConclusionIds(ids);
          const primera = getConclusionEvaluativaById(ids[0]);
          if (primera) {
            setPreselectedEvaluacionId(primera.evaluacionIntegralId);
            const dimension = mapConclusionDimensionToObjetivoDimension(
              primera.dimensionId
            );
            if (dimension) setSuggestedDimension(dimension);
          }
        }
      } catch {
        if (!cancelled) setEstudiantes([]);
      } finally {
        if (!cancelled) setIsLoadingEstudiantes(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSubmit(input: ObjetivoPIEPlanificacionSubmitInput) {
    if (isSaving) return;

    setIsSaving(true);
    const objetivo = saveObjetivoPIE({
      estudianteId: input.estudianteId,
      nombre: input.nombre,
      dimensionRelacionada: input.dimensionRelacionada,
      condicionesParticipacionIds: input.condicionesParticipacionIds,
      condicionParticipacionOtro: input.condicionParticipacionOtro,
      metaLogro: input.metaLogro,
      lineaBase: input.lineaBase,
      fechaLineaBase: inputValueToFechaLineaBase(input.fechaLineaBase ?? ""),
      descripcion: input.descripcion,
      desarrolloCatalogoId: input.desarrolloCatalogoId,
      esDesarrolloPersonalizado: input.esDesarrolloPersonalizado,
      apoyosPlanificadosIds: input.apoyosPlanificadosIds,
      apoyoPlanificadoOtro: input.apoyoPlanificadoOtro,
    });

    if (input.conclusionEvaluativaIds?.length) {
      linkConclusionesToObjetivo(objetivo.id, input.conclusionEvaluativaIds);
    }

    router.push(`/objetivos/${objetivo.id}`);
  }

  return (
    <AppShell activeNav="objetivos">
      <main className="flex-1 px-8 py-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col">
          <div className="mb-8">
            <Link
              href={ROUTES.objetivos}
              className="text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              ← Volver a objetivos
            </Link>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
              {copy.tituloNuevo}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{copy.subtitulo}</p>
          </div>

          {isLoadingEstudiantes ? (
            <p className="text-sm text-slate-500">Cargando estudiantes…</p>
          ) : estudiantes.length === 0 ? (
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-6 text-sm text-amber-900">
              <p>Primero debes registrar al menos un estudiante.</p>
              <Link
                href={ROUTES.estudiantesNuevo}
                className="mt-3 inline-flex font-medium text-teal-700 hover:text-teal-800"
              >
                {GLOSSARY.estudiante.nuevoCta}
              </Link>
            </div>
          ) : (
            <ObjetivoPIEPlanificacionForm
              mode="create"
              estudiantes={estudiantes}
              initialValues={
                preselectedEstudianteId
                  ? {
                      estudianteId: preselectedEstudianteId,
                      dimensionRelacionada: suggestedDimension,
                      desarrolloCatalogoId: "",
                      esDesarrolloPersonalizado: false,
                      nombrePersonalizado: "",
                      lineaBase: "",
                      fechaLineaBase: "",
                      metaLogro: "",
                      condicionesParticipacionIds: [],
                      condicionParticipacionOtro: "",
                      apoyosPlanificadosIds: [],
                      espaciosPlanificadosIds: [],
                      apoyoPlanificadoOtro: "",
                      descripcion: "",
                      evaluacionOrigenId: preselectedEvaluacionId,
                      conclusionEvaluativaIds: preselectedConclusionIds,
                    }
                  : undefined
              }
              onSubmit={handleSubmit}
              cancelHref={ROUTES.objetivos}
              submitLabel={copy.guardar}
              isSaving={isSaving}
            />
          )}
        </div>
      </main>
    </AppShell>
  );
}
