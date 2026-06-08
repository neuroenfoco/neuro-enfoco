import { CATEGORIA_APOYO_LABELS } from "@/lib/pie-analytics/apoyo-categories";
import { VENTANA_TENDENCIA_8_SEMANAS } from "@/lib/pie-analytics/constants";
import type {
  EstudiantePIEAnalytics,
  InsightCandidate,
  ObjetivoPIEAnalytics,
} from "@/lib/pie-analytics/types";

function formatFortalezasList(fortalezas: { nombre: string }[]): string {
  if (fortalezas.length === 0) return "";
  if (fortalezas.length === 1) return fortalezas[0].nombre.toLowerCase();
  if (fortalezas.length === 2) {
    return `${fortalezas[0].nombre.toLowerCase()} y ${fortalezas[1].nombre.toLowerCase()}`;
  }
  const head = fortalezas
    .slice(0, -1)
    .map((item) => item.nombre.toLowerCase())
    .join(", ");
  return `${head} y ${fortalezas[fortalezas.length - 1].nombre.toLowerCase()}`;
}

export function buildInsightCandidates(
  analytics: ObjetivoPIEAnalytics
): InsightCandidate[] {
  const insights: InsightCandidate[] = [];

  const mejorApoyo = analytics.apoyos.rankingPorImpacto[0];
  const mejorCategoria = analytics.apoyos.categoriaMasEfectiva;

  if (mejorApoyo && (mejorApoyo.deltaImpactoVsGlobal ?? 0) > 0) {
    insights.push({
      templateId: "apoyo_mayor_avance",
      listo: true,
      confianza:
        mejorApoyo.evidencias >= 4
          ? "alta"
          : mejorApoyo.evidencias >= 2
            ? "media"
            : "baja",
      variables: {
        apoyoNombre: mejorApoyo.nombre,
        categoriaApoyo: CATEGORIA_APOYO_LABELS[mejorApoyo.categoria],
        impactoPromedio: mejorApoyo.impactoPromedio,
        evidencias: mejorApoyo.evidencias,
        deltaImpacto: mejorApoyo.deltaImpactoVsGlobal ?? 0,
      },
    });
  } else if (mejorCategoria && analytics.apoyos.resumenPorCategoria.length > 0) {
    const resumen = analytics.apoyos.resumenPorCategoria[0];
    insights.push({
      templateId: "apoyo_mayor_avance",
      listo: resumen.evidencias >= 2,
      confianza: resumen.evidencias >= 4 ? "alta" : "media",
      variables: {
        categoriaApoyo: CATEGORIA_APOYO_LABELS[resumen.categoria],
        impactoPromedio: resumen.impactoPromedio,
        evidencias: resumen.evidencias,
        apoyosDistintos: resumen.apoyosDistintos,
      },
    });
  } else {
    insights.push({
      templateId: "apoyo_mayor_avance",
      listo: false,
      confianza: "baja",
      variables: {
        evidenciasRequeridas: 2,
        evidenciasActuales: mejorApoyo?.evidencias ?? 0,
      },
    });
  }

  const fortalezasProgreso = analytics.fortalezas.asociadasAProgreso.slice(0, 3);
  insights.push({
    templateId: "fortalezas_asociadas_progreso",
    listo: fortalezasProgreso.length > 0,
    confianza:
      fortalezasProgreso[0]?.sesionesConFortaleza >= 4
        ? "alta"
        : fortalezasProgreso.length > 0
          ? "media"
          : "baja",
    variables: {
      fortalezas: formatFortalezasList(fortalezasProgreso),
      cantidadFortalezas: fortalezasProgreso.length,
      impactoDeltaTop: fortalezasProgreso[0]?.deltaImpacto ?? 0,
    },
  });

  const tendencia = analytics.impacto.tendencia8Semanas;
  insights.push({
    templateId: "mejora_sostenida_temporal",
    listo: tendencia.mejoraSostenida,
    confianza:
      tendencia.sesionesEnVentana >= 5
        ? "alta"
        : tendencia.sesionesEnVentana >= 3
          ? "media"
          : "baja",
    variables: {
      ventanaSemanas: VENTANA_TENDENCIA_8_SEMANAS,
      sesionesEnVentana: tendencia.sesionesEnVentana,
      impactoPromedioVentana: tendencia.impactoPromedioVentana ?? 0,
      deltaImpacto: tendencia.delta ?? 0,
      direccion: tendencia.direccion,
    },
  });

  const deltaEstados = analytics.estados.deltaEmocionalPromedio;
  insights.push({
    templateId: "evolucion_estados_positiva",
    listo: deltaEstados !== null && deltaEstados > 0,
    confianza:
      analytics.alcance.totalEvidencias >= 5
        ? "alta"
        : analytics.alcance.totalEvidencias >= 2
          ? "media"
          : "baja",
    variables: {
      estadoInicialPromedio: analytics.estados.estadoInicialPromedio ?? 0,
      estadoFinalPromedio: analytics.estados.estadoFinalPromedio ?? 0,
      deltaEmocional: deltaEstados ?? 0,
      totalEvidencias: analytics.alcance.totalEvidencias,
    },
  });

  return insights;
}

export function buildEstudianteInsightCandidates(
  analytics: EstudiantePIEAnalytics
): InsightCandidate[] {
  const porObjetivo = analytics.objetivos.flatMap(buildInsightCandidates);
  const listos = porObjetivo.filter((item) => item.listo);

  if (analytics.consolidado.categoriaApoyoMasEfectiva) {
    listos.push({
      templateId: "apoyo_mayor_avance",
      listo: true,
      confianza: "media",
      variables: {
        categoriaApoyo:
          CATEGORIA_APOYO_LABELS[analytics.consolidado.categoriaApoyoMasEfectiva],
        alcance: "estudiante",
        totalObjetivos: analytics.totalObjetivos,
      },
    });
  }

  return listos;
}
