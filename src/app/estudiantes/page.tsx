"use client";

import { AppShell } from "@/components/layout/app-shell";
import { EliminarEstudianteDialog } from "@/components/estudiantes/EliminarEstudianteDialog";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getEstudianteIniciales,
  getEstudiantes,
  isProtectedEstudiante,
  type Estudiante,
} from "@/lib/students-storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function EstudiantesPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Estudiante[]>([]);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Estudiante | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("eliminado") === "1") {
      setDeleteMessage(GLOSSARY.estudiante.eliminarExito);
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

  useEffect(() => {
    if (!openMenuId) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [openMenuId]);

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
            href="/estudiantes/ingreso"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700"
          >
            {GLOSSARY.ingresoPie.titulo}
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
              <div className="flex items-center gap-2 rounded-2xl border border-teal-200/70 bg-white p-2 shadow-[0_1px_3px_rgba(15,60,50,0.06)] transition hover:border-teal-300 hover:shadow-md">
                <Link
                  href={`/estudiantes/${student.id}`}
                  className="flex min-w-0 flex-1 items-center gap-4 rounded-xl p-3 transition hover:bg-teal-50/40"
                >
                  <StudentRow
                    name={student.nombre}
                    course={student.curso}
                    initials={getEstudianteIniciales(student.nombre)}
                  />
                  <span className="ml-auto shrink-0 text-sm font-medium text-teal-700">
                    Ver ficha
                  </span>
                </Link>

                <div
                  className="relative shrink-0 pr-2"
                  ref={openMenuId === student.id ? menuRef : undefined}
                >
                  <button
                    type="button"
                    aria-label={`Acciones para ${student.nombre}`}
                    aria-expanded={openMenuId === student.id}
                    onClick={() =>
                      setOpenMenuId((current) =>
                        current === student.id ? null : student.id
                      )
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                  >
                    <span aria-hidden>⋯</span>
                  </button>

                  {openMenuId === student.id && (
                    <div className="absolute right-0 top-full z-10 mt-1 min-w-[10rem] rounded-xl border border-slate-200/80 bg-white py-1 shadow-lg">
                      <Link
                        href={`/estudiantes/${student.id}`}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setOpenMenuId(null)}
                      >
                        Ver ficha
                      </Link>
                      {!isProtectedEstudiante(student.id) && (
                        <button
                          type="button"
                          className="block w-full px-4 py-2 text-left text-sm text-rose-700 hover:bg-rose-50"
                          onClick={() => {
                            setOpenMenuId(null);
                            setDeleteTarget(student);
                          }}
                        >
                          {GLOSSARY.estudiante.eliminarAccionListado}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {deleteTarget && (
        <EliminarEstudianteDialog
          open
          estudianteId={deleteTarget.id}
          estudianteNombre={deleteTarget.nombre}
          onClose={() => setDeleteTarget(null)}
          onDeleted={() => {
            setDeleteTarget(null);
            setStudents(getEstudiantes());
            router.push("/estudiantes?eliminado=1");
          }}
        />
      )}
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
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 text-sm font-semibold text-white">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-slate-900">{name}</p>
        <p className="text-sm text-slate-500">{course}</p>
      </div>
    </>
  );
}
