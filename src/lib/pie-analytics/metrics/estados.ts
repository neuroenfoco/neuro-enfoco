import {
  getEstadoEmocionalValor,
  normalizeEmotionalStateLabel,
} from "@/lib/copy/emotional-states";
import type {
  EvidenciaResumen,
  EvolucionEstados,
  PieAnalyticsEvidencia,
} from "@/lib/pie-analytics/types";

export { getEstadoEmocionalValor } from "@/lib/copy/emotional-states";

function toEvidenciaResumen(evidencia: PieAnalyticsEvidencia): EvidenciaResumen {
  return {
    sesionId: evidencia.sesionId,
    fecha: evidencia.fecha,
    estadoInicial: {
      label: normalizeEmotionalStateLabel(evidencia.estadoInicial),
      valor: getEstadoEmocionalValor(evidencia.estadoInicial),
    },
    estadoFinal: {
      label: normalizeEmotionalStateLabel(evidencia.estadoFinal),
      valor: getEstadoEmocionalValor(evidencia.estadoFinal),
    },
    impacto: evidencia.impacto,
  };
}

function promedio(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

export function computeEvolucionEstados(
  evidencias: PieAnalyticsEvidencia[]
): EvolucionEstados {
  if (evidencias.length === 0) {
    return {
      estadoInicialPromedio: null,
      estadoFinalPromedio: null,
      deltaEmocionalPromedio: null,
      primeraEvidencia: null,
      ultimaEvidencia: null,
    };
  }

  const resumenes = evidencias.map(toEvidenciaResumen);

  return {
    estadoInicialPromedio: promedio(
      resumenes.map((item) => item.estadoInicial.valor)
    ),
    estadoFinalPromedio: promedio(
      resumenes.map((item) => item.estadoFinal.valor)
    ),
    deltaEmocionalPromedio: promedio(resumenes.map((item) => item.impacto)),
    primeraEvidencia: resumenes[0],
    ultimaEvidencia: resumenes[resumenes.length - 1],
  };
}
