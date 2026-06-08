"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getEstudianteIniciales,
  getEstudiantes,
  type Estudiante,
} from "@/lib/students-storage";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EstudiantesPage() {
  const [students, setStudents] = useState<Estudiante[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("eliminado") === "1") {
      setDeleteMessage("Estudiante eliminado correctamente.");
      window.history.replaceState(null, "", "/estudiantes");
      window.setTimeout(() => setDeleteMessage(null), 4000);
    }
  }, []);

  useEffect(() => {
    function refreshStudents() {
      setStudents(getEstudiantes());
    }

    refreshStudents();
    window.addEventListener("focus", refreshStudents);
    window.addEventListener("storage", refreshStudents);

    return () => {
      window.removeEventListener("focus", refreshStudents);
      window.removeEventListener("storage", refreshStudents);
    };
  }, []);

  return (
    <AppShell activeNav="estudiantes">
      <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-6 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {GLOSSARY.nav.estudiantes}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              {GLOSSARY.estudiante.listadoSubtitulo}
            </p>
          </div>
          <Link
            href="/estudiantes/nuevo"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700"
          >
            Nuevo estudiante
          </Link>
        </div>
      </header>

      <main className="flex-1 px-8 py-8">
      {deleteMessage && (
        <p
          className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
          role="status"
        >
          {deleteMessage}
        </p>
      )}

      <ul className="space-y-3">
        {students.map((student) => (
          <li key={student.id}>
            <Link
              href={`/estudiantes/${student.id}`}
              className="flex items-center gap-4 rounded-2xl border border-teal-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)] transition hover:border-teal-300 hover:shadow-md"
            >
              <StudentRow
                name={student.nombre}
                course={student.curso}
                initials={getEstudianteIniciales(student.nombre)}
              />
              <span className="ml-auto text-sm font-medium text-teal-700">
                Ver ficha
              </span>
            </Link>
          </li>
        ))}
      </ul>
      </main>
    </AppShell>
  );
}

function StudentRow({
  name,
  course,
  initials,
}: {
  name: string;
  course: string;
  initials: string;
}) {
  return (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-sm font-semibold text-white">{initials}</div>
      <div>
        <p className="text-base font-semibold text-slate-900">{name}</p>
        <p className="text-sm text-slate-500">{course}</p>
      </div>
    </>
  );
}
