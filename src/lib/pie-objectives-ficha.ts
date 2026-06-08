import { GLOSSARY } from "@/lib/copy/glossary";
import { buildPieAnalyticsObjetivoInput } from "@/lib/pie-analytics/data-source";
import { getObjetivoPieAnalytics } from "@/lib/pie-analytics/endpoints";
import type { InsightCandidate } from "@/lib/pie-analytics/types";
import {
  getBarreraDetectadaDisplay,
  getFechaLineaBaseDisplay,
  getLineaBaseDisplay,
  getMetaLogroDisplay,
  getObjetivoPIEDetalle,
  getObjetivosPIEByEstudianteId,
  type ObjetivoPIEDetalle,
} from "@/lib/pie-objectives-storage";

export type ObjetivoPIEFichaItem = {
  detalle: ObjetivoPIEDetalle;
  insights: InsightCandidate[];
  insightsListos: InsightCandidate[];
  indicadoresListos: number;
};

export type EstudianteObjetivosFicha = {
  estudianteId: string;
  totalObjetivos: number;
  totalEvidencias: number;
  totalApoyosActivos: number;
  totalApoyosHistoricos: number;
  impactoPromedioGeneral: number | null;
  objetivos: ObjetivoPIEFichaItem[];
  insightsConsolidados: InsightCandidate[];
};

const INSIGHT_LABELS: Record<InsightCandidate["templateId"], string> = {
  apoyo_mayor_avance: "Apoyos y avance",
  fortalezas_asociadas_progreso: "Fortalezas y progreso",
  mejora_sostenida_temporal: "Mejora sostenida",
  evolucion_estados_positiva: "Evolución emocional",
};

export function getInsightTemplateLabel(templateId: InsightCandidate["templateId"]): string {
  return INSIGHT_LABELS[templateId] ?? templateId;
}

export function formatInsightResumen(insight: InsightCandidate): string {
  if (!insight.listo) {
    return GLOSSARY.insights.sinDatos;
  }

  switch (insight.templateId) {
    case "apoyo_mayor_avance":
      if (typeof insight.variables.categoriaApoyo === "string") {
        return `Mayores avances asociados a ${insight.variables.categoriaApoyo}.`;
      }
      if (typeof insight.variables.apoyoNombre === "string") {
        return `Mayor avance observado con el apoyo «${insight.variables.apoyoNombre}».`;
      }
      return "Se identifican apoyos asociados a mayor avance.";
    case "fortalezas_asociadas_progreso":
      if (typeof insight.variables.fortalezas === "string" && insight.variables.fortalezas) {
        return `Fortalezas más asociadas al progreso: ${insight.variables.fortalezas}.`;
      }
      return "Hay fortalezas asociadas al progreso del objetivo.";
    case "mejora_sostenida_temporal":
      return `Evidencias de mejora sostenida en las últimas ${insight.variables.ventanaSemanas ?? 8} semanas.`;
    case "evolucion_estados_positiva":
      return GLOSSARY.insights.estadosFinales;
    default:
      return "Conclusión pedagógica disponible.";
  }
}

export function getEstudianteObjetivosFicha(
  estudianteId: string
): EstudianteObjetivosFicha {
  const objetivosIds = getObjetivosPIEByEstudianteId(estudianteId);
  const objetivos: ObjetivoPIEFichaItem[] = [];
  const insightsConsolidados: InsightCandidate[] = [];

  let totalEvidencias = 0;
  let totalApoyosActivos = 0;
  let totalApoyosHistoricos = 0;
  let impactoSum = 0;
  let impactoCount = 0;

  for (const objetivo of objetivosIds) {
    const detalle = getObjetivoPIEDetalle(objetivo.id);
    if (!detalle) continue;

    const input = buildPieAnalyticsObjetivoInput(objetivo.id);
    const analyticsResponse = input ? getObjetivoPieAnalytics(input) : null;
    const insights = analyticsResponse?.insights ?? [];
    const insightsListos = insights.filter((item) => item.listo);

    objetivos.push({
      detalle,
      insights,
      insightsListos,
      indicadoresListos:
        analyticsResponse?.analytics.indicadores.filter((item) => item.listo)
          .length ?? 0,
    });

    insightsConsolidados.push(...insightsListos);

    totalEvidencias += detalle.resumen.cantidadEvidencias;
    totalApoyosActivos += detalle.apoyos.activos.length;
    totalApoyosHistoricos += detalle.apoyos.historico.length;

    if (detalle.resumen.cantidadEvidencias > 0) {
      impactoSum += detalle.resumen.impactoPromedio;
      impactoCount += 1;
    }
  }

  return {
    estudianteId,
    totalObjetivos: objetivos.length,
    totalEvidencias,
    totalApoyosActivos,
    totalApoyosHistoricos,
    impactoPromedioGeneral:
      impactoCount > 0
        ? Math.round((impactoSum / impactoCount) * 10) / 10
        : null,
    objetivos,
    insightsConsolidados,
  };
}

export function getObjetivoPedagogiaDisplay(objetivo: ObjetivoPIEDetalle["resumen"]["objetivo"]) {
  return {
    barrera: getBarreraDetectadaDisplay(objetivo),
    lineaBase: getLineaBaseDisplay(objetivo),
    fechaLineaBase: getFechaLineaBaseDisplay(objetivo),
    metaLogro: getMetaLogroDisplay(objetivo),
  };
}
