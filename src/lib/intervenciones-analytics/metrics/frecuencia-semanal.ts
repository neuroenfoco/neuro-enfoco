import { VENTANA_FRECUENCIA_SEMANAL_DEFAULT } from "@/lib/intervenciones-analytics/constants";
import {
  formatSemanaEtiqueta,
  parseIntervencionFecha,
  promedio,
  startOfDay,
  startOfWeek,
  subtractSemanas,
} from "@/lib/intervenciones-analytics/date-utils";
import type {
  FrecuenciaSemanalAnalytics,
  IntervencionesAnalyticsIntervencion,
} from "@/lib/intervenciones-analytics/types";

export function computeFrecuenciaSemanal(
  intervenciones: IntervencionesAnalyticsIntervencion[],
  ventanaSemanas = VENTANA_FRECUENCIA_SEMANAL_DEFAULT,
  referencia = new Date()
): FrecuenciaSemanalAnalytics {
  const hoy = startOfDay(referencia);
  const inicioVentana = subtractSemanas(startOfWeek(hoy), ventanaSemanas - 1);

  const semanas = new Map<
    string,
    {
      semanaInicio: Date;
      totalIntervenciones: number;
      totalDuracionMinutos: number;
    }
  >();

  for (let index = 0; index < ventanaSemanas; index += 1) {
    const semanaInicio = subtractSemanas(startOfWeek(hoy), ventanaSemanas - 1 - index);
    const key = semanaInicio.toISOString();
    semanas.set(key, {
      semanaInicio,
      totalIntervenciones: 0,
      totalDuracionMinutos: 0,
    });
  }

  for (const intervencion of intervenciones) {
    const fecha = parseIntervencionFecha(intervencion.fecha);
    if (!fecha) continue;

    const semana = startOfWeek(fecha);
    if (semana < inicioVentana || semana > hoy) continue;

    const key = semana.toISOString();
    const bucket = semanas.get(key);
    if (!bucket) continue;

    bucket.totalIntervenciones += 1;
    bucket.totalDuracionMinutos += intervencion.duracionMinutos;
  }

  const serieSemanal = [...semanas.values()]
    .sort((left, right) => left.semanaInicio.getTime() - right.semanaInicio.getTime())
    .map((item) => ({
      semanaInicio: item.semanaInicio.toISOString(),
      semanaEtiqueta: formatSemanaEtiqueta(item.semanaInicio),
      totalIntervenciones: item.totalIntervenciones,
      totalDuracionMinutos: item.totalDuracionMinutos,
    }));

  const semanasConIntervencion = serieSemanal.filter(
    (item) => item.totalIntervenciones > 0
  ).length;

  const totalIntervencionesVentana = serieSemanal.reduce(
    (sum, item) => sum + item.totalIntervenciones,
    0
  );
  const totalDuracionVentana = serieSemanal.reduce(
    (sum, item) => sum + item.totalDuracionMinutos,
    0
  );

  return {
    ventanaSemanas,
    semanasConIntervencion,
    promedioIntervencionesPorSemana: promedio(
      semanasConIntervencion > 0
        ? [totalIntervencionesVentana / ventanaSemanas]
        : []
    ),
    promedioDuracionMinutosPorSemana: promedio(
      semanasConIntervencion > 0
        ? [totalDuracionVentana / ventanaSemanas]
        : []
    ),
    serieSemanal,
  };
}
