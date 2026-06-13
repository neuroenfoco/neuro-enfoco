"use client";

import { AppShell } from "@/components/layout/app-shell";
import {
  buildPlanificacionValuesFromObjetivo,
  ObjetivoPIEPlanificacionForm,
  type ObjetivoPIEPlanificacionInitialValues,
  type ObjetivoPIEPlanificacionSubmitInput,
} from "@/components/objetivos/ObjetivoPIEPlanificacionForm";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  fechaLineaBaseToInputValue,
  getObjetivoPIEById,
  inputValueToFechaLineaBase,
  updateObjetivoPIE,
} from "@/lib/pie-objectives-storage";
import { getVinculosByObjetivoId, syncVinculosObjetivo } from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import { getEstudiantes } from "@/lib/students-storage";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditarObjetivoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const objetivoId = params.id;
  const copy = GLOSSARY.objetivo.planificacion;

  const [estudiantes, setEstudiantes] = useState(
    () => (typeof window !== "undefined" ? getEstudiantes() : [])
  );
  const [initialValues, setInitialValues] =
    useState<ObjetivoPIEPlanificacionInitialValues | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setEstudiantes(getEstudiantes());

    const objetivo = getObjetivoPIEById(objetivoId);
    if (!objetivo) {
      setNotFound(true);
      return;
    }

    const vinculos = getVinculosByObjetivoId(objetivoId);
    setInitialValues({
      ...buildPlanificacionValuesFromObjetivo({
        ...objetivo,
        fechaLineaBase: fechaLineaBaseToInputValue(objetivo.fechaLineaBase),
      }),
      conclusionEvaluativaIds: vinculos.map(
        (item) => item.conclusionEvaluativaId
      ),
      evaluacionOrigenId: vinculos[0]?.evaluacionIntegralId ?? "",
    });
  }, [objetivoId]);

  function handleSubmit(input: ObjetivoPIEPlanificacionSubmitInput) {
    if (isSaving) return;

    setIsSaving(true);
    const updated = updateObjetivoPIE(objetivoId, {
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

    if (updated) {
      syncVinculosObjetivo(
        objetivoId,
        input.conclusionEvaluativaIds ?? []
      );
      router.push(`/objetivos/${objetivoId}`);
      return;
    }

    setIsSaving(false);
    setNotFound(true);
  }

  if (notFound) {
    return (
      <AppShell activeNav="objetivos">
        <main className="flex flex-1 items-center justify-center px-8 py-10 text-slate-600">
          <div className="max-w-md rounded-2xl border border-slate-200/70 bg-white p-8 text-center shadow-sm">
            <p className="text-sm">Objetivo PIE no encontrado.</p>
            <Link
              href={ROUTES.objetivos}
              className="mt-4 inline-flex text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              Volver a objetivos
            </Link>
          </div>
        </main>
      </AppShell>
    );
  }

  if (!initialValues) {
    return (
      <AppShell activeNav="objetivos">
        <main className="flex flex-1 items-center justify-center px-8 py-10 text-slate-500">
          <p className="text-sm">Cargando objetivo...</p>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell activeNav="objetivos">
      <main className="flex-1 px-8 py-10">
        <div className="mx-auto flex w-full max-w-3xl flex-col">
          <div className="mb-8">
            <Link
              href={`/objetivos/${objetivoId}`}
              className="text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              ← Volver al objetivo
            </Link>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
              {copy.tituloEditar}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{copy.subtitulo}</p>
          </div>

          <ObjetivoPIEPlanificacionForm
            mode="edit"
            estudiantes={estudiantes}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            cancelHref={`/objetivos/${objetivoId}`}
            submitLabel={copy.guardarCambios}
            isSaving={isSaving}
          />
        </div>
      </main>
    </AppShell>
  );
}
