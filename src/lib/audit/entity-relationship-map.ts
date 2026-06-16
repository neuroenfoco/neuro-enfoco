/**
 * Grafo de entidades y cardinalidades para migración backend (PACI-A15.1).
 */

export type EntityCardinality = "1:1" | "1:N" | "N:M";

export type EntityRelationship = {
  from: string;
  to: string;
  cardinality: EntityCardinality;
  foreignKey: string;
  ownerModule: string;
  cascadeOnDelete: "cascade" | "set-null" | "restrict" | "none";
  notes?: string;
};

export type EntityNode = {
  entity: string;
  storageKeys: string[];
  ownerModule: string;
  repository?: string;
  rootEntity?: boolean;
  notes?: string;
};

export const ENTITY_NODES: EntityNode[] = [
  {
    entity: "Estudiante",
    storageKeys: ["neuro-enfoco-estudiantes"],
    ownerModule: "@/lib/students-storage",
    repository: "EstudiantesRepository",
    rootEntity: true,
  },
  {
    entity: "ObjetivoPIE",
    storageKeys: ["neuro-enfoco-objetivos-pie"],
    ownerModule: "@/lib/pie-objectives-storage",
    repository: "ObjetivosRepository",
  },
  {
    entity: "ApoyoPIE",
    storageKeys: ["neuro-enfoco-apoyos-implementados"],
    ownerModule: "@/lib/apoyos/apoyos-persistence",
    repository: "ApoyosRepository",
  },
  {
    entity: "ApoyoImplementadoLegacy",
    storageKeys: ["neuro-enfoco-apoyos-pie"],
    ownerModule: "@/lib/pie-apoyos-storage",
    notes: "Legacy paralelo a ApoyoPIE; mismo dominio conceptual.",
  },
  {
    entity: "Intervencion",
    storageKeys: ["neuro-enfoco-intervenciones"],
    ownerModule: "@/lib/intervenciones-storage",
    repository: "IntervencionesRepository",
  },
  {
    entity: "Sesion",
    storageKeys: ["neuro-enfoco-sesiones"],
    ownerModule: "@/lib/sessions-storage",
    repository: "SesionesRepository",
  },
  {
    entity: "EvaluacionIntegral",
    storageKeys: ["neuro-enfoco-evaluaciones-integrales"],
    ownerModule: "@/lib/evaluacion-integral/evaluacion-integral-persistence",
    repository: "EvaluacionesRepository",
  },
  {
    entity: "HallazgoEvaluativo",
    storageKeys: ["neuro-enfoco-hallazgos-evaluativos"],
    ownerModule: "@/lib/evaluacion-integral/hallazgo-evaluativo-storage",
  },
  {
    entity: "ConclusionEvaluativa",
    storageKeys: ["neuro-enfoco-conclusiones-evaluativas"],
    ownerModule: "@/lib/evaluacion-integral/conclusion-evaluativa-persistence",
  },
  {
    entity: "ParticipacionEvaluacionIntegral",
    storageKeys: ["neuro-enfoco-participaciones-evaluacion-integral"],
    ownerModule: "@/lib/evaluacion-integral/participacion-evaluacion-integral-storage",
  },
  {
    entity: "VinculoConclusionObjetivo",
    storageKeys: ["neuro-enfoco-vinculos-conclusion-objetivo-pie"],
    ownerModule: "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-persistence",
  },
  {
    entity: "PACI",
    storageKeys: ["neuro-enfoco-paci"],
    ownerModule: "@/lib/paci/paci-persistence",
    repository: "PACIRepository",
  },
  {
    entity: "PACIObjetivo",
    storageKeys: ["neuro-enfoco-paci-objetivos"],
    ownerModule: "@/lib/paci/paci-objetivo-persistence",
  },
  {
    entity: "VinculoApoyoIntervencion",
    storageKeys: ["neuro-enfoco-vinculos-apoyo-intervencion"],
    ownerModule: "@/lib/apoyos/apoyo-intervencion-persistence",
  },
  {
    entity: "HallazgoPerfil",
    storageKeys: ["neuro-enfoco-perfil-hallazgos"],
    ownerModule: "@/lib/perfil-hallazgos-storage",
  },
  {
    entity: "ObservacionHallazgo",
    storageKeys: ["neuro-enfoco-observaciones-hallazgo"],
    ownerModule: "@/lib/perfil-hallazgos-storage",
  },
  {
    entity: "MarcoInstitucionalPIE",
    storageKeys: ["neuro-enfoco-marco-institucional-pie"],
    ownerModule: "@/lib/marco-institucional-pie-storage",
  },
  {
    entity: "ParticipacionProfesionalEstudiante",
    storageKeys: ["neuro-enfoco-participaciones-profesional-estudiante"],
    ownerModule: "@/lib/institucional/participaciones-profesional-estudiante-storage",
  },
  {
    entity: "Profesional",
    storageKeys: ["neuro-enfoco-profesionales"],
    ownerModule: "@/lib/institucional/profesionales-storage",
    rootEntity: true,
  },
  {
    entity: "Espacio",
    storageKeys: ["neuro-enfoco-espacios"],
    ownerModule: "@/lib/espacios-storage",
    rootEntity: true,
  },
];

export const ENTITY_RELATIONSHIPS: EntityRelationship[] = [
  {
    from: "Estudiante",
    to: "ObjetivoPIE",
    cardinality: "1:N",
    foreignKey: "estudianteId",
    ownerModule: "@/lib/pie-objectives-storage",
    cascadeOnDelete: "cascade",
  },
  {
    from: "Estudiante",
    to: "Intervencion",
    cardinality: "1:N",
    foreignKey: "estudianteId",
    ownerModule: "@/lib/intervenciones-storage",
    cascadeOnDelete: "cascade",
  },
  {
    from: "Estudiante",
    to: "EvaluacionIntegral",
    cardinality: "1:N",
    foreignKey: "estudianteId",
    ownerModule: "@/lib/evaluacion-integral/evaluacion-integral-persistence",
    cascadeOnDelete: "cascade",
  },
  {
    from: "Estudiante",
    to: "PACI",
    cardinality: "1:N",
    foreignKey: "estudianteId",
    ownerModule: "@/lib/paci/paci-persistence",
    cascadeOnDelete: "cascade",
  },
  {
    from: "Estudiante",
    to: "ApoyoPIE",
    cardinality: "1:N",
    foreignKey: "estudianteId",
    ownerModule: "@/lib/apoyos/apoyos-persistence",
    cascadeOnDelete: "cascade",
  },
  {
    from: "ObjetivoPIE",
    to: "ApoyoPIE",
    cardinality: "1:N",
    foreignKey: "objetivoPieId",
    ownerModule: "@/lib/apoyos/apoyos-persistence",
    cascadeOnDelete: "cascade",
  },
  {
    from: "ObjetivoPIE",
    to: "ApoyoImplementadoLegacy",
    cardinality: "1:N",
    foreignKey: "objetivoId",
    ownerModule: "@/lib/pie-apoyos-storage",
    cascadeOnDelete: "cascade",
    notes: "Segunda clave de apoyos; consolidar en migración.",
  },
  {
    from: "ObjetivoPIE",
    to: "Intervencion",
    cardinality: "1:N",
    foreignKey: "objetivoId",
    ownerModule: "@/lib/intervenciones-storage",
    cascadeOnDelete: "set-null",
    notes: "removeObjetivoFromIntervenciones en delete individual, no en batch por estudiante.",
  },
  {
    from: "ObjetivoPIE",
    to: "PACIObjetivo",
    cardinality: "1:N",
    foreignKey: "objetivoPieId",
    ownerModule: "@/lib/paci/paci-objetivo-persistence",
    cascadeOnDelete: "cascade",
  },
  {
    from: "ObjetivoPIE",
    to: "VinculoConclusionObjetivo",
    cardinality: "1:N",
    foreignKey: "objetivoPieId",
    ownerModule: "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-persistence",
    cascadeOnDelete: "cascade",
  },
  {
    from: "Intervencion",
    to: "Sesion",
    cardinality: "1:N",
    foreignKey: "intervencionId",
    ownerModule: "@/lib/sessions-storage",
    cascadeOnDelete: "cascade",
  },
  {
    from: "EvaluacionIntegral",
    to: "HallazgoEvaluativo",
    cardinality: "1:N",
    foreignKey: "evaluacionIntegralId",
    ownerModule: "@/lib/evaluacion-integral/hallazgo-evaluativo-storage",
    cascadeOnDelete: "cascade",
  },
  {
    from: "EvaluacionIntegral",
    to: "ConclusionEvaluativa",
    cardinality: "1:N",
    foreignKey: "evaluacionIntegralId",
    ownerModule: "@/lib/evaluacion-integral/conclusion-evaluativa-persistence",
    cascadeOnDelete: "cascade",
  },
  {
    from: "EvaluacionIntegral",
    to: "ParticipacionEvaluacionIntegral",
    cardinality: "1:N",
    foreignKey: "evaluacionIntegralId",
    ownerModule: "@/lib/evaluacion-integral/participacion-evaluacion-integral-storage",
    cascadeOnDelete: "cascade",
  },
  {
    from: "PACI",
    to: "PACIObjetivo",
    cardinality: "1:N",
    foreignKey: "paciId",
    ownerModule: "@/lib/paci/paci-objetivo-persistence",
    cascadeOnDelete: "cascade",
  },
  {
    from: "ApoyoPIE",
    to: "VinculoApoyoIntervencion",
    cardinality: "1:N",
    foreignKey: "apoyoId",
    ownerModule: "@/lib/apoyos/apoyo-intervencion-persistence",
    cascadeOnDelete: "cascade",
  },
  {
    from: "Intervencion",
    to: "VinculoApoyoIntervencion",
    cardinality: "1:N",
    foreignKey: "intervencionId",
    ownerModule: "@/lib/apoyos/apoyo-intervencion-persistence",
    cascadeOnDelete: "cascade",
  },
  {
    from: "Estudiante",
    to: "ParticipacionProfesionalEstudiante",
    cardinality: "1:N",
    foreignKey: "estudianteId",
    ownerModule: "@/lib/institucional/participaciones-profesional-estudiante-storage",
    cascadeOnDelete: "cascade",
  },
  {
    from: "Profesional",
    to: "ParticipacionProfesionalEstudiante",
    cardinality: "1:N",
    foreignKey: "profesionalId",
    ownerModule: "@/lib/institucional/participaciones-profesional-estudiante-storage",
    cascadeOnDelete: "restrict",
  },
];
