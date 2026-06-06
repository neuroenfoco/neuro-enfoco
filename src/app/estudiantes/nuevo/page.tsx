"use client";

import { saveEstudiante } from "@/lib/students-storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NuevoEstudiantePage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [curso, setCurso] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving || !nombre.trim() || !curso.trim()) return;

    setIsSaving(true);
    saveEstudiante({ nombre, curso });
    router.push("/estudiantes");
  }

  return (
    <div className="flex min-h-screen bg-[#f4f7f6] text-slate-800">
      <div className="mx-auto flex w-full max-w-3xl flex-col px-8 py-10">
        <div className="mb-8">
          <Link
            href="/estudiantes"
            className="text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            ← Volver a estudiantes
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
            Nuevo estudiante
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Registra un estudiante para comenzar a documentar su ficha.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]"
        >
          <div className="space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Nombre
              </span>
              <input
                type="text"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Ej: Tomás Herrera"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">
                Curso
              </span>
              <input
                type="text"
                value={curso}
                onChange={(event) => setCurso(event.target.value)}
                required
                className="w-full rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Ej: 4° Básico"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Guardar estudiante
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
