/**
 * Readiness por repositorio de dominio (PACI-A15.1).
 */

import {
  REPOSITORY_ADOPTION_STATUS,
  type RepositoryAdoptionStatus,
} from "@/lib/repositories/repository-audit";
import { REPOSITORY_COVERAGE } from "@/lib/repositories/repository-coverage";

export type RepositoryName =
  | "Estudiantes"
  | "Objetivos"
  | "Evaluaciones"
  | "PACI"
  | "Intervenciones"
  | "Apoyos"
  | "Sesiones";

export type RepositoryReadinessEntry = {
  repository: RepositoryName;
  interfaceName: string;
  localImplementation: string;
  repositoryReady: boolean;
  asyncReady: boolean;
  supabaseReady: boolean;
  adopted: RepositoryAdoptionStatus;
  adoptionNotes: string;
  gaps: string[];
};

const ADOPTED_MODULES = REPOSITORY_ADOPTION_STATUS.filter(
  (entry) => entry.status === "adopted"
).length;
const PENDING_MODULES = REPOSITORY_ADOPTION_STATUS.filter(
  (entry) => entry.status === "pending"
).length;

/** Estado global de adopción UI: adopted / (adopted + pending). */
export const UI_ADOPTION_RATIO =
  ADOPTED_MODULES / (ADOPTED_MODULES + PENDING_MODULES);

export const REPOSITORY_READINESS: RepositoryReadinessEntry[] = [
  {
    repository: "Estudiantes",
    interfaceName: "EstudiantesRepository",
    localImplementation: "LocalEstudiantesRepository",
    repositoryReady: REPOSITORY_COVERAGE.estudiantes,
    asyncReady: false,
    supabaseReady: false,
    adopted: "adopted",
    adoptionNotes: "Dashboard, resumen integral y CRUD vía factory.",
    gaps: [
      "students-storage usa localStorage directo (sin BrowserStorageAdapter).",
      "delete delega a deleteEstudianteCompleto vía require dinámico.",
    ],
  },
  {
    repository: "Objetivos",
    interfaceName: "ObjetivosRepository",
    localImplementation: "LocalObjetivosRepository",
    repositoryReady: REPOSITORY_COVERAGE.objetivos,
    asyncReady: false,
    supabaseReady: false,
    adopted: "adopted",
    adoptionNotes: "Vistas analíticas y seguimiento adoptadas.",
    gaps: [
      "evidencias-por-objetivo.ts lee localStorage directo de objetivos.",
      "Delete batch por estudiante no limpia referencias en intervenciones.",
    ],
  },
  {
    repository: "Evaluaciones",
    interfaceName: "EvaluacionesRepository",
    localImplementation: "LocalEvaluacionesRepository",
    repositoryReady: REPOSITORY_COVERAGE.evaluaciones,
    asyncReady: false,
    supabaseReady: false,
    adopted: "partial",
    adoptionNotes:
      "Dashboard/resumen adoptados; evaluacion-integral-view aún usa storage directo.",
    gaps: [
      "Sub-entidades (hallazgos, conclusiones, participaciones, vínculos) fuera del repo.",
      "Capa persistence + storage dual para evaluaciones integrales.",
    ],
  },
  {
    repository: "PACI",
    interfaceName: "PACIRepository",
    localImplementation: "LocalPACIRepository",
    repositoryReady: REPOSITORY_COVERAGE.paci,
    asyncReady: false,
    supabaseReady: false,
    adopted: "partial",
    adoptionNotes:
      "Lectura en dashboard/resumen; páginas CRUD PACI aún en paci-storage.",
    gaps: [
      "PACIObjetivo no expuesto en interfaz de repositorio.",
      "Delete PACI restringido a estado borrador.",
    ],
  },
  {
    repository: "Intervenciones",
    interfaceName: "IntervencionesRepository",
    localImplementation: "LocalIntervencionesRepository",
    repositoryReady: REPOSITORY_COVERAGE.intervenciones,
    asyncReady: false,
    supabaseReady: false,
    adopted: "partial",
    adoptionNotes:
      "Lectura analítica adoptada; flujos CRUD/sesiones aún en storage directo.",
    gaps: [
      "Páginas de registro de intervenciones no migradas al factory.",
      "apoyo-intervencion-view usa sessions-storage e intervenciones-storage.",
    ],
  },
  {
    repository: "Apoyos",
    interfaceName: "ApoyosRepository",
    localImplementation: "LocalApoyosRepository",
    repositoryReady: REPOSITORY_COVERAGE.apoyos,
    asyncReady: false,
    supabaseReady: false,
    adopted: "adopted",
    adoptionNotes: "Apoyos view y efectividad vía ApoyosRepository.",
    gaps: [
      "Dos claves de apoyos: neuro-enfoco-apoyos-implementados vs neuro-enfoco-apoyos-pie.",
      "REPOSITORY_AUDIT lista storageKey apoyos-pie; implementación usa apoyos-implementados.",
    ],
  },
  {
    repository: "Sesiones",
    interfaceName: "SesionesRepository",
    localImplementation: "LocalSesionesRepository",
    repositoryReady: REPOSITORY_COVERAGE.sesiones,
    asyncReady: false,
    supabaseReady: false,
    adopted: "adopted",
    adoptionNotes: "Lectura en dashboard, timeline y acciones sugeridas.",
    gaps: [
      "Repositorio solo lectura: sin save/update/delete.",
      "Escritura permanece en sessions-storage desde flujos CRUD.",
    ],
  },
];

export function getRepositoryReadinessScore(): number {
  const weights = REPOSITORY_READINESS.map((entry) => {
    let score = 0;
    if (entry.repositoryReady) score += 40;
    if (entry.adopted === "adopted") score += 35;
    else if (entry.adopted === "partial") score += 18;
    if (entry.asyncReady) score += 10;
    if (entry.supabaseReady) score += 15;
    return score;
  });
  const total = weights.reduce((sum, value) => sum + value, 0);
  return Math.round(total / REPOSITORY_READINESS.length);
}
