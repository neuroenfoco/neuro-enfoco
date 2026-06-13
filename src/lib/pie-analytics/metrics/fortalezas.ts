import { ANALYTICS_MIN_EVIDENCIAS_FORTALEZA } from "@/lib/pie-analytics/constants";
import type {
  FortalezaCorrelacion,
  MetricasFortalezas,
  PieAnalyticsEvidencia,
} from "@/lib/pie-analytics/types";

function promedio(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function computePesoAsociacion(
  deltaImpacto: number | null,
  frecuencia: number,
  totalEvidencias: number
): number {
  if (deltaImpacto === null || totalEvidencias === 0) return 0;

  const frecuenciaNormalizada = frecuencia / totalEvidencias;
  const impactoNormalizado = Math.max(0, deltaImpacto) / 4;
  return Math.round((frecuenciaNormalizada * 0.4 + impactoNormalizado * 0.6) * 100) / 100;
}

export function computeFortalezaCorrelaciones(
  evidencias: PieAnalyticsEvidencia[]
): FortalezaCorrelacion[] {
  const impactoGlobal = promedio(evidencias.map((item) => item.impacto));
  const counts = new Map<string, { frecuencia: number; impactos: number[] }>();

  for (const evidencia of evidencias) {
    for (const fortaleza of evidencia.fortalezas) {
      const normalized = fortaleza.trim();
      if (!normalized) continue;

      const current = counts.get(normalized) ?? { frecuencia: 0, impactos: [] };
      current.frecuencia += 1;
      current.impactos.push(evidencia.impacto);
      counts.set(normalized, current);
    }
  }

  return [...counts.entries()]
    .map(([nombre, data]) => {
      const impactoPromedioAsociado = promedio(data.impactos);
      const deltaImpacto =
        impactoPromedioAsociado !== null && impactoGlobal !== null
          ? Math.round((impactoPromedioAsociado - impactoGlobal) * 10) / 10
          : null;

      return {
        nombre,
        frecuencia: data.frecuencia,
        impactoPromedioAsociado,
        sesionesConFortaleza: data.impactos.length,
        deltaImpacto,
        pesoAsociacion: computePesoAsociacion(
          deltaImpacto,
          data.frecuencia,
          evidencias.length
        ),
      };
    })
    .sort(
      (left, right) =>
        right.pesoAsociacion - left.pesoAsociacion ||
        right.frecuencia - left.frecuencia ||
        left.nombre.localeCompare(right.nombre, "es")
    );
}

export function computeMetricasFortalezas(
  evidencias: PieAnalyticsEvidencia[]
): MetricasFortalezas {
  const correlaciones = computeFortalezaCorrelaciones(evidencias);

  const masFrecuentes = [...correlaciones]
    .sort(
      (left, right) =>
        right.frecuencia - left.frecuencia ||
        left.nombre.localeCompare(right.nombre, "es")
    )
    .slice(0, 5);

  const asociadasAProgreso = correlaciones.filter(
    (item) =>
      item.sesionesConFortaleza >= ANALYTICS_MIN_EVIDENCIAS_FORTALEZA &&
      (item.deltaImpacto ?? 0) > 0
  );

  return {
    masFrecuentes,
    asociadasAProgreso: asociadasAProgreso.slice(0, 5),
  };
}
