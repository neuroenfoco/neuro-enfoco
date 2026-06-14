"use client";

import { ReportesInstitucionales } from "@/components/reportes/ReportesInstitucionales";
import { AppShell } from "@/components/layout/app-shell";
import { GLOSSARY } from "@/lib/copy/glossary";

export default function ReportesPage() {
  return (
    <AppShell activeNav="reportes">
      <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-6 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {GLOSSARY.reportes.titulo}
          </h1>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
            {GLOSSARY.reportes.subtitulo}
          </p>
        </div>
      </header>

      <main className="flex-1 px-8 py-8">
        <ReportesInstitucionales />
      </main>
    </AppShell>
  );
}
