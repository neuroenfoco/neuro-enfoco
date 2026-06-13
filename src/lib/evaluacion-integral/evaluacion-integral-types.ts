import type { CatalogKind } from "@/lib/catalogos/catalog-types";
import type { HallazgoTipo } from "@/lib/perfil-hallazgos-storage";
import type { RolProfesionalId } from "@/lib/institucional/roles-profesional-catalog";

export type EvaluacionIntegralTipo =
  | "ingreso"
  | "reevaluacion"
  | "seguimiento"
  | "otro";

export type EvaluacionIntegralEstado = "borrador" | "cerrada" | "anulada";

export type EvaluacionIntegral = {
  id: string;
  estudianteId: string;
  tipo: EvaluacionIntegralTipo;
  estado: EvaluacionIntegralEstado;
  fechaInicio: string;
  fechaTermino?: string;
  fechaCierre?: string;
  /** Encadenamiento futuro entre evaluaciones (p. ej. reevaluación). */
  evaluacionAnteriorId?: string;
  ingresoPieOrigen?: string;
  tipoNEE?: string;
  diagnosticoNEEResumen?: string;
  fechaProximaReevaluacion?: string;
  referenciaEvaluacionPrevia?: string;
  observacionesEvaluacion?: string;
  creadoEn: string;
  actualizadoEn: string;
};

export type SaveEvaluacionIntegralInput = {
  estudianteId: string;
  tipo?: EvaluacionIntegralTipo;
  fechaInicio: string;
  fechaTermino?: string;
  ingresoPieOrigen?: string;
  tipoNEE?: string;
  diagnosticoNEEResumen?: string;
  fechaProximaReevaluacion?: string;
  referenciaEvaluacionPrevia?: string;
  observacionesEvaluacion?: string;
};

export type UpdateEvaluacionIntegralInput = {
  tipo?: EvaluacionIntegralTipo;
  fechaInicio?: string;
  fechaTermino?: string;
  tipoNEE?: string;
  diagnosticoNEEResumen?: string;
  fechaProximaReevaluacion?: string;
  referenciaEvaluacionPrevia?: string;
  observacionesEvaluacion?: string;
};

export type ParticipacionEvaluacionIntegral = {
  id: string;
  evaluacionIntegralId: string;
  estudianteId: string;
  profesionalId: string;
  rolEnEvaluacionId: RolProfesionalId;
  esResponsableProceso: boolean;
  fechaInicio: string;
  fechaTermino?: string;
  snapshotNombre?: string;
  snapshotRolNombre?: string;
  notas?: string;
  creadoEn: string;
  actualizadoEn: string;
};

export type SaveParticipacionEvaluacionIntegralInput = {
  evaluacionIntegralId: string;
  estudianteId: string;
  profesionalId: string;
  rolEnEvaluacionId: RolProfesionalId;
  esResponsableProceso?: boolean;
  fechaInicio: string;
  fechaTermino?: string;
  notas?: string;
};

export type UpdateParticipacionEvaluacionIntegralInput = {
  profesionalId?: string;
  rolEnEvaluacionId?: RolProfesionalId;
  esResponsableProceso?: boolean;
  fechaInicio?: string;
  fechaTermino?: string;
  notas?: string;
};

export type HallazgoEvaluativo = {
  id: string;
  evaluacionIntegralId: string;
  estudianteId: string;
  tipo: HallazgoTipo;
  nombre: string;
  catalogoKind?: CatalogKind;
  catalogoId?: string;
  formulacionOriginal?: string;
  hallazgoPerfilId?: string;
  consolidadoEn?: string;
  creadoEn: string;
  actualizadoEn: string;
};

export type SaveHallazgoEvaluativoInput = {
  evaluacionIntegralId: string;
  estudianteId: string;
  tipo: HallazgoTipo;
  nombre: string;
  catalogoKind?: CatalogKind;
  catalogoId?: string;
  formulacionOriginal?: string;
};

export type UpdateHallazgoEvaluativoInput = {
  nombre?: string;
  catalogoKind?: CatalogKind;
  catalogoId?: string;
  formulacionOriginal?: string;
};

export type ConsolidarHallazgosEvaluacionResult = {
  evaluacionIntegralId: string;
  procesados: number;
  vinculadosExistentes: number;
  creadosEnPerfil: number;
  yaConsolidados: number;
};

export type ConclusionEvaluativaPrioridad = "alta" | "media" | "baja";

export type ConclusionEvaluativaDimensionId =
  | "participacion_convivencia"
  | "comunicacion_lenguaje"
  | "aprendizaje_curricular"
  | "atencion_funcion_ejecutiva"
  | "socioemocional"
  | "sensorial_motor"
  | "acceso_contexto";

export type ConclusionEvaluativa = {
  id: string;
  evaluacionIntegralId: string;
  estudianteId: string;
  enunciado: string;
  prioridad: ConclusionEvaluativaPrioridad;
  hallazgosSustentantesIds: string[];
  dimensionId?: ConclusionEvaluativaDimensionId;
  dimensionDetalle?: string;
  notas?: string;
  creadoEn: string;
  actualizadoEn: string;
};

export type SaveConclusionEvaluativaInput = {
  evaluacionIntegralId: string;
  estudianteId: string;
  enunciado: string;
  prioridad: ConclusionEvaluativaPrioridad;
  hallazgosSustentantesIds: string[];
  dimensionId?: ConclusionEvaluativaDimensionId;
  dimensionDetalle?: string;
  notas?: string;
};

export type UpdateConclusionEvaluativaInput = {
  enunciado?: string;
  prioridad?: ConclusionEvaluativaPrioridad;
  hallazgosSustentantesIds?: string[];
  dimensionId?: ConclusionEvaluativaDimensionId;
  dimensionDetalle?: string;
  notas?: string;
};

export type ConclusionCoberturaPlanificacion =
  | "sin_planificacion"
  | "planificada";

export type VinculoConclusionObjetivoPIE = {
  id: string;
  conclusionEvaluativaId: string;
  objetivoPieId: string;
  estudianteId: string;
  evaluacionIntegralId: string;
  creadoEn: string;
};

export type SaveVinculoConclusionObjetivoPIEInput = {
  conclusionEvaluativaId: string;
  objetivoPieId: string;
};

export type ObjetivoVinculadoResumen = {
  objetivoId: string;
  nombre: string;
  dimensionRelacionada: string;
  estadoLabel: string;
  cantidadEvidencias: number;
};

export type ConclusionSustentanteResumen = {
  id: string;
  enunciado: string;
  prioridad: ConclusionEvaluativaPrioridad;
  prioridadLabel: string;
  evaluacionIntegralId: string;
  evaluacionTipoLabel: string;
  evaluacionFechaReferencia: string;
};
