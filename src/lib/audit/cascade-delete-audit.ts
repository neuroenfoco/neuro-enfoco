/**
 * Auditoría de rutas de eliminación en cascada (PACI-A15.1).
 * Reporte estático; no ejecuta borrados.
 */

export type CascadeStatus = "implemented" | "partial" | "missing" | "risk";

export type CascadeDeletePath = {
  id: string;
  trigger: string;
  entryPoint: string;
  affectedEntities: string[];
  storageKeys: string[];
  status: CascadeStatus;
  notes?: string;
};

export const CASCADE_DELETE_PATHS: CascadeDeletePath[] = [
  {
    id: "estudiante-completo",
    trigger: "Eliminar estudiante (UI / deleteEstudianteCompleto)",
    entryPoint: "@/lib/delete-estudiante-completo",
    affectedEntities: [
      "Intervencion",
      "VinculoApoyoIntervencion",
      "Sesion",
      "HallazgoPerfil",
      "ObservacionHallazgo",
      "ApoyoPIE",
      "ApoyoImplementadoLegacy",
      "ObjetivoPIE",
      "VinculoConclusionObjetivo",
      "MarcoInstitucionalPIE",
      "EvaluacionIntegral",
      "ParticipacionEvaluacionIntegral",
      "HallazgoEvaluativo",
      "ConclusionEvaluativa",
      "ParticipacionProfesionalEstudiante",
      "PACI",
      "PACIObjetivo",
      "Estudiante",
    ],
    storageKeys: [
      "neuro-enfoco-intervenciones",
      "neuro-enfoco-vinculos-apoyo-intervencion",
      "neuro-enfoco-sesiones",
      "neuro-enfoco-perfil-hallazgos",
      "neuro-enfoco-observaciones-hallazgo",
      "neuro-enfoco-apoyos-implementados",
      "neuro-enfoco-apoyos-pie",
      "neuro-enfoco-objetivos-pie",
      "neuro-enfoco-vinculos-conclusion-objetivo-pie",
      "neuro-enfoco-marco-institucional-pie",
      "neuro-enfoco-evaluaciones-integrales",
      "neuro-enfoco-participaciones-evaluacion-integral",
      "neuro-enfoco-hallazgos-evaluativos",
      "neuro-enfoco-conclusiones-evaluativas",
      "neuro-enfoco-participaciones-profesional-estudiante",
      "neuro-enfoco-paci",
      "neuro-enfoco-paci-objetivos",
      "neuro-enfoco-estudiantes",
    ],
    status: "implemented",
    notes:
      "Punto de entrada único documentado; deleteEstudiante delega aquí vía require dinámico.",
  },
  {
    id: "objetivo-pie-single",
    trigger: "deleteObjetivoPIE(objetivoId)",
    entryPoint: "@/lib/pie-objectives-storage",
    affectedEntities: [
      "ApoyoImplementadoLegacy",
      "ApoyoPIE",
      "VinculoConclusionObjetivo",
      "PACIObjetivo",
      "ObjetivoPIE",
    ],
    storageKeys: [
      "neuro-enfoco-apoyos-pie",
      "neuro-enfoco-apoyos-implementados",
      "neuro-enfoco-vinculos-conclusion-objetivo-pie",
      "neuro-enfoco-paci-objetivos",
      "neuro-enfoco-objetivos-pie",
    ],
    status: "implemented",
    notes: "También llama removeObjetivoFromIntervenciones.",
  },
  {
    id: "objetivo-pie-batch-estudiante",
    trigger: "deleteObjetivosPIEByEstudianteId(estudianteId)",
    entryPoint: "@/lib/pie-objectives-storage",
    affectedEntities: [
      "ApoyoImplementadoLegacy",
      "ApoyoPIE",
      "VinculoConclusionObjetivo",
      "PACIObjetivo",
      "ObjetivoPIE",
    ],
    storageKeys: [
      "neuro-enfoco-apoyos-pie",
      "neuro-enfoco-apoyos-implementados",
      "neuro-enfoco-vinculos-conclusion-objetivo-pie",
      "neuro-enfoco-paci-objetivos",
      "neuro-enfoco-objetivos-pie",
    ],
    status: "partial",
    notes:
      "No invoca removeObjetivoFromIntervenciones; mitigado cuando se usa deleteEstudianteCompleto (intervenciones borradas antes).",
  },
  {
    id: "intervencion-completa",
    trigger: "eliminarIntervencionCompleta(intervencionId)",
    entryPoint: "@/lib/intervenciones-storage",
    affectedEntities: [
      "ObservacionHallazgo",
      "Sesion",
      "VinculoApoyoIntervencion",
      "Intervencion",
    ],
    storageKeys: [
      "neuro-enfoco-observaciones-hallazgo",
      "neuro-enfoco-sesiones",
      "neuro-enfoco-vinculos-apoyo-intervencion",
      "neuro-enfoco-intervenciones",
    ],
    status: "implemented",
  },
  {
    id: "evaluacion-integral-single",
    trigger: "deleteEvaluacionIntegral(id) — solo borrador/anulada",
    entryPoint: "@/lib/evaluacion-integral/evaluacion-integral-storage",
    affectedEntities: [
      "VinculoConclusionObjetivo",
      "ParticipacionEvaluacionIntegral",
      "ConclusionEvaluativa",
      "HallazgoEvaluativo",
      "EvaluacionIntegral",
    ],
    storageKeys: [
      "neuro-enfoco-vinculos-conclusion-objetivo-pie",
      "neuro-enfoco-participaciones-evaluacion-integral",
      "neuro-enfoco-conclusiones-evaluativas",
      "neuro-enfoco-hallazgos-evaluativos",
      "neuro-enfoco-evaluaciones-integrales",
    ],
    status: "implemented",
  },
  {
    id: "evaluacion-integral-batch-estudiante",
    trigger: "deleteEvaluacionesIntegralesByEstudianteId(estudianteId)",
    entryPoint: "@/lib/evaluacion-integral/evaluacion-integral-storage",
    affectedEntities: [
      "ParticipacionEvaluacionIntegral",
      "ConclusionEvaluativa",
      "HallazgoEvaluativo",
      "EvaluacionIntegral",
    ],
    storageKeys: [
      "neuro-enfoco-participaciones-evaluacion-integral",
      "neuro-enfoco-conclusiones-evaluativas",
      "neuro-enfoco-hallazgos-evaluativos",
      "neuro-enfoco-evaluaciones-integrales",
    ],
    status: "partial",
    notes:
      "Omite deleteVinculosByEvaluacionId por evaluación; deleteEstudianteCompleto compensa con deleteVinculosByEstudianteId.",
  },
  {
    id: "paci-borrador",
    trigger: "deletePACI(paciId) — solo estado borrador",
    entryPoint: "@/lib/paci/paci-storage",
    affectedEntities: ["PACIObjetivo", "PACI"],
    storageKeys: ["neuro-enfoco-paci-objetivos", "neuro-enfoco-paci"],
    status: "implemented",
  },
  {
    id: "apoyo-pie",
    trigger: "deleteApoyoPIE(apoyoId)",
    entryPoint: "@/lib/apoyos/apoyos-storage",
    affectedEntities: ["VinculoApoyoIntervencion", "ApoyoPIE"],
    storageKeys: [
      "neuro-enfoco-vinculos-apoyo-intervencion",
      "neuro-enfoco-apoyos-implementados",
    ],
    status: "implemented",
  },
  {
    id: "institucional-sin-cascada",
    trigger: "Eliminar Profesional o Espacio",
    entryPoint: "@/lib/institucional/profesionales-storage | @/lib/espacios-storage",
    affectedEntities: ["Profesional", "Espacio"],
    storageKeys: ["neuro-enfoco-profesionales", "neuro-enfoco-espacios"],
    status: "risk",
    notes:
      "Sin cascada documentada hacia participaciones; huérfanos posibles si se borra profesional con participaciones activas.",
  },
];

export type CascadeAuditSummary = {
  implemented: number;
  partial: number;
  missing: number;
  risk: number;
};

export function summarizeCascadeAudit(): CascadeAuditSummary {
  return CASCADE_DELETE_PATHS.reduce(
    (acc, path) => {
      acc[path.status] += 1;
      return acc;
    },
    { implemented: 0, partial: 0, missing: 0, risk: 0 }
  );
}
