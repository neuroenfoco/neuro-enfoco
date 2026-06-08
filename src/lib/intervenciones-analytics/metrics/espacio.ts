import { porcentaje } from "@/lib/intervenciones-analytics/date-utils";
import type {
  DistribucionEspacioAnalytics,
  IntervencionesAnalyticsIntervencion,
} from "@/lib/intervenciones-analytics/types";

const SIN_ESPACIO_KEY = "__sin_espacio__";

export function computeDistribucionPorEspacio(
  intervenciones: IntervencionesAnalyticsIntervencion[]
): DistribucionEspacioAnalytics {
  const total = intervenciones.length;
  const map = new Map<
    string,
    {
      espacioId: string | null;
      espacioNombre: string;
      tipoEspacio?: IntervencionesAnalyticsIntervencion["tipoEspacio"];
      totalIntervenciones: number;
      totalDuracionMinutos: number;
    }
  >();

  for (const intervencion of intervenciones) {
    const key = intervencion.espacioId ?? SIN_ESPACIO_KEY;
    const current = map.get(key) ?? {
      espacioId: intervencion.espacioId ?? null,
      espacioNombre:
        intervencion.espacioNombre ??
        (intervencion.espacioId ? intervencion.espacioId : "Sin espacio registrado"),
      tipoEspacio: intervencion.tipoEspacio,
      totalIntervenciones: 0,
      totalDuracionMinutos: 0,
    };

    current.totalIntervenciones += 1;
    current.totalDuracionMinutos += intervencion.duracionMinutos;
    map.set(key, current);
  }

  const items = [...map.values()]
    .map((item) => ({
      ...item,
      porcentaje: porcentaje(item.totalIntervenciones, total),
    }))
    .sort(
      (left, right) =>
        right.totalIntervenciones - left.totalIntervenciones ||
        left.espacioNombre.localeCompare(right.espacioNombre, "es")
    );

  const sinEspacio =
    map.get(SIN_ESPACIO_KEY)?.totalIntervenciones ?? 0;

  return {
    totalConEspacio: total - sinEspacio,
    totalSinEspacio: sinEspacio,
    items,
  };
}
