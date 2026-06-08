import type { TipoEspacioId } from "@/lib/espacios-catalog";
import type {
  TipoIntervencionCategoria,
  TipoIntervencionId,
} from "@/lib/intervenciones-catalog";

export type IntervencionesAnalyticsAlcance =
  | "institucional"
  | "estudiante"
  | "profesional";

export type IntervencionesAnalyticsObjetivoRef = {
  objetivoId: string;
  nombre?: string;
  dimensionRelacionada?: string;
};

/** Snapshot desacoplado del storage para motor stateless. */
export type IntervencionesAnalyticsIntervencion = {
  id: string;
  estudianteId: string;
  estudianteNombre?: string;
  profesionalId: string;
  profesionalNombre?: string;
  fecha: string;
  tipoIntervencion: TipoIntervencionId;
  espacioId?: string;
  espacioNombre?: string;
  tipoEspacio?: TipoEspacioId;
  duracionMinutos: number;
  objetivosRelacionados: IntervencionesAnalyticsObjetivoRef[];
  cantidadEvidencias: number;
};

export type IntervencionesAnalyticsFiltros = {
  estudianteId?: string;
  profesionalId?: string;
  tipoIntervencionId?: TipoIntervencionId;
  espacioId?: string;
  tipoEspacio?: TipoEspacioId;
  fechaDesde?: string;
  fechaHasta?: string;
};

export type IntervencionesAnalyticsInput = {
  alcance: IntervencionesAnalyticsAlcance;
  filtros?: IntervencionesAnalyticsFiltros;
  intervenciones: IntervencionesAnalyticsIntervencion[];
  /** Fecha de referencia para ventanas temporales (ISO). */
  referencia?: string;
  /** Ventana móvil en semanas para frecuencia semanal. */
  ventanaSemanas?: number;
};

export type IntervencionesAnalyticsResumen = {
  totalIntervenciones: number;
  totalDuracionMinutos: number;
  promedioDuracionMinutos: number | null;
  totalEvidencias: number;
  estudiantesDistintos: number;
  profesionalesDistintos: number;
  tiposDistintos: number;
  espaciosDistintos: number;
  objetivosDistintos: number;
};

export type IntervencionPorEstudiante = {
  estudianteId: string;
  estudianteNombre: string;
  totalIntervenciones: number;
  totalDuracionMinutos: number;
  promedioDuracionMinutos: number | null;
  totalEvidencias: number;
  tiposDistintos: number;
  espaciosDistintos: number;
  objetivosDistintos: number;
};

export type IntervencionPorProfesional = {
  profesionalId: string;
  profesionalNombre: string;
  totalIntervenciones: number;
  totalDuracionMinutos: number;
  promedioDuracionMinutos: number | null;
  totalEvidencias: number;
  estudiantesDistintos: number;
  tiposDistintos: number;
  espaciosDistintos: number;
};

export type TipoIntervencionEstadistica = {
  tipoIntervencionId: TipoIntervencionId;
  nombre: string;
  categoria: TipoIntervencionCategoria;
  etiquetasAnalitica: readonly string[];
  totalIntervenciones: number;
  totalDuracionMinutos: number;
  promedioDuracionMinutos: number | null;
  totalEvidencias: number;
  porcentajeDelTotal: number;
};

export type MetricasDuracion = {
  totalMinutos: number;
  promedioMinutos: number | null;
  medianaMinutos: number | null;
  minimoMinutos: number | null;
  maximoMinutos: number | null;
  porTipo: {
    tipoIntervencionId: TipoIntervencionId;
    nombre: string;
    totalDuracionMinutos: number;
    porcentajeDelTotal: number;
  }[];
};

export type FrecuenciaSemanalItem = {
  semanaInicio: string;
  semanaEtiqueta: string;
  totalIntervenciones: number;
  totalDuracionMinutos: number;
};

export type FrecuenciaSemanalAnalytics = {
  ventanaSemanas: number;
  semanasConIntervencion: number;
  promedioIntervencionesPorSemana: number | null;
  promedioDuracionMinutosPorSemana: number | null;
  serieSemanal: FrecuenciaSemanalItem[];
};

export type DistribucionEspacioItem = {
  espacioId: string | null;
  espacioNombre: string;
  tipoEspacio?: TipoEspacioId;
  totalIntervenciones: number;
  porcentaje: number;
  totalDuracionMinutos: number;
};

export type DistribucionEspacioAnalytics = {
  totalConEspacio: number;
  totalSinEspacio: number;
  items: DistribucionEspacioItem[];
};

export type ObjetivoTrabajadoRanking = {
  objetivoId: string;
  nombre: string;
  dimensionRelacionada?: string;
  totalIntervenciones: number;
  totalDuracionMinutos: number;
  estudiantesDistintos: number;
  profesionalesDistintos: number;
};

/** Paquete principal para dashboards institucionales. */
export type IntervencionesAnalytics = {
  generadoEn: string;
  alcance: IntervencionesAnalyticsAlcance;
  filtrosAplicados: IntervencionesAnalyticsFiltros;
  resumen: IntervencionesAnalyticsResumen;
  porEstudiante: IntervencionPorEstudiante[];
  porProfesional: IntervencionPorProfesional[];
  porTipo: TipoIntervencionEstadistica[];
  duracion: MetricasDuracion;
  frecuenciaSemanal: FrecuenciaSemanalAnalytics;
  distribucionEspacio: DistribucionEspacioAnalytics;
  objetivosMasTrabajados: ObjetivoTrabajadoRanking[];
};

export type IntervencionesAnalyticsResponse = {
  analytics: IntervencionesAnalytics;
};

/** @deprecated Usar IntervencionesAnalyticsFiltros */
export type EstadisticasIntervencionFiltros = Pick<
  IntervencionesAnalyticsFiltros,
  "estudianteId" | "tipoIntervencionId"
> & {
  categoria?: TipoIntervencionCategoria;
};
