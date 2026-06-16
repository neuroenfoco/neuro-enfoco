/**
 * Cobertura de repositorios por entidad de dominio (PACI-A14.2).
 * true = existe repositorio local con delegación a storage; listo para swap a Supabase.
 * false = módulos aún consumen storage/persistence directo en lectura o escritura.
 */
export const REPOSITORY_COVERAGE = {
  estudiantes: true,
  objetivos: true,
  evaluaciones: true,
  paci: true,
  intervenciones: true,
  apoyos: true,
  sesiones: true,
} as const;

export type RepositoryCoverageKey = keyof typeof REPOSITORY_COVERAGE;
