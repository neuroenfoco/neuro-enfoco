import { TOP_OBJETIVOS_TRABAJADOS } from "@/lib/intervenciones-analytics/constants";
import type {
  IntervencionesAnalyticsIntervencion,
  ObjetivoTrabajadoRanking,
} from "@/lib/intervenciones-analytics/types";

export function computeObjetivosMasTrabajados(
  intervenciones: IntervencionesAnalyticsIntervencion[],
  limit = TOP_OBJETIVOS_TRABAJADOS
): ObjetivoTrabajadoRanking[] {
  const map = new Map<
    string,
    {
      nombre: string;
      dimensionRelacionada?: string;
      totalIntervenciones: number;
      totalDuracionMinutos: number;
      estudiantes: Set<string>;
      profesionales: Set<string>;
    }
  >();

  for (const intervencion of intervenciones) {
    for (const objetivo of intervencion.objetivosRelacionados) {
      const current = map.get(objetivo.objetivoId) ?? {
        nombre: objetivo.nombre ?? objetivo.objetivoId,
        dimensionRelacionada: objetivo.dimensionRelacionada,
        totalIntervenciones: 0,
        totalDuracionMinutos: 0,
        estudiantes: new Set<string>(),
        profesionales: new Set<string>(),
      };

      current.totalIntervenciones += 1;
      current.totalDuracionMinutos += intervencion.duracionMinutos;
      current.estudiantes.add(intervencion.estudianteId);
      current.profesionales.add(intervencion.profesionalId);

      if (objetivo.nombre) current.nombre = objetivo.nombre;
      if (objetivo.dimensionRelacionada) {
        current.dimensionRelacionada = objetivo.dimensionRelacionada;
      }

      map.set(objetivo.objetivoId, current);
    }
  }

  return [...map.entries()]
    .map(([objetivoId, data]) => ({
      objetivoId,
      nombre: data.nombre,
      dimensionRelacionada: data.dimensionRelacionada,
      totalIntervenciones: data.totalIntervenciones,
      totalDuracionMinutos: data.totalDuracionMinutos,
      estudiantesDistintos: data.estudiantes.size,
      profesionalesDistintos: data.profesionales.size,
    }))
    .sort(
      (left, right) =>
        right.totalIntervenciones - left.totalIntervenciones ||
        right.totalDuracionMinutos - left.totalDuracionMinutos ||
        left.nombre.localeCompare(right.nombre, "es")
    )
    .slice(0, limit);
}
