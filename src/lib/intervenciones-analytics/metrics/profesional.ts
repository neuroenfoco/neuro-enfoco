import { promedio } from "@/lib/intervenciones-analytics/date-utils";
import type {
  IntervencionPorProfesional,
  IntervencionesAnalyticsIntervencion,
} from "@/lib/intervenciones-analytics/types";

export function computeIntervencionesPorProfesional(
  intervenciones: IntervencionesAnalyticsIntervencion[]
): IntervencionPorProfesional[] {
  const map = new Map<
    string,
    {
      profesionalNombre: string;
      totalIntervenciones: number;
      totalDuracionMinutos: number;
      totalEvidencias: number;
      estudiantes: Set<string>;
      tipos: Set<string>;
      espacios: Set<string>;
    }
  >();

  for (const item of intervenciones) {
    const current = map.get(item.profesionalId) ?? {
      profesionalNombre: item.profesionalNombre ?? item.profesionalId,
      totalIntervenciones: 0,
      totalDuracionMinutos: 0,
      totalEvidencias: 0,
      estudiantes: new Set<string>(),
      tipos: new Set<string>(),
      espacios: new Set<string>(),
    };

    current.totalIntervenciones += 1;
    current.totalDuracionMinutos += item.duracionMinutos;
    current.totalEvidencias += item.cantidadEvidencias;
    current.estudiantes.add(item.estudianteId);
    current.tipos.add(item.tipoIntervencion);
    if (item.espacioId) current.espacios.add(item.espacioId);

    map.set(item.profesionalId, current);
  }

  return [...map.entries()]
    .map(([profesionalId, data]) => ({
      profesionalId,
      profesionalNombre: data.profesionalNombre,
      totalIntervenciones: data.totalIntervenciones,
      totalDuracionMinutos: data.totalDuracionMinutos,
      promedioDuracionMinutos:
        data.totalIntervenciones > 0
          ? promedio([
              data.totalDuracionMinutos / data.totalIntervenciones,
            ])
          : null,
      totalEvidencias: data.totalEvidencias,
      estudiantesDistintos: data.estudiantes.size,
      tiposDistintos: data.tipos.size,
      espaciosDistintos: data.espacios.size,
    }))
    .sort(
      (left, right) =>
        right.totalIntervenciones - left.totalIntervenciones ||
        left.profesionalNombre.localeCompare(right.profesionalNombre, "es")
    );
}
