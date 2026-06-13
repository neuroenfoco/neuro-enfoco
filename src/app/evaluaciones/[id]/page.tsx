"use client";

import { AppShell } from "@/components/layout/app-shell";
import { EvaluacionCapturaWizard } from "@/components/evaluacion-integral/EvaluacionCapturaWizard";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import Link from "next/link";
import { use } from "react";

type EvaluacionCapturaPageProps = {
  params: Promise<{ id: string }>;
};

export default function EvaluacionCapturaPage({
  params,
}: EvaluacionCapturaPageProps) {
  const { id } = use(params);
  const copy = GLOSSARY.evaluacionCaptura;

  return (
    <AppShell activeNav="estudiantes">
      <div className="mx-auto max-w-4xl">
        <EvaluacionCapturaWizard evaluacionId={id} />
        <p className="mt-8 text-center">
          <Link
            href={ROUTES.estudiantes}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            {copy.volverEstudiantes}
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
