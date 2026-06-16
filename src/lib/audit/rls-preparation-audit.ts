/**
 * Preparación de modelo de ownership para RLS futuro (PACI-A15.1).
 */

export type RlsOwnershipModel =
  | "institution"
  | "estudiante"
  | "profesional"
  | "shared-read"
  | "system";

export type RlsStrategy = "tenant-isolation" | "student-scoped" | "role-based" | "junction";

export type RlsPreparationEntry = {
  entity: string;
  tableName: string;
  ownershipModel: RlsOwnershipModel;
  ownerColumn: string;
  strategy: RlsStrategy;
  policies: string[];
  migrationNotes?: string;
};

export const RLS_PREPARATION_AUDIT: RlsPreparationEntry[] = [
  {
    entity: "Estudiante",
    tableName: "estudiantes",
    ownershipModel: "institution",
    ownerColumn: "institucion_id",
    strategy: "tenant-isolation",
    policies: [
      "SELECT: miembros de la institución con rol pie.read o superior",
      "INSERT/UPDATE: pie.write",
      "DELETE: pie.admin con cascada server-side",
    ],
    migrationNotes: "Requiere columna institucion_id nueva; no existe en localStorage.",
  },
  {
    entity: "ObjetivoPIE",
    tableName: "objetivos_pie",
    ownershipModel: "estudiante",
    ownerColumn: "estudiante_id",
    strategy: "student-scoped",
    policies: [
      "Acceso vía JOIN estudiantes WHERE institucion_id = auth.institucion_id()",
    ],
  },
  {
    entity: "ApoyoPIE",
    tableName: "apoyos_pie",
    ownershipModel: "estudiante",
    ownerColumn: "estudiante_id",
    strategy: "student-scoped",
    policies: ["Consolidar apoyos-implementados y apoyos-pie legacy en una tabla"],
    migrationNotes: "Migración debe unificar neuro-enfoco-apoyos-implementados y neuro-enfoco-apoyos-pie.",
  },
  {
    entity: "Intervencion",
    tableName: "intervenciones",
    ownershipModel: "estudiante",
    ownerColumn: "estudiante_id",
    strategy: "student-scoped",
    policies: ["Profesional creador puede UPDATE en ventana de edición"],
  },
  {
    entity: "Sesion",
    tableName: "sesiones",
    ownershipModel: "estudiante",
    ownerColumn: "estudiante_id",
    strategy: "student-scoped",
    policies: ["Cascada ON DELETE desde intervenciones"],
  },
  {
    entity: "EvaluacionIntegral",
    tableName: "evaluaciones_integrales",
    ownershipModel: "estudiante",
    ownerColumn: "estudiante_id",
    strategy: "student-scoped",
    policies: ["Sub-tablas heredan evaluacion_integral_id con RLS por estudiante"],
  },
  {
    entity: "HallazgoEvaluativo",
    tableName: "hallazgos_evaluativos",
    ownershipModel: "estudiante",
    ownerColumn: "evaluacion_integral_id",
    strategy: "student-scoped",
    policies: ["RLS indirecta vía evaluaciones_integrales.estudiante_id"],
  },
  {
    entity: "ConclusionEvaluativa",
    tableName: "conclusiones_evaluativas",
    ownershipModel: "estudiante",
    ownerColumn: "evaluacion_integral_id",
    strategy: "student-scoped",
    policies: ["RLS indirecta vía evaluaciones_integrales"],
  },
  {
    entity: "ParticipacionEvaluacionIntegral",
    tableName: "participaciones_evaluacion_integral",
    ownershipModel: "profesional",
    ownerColumn: "profesional_id",
    strategy: "junction",
    policies: ["Profesional ve participaciones propias; coordinador PIE ve todas del estudiante"],
  },
  {
    entity: "PACI",
    tableName: "paci",
    ownershipModel: "estudiante",
    ownerColumn: "estudiante_id",
    strategy: "student-scoped",
    policies: ["paci.write para edición; paci.read para consulta"],
  },
  {
    entity: "PACIObjetivo",
    tableName: "paci_objetivos",
    ownershipModel: "estudiante",
    ownerColumn: "paci_id",
    strategy: "student-scoped",
    policies: ["RLS indirecta vía paci.estudiante_id"],
  },
  {
    entity: "VinculoApoyoIntervencion",
    tableName: "vinculos_apoyo_intervencion",
    ownershipModel: "estudiante",
    ownerColumn: "estudiante_id",
    strategy: "junction",
    policies: ["Denormalizar estudiante_id para políticas eficientes"],
  },
  {
    entity: "VinculoConclusionObjetivo",
    tableName: "vinculos_conclusion_objetivo",
    ownershipModel: "estudiante",
    ownerColumn: "estudiante_id",
    strategy: "junction",
    policies: ["Denormalizar estudiante_id desde objetivo o conclusión"],
  },
  {
    entity: "Profesional",
    tableName: "profesionales",
    ownershipModel: "institution",
    ownerColumn: "institucion_id",
    strategy: "tenant-isolation",
    policies: ["Solo administradores institucionales gestionan catálogo"],
  },
  {
    entity: "ParticipacionProfesionalEstudiante",
    tableName: "participaciones_profesional_estudiante",
    ownershipModel: "profesional",
    ownerColumn: "profesional_id",
    strategy: "junction",
    policies: ["Profesional ve estudiantes asignados; admin ve todos"],
  },
  {
    entity: "Espacio",
    tableName: "espacios",
    ownershipModel: "institution",
    ownerColumn: "institucion_id",
    strategy: "tenant-isolation",
    policies: ["Catálogo institucional compartido en lectura"],
  },
  {
    entity: "MarcoInstitucionalPIE",
    tableName: "marcos_institucionales_pie",
    ownershipModel: "estudiante",
    ownerColumn: "estudiante_id",
    strategy: "student-scoped",
    policies: ["1:1 con estudiante en modelo relacional"],
  },
  {
    entity: "HallazgoPerfil",
    tableName: "hallazgos_perfil",
    ownershipModel: "estudiante",
    ownerColumn: "estudiante_id",
    strategy: "student-scoped",
    policies: ["Observaciones en tabla hija con CASCADE"],
  },
];

export function getRlsPreparationScore(): number {
  const defined = RLS_PREPARATION_AUDIT.length;
  const withPolicies = RLS_PREPARATION_AUDIT.filter(
    (entry) => entry.policies.length > 0
  ).length;
  const withOwnerColumn = RLS_PREPARATION_AUDIT.filter(
    (entry) => entry.ownerColumn.length > 0
  ).length;
  return Math.round(
    ((withPolicies / defined) * 50 + (withOwnerColumn / defined) * 50)
  );
}
