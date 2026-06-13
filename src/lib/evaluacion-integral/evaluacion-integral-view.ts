import type {
  ConclusionCoberturaPlanificacion,
  ConclusionEvaluativa,
  ConclusionEvaluativaPrioridad,
  EvaluacionIntegral,
  EvaluacionIntegralEstado,
  EvaluacionIntegralTipo,
  HallazgoEvaluativo,
  ObjetivoVinculadoResumen,
  ParticipacionEvaluacionIntegral,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";
import {
  getEvaluacionIntegralById,
  readEvaluacionesIntegrales,
} from "@/lib/evaluacion-integral/evaluacion-integral-persistence";
import { getConclusionesEvaluativasByEvaluacionId } from "@/lib/evaluacion-integral/conclusion-evaluativa-storage";
import { compareConclusionesPorPrioridad } from "@/lib/evaluacion-integral/conclusion-evaluativa-validacion";
import { getConclusionEvaluativaDimensionNombre } from "@/lib/evaluacion-integral/conclusion-evaluativa-dimensiones";
import { getHallazgosEvaluativosByEvaluacionId } from "@/lib/evaluacion-integral/hallazgo-evaluativo-storage";
import { getParticipacionesByEvaluacionId } from "@/lib/evaluacion-integral/participacion-evaluacion-integral-storage";
import { getVinculosByConclusionId } from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import {
  formatProfesionalNombreCompleto,
  getProfesionalById,
} from "@/lib/institucional/profesionales-storage";
import { getRolProfesionalNombre } from "@/lib/institucional/roles-profesional-catalog";
import { getHallazgoTipoLabel } from "@/lib/hallazgo-labels";
import type { HallazgoTipo } from "@/lib/perfil-hallazgos-storage";
import {
  getEvidenciasPorObjetivoId,
  getImpactoPromedioEvidenciasObjetivo,
} from "@/lib/evidencias-por-objetivo";
import {
  getEstadoObjetivoPIE,
  getObjetivoPIEById,
} from "@/lib/pie-objectives-storage";
import { getEstudianteById } from "@/lib/students-storage";

export type ConsolidacionHallazgoEvaluativoEstado =
  | "consolidado"
  | "pendiente";

export type ParticipacionEvaluacionEnriquecida =
  ParticipacionEvaluacionIntegral & {
    profesionalNombre: string;
    rolNombre: string;
  };

export type HallazgoEvaluativoView = HallazgoEvaluativo & {
  consolidacionEstado: ConsolidacionHallazgoEvaluativoEstado;
};

export type HallazgoSustentanteResumen = {
  id: string;
  nombre: string;
  tipo: HallazgoTipo;
  tipoLabel: string;
};

export type ConclusionEvaluativaView = ConclusionEvaluativa & {
  prioridadLabel: string;
  dimensionLabel?: string;
  hallazgosSustentantes: HallazgoSustentanteResumen[];
  sinHallazgosSustentantes: boolean;
  coberturaPlanificacion: ConclusionCoberturaPlanificacion;
  objetivosVinculados: ObjetivoVinculadoResumen[];
  cantidadObjetivosVinculados: number;
};

export type ConclusionesPorPrioridad = Record<
  ConclusionEvaluativaPrioridad,
  ConclusionEvaluativaView[]
>;

export type ResumenEvaluacion = {
  evaluacionIntegralId: string;
  fechaInicio: string;
  fechaCierre?: string;
  tipo: EvaluacionIntegralTipo;
  tipoLabel: string;
  estado: EvaluacionIntegralEstado;
  estadoLabel: string;
  cantidadHallazgosEvaluativos: number;
  cantidadHallazgosConsolidados: number;
  cantidadHallazgosPendientesConsolidacion: number;
  cantidadParticipantes: number;
  cantidadConclusionesEvaluativas: number;
  cantidadConclusionesAlta: number;
  cantidadConclusionesMedia: number;
  cantidadConclusionesBaja: number;
  responsableProceso?: ParticipacionEvaluacionEnriquecida;
};

export type HistorialEvaluacionItem = {
  id: string;
  tipo: EvaluacionIntegralTipo;
  tipoLabel: string;
  estado: EvaluacionIntegralEstado;
  estadoLabel: string;
  fechaReferencia: string;
  fechaInicio: string;
  fechaCierre?: string;
  evaluacionAnteriorId?: string;
};

export type EvaluacionIntegralDetalleView = {
  evaluacion: EvaluacionIntegral;
  resumen: ResumenEvaluacion;
  participantes: ParticipacionEvaluacionEnriquecida[];
  responsableProceso?: ParticipacionEvaluacionEnriquecida;
  hallazgos: HallazgoEvaluativoView[];
  hallazgosPorTipo: Record<HallazgoTipo, HallazgoEvaluativoView[]>;
  conclusiones: ConclusionEvaluativaView[];
  conclusionesPorPrioridad: ConclusionesPorPrioridad;
};

const HALLAZGO_TIPOS_ORDEN: HallazgoTipo[] = [
  "fortaleza",
  "interes",
  "barrera",
  "contexto_exito",
];

const EMPTY_HALLAZGOS_POR_TIPO: Record<HallazgoTipo, HallazgoEvaluativoView[]> =
  {
    fortaleza: [],
    interes: [],
    barrera: [],
  contexto_exito: [],
};

export function getConclusionEvaluativaPrioridadLabel(
  prioridad: ConclusionEvaluativaPrioridad
): string {
  switch (prioridad) {
    case "alta":
      return "Prioridad alta";
    case "media":
      return "Prioridad media";
    case "baja":
      return "Prioridad baja";
  }
}

function buildObjetivosVinculadosResumen(
  conclusionEvaluativaId: string
): ObjetivoVinculadoResumen[] {
  const vinculos = getVinculosByConclusionId(conclusionEvaluativaId);
  const resumen: ObjetivoVinculadoResumen[] = [];

  for (const vinculo of vinculos) {
    const objetivo = getObjetivoPIEById(vinculo.objetivoPieId);
    if (!objetivo) continue;

    const evidencias = getEvidenciasPorObjetivoId(objetivo.id);
    const impactoPromedio = getImpactoPromedioEvidenciasObjetivo(evidencias);

    resumen.push({
      objetivoId: objetivo.id,
      nombre: objetivo.nombre,
      dimensionRelacionada: objetivo.dimensionRelacionada,
      estadoLabel: getEstadoObjetivoPIE(evidencias.length, impactoPromedio),
      cantidadEvidencias: evidencias.length,
    });
  }

  return resumen.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export function enrichConclusionEvaluativa(
  conclusion: ConclusionEvaluativa,
  hallazgosEvaluacion: HallazgoEvaluativo[]
): ConclusionEvaluativaView {
  const hallazgosById = new Map(
    hallazgosEvaluacion.map((item) => [item.id, item])
  );

  const hallazgosSustentantes: HallazgoSustentanteResumen[] = [];
  for (const hallazgoId of conclusion.hallazgosSustentantesIds) {
    const hallazgo = hallazgosById.get(hallazgoId);
    if (!hallazgo) continue;
    hallazgosSustentantes.push({
      id: hallazgo.id,
      nombre: hallazgo.nombre,
      tipo: hallazgo.tipo,
      tipoLabel: getHallazgoTipoLabel(hallazgo.tipo),
    });
  }

  const dimensionLabel = conclusion.dimensionId
    ? conclusion.dimensionId === "aprendizaje_curricular" &&
      conclusion.dimensionDetalle?.trim()
      ? `${getConclusionEvaluativaDimensionNombre(conclusion.dimensionId)}: ${conclusion.dimensionDetalle.trim()}`
      : getConclusionEvaluativaDimensionNombre(conclusion.dimensionId)
    : undefined;

  const objetivosVinculados = buildObjetivosVinculadosResumen(conclusion.id);
  const cantidadObjetivosVinculados = objetivosVinculados.length;
  const coberturaPlanificacion: ConclusionCoberturaPlanificacion =
    cantidadObjetivosVinculados > 0 ? "planificada" : "sin_planificacion";

  return {
    ...conclusion,
    prioridadLabel: getConclusionEvaluativaPrioridadLabel(conclusion.prioridad),
    dimensionLabel,
    hallazgosSustentantes,
    sinHallazgosSustentantes: hallazgosSustentantes.length === 0,
    coberturaPlanificacion,
    objetivosVinculados,
    cantidadObjetivosVinculados,
  };
}

export function groupConclusionesPorPrioridad(
  items: ConclusionEvaluativaView[]
): ConclusionesPorPrioridad {
  const grouped: ConclusionesPorPrioridad = {
    alta: [],
    media: [],
    baja: [],
  };

  for (const item of [...items].sort(compareConclusionesPorPrioridad)) {
    grouped[item.prioridad] = [...grouped[item.prioridad], item];
  }

  return grouped;
}

export function getConclusionesEvaluativasViewByEvaluacionId(
  evaluacionIntegralId: string
): ConclusionEvaluativaView[] {
  const hallazgos = getHallazgosEvaluativosByEvaluacionId(evaluacionIntegralId);
  return getConclusionesEvaluativasByEvaluacionId(evaluacionIntegralId).map(
    (item) => enrichConclusionEvaluativa(item, hallazgos)
  );
}

export function getEvaluacionIntegralTipoLabel(
  tipo: EvaluacionIntegralTipo
): string {
  switch (tipo) {
    case "ingreso":
      return "Ingreso";
    case "reevaluacion":
      return "Reevaluación";
    case "seguimiento":
      return "Seguimiento";
    case "otro":
      return "Otra evaluación";
  }
}

export function getEvaluacionIntegralEstadoLabel(
  estado: EvaluacionIntegralEstado
): string {
  switch (estado) {
    case "borrador":
      return "Borrador";
    case "cerrada":
      return "Cerrada";
    case "anulada":
      return "Anulada";
  }
}

export function getFechaReferenciaEvaluacion(
  evaluacion: Pick<
    EvaluacionIntegral,
    "fechaCierre" | "fechaTermino" | "fechaInicio"
  >
): string {
  return (
    evaluacion.fechaCierre?.trim() ||
    evaluacion.fechaTermino?.trim() ||
    evaluacion.fechaInicio.trim()
  );
}

function isHallazgoEvaluativoConsolidado(
  hallazgo: HallazgoEvaluativo
): boolean {
  return Boolean(hallazgo.consolidadoEn && hallazgo.hallazgoPerfilId);
}

function enrichParticipacion(
  participacion: ParticipacionEvaluacionIntegral
): ParticipacionEvaluacionEnriquecida {
  const profesional = getProfesionalById(participacion.profesionalId);
  const profesionalNombre =
    participacion.snapshotNombre?.trim() ||
    (profesional
      ? formatProfesionalNombreCompleto(profesional)
      : participacion.profesionalId);
  const rolNombre =
    participacion.snapshotRolNombre?.trim() ||
    getRolProfesionalNombre(participacion.rolEnEvaluacionId);

  return {
    ...participacion,
    profesionalNombre,
    rolNombre,
  };
}

function toHallazgoEvaluativoView(
  hallazgo: HallazgoEvaluativo
): HallazgoEvaluativoView {
  return {
    ...hallazgo,
    consolidacionEstado: isHallazgoEvaluativoConsolidado(hallazgo)
      ? "consolidado"
      : "pendiente",
  };
}

function groupHallazgosPorTipo(
  hallazgos: HallazgoEvaluativoView[]
): Record<HallazgoTipo, HallazgoEvaluativoView[]> {
  const grouped: Record<HallazgoTipo, HallazgoEvaluativoView[]> = {
    ...EMPTY_HALLAZGOS_POR_TIPO,
  };

  for (const hallazgo of hallazgos) {
    grouped[hallazgo.tipo] = [...grouped[hallazgo.tipo], hallazgo];
  }

  for (const tipo of HALLAZGO_TIPOS_ORDEN) {
    grouped[tipo].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  }

  return grouped;
}

function compareEvaluacionesPorFechaDesc(
  a: EvaluacionIntegral,
  b: EvaluacionIntegral
): number {
  const fechaA = getFechaReferenciaEvaluacion(a);
  const fechaB = getFechaReferenciaEvaluacion(b);
  const byFecha = fechaB.localeCompare(fechaA);
  if (byFecha !== 0) return byFecha;
  return b.creadoEn.localeCompare(a.creadoEn);
}

function getEvaluacionesNoAnuladasByEstudianteId(
  estudianteId: string
): EvaluacionIntegral[] {
  return readEvaluacionesIntegrales()
    .filter(
      (item) =>
        item.estudianteId === estudianteId && item.estado !== "anulada"
    )
    .sort(compareEvaluacionesPorFechaDesc);
}

export function tieneEvaluacionVigente(estudianteId: string): boolean {
  return getEvaluacionVigente(estudianteId) !== null;
}

export function tieneHallazgosPendientesConsolidacion(
  evaluacionIdOrEstudianteId: string,
  scope: "evaluacion" | "estudiante" = "evaluacion"
): boolean {
  if (scope === "evaluacion") {
    const resumen = getResumenEvaluacion(evaluacionIdOrEstudianteId);
    return (resumen?.cantidadHallazgosPendientesConsolidacion ?? 0) > 0;
  }

  const vigente = getEvaluacionVigente(evaluacionIdOrEstudianteId);
  if (!vigente) return false;
  return tieneHallazgosPendientesConsolidacion(vigente.id, "evaluacion");
}

/**
 * Evaluación de referencia del estudiante: borrador activo o, si no hay,
 * la evaluación cerrada más reciente.
 */
export function getEvaluacionVigente(
  estudianteId: string
): EvaluacionIntegral | null {
  if (!getEstudianteById(estudianteId)) return null;

  const evaluaciones = getEvaluacionesNoAnuladasByEstudianteId(estudianteId);
  if (evaluaciones.length === 0) return null;

  const borrador = evaluaciones.find((item) => item.estado === "borrador");
  if (borrador) return borrador;

  const cerrada = evaluaciones.find((item) => item.estado === "cerrada");
  return cerrada ?? evaluaciones[0];
}

export function getHistorialEvaluaciones(
  estudianteId: string
): HistorialEvaluacionItem[] {
  if (!getEstudianteById(estudianteId)) return [];

  return readEvaluacionesIntegrales()
    .filter((item) => item.estudianteId === estudianteId)
    .sort(compareEvaluacionesPorFechaDesc)
    .map((item) => ({
      id: item.id,
      tipo: item.tipo,
      tipoLabel: getEvaluacionIntegralTipoLabel(item.tipo),
      estado: item.estado,
      estadoLabel: getEvaluacionIntegralEstadoLabel(item.estado),
      fechaReferencia: getFechaReferenciaEvaluacion(item),
      fechaInicio: item.fechaInicio,
      fechaCierre: item.fechaCierre,
      evaluacionAnteriorId: item.evaluacionAnteriorId,
    }));
}

export function getResumenEvaluacion(
  evaluacionId: string
): ResumenEvaluacion | null {
  const evaluacion = getEvaluacionIntegralById(evaluacionId);
  if (!evaluacion) return null;

  const hallazgos = getHallazgosEvaluativosByEvaluacionId(evaluacionId);
  const participantes = getParticipacionesByEvaluacionId(evaluacionId).map(
    enrichParticipacion
  );
  const responsableProceso = participantes.find(
    (item) => item.esResponsableProceso
  );

  const cantidadHallazgosConsolidados = hallazgos.filter(
    isHallazgoEvaluativoConsolidado
  ).length;

  const conclusiones = getConclusionesEvaluativasByEvaluacionId(evaluacionId);

  return {
    evaluacionIntegralId: evaluacion.id,
    fechaInicio: evaluacion.fechaInicio,
    fechaCierre: evaluacion.fechaCierre,
    tipo: evaluacion.tipo,
    tipoLabel: getEvaluacionIntegralTipoLabel(evaluacion.tipo),
    estado: evaluacion.estado,
    estadoLabel: getEvaluacionIntegralEstadoLabel(evaluacion.estado),
    cantidadHallazgosEvaluativos: hallazgos.length,
    cantidadHallazgosConsolidados,
    cantidadHallazgosPendientesConsolidacion:
      hallazgos.length - cantidadHallazgosConsolidados,
    cantidadParticipantes: participantes.length,
    cantidadConclusionesEvaluativas: conclusiones.length,
    cantidadConclusionesAlta: conclusiones.filter(
      (item) => item.prioridad === "alta"
    ).length,
    cantidadConclusionesMedia: conclusiones.filter(
      (item) => item.prioridad === "media"
    ).length,
    cantidadConclusionesBaja: conclusiones.filter(
      (item) => item.prioridad === "baja"
    ).length,
    responsableProceso,
  };
}

/**
 * Vista compuesta: evaluación + resumen + equipo evaluador + hallazgos agrupados.
 * Toda agregación vive aquí; la UI solo renderiza.
 */
export function getEvaluacionConDetalle(
  evaluacionId: string
): EvaluacionIntegralDetalleView | null {
  const evaluacion = getEvaluacionIntegralById(evaluacionId);
  if (!evaluacion) return null;

  const resumen = getResumenEvaluacion(evaluacionId);
  if (!resumen) return null;

  const participantes = getParticipacionesByEvaluacionId(evaluacionId)
    .map(enrichParticipacion)
    .sort((a, b) => {
      if (a.esResponsableProceso !== b.esResponsableProceso) {
        return a.esResponsableProceso ? -1 : 1;
      }
      return a.profesionalNombre.localeCompare(b.profesionalNombre, "es");
    });

  const hallazgos = getHallazgosEvaluativosByEvaluacionId(evaluacionId).map(
    toHallazgoEvaluativoView
  );

  const conclusiones = getConclusionesEvaluativasViewByEvaluacionId(
    evaluacionId
  );

  return {
    evaluacion,
    resumen,
    participantes,
    responsableProceso: resumen.responsableProceso,
    hallazgos,
    hallazgosPorTipo: groupHallazgosPorTipo(hallazgos),
    conclusiones,
    conclusionesPorPrioridad: groupConclusionesPorPrioridad(conclusiones),
  };
}
