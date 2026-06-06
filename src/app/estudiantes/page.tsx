"use client";

import {
  getEstudianteIniciales,
  getEstudiantes,
  type Estudiante,
} from "@/lib/students-storage";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const navItems = [
  { label: "Dashboard", href: "/", active: false, icon: LayoutDashboardIcon },
  { label: "Estudiantes", href: "/estudiantes", active: true, icon: UsersIcon },
  { label: "Sesiones", href: "/sesiones", active: false, icon: CalendarIcon },
  { label: "Objetivos", href: "/objetivos", active: false, icon: TargetIcon },
  { label: "Reportes", href: "#", active: false, icon: ChartIcon },
] as const;

function AppShell({ children, header }: { children: React.ReactNode; header: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f4f7f6] text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-teal-900/5 bg-white">
        <div className="flex h-[4.25rem] items-center gap-2.5 border-b border-teal-900/5 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 shadow-sm shadow-teal-600/20">
            <BrainIcon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-slate-900">Neuro Enfoco</p>
            <p className="truncate text-[11px] font-medium text-teal-700/80">Neurobienestar escolar</p>
          </div>
        </div>
        <div className="mx-3 mt-4 rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-emerald-50/50 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-700/70">Enfoque</p>
          <p className="mt-0.5 text-xs leading-snug text-slate-600">Fortalezas · PIE · Ley TEA · Perfil evolutivo</p>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </nav>
        <div className="border-t border-teal-900/5 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-800">EP</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">Equipo PIE</p>
              <p className="truncate text-xs text-slate-500">Colegio Demo</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col pl-64">
        {header}
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}

function NavLink({ label, href, active, icon: Icon }: { label: string; href: string; active: boolean; icon: IconComponent }) {
  return (
    <Link href={href} className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-teal-50 text-teal-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
      <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "text-teal-700" : "text-slate-400 group-hover:text-teal-600/80"}`} />
      {label}
    </Link>
  );
}

function BrainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5a3 3 0 1 0-5.5 2.2A4 4 0 0 0 3 12v1a4 4 0 0 0 4 4h1" />
      <path d="M12 5a3 3 0 1 1 5.5 2.2A4 4 0 0 1 21 12v1a4 4 0 0 1-4 4h-1" />
      <path d="M12 5v14" />
      <path d="M9 14h6" />
    </svg>
  );
}
function LayoutDashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}
function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 3v18h18" />
      <path d="M18 17V9M13 17V5M8 17v-3" />
    </svg>
  );
}


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
    <AppShell
      header={
        <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-6 backdrop-blur-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Estudiantes
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Fichas con enfoque en fortalezas y neurobienestar escolar
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
      }
    >
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
