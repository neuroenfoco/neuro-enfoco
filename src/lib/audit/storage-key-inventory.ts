/**
 * Inventario de claves localStorage / BrowserStorageAdapter (PACI-A15.1).
 * Solo metadatos estáticos; sin acceso a window en import.
 */

export type StorageKeyAudit = {
  key: string;
  ownerModule: string;
  entity: string;
  cascadeDelete: "estudiante" | "objetivo" | "evaluacion" | "paci" | "intervencion" | "apoyo" | "none";
};

/** Todas las claves neuro-enfoco-* encontradas en el codebase. */
export const STORAGE_KEY_INVENTORY: StorageKeyAudit[] = [
  {
    key: "neuro-enfoco-estudiantes",
    ownerModule: "@/lib/students-storage",
    entity: "Estudiante",
    cascadeDelete: "none",
  },
  {
    key: "neuro-enfoco-objetivos-pie",
    ownerModule: "@/lib/pie-objectives-storage",
    entity: "ObjetivoPIE",
    cascadeDelete: "estudiante",
  },
  {
    key: "neuro-enfoco-apoyos-pie",
    ownerModule: "@/lib/pie-apoyos-storage",
    entity: "ApoyoImplementado (legacy por objetivo)",
    cascadeDelete: "objetivo",
  },
  {
    key: "neuro-enfoco-apoyos-implementados",
    ownerModule: "@/lib/apoyos/apoyos-persistence",
    entity: "ApoyoPIE",
    cascadeDelete: "objetivo",
  },
  {
    key: "neuro-enfoco-vinculos-apoyo-intervencion",
    ownerModule: "@/lib/apoyos/apoyo-intervencion-persistence",
    entity: "VinculoApoyoIntervencion",
    cascadeDelete: "estudiante",
  },
  {
    key: "neuro-enfoco-intervenciones",
    ownerModule: "@/lib/intervenciones-storage",
    entity: "Intervencion",
    cascadeDelete: "estudiante",
  },
  {
    key: "neuro-enfoco-sesiones",
    ownerModule: "@/lib/sessions-storage",
    entity: "Sesion",
    cascadeDelete: "estudiante",
  },
  {
    key: "neuro-enfoco-perfil-hallazgos",
    ownerModule: "@/lib/perfil-hallazgos-storage",
    entity: "HallazgoPerfil",
    cascadeDelete: "estudiante",
  },
  {
    key: "neuro-enfoco-observaciones-hallazgo",
    ownerModule: "@/lib/perfil-hallazgos-storage",
    entity: "ObservacionHallazgo",
    cascadeDelete: "estudiante",
  },
  {
    key: "neuro-enfoco-evaluaciones-integrales",
    ownerModule: "@/lib/evaluacion-integral/evaluacion-integral-persistence",
    entity: "EvaluacionIntegral",
    cascadeDelete: "estudiante",
  },
  {
    key: "neuro-enfoco-hallazgos-evaluativos",
    ownerModule: "@/lib/evaluacion-integral/hallazgo-evaluativo-storage",
    entity: "HallazgoEvaluativo",
    cascadeDelete: "evaluacion",
  },
  {
    key: "neuro-enfoco-conclusiones-evaluativas",
    ownerModule: "@/lib/evaluacion-integral/conclusion-evaluativa-persistence",
    entity: "ConclusionEvaluativa",
    cascadeDelete: "evaluacion",
  },
  {
    key: "neuro-enfoco-participaciones-evaluacion-integral",
    ownerModule: "@/lib/evaluacion-integral/participacion-evaluacion-integral-storage",
    entity: "ParticipacionEvaluacionIntegral",
    cascadeDelete: "evaluacion",
  },
  {
    key: "neuro-enfoco-vinculos-conclusion-objetivo-pie",
    ownerModule: "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-persistence",
    entity: "VinculoConclusionObjetivo",
    cascadeDelete: "objetivo",
  },
  {
    key: "neuro-enfoco-paci",
    ownerModule: "@/lib/paci/paci-persistence",
    entity: "PACI",
    cascadeDelete: "estudiante",
  },
  {
    key: "neuro-enfoco-paci-objetivos",
    ownerModule: "@/lib/paci/paci-objetivo-persistence",
    entity: "PACIObjetivo",
    cascadeDelete: "paci",
  },
  {
    key: "neuro-enfoco-marco-institucional-pie",
    ownerModule: "@/lib/marco-institucional-pie-storage",
    entity: "MarcoInstitucionalPIE",
    cascadeDelete: "estudiante",
  },
  {
    key: "neuro-enfoco-participaciones-profesional-estudiante",
    ownerModule: "@/lib/institucional/participaciones-profesional-estudiante-storage",
    entity: "ParticipacionProfesionalEstudiante",
    cascadeDelete: "estudiante",
  },
  {
    key: "neuro-enfoco-profesionales",
    ownerModule: "@/lib/institucional/profesionales-storage",
    entity: "Profesional",
    cascadeDelete: "none",
  },
  {
    key: "neuro-enfoco-espacios",
    ownerModule: "@/lib/espacios-storage",
    entity: "Espacio",
    cascadeDelete: "none",
  },
];

export function getStorageKeyCount(): number {
  return STORAGE_KEY_INVENTORY.length;
}
