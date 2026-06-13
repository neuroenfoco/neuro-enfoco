import {
  ANALYTICS_MIN_EVIDENCIAS_APOYO,
  ANALYTICS_MIN_EVIDENCIAS_ESTADOS,
  ANALYTICS_MIN_EVIDENCIAS_FORTALEZA,
  ANALYTICS_MIN_EVIDENCIAS_TENDENCIA,
  VENTANA_TENDENCIA_8_SEMANAS,
} from "@/lib/pie-analytics/constants";
import type {
  ConfianzaAnalitica,
  IndicadorAnalitico,
  ObjetivoPIEAnalytics,
} from "@/lib/pie-analytics/types";

function resolverConfianza(
  datosActuales: number,
  datosMinimos: number
): ConfianzaAnalitica {
  if (datosActuales < datosMinimos) return "baja";
  if (datosActuales >= datosMinimos * 2) return "alta";
  return "media";
}

export function computeIndicadoresAnaliticos(
  analytics: Pick<
    ObjetivoPIEAnalytics,
    "alcance" | "fortalezas" | "impacto" | "apoyos" | "estados" | "lineaBase"
  >
): IndicadorAnalitico[] {
  const tendencia = analytics.impacto.tendencia8Semanas;

  return [
    {
      tipo: "apoyo_efectividad",
      listo:
        analytics.apoyos.rankingPorImpacto.length > 0 &&
        analytics.alcance.totalApoyos > 0,
      confianza: resolverConfianza(
        analytics.apoyos.rankingPorImpacto[0]?.evidencias ?? 0,
        ANALYTICS_MIN_EVIDENCIAS_APOYO
      ),
      datosMinimos: ANALYTICS_MIN_EVIDENCIAS_APOYO,
      datosActuales: analytics.apoyos.rankingPorImpacto[0]?.evidencias ?? 0,
      descripcion:
        "Permite comparar impacto promedio por apoyo y categoría de apoyo.",
    },
    {
      tipo: "fortaleza_progreso",
      listo: analytics.fortalezas.asociadasAProgreso.length > 0,
      confianza: resolverConfianza(
        analytics.fortalezas.asociadasAProgreso[0]?.sesionesConFortaleza ?? 0,
        ANALYTICS_MIN_EVIDENCIAS_FORTALEZA
      ),
      datosMinimos: ANALYTICS_MIN_EVIDENCIAS_FORTALEZA,
      datosActuales:
        analytics.fortalezas.asociadasAProgreso[0]?.sesionesConFortaleza ?? 0,
      descripcion:
        "Permite identificar fortalezas con mayor delta de impacto respecto al promedio.",
    },
    {
      tipo: "mejora_sostenida",
      listo:
        tendencia.mejoraSostenida &&
        tendencia.sesionesEnVentana >= ANALYTICS_MIN_EVIDENCIAS_TENDENCIA,
      confianza: resolverConfianza(
        tendencia.sesionesEnVentana,
        ANALYTICS_MIN_EVIDENCIAS_TENDENCIA
      ),
      datosMinimos: ANALYTICS_MIN_EVIDENCIAS_TENDENCIA,
      datosActuales: tendencia.sesionesEnVentana,
      descripcion: `Evalúa tendencia de impacto en ventana de ${VENTANA_TENDENCIA_8_SEMANAS} semanas.`,
    },
    {
      tipo: "evolucion_estados",
      listo:
        analytics.alcance.totalEvidencias >= ANALYTICS_MIN_EVIDENCIAS_ESTADOS &&
        analytics.estados.deltaEmocionalPromedio !== null,
      confianza: resolverConfianza(
        analytics.alcance.totalEvidencias,
        ANALYTICS_MIN_EVIDENCIAS_ESTADOS
      ),
      datosMinimos: ANALYTICS_MIN_EVIDENCIAS_ESTADOS,
      datosActuales: analytics.alcance.totalEvidencias,
      descripcion:
        "Compara estados iniciales y finales promedio a lo largo del seguimiento.",
    },
    {
      tipo: "linea_base_comparativa",
      listo:
        Boolean(analytics.lineaBase.descripcion) &&
        analytics.alcance.totalEvidencias >= ANALYTICS_MIN_EVIDENCIAS_ESTADOS,
      confianza: resolverConfianza(
        analytics.alcance.totalEvidencias,
        ANALYTICS_MIN_EVIDENCIAS_ESTADOS
      ),
      datosMinimos: ANALYTICS_MIN_EVIDENCIAS_ESTADOS,
      datosActuales: analytics.alcance.totalEvidencias,
      descripcion:
        "Prepara comparación entre línea base declarada y evidencias registradas.",
    },
  ];
}
