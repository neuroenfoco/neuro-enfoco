/**
 * Eliminación en cascada de un estudiante y todos sus registros locales.
 * Punto de entrada único para la UI; no dispersar lógica de borrado en componentes.
 */
import {
  deleteIntervencionesByEstudianteId,
  getIntervencionesByEstudianteId,
} from "@/lib/intervenciones-storage";
import {
  countHallazgosByEstudianteId,
  countObservacionesByEstudianteId,
  deleteHallazgosByEstudianteId,
} from "@/lib/perfil-hallazgos-storage";
import { getApoyosByObjetivoId } from "@/lib/pie-apoyos-storage";
import {
  deleteObjetivosPIEByEstudianteId,
  getObjetivosPIEByEstudianteId,
} from "@/lib/pie-objectives-storage";
import {
  deleteSessionsByEstudianteId,
  getSesionesByEstudianteId,
} from "@/lib/sessions-storage";
import { deleteParticipacionesByEstudianteId } from "@/lib/institucional/participaciones-profesional-estudiante-storage";
import { deleteEvaluacionesIntegralesByEstudianteId } from "@/lib/evaluacion-integral/evaluacion-integral-storage";
import { deleteConclusionesEvaluativasByEstudianteId } from "@/lib/evaluacion-integral/conclusion-evaluativa-storage";
import { deleteHallazgosEvaluativosByEstudianteId } from "@/lib/evaluacion-integral/hallazgo-evaluativo-storage";
import { deleteParticipacionesEvaluacionByEstudianteId } from "@/lib/evaluacion-integral/participacion-evaluacion-integral-storage";
import { deleteVinculosByEstudianteId } from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import {
  deletePACIsByEstudianteId,
  getPACIsByEstudianteId,
  getPACIObjetivosByPACIId,
} from "@/lib/paci/paci-storage";
import { deleteMarcoInstitucionalPIEByEstudianteId } from "@/lib/marco-institucional-pie-storage";
import {
  getEstudianteById,
  isProtectedEstudiante,
  removeEstudianteRecord,
} from "@/lib/students-storage";

export type DeleteEstudianteCompletoEstadisticas = {
  estudianteId: string;
  intervenciones: number;
  sesiones: number;
  hallazgos: number;
  observaciones: number;
  objetivosPie: number;
  apoyosPie: number;
  participacionesProfesional: number;
  evaluacionesIntegrales: number;
  participacionesEvaluacionIntegral: number;
  hallazgosEvaluativos: number;
  conclusionesEvaluativas: number;
  pacis: number;
  paciObjetivos: number;
};

export type DeleteEstudianteCompletoResult =
  | { ok: true; estadisticas: DeleteEstudianteCompletoEstadisticas }
  | { ok: false; error: string };

function countApoyosPiePorEstudiante(estudianteId: string): number {
  let total = 0;
  for (const objetivo of getObjetivosPIEByEstudianteId(estudianteId)) {
    total += getApoyosByObjetivoId(objetivo.id).length;
  }
  return total;
}

/**
 * Elimina el estudiante y todas las colecciones asociadas por estudianteId.
 * No modifica espacios institucionales ni otros estudiantes.
 */
export function deleteEstudianteCompleto(
  estudianteId: string
): DeleteEstudianteCompletoResult {
  if (typeof window === "undefined") {
    return { ok: false, error: "Solo disponible en el cliente." };
  }

  const trimmedId = estudianteId.trim();
  if (!trimmedId) {
    return { ok: false, error: "Identificador de estudiante no válido." };
  }

  if (isProtectedEstudiante(trimmedId)) {
    return {
      ok: false,
      error: "El estudiante base del sistema no puede eliminarse.",
    };
  }

  if (!getEstudianteById(trimmedId)) {
    return { ok: false, error: "Estudiante no encontrado." };
  }

  const estadisticas: DeleteEstudianteCompletoEstadisticas = {
    estudianteId: trimmedId,
    intervenciones: getIntervencionesByEstudianteId(trimmedId).length,
    sesiones: getSesionesByEstudianteId(trimmedId).length,
    hallazgos: countHallazgosByEstudianteId(trimmedId),
    observaciones: countObservacionesByEstudianteId(trimmedId),
    objetivosPie: getObjetivosPIEByEstudianteId(trimmedId).length,
    apoyosPie: countApoyosPiePorEstudiante(trimmedId),
    participacionesProfesional: 0,
    evaluacionesIntegrales: 0,
    participacionesEvaluacionIntegral: 0,
    hallazgosEvaluativos: 0,
    conclusionesEvaluativas: 0,
    pacis: 0,
    paciObjetivos: 0,
  };

  // 1. Intervenciones → observaciones por intervención + evidencias (Sesion) vinculadas
  deleteIntervencionesByEstudianteId(trimmedId);

  // 2. Evidencias huérfanas sin intervencionId
  deleteSessionsByEstudianteId(trimmedId);

  // 3. Hallazgos de perfil + observaciones restantes del estudiante
  deleteHallazgosByEstudianteId(trimmedId);

  // 4. Objetivos PIE + apoyos implementados por objetivo
  deleteObjetivosPIEByEstudianteId(trimmedId);
  deleteVinculosByEstudianteId(trimmedId);

  // 5. Marco institucional PIE
  deleteMarcoInstitucionalPIEByEstudianteId(trimmedId);

  estadisticas.evaluacionesIntegrales =
    deleteEvaluacionesIntegralesByEstudianteId(trimmedId);
  estadisticas.participacionesEvaluacionIntegral =
    deleteParticipacionesEvaluacionByEstudianteId(trimmedId);
  estadisticas.hallazgosEvaluativos =
    deleteHallazgosEvaluativosByEstudianteId(trimmedId);
  estadisticas.conclusionesEvaluativas =
    deleteConclusionesEvaluativasByEstudianteId(trimmedId);

  estadisticas.participacionesProfesional =
    deleteParticipacionesByEstudianteId(trimmedId);

  estadisticas.pacis = getPACIsByEstudianteId(trimmedId).length;
  estadisticas.paciObjetivos = getPACIsByEstudianteId(trimmedId).reduce(
    (total, paci) => total + getPACIObjetivosByPACIId(paci.id).length,
    0
  );
  deletePACIsByEstudianteId(trimmedId);

  // 6. Registro del estudiante
  if (!removeEstudianteRecord(trimmedId)) {
    return { ok: false, error: "No se pudo eliminar el estudiante." };
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[deleteEstudianteCompleto]", estadisticas);
  }

  return { ok: true, estadisticas };
}
