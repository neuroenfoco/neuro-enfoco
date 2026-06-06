"use client";

import {
  countFortalezasForEstudiante,
  DEFAULT_OBJETIVO_ESTUDIANTE,
  EMPTY_QUIEN_ES_MESSAGE,
  formatImpactoPromedio,
  generateQuienEsResumen,
  getFichaHeaderKpisForEstudiante,
  type FichaHeaderKpis,
  getBarrerasObservadasForEstudiante,
  getContextosExitoForEstudiante,
  getEstrategiasQueAyudaronForEstudiante,
  getInteresesObservadosForEstudiante,
  getLogrosRecientesForEstudiante,
  getObjetivoResumenForEstudiante,
  getPerfilEvolutivoForEstudiante,
  hasPerfilEvolutivoData,
  hasSesionesForEstudiante,
  type DimensionPerfil,
  type FrecuenciaItem,
  type LogroReciente,
  type ObjetivoEstudianteResumen,
} from "@/lib/sessions-storage";
import {
  getObjetivosPIEByEstudianteId,
  getObjetivosPIEResumenByEstudianteId,
  type ObjetivoPIEResumen,
} from "@/lib/pie-objectives-storage";
import {
  deleteEstudiante,
  getEstudianteById,
  getEstudianteIniciales,
  getEstudiantePrimerNombre,
  isProtectedEstudiante,
  type Estudiante,
} from "@/lib/students-storage";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

const profileTabs = [
  { id: "resumen", label: "Resumen", emoji: "👤", active: true },
  { id: "perfil", label: "Perfil Evolutivo", emoji: "📈", active: false },
  { id: "objetivos", label: "Objetivos", emoji: "🎯", active: false },
  { id: "sesiones", label: "Sesiones", emoji: "📝", active: false },
  { id: "evidencias", label: "Evidencias", emoji: "📂", active: false },
  { id: "familia", label: "Familia", emoji: "🏠", active: false },
  { id: "apoyos", label: "Perfil de Apoyos", emoji: "🤝", active: false },
] as const;

function getNivelBarWidth(nivelActual: string): number {
  switch (nivelActual) {
    case "Emergente":
      return 50;
    case "En desarrollo":
      return 75;
    case "Consolidado":
      return 100;
    default:
      return 25;
  }
}

const headerKpiConfig = [
  {
    key: "fortalezasObservadas",
    title: "Fortalezas observadas",
    icon: HeartHandshakeIcon,
    accent: "bg-teal-50 text-teal-700 ring-teal-100",
  },
  {
    key: "sesionesRegistradas",
    title: "Sesiones registradas",
    icon: WavesIcon,
    accent: "bg-sky-50 text-sky-700 ring-sky-100",
  },
  {
    key: "impactoPromedio",
    title: "Impacto promedio",
    icon: UsersIcon,
    accent: "bg-amber-50 text-amber-800 ring-amber-100",
  },
  {
    key: "objetivosPieActivos",
    title: "Objetivos PIE activos",
    icon: SparklesIcon,
    accent: "bg-violet-50 text-violet-700 ring-violet-100",
  },
] as const;

const EMPTY_FICHA_HEADER_KPIS: FichaHeaderKpis = {
  fortalezasObservadas: "0",
  sesionesRegistradas: "0",
  impactoPromedio: "Sin datos",
  objetivosPieActivos: "0",
};

const mainStrengths = [
  { name: "Persistencia", icon: MountainIcon, iconBg: "bg-teal-100 text-teal-700" },
  { name: "Empatía", icon: HeartIcon, iconBg: "bg-rose-100 text-rose-700" },
  { name: "Creatividad", icon: SparklesIcon, iconBg: "bg-violet-100 text-violet-700" },
  { name: "Comunicación", icon: MessageIcon, iconBg: "bg-sky-100 text-sky-700" },
  { name: "Curiosidad", icon: LightbulbIcon, iconBg: "bg-amber-100 text-amber-800" },
] as const;

const strengthNames = mainStrengths.map((item) => item.name);
const DELETE_CONFIRMATION_TEXT = "ELIMINAR";

export default function EstudianteFichaPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const estudianteId = params.id;
  const isProtectedStudent = isProtectedEstudiante(estudianteId);
  const [estudiante, setEstudiante] = useState<Estudiante | null>(() =>
    typeof window === "undefined" ? null : getEstudianteById(estudianteId)
  );
  const [hasSessions, setHasSessions] = useState(false);
  const [headerKpis, setHeaderKpis] = useState<FichaHeaderKpis>(
    EMPTY_FICHA_HEADER_KPIS
  );
  const [strengthCounts, setStrengthCounts] = useState<Record<string, number>>(
    () => Object.fromEntries(strengthNames.map((name) => [name, 0]))
  );
  const [recentAchievements, setRecentAchievements] = useState<LogroReciente[]>(
    []
  );
  const [profileDimensions, setProfileDimensions] = useState<DimensionPerfil[]>(
    []
  );
  const [hasProfileData, setHasProfileData] = useState(false);
  const [observedInterests, setObservedInterests] = useState<FrecuenciaItem[]>(
    []
  );
  const [observedSuccessContexts, setObservedSuccessContexts] = useState<
    FrecuenciaItem[]
  >([]);
  const [hasInterestsData, setHasInterestsData] = useState(false);
  const [hasSuccessContextsData, setHasSuccessContextsData] = useState(false);
  const [observedStrategies, setObservedStrategies] = useState<FrecuenciaItem[]>(
    []
  );
  const [observedBarriers, setObservedBarriers] = useState<FrecuenciaItem[]>([]);
  const [hasStrategiesData, setHasStrategiesData] = useState(false);
  const [hasBarriersData, setHasBarriersData] = useState(false);
  const [objetivoResumen, setObjetivoResumen] = useState<ObjetivoEstudianteResumen | null>(
    null
  );
  const [objetivosPIE, setObjetivosPIE] = useState<ObjetivoPIEResumen[]>([]);
  const [whoIsText, setWhoIsText] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const canConfirmDelete =
    deleteConfirmText === DELETE_CONFIRMATION_TEXT && !isProtectedStudent;

  function openDeleteDialog() {
    setDeleteConfirmText("");
    setShowDeleteDialog(true);
  }

  function closeDeleteDialog() {
    if (isDeleting) return;
    setShowDeleteDialog(false);
    setDeleteConfirmText("");
  }

  function handleDeleteEstudiante() {
    if (!canConfirmDelete || isDeleting) return;

    setIsDeleting(true);
    const deleted = deleteEstudiante(estudianteId);

    if (deleted) {
      router.push("/estudiantes?eliminado=1");
      return;
    }

    setIsDeleting(false);
  }

  useEffect(() => {
    const loaded = getEstudianteById(estudianteId);
    setEstudiante(loaded);
    if (!loaded) return;

    const studentId = loaded.id;
    const primerNombre = getEstudiantePrimerNombre(loaded.nombre);

    function refreshFromStorage() {
      setHasSessions(hasSesionesForEstudiante(studentId));
      setHeaderKpis(
        getFichaHeaderKpisForEstudiante(
          studentId,
          getObjetivosPIEByEstudianteId(studentId).length
        )
      );
      setStrengthCounts(
        countFortalezasForEstudiante(studentId, strengthNames)
      );
      setRecentAchievements(getLogrosRecientesForEstudiante(studentId));
      setProfileDimensions(getPerfilEvolutivoForEstudiante(studentId));
      setHasProfileData(hasPerfilEvolutivoData(studentId));
      const interests = getInteresesObservadosForEstudiante(studentId);
      const contexts = getContextosExitoForEstudiante(studentId);
      setObservedInterests(interests);
      setObservedSuccessContexts(contexts);
      setHasInterestsData(interests.length > 0);
      setHasSuccessContextsData(contexts.length > 0);
      const strategies = getEstrategiasQueAyudaronForEstudiante(studentId);
      const barriers = getBarrerasObservadasForEstudiante(studentId);
      setObservedStrategies(strategies);
      setObservedBarriers(barriers);
      setHasStrategiesData(strategies.length > 0);
      setHasBarriersData(barriers.length > 0);
      setObjetivoResumen(
        getObjetivoResumenForEstudiante(studentId, DEFAULT_OBJETIVO_ESTUDIANTE)
      );
      setObjetivosPIE(getObjetivosPIEResumenByEstudianteId(studentId));
      setWhoIsText(
        generateQuienEsResumen(studentId, primerNombre, strengthNames)
      );
    }

    refreshFromStorage();
    window.addEventListener("focus", refreshFromStorage);
    window.addEventListener("storage", refreshFromStorage);

    return () => {
      window.removeEventListener("focus", refreshFromStorage);
      window.removeEventListener("storage", refreshFromStorage);
    };
  }, [estudianteId]);

  if (!estudiante) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7f6] px-8 text-slate-600">
        <div className="max-w-md rounded-2xl border border-slate-200/70 bg-white p-8 text-center shadow-sm">
          <p className="text-sm">Estudiante no encontrado.</p>
          <Link
            href="/estudiantes"
            className="mt-4 inline-flex text-sm font-medium text-teal-700 hover:text-teal-800"
          >
            Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  const estudianteIniciales = getEstudianteIniciales(estudiante.nombre);
  const estudiantePrimerNombre = getEstudiantePrimerNombre(estudiante.nombre);

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
        <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/estudiantes" className="font-medium text-teal-700 hover:text-teal-800">
            Estudiantes</Link>
            <span aria-hidden>/</span>
            <span className="text-slate-700">{estudiante.nombre}</span>
          </div>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-teal-700/80">
            Ficha del estudiante · enfoque basado en fortalezas
          </p>
        </header>

        <main className="flex-1 px-8 py-8">
          <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200/80 pb-1">
            {profileTabs.map((tab) => (
              <ProfileTab key={tab.id} {...tab} />
            ))}
          </div>

          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-xl font-semibold text-white shadow-md shadow-teal-600/20">
                    {estudianteIniciales}
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                      {estudiante.nombre}
                    </h1>
                    <p className="mt-1 text-base text-slate-600">{estudiante.curso}</p>
                    <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-500">
                      <ClockIcon className="h-4 w-4 text-teal-600/70" />
                      Ficha actualizada desde sesiones registradas
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {headerKpiConfig.map((kpi) => (
                  <HeaderKpiCard
                    key={kpi.key}
                    title={kpi.title}
                    value={headerKpis[kpi.key]}
                    icon={kpi.icon}
                    accent={kpi.accent}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-2xl border-2 border-teal-200/70 bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/40 p-8 shadow-[0_4px_24px_rgba(15,80,60,0.08)] sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-800/80">
                ¿Quién es este estudiante?
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Quién es {estudiantePrimerNombre}
              </h2>
              <p className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-slate-700">
                {!hasSessions || !whoIsText
                  ? EMPTY_QUIEN_ES_MESSAGE
                  : whoIsText}
              </p>
              <p className="mt-6 text-sm text-slate-500">
                Esta ficha prioriza identidad, fortalezas y contextos de éxito —
                no diagnósticos ni antecedentes clínicos.
              </p>
            </section>

            <section>
              <SectionHeading
                title="Fortalezas principales"
                subtitle="Capacidades observadas y reconocidas por el equipo"
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {mainStrengths.map((item) => (
                  <StrengthPill
                    key={item.name}
                    {...item}
                    count={strengthCounts[item.name] ?? 0}
                  />
                ))}
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
                <SectionHeading
                  title="Intereses"
                  subtitle="Motivadores y temas que conectan con su aprendizaje"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {hasInterestsData ? (
                    observedInterests.map((interest) => (
                      <span
                        key={interest.name}
                        className="rounded-full border border-teal-100 bg-teal-50/60 px-3.5 py-1.5 text-sm font-medium text-teal-900"
                      >
                        {interest.name} ({interest.count})
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      Aún no existen intereses observados.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
                <SectionHeading
                  title="Contextos de éxito"
                  subtitle={`Condiciones donde ${estudiantePrimerNombre} suele desenvolverse mejor`}
                />
                {hasSuccessContextsData ? (
                  <ul className="mt-4 space-y-2.5">
                    {observedSuccessContexts.map((context) => (
                      <li
                        key={context.name}
                        className="flex items-center gap-3 rounded-xl border border-emerald-50 bg-emerald-50/30 px-4 py-3"
                      >
                        <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-600" />
                        <span className="text-sm font-medium text-slate-700">
                          {context.name} ({context.count})
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    Aún no existen contextos de éxito observados.
                  </p>
                )}
              </section>
            </div>

            <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
              <SectionHeading
                title="Logros recientes"
                subtitle="Avances documentados desde un enfoque de fortalezas"
              />
              {recentAchievements.length === 0 ? (
                <p className="mt-6 text-sm text-slate-500">
                  Aún no existen registros de logros.
                </p>
              ) : (
                <ol className="relative mt-6 space-y-0">
                  {recentAchievements.map((item, index) => (
                    <li
                      key={item.id}
                      className="relative flex gap-4 pb-8 last:pb-0"
                    >
                      {index < recentAchievements.length - 1 && (
                        <span
                          className="absolute left-[11px] top-8 h-full w-px bg-teal-100"
                          aria-hidden
                        />
                      )}
                      <span className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 ring-4 ring-white">
                        <span className="h-2 w-2 rounded-full bg-teal-600" />
                      </span>
                      <div className="min-w-0 flex-1 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                        <p className="text-xs text-slate-400">{item.fecha}</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-700">
                          {item.logro}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          <span className="font-medium text-slate-600">
                            Fortaleza:
                          </span>{" "}
                          {item.fortaleza}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          <span className="font-medium text-slate-600">
                            Espacio:
                          </span>{" "}
                          {item.espacio}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Perfil Socioemocional Evolutivo
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Evidencias de sesiones registradas · 7 dimensiones de
                    desarrollo
                  </p>
                </div>
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                  Vista del estudiante
                </span>
              </div>
              {!hasProfileData ? (
                <p className="text-sm text-slate-500">
                  Aún no existen evidencias suficientes.
                </p>
              ) : (
                <ul className="space-y-4">
                  {profileDimensions.map((dim) => (
                    <li key={dim.label}>
                      <p className="mb-1.5 text-sm font-medium text-slate-700">
                        {dim.label}
                      </p>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${dim.color} transition-all`}
                          style={{
                            width: `${getNivelBarWidth(dim.nivelActual)}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500">
                        Nivel:{" "}
                        <span className="font-medium text-slate-700">
                          {dim.nivelActual}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {dim.evidencias}{" "}
                        {dim.evidencias === 1
                          ? "evidencia registrada"
                          : "evidencias registradas"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Impacto promedio:
                      </p>
                      <p className="text-xs text-slate-500">
                        <span className="font-medium text-slate-700">
                          {formatImpactoPromedio(dim.progresoPromedio)} niveles
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
                El perfil evolutivo integra observaciones de aula, sesiones de
                regulación y evidencias PIE / Ley TEA para documentar el
                progreso longitudinal de cada estudiante.
              </p>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
                <SectionHeading
                  title="Lo que suele ayudar"
                  subtitle="Estrategias y ajustes que facilitan su participación"
                />
                {hasStrategiesData ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {observedStrategies.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/40 p-4"
                      >
                        <ThumbsUpIcon className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
                        <p className="text-sm font-medium text-slate-700">
                          {item.name} ({item.count})
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    Aún no existen estrategias registradas.
                  </p>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
                <SectionHeading
                  title="Lo que puede dificultar"
                  subtitle="Aspectos a considerar con respeto y sin juicio"
                />
                {hasBarriersData ? (
                  <div className="mt-4 grid gap-3">
                    {observedBarriers.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-start gap-3 rounded-xl border border-amber-100/80 bg-amber-50/30 p-4"
                      >
                        <AlertSoftIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-700/80" />
                        <p className="text-sm font-medium text-slate-600">
                          {item.name} ({item.count})
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    Aún no existen barreras observadas.
                  </p>
                )}
              </section>
            </div>

            <section className="rounded-2xl border border-violet-200/60 bg-gradient-to-r from-violet-50/50 to-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                Próximo objetivo
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {objetivoResumen?.objetivo.nombre ?? DEFAULT_OBJETIVO_ESTUDIANTE.nombre}
              </h2>
              {objetivoResumen && (
                <div className="mt-5 space-y-3">
                  <div>
                    <p className="text-xs text-slate-500">Estado:</p>
                    <p className="text-sm font-medium text-slate-800">
                      {objetivoResumen.estado}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Impacto promedio:</p>
                    <p className="text-sm font-medium text-slate-800">
                      {formatImpactoPromedio(objetivoResumen.progresoPromedio)}{" "}
                      niveles
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Evidencias asociadas:</p>
                    <p className="text-sm font-medium text-slate-800">
                      {objetivoResumen.evidenciasAsociadas}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Última evidencia:</p>
                    <p className="text-sm font-medium text-slate-800">
                      {objetivoResumen.ultimaEvidencia}
                    </p>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-teal-200/60 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)] sm:p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                    Objetivos PIE
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    Objetivos formales vinculados a dimensiones observadas en
                    sesiones
                  </p>
                </div>
                <Link
                  href={`/objetivos/nuevo?estudianteId=${estudianteId}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800 transition hover:bg-teal-100"
                >
                  Nuevo objetivo
                </Link>
              </div>

              {objetivosPIE.length === 0 ? (
                <p className="mt-5 text-sm text-slate-500">
                  Aún no hay objetivos PIE para este estudiante.
                </p>
              ) : (
                <ul className="mt-5 space-y-4">
                  {objetivosPIE.map((resumen) => (
                    <li
                      key={resumen.objetivo.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/40 p-4"
                    >
                      <h3 className="text-base font-semibold text-slate-900">
                        {resumen.objetivo.nombre}
                      </h3>
                      <p className="mt-0.5 text-sm text-violet-700">
                        {resumen.objetivo.dimensionRelacionada}
                      </p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs text-slate-500">Estado</p>
                          <p className="text-sm font-medium text-slate-800">
                            {resumen.estado}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Impacto promedio
                          </p>
                          <p className="text-sm font-medium text-slate-800">
                            {formatImpactoPromedio(resumen.impactoPromedio)}{" "}
                            niveles
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Evidencias</p>
                          <p className="text-sm font-medium text-slate-800">
                            {resumen.cantidadEvidencias}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Última evidencia
                          </p>
                          <p className="text-sm font-medium text-slate-800">
                            {resumen.ultimaEvidencia}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="border-t border-slate-200/80 pt-6">
              {isProtectedStudent ? (
                <p className="text-xs text-slate-500">
                  El estudiante base del sistema no puede eliminarse.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={openDeleteDialog}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                >
                  <span aria-hidden>🗑</span>
                  Eliminar estudiante
                </button>
              )}
            </section>
          </div>
        </main>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-student-dialog-title"
          >
            <h2
              id="delete-student-dialog-title"
              className="text-base font-semibold text-slate-900"
            >
              Eliminar estudiante
            </h2>
            {isProtectedStudent ? (
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                El estudiante base del sistema no puede eliminarse.
              </p>
            ) : (
              <>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  ¿Deseas eliminar este estudiante?
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  También se eliminarán todas las sesiones y observaciones
                  asociadas.
                </p>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  Esta acción no puede deshacerse.
                </p>
                <label className="mt-5 block">
                  <span className="text-xs font-medium text-slate-600">
                    Para continuar escribe:
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-slate-900">
                    {DELETE_CONFIRMATION_TEXT}
                  </span>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(event) => setDeleteConfirmText(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </label>
              </>
            )}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteDialog}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteEstudiante}
                disabled={!canConfirmDelete || isDeleting || isProtectedStudent}
                className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Eliminar definitivamente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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

function ProfileTab({
  label,
  emoji,
  active,
}: {
  id: string;
  label: string;
  emoji: string;
  active: boolean;
}) {
  return (
    <button
      type="button"
      disabled={!active}
      aria-current={active ? "page" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "border-b-2 border-teal-600 bg-white text-teal-900 shadow-sm"
          : "cursor-not-allowed text-slate-400 opacity-60"
      }`}
    >
      <span aria-hidden>{emoji}</span>
      {label}
    </button>
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
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-teal-50 text-teal-900"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
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

function HeaderKpiCard({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  icon: IconComponent;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-inset ${accent}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
        {value}
      </p>
    </div>
  );
}

function StrengthPill({
  name,
  icon: Icon,
  iconBg,
  count,
}: {
  name: string;
  icon: IconComponent;
  iconBg: string;
  count: number;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white px-4 py-5 text-center shadow-sm transition hover:border-teal-200/60 hover:shadow-md">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-800">{name}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-teal-700">
        {count}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-500">
        {count === 1 ? "observación" : "observaciones"}
      </p>
    </div>
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

function LightbulbIcon({ className }: { className?: string }) {
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
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
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
      <path d="M12 6v6l4 2" />
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
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ThumbsUpIcon({ className }: { className?: string }) {
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
      <path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7v-12" />
    </svg>
  );
}

function AlertSoftIcon({ className }: { className?: string }) {
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
      <path d="M12 8v4M12 16h.01" />
    </svg>
  );
}
