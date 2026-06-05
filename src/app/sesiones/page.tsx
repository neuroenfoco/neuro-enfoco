import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const navItems = [
  { label: "Dashboard", href: "/", active: false, icon: LayoutDashboardIcon },
  { label: "Estudiantes", href: "/estudiantes", active: false, icon: UsersIcon },
  { label: "Sesiones", href: "/sesiones", active: true, icon: CalendarIcon },
  { label: "Objetivos", href: "#", active: false, icon: TargetIcon },
  { label: "Reportes", href: "#", active: false, icon: ChartIcon },
] as const;

const sessions = [
  {
    id: 1,
    date: "3 jun 2026",
    student: "Martina Ramírez",
    course: "3° Básico",
    space: "Sala Multisensorial",
    initialState: { emoji: "😕", label: "Alterada" },
    finalState: { emoji: "🙂", label: "Regulada" },
    strengths: ["Persistencia", "Empatía"],
    pie: true,
    leyTea: false,
  },
  {
    id: 2,
    date: "2 jun 2026",
    student: "Tomás Villanueva",
    course: "5° Básico · PIE",
    space: "Espacio de Calma",
    initialState: { emoji: "😣", label: "Muy alterada" },
    finalState: { emoji: "😐", label: "Neutral" },
    strengths: ["Persistencia", "Comunicación"],
    pie: true,
    leyTea: false,
  },
  {
    id: 3,
    date: "1 jun 2026",
    student: "Sofía Morales",
    course: "2° Básico · Ley TEA",
    space: "Aula",
    initialState: { emoji: "😐", label: "Neutral" },
    finalState: { emoji: "😄", label: "Muy regulada" },
    strengths: ["Empatía", "Creatividad", "Comunicación"],
    pie: false,
    leyTea: true,
  },
  {
    id: 4,
    date: "30 may 2026",
    student: "Diego López",
    course: "4° Básico",
    space: "Patio",
    initialState: { emoji: "😕", label: "Alterada" },
    finalState: { emoji: "🙂", label: "Regulada" },
    strengths: ["Curiosidad", "Autonomía"],
    pie: false,
    leyTea: false,
  },
  {
    id: 5,
    date: "29 may 2026",
    student: "Martina Ramírez",
    course: "3° Básico",
    space: "Espacio de Calma",
    initialState: { emoji: "😐", label: "Neutral" },
    finalState: { emoji: "😄", label: "Muy regulada" },
    strengths: ["Persistencia", "Creatividad"],
    pie: true,
    leyTea: true,
  },
  {
    id: 6,
    date: "28 may 2026",
    student: "Valentina Pérez",
    course: "6° Básico",
    space: "Sala Multisensorial",
    initialState: { emoji: "😣", label: "Muy alterada" },
    finalState: { emoji: "😕", label: "Alterada" },
    strengths: ["Empatía"],
    pie: true,
    leyTea: false,
  },
  {
    id: 7,
    date: "27 may 2026",
    student: "Benjamín Arévalo",
    course: "1° Básico",
    space: "Otro",
    initialState: { emoji: "😕", label: "Alterada" },
    finalState: { emoji: "😐", label: "Neutral" },
    strengths: ["Comunicación", "Autonomía"],
    pie: false,
    leyTea: true,
  },
] as const;

export default function SesionesPage() {
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
              <p className="truncate text-sm font-medium text-slate-800">
                Equipo PIE
              </p>
              <p className="truncate text-xs text-slate-500">Colegio Demo</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col pl-64">
        <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-5 backdrop-blur-md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Historial de Sesiones
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Registro completo de sesiones · fortalezas y evidencias
              </p>
            </div>
            <Link
              href="/sesiones/nueva"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700"
            >
              <PlusIcon className="h-4 w-4" />
              Nueva Sesión
            </Link>
          </div>
        </header>

        <main className="flex-1 px-8 py-8">
          <section className="mb-6 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Filtros
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <FilterField label="Estudiante">
                <select
                  className="w-full rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  defaultValue=""
                  aria-label="Filtrar por estudiante"
                >
                  <option value="">Todos los estudiantes</option>
                  <option>Martina Ramírez</option>
                  <option>Tomás Villanueva</option>
                  <option>Sofía Morales</option>
                  <option>Diego López</option>
                </select>
              </FilterField>
              <FilterField label="Espacio">
                <select
                  className="w-full rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  defaultValue=""
                  aria-label="Filtrar por espacio"
                >
                  <option value="">Todos los espacios</option>
                  <option>Sala Multisensorial</option>
                  <option>Espacio de Calma</option>
                  <option>Aula</option>
                  <option>Patio</option>
                  <option>Otro</option>
                </select>
              </FilterField>
              <FilterField label="Fecha">
                <input
                  type="date"
                  className="w-full rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  aria-label="Filtrar por fecha"
                />
              </FilterField>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Fecha
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Estudiante
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Espacio
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Estado Inicial
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Estado Final
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Fortalezas Observadas
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-slate-700">
                      Evidencias
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.map((session) => (
                    <tr
                      key={session.id}
                      className="transition hover:bg-teal-50/20"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {session.date}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {session.student}
                        </p>
                        <p className="text-xs text-slate-500">{session.course}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                          {session.space}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <EmotionBadge {...session.initialState} />
                      </td>
                      <td className="px-5 py-4">
                        <EmotionBadge {...session.finalState} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex max-w-[220px] flex-wrap gap-1.5">
                          {session.strengths.map((strength) => (
                            <span
                              key={strength}
                              className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-800"
                            >
                              {strength}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <EvidenceBadge
                            label="PIE"
                            active={session.pie}
                            activeClass="bg-violet-50 text-violet-700 ring-violet-100"
                          />
                          <EvidenceBadge
                            label="Ley TEA"
                            active={session.leyTea}
                            activeClass="bg-teal-50 text-teal-700 ring-teal-100"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              {sessions.length} sesiones registradas · datos de ejemplo
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

function FilterField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-slate-600">
        {label}
      </span>
      {children}
    </label>
  );
}

function EmotionBadge({
  emoji,
  label,
}: {
  emoji: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700">
      <span aria-hidden>{emoji}</span>
      {label}
    </span>
  );
}

function EvidenceBadge({
  label,
  active,
  activeClass,
}: {
  label: string;
  active: boolean;
  activeClass: string;
}) {
  if (!active) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-slate-100 bg-slate-50/50 px-2 py-0.5 text-xs font-medium text-slate-400">
        {label}
        <span className="text-slate-300">—</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${activeClass}`}
    >
      {label}
      <span aria-hidden>✓</span>
    </span>
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
          active
            ? "text-teal-700"
            : "text-slate-400 group-hover:text-teal-600/80"
        }`}
      />
      {label}
    </Link>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
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
