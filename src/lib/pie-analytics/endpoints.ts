import {
  aggregateEstudianteAnalytics,
  aggregateObjetivoAnalytics,
} from "@/lib/pie-analytics/aggregator";
import {
  buildPieAnalyticsEstudianteInput,
  buildPieAnalyticsObjetivoInput,
} from "@/lib/pie-analytics/data-source";
import {
  buildEstudianteInsightCandidates,
  buildInsightCandidates,
} from "@/lib/pie-analytics/insights";
import type {
  EstudiantePIEAnalyticsResponse,
  ObjetivoPIEAnalytics,
  ObjetivoPIEAnalyticsResponse,
  PieAnalyticsEstudianteInput,
  PieAnalyticsObjetivoInput,
} from "@/lib/pie-analytics/types";

/**
 * Contrato estable de "endpoints" internos.
 * Hoy se invocan en cliente; las rutas API reutilizan las mismas funciones.
 */
export function getObjetivoPieAnalytics(
  input: PieAnalyticsObjetivoInput
): ObjetivoPIEAnalyticsResponse {
  const analytics = aggregateObjetivoAnalytics(input);
  return {
    analytics,
    insights: buildInsightCandidates(analytics),
  };
}

export function getEstudiantePieAnalytics(
  input: PieAnalyticsEstudianteInput
): EstudiantePIEAnalyticsResponse {
  const analytics = aggregateEstudianteAnalytics(input);
  return {
    analytics,
    insights: buildEstudianteInsightCandidates(analytics),
  };
}

export function getObjetivoPieAnalyticsFromStorage(
  objetivoId: string
): ObjetivoPIEAnalyticsResponse | null {
  const input = buildPieAnalyticsObjetivoInput(objetivoId);
  if (!input) return null;
  return getObjetivoPieAnalytics(input);
}

export function getEstudiantePieAnalyticsFromStorage(
  estudianteId: string
): EstudiantePIEAnalyticsResponse {
  return getEstudiantePieAnalytics(buildPieAnalyticsEstudianteInput(estudianteId));
}

export function getObjetivoPieAnalyticsMetricsOnly(
  input: PieAnalyticsObjetivoInput
): ObjetivoPIEAnalytics {
  return aggregateObjetivoAnalytics(input);
}

export const pieAnalyticsEndpoints = {
  objetivo: getObjetivoPieAnalytics,
  estudiante: getEstudiantePieAnalytics,
  objetivoFromStorage: getObjetivoPieAnalyticsFromStorage,
  estudianteFromStorage: getEstudiantePieAnalyticsFromStorage,
  metricsOnly: getObjetivoPieAnalyticsMetricsOnly,
} as const;
