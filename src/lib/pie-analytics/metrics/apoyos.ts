import { ANALYTICS_MIN_EVIDENCIAS_APOYO } from "@/lib/pie-analytics/constants";
import { inferirCategoriaApoyo } from "@/lib/pie-analytics/apoyo-categories";
import {
  isFechaEnRango,
  parseAnalyticsFecha,
  startOfDay,
} from "@/lib/pie-analytics/date-utils";
import type {
  ApoyoConMetricas,
  ApoyoRankingItem,
  CategoriaApoyo,
  CategoriaApoyoResumen,
  MetricasApoyos,
  PieAnalyticsApoyo,
  PieAnalyticsEvidencia,
} from "@/lib/pie-analytics/types";

function promedio(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function getEvidenciasDuranteApoyo(
  apoyo: PieAnalyticsApoyo,
  evidencias: PieAnalyticsEvidencia[],
  referencia = new Date()
): PieAnalyticsEvidencia[] {
  const inicio = parseAnalyticsFecha(apoyo.fechaInicio);
  if (!inicio) return [];

  const fin = apoyo.fechaTermino?.trim()
    ? parseAnalyticsFecha(apoyo.fechaTermino)
    : startOfDay(referencia);

  if (!fin) return [];

  return evidencias.filter((evidencia) => {
    const fecha = parseAnalyticsFecha(evidencia.fecha);
    if (!fecha) return false;
    return isFechaEnRango(fecha, inicio, fin);
  });
}

function buildResumenPorCategoria(
  items: ApoyoConMetricas[]
): CategoriaApoyoResumen[] {
  const map = new Map<
    CategoriaApoyo,
    { impactos: number[]; evidencias: number; apoyos: Set<string> }
  >();

  for (const item of items) {
    if (item.evidenciasDuranteApoyo < ANALYTICS_MIN_EVIDENCIAS_APOYO) continue;
    if (item.impactoPromedioDuranteApoyo === null) continue;

    const current = map.get(item.categoria) ?? {
      impactos: [],
      evidencias: 0,
      apoyos: new Set<string>(),
    };

    current.impactos.push(item.impactoPromedioDuranteApoyo);
    current.evidencias += item.evidenciasDuranteApoyo;
    current.apoyos.add(item.apoyoId);
    map.set(item.categoria, current);
  }

  return [...map.entries()]
    .map(([categoria, data]) => ({
      categoria,
      impactoPromedio: promedio(data.impactos) ?? 0,
      evidencias: data.evidencias,
      apoyosDistintos: data.apoyos.size,
    }))
    .sort((left, right) => right.impactoPromedio - left.impactoPromedio);
}

export function computeMetricasApoyos(
  apoyos: PieAnalyticsApoyo[],
  evidencias: PieAnalyticsEvidencia[],
  referencia = new Date()
): MetricasApoyos {
  const impactoGlobal = promedio(evidencias.map((item) => item.impacto));

  const items: ApoyoConMetricas[] = apoyos.map((apoyo) => {
    const evidenciasDurante = getEvidenciasDuranteApoyo(
      apoyo,
      evidencias,
      referencia
    );
    const impactoPromedioDuranteApoyo = promedio(
      evidenciasDurante.map((item) => item.impacto)
    );
    const deltaImpactoVsGlobal =
      impactoPromedioDuranteApoyo !== null && impactoGlobal !== null
        ? Math.round((impactoPromedioDuranteApoyo - impactoGlobal) * 10) / 10
        : null;

    return {
      ...apoyo,
      categoria: inferirCategoriaApoyo(apoyo.nombre, apoyo.descripcion),
      evidenciasDuranteApoyo: evidenciasDurante.length,
      impactoPromedioDuranteApoyo,
      deltaImpactoVsGlobal,
    };
  });

  const rankingPorImpacto: ApoyoRankingItem[] = items
    .filter(
      (item) =>
        item.evidenciasDuranteApoyo >= ANALYTICS_MIN_EVIDENCIAS_APOYO &&
        item.impactoPromedioDuranteApoyo !== null
    )
    .map((item) => ({
      apoyoId: item.apoyoId,
      nombre: item.nombre,
      categoria: item.categoria,
      impactoPromedio: item.impactoPromedioDuranteApoyo ?? 0,
      evidencias: item.evidenciasDuranteApoyo,
      deltaImpactoVsGlobal: item.deltaImpactoVsGlobal,
    }))
    .sort(
      (left, right) =>
        right.impactoPromedio - left.impactoPromedio ||
        right.evidencias - left.evidencias
    );

  const resumenPorCategoria = buildResumenPorCategoria(items);

  return {
    items,
    rankingPorImpacto,
    resumenPorCategoria,
    categoriaMasEfectiva: resumenPorCategoria[0]?.categoria ?? null,
  };
}
