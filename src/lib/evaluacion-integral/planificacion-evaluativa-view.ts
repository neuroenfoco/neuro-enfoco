import {
  getConclusionEvaluativaById,
  getConclusionesEvaluativasByEstudianteId,
} from "@/lib/evaluacion-integral/conclusion-evaluativa-storage";
import {
  getEvaluacionIntegralById,
  readEvaluacionesIntegrales,
} from "@/lib/evaluacion-integral/evaluacion-integral-persistence";
import type {
  ConclusionEvaluativaDimensionId,
  ConclusionSustentanteResumen,
  EvaluacionIntegral,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";
import {
  enrichConclusionEvaluativa,
  getConclusionEvaluativaPrioridadLabel,
  getEvaluacionConDetalle,
  getEvaluacionIntegralTipoLabel,
  getFechaReferenciaEvaluacion,
  type ConclusionEvaluativaView,
  type ResumenEvaluacion,
} from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { getHallazgosEvaluativosByEvaluacionId } from "@/lib/evaluacion-integral/hallazgo-evaluativo-storage";
import { getVinculosByObjetivoId } from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import {
  getObjetivoPIEResumen,
  type ObjetivoPIE,
  type ObjetivoPIEResumen,
} from "@/lib/pie-objectives-storage";

export type CoberturaEvaluativaEstudianteView = {
  estudianteId: string;
  cantidadConclusiones: number;
  cantidadSinPlanificacion: number;
  cantidadPlanificadas: number;
  porcentajeCobertura: number;
};

export type PlanificacionDesdeEvaluacionView = {
  evaluacion: EvaluacionIntegral;
  resumen: ResumenEvaluacion;
  conclusiones: ConclusionEvaluativaView[];
  conclusionesSinPlanificacion: ConclusionEvaluativaView[];
  conclusionesPlanificadas: ConclusionEvaluativaView[];
  porcentajeCoberturaPlanificacion: number;
};

export function mapConclusionDimensionToObjetivoDimension(
  dimensionId?: ConclusionEvaluativaDimensionId
): string | undefined {
  switch (dimensionId) {
    case "participacion_convivencia":
      return "Participación escolar";
    case "comunicacion_lenguaje":
      return "Comunicación";
    case "socioemocional":
      return "Regulación emocional";
    case "atencion_funcion_ejecutiva":
      return "Autonomía";
    case "sensorial_motor":
      return "Bienestar percibido";
    case "acceso_contexto":
      return "Participación escolar";
    case "aprendizaje_curricular":
      return "Fortalezas y talentos";
    default:
      return undefined;
  }
}

function buildConclusionesSustentantesForObjetivo(
  objetivoPieId: string
): ConclusionSustentanteResumen[] {
  const vinculos = getVinculosByObjetivoId(objetivoPieId);
  const items: ConclusionSustentanteResumen[] = [];

  for (const vinculo of vinculos) {
    const conclusion = getConclusionEvaluativaById(vinculo.conclusionEvaluativaId);
    if (!conclusion) continue;

    const evaluacion = getEvaluacionIntegralById(conclusion.evaluacionIntegralId);

    items.push({
      id: conclusion.id,
      enunciado: conclusion.enunciado,
      prioridad: conclusion.prioridad,
      prioridadLabel: getConclusionEvaluativaPrioridadLabel(conclusion.prioridad),
      evaluacionIntegralId: conclusion.evaluacionIntegralId,
      evaluacionTipoLabel: evaluacion
        ? getEvaluacionIntegralTipoLabel(evaluacion.tipo)
        : "Evaluación",
      evaluacionFechaReferencia: evaluacion
        ? getFechaReferenciaEvaluacion(evaluacion)
        : "",
    });
  }

  return items.sort((a, b) => a.enunciado.localeCompare(b.enunciado, "es"));
}

export function enrichObjetivoPIEResumen(
  base: ObjetivoPIEResumen
): ObjetivoPIEResumen {
  const conclusionesSustentantes = buildConclusionesSustentantesForObjetivo(
    base.objetivo.id
  );
  const evaluacionIds = [
    ...new Set(
      conclusionesSustentantes.map((item) => item.evaluacionIntegralId)
    ),
  ];

  return {
    ...base,
    conclusionesSustentantes,
    cantidadConclusionesSustentantes: conclusionesSustentantes.length,
    evaluacionOrigenId:
      evaluacionIds.length === 1 ? evaluacionIds[0] : undefined,
    tieneTrazabilidadEvaluativa: conclusionesSustentantes.length > 0,
  };
}

export function enrichObjetivoPIE(objetivo: ObjetivoPIE): ObjetivoPIEResumen {
  return enrichObjetivoPIEResumen(getObjetivoPIEResumen(objetivo));
}

function calcularPorcentajeCobertura(
  total: number,
  planificadas: number
): number {
  if (total === 0) return 100;
  return Math.round((planificadas / total) * 100);
}

export function getCoberturaEvaluativaEstudianteView(
  estudianteId: string
): CoberturaEvaluativaEstudianteView {
  const conclusiones = getConclusionesEvaluativasByEstudianteId(estudianteId);
  let cantidadPlanificadas = 0;

  for (const conclusion of conclusiones) {
    const hallazgos = getHallazgosEvaluativosByEvaluacionId(
      conclusion.evaluacionIntegralId
    );
    const view = enrichConclusionEvaluativa(conclusion, hallazgos);
    if (view.coberturaPlanificacion === "planificada") {
      cantidadPlanificadas += 1;
    }
  }

  const cantidadConclusiones = conclusiones.length;
  const cantidadSinPlanificacion = cantidadConclusiones - cantidadPlanificadas;

  return {
    estudianteId,
    cantidadConclusiones,
    cantidadSinPlanificacion,
    cantidadPlanificadas,
    porcentajeCobertura: calcularPorcentajeCobertura(
      cantidadConclusiones,
      cantidadPlanificadas
    ),
  };
}

export function getPlanificacionDesdeEvaluacionView(
  evaluacionIntegralId: string
): PlanificacionDesdeEvaluacionView | null {
  const detalle = getEvaluacionConDetalle(evaluacionIntegralId);
  if (!detalle) return null;

  const conclusionesSinPlanificacion = detalle.conclusiones.filter(
    (item) => item.coberturaPlanificacion === "sin_planificacion"
  );
  const conclusionesPlanificadas = detalle.conclusiones.filter(
    (item) => item.coberturaPlanificacion === "planificada"
  );

  return {
    evaluacion: detalle.evaluacion,
    resumen: detalle.resumen,
    conclusiones: detalle.conclusiones,
    conclusionesSinPlanificacion,
    conclusionesPlanificadas,
    porcentajeCoberturaPlanificacion: calcularPorcentajeCobertura(
      detalle.conclusiones.length,
      conclusionesPlanificadas.length
    ),
  };
}

export function getUltimaEvaluacionCerradaId(
  estudianteId: string
): string | null {
  const evaluaciones = readEvaluacionesIntegrales()
    .filter(
      (item) => item.estudianteId === estudianteId && item.estado === "cerrada"
    )
    .sort((a, b) => {
      const fechaA = getFechaReferenciaEvaluacion(a);
      const fechaB = getFechaReferenciaEvaluacion(b);
      return fechaB.localeCompare(fechaA);
    });

  return evaluaciones[0]?.id ?? null;
}
