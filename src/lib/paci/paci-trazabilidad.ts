import { getConclusionEvaluativaById } from "@/lib/evaluacion-integral/conclusion-evaluativa-storage";
import { getConclusionEvaluativaDimensionNombre } from "@/lib/evaluacion-integral/conclusion-evaluativa-dimensiones";
import type {
  ConclusionEvaluativa,
  ConclusionEvaluativaDimensionId,
  ConclusionEvaluativaPrioridad,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";
import {
  enrichConclusionEvaluativa,
  getConclusionEvaluativaPrioridadLabel,
  type HallazgoSustentanteResumen,
} from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { getHallazgosEvaluativosByEvaluacionId } from "@/lib/evaluacion-integral/hallazgo-evaluativo-storage";
import { getVinculosByObjetivoId } from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import type { ObjetivoPIE } from "@/lib/pie-objectives-storage";

export type PACITrazabilidadEstado =
  | "con_sustento_evaluativo"
  | "sin_sustento_evaluativo";

export type PACIConclusionTrazabilidad = {
  id: string;
  enunciado: string;
  prioridad: ConclusionEvaluativaPrioridad;
  prioridadLabel: string;
  evaluacionIntegralId: string;
  dimensionId?: ConclusionEvaluativaDimensionId;
  dimensionLabel?: string;
  hallazgosSustentantes: HallazgoSustentanteResumen[];
  cantidadHallazgos: number;
};

export type PACICadenaTrazabilidadObjetivo = {
  objetivo: ObjetivoPIE;
  estado: PACITrazabilidadEstado;
  conclusiones: PACIConclusionTrazabilidad[];
  cantidadConclusiones: number;
  cantidadHallazgos: number;
  tieneSustentoEvaluativo: boolean;
};

export type BuildPACICadenaTrazabilidadOptions = {
  /** Si se indica, solo considera vínculos de esa evaluación de referencia. */
  evaluacionReferenciaId?: string;
};

function toPACIConclusionTrazabilidad(
  conclusion: ConclusionEvaluativa,
  hallazgosEvaluacion: ReturnType<typeof getHallazgosEvaluativosByEvaluacionId>
): PACIConclusionTrazabilidad {
  const view = enrichConclusionEvaluativa(conclusion, hallazgosEvaluacion);

  const dimensionLabel = conclusion.dimensionId
    ? conclusion.dimensionId === "aprendizaje_curricular" &&
      conclusion.dimensionDetalle?.trim()
      ? `${getConclusionEvaluativaDimensionNombre(conclusion.dimensionId)}: ${conclusion.dimensionDetalle.trim()}`
      : getConclusionEvaluativaDimensionNombre(conclusion.dimensionId)
    : undefined;

  return {
    id: conclusion.id,
    enunciado: conclusion.enunciado,
    prioridad: conclusion.prioridad,
    prioridadLabel: getConclusionEvaluativaPrioridadLabel(conclusion.prioridad),
    evaluacionIntegralId: conclusion.evaluacionIntegralId,
    dimensionId: conclusion.dimensionId,
    dimensionLabel,
    hallazgosSustentantes: view.hallazgosSustentantes,
    cantidadHallazgos: view.hallazgosSustentantes.length,
  };
}

function countUniqueHallazgos(
  conclusiones: PACIConclusionTrazabilidad[]
): number {
  const ids = new Set<string>();
  for (const conclusion of conclusiones) {
    for (const hallazgo of conclusion.hallazgosSustentantes) {
      ids.add(hallazgo.id);
    }
  }
  return ids.size;
}

/**
 * Cadena narrativa: Objetivo PIE → conclusiones vinculadas → hallazgos sustentantes.
 * Objetivos sin vínculos permanecen visibles con estado sin_sustento_evaluativo.
 */
export function buildPACICadenaTrazabilidadObjetivo(
  objetivo: ObjetivoPIE,
  options: BuildPACICadenaTrazabilidadOptions = {}
): PACICadenaTrazabilidadObjetivo {
  const evaluacionReferenciaId = options.evaluacionReferenciaId?.trim();
  const vinculos = getVinculosByObjetivoId(objetivo.id).filter((vinculo) => {
    if (!evaluacionReferenciaId) return true;
    return vinculo.evaluacionIntegralId === evaluacionReferenciaId;
  });

  const hallazgosCache = new Map<
    string,
    ReturnType<typeof getHallazgosEvaluativosByEvaluacionId>
  >();

  const conclusiones: PACIConclusionTrazabilidad[] = [];

  for (const vinculo of vinculos) {
    const conclusion = getConclusionEvaluativaById(vinculo.conclusionEvaluativaId);
    if (!conclusion) continue;

    let hallazgos = hallazgosCache.get(conclusion.evaluacionIntegralId);
    if (!hallazgos) {
      hallazgos = getHallazgosEvaluativosByEvaluacionId(
        conclusion.evaluacionIntegralId
      );
      hallazgosCache.set(conclusion.evaluacionIntegralId, hallazgos);
    }

    conclusiones.push(toPACIConclusionTrazabilidad(conclusion, hallazgos));
  }

  conclusiones.sort((a, b) => a.enunciado.localeCompare(b.enunciado, "es"));

  const cantidadConclusiones = conclusiones.length;
  const cantidadHallazgos = countUniqueHallazgos(conclusiones);
  const tieneSustentoEvaluativo = cantidadConclusiones > 0;

  return {
    objetivo,
    estado: tieneSustentoEvaluativo
      ? "con_sustento_evaluativo"
      : "sin_sustento_evaluativo",
    conclusiones,
    cantidadConclusiones,
    cantidadHallazgos,
    tieneSustentoEvaluativo,
  };
}
