import { AppShell } from "@/components/layout/app-shell";
import {
  DashboardDemoGate,
} from "@/components/dashboard/DashboardDemoGate";
import { CalendarIcon } from "@/components/layout/nav-icons";
import { GLOSSARY } from "@/lib/copy/glossary";
import { ROUTES } from "@/lib/copy/navigation";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const kpiCards = [
  {
    title: "Bienestar Socioemocional",
    value: "82%",
    detail: "Índice institucional saludable",
    change: "+5 pts",
    positive: true,
    icon: HeartHandshakeIcon,
    accent: "bg-teal-50 text-teal-700 ring-teal-100",
    bar: 82,
    barColor: "bg-teal-500",
  },
  {
    title: "Regulación Emocional",
    value: "7.6",
    detail: "Escala 1–10 · promedio curso",
    change: "+0.4",
    positive: true,
    icon: WavesIcon,
    accent: "bg-sky-50 text-sky-700 ring-sky-100",
    bar: 76,
    barColor: "bg-sky-500",
  },
  {
    title: "Objetivos PIE Activos",
    value: "64",
    detail: "Con evidencia documentada",
    change: "12 en seguimiento",
    positive: true,
    icon: ClipboardCheckIcon,
    accent: "bg-violet-50 text-violet-700 ring-violet-100",
    bar: 68,
    barColor: "bg-violet-500",
  },
  {
    title: "Participación Familiar",
    value: "91%",
    detail: "Apoderados conectados al plan",
    change: "+18%",
    positive: true,
    icon: HomeHeartIcon,
    accent: "bg-amber-50 text-amber-800 ring-amber-100",
    bar: 91,
    barColor: "bg-amber-500",
  },
] as const;

const strengths = [
  {
    name: "Persistencia",
    description: "Mantiene el esfuerzo ante desafíos académicos",
    count: 24,
    gradient: "from-teal-500/20 to-emerald-400/10",
    icon: MountainIcon,
    iconBg: "bg-teal-100 text-teal-700",
  },
  {
    name: "Empatía",
    description: "Reconoce y valida emociones de sus pares",
    count: 19,
    gradient: "from-rose-400/20 to-orange-300/10",
    icon: HeartIcon,
    iconBg: "bg-rose-100 text-rose-700",
  },
  {
    name: "Creatividad",
    description: "Propone soluciones diversas en actividades",
    count: 16,
    gradient: "from-violet-400/20 to-indigo-300/10",
    icon: SparklesIcon,
    iconBg: "bg-violet-100 text-violet-700",
  },
  {
    name: "Comunicación",
    description: "Expresa necesidades con claridad y respeto",
    count: 21,
    gradient: "from-sky-400/20 to-cyan-300/10",
    icon: MessageIcon,
    iconBg: "bg-sky-100 text-sky-700",
  },
] as const;

const profileDimensions = [
  { label: "Regulación emocional", value: 78, color: "bg-sky-500" },
  { label: "Interacción social", value: 72, color: "bg-teal-500" },
  { label: "Comunicación", value: 81, color: "bg-violet-500" },
  { label: "Autonomía", value: 69, color: "bg-emerald-500" },
  { label: "Participación escolar", value: 85, color: "bg-amber-500" },
  { label: "Bienestar percibido", value: 88, color: "bg-rose-400" },
  { label: "Fortalezas y talentos", value: 92, color: "bg-indigo-500" },
] as const;

const studentAchievements = [
  {
    id: 1,
    student: "Registro reciente",
    course: "PIE",
    text: GLOSSARY.dashboard.logroRegulacion,
    tag: "Regulación emocional",
    time: "Reciente",
    tagStyle: "bg-sky-50 text-sky-700",
  },
  {
    id: 2,
    student: "Evidencia documentada",
    course: GLOSSARY.estudiante.cursoPie,
    text: GLOSSARY.dashboard.logroFrustracion,
    tag: "Evidencia PIE",
    time: "Esta semana",
    tagStyle: "bg-violet-50 text-violet-700",
  },
  {
    id: 3,
    student: "Participación escolar",
    course: GLOSSARY.estudiante.cursoConApoyosLey,
    text: "Participación favorable documentada en intervención grupal.",
    tag: "Ley TEA",
    time: "Esta semana",
    tagStyle: "bg-teal-50 text-teal-700",
  },
  {
    id: 4,
    student: "Perfil evolutivo",
    course: "Seguimiento",
    text: GLOSSARY.dashboard.logroEmociones,
    tag: "Perfil evolutivo",
    time: "Últimos días",
    tagStyle: "bg-amber-50 text-amber-800",
  },
] as const;

const upcomingSessions = [
  {
    id: 1,
    student: "Benjamín A.",
    type: "Co-regulación emocional",
    time: "Hoy, 10:30",
  },
  {
    id: 2,
    student: "Valentina P.",
    type: "Seguimiento objetivos PIE",
    time: "Hoy, 14:00",
  },
  {
    id: 3,
    student: "Diego L.",
    type: "Perfil socioemocional evolutivo",
    time: "Mañana, 09:15",
  },
] as const;

const institutionalImpact = {
  percentage: 74,
  studentsWithProgress: 95,
  totalStudents: 128,
} as const;

const pieEvidence = {
  compliance: 92,
  activeObjectives: 64,
  studentsWithEvidence: 48,
} as const;

const leyTeaEvidence = {
  compliance: 87,
  studentsWithAdjustments: 23,
  supportsRegistered: 156,
} as const;

const multisensorialRoom = {
  sessions: 48,
  utilization: 72,
} as const;

export default function Home() {
  return (
    <AppShell activeNav="dashboard">
      <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-5 backdrop-blur-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-teal-200/60 bg-teal-50/80 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-teal-800">
                <LeafIcon className="h-3 w-3" />
                Neurobienestar escolar
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                {GLOSSARY.dashboard.titulo}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                {GLOSSARY.dashboard.subtitulo}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/30"
              >
                <CalendarIcon className="h-4 w-4 text-teal-600/70" />
                Junio 2026
              </button>
              <Link
                href={ROUTES.intervencionesNueva}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700"
              >
                {GLOSSARY.intervencion.registrarCta}
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-8 px-8 py-8">
          <DashboardDemoGate>
          <section>
            <SectionHeading
              title="Indicadores de bienestar"
              subtitle={`Vista consolidada del curso · ${GLOSSARY.dashboard.seccionDemo}`}
            />
            <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {kpiCards.map((card) => (
                <KpiCard key={card.title} {...card} />
              ))}
            </div>
          </section>

          <section>
            <SectionHeading
              title="Fortalezas observadas esta semana"
              subtitle={`Enfoque basado en capacidades y talentos del estudiante · ${GLOSSARY.dashboard.seccionDemo}`}
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {strengths.map((item) => (
                <StrengthCard key={item.name} {...item} />
              ))}
            </div>
          </section>

          <section>
            <InstitutionalImpactCard
              percentage={institutionalImpact.percentage}
              studentsWithProgress={institutionalImpact.studentsWithProgress}
              totalStudents={institutionalImpact.totalStudents}
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-3">
            <PieEvidenceCard
              compliance={pieEvidence.compliance}
              activeObjectives={pieEvidence.activeObjectives}
              studentsWithEvidence={pieEvidence.studentsWithEvidence}
            />
            <LeyTeaEvidenceCard
              compliance={leyTeaEvidence.compliance}
              studentsWithAdjustments={leyTeaEvidence.studentsWithAdjustments}
              supportsRegistered={leyTeaEvidence.supportsRegistered}
            />
            <MultisensorialRoomCard
              sessions={multisensorialRoom.sessions}
              utilization={multisensorialRoom.utilization}
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-5">
            <div className="xl:col-span-3 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Perfil Socioemocional Evolutivo
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Promedio institucional · 7 dimensiones de desarrollo
                  </p>
                </div>
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                  Vista agregada
                </span>
              </div>
              <ul className="space-y-4">
                {profileDimensions.map((dim) => (
                  <li key={dim.label}>
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-slate-700">
                        {dim.label}
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-slate-900">
                        {dim.value}%
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${dim.color} transition-all`}
                        style={{ width: `${dim.value}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
                {GLOSSARY.intervencion.perfilEvolutivoPie}
              </p>
            </div>

            <div className="xl:col-span-2 space-y-6">
              <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
                <h2 className="text-base font-semibold text-slate-900">
                  {GLOSSARY.dashboard.logrosRecientes}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Registros recientes centrados en avances y fortalezas
                </p>
                <ul className="mt-5 space-y-4">
                  {studentAchievements.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-teal-100 hover:bg-teal-50/20"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">
                          {item.student}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500">
                          {item.course}
                        </span>
                        <span
                          className={`ml-auto rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${item.tagStyle}`}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {item.text}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">{item.time}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
                <h2 className="text-base font-semibold text-slate-900">
                  {GLOSSARY.intervencion.proximas}
                </h2>
                <ul className="mt-4 space-y-3">
                  {upcomingSessions.map((session) => (
                    <li
                      key={session.id}
                      className="rounded-xl border border-teal-50 bg-gradient-to-r from-teal-50/40 to-transparent px-4 py-3"
                    >
                      <p className="text-sm font-medium text-slate-800">
                        {session.student}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {session.type} · {session.time}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          </DashboardDemoGate>
        </main>
    </AppShell>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function KpiCard({
  title,
  value,
  detail,
  change,
  positive,
  icon: Icon,
  accent,
  bar,
  barColor,
}: {
  title: string;
  value: string;
  detail: string;
  change: string;
  positive: boolean;
  icon: IconComponent;
  accent: string;
  bar: number;
  barColor: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_3px_rgba(15,60,50,0.06)] transition hover:border-teal-200/50 hover:shadow-[0_4px_14px_rgba(15,80,60,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${accent}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            positive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {change}
        </span>
      </div>
      <p className="mt-4 text-sm font-medium leading-snug text-slate-600">
        {title}
      </p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${bar}%` }}
        />
      </div>
    </article>
  );
}

function StrengthCard({
  name,
  description,
  count,
  gradient,
  icon: Icon,
  iconBg,
}: {
  name: string;
  description: string;
  count: number;
  gradient: string;
  icon: IconComponent;
  iconBg: string;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br ${gradient} p-5 transition hover:border-teal-200/60 hover:shadow-md`}
    >
      <div className="relative z-10">
        <div
          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">{name}</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
          {description}
        </p>
        <p className="mt-4 text-xs font-medium text-teal-800">
          {count} observaciones esta semana
        </p>
      </div>
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
    </article>
  );
}

function InstitutionalImpactCard({
  percentage,
  studentsWithProgress,
  totalStudents,
}: {
  percentage: number;
  studentsWithProgress: number;
  totalStudents: number;
}) {
  return (
    <article className="relative overflow-hidden rounded-2xl border-2 border-teal-200/80 bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/60 p-6 shadow-[0_4px_20px_rgba(15,80,60,0.1)] sm:p-8">
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-200/60 bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-teal-800">
            <TrendingUpIcon className="h-3 w-3" />
            Indicador estratégico
          </span>
          <h2 className="mt-3 text-lg font-semibold text-slate-900 sm:text-xl">
            Impacto Institucional
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
            Estudiantes con avances registrados en al menos una dimensión del
            Perfil Socioemocional Evolutivo durante el período actual.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end lg:items-center">
          <p className="text-5xl font-semibold tabular-nums tracking-tight text-teal-800 sm:text-6xl">
            {percentage}%
          </p>
          <p className="text-sm font-medium text-slate-700">
            {studentsWithProgress} de {totalStudents} estudiantes
          </p>
          <div className="w-full min-w-[200px] max-w-xs sm:w-56">
            <div className="h-3 overflow-hidden rounded-full bg-white/80 ring-1 ring-teal-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function PieEvidenceCard({
  compliance,
  activeObjectives,
  studentsWithEvidence,
}: {
  compliance: number;
  activeObjectives: number;
  studentsWithEvidence: number;
}) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Evidencia PIE
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Objetivos y registros del Programa de Integración Escolar
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-100">
          <ClipboardCheckIcon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-end justify-between gap-2">
          <p className="text-sm font-medium text-slate-600">
            Cumplimiento de evidencias
          </p>
          <p className="text-3xl font-semibold tabular-nums text-slate-900">
            {compliance}%
          </p>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-violet-500"
            style={{ width: `${compliance}%` }}
          />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
        <div className="rounded-xl border border-violet-50 bg-violet-50/40 px-4 py-3">
          <p className="text-2xl font-semibold tabular-nums text-slate-900">
            {activeObjectives}
          </p>
          <p className="mt-1 text-xs leading-snug text-slate-600">
            Objetivos PIE activos
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
          <p className="text-2xl font-semibold tabular-nums text-slate-900">
            {studentsWithEvidence}
          </p>
          <p className="mt-1 text-xs leading-snug text-slate-600">
            Estudiantes con evidencia
          </p>
        </div>
      </div>
    </article>
  );
}

function LeyTeaEvidenceCard({
  compliance,
  studentsWithAdjustments,
  supportsRegistered,
}: {
  compliance: number;
  studentsWithAdjustments: number;
  supportsRegistered: number;
}) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Evidencia Ley TEA
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Cumplimiento de apoyos y ajustes documentados
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-inset ring-teal-100">
          <ClipboardCheckIcon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-6">
        <div className="flex items-end justify-between gap-2">
          <p className="text-sm font-medium text-slate-600">
            Cumplimiento de apoyos registrados
          </p>
          <p className="text-3xl font-semibold tabular-nums text-slate-900">
            {compliance}%
          </p>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-teal-500"
            style={{ width: `${compliance}%` }}
          />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
        <div className="rounded-xl border border-teal-50 bg-teal-50/40 px-4 py-3">
          <p className="text-2xl font-semibold tabular-nums text-slate-900">
            {studentsWithAdjustments}
          </p>
          <p className="mt-1 text-xs leading-snug text-slate-600">
            Estudiantes con ajustes documentados
          </p>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
          <p className="text-2xl font-semibold tabular-nums text-slate-900">
            {supportsRegistered}
          </p>
          <p className="mt-1 text-xs leading-snug text-slate-600">
            Apoyos registrados en plataforma
          </p>
        </div>
      </div>
    </article>
  );
}

function MultisensorialRoomCard({
  sessions,
  utilization,
}: {
  sessions: number;
  utilization: number;
}) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Uso de Sala Multisensorial
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {GLOSSARY.intervencion.salaMultisensorialMes}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-100">
          <SparklesIcon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-6 text-4xl font-semibold tabular-nums text-slate-900">
        {utilization}%
      </p>
      <p className="mt-1 text-sm text-slate-500">Utilización del espacio</p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-violet-500"
          style={{ width: `${utilization}%` }}
        />
      </div>
      <p className="mt-5 rounded-xl border border-violet-50 bg-violet-50/30 px-4 py-3 text-sm font-medium text-slate-700">
        {GLOSSARY.intervencion.sesionesEsteMes(sessions)}
      </p>
    </article>
  );
}

function LeafIcon({ className }: { className?: string }) {
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
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 18 2c1 2 2 4.5 2 8 0 5.5-4.5 10-9 10Z" />
      <path d="M2 21c0-3 1.5-5 5-5" />
    </svg>
  );
}

function HeartHandshakeIcon({ className }: { className?: string }) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function WavesIcon({ className }: { className?: string }) {
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
      <path d="M2 12c2-4 4-6 6-6s4 2 6 6 4 6 6 6 4-2 6-6" />
    </svg>
  );
}

function ClipboardCheckIcon({ className }: { className?: string }) {
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
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}

function HomeHeartIcon({ className }: { className?: string }) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
      <path d="M12 12v3" />
    </svg>
  );
}

function MountainIcon({ className }: { className?: string }) {
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
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 12 2.5 8.5 5.5 0 0 0 5 8.5c0 2.3 1.5 4.05 3 5.5l4 4 4-4Z" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
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
      <path d="m12 3-1.9 5.8H4.4l4.8 3.5-1.9 5.8L12 14.6l4.7 3.5-1.9-5.8 4.8-3.5h-5.7L12 3Z" />
    </svg>
  );
}

function MessageIcon({ className }: { className?: string }) {
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function TrendingUpIcon({ className }: { className?: string }) {
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
      <path d="m22 7-8.5 8.5-5-5L2 17" />
      <path d="M16 7h6v6" />
    </svg>
  );
}
