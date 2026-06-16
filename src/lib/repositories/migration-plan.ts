export const MIGRATION_PHASES = [
  "Auth",
  "Repositories",
  "Supabase",
  "Data Migration",
  "Roles",
  "Production",
] as const;

export type MigrationPhase = (typeof MIGRATION_PHASES)[number];

export type MigrationPhaseDetail = {
  phase: MigrationPhase;
  description: string;
  dependsOn: MigrationPhase[];
  deliverables: string[];
};

export const MIGRATION_PHASE_DETAILS: MigrationPhaseDetail[] = [
  {
    phase: "Auth",
    description: "Autenticación institucional (Supabase Auth o SSO).",
    dependsOn: [],
    deliverables: [
      "Proveedor de identidad configurado",
      "Sesión de usuario en cliente/servidor",
      "APP_CONFIG.dataProvider preparado para supabase",
    ],
  },
  {
    phase: "Repositories",
    description:
      "Adoptar repositorios en UI y servicios; mantener Local* como default.",
    dependsOn: ["Auth"],
    deliverables: [
      "Consumidores migrados de *-storage directo a repository-factory",
      "Contratos Async* definidos en async-ready.ts",
      "Tests de paridad Local vs futuro Supabase",
    ],
  },
  {
    phase: "Supabase",
    description: "Esquema PostgreSQL, RLS y Supabase*Repository implementations.",
    dependsOn: ["Repositories"],
    deliverables: [
      "Tablas alineadas con REPOSITORY_AUDIT",
      "Supabase client y adapters",
      "Implementaciones async por entidad",
    ],
  },
  {
    phase: "Data Migration",
    description: "Export localStorage → import PostgreSQL por institución.",
    dependsOn: ["Supabase"],
    deliverables: [
      "Script de migración por storageKey",
      "Validación de integridad referencial",
      "Rollback plan",
    ],
  },
  {
    phase: "Roles",
    description: "Permisos por rol profesional (PIE, docente, admin).",
    dependsOn: ["Supabase", "Auth"],
    deliverables: [
      "Políticas RLS por rol",
      "UI condicionada a permisos",
    ],
  },
  {
    phase: "Production",
    description: "Cutover, monitoreo y deprecación de localStorage.",
    dependsOn: ["Data Migration", "Roles"],
    deliverables: [
      "APP_CONFIG.dataProvider = supabase",
      "BrowserStorageAdapter solo para offline/export",
      "Documentación operativa",
    ],
  },
];

export function getMigrationPhaseDetail(
  phase: MigrationPhase
): MigrationPhaseDetail | undefined {
  return MIGRATION_PHASE_DETAILS.find((item) => item.phase === phase);
}
