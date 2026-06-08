"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getEmotionalStateFormOptions,
  labelFromEmotionalStateId,
  type EmotionalStateId,
} from "@/lib/copy/emotional-states";
import { ROUTES } from "@/lib/copy/navigation";
import {
  getObjetivosPIEResumenByEstudianteId,
  type ObjetivoPIEResumen,
} from "@/lib/pie-objectives-storage";
import {
  apoyosSesionToEstrategiasLegacy,
  CATALOGO_APOYOS_SESION,
  CATALOGO_EVIDENCIAS_INSTITUCIONALES,
  CATALOGO_ESPACIOS_SESION,
  CATALOGO_NIVEL_APOYO_REQUERIDO,
  CATALOGO_NIVEL_PARTICIPACION,
  CATALOGO_PROFESIONALES_SESION,
  DEFAULT_DURACION_MINUTOS,
  DURACION_SESION_PRESETS,
  evidenciasIdsToFlags,
  getSesionEspacioNombre,
  type ApoyoSesionId,
  type EvidenciaInstitucionalId,
  type NivelApoyoRequeridoId,
  type NivelParticipacionId,
  type SesionEspacioId,
} from "@/lib/sesiones-form-catalog";
import {
  BARRERA_OPTIONS,
  calcularMejoraSesion,
  CONTEXTO_EXITO_OPTIONS,
  dateInputValueToSesionFecha,
  formatSesionHora,
  INTERES_OPTIONS,
  saveSesion,
  type Sesion,
} from "@/lib/sessions-storage";
import {
  getEstudianteIniciales,
  getEstudiantes,
  MARTINA_STUDENT_ID,
  type Estudiante,
} from "@/lib/students-storage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const emotionalScale = getEmotionalStateFormOptions();

const strengthsOptions = [
  "Persistencia",
  "Empatía",
  "Creatividad",
  "Comunicación",
  "Curiosidad",
  "Autonomía",
] as const;

const dimensionOptions = [
  "Regulación emocional",
  "Interacción social",
  "Comunicación",
  "Autonomía",
  "Participación escolar",
  "Bienestar percibido",
  "Fortalezas y talentos",
] as const;

const defaultAchievement = GLOSSARY.intervencion.logroDefault;

function todayInputValue(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function NuevaIntervencionPage() {
  const router = useRouter();

  const [students, setStudents] = useState<Estudiante[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState(MARTINA_STUDENT_ID);
  const [objetivosActivos, setObjetivosActivos] = useState<ObjetivoPIEResumen[]>(
    []
  );

  const [fecha, setFecha] = useState(todayInputValue);
  const [hora, setHora] = useState(() => formatSesionHora());
  const [duracionMinutos, setDuracionMinutos] = useState(DEFAULT_DURACION_MINUTOS);
  const [profesionalId, setProfesionalId] = useState(
    CATALOGO_PROFESIONALES_SESION[0].id
  );
  const [espacioId, setEspacioId] = useState<SesionEspacioId>("sala_multisensorial");

  const [objetivosTrabajadosIds, setObjetivosTrabajadosIds] = useState<string[]>(
    []
  );
  const [apoyosUtilizados, setApoyosUtilizados] = useState<ApoyoSesionId[]>([]);

  const [initialState, setInitialState] = useState<EmotionalStateId>("neutral");
  const [finalState, setFinalState] = useState<EmotionalStateId>("regulada");
  const [strengths, setStrengths] = useState<string[]>(["Persistencia"]);
  const [interests, setInterests] = useState<string[]>([]);
  const [successContexts, setSuccessContexts] = useState<string[]>([]);
  const [barriers, setBarriers] = useState<string[]>([]);

  const [achievement, setAchievement] = useState<string>(defaultAchievement);
  const [dimensions, setDimensions] = useState<string[]>(["Regulación emocional"]);
  const [nivelParticipacion, setNivelParticipacion] =
    useState<NivelParticipacionId>("parcial");
  const [nivelApoyoRequerido, setNivelApoyoRequerido] =
    useState<NivelApoyoRequeridoId>("verbal");

  const [evidencias, setEvidencias] = useState<EvidenciaInstitucionalId[]>([]);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const list = getEstudiantes();
    setStudents(list);

    const params = new URLSearchParams(window.location.search);
    const estudianteFromQuery = params.get("estudianteId");
    if (
      estudianteFromQuery &&
      list.some((student) => student.id === estudianteFromQuery)
    ) {
      setSelectedStudentId(estudianteFromQuery);
    }
  }, []);

  useEffect(() => {
    const resumen = getObjetivosPIEResumenByEstudianteId(selectedStudentId);
    setObjetivosActivos(resumen);
    setObjetivosTrabajadosIds((current) =>
      current.filter((id) => resumen.some((item) => item.objetivo.id === id))
    );
  }, [selectedStudentId]);

  function buildSesion(): Sesion {
    const student = students.find((item) => item.id === selectedStudentId);
    const profesional = CATALOGO_PROFESIONALES_SESION.find(
      (item) => item.id === profesionalId
    );
    const evidenciasFlags = evidenciasIdsToFlags(evidencias);

    return {
      id: crypto.randomUUID(),
      fecha: dateInputValueToSesionFecha(fecha),
      hora,
      duracionMinutos,
      profesionalId,
      profesionalNombre: profesional?.nombre,
      estudianteId: student?.id ?? selectedStudentId,
      estudiante: student?.nombre ?? "Estudiante",
      espacioId,
      espacio: getSesionEspacioNombre(espacioId),
      objetivosTrabajadosIds: [...objetivosTrabajadosIds],
      apoyosUtilizados: [...apoyosUtilizados],
      estrategiasQueAyudaron: apoyosSesionToEstrategiasLegacy(apoyosUtilizados),
      estadoInicial: labelFromEmotionalStateId(initialState),
      fortalezas: [...strengths],
      interesesObservados: [...interests],
      contextosExitoObservados: [...successContexts],
      barrerasObservadas: [...barriers],
      logro: achievement.trim(),
      dimensiones: [...dimensions],
      nivelParticipacion,
      nivelApoyoRequerido,
      evidenciasInstitucionales: [...evidencias],
      evidenciaPIE: evidenciasFlags.evidenciaPIE,
      evidenciaLeyTEA: evidenciasFlags.evidenciaLeyTEA,
      estadoFinal: labelFromEmotionalStateId(finalState),
      mejoraSesion: calcularMejoraSesion(
        labelFromEmotionalStateId(initialState),
        labelFromEmotionalStateId(finalState)
      ),
    };
  }

  function persistSession(): void {
    saveSesion(buildSesion());
  }

  function handleSaveAndNavigate(
    destination: typeof ROUTES.intervenciones | `/estudiantes/${string}`
  ) {
    if (isSaving) return;

    persistSession();
    setIsSaving(true);
    setSaveMessage(GLOSSARY.intervencion.guardadaOk);
    window.setTimeout(() => {
      router.push(destination);
    }, 1500);
  }

  function toggleItem<T extends string>(
    value: T,
    list: T[],
    setter: (next: T[]) => void
  ) {
    setter(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );
  }

  return (
    <AppShell
      activeNav="intervenciones"
      focusText={GLOSSARY.app.focusRegistrar}
    >
      <header className="sticky top-0 z-20 border-b border-teal-900/5 bg-[#f4f7f6]/90 px-8 py-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="font-medium text-teal-700 hover:text-teal-800">
            {GLOSSARY.nav.dashboard}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-slate-700">{GLOSSARY.intervencion.registrar}</span>
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
          {GLOSSARY.intervencion.tituloRegistrar}
        </h1>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-600">
          {GLOSSARY.intervencion.descripcionRegistrar}
        </p>
      </header>

        <main className="flex-1 px-8 py-8">
          {saveMessage && (
            <div
              role="status"
              className="mx-auto mb-6 max-w-3xl rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-sm"
            >
              {saveMessage}
            </div>
          )}

          <form
            className="mx-auto max-w-3xl space-y-8"
            onSubmit={(e) => e.preventDefault()}
          >
            <FormBlock
              number={1}
              title={GLOSSARY.intervencion.datosIntervencion}
              subtitle="Contexto básico del encuentro con el estudiante"
            >
              <div className="space-y-6">
                <div>
                  <FieldLabel>Estudiante</FieldLabel>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    {students.map((student) => {
                      const selected = selectedStudentId === student.id;
                      return (
                        <button
                          key={student.id}
                          type="button"
                          onClick={() => setSelectedStudentId(student.id)}
                          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                            selected
                              ? "border-teal-300 bg-teal-50/60 ring-2 ring-teal-500/30"
                              : "border-slate-200/80 bg-white hover:border-teal-200 hover:bg-teal-50/20"
                          }`}
                        >
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold ${
                              selected
                                ? "bg-gradient-to-br from-teal-500 to-emerald-500 text-white"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {getEstudianteIniciales(student.nombre)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {student.nombre}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {student.curso}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <FieldLabel htmlFor="fecha-sesion">Fecha</FieldLabel>
                    <input
                      id="fecha-sesion"
                      type="date"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="hora-sesion">Hora</FieldLabel>
                    <input
                      id="hora-sesion"
                      type="time"
                      value={hora}
                      onChange={(e) => setHora(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="duracion-sesion">Duración (min)</FieldLabel>
                    <input
                      id="duracion-sesion"
                      type="number"
                      min={5}
                      max={240}
                      step={5}
                      value={duracionMinutos}
                      onChange={(e) =>
                        setDuracionMinutos(
                          Math.max(5, Number(e.target.value) || DEFAULT_DURACION_MINUTOS)
                        )
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Duración rápida</FieldLabel>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {DURACION_SESION_PRESETS.map((preset) => {
                      const selected = duracionMinutos === preset;
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setDuracionMinutos(preset)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                            selected
                              ? "border-teal-300 bg-teal-50 text-teal-900"
                              : "border-slate-200 bg-white text-slate-600 hover:border-teal-200"
                          }`}
                        >
                          {preset} min
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="profesional-sesion">
                    Profesional responsable
                  </FieldLabel>
                  <select
                    id="profesional-sesion"
                    value={profesionalId}
                    onChange={(e) => setProfesionalId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    {CATALOGO_PROFESIONALES_SESION.map((profesional) => (
                      <option key={profesional.id} value={profesional.id}>
                        {profesional.nombre} — {profesional.rol}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <FieldLabel>Espacio utilizado</FieldLabel>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CATALOGO_ESPACIOS_SESION.map((space) => {
                      const selected = espacioId === space.id;
                      return (
                        <button
                          key={space.id}
                          type="button"
                          onClick={() => setEspacioId(space.id)}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            selected
                              ? "border-teal-300 bg-teal-50 text-teal-900"
                              : "border-slate-200 bg-white text-slate-600 hover:border-teal-200"
                          }`}
                        >
                          {space.nombre}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </FormBlock>

            <FormBlock
              number={2}
              title="Objetivos y apoyos"
              subtitle="Vincula el trabajo pedagógico con los apoyos que facilitaron la participación"
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Objetivos trabajados
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Objetivos activos del estudiante. Puedes seleccionar uno o varios.
                  </p>

                  {objetivosActivos.length === 0 ? (
                    <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-4 py-5 text-sm text-slate-600">
                      Este estudiante no tiene objetivos PIE registrados.{" "}
                      <Link
                        href={`/objetivos/nuevo?estudianteId=${selectedStudentId}`}
                        className="font-semibold text-teal-700 hover:underline"
                      >
                        Crear objetivo
                      </Link>
                    </div>
                  ) : (
                    <ul className="mt-4 space-y-3">
                      {objetivosActivos.map((resumen) => {
                        const checked = objetivosTrabajadosIds.includes(
                          resumen.objetivo.id
                        );
                        return (
                          <li key={resumen.objetivo.id}>
                            <label
                              className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                                checked
                                  ? "border-violet-300 bg-violet-50/60 ring-1 ring-violet-400/30"
                                  : "border-slate-200/80 bg-white hover:border-violet-200"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  toggleItem(
                                    resumen.objetivo.id,
                                    objetivosTrabajadosIds,
                                    setObjetivosTrabajadosIds
                                  )
                                }
                                className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-slate-900">
                                  {resumen.objetivo.nombre}
                                </p>
                                <p className="mt-0.5 text-xs text-violet-700">
                                  {resumen.objetivo.dimensionRelacionada}
                                </p>
                                <p className="mt-2 text-xs text-slate-500">
                                  Estado:{" "}
                                  <span className="font-medium text-slate-700">
                                    {resumen.estado}
                                  </span>
                                </p>
                              </div>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {GLOSSARY.apoyos.utilizados}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {GLOSSARY.apoyos.utilizadosSubtitulo}
                  </p>
                  <CheckboxGrid
                    options={CATALOGO_APOYOS_SESION.map((item) => item.nombre)}
                    selected={apoyosUtilizados.map(
                      (id) =>
                        CATALOGO_APOYOS_SESION.find((item) => item.id === id)
                          ?.nombre ?? id
                    )}
                    onToggle={(nombre) => {
                      const def = CATALOGO_APOYOS_SESION.find(
                        (item) => item.nombre === nombre
                      );
                      if (!def) return;
                      toggleItem(def.id, apoyosUtilizados, setApoyosUtilizados);
                    }}
                    accent="teal"
                  />
                </div>
              </div>
            </FormBlock>

            <FormBlock
              number={3}
              title="Observaciones pedagógicas"
              subtitle="Fortalezas, intereses, contextos de éxito y barreras observadas"
            >
              <div className="space-y-6">
                <SubSection title="Fortalezas observadas">
                  <CheckboxGrid
                    options={strengthsOptions}
                    selected={strengths}
                    onToggle={(value) => toggleItem(value, strengths, setStrengths)}
                    accent="teal"
                  />
                </SubSection>

                <SubSection title="Intereses observados">
                  <CheckboxGrid
                    options={INTERES_OPTIONS}
                    selected={interests}
                    onToggle={(value) => toggleItem(value, interests, setInterests)}
                    accent="teal"
                  />
                </SubSection>

                <SubSection title="Contextos de éxito observados">
                  <CheckboxGrid
                    options={CONTEXTO_EXITO_OPTIONS}
                    selected={successContexts}
                    onToggle={(value) =>
                      toggleItem(value, successContexts, setSuccessContexts)
                    }
                    accent="teal"
                  />
                </SubSection>

                <SubSection title={GLOSSARY.barreras.observadas}>
                  <CheckboxGrid
                    options={BARRERA_OPTIONS}
                    selected={barriers}
                    onToggle={(value) => toggleItem(value, barriers, setBarriers)}
                    accent="amber"
                  />
                </SubSection>
              </div>
            </FormBlock>

            <FormBlock
              number={4}
              title="Resultados"
              subtitle="Estados emocionales, logro, participación y dimensiones impactadas"
            >
              <div className="space-y-6">
                <SubSection
                  title="Estado inicial"
                  hint={GLOSSARY.intervencion.estadoInicialHint}
                >
                  <EmotionalScale
                    name="estado-inicial"
                    value={initialState}
                    onChange={setInitialState}
                  />
                </SubSection>

                <SubSection
                  title="Estado final"
                  hint={GLOSSARY.intervencion.estadoFinalHint}
                >
                  <EmotionalScale
                    name="estado-final"
                    value={finalState}
                    onChange={setFinalState}
                  />
                </SubSection>

                <SubSection title="Logro observado">
                  <textarea
                    value={achievement}
                    onChange={(e) => setAchievement(e.target.value)}
                    rows={4}
                    placeholder={GLOSSARY.intervencion.placeholderLogro}
                    className="w-full resize-y rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </SubSection>

                <SubSection title="Nivel de participación">
                  <RadioList
                    options={CATALOGO_NIVEL_PARTICIPACION.map((item) => ({
                      id: item.id,
                      label: item.nombre,
                    }))}
                    value={nivelParticipacion}
                    onChange={setNivelParticipacion}
                    accent="teal"
                  />
                </SubSection>

                <SubSection title="Nivel de apoyo requerido">
                  <RadioList
                    options={CATALOGO_NIVEL_APOYO_REQUERIDO.map((item) => ({
                      id: item.id,
                      label: item.nombre,
                    }))}
                    value={nivelApoyoRequerido}
                    onChange={setNivelApoyoRequerido}
                    accent="violet"
                  />
                </SubSection>

                <SubSection title="Dimensiones impactadas">
                  <CheckboxGrid
                    options={dimensionOptions}
                    selected={dimensions}
                    onToggle={(value) => toggleItem(value, dimensions, setDimensions)}
                    accent="violet"
                  />
                </SubSection>
              </div>
            </FormBlock>

            <FormBlock
              number={5}
              title={GLOSSARY.evidencia.seccion}
              subtitle={GLOSSARY.evidencia.seccionSubtitulo}
            >
              <div className="space-y-3">
                {CATALOGO_EVIDENCIAS_INSTITUCIONALES.map((categoria) => {
                  const checked = evidencias.includes(categoria.id);
                  const disabled = !categoria.disponible;

                  return (
                    <label
                      key={categoria.id}
                      className={`flex gap-3 rounded-xl border px-4 py-3 transition ${
                        disabled
                          ? "cursor-not-allowed border-slate-100 bg-slate-50/50 opacity-60"
                          : checked
                            ? "cursor-pointer border-amber-300 bg-amber-50"
                            : "cursor-pointer border-slate-200/80 bg-slate-50/30 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={disabled}
                        checked={checked}
                        onChange={() => {
                          if (disabled) return;
                          toggleItem(categoria.id, evidencias, setEvidencias);
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500/30 disabled:cursor-not-allowed"
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {categoria.nombre}
                          {!categoria.disponible && (
                            <span className="ml-2 text-xs font-normal text-slate-500">
                              Próximamente
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {categoria.descripcion}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </FormBlock>

            <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => handleSaveAndNavigate(ROUTES.intervenciones)}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {GLOSSARY.intervencion.guardar}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSaveAndNavigate(`/estudiantes/${selectedStudentId}`)
                }
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {GLOSSARY.intervencion.guardarYVerEstudiante}
              </button>
            </div>
          </form>
        </main>
    </AppShell>
  );
}

function FormBlock({
  number,
  title,
  subtitle,
  children,
}: {
  number: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">
          {number}
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function SubSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-xs font-semibold uppercase tracking-wide text-slate-500"
    >
      {children}
    </label>
  );
}

function EmotionalScale({
  name,
  value,
  onChange,
}: {
  name: string;
  value: EmotionalStateId;
  onChange: (id: EmotionalStateId) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-5">
      {emotionalScale.map((state) => {
        const selected = value === state.id;
        return (
          <label
            key={`${name}-${state.id}`}
            className={`flex cursor-pointer flex-col items-center rounded-xl border px-2 py-4 text-center transition ${
              selected
                ? "border-teal-300 bg-teal-50/60 ring-2 ring-teal-500/25"
                : "border-slate-200/80 bg-slate-50/30 hover:border-teal-200 hover:bg-teal-50/20"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={state.id}
              checked={selected}
              onChange={() => onChange(state.id as EmotionalStateId)}
              className="sr-only"
            />
            <span className="text-2xl" aria-hidden>
              {state.emoji}
            </span>
            <span className="mt-2 text-xs font-medium leading-snug text-slate-700">
              {state.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function CheckboxGrid({
  options,
  selected,
  onToggle,
  accent,
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (value: string) => void;
  accent: "teal" | "violet" | "amber";
}) {
  const activeStyles = {
    teal: "border-teal-300 bg-teal-50 text-teal-900",
    violet: "border-violet-300 bg-violet-50 text-violet-900",
    amber: "border-amber-300 bg-amber-50 text-amber-900",
  }[accent];

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
              checked
                ? activeStyles
                : "border-slate-200/80 bg-slate-50/30 hover:border-slate-300"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(option)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500/30"
            />
            <span className="text-sm font-medium text-slate-700">{option}</span>
          </label>
        );
      })}
    </div>
  );
}

function RadioList<T extends string>({
  options,
  value,
  onChange,
  accent,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
  accent: "teal" | "violet";
}) {
  const activeStyles = {
    teal: "border-teal-300 bg-teal-50 ring-1 ring-teal-400/30",
    violet: "border-violet-300 bg-violet-50 ring-1 ring-violet-400/30",
  }[accent];

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const selected = value === option.id;
        return (
          <label
            key={option.id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
              selected
                ? activeStyles
                : "border-slate-200/80 bg-white hover:border-slate-300"
            }`}
          >
            <input
              type="radio"
              name={`radio-${accent}-${options[0]?.id}`}
              checked={selected}
              onChange={() => onChange(option.id)}
              className="h-4 w-4 border-slate-300 text-teal-600 focus:ring-teal-500/30"
            />
            <span className="text-sm font-medium text-slate-700">
              {option.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

