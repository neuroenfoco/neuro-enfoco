"use client";

import {
  PIE_DIMENSION_OPTIONS,
  saveObjetivoPIE,
} from "@/lib/pie-objectives-storage";
import { getEstudiantes } from "@/lib/students-storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NuevoObjetivoPage() {
  const router = useRouter();

  const [estudiantes, setEstudiantes] = useState(
    () => (typeof window !== "undefined" ? getEstudiantes() : [])
  );
  const [estudianteId, setEstudianteId] = useState("");
  const [nombre, setNombre] = useState("");
  const [dimensionRelacionada, setDimensionRelacionada] = useState<string>(
    PIE_DIMENSION_OPTIONS[0]
  );
  const [descripcion, setDescripcion] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEstudiantes(getEstudiantes());

    const preselectedEstudianteId = new URLSearchParams(
      window.location.search
    ).get("estudianteId");
    if (preselectedEstudianteId) {
      setEstudianteId(preselectedEstudianteId);
    }
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving || !estudianteId || !nombre.trim()) return;

    setIsSaving(true);
    saveObjetivoPIE({
      estudianteId,
      nombre,
      dimensionRelacionada,
      descripcion: descripcion.trim() || undefined,
    });
    router.push("/objetivos");
  }

  return (
    <div className="flex min-h-screen bg-[#f4f7f6] text-slate-800">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-8 py-10">
        <div className="mb-8">
          <Link
            href="/objetivos"
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← Volver a objetivos
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
            Nuevo objetivo PIE
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Las evidencias se generarán automáticamente desde las sesiones que
            incluyan la dimensión seleccionada.
          </p>
        </div>

        {estudiantes.length === 0 ? (
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-6 text-sm text-amber-900">
            <p>Primero debes registrar al menos un estudiante.</p>
            <Link
              href="/estudiantes/nuevo"
              className="mt-3 inline-flex font-medium text-teal-700 hover:text-teal-800"
            >
              Crear estudiante
            </Link>
          </div>
        ) : (
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
                  Dimensión relacionada
                </span>
                <select
                  value={dimensionRelacionada}
                  onChange={(event) =>
                    setDimensionRelacionada(event.target.value)
                  }
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
                disabled={isSaving || !estudianteId}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Guardar objetivo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
