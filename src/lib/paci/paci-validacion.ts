import { getConclusionesEvaluativasByEvaluacionId } from "@/lib/evaluacion-integral/conclusion-evaluativa-storage";
import { getEvaluacionIntegralById } from "@/lib/evaluacion-integral/evaluacion-integral-persistence";
import { getVinculosByConclusionId } from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import { getMarcoInstitucionalPIEByEstudianteId } from "@/lib/marco-institucional-pie-storage";
import { readPACIObjetivos } from "@/lib/paci/paci-objetivo-persistence";
import { readPACIs } from "@/lib/paci/paci-persistence";
import type {
  CanDeclararPACIVigenteResult,
  PACI,
} from "@/lib/paci/paci-types";
import { getObjetivoPIEById } from "@/lib/pie-objectives-storage";
import { getEstudianteById } from "@/lib/students-storage";

export function normalizePeriodoLabel(periodoLabel: string): string {
  return periodoLabel.trim();
}

export function assertUnicoPACIVigente(
  estudianteId: string,
  excludePaciId?: string
): string | null {
  const vigente = readPACIs().find(
    (item) =>
      item.estudianteId === estudianteId &&
      item.estado === "vigente" &&
      item.id !== excludePaciId
  );

  if (vigente) {
    return "Ya existe un PACI vigente para este estudiante.";
  }

  return null;
}

export function validatePACIAnterior(
  paciAnteriorId: string,
  estudianteId: string
): string | null {
  const anterior = readPACIs().find((item) => item.id === paciAnteriorId);
  if (!anterior) {
    return "PACI anterior no encontrado.";
  }
  if (anterior.estudianteId !== estudianteId) {
    return "El PACI anterior debe pertenecer al mismo estudiante.";
  }
  return null;
}

export function validateEvaluacionReferencia(
  evaluacionReferenciaId: string,
  estudianteId: string
): string | null {
  const evaluacion = getEvaluacionIntegralById(evaluacionReferenciaId);
  if (!evaluacion) {
    return "Evaluación de referencia no encontrada.";
  }
  if (evaluacion.estudianteId !== estudianteId) {
    return "La evaluación de referencia debe pertenecer al mismo estudiante.";
  }
  return null;
}

export function validateObjetivoParaPACI(
  objetivoPieId: string,
  estudianteId: string
): string | null {
  const objetivo = getObjetivoPIEById(objetivoPieId);
  if (!objetivo) {
    return `Objetivo PIE no encontrado: ${objetivoPieId}`;
  }
  if (objetivo.estudianteId !== estudianteId) {
    return "El objetivo debe pertenecer al mismo estudiante del PACI.";
  }
  return null;
}

function countConclusionesSinPlanificacion(evaluacionIntegralId: string): number {
  const conclusiones =
    getConclusionesEvaluativasByEvaluacionId(evaluacionIntegralId);
  let sinPlanificacion = 0;

  for (const conclusion of conclusiones) {
    const vinculos = getVinculosByConclusionId(conclusion.id);
    if (vinculos.length === 0) {
      sinPlanificacion += 1;
    }
  }

  return sinPlanificacion;
}

export function canDeclararPACIVigente(paciId: string): CanDeclararPACIVigenteResult {
  const errores: string[] = [];
  const advertencias: string[] = [];

  const paci = readPACIs().find((item) => item.id === paciId);
  if (!paci) {
    return { ok: false, errores: ["PACI no encontrado."], advertencias: [] };
  }

  if (paci.estado !== "borrador") {
    errores.push("Solo un PACI en borrador puede declararse vigente.");
  }

  if (!getEstudianteById(paci.estudianteId)) {
    errores.push("Estudiante no encontrado.");
  }

  if (!getMarcoInstitucionalPIEByEstudianteId(paci.estudianteId)) {
    errores.push("El estudiante no tiene marco institucional PIE registrado.");
  }

  const evaluacionId = paci.evaluacionReferenciaId?.trim();
  if (!evaluacionId) {
    errores.push("Debe seleccionar una evaluación de referencia.");
  } else {
    const evaluacion = getEvaluacionIntegralById(evaluacionId);
    if (!evaluacion) {
      errores.push("Evaluación de referencia no encontrada.");
    } else {
      if (evaluacion.estudianteId !== paci.estudianteId) {
        errores.push(
          "La evaluación de referencia debe pertenecer al mismo estudiante."
        );
      }
      if (evaluacion.estado === "anulada") {
        errores.push("La evaluación de referencia no puede estar anulada.");
      }
      if (evaluacion.estado !== "cerrada") {
        advertencias.push(
          "La evaluación de referencia no está cerrada. Se recomienda cerrarla antes de declarar el PACI vigente."
        );
      }
    }
  }

  const objetivosIncluidos = readPACIObjetivos().filter(
    (item) => item.paciId === paciId
  );
  if (objetivosIncluidos.length === 0) {
    errores.push("El PACI debe incluir al menos un objetivo PIE.");
  }

  const vigenteError = assertUnicoPACIVigente(paci.estudianteId, paciId);
  if (vigenteError) {
    errores.push(vigenteError);
  }

  if (!paci.sintesisInstitucional?.trim()) {
    advertencias.push(
      "Se recomienda registrar una síntesis institucional antes de declarar vigente."
    );
  }

  if (evaluacionId) {
    const sinPlanificacion = countConclusionesSinPlanificacion(evaluacionId);
    if (sinPlanificacion > 0) {
      advertencias.push(
        `Hay ${sinPlanificacion} conclusión(es) evaluativa(s) sin planificación vinculada.`
      );
    }
  }

  return {
    ok: errores.length === 0,
    errores,
    advertencias,
  };
}

export function puedeEditarPACI(paci: PACI): boolean {
  return paci.estado === "borrador";
}
