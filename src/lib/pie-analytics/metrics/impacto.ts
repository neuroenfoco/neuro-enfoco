import {
  ANALYTICS_MIN_EVIDENCIAS_TENDENCIA,
  VENTANA_TENDENCIA_4_SEMANAS,
  VENTANA_TENDENCIA_8_SEMANAS,
} from "@/lib/pie-analytics/constants";
import {
  parseAnalyticsFecha,
  startOfDay,
  subtractSemanas,
} from "@/lib/pie-analytics/date-utils";
import type {
  DireccionTendencia,
  MetricasImpacto,
  PieAnalyticsEvidencia,
  TendenciaImpacto,
} from "@/lib/pie-analytics/types";

function promedio(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function mediana(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;
  }
  return sorted[mid];
}

function resolverDireccion(
  delta: number | null,
  sesionesEnVentana: number
): DireccionTendencia {
  if (sesionesEnVentana < ANALYTICS_MIN_EVIDENCIAS_TENDENCIA || delta === null) {
    return "insuficiente";
  }
  if (delta > 0.2) return "ascendente";
  if (delta < -0.2) return "descendente";
  return "estable";
}

export function computeTendenciaImpacto(
  evidencias: PieAnalyticsEvidencia[],
  ventanaSemanas: number,
  referencia = new Date()
): TendenciaImpacto {
  const hoy = startOfDay(referencia);
  const inicioVentana = subtractSemanas(hoy, ventanaSemanas);

  const enVentana: number[] = [];
  const previas: number[] = [];

  for (const evidencia of evidencias) {
    const fecha = parseAnalyticsFecha(evidencia.fecha);
    if (!fecha) continue;

    const day = startOfDay(fecha);
    if (day >= inicioVentana && day <= hoy) {
      enVentana.push(evidencia.impacto);
    } else if (day < inicioVentana) {
      previas.push(evidencia.impacto);
    }
  }

  const impactoPromedioVentana = promedio(enVentana);
  const impactoPromedioPrevio = promedio(previas);
  const delta =
    impactoPromedioVentana !== null && impactoPromedioPrevio !== null
      ? Math.round((impactoPromedioVentana - impactoPromedioPrevio) * 10) / 10
      : impactoPromedioVentana !== null && previas.length === 0
        ? impactoPromedioVentana
        : null;

  const mejoraSostenida =
    enVentana.length >= ANALYTICS_MIN_EVIDENCIAS_TENDENCIA &&
    (impactoPromedioVentana ?? 0) > 0 &&
    (delta === null || delta >= 0);

  return {
    ventanaSemanas,
    impactoPromedioVentana,
    impactoPromedioPrevio,
    delta,
    sesionesEnVentana: enVentana.length,
    sesionesPrevias: previas.length,
    mejoraSostenida,
    direccion: resolverDireccion(delta, enVentana.length),
  };
}

export function computeMetricasImpacto(
  evidencias: PieAnalyticsEvidencia[],
  referencia = new Date()
): MetricasImpacto {
  const impactos = evidencias.map((item) => item.impacto);

  return {
    promedio: promedio(impactos),
    mediana: mediana(impactos),
    minimo: impactos.length > 0 ? Math.min(...impactos) : null,
    maximo: impactos.length > 0 ? Math.max(...impactos) : null,
    tendencia8Semanas: computeTendenciaImpacto(
      evidencias,
      VENTANA_TENDENCIA_8_SEMANAS,
      referencia
    ),
    tendencia4Semanas: computeTendenciaImpacto(
      evidencias,
      VENTANA_TENDENCIA_4_SEMANAS,
      referencia
    ),
  };
}
