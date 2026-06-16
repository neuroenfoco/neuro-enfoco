/**
 * Mapa entidad → módulos de storage/persistence actuales.
 * Guía para migración a Supabase sin perder trazabilidad de datos relacionados.
 */

export type StorageLayer = "storage" | "persistence" | "both";

export type RepositoryAuditEntry = {
  entity: string;
  repository: string;
  localImplementation: string;
  storageModules: string[];
  persistenceModules: string[];
  storageKey?: string;
  notes?: string;
};

export const REPOSITORY_AUDIT: RepositoryAuditEntry[] = [
  {
    entity: "Estudiante",
    repository: "EstudiantesRepository",
    localImplementation: "LocalEstudiantesRepository",
    storageModules: ["@/lib/students-storage"],
    persistenceModules: [],
    storageKey: "neuro-enfoco-estudiantes",
    notes: "localStorage directo en students-storage (sin BrowserStorageAdapter aún).",
  },
  {
    entity: "ObjetivoPIE",
    repository: "ObjetivosRepository",
    localImplementation: "LocalObjetivosRepository",
    storageModules: ["@/lib/pie-objectives-storage"],
    persistenceModules: [],
    storageKey: "neuro-enfoco-objetivos-pie",
    notes: "Delete en cascada hacia apoyos, vínculos, PACI e intervenciones.",
  },
  {
    entity: "EvaluacionIntegral",
    repository: "EvaluacionesRepository",
    localImplementation: "LocalEvaluacionesRepository",
    storageModules: ["@/lib/evaluacion-integral/evaluacion-integral-storage"],
    persistenceModules: [
      "@/lib/evaluacion-integral/evaluacion-integral-persistence",
    ],
    storageKey: "neuro-enfoco-evaluaciones-integrales",
    notes:
      "Sub-entidades: hallazgos, conclusiones, participaciones, vínculos (no expuestas en repo aún).",
  },
  {
    entity: "PACI",
    repository: "PACIRepository",
    localImplementation: "LocalPACIRepository",
    storageModules: ["@/lib/paci/paci-storage"],
    persistenceModules: [
      "@/lib/paci/paci-persistence",
      "@/lib/paci/paci-objetivo-persistence",
    ],
    storageKey: "neuro-enfoco-paci",
    notes: "PACIObjetivo en paci-objetivo-persistence; lógica de negocio en paci-storage.",
  },
  {
    entity: "Intervencion",
    repository: "IntervencionesRepository",
    localImplementation: "LocalIntervencionesRepository",
    storageModules: ["@/lib/intervenciones-storage"],
    persistenceModules: [],
    storageKey: "neuro-enfoco-intervenciones",
    notes: "Delete completo elimina sesiones/evidencias en cascada.",
  },
  {
    entity: "ApoyoPIE",
    repository: "ApoyosRepository",
    localImplementation: "LocalApoyosRepository",
    storageModules: ["@/lib/apoyos/apoyos-storage"],
    persistenceModules: ["@/lib/apoyos/apoyos-persistence"],
    storageKey: "neuro-enfoco-apoyos-pie",
    notes: "getAll delega a readApoyosPIE (persistence); CRUD en apoyos-storage.",
  },
  {
    entity: "Sesion",
    repository: "SesionesRepository",
    localImplementation: "LocalSesionesRepository",
    storageModules: ["@/lib/sessions-storage"],
    persistenceModules: [],
    storageKey: "neuro-enfoco-sesiones",
    notes: "Solo lectura en repositorio; escritura permanece en sessions-storage.",
  },
];

export function getRepositoryAuditByEntity(
  entity: string
): RepositoryAuditEntry | undefined {
  return REPOSITORY_AUDIT.find((entry) => entry.entity === entity);
}

export type RepositoryAdoptionStatus = "adopted" | "partial" | "pending";

export type RepositoryAdoptionEntry = {
  module: string;
  status: RepositoryAdoptionStatus;
  notes?: string;
};

/**
 * Estado de adopción de repositorios en módulos de lectura/UI (PACI-A14.2).
 * "partial" indica uso de repositorios con excepciones documentadas.
 */
export const REPOSITORY_ADOPTION_STATUS: RepositoryAdoptionEntry[] = [
  {
    module: "Dashboard (dashboard-view)",
    status: "adopted",
    notes: "Todas las entidades vía repositorios, incluidas sesiones.",
  },
  {
    module: "Reportes (reportes-view)",
    status: "adopted",
    notes: "Datos vía repositorios y dashboard-view.",
  },
  {
    module: "Estudiante resumen integral",
    status: "adopted",
    notes: "Estudiantes, objetivos, evaluaciones, PACI, intervenciones vía repositorios.",
  },
  {
    module: "Estudiante timeline",
    status: "adopted",
    notes:
      "Intervenciones, PACI y sesiones vía repositorios; formato marco desde storage auxiliar.",
  },
  {
    module: "Estudiante acciones sugeridas",
    status: "adopted",
    notes:
      "Evaluaciones, objetivos, intervenciones y sesiones vía repositorios.",
  },
  {
    module: "Objetivo seguimiento",
    status: "adopted",
    notes:
      "Objetivos e intervenciones vía repositorios; evidencias vía evidencias-por-objetivo.",
  },
  {
    module: "Barreras/apoyos view",
    status: "adopted",
    notes: "Objetivos vía ObjetivosRepository; trazabilidad PACI en capa de vista.",
  },
  {
    module: "Apoyos view / efectividad",
    status: "adopted",
    notes: "Apoyos vía ApoyosRepository.",
  },
  {
    module: "PACI pages (CRUD UI)",
    status: "pending",
    notes: "Páginas de edición/creación PACI aún consumen paci-storage directo.",
  },
  {
    module: "Evaluación integral views",
    status: "pending",
    notes: "evaluacion-integral-view y sub-módulos aún usan storage directo.",
  },
  {
    module: "Intervenciones CRUD",
    status: "pending",
    notes:
      "Páginas y flujos de registro de intervenciones/sesiones aún usan storage directo.",
  },
  {
    module: "Apoyo-intervención view",
    status: "pending",
    notes: "apoyo-intervencion-view usa sessions-storage e intervenciones-storage.",
  },
];

export function getRepositoryAdoptionByModule(
  module: string
): RepositoryAdoptionEntry | undefined {
  return REPOSITORY_ADOPTION_STATUS.find((entry) => entry.module === module);
}
