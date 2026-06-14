"use client";

import { AppShell } from "@/components/layout/app-shell";
import {
  EstudianteDatosBasicosForm,
  type EstudianteDatosBasicosValues,
} from "@/components/estudiantes/EstudianteDatosBasicosForm";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import { saveEstudiante } from "@/lib/students-storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NuevoEstudiantePage() {
  const router = useRouter();
  const copy = GLOSSARY.estudiante;
  const [values, setValues] = useState<EstudianteDatosBasicosValues>({
    nombre: "",
    curso: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleSubmit(nextValues: EstudianteDatosBasicosValues) {
    if (isSaving) return;

    const nombre = nextValues.nombre.trim();
    const curso = nextValues.curso.trim();

    if (!nombre) {
      setError(copy.errorNombreRequerido);
      return;
    }

    if (!curso) {
      setError(copy.errorCursoRequerido);
      return;
    }

    setIsSaving(true);
    setError(null);

    const estudiante = saveEstudiante({ nombre, curso });
    router.push(`/estudiantes/${estudiante.id}`);
  }

  return (
    <AppShell activeNav="estudiantes">
      <main className="flex-1 px-8 py-10">
        <div className="mx-auto flex w-full max-w-2xl flex-col">
          <div className="mb-8">
            <Link
              href={ROUTES.estudiantes}
              className="text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              ← {copy.volverListado}
            </Link>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
              {copy.nuevoTitulo}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{copy.nuevoSubtitulo}</p>
            <p className="mt-3 text-sm text-slate-500">
              {copy.nuevoNotaIngresoPie}{" "}
              <Link
                href={ROUTES.estudiantesIngreso}
                className="font-medium text-teal-700 hover:text-teal-800"
              >
                {GLOSSARY.ingresoPie.titulo}
              </Link>
              .
            </p>
          </div>

          <EstudianteDatosBasicosForm
            values={values}
            isSaving={isSaving}
            error={error}
            onChange={setValues}
            onSubmit={handleSubmit}
            onCancel={() => router.push(ROUTES.estudiantes)}
          />
        </div>
      </main>
    </AppShell>
  );
}
