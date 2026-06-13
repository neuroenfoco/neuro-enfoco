import { computeIndicadoresAnaliticos } from "@/lib/pie-analytics/indicators";
import { computeMetricasApoyos } from "@/lib/pie-analytics/metrics/apoyos";
import { computeEvolucionEstados } from "@/lib/pie-analytics/metrics/estados";
import { computeMetricasFortalezas } from "@/lib/pie-analytics/metrics/fortalezas";
import { computeMetricasImpacto } from "@/lib/pie-analytics/metrics/impacto";
import {
  countSemanasUnicas,
  diffDias,
  parseAnalyticsFecha,
  startOfDay,
} from "@/lib/pie-analytics/date-utils";
import type {
  EstudiantePIEAnalytics,
  ObjetivoPIEAnalytics,
  PieAnalyticsEstudianteInput,
  PieAnalyticsEvidencia,
  PieAnalyticsObjetivoInput,
} from "@/lib/pie-analytics/types";

function sortEvidenciasAsc(
  evidencias: PieAnalyticsEvidencia[]
): PieAnalyticsEvidencia[] {
  return [...evidencias].sort((left, right) => {
    const leftTime = parseAnalyticsFecha(left.fecha)?.getTime() ?? 0;
    const rightTime = parseAnalyticsFecha(right.fecha)?.getTime() ?? 0;
    return leftTime - rightTime || left.sesionId.localeCompare(right.sesionId);
  });
}

function computeAlcance(evidencias: PieAnalyticsEvidencia[], apoyosActivos: number, totalApoyos: number) {
  const fechas = evidencias
    .map((item) => parseAnalyticsFecha(item.fecha))
    .filter((item): item is Date => item !== null);

  const diasSeguimiento =
    fechas.length >= 2
      ? diffDias(
          startOfDay(fechas[0]),
          startOfDay(fechas[fechas.length - 1])
        )
      : null;

  return {
    totalEvidencias: evidencias.length,
    totalApoyos,
    apoyosActivos,
    semanasConEvidencia: countSemanasUnicas(fechas),
    diasSeguimiento,
  };
}

export function aggregateObjetivoAnalytics(
  input: PieAnalyticsObjetivoInput,
  referencia = new Date()
): ObjetivoPIEAnalytics {
  const evidencias = sortEvidenciasAsc(input.evidencias);
  const apoyosActivos = input.apoyos.filter((apoyo) => apoyo.activo).length;

  const fortalezas = computeMetricasFortalezas(evidencias);
  const estados = computeEvolucionEstados(evidencias);
  const impacto = computeMetricasImpacto(evidencias, referencia);
  const apoyos = computeMetricasApoyos(input.apoyos, evidencias, referencia);

  const analyticsBase: ObjetivoPIEAnalytics = {
    objetivoId: input.objetivoId,
    estudianteId: input.estudianteId,
    nombre: input.nombre,
    dimensionRelacionada: input.dimensionRelacionada,
    generadoEn: referencia.toISOString(),
    alcance: computeAlcance(evidencias, apoyosActivos, input.apoyos.length),
    lineaBase: {
      descripcion: input.lineaBase?.trim() || null,
      fecha: input.fechaLineaBase?.trim() || null,
    },
    metaLogro: input.metaLogro?.trim() || null,
    barreraDetectada: input.barreraDetectada?.trim() || null,
    fortalezas,
    estados,
    impacto,
    apoyos,
    indicadores: [],
  };

  return {
    ...analyticsBase,
    indicadores: computeIndicadoresAnaliticos(analyticsBase),
  };
}

export function aggregateEstudianteAnalytics(
  input: PieAnalyticsEstudianteInput,
  referencia = new Date()
): EstudiantePIEAnalytics {
  const objetivos = input.objetivos.map((objetivo) =>
    aggregateObjetivoAnalytics(objetivo, referencia)
  );

  const impactos = objetivos
    .map((objetivo) => objetivo.impacto.promedio)
    .filter((value): value is number => value !== null);

  const impactoPromedioGlobal =
    impactos.length > 0
      ? Math.round(
          (impactos.reduce((sum, value) => sum + value, 0) / impactos.length) * 10
        ) / 10
      : null;

  const fortalezasMap = new Map<
    string,
    { frecuencia: number; deltaSum: number; deltaCount: number }
  >();

  for (const objetivo of objetivos) {
    for (const fortaleza of objetivo.fortalezas.masFrecuentes) {
      const current = fortalezasMap.get(fortaleza.nombre) ?? {
        frecuencia: 0,
        deltaSum: 0,
        deltaCount: 0,
      };
      current.frecuencia += fortaleza.frecuencia;
      if (fortaleza.deltaImpacto !== null) {
        current.deltaSum += fortaleza.deltaImpacto;
        current.deltaCount += 1;
      }
      fortalezasMap.set(fortaleza.nombre, current);
    }
  }

  const fortalezasTransversales = [...fortalezasMap.entries()]
    .map(([nombre, data]) => ({
      nombre,
      frecuencia: data.frecuencia,
      impactoPromedioAsociado: null,
      sesionesConFortaleza: data.frecuencia,
      deltaImpacto:
        data.deltaCount > 0
          ? Math.round((data.deltaSum / data.deltaCount) * 10) / 10
          : null,
      pesoAsociacion: data.frecuencia,
    }))
    .sort(
      (left, right) =>
        right.frecuencia - left.frecuencia ||
        left.nombre.localeCompare(right.nombre, "es")
    )
    .slice(0, 5);

  const categoriaScores = new Map<
    string,
    { impactoSum: number; count: number }
  >();

  for (const objetivo of objetivos) {
    for (const resumen of objetivo.apoyos.resumenPorCategoria) {
      const current = categoriaScores.get(resumen.categoria) ?? {
        impactoSum: 0,
        count: 0,
      };
      current.impactoSum += resumen.impactoPromedio;
      current.count += 1;
      categoriaScores.set(resumen.categoria, current);
    }
  }

  const categoriaApoyoMasEfectiva =
    [...categoriaScores.entries()]
      .map(([categoria, data]) => ({
        categoria: categoria as EstudiantePIEAnalytics["consolidado"]["categoriaApoyoMasEfectiva"],
        promedio: data.impactoSum / data.count,
      }))
      .sort((left, right) => right.promedio - left.promedio)[0]?.categoria ?? null;

  return {
    estudianteId: input.estudianteId,
    generadoEn: referencia.toISOString(),
    totalObjetivos: objetivos.length,
    objetivos,
    consolidado: {
      impactoPromedioGlobal,
      fortalezasTransversales,
      categoriaApoyoMasEfectiva,
      objetivosConMejoraSostenida: objetivos.filter(
        (objetivo) => objetivo.impacto.tendencia8Semanas.mejoraSostenida
      ).length,
    },
  };
}
