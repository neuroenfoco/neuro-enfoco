"use client";

import { IngresoPiePasoConfirmacion } from "@/components/ingreso/IngresoPiePasoConfirmacion";
import { IngresoPiePasoHallazgos } from "@/components/ingreso/IngresoPiePasoHallazgos";
import { IngresoPiePasoMarco } from "@/components/ingreso/IngresoPiePasoMarco";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  completarIngresoPIE,
  type HallazgoIngresoBorrador,
  type IngresoPieMarcoInput,
} from "@/lib/ingreso-pie";
import { validateFechasMarco } from "@/lib/marco-institucional-pie-storage";
import {
  getEstudianteById,
  getEstudiantes,
  type Estudiante,
} from "@/lib/students-storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const COPY = GLOSSARY.ingresoPie;

const PASOS = [
  { id: 1, label: COPY.pasoMarco },
  { id: 2, label: COPY.pasoPerfilEstudiante },
  { id: 3, label: COPY.pasoParticipacion },
  { id: 4, label: COPY.pasoConfirmacion },
] as const;

function todayDateInputValue(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export default function IngresoPiePage() {
  const router = useRouter();
  const [paso, setPaso] = useState<1 | 2 | 3 | 4>(1);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [estudianteId, setEstudianteId] = useState("");
  const [marco, setMarco] = useState<IngresoPieMarcoInput>({
    fechaIngresoPIE: todayDateInputValue(),
  });
  const [borradores, setBorradores] = useState<HallazgoIngresoBorrador[]>([]);

  useEffect(() => {
    const list = getEstudiantes();
    setEstudiantes(list);

    const preselected = new URLSearchParams(window.location.search).get(
      "estudianteId"
    );
    if (preselected && list.some((item) => item.id === preselected)) {
      setEstudianteId(preselected);
    }
  }, []);

  const estudianteSeleccionado = useMemo(
    () => getEstudianteById(estudianteId),
    [estudianteId, estudiantes]
  );

  const puedeAvanzarPaso1 =
    estudiantes.length > 0 && estudianteId.trim().length > 0;

  function validarPasoActual(): string | null {
    if (paso === 1) {
      if (estudiantes.length === 0) {
        return COPY.sinEstudiantes;
      }
      if (!estudianteId.trim()) {
        return COPY.errorEstudianteRequerido;
      }
      return validateFechasMarco(marco);
    }
    return null;
  }

  function handleSiguiente() {
    const validationError = validarPasoActual();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setPaso((current) => (current < 4 ? ((current + 1) as 1 | 2 | 3 | 4) : current));
  }

  function handleAnterior() {
    setError(null);
    setPaso((current) => (current > 1 ? ((current - 1) as 1 | 2 | 3 | 4) : current));
  }

  function handleCompletar() {
    if (isSubmitting) return;

    const validationError = validarPasoActual();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = completarIngresoPIE({
      estudianteId,
      marco,
      hallazgos: borradores,
    });

    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(`/estudiantes/${result.estudianteId}?tab=perfil-base`);
  }

  const estudianteResumen = estudianteSeleccionado
    ? {
        nombre: estudianteSeleccionado.nombre,
        curso: estudianteSeleccionado.curso,
      }
    : { nombre: "", curso: "" };

  return (
    <div className="flex min-h-screen bg-[#f4f7f6] text-slate-800">
      <div className="mx-auto flex w-full max-w-4xl flex-col px-8 py-10">
        <div className="mb-8">
          <Link
            href={ROUTES.estudiantes}
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← Volver a estudiantes
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
            {COPY.titulo}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">{COPY.subtitulo}</p>
        </div>

        <ol className="mb-8 flex flex-wrap gap-2">
          {PASOS.map((item) => (
            <li
              key={item.id}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                paso === item.id
                  ? "bg-teal-700 text-white"
                  : paso > item.id
                    ? "bg-teal-100 text-teal-800"
                    : "bg-slate-200/80 text-slate-600"
              }`}
            >
              {item.id}. {item.label}
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
          {paso === 1 ? (
            <IngresoPiePasoMarco
              estudiantes={estudiantes}
              estudianteId={estudianteId}
              marco={marco}
              onEstudianteIdChange={setEstudianteId}
              onMarcoChange={setMarco}
            />
          ) : null}

          {paso === 2 ? (
            <IngresoPiePasoHallazgos
              etapa="estudiante"
              borradores={borradores}
              onBorradorAgregado={(borrador) =>
                setBorradores((current) => [...current, borrador])
              }
              onBorradorEliminado={(index) =>
                setBorradores((current) =>
                  current.filter((_, itemIndex) => itemIndex !== index)
                )
              }
            />
          ) : null}

          {paso === 3 ? (
            <IngresoPiePasoHallazgos
              etapa="participacion"
              borradores={borradores}
              onBorradorAgregado={(borrador) =>
                setBorradores((current) => [...current, borrador])
              }
              onBorradorEliminado={(index) =>
                setBorradores((current) =>
                  current.filter((_, itemIndex) => itemIndex !== index)
                )
              }
            />
          ) : null}

          {paso === 4 ? (
            <IngresoPiePasoConfirmacion
              estudiante={estudianteResumen}
              marco={marco}
              borradores={borradores}
            />
          ) : null}

          {error ? (
            <p
              className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleAnterior}
              disabled={paso === 1 || isSubmitting}
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            {paso < 4 ? (
              <button
                type="button"
                onClick={handleSiguiente}
                disabled={paso === 1 && !puedeAvanzarPaso1}
                className="rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCompletar}
                disabled={isSubmitting || !puedeAvanzarPaso1}
                className="rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Guardando…" : COPY.completar}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
