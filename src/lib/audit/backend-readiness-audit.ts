/**
 * Auditoría consolidada de preparación backend (PACI-A15.1).
 */

import { summarizeCascadeAudit } from "@/lib/audit/cascade-delete-audit";
import {
  getAuthReadinessAudit,
  getAuthReadinessScore,
} from "@/lib/audit/auth-readiness-audit";
import { getAsyncMigrationMethodCount } from "@/lib/audit/async-migration-matrix";
import {
  getRepositoryReadinessScore,
  UI_ADOPTION_RATIO,
} from "@/lib/audit/repository-readiness-audit";
import { getRlsPreparationScore } from "@/lib/audit/rls-preparation-audit";
import {
  getProductionReadinessScore,
  PRODUCTION_READINESS,
} from "@/lib/audit/production-readiness-report";
import { getStorageKeyCount } from "@/lib/audit/storage-key-inventory";
import { REPOSITORY_COVERAGE } from "@/lib/repositories/repository-coverage";
import { ASYNC_READY_REPOSITORIES } from "@/lib/repositories/async-ready";

export type BackendReadinessAudit = {
  repositoryCoverage: number;
  authReadiness: number;
  storageIsolation: number;
  asyncReadiness: number;
  multiUserReadiness: number;
  overallReadiness: number;
  metadata: {
    storageKeyCount: number;
    repositoryEntityCount: number;
    uiAdoptionPercent: number;
    asyncMethodCount: number;
    asyncRepositoryContracts: number;
    cascadeSummary: ReturnType<typeof summarizeCascadeAudit>;
    productionOverall: number;
    authDetail: ReturnType<typeof getAuthReadinessAudit>;
  };
};

function scoreRepositoryCoverage(): number {
  const entities = Object.values(REPOSITORY_COVERAGE);
  const coverageExists = entities.filter(Boolean).length / entities.length;
  const sesionesReadOnlyPenalty = 8;
  const raw =
    coverageExists * 45 + UI_ADOPTION_RATIO * 45 + (coverageExists === 1 ? 10 : 0);
  return Math.round(Math.max(0, raw - sesionesReadOnlyPenalty));
}

function scoreStorageIsolation(): number {
  const keyCount = getStorageKeyCount();
  const persistenceModules = 8;
  const adapterRatio = persistenceModules / keyCount;
  const dualApoyoPenalty = 10;
  const noTenantPenalty = 20;
  const raw = Math.round(adapterRatio * 60 + 15 - dualApoyoPenalty - noTenantPenalty);
  return Math.max(0, Math.min(100, raw));
}

function scoreAsyncReadiness(): number {
  const contractsDefined = ASYNC_READY_REPOSITORIES.length;
  const totalRepos = 7;
  const methodCount = getAsyncMigrationMethodCount();
  const contractScore = (contractsDefined / totalRepos) * 40;
  const methodInventoryScore = Math.min(30, methodCount);
  const implementationScore = 0;
  return Math.round(contractScore + methodInventoryScore + implementationScore);
}

function scoreMultiUserReadiness(): number {
  const rlsDocScore = getRlsPreparationScore() * 0.25;
  const tenantScore = 0;
  const serverAuthScore = 0;
  return Math.round(rlsDocScore + tenantScore + serverAuthScore + 5);
}

export function getBackendReadinessAudit(): BackendReadinessAudit {
  const repositoryCoverage = scoreRepositoryCoverage();
  const authReadiness = getAuthReadinessScore();
  const storageIsolation = scoreStorageIsolation();
  const asyncReadiness = scoreAsyncReadiness();
  const multiUserReadiness = scoreMultiUserReadiness();

  const overallReadiness = Math.round(
    repositoryCoverage * 0.25 +
      authReadiness * 0.2 +
      storageIsolation * 0.15 +
      asyncReadiness * 0.15 +
      multiUserReadiness * 0.25
  );

  return {
    repositoryCoverage,
    authReadiness,
    storageIsolation,
    asyncReadiness,
    multiUserReadiness,
    overallReadiness,
    metadata: {
      storageKeyCount: getStorageKeyCount(),
      repositoryEntityCount: Object.keys(REPOSITORY_COVERAGE).length,
      uiAdoptionPercent: Math.round(UI_ADOPTION_RATIO * 100),
      asyncMethodCount: getAsyncMigrationMethodCount(),
      asyncRepositoryContracts: ASYNC_READY_REPOSITORIES.length,
      cascadeSummary: summarizeCascadeAudit(),
      productionOverall: getProductionReadinessScore(),
      authDetail: getAuthReadinessAudit(),
    },
  };
}

export { PRODUCTION_READINESS };
