import { getConclusionesEvaluativasByEvaluacionId } from "@/lib/evaluacion-integral/conclusion-evaluativa-storage";
import { getEvaluacionIntegralById } from "@/lib/evaluacion-integral/evaluacion-integral-persistence";
import type {
  EvaluacionIntegral,
  EvaluacionIntegralEstado,
  EvaluacionIntegralTipo,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";
import {
  getEvaluacionIntegralEstadoLabel,
  getEvaluacionIntegralTipoLabel,
  getFechaReferenciaEvaluacion,
} from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { getHallazgosEvaluativosByEvaluacionId } from "@/lib/evaluacion-integral/hallazgo-evaluativo-storage";
import { getVinculosByEvaluacionId } from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import {
  proyectarDimensionPIE,
  type PACIDimensionProyectada,
} from "@/lib/paci/paci-dimensiones";
import {
  getPACIById,
  getPACIObjetivosByPACIId,
  getPACIVigenteByEstudianteId,
} from "@/lib/paci/paci-storage";
import type { PACI, PACIObjetivo } from "@/lib/paci/paci-types";
import {
  buildPACICadenaTrazabilidadObjetivo,
  type PACICadenaTrazabilidadObjetivo,
  type PACIConclusionTrazabilidad,
} from "@/lib/paci/paci-trazabilidad";
import { getObjetivoPIEById } from "@/lib/pie-objectives-storage";

export type PACIIndicadoresView = {
  cantidadObjetivos: number;
  cantidadObjetivosConSustento: number;
  cantidadObjetivosSinSustento: number;
  porcentajeTrazabilidad: number;
  cantidadConclusionesCubiertas: number;
};

export type PACIObjetivoEnriquecido = {
  paciObjetivo: PACIObjetivo;
  trazabilidad: PACICadenaTrazabilidadObjetivo;
  dimensionProyectada?: PACIDimensionProyectada;
};

export type PACIEvaluacionReferenciaView = {
  evaluacion: EvaluacionIntegral;
  tipoLabel: string;
  estadoLabel: string;
  fechaReferencia: string;
  observacionesEvaluacion?: string;
  cantidadConclusiones: number;
  cantidadHallazgos: number;
  sinConclusiones: boolean;
};

export type PACIMetricasBasicas = {
  cantidadObjetivos: number;
  indicadores: PACIIndicadoresView;
};

export type PACIDetalleView = {
  paci: PACI;
  sintesisInstitucional?: string;
  evaluacionReferencia?: PACIEvaluacionReferenciaView;
  objetivos: PACIObjetivoEnriquecido[];
  metricas: PACIMetricasBasicas;
};

export type PACIObjetivoVigenteResumen = {
  objetivoId: string;
  nombre: string;
  orden: number;
  dimensionProyectada?: PACIDimensionProyectada;
  tieneSustentoEvaluativo: boolean;
  estadoTrazabilidad: PACICadenaTrazabilidadObjetivo["estado"];
};

export type PACIVigenteView = {
  paci: PACI;
  periodoLabel: string;
  sintesisInstitucional?: string;
  evaluacionTipo?: EvaluacionIntegralTipo;
  evaluacionTipoLabel?: string;
  evaluacionEstado?: EvaluacionIntegralEstado;
  evaluacionEstadoLabel?: string;
  evaluacionFechaReferencia?: string;
  objetivos: PACIObjetivoVigenteResumen[];
  indicadores: PACIIndicadoresView;
};

function calcularPorcentajeTrazabilidad(
  conSustento: number,
  total: number
): number {
  if (total === 0) return 100;
  return Math.round((conSustento / total) * 100);
}

function proyectarDimensionParaObjetivo(
  trazabilidad: PACICadenaTrazabilidadObjetivo
): PACIDimensionProyectada | undefined {
  const fromObjetivo = proyectarDimensionPIE({
    dimensionRelacionada: trazabilidad.objetivo.dimensionRelacionada,
  });
  if (fromObjetivo) return fromObjetivo;

  const primeraConDimension = trazabilidad.conclusiones.find(
    (item): item is PACIConclusionTrazabilidad & {
      dimensionId: NonNullable<PACIConclusionTrazabilidad["dimensionId"]>;
    } => Boolean(item.dimensionId)
  );

  if (primeraConDimension?.dimensionId) {
    return proyectarDimensionPIE({
      conclusionDimensionId: primeraConDimension.dimensionId,
    });
  }

  return undefined;
}

function countConclusionesCubiertas(
  evaluacionReferenciaId: string | undefined,
  objetivoPieIds: Set<string>
): number {
  if (!evaluacionReferenciaId) return 0;

  const conclusionIds = new Set(
    getConclusionesEvaluativasByEvaluacionId(evaluacionReferenciaId).map(
      (item) => item.id
    )
  );
  if (conclusionIds.size === 0) return 0;

  const cubiertas = new Set<string>();
  for (const vinculo of getVinculosByEvaluacionId(evaluacionReferenciaId)) {
    if (
      conclusionIds.has(vinculo.conclusionEvaluativaId) &&
      objetivoPieIds.has(vinculo.objetivoPieId)
    ) {
      cubiertas.add(vinculo.conclusionEvaluativaId);
    }
  }

  return cubiertas.size;
}

export function buildPACIIndicadoresView(input: {
  trazabilidades: PACICadenaTrazabilidadObjetivo[];
  evaluacionReferenciaId?: string;
  objetivoPieIds: string[];
}): PACIIndicadoresView {
  const cantidadObjetivos = input.trazabilidades.length;
  const cantidadObjetivosConSustento = input.trazabilidades.filter(
    (item) => item.tieneSustentoEvaluativo
  ).length;
  const cantidadObjetivosSinSustento =
    cantidadObjetivos - cantidadObjetivosConSustento;

  return {
    cantidadObjetivos,
    cantidadObjetivosConSustento,
    cantidadObjetivosSinSustento,
    porcentajeTrazabilidad: calcularPorcentajeTrazabilidad(
      cantidadObjetivosConSustento,
      cantidadObjetivos
    ),
    cantidadConclusionesCubiertas: countConclusionesCubiertas(
      input.evaluacionReferenciaId,
      new Set(input.objetivoPieIds)
    ),
  };
}

function buildEvaluacionReferenciaView(
  evaluacionId: string
): PACIEvaluacionReferenciaView | undefined {
  const evaluacion = getEvaluacionIntegralById(evaluacionId);
  if (!evaluacion) return undefined;

  const conclusiones = getConclusionesEvaluativasByEvaluacionId(evaluacionId);
  const hallazgos = getHallazgosEvaluativosByEvaluacionId(evaluacionId);

  return {
    evaluacion,
    tipoLabel: getEvaluacionIntegralTipoLabel(evaluacion.tipo),
    estadoLabel: getEvaluacionIntegralEstadoLabel(evaluacion.estado),
    fechaReferencia: getFechaReferenciaEvaluacion(evaluacion),
    observacionesEvaluacion: evaluacion.observacionesEvaluacion?.trim() || undefined,
    cantidadConclusiones: conclusiones.length,
    cantidadHallazgos: hallazgos.length,
    sinConclusiones: conclusiones.length === 0,
  };
}

function buildObjetivosEnriquecidos(
  paciId: string,
  evaluacionReferenciaId?: string
): PACIObjetivoEnriquecido[] {
  const paciObjetivos = getPACIObjetivosByPACIId(paciId);
  const enriched: PACIObjetivoEnriquecido[] = [];

  for (const paciObjetivo of paciObjetivos) {
    const objetivo = getObjetivoPIEById(paciObjetivo.objetivoPieId);
    if (!objetivo) continue;

    const trazabilidad = buildPACICadenaTrazabilidadObjetivo(objetivo, {
      evaluacionReferenciaId,
    });

    enriched.push({
      paciObjetivo,
      trazabilidad,
      dimensionProyectada: proyectarDimensionParaObjetivo(trazabilidad),
    });
  }

  return enriched;
}

export function getPACIDetalleView(paciId: string): PACIDetalleView | null {
  const paci = getPACIById(paciId);
  if (!paci) return null;

  const evaluacionReferenciaId = paci.evaluacionReferenciaId?.trim();
  const objetivos = buildObjetivosEnriquecidos(paciId, evaluacionReferenciaId);
  const trazabilidades = objetivos.map((item) => item.trazabilidad);
  const indicadores = buildPACIIndicadoresView({
    trazabilidades,
    evaluacionReferenciaId,
    objetivoPieIds: objetivos.map((item) => item.trazabilidad.objetivo.id),
  });

  return {
    paci,
    sintesisInstitucional: paci.sintesisInstitucional?.trim() || undefined,
    evaluacionReferencia: evaluacionReferenciaId
      ? buildEvaluacionReferenciaView(evaluacionReferenciaId)
      : undefined,
    objetivos,
    metricas: {
      cantidadObjetivos: indicadores.cantidadObjetivos,
      indicadores,
    },
  };
}

export function getPACIVigenteView(
  estudianteId: string
): PACIVigenteView | null {
  const paci = getPACIVigenteByEstudianteId(estudianteId);
  if (!paci) return null;

  const detalle = getPACIDetalleView(paci.id);
  if (!detalle) return null;

  const evaluacion = detalle.evaluacionReferencia?.evaluacion;

  return {
    paci,
    periodoLabel: paci.periodoLabel,
    sintesisInstitucional: detalle.sintesisInstitucional,
    evaluacionTipo: evaluacion?.tipo,
    evaluacionTipoLabel: detalle.evaluacionReferencia?.tipoLabel,
    evaluacionEstado: evaluacion?.estado,
    evaluacionEstadoLabel: detalle.evaluacionReferencia?.estadoLabel,
    evaluacionFechaReferencia: detalle.evaluacionReferencia?.fechaReferencia,
    objetivos: detalle.objetivos.map((item) => ({
      objetivoId: item.trazabilidad.objetivo.id,
      nombre: item.trazabilidad.objetivo.nombre,
      orden: item.paciObjetivo.orden,
      dimensionProyectada: item.dimensionProyectada,
      tieneSustentoEvaluativo: item.trazabilidad.tieneSustentoEvaluativo,
      estadoTrazabilidad: item.trazabilidad.estado,
    })),
    indicadores: detalle.metricas.indicadores,
  };
}

export function getPACIIndicadoresView(paciId: string): PACIIndicadoresView | null {
  const detalle = getPACIDetalleView(paciId);
  return detalle?.metricas.indicadores ?? null;
}
