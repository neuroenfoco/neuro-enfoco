"use client";

import { HallazgoHistorialTrigger } from "@/components/perfil/HallazgoHistorialTrigger";
import { PerfilMarcoTerritorio } from "@/components/perfil/PerfilMarcoTerritorio";
import { AppShell } from "@/components/layout/app-shell";
import { UsersIcon } from "@/components/layout/nav-icons";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  EMPTY_QUIEN_ES_MESSAGE,
  generateQuienEsResumenDesdeHallazgos,
  getFichaHeaderKpisResumenFicha,
  getHallazgosResumenPorTipo,
  getLogrosRecientesResumenFicha,
  getTopFortalezasConfirmadas,
  type HallazgoResumenItem,
} from "@/lib/hallazgos-resumen-ficha";
import {
  getApoyosUtilizadosAgregadosPorEstudiante,
  type ApoyoUtilizadoAgregado,
} from "@/lib/apoyos-utilizados-estudiante";
import {
  DEFAULT_OBJETIVO_ESTUDIANTE,
  getObjetivoResumenForEstudiante,
  hasSesionesForEstudiante,
  formatImpactoPromedio,
  type FichaHeaderKpis,
  type LogroReciente,
  type ObjetivoEstudianteResumen,
} from "@/lib/sessions-storage";
import {
  formatHallazgoConfirmaciones,
  getHallazgoOrigenLabel,
  getHallazgosByEstudianteId,
  type HallazgoPerfil,
  type HallazgoTipo,
} from "@/lib/perfil-hallazgos-storage";
import { getObjetivosPIEByEstudianteId } from "@/lib/pie-objectives-storage";
import { EstudianteIntervencionesTab } from "@/app/estudiantes/[id]/EstudianteIntervencionesTab";
import { EstudianteObjetivosTab } from "@/app/estudiantes/[id]/EstudianteObjetivosTab";
import { EstudiantePerfilBaseTab } from "@/app/estudiantes/[id]/EstudiantePerfilBaseTab";
import { EstudianteApoyosParticipacionTab } from "@/app/estudiantes/[id]/EstudianteApoyosParticipacionTab";
import { EstudianteAprendizajesTab } from "@/app/estudiantes/[id]/EstudianteAprendizajesTab";
import { EstudiantePerfilEvolutivoTab } from "@/app/estudiantes/[id]/EstudiantePerfilEvolutivoTab";
import { EliminarEstudianteDialog } from "@/components/estudiantes/EliminarEstudianteDialog";
import { MarcoInstitucionalResumen } from "@/components/ingreso/MarcoInstitucionalResumen";
import { EquipoApoyoResumenCard } from "@/components/equipo-apoyo/EquipoApoyoResumenCard";
import { EvaluacionIntegralResumenCard } from "@/components/evaluacion-integral/EvaluacionIntegralResumenCard";
import { EstudianteEquipoApoyoTab } from "@/app/estudiantes/[id]/EstudianteEquipoApoyoTab";
import { EstudianteEvaluacionIntegralTab } from "@/app/estudiantes/[id]/EstudianteEvaluacionIntegralTab";
import { EstudiantePACITab } from "@/app/estudiantes/[id]/EstudiantePACITab";
import { PACIVigenteResumenCard } from "@/components/paci/PACIVigenteResumenCard";
import {
  getEstudianteById,
  getEstudianteIniciales,
  getEstudiantePrimerNombre,
  type Estudiante,
} from "@/lib/students-storage";
import { getPACIVigenteView } from "@/lib/paci/paci-view";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const profileTabs = [
  { id: "resumen", label: "Resumen", emoji: "👤" },
  {
    id: "equipo-apoyo",
    label: GLOSSARY.equipoApoyo.tab,
    emoji: "👥",
  },
  { id: "perfil-base", label: GLOSSARY.perfilBase.tab, emoji: "📋" },
  {
    id: "evaluacion-integral",
    label: GLOSSARY.evaluacionIntegral.tab,
    emoji: "🔬",
  },
  { id: "paci", label: GLOSSARY.paci.tab, emoji: "📄" },
  { id: "perfil", label: GLOSSARY.perfilEvolutivo.tab, emoji: "📈" },
  { id: "sesiones", label: GLOSSARY.intervencion.tabEstudiante, emoji: "📝" },
  { id: "objetivos", label: "Objetivos", emoji: "🎯" },
  { id: "aprendizajes", label: GLOSSARY.aprendizajes.tab, emoji: "📚" },
  { id: "evidencias", label: "Evidencias", emoji: "📂" },
  { id: "familia", label: "Familia", emoji: "🏠" },
  { id: "apoyos", label: "Apoyos participación", emoji: "🤝" },
] as const;

type ProfileTabId = (typeof profileTabs)[number]["id"];

const headerKpiConfig = [
  {
    key: "fortalezasObservadas",
    title: "Fortalezas observadas",
    icon: HeartHandshakeIcon,
    accent: "bg-teal-50 text-teal-700 ring-teal-100",
  },
  {
    key: "sesionesRegistradas",
    title: GLOSSARY.intervencion.kpiRegistradas,
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

const FORTALEZA_PILL_STYLES = [
  { icon: MountainIcon, iconBg: "bg-teal-100 text-teal-700" },
  { icon: HeartIcon, iconBg: "bg-rose-100 text-rose-700" },
  { icon: SparklesIcon, iconBg: "bg-violet-100 text-violet-700" },
  { icon: MessageIcon, iconBg: "bg-sky-100 text-sky-700" },
  { icon: LightbulbIcon, iconBg: "bg-amber-100 text-amber-800" },
] as const;

export default function EstudianteFichaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();
  const estudianteId = params.id;
  const [estudiante, setEstudiante] = useState<Estudiante | null>(() =>
    typeof window === "undefined" ? null : getEstudianteById(estudianteId)
  );
  const [hasSessions, setHasSessions] = useState(false);
  const [headerKpis, setHeaderKpis] = useState<FichaHeaderKpis>(
    EMPTY_FICHA_HEADER_KPIS
  );
  const [topFortalezas, setTopFortalezas] = useState<HallazgoResumenItem[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<LogroReciente[]>(
    []
  );
  const [observedInterests, setObservedInterests] = useState<HallazgoResumenItem[]>(
    []
  );
  const [observedSuccessContexts, setObservedSuccessContexts] = useState<
    HallazgoResumenItem[]
  >([]);
  const [hasInterestsData, setHasInterestsData] = useState(false);
  const [hasSuccessContextsData, setHasSuccessContextsData] = useState(false);
  const [observedApoyos, setObservedApoyos] = useState<ApoyoUtilizadoAgregado[]>(
    []
  );
  const [observedCondiciones, setObservedCondiciones] = useState<
    HallazgoResumenItem[]
  >([]);
  const [hasStrategiesData, setHasStrategiesData] = useState(false);
  const [hasCondicionesData, setHasCondicionesData] = useState(false);
  const [objetivoResumen, setObjetivoResumen] = useState<ObjetivoEstudianteResumen | null>(
    null
  );
  const [whoIsText, setWhoIsText] = useState<string | null>(null);
  const [hallazgosPerfil, setHallazgosPerfil] = useState<HallazgoPerfil[]>([]);
  const [activeTab, setActiveTab] = useState<ProfileTabId>("objetivos");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!tab) return;
    if (profileTabs.some((item) => item.id === tab)) {
      setActiveTab(tab as ProfileTabId);
    }
  }, [searchParams]);

  useEffect(() => {
    const loaded = getEstudianteById(estudianteId);
    setEstudiante(loaded);
    if (!loaded) return;

    const studentId = loaded.id;
    const primerNombre = getEstudiantePrimerNombre(loaded.nombre);

    function refreshFromStorage() {
      setHasSessions(hasSesionesForEstudiante(studentId));
      setHeaderKpis(
        getFichaHeaderKpisResumenFicha(
          studentId,
          getObjetivosPIEByEstudianteId(studentId).length
        )
      );
      setTopFortalezas(getTopFortalezasConfirmadas(studentId));
      setRecentAchievements(getLogrosRecientesResumenFicha(studentId));
      const interests = getHallazgosResumenPorTipo(studentId, "interes");
      const contexts = getHallazgosResumenPorTipo(studentId, "contexto_exito");
      setObservedInterests(interests);
      setObservedSuccessContexts(contexts);
      setHasInterestsData(interests.length > 0);
      setHasSuccessContextsData(contexts.length > 0);
      const apoyosUtilizados = getApoyosUtilizadosAgregadosPorEstudiante(studentId);
      const condiciones = getHallazgosResumenPorTipo(studentId, "barrera");
      setObservedApoyos(apoyosUtilizados);
      setObservedCondiciones(condiciones);
      setHasStrategiesData(apoyosUtilizados.length > 0);
      setHasCondicionesData(condiciones.length > 0);
      setObjetivoResumen(
        getObjetivoResumenForEstudiante(studentId, DEFAULT_OBJETIVO_ESTUDIANTE)
      );
      setWhoIsText(
        generateQuienEsResumenDesdeHallazgos(studentId, primerNombre)
      );
      setHallazgosPerfil(getHallazgosByEstudianteId(studentId));
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
    <AppShell activeNav="estudiantes">
      <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/estudiantes" className="font-medium text-teal-700 hover:text-teal-800">
            Estudiantes</Link>
            <span aria-hidden>/</span>
            <span className="text-slate-700">{estudiante.nombre}</span>
          </div>
          <p className="mt-2 text-xs font-medium uppercase tracking-wide text-teal-700/80">
            {GLOSSARY.estudiante.fichaEnfoque}
          </p>
        </header>

        <main className="flex-1 px-8 py-8">
          <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200/80 pb-1">
            {profileTabs.map((tab) => (
              <ProfileTab
                key={tab.id}
                {...tab}
                isActive={activeTab === tab.id}
                onSelect={() => setActiveTab(tab.id)}
              />
            ))}
          </div>

          {activeTab === "equipo-apoyo" && (
            <EstudianteEquipoApoyoTab estudianteId={estudianteId} />
          )}

          {activeTab === "objetivos" && (
            <EstudianteObjetivosTab
              estudianteId={estudianteId}
              estudiantePrimerNombre={estudiantePrimerNombre}
            />
          )}

          {activeTab === "perfil-base" && (
            <EstudiantePerfilBaseTab
              estudianteId={estudianteId}
              estudiantePrimerNombre={estudiantePrimerNombre}
            />
          )}

          {activeTab === "evaluacion-integral" && (
            <EstudianteEvaluacionIntegralTab estudianteId={estudianteId} />
          )}

          {activeTab === "paci" && (
            <EstudiantePACITab estudianteId={estudianteId} />
          )}

          {activeTab === "sesiones" && (
            <EstudianteIntervencionesTab
              estudianteId={estudianteId}
              estudiantePrimerNombre={estudiantePrimerNombre}
            />
          )}

          {activeTab === "perfil" && (
            <EstudiantePerfilEvolutivoTab
              estudianteId={estudianteId}
              estudiantePrimerNombre={estudiantePrimerNombre}
            />
          )}

          {activeTab === "apoyos" && (
            <EstudianteApoyosParticipacionTab
              estudianteId={estudianteId}
              estudiantePrimerNombre={estudiantePrimerNombre}
            />
          )}

          {activeTab === "aprendizajes" && (
            <EstudianteAprendizajesTab
              estudianteId={estudianteId}
              estudiantePrimerNombre={estudiantePrimerNombre}
            />
          )}

          {activeTab !== "objetivos" &&
            activeTab !== "resumen" &&
            activeTab !== "equipo-apoyo" &&
            activeTab !== "perfil-base" &&
            activeTab !== "evaluacion-integral" &&
            activeTab !== "paci" &&
            activeTab !== "perfil" &&
            activeTab !== "sesiones" &&
            activeTab !== "apoyos" &&
            activeTab !== "aprendizajes" && (
            <section className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
              <p className="text-sm text-slate-600">
                Esta sección estará disponible próximamente.
              </p>
            </section>
          )}

          {activeTab === "resumen" && (
          <div className="space-y-8">
            <MarcoInstitucionalResumen estudianteId={estudianteId} />

            <EquipoApoyoResumenCard
              estudianteId={estudianteId}
              onVerEquipoCompleto={() => setActiveTab("equipo-apoyo")}
            />

            <EvaluacionIntegralResumenCard
              estudianteId={estudianteId}
              onVerEvaluacion={() => setActiveTab("evaluacion-integral")}
            />

            {(() => {
              const paciVigente = getPACIVigenteView(estudianteId);
              return paciVigente ? (
                <PACIVigenteResumenCard
                  vista={paciVigente}
                  onVerPaci={() => setActiveTab("paci")}
                />
              ) : null;
            })()}

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
                      {GLOSSARY.intervencion.fichaActualizada}
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
                {GLOSSARY.estudiante.quienEsPregunta}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                {GLOSSARY.estudiante.quienEsTitulo(estudiantePrimerNombre)}
              </h2>
              <p className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-slate-700">
                {!hasSessions || !whoIsText
                  ? EMPTY_QUIEN_ES_MESSAGE
                  : whoIsText}
              </p>
              <p className="mt-6 text-sm text-slate-500">
                {GLOSSARY.estudiante.quienEsNota}
              </p>
            </section>

            <section>
              <SectionHeading
                title="Fortalezas principales"
                subtitle="Capacidades observadas y reconocidas por el equipo"
              />
              {topFortalezas.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  Aún no hay fortalezas confirmadas en intervenciones.
                </p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {topFortalezas.map((item, index) => {
                    const style =
                      FORTALEZA_PILL_STYLES[index % FORTALEZA_PILL_STYLES.length];
                    return (
                      <StrengthPill
                        key={item.hallazgoId}
                        name={item.nombre}
                        icon={style.icon}
                        iconBg={style.iconBg}
                        count={item.confirmaciones}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-dashed border-violet-200/80 bg-gradient-to-br from-violet-50/40 via-white to-sky-50/30 p-6 shadow-[0_1px_3px_rgba(15,60,50,0.04)] sm:p-8">
              <SectionHeading
                title={GLOSSARY.intervencion.perfilExperimentalTitulo}
                subtitle={GLOSSARY.intervencion.perfilExperimentalSubtitulo}
              />
              {hallazgosPerfil.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  Aún no hay hallazgos de perfil registrados para este estudiante.
                </p>
              ) : (
                <div className="mt-6 space-y-6">
                  <PerfilMarcoTerritorio dimension="perfil_estudiante">
                    <div className="grid gap-6 lg:grid-cols-2">
                      <PerfilHallazgoGroup
                        title="Fortalezas conocidas"
                        tipo="fortaleza"
                        items={hallazgosPerfil}
                      />
                      <PerfilHallazgoGroup
                        title="Intereses conocidos"
                        tipo="interes"
                        items={hallazgosPerfil}
                      />
                    </div>
                  </PerfilMarcoTerritorio>
                  <PerfilMarcoTerritorio
                    dimension="perfil_participacion"
                    showAviso
                    avisoVariant="general"
                  >
                    <div className="grid gap-6 lg:grid-cols-2">
                      <PerfilHallazgoGroup
                        title="Contextos de éxito conocidos"
                        tipo="contexto_exito"
                        items={hallazgosPerfil}
                      />
                      <PerfilHallazgoGroup
                        title={GLOSSARY.marco.condicionesParticipacion.tituloConocidas}
                        tipo="barrera"
                        items={hallazgosPerfil}
                      />
                    </div>
                  </PerfilMarcoTerritorio>
                </div>
              )}
            </section>

            <PerfilMarcoTerritorio dimension="perfil_estudiante" className="border-0 bg-transparent p-0 shadow-none">
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
                        key={interest.hallazgoId}
                        title={
                          interest.ultimaObservacionDisplay
                            ? `Última observación: ${interest.ultimaObservacionDisplay}`
                            : undefined
                        }
                        className="rounded-full border border-teal-100 bg-teal-50/60 px-3.5 py-1.5 text-sm font-medium text-teal-900"
                      >
                        {interest.nombre} ({interest.confirmaciones})
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">
                      Aún no existen intereses observados.
                    </p>
                  )}
                </div>
              </section>
            </div>
            </PerfilMarcoTerritorio>

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

            <PerfilMarcoTerritorio
              dimension="perfil_participacion"
              showAviso
              avisoVariant="general"
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
                  <SectionHeading
                    title="Contextos de éxito"
                    subtitle={GLOSSARY.estudiante.contextosExitoSubtitulo}
                  />
                  {hasSuccessContextsData ? (
                    <ul className="mt-4 space-y-2.5">
                      {observedSuccessContexts.map((context) => (
                        <li
                          key={context.hallazgoId}
                          className="flex items-start gap-3 rounded-xl border border-emerald-50 bg-emerald-50/30 px-4 py-3"
                        >
                          <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-700">
                              {context.nombre} ({context.confirmaciones})
                            </p>
                            {context.ultimaObservacionDisplay ? (
                              <p className="mt-0.5 text-xs text-slate-500">
                                Última observación: {context.ultimaObservacionDisplay}
                              </p>
                            ) : null}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">
                      Aún no existen contextos de éxito observados.
                    </p>
                  )}
                </section>

                <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
                  <SectionHeading
                    title={GLOSSARY.marco.condicionesParticipacion.tituloFrecuentes}
                    subtitle={
                      GLOSSARY.marco.condicionesParticipacion.subtituloFrecuentes
                    }
                  />
                  {hasCondicionesData ? (
                    <div className="mt-4 grid gap-3">
                      {observedCondiciones.map((item) => (
                        <div
                          key={item.hallazgoId}
                          className="flex items-start gap-3 rounded-xl border border-amber-100/80 bg-amber-50/30 p-4"
                        >
                          <AlertSoftIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-700/80" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-600">
                              {item.nombre} ({item.confirmaciones})
                            </p>
                            {item.ultimaObservacionDisplay ? (
                              <p className="mt-0.5 text-xs text-slate-500">
                                Última observación: {item.ultimaObservacionDisplay}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-slate-500">
                      {GLOSSARY.barreras.sinObservadas}
                    </p>
                  )}
                </section>
              </div>

              <section className="mt-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
                <SectionHeading
                  title={GLOSSARY.apoyos.suelenFacilitar}
                  subtitle={GLOSSARY.apoyos.yAjustes}
                />
                {hasStrategiesData ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {observedApoyos.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50/40 p-4"
                      >
                        <ThumbsUpIcon className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
                        <p className="text-sm font-medium text-slate-700">
                          {item.nombre} ({item.cantidad})
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">
                    {GLOSSARY.apoyos.sinRegistrados}
                  </p>
                )}
              </section>
            </PerfilMarcoTerritorio>

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

            <section className="rounded-2xl border border-violet-100 bg-violet-50/30 p-5">
              <p className="text-sm text-slate-700">
                El seguimiento pedagógico completo de objetivos, evidencias y
                apoyos está en la pestaña{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("objetivos")}
                  className="font-semibold text-violet-700 underline-offset-2 hover:underline"
                >
                  Objetivos
                </button>
                .
              </p>
            </section>

            <section className="border-t border-slate-200/80 pt-6">
              <button
                type="button"
                onClick={() => setShowDeleteDialog(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              >
                <span aria-hidden>🗑</span>
                {GLOSSARY.estudiante.eliminarAccionFicha}
              </button>
            </section>
          </div>
          )}
        </main>

      <EliminarEstudianteDialog
        open={showDeleteDialog}
        estudianteId={estudianteId}
        estudianteNombre={estudiante?.nombre}
        onClose={() => setShowDeleteDialog(false)}
        onDeleted={() => router.push("/estudiantes?eliminado=1")}
      />
    </AppShell>
  );
}

function PerfilHallazgoGroup({
  title,
  tipo,
  items,
}: {
  title: string;
  tipo: HallazgoTipo;
  items: HallazgoPerfil[];
}) {
  const groupItems = items.filter((item) => item.tipo === tipo);

  return (
    <div className="rounded-xl border border-slate-200/70 bg-white/80 p-4">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {groupItems.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Sin registros todavía.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {groupItems.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5"
            >
              <p className="text-sm font-medium text-slate-800">{item.nombre}</p>
              <p className="mt-1 text-xs text-slate-600">
                Origen: {getHallazgoOrigenLabel(item.origen)}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {formatHallazgoConfirmaciones(item.totalObservaciones)}
              </p>
              <div className="mt-2">
                <HallazgoHistorialTrigger hallazgoId={item.id} />
              </div>
            </li>
          ))}
        </ul>
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
  isActive,
  onSelect,
}: {
  id: string;
  label: string;
  emoji: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? "page" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-t-lg px-3 py-2.5 text-sm font-medium transition ${
        isActive
          ? "border-b-2 border-teal-600 bg-white text-teal-900 shadow-sm"
          : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
      }`}
    >
      <span aria-hidden>{emoji}</span>
      {label}
    </button>
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
