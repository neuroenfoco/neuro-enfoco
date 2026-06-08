/** Tipos base del motor de analítica pedagógica PIE (sin IA). */

export type ConfianzaAnalitica = "baja" | "media" | "alta";

export type DireccionTendencia =
  | "ascendente"
  | "descendente"
  | "estable"
  | "insuficiente";

export type CategoriaApoyo =
  | "visual"
  | "temporal"
  | "espacial"
  | "social"
  | "narrativo"
  | "otro";

export type PieAnalyticsEvidencia = {
  sesionId: string;
  fecha: string;
  estadoInicial: string;
  estadoFinal: string;
  impacto: number;
  fortalezas: string[];
  logro: string;
  /** Vínculo opcional con una intervención registrada. */
  intervencionId?: string;
};

export type PieAnalyticsApoyo = {
  apoyoId: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaTermino?: string;
  activo: boolean;
  duracionDias: number | null;
};

/** Entrada desacoplada del storage; usable en cliente, API o futuro backend. */
export type PieAnalyticsObjetivoInput = {
  objetivoId: string;
  estudianteId: string;
  nombre: string;
  dimensionRelacionada: string;
  lineaBase?: string;
  fechaLineaBase?: string;
  metaLogro?: string;
  barreraDetectada?: string;
  evidencias: PieAnalyticsEvidencia[];
  apoyos: PieAnalyticsApoyo[];
};

export type PieAnalyticsEstudianteInput = {
  estudianteId: string;
  objetivos: PieAnalyticsObjetivoInput[];
};

export type EstadoEmocionalResumen = {
  label: string;
  valor: number;
};

export type EvidenciaResumen = {
  sesionId: string;
  fecha: string;
  estadoInicial: EstadoEmocionalResumen;
  estadoFinal: EstadoEmocionalResumen;
  impacto: number;
};

export type ContextoLineaBase = {
  descripcion: string | null;
  fecha: string | null;
};

export type FortalezaCorrelacion = {
  nombre: string;
  frecuencia: number;
  impactoPromedioAsociado: number | null;
  sesionesConFortaleza: number;
  /** Diferencia respecto al impacto promedio global del objetivo. */
  deltaImpacto: number | null;
  pesoAsociacion: number;
};

export type EvolucionEstados = {
  estadoInicialPromedio: number | null;
  estadoFinalPromedio: number | null;
  deltaEmocionalPromedio: number | null;
  primeraEvidencia: EvidenciaResumen | null;
  ultimaEvidencia: EvidenciaResumen | null;
};

export type TendenciaImpacto = {
  ventanaSemanas: number;
  impactoPromedioVentana: number | null;
  impactoPromedioPrevio: number | null;
  delta: number | null;
  sesionesEnVentana: number;
  sesionesPrevias: number;
  mejoraSostenida: boolean;
  direccion: DireccionTendencia;
};

export type ApoyoConMetricas = PieAnalyticsApoyo & {
  categoria: CategoriaApoyo;
  evidenciasDuranteApoyo: number;
  impactoPromedioDuranteApoyo: number | null;
  deltaImpactoVsGlobal: number | null;
};

export type ApoyoRankingItem = {
  apoyoId: string;
  nombre: string;
  categoria: CategoriaApoyo;
  impactoPromedio: number;
  evidencias: number;
  deltaImpactoVsGlobal: number | null;
};

export type CategoriaApoyoResumen = {
  categoria: CategoriaApoyo;
  impactoPromedio: number;
  evidencias: number;
  apoyosDistintos: number;
};

export type MetricasImpacto = {
  promedio: number | null;
  mediana: number | null;
  minimo: number | null;
  maximo: number | null;
  tendencia8Semanas: TendenciaImpacto;
  tendencia4Semanas: TendenciaImpacto;
};

export type MetricasFortalezas = {
  masFrecuentes: FortalezaCorrelacion[];
  asociadasAProgreso: FortalezaCorrelacion[];
};

export type MetricasApoyos = {
  items: ApoyoConMetricas[];
  rankingPorImpacto: ApoyoRankingItem[];
  resumenPorCategoria: CategoriaApoyoResumen[];
  categoriaMasEfectiva: CategoriaApoyo | null;
};

export type AlcanceAnalitico = {
  totalEvidencias: number;
  totalApoyos: number;
  apoyosActivos: number;
  semanasConEvidencia: number;
  diasSeguimiento: number | null;
};

export type IndicadorAnaliticoTipo =
  | "apoyo_efectividad"
  | "fortaleza_progreso"
  | "mejora_sostenida"
  | "evolucion_estados"
  | "linea_base_comparativa";

export type IndicadorAnalitico = {
  tipo: IndicadorAnaliticoTipo;
  listo: boolean;
  confianza: ConfianzaAnalitica;
  datosMinimos: number;
  datosActuales: number;
  descripcion: string;
};

/** Paquete principal consumible por UI, reportes o capa de IA futura. */
export type ObjetivoPIEAnalytics = {
  objetivoId: string;
  estudianteId: string;
  nombre: string;
  dimensionRelacionada: string;
  generadoEn: string;
  alcance: AlcanceAnalitico;
  lineaBase: ContextoLineaBase;
  metaLogro: string | null;
  barreraDetectada: string | null;
  fortalezas: MetricasFortalezas;
  estados: EvolucionEstados;
  impacto: MetricasImpacto;
  apoyos: MetricasApoyos;
  indicadores: IndicadorAnalitico[];
};

export type EstudiantePIEAnalytics = {
  estudianteId: string;
  generadoEn: string;
  totalObjetivos: number;
  objetivos: ObjetivoPIEAnalytics[];
  consolidado: {
    impactoPromedioGlobal: number | null;
    fortalezasTransversales: FortalezaCorrelacion[];
    categoriaApoyoMasEfectiva: CategoriaApoyo | null;
    objetivosConMejoraSostenida: number;
  };
};

/** Plantillas para conclusiones automáticas (texto generado en capa futura). */
export type InsightTemplateId =
  | "apoyo_mayor_avance"
  | "fortalezas_asociadas_progreso"
  | "mejora_sostenida_temporal"
  | "evolucion_estados_positiva";

export type InsightCandidate = {
  templateId: InsightTemplateId;
  listo: boolean;
  confianza: ConfianzaAnalitica;
  variables: Record<string, string | number>;
};

export type ObjetivoPIEAnalyticsResponse = {
  analytics: ObjetivoPIEAnalytics;
  insights: InsightCandidate[];
};

export type EstudiantePIEAnalyticsResponse = {
  analytics: EstudiantePIEAnalytics;
  insights: InsightCandidate[];
};
