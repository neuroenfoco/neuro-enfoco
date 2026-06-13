import type {
  IntervencionPorEstudiante,
  IntervencionesAnalyticsIntervencion,
} from "@/lib/intervenciones-analytics/types";

export function computeIntervencionesPorEstudiante(
  intervenciones: IntervencionesAnalyticsIntervencion[]
): IntervencionPorEstudiante[] {
  const map = new Map<
    string,
    {
      estudianteNombre: string;
      totalIntervenciones: number;
      totalDuracionMinutos: number;
      totalEvidencias: number;
      tipos: Set<string>;
      espacios: Set<string>;
      objetivos: Set<string>;
    }
  >();

  for (const item of intervenciones) {
    const current = map.get(item.estudianteId) ?? {
      estudianteNombre: item.estudianteNombre ?? item.estudianteId,
      totalIntervenciones: 0,
      totalDuracionMinutos: 0,
      totalEvidencias: 0,
      tipos: new Set<string>(),
      espacios: new Set<string>(),
      objetivos: new Set<string>(),
    };

    current.totalIntervenciones += 1;
    current.totalDuracionMinutos += item.duracionMinutos;
    current.totalEvidencias += item.cantidadEvidencias;
    current.tipos.add(item.tipoIntervencion);
    if (item.espacioId) current.espacios.add(item.espacioId);
    for (const objetivo of item.objetivosRelacionados) {
      current.objetivos.add(objetivo.objetivoId);
    }

    map.set(item.estudianteId, current);
  }

  return [...map.entries()]
    .map(([estudianteId, data]) => ({
      estudianteId,
      estudianteNombre: data.estudianteNombre,
      totalIntervenciones: data.totalIntervenciones,
      totalDuracionMinutos: data.totalDuracionMinutos,
      promedioDuracionMinutos:
        data.totalIntervenciones > 0
          ? Math.round(
              (data.totalDuracionMinutos / data.totalIntervenciones) * 10
            ) / 10
          : null,
      totalEvidencias: data.totalEvidencias,
      tiposDistintos: data.tipos.size,
      espaciosDistintos: data.espacios.size,
      objetivosDistintos: data.objetivos.size,
    }))
    .sort(
      (left, right) =>
        right.totalIntervenciones - left.totalIntervenciones ||
        left.estudianteNombre.localeCompare(right.estudianteNombre, "es")
    );
}
