export type { BackendReadinessAudit } from "@/lib/audit/backend-readiness-audit";
export { getBackendReadinessAudit } from "@/lib/audit/backend-readiness-audit";

export type { StorageKeyAudit } from "@/lib/audit/storage-key-inventory";
export {
  STORAGE_KEY_INVENTORY,
  getStorageKeyCount,
} from "@/lib/audit/storage-key-inventory";

export type {
  EntityNode,
  EntityRelationship,
  EntityCardinality,
} from "@/lib/audit/entity-relationship-map";
export {
  ENTITY_NODES,
  ENTITY_RELATIONSHIPS,
} from "@/lib/audit/entity-relationship-map";

export type {
  CascadeDeletePath,
  CascadeStatus,
  CascadeAuditSummary,
} from "@/lib/audit/cascade-delete-audit";
export {
  CASCADE_DELETE_PATHS,
  summarizeCascadeAudit,
} from "@/lib/audit/cascade-delete-audit";

export type {
  RepositoryReadinessEntry,
  RepositoryName,
} from "@/lib/audit/repository-readiness-audit";
export {
  REPOSITORY_READINESS,
  getRepositoryReadinessScore,
  UI_ADOPTION_RATIO,
} from "@/lib/audit/repository-readiness-audit";

export type { AuthReadinessAudit } from "@/lib/audit/auth-readiness-audit";
export {
  getAuthReadinessAudit,
  getAuthReadinessScore,
} from "@/lib/audit/auth-readiness-audit";

export type { AsyncMigrationEntry } from "@/lib/audit/async-migration-matrix";
export {
  ASYNC_MIGRATION_MATRIX,
  ASYNC_MIGRATION_ORDER,
  getAsyncMigrationMethodCount,
  getAsyncMigrationMethodCountByRepository,
} from "@/lib/audit/async-migration-matrix";

export type {
  RlsPreparationEntry,
  RlsOwnershipModel,
  RlsStrategy,
} from "@/lib/audit/rls-preparation-audit";
export {
  RLS_PREPARATION_AUDIT,
  getRlsPreparationScore,
} from "@/lib/audit/rls-preparation-audit";

export type {
  ProductionReadinessReport,
  ProductionReadinessDimension,
} from "@/lib/audit/production-readiness-report";
export {
  PRODUCTION_READINESS,
  TOP_MIGRATION_RISKS,
  getProductionReadinessScore,
  getRepositoryReadinessSummary,
} from "@/lib/audit/production-readiness-report";
