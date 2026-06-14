"use client";

import { GLOSSARY } from "@/lib/copy/glossary";
import type { DashboardIndicadoresView } from "@/lib/dashboard/dashboard-view";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const COPY = GLOSSARY.dashboard.indicadores;

type IndicadorConfig = {
  key: keyof DashboardIndicadoresView;
  label: string;
  accent: string;
  icon: IconComponent;
};

const INDICADORES: IndicadorConfig[] = [
  {
    key: "estudiantesActivos",
    label: COPY.estudiantesActivos,
    accent: "bg-teal-50 text-teal-700 ring-teal-100",
    icon: UsersIcon,
  },
  {
    key: "evaluacionesIntegrales",
    label: COPY.evaluacionesIntegrales,
    accent: "bg-sky-50 text-sky-700 ring-sky-100",
    icon: ClipboardIcon,
  },
  {
    key: "estudiantesSinEvaluacion",
    label: COPY.estudiantesSinEvaluacion,
    accent: "bg-amber-50 text-amber-800 ring-amber-100",
    icon: AlertCircleIcon,
  },
  {
    key: "objetivosActivos",
    label: COPY.objetivosActivos,
    accent: "bg-violet-50 text-violet-700 ring-violet-100",
    icon: TargetIcon,
  },
  {
    key: "objetivosConSeguimiento",
    label: COPY.objetivosConSeguimiento,
    accent: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    icon: ActivityIcon,
  },
  {
    key: "objetivosEnRiesgo",
    label: COPY.objetivosEnRiesgo,
    accent: "bg-rose-50 text-rose-700 ring-rose-100",
    icon: AlertTriangleIcon,
  },
  {
    key: "pacisVigentes",
    label: COPY.pacisVigentes,
    accent: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    icon: FileCheckIcon,
  },
  {
    key: "pacisBorrador",
    label: COPY.pacisBorrador,
    accent: "bg-orange-50 text-orange-800 ring-orange-100",
    icon: FileEditIcon,
  },
  {
    key: "intervencionesUltimoMes",
    label: COPY.intervencionesUltimoMes,
    accent: "bg-cyan-50 text-cyan-800 ring-cyan-100",
    icon: HandHeartIcon,
  },
  {
    key: "evidenciasUltimoMes",
    label: COPY.evidenciasUltimoMes,
    accent: "bg-teal-50 text-teal-800 ring-teal-100",
    icon: CameraIcon,
  },
  {
    key: "apoyosActivos",
    label: COPY.apoyosActivos,
    accent: "bg-lime-50 text-lime-800 ring-lime-100",
    icon: LifeBuoyIcon,
  },
  {
    key: "apoyosSuspendidos",
    label: COPY.apoyosSuspendidos,
    accent: "bg-yellow-50 text-yellow-800 ring-yellow-100",
    icon: PauseCircleIcon,
  },
  {
    key: "apoyosFinalizados",
    label: COPY.apoyosFinalizados,
    accent: "bg-slate-50 text-slate-700 ring-slate-100",
    icon: CheckCircleIcon,
  },
  {
    key: "apoyosConActividad",
    label: COPY.apoyosConActividad,
    accent: "bg-emerald-50 text-emerald-800 ring-emerald-100",
    icon: LinkIcon,
  },
  {
    key: "apoyosSinActividad",
    label: COPY.apoyosSinActividad,
    accent: "bg-stone-50 text-stone-600 ring-stone-100",
    icon: UnlinkIcon,
  },
  {
    key: "apoyosConEvidencia",
    label: COPY.apoyosConEvidencia,
    accent: "bg-green-50 text-green-800 ring-green-100",
    icon: ShieldCheckIcon,
  },
];

type DashboardIndicadoresCardProps = {
  indicadores: DashboardIndicadoresView;
};

export function DashboardIndicadoresCard({
  indicadores,
}: DashboardIndicadoresCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
          {COPY.titulo}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{COPY.subtitulo}</p>
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {INDICADORES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="rounded-xl border border-slate-100 bg-gradient-to-br from-white to-slate-50/80 p-4 transition hover:border-teal-100"
            >
              <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ${item.accent}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <dt className="text-xs font-medium text-slate-500">{item.label}</dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
                {indicadores[item.key]}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
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
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" />
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
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function FileCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 15l2 2 4-4" />
    </svg>
  );
}

function FileEditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M10 13h4M10 17h2" />
    </svg>
  );
}

function HandHeartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
      <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
      <path d="m2 15 6 6" />
      <path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.7 2.7 0 0 0 16 4c-1 0-1.9.5-2.5 1.3" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function LifeBuoyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M9.17 14.83l-4.24 4.24" />
    </svg>
  );
}

function PauseCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M10 15V9M14 15V9" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function UnlinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71" />
      <path d="m5.16 11.75-1.71 1.71h.02a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71" />
      <path d="M8 12h8" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
