"use client";

import { AppShell } from "@/components/layout/app-shell";
import {
  ProfesionalForm,
  profesionalToFormValues,
  type ProfesionalFormValues,
} from "@/components/institucional/ProfesionalForm";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import {
  getProfesionalById,
  updateProfesional,
} from "@/lib/institucional/profesionales-storage";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditarProfesionalPage() {
  const router = useRouter();
  const params = useParams();
  const profesionalId = String(params.id ?? "");
  const copy = GLOSSARY.profesional;

  const [initialValues, setInitialValues] = useState<
    ProfesionalFormValues | undefined
  >();
  const [isSaving, setIsSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const profesional = getProfesionalById(profesionalId);
    if (!profesional) {
      setNotFound(true);
      return;
    }

    setInitialValues(profesionalToFormValues(profesional));
  }, [profesionalId]);

  function handleSubmit(values: ProfesionalFormValues) {
    if (isSaving) return;

    setIsSaving(true);
    const updated = updateProfesional(profesionalId, {
      nombres: values.nombres,
      apellidos: values.apellidos,
      rolPrincipalId: values.rolPrincipalId,
      email: values.email,
      activo: values.activo,
    });

    if (!updated) {
      setIsSaving(false);
      return;
    }

    router.push(ROUTES.profesionales);
  }

  return (
    <AppShell activeNav="intervenciones">
      <main className="flex-1 px-8 py-10">
        <div className="mx-auto flex w-full max-w-2xl flex-col">
          <div className="mb-8">
            <Link
              href={ROUTES.profesionales}
              className="text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              ← {copy.volverListado}
            </Link>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
              {copy.tituloEditar}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{copy.subtituloEditar}</p>
          </div>

          {notFound ? (
            <p className="text-sm text-slate-500">{copy.noEncontrado}</p>
          ) : initialValues ? (
            <ProfesionalForm
              mode="edit"
              initialValues={initialValues}
              isSaving={isSaving}
              onSubmit={handleSubmit}
              onCancel={() => router.push(ROUTES.profesionales)}
            />
          ) : null}
        </div>
      </main>
    </AppShell>
  );
}
