"use client";

import { AppShell } from "@/components/layout/app-shell";
import {
  ProfesionalForm,
  type ProfesionalFormValues,
} from "@/components/institucional/ProfesionalForm";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import { getProfesionalesRepository } from "@/lib/repositories/repository-factory";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NuevoProfesionalPage() {
  const router = useRouter();
  const copy = GLOSSARY.profesional;
  const [isSaving, setIsSaving] = useState(false);

  function handleSubmit(values: ProfesionalFormValues) {
    if (isSaving) return;

    setIsSaving(true);
    const saved = getProfesionalesRepository().save({
      nombres: values.nombres,
      apellidos: values.apellidos,
      rolPrincipalId: values.rolPrincipalId,
      email: values.email,
      activo: values.activo,
    });

    if (!saved) {
      setIsSaving(false);
      return;
    }

    router.push(ROUTES.profesionales);
  }

  return (
    <AppShell activeNav="profesionales">
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
              {copy.tituloNuevo}
            </h1>
            <p className="mt-1 text-sm text-slate-600">{copy.subtituloNuevo}</p>
          </div>

          <ProfesionalForm
            mode="create"
            isSaving={isSaving}
            onSubmit={handleSubmit}
            onCancel={() => router.push(ROUTES.profesionales)}
          />
        </div>
      </main>
    </AppShell>
  );
}
