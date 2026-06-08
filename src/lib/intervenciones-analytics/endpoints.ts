import { aggregateIntervencionesAnalytics } from "@/lib/intervenciones-analytics/aggregator";
import type {
  IntervencionesAnalytics,
  IntervencionesAnalyticsInput,
  IntervencionesAnalyticsResponse,
} from "@/lib/intervenciones-analytics/types";

export function getIntervencionesAnalytics(
  input: IntervencionesAnalyticsInput
): IntervencionesAnalyticsResponse {
  return {
    analytics: aggregateIntervencionesAnalytics(input),
  };
}

export function getIntervencionesAnalyticsMetricsOnly(
  input: IntervencionesAnalyticsInput
): IntervencionesAnalytics {
  return aggregateIntervencionesAnalytics(input);
}

export const intervencionesAnalyticsEndpoints = {
  analytics: getIntervencionesAnalytics,
  metricsOnly: getIntervencionesAnalyticsMetricsOnly,
} as const;
