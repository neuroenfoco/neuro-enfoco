"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  BARRERA_DETECTADA_AYUDA,
  fechaLineaBaseToInputValue,
  getObjetivoPIEById,
  inputValueToFechaLineaBase,
  PIE_DIMENSION_OPTIONS,
  updateObjetivoPIE,
} from "@/lib/pie-objectives-storage";
import { getEstudiantes } from "@/lib/students-storage";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditarObjetivoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const objetivoId = params.id;

  const [estudiantes, setEstudiantes] = useState(
    () => (typeof window !== "undefined" ? getEstudiantes() : [])
  );
  const [estudianteId, setEstudianteId] = useState("");
  const [barreraDetectada, setBarreraDetectada] = useState("");
  const [nombre, setNombre] = useState("");
  const [metaLogro, setMetaLogro] = useState("");
  const [dimensionRelacionada, setDimensionRelacionada] = useState<string>(
    PIE_DIMENSION_OPTIONS[0]
  );
  const [lineaBase, setLineaBase] = useState("");
  const [fechaLineaBase, setFechaLineaBase] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setEstudiantes(getEstudiantes());

    const objetivo = getObjetivoPIEById(objetivoId);
    if (!objetivo) {
      setNotFound(true);
      return;
    }

    setEstudianteId(objetivo.estudianteId);
    setBarreraDetectada(objetivo.barreraDetectada?.trim() ?? "");
    setNombre(objetivo.nombre);
    setMetaLogro(objetivo.metaLogro?.trim() ?? "");
    setDimensionRelacionada(objetivo.dimensionRelacionada);
    setLineaBase(objetivo.lineaBase?.trim() ?? "");
    setFechaLineaBase(fechaLineaBaseToInputValue(objetivo.fechaLineaBase));
    setDescripcion(objetivo.descripcion ?? "");
  }, [objetivoId]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      isSaving ||
      !estudianteId ||
      !nombre.trim() ||
      !barreraDetectada.trim() ||
      !metaLogro.trim()
    ) {
      return;
    }

    setIsSaving(true);
    const updated = updateObjetivoPIE(objetivoId, {
      estudianteId,
      nombre,
      dimensionRelacionada,
      barreraDetectada,
      metaLogro,
      lineaBase: lineaBase.trim() || undefined,
      fechaLineaBase: inputValueToFechaLineaBase(fechaLineaBase),
      descripcion: descripcion.trim() || undefined,
    });

    if (updated) {
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
            Editar objetivo PIE
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Actualiza la barrera detectada y el foco del objetivo.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]"
        >
          <div className="space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Estudiante
              </span>
              <select
                value={estudianteId}
                onChange={(event) => setEstudianteId(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                <option value="" disabled>
                  Selecciona un estudiante
                </option>
                {estudiantes.map((estudiante) => (
                  <option key={estudiante.id} value={estudiante.id}>
                    {estudiante.nombre} · {estudiante.curso}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Barrera detectada
              </span>
              <p className="mb-2 text-xs leading-relaxed text-slate-500">
                {BARRERA_DETECTADA_AYUDA}
              </p>
              <textarea
                value={barreraDetectada}
                onChange={(event) => setBarreraDetectada(event.target.value)}
                required
                rows={3}
                className="w-full resize-y rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder={GLOSSARY.barreras.placeholderObjetivo}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Nombre del objetivo
              </span>
              <input
                type="text"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Ej: Identificación emocional"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Meta de logro observable
              </span>
              <p className="mb-2 text-xs leading-relaxed text-slate-500">
                Define el criterio observable que permitirá evaluar el avance del
                objetivo.
              </p>
              <textarea
                value={metaLogro}
                onChange={(event) => setMetaLogro(event.target.value)}
                required
                rows={3}
                className="w-full resize-y rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder='Ej: "Utilizar estrategias de regulación emocional de forma autónoma en 80% de las ocasiones."'
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Dimensión relacionada
              </span>
              <select
                value={dimensionRelacionada}
                onChange={(event) => setDimensionRelacionada(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              >
                {PIE_DIMENSION_OPTIONS.map((dimension) => (
                  <option key={dimension} value={dimension}>
                    {dimension}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-xl border border-sky-100 bg-sky-50/30 p-4">
              <p className="text-sm font-medium text-slate-800">
                Línea base pedagógica
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Situación inicial del estudiante antes del seguimiento.
              </p>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Línea base{" "}
                    <span className="font-normal text-slate-400">(opcional)</span>
                  </span>
                  <textarea
                    value={lineaBase}
                    onChange={(event) => setLineaBase(event.target.value)}
                    rows={3}
                    className="w-full resize-y rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    placeholder='Ej: "Reconoce 1 de 5 emociones básicas."'
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Fecha de línea base{" "}
                    <span className="font-normal text-slate-400">(opcional)</span>
                  </span>
                  <input
                    type="date"
                    value={fechaLineaBase}
                    onChange={(event) => setFechaLineaBase(event.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </label>
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Descripción{" "}
                <span className="font-normal text-slate-400">(opcional)</span>
              </span>
              <textarea
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
                rows={3}
                className="w-full resize-y rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Contexto o foco del objetivo..."
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={
                isSaving ||
                !estudianteId ||
                !barreraDetectada.trim() ||
                !metaLogro.trim() ||
                !nombre.trim()
              }
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Guardar cambios
            </button>
          </div>
        </form>
        </div>
      </main>
    </AppShell>
  );
}
