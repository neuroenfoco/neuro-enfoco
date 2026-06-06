"use client";

import {
  deleteObjetivoPIE,
  formatImpactoPromedio,
  getObjetivosPIEResumen,
  type ObjetivoPIEResumen,
} from "@/lib/pie-objectives-storage";
import { getEstudianteById } from "@/lib/students-storage";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const navItems = [
  { label: "Dashboard", href: "/", active: false, icon: LayoutDashboardIcon },
  { label: "Estudiantes", href: "/estudiantes", active: false, icon: UsersIcon },
  { label: "Sesiones", href: "/sesiones", active: false, icon: CalendarIcon },
  { label: "Objetivos", href: "/objetivos", active: true, icon: TargetIcon },
  { label: "Reportes", href: "#", active: false, icon: ChartIcon },
] as const;

export default function ObjetivosPage() {
  const [objetivos, setObjetivos] = useState<ObjetivoPIEResumen[]>([]);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  function refreshObjetivos() {
    setObjetivos(getObjetivosPIEResumen());
  }

  useEffect(() => {
    refreshObjetivos();
    window.addEventListener("focus", refreshObjetivos);
    window.addEventListener("storage", refreshObjetivos);

    return () => {
      window.removeEventListener("focus", refreshObjetivos);
      window.removeEventListener("storage", refreshObjetivos);
    };
  }, []);

  function handleConfirmDelete() {
    if (!pendingDeleteId) return;

    const deleted = deleteObjetivoPIE(pendingDeleteId);
    setPendingDeleteId(null);

    if (deleted) {
      refreshObjetivos();
      setDeleteMessage("Objetivo eliminado correctamente.");
      window.setTimeout(() => setDeleteMessage(null), 4000);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f4f7f6] text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-teal-900/5 bg-white">
        <div className="flex h-[4.25rem] items-center gap-2.5 border-b border-teal-900/5 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 shadow-sm shadow-teal-600/20">
            <BrainIcon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-slate-900">
              Neuro Enfoco
            </p>
            <p className="truncate text-[11px] font-medium text-teal-700/80">
              Neurobienestar escolar
            </p>
          </div>
        </div>
        <div className="mx-3 mt-4 rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-emerald-50/50 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-700/70">
            Enfoque
          </p>
          <p className="mt-0.5 text-xs leading-snug text-slate-600">
            Fortalezas · PIE · Ley TEA · Perfil evolutivo
          </p>
        </div>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </nav>
        <div className="border-t border-teal-900/5 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-800">
              EP
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-800">Equipo PIE</p>
              <p className="truncate text-xs text-slate-500">Colegio Demo</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pl-64">
        <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-6 backdrop-blur-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Objetivos PIE
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Objetivos vinculados a dimensiones observadas en sesiones
              </p>
            </div>
            <Link
              href="/objetivos/nuevo"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700"
            >
              Nuevo objetivo
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

          {objetivos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
              <p className="text-sm text-slate-600">
                Aún no hay objetivos PIE registrados.
              </p>
              <Link
                href="/objetivos/nuevo"
                className="mt-4 inline-flex text-sm font-medium text-teal-700 hover:text-teal-800"
              >
                Crear el primer objetivo
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {objetivos.map((resumen) => {
                const estudiante = getEstudianteById(resumen.objetivo.estudianteId);
                return (
                  <li key={resumen.objetivo.id}>
                    <ObjetivoCard
                      resumen={resumen}
                      estudianteNombre={estudiante?.nombre ?? "Estudiante no encontrado"}
                      onDelete={() => setPendingDeleteId(resumen.objetivo.id)}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </main>
      </div>

      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-objetivo-dialog-title"
          >
            <h2
              id="delete-objetivo-dialog-title"
              className="text-base font-semibold text-slate-900"
            >
              ¿Deseas eliminar este objetivo?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Las sesiones registradas no se eliminarán. Solo se quitará el
              objetivo PIE.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ObjetivoCard({
  resumen,
  estudianteNombre,
  onDelete,
}: {
  resumen: ObjetivoPIEResumen;
  estudianteNombre: string;
  onDelete: () => void;
}) {
  const { objetivo, estado, cantidadEvidencias, impactoPromedio, ultimaEvidencia } =
    resumen;

  return (
    <article className="rounded-2xl border border-violet-200/50 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-slate-500">{estudianteNombre}</p>
          <h2 className="mt-0.5 text-lg font-semibold text-slate-900">
            {objetivo.nombre}
          </h2>
          <p className="mt-1 text-sm text-violet-700">
            {objetivo.dimensionRelacionada}
          </p>
          {objetivo.descripcion && (
            <p className="mt-2 text-sm text-slate-600">{objetivo.descripcion}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
        >
          <span aria-hidden>🗑</span>
          Eliminar
        </button>
      </div>

      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Estado" value={estado} />
        <Metric
          label="Impacto promedio"
          value={`${formatImpactoPromedio(impactoPromedio)} niveles`}
        />
        <Metric label="Evidencias" value={String(cantidadEvidencias)} />
        <Metric label="Última evidencia" value={ultimaEvidencia} />
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function NavLink({
  label,
  href,
  active,
  icon: Icon,
}: {
  label: string;
  href: string;
  active: boolean;
  icon: IconComponent;
}) {
  const className = `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
    active
      ? "bg-teal-50 text-teal-900"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  }`;

  if (href === "#") {
    return (
      <span className={`${className} cursor-default`}>
        <Icon
          className={`h-[18px] w-[18px] shrink-0 ${
            active ? "text-teal-700" : "text-slate-400"
          }`}
        />
        {label}
      </span>
    );
  }

  return (
    <Link href={href} className={className} aria-current={active ? "page" : undefined}>
      <Icon
        className={`h-[18px] w-[18px] shrink-0 ${
          active ? "text-teal-700" : "text-slate-400 group-hover:text-teal-600/80"
        }`}
      />
      {label}
    </Link>
  );
}

function BrainIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 5a3 3 0 1 0-5.5 2.2A4 4 0 0 0 3 12v1a4 4 0 0 0 4 4h1" />
      <path d="M12 5a3 3 0 1 1 5.5 2.2A4 4 0 0 1 21 12v1a4 4 0 0 1-4 4h-1" />
      <path d="M12 5v14" />
      <path d="M9 14h6" />
    </svg>
  );
}

function LayoutDashboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9M13 17V5M8 17v-3" />
    </svg>
  );
}
