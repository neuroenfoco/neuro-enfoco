"use client";

import {
  BARRERA_OPTIONS,
  calcularMejoraSesion,
  CONTEXTO_EXITO_OPTIONS,
  ESTRATEGIA_OPTIONS,
  formatSesionFecha,
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
import type { ComponentType, SVGProps } from "react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const navItems = [
  { label: "Dashboard", href: "/", active: false, icon: LayoutDashboardIcon },
  { label: "Estudiantes", href: "/estudiantes", active: false, icon: UsersIcon },
  { label: "Sesiones", href: "/sesiones/nueva", active: true, icon: CalendarIcon },
  { label: "Objetivos", href: "/objetivos", active: false, icon: TargetIcon },
  { label: "Reportes", href: "#", active: false, icon: ChartIcon },
] as const;

const spaces = [
  "Sala Multisensorial",
  "Espacio de Calma",
  "Aula",
  "Patio",
  "Otro",
] as const;

const emotionalScale = [
  { id: "muy-alterada", emoji: "😣", label: "Muy alterada" },
  { id: "alterada", emoji: "😕", label: "Alterada" },
  { id: "neutral", emoji: "😐", label: "Neutral" },
  { id: "regulada", emoji: "🙂", label: "Regulada" },
  { id: "muy-regulada", emoji: "😄", label: "Muy regulada" },
] as const;

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

const evidenceOptions = ["Evidencia PIE", "Evidencia Ley TEA"] as const;

const defaultAchievement =
  "Utilizó una estrategia de regulación emocional sin apoyo directo.";

export default function NuevaSesionPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Estudiante[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState(MARTINA_STUDENT_ID);

  useEffect(() => {
    setStudents(getEstudiantes());
  }, []);
  const [selectedSpace, setSelectedSpace] = useState<string>("Sala Multisensorial");
  const [initialState, setInitialState] = useState("neutral");
  const [finalState, setFinalState] = useState("regulada");
  const [strengths, setStrengths] = useState<string[]>(["Persistencia"]);
  const [interests, setInterests] = useState<string[]>([]);
  const [successContexts, setSuccessContexts] = useState<string[]>([]);
  const [strategies, setStrategies] = useState<string[]>([]);
  const [barriers, setBarriers] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState<string[]>(["Regulación emocional"]);
  const [evidences, setEvidences] = useState<string[]>([]);
  const [achievement, setAchievement] = useState(defaultAchievement);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function getEmotionLabel(stateId: string): string {
    return (
      emotionalScale.find((state) => state.id === stateId)?.label ?? stateId
    );
  }

  function buildSesion(): Sesion {
    const student = students.find((item) => item.id === selectedStudentId);

    return {
      id: crypto.randomUUID(),
      fecha: formatSesionFecha(),
      estudianteId: student?.id ?? selectedStudentId,
      estudiante: student?.nombre ?? "Estudiante",
      espacio: selectedSpace,
      estadoInicial: getEmotionLabel(initialState),
      fortalezas: [...strengths],
      interesesObservados: [...interests],
      contextosExitoObservados: [...successContexts],
      estrategiasQueAyudaron: [...strategies],
      barrerasObservadas: [...barriers],
      logro: achievement.trim(),
      dimensiones: [...dimensions],
      evidenciaPIE: evidences.includes("Evidencia PIE"),
      evidenciaLeyTEA: evidences.includes("Evidencia Ley TEA"),
      estadoFinal: getEmotionLabel(finalState),
      mejoraSesion: calcularMejoraSesion(
        getEmotionLabel(initialState),
        getEmotionLabel(finalState)
      ),
    };
  }

  function persistSession(): void {
    saveSesion(buildSesion());
  }

  function handleSaveAndNavigate(destination: "/sesiones" | `/estudiantes/${string}`) {
    if (isSaving) return;

    persistSession();
    setIsSaving(true);
    setSaveMessage("Sesión registrada correctamente");
    window.setTimeout(() => {
      router.push(destination);
    }, 1500);
  }

  function toggleItem(
    value: string,
    list: string[],
    setter: (next: string[]) => void
  ) {
    setter(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );
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
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="font-medium text-teal-700 hover:text-teal-800">
              Dashboard
            </Link>
            <span aria-hidden>/</span>
            <span className="text-slate-700">Registrar sesión</span>
          </div>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
            Registrar Nueva Sesión
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
            Registro de avances, fortalezas y evidencias.
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
            className="mx-auto max-w-3xl space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <FormSection
              title="Estudiante"
              subtitle="Selecciona a quién corresponde esta sesión"
            >
              <div className="grid gap-3 sm:grid-cols-2">
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
            </FormSection>

            <FormSection
              title="Espacio utilizado"
              subtitle="Dónde se realizó la sesión"
            >
              <div className="flex flex-wrap gap-2">
                {spaces.map((space) => {
                  const selected = selectedSpace === space;
                  return (
                    <button
                      key={space}
                      type="button"
                      onClick={() => setSelectedSpace(space)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        selected
                          ? "border-teal-300 bg-teal-50 text-teal-900"
                          : "border-slate-200 bg-white text-slate-600 hover:border-teal-200"
                      }`}
                    >
                      {space}
                    </button>
                  );
                })}
              </div>
            </FormSection>

            <FormSection
              title="Estado inicial"
              subtitle="Cómo llegó el estudiante a la sesión"
            >
              <EmotionalScale
                name="estado-inicial"
                value={initialState}
                onChange={setInitialState}
              />
            </FormSection>

            <FormSection
              title="Fortalezas observadas"
              subtitle="Capacidades manifestadas durante la sesión"
            >
              <CheckboxGrid
                options={strengthsOptions}
                selected={strengths}
                onToggle={(value) => toggleItem(value, strengths, setStrengths)}
                accent="teal"
              />
            </FormSection>

            <FormSection
              title="Intereses observados"
              subtitle="Motivadores y temas que conectaron durante la sesión"
            >
              <CheckboxGrid
                options={INTERES_OPTIONS}
                selected={interests}
                onToggle={(value) => toggleItem(value, interests, setInterests)}
                accent="teal"
              />
            </FormSection>

            <FormSection
              title="Contextos de éxito observados"
              subtitle="Condiciones donde el estudiante se desenvolvió mejor"
            >
              <CheckboxGrid
                options={CONTEXTO_EXITO_OPTIONS}
                selected={successContexts}
                onToggle={(value) =>
                  toggleItem(value, successContexts, setSuccessContexts)
                }
                accent="teal"
              />
            </FormSection>

            <FormSection
              title="Estrategias que ayudaron"
              subtitle="Ajustes y apoyos que facilitaron la participación"
            >
              <CheckboxGrid
                options={ESTRATEGIA_OPTIONS}
                selected={strategies}
                onToggle={(value) => toggleItem(value, strategies, setStrategies)}
                accent="teal"
              />
            </FormSection>

            <FormSection
              title="Barreras observadas"
              subtitle="Aspectos que dificultaron la participación durante la sesión"
            >
              <CheckboxGrid
                options={BARRERA_OPTIONS}
                selected={barriers}
                onToggle={(value) => toggleItem(value, barriers, setBarriers)}
                accent="amber"
              />
            </FormSection>

            <FormSection
              title="Logro observado"
              subtitle="Describe el avance desde un enfoque de fortalezas"
            >
              <textarea
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                rows={4}
                placeholder="Ej: Utilizó una estrategia de regulación emocional sin apoyo directo."
                className="w-full resize-y rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-sm placeholder:text-slate-400 focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </FormSection>

            <FormSection
              title="Dimensiones impactadas"
              subtitle="Áreas del Perfil Socioemocional Evolutivo"
            >
              <CheckboxGrid
                options={dimensionOptions}
                selected={dimensions}
                onToggle={(value) => toggleItem(value, dimensions, setDimensions)}
                accent="violet"
              />
            </FormSection>

            <FormSection title="Evidencias" subtitle="Documentación institucional">
              <CheckboxGrid
                options={evidenceOptions}
                selected={evidences}
                onToggle={(value) => toggleItem(value, evidences, setEvidences)}
                accent="amber"
              />
            </FormSection>

            <FormSection
              title="Estado final"
              subtitle="Cómo finalizó el estudiante la sesión"
            >
              <EmotionalScale
                name="estado-final"
                value={finalState}
                onChange={setFinalState}
              />
            </FormSection>

            <div className="flex flex-col gap-3 border-t border-slate-200/80 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => handleSaveAndNavigate("/sesiones")}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200/80 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Guardar Sesión
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSaveAndNavigate(`/estudiantes/${selectedStudentId}`)
                }
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-teal-600/25 transition hover:from-teal-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Guardar y Ver Estudiante
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

function FormSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-[0_1px_3px_rgba(15,60,50,0.06)]">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function EmotionalScale({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (id: string) => void;
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
              onChange={() => onChange(state.id)}
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
