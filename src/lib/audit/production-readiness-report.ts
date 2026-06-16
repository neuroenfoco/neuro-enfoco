/**
 * Informe consolidado de preparación para producción (PACI-A15.1).
 */

import { getAuthReadinessScore } from "@/lib/audit/auth-readiness-audit";
import {
  REPOSITORY_READINESS,
  getRepositoryReadinessScore,
  UI_ADOPTION_RATIO,
} from "@/lib/audit/repository-readiness-audit";
import { getRlsPreparationScore } from "@/lib/audit/rls-preparation-audit";
import { STORAGE_KEY_INVENTORY } from "@/lib/audit/storage-key-inventory";
import { MIGRATION_PHASES } from "@/lib/repositories/migration-plan";

export type ProductionReadinessDimension = {
  score: number;
  label: string;
  summary: string;
};

export type ProductionReadinessReport = {
  architecture: ProductionReadinessDimension;
  auth: ProductionReadinessDimension;
  repositories: ProductionReadinessDimension;
  multiuser: ProductionReadinessDimension;
  backendMigration: ProductionReadinessDimension;
  overall: number;
  migrationPhases: readonly string[];
};

function scoreStorageIsolation(): number {
  const adapterKeys = STORAGE_KEY_INVENTORY.filter((entry) =>
    entry.ownerModule.includes("persistence")
  ).length;
  const directKeys = STORAGE_KEY_INVENTORY.length - adapterKeys;
  const adapterRatio = adapterKeys / STORAGE_KEY_INVENTORY.length;
  const dualApoyoPenalty = 8;
  const noTenantPenalty = 25;
  const raw = Math.round(adapterRatio * 55 + (1 - directKeys / STORAGE_KEY_INVENTORY.length) * 20);
  return Math.max(0, Math.min(100, raw - dualApoyoPenalty - noTenantPenalty + 15));
}

export const PRODUCTION_READINESS: ProductionReadinessReport = buildProductionReadinessReport();

function buildProductionReadinessReport(): ProductionReadinessReport {
  const repoScore = getRepositoryReadinessScore();
  const authScore = getAuthReadinessScore();
  const storageScore = scoreStorageIsolation();
  const rlsScore = getRlsPreparationScore();

  const architecture: ProductionReadinessDimension = {
    score: Math.round((storageScore + repoScore) / 2),
    label: "Arquitectura",
    summary: `${STORAGE_KEY_INVENTORY.length} claves localStorage; factory de repositorios operativo; capas storage/persistence mixtas.`,
  };

  const auth: ProductionReadinessDimension = {
    score: authScore,
    label: "Autenticación",
    summary:
      "LocalAuthService completo; Supabase/Azure/Google pendientes; sin middleware ni auth server-side.",
  };

  const repositories: ProductionReadinessDimension = {
    score: repoScore,
    label: "Repositorios",
    summary: `7/7 entidades con repo local; adopción UI ~${Math.round(UI_ADOPTION_RATIO * 100)}%; Sesiones solo lectura.`,
  };

  const multiuser: ProductionReadinessDimension = {
    score: Math.round((rlsScore * 0.35 + 10) ),
    label: "Multi-usuario",
    summary:
      "Sin tenant ni RLS implementados; modelo documentado en rls-preparation-audit; datos en un solo navegador.",
  };

  const backendMigration: ProductionReadinessDimension = {
    score: Math.round((repoScore * 0.3 + authScore * 0.2 + rlsScore * 0.25 + storageScore * 0.25)),
    label: "Migración backend",
    summary: `Fases ${MIGRATION_PHASES.join(" → ")} definidas; Async* types listos; 0 implementaciones Supabase.`,
  };

  const overall = Math.round(
    architecture.score * 0.2 +
      auth.score * 0.2 +
      repositories.score * 0.25 +
      multiuser.score * 0.2 +
      backendMigration.score * 0.15
  );

  return {
    architecture,
    auth,
    repositories,
    multiuser,
    backendMigration,
    overall,
    migrationPhases: MIGRATION_PHASES,
  };
}

export function getProductionReadinessScore(): number {
  return PRODUCTION_READINESS.overall;
}

export const TOP_MIGRATION_RISKS = [
  {
    rank: 1,
    risk: "Dualidad de claves de apoyos (apoyos-pie vs apoyos-implementados)",
    impact: "Pérdida o duplicación de datos en migración PostgreSQL",
  },
  {
    rank: 2,
    risk: "CRUD UI aún en storage directo (PACI, evaluaciones, intervenciones)",
    impact: "Bypass del factory impide cutover uniforme a Supabase",
  },
  {
    rank: 3,
    risk: "Sin autenticación server-side ni middleware de rutas",
    impact: "API routes y futuro SSR expuestos sin protección real",
  },
  {
    rank: 4,
    risk: "Cascadas parciales en delete batch (objetivos/evaluaciones)",
    impact: "Huérfanos referenciales si se invocan paths fuera de deleteEstudianteCompleto",
  },
  {
    rank: 5,
    risk: "SesionesRepository solo lectura; escritura dispersa en sessions-storage",
    impact: "Contrato incompleto para migración async y RLS unificada",
  },
] as const;

export function getRepositoryReadinessSummary(): Pick<
  typeof REPOSITORY_READINESS[number],
  "repository" | "repositoryReady" | "asyncReady" | "supabaseReady" | "adopted"
>[] {
  return REPOSITORY_READINESS.map(
    ({ repository, repositoryReady, asyncReady, supabaseReady, adopted }) => ({
      repository,
      repositoryReady,
      asyncReady,
      supabaseReady,
      adopted,
    })
  );
}
