import { promedio } from "@/lib/intervenciones-analytics/date-utils";
import { applyIntervencionesAnalyticsFiltros } from "@/lib/intervenciones-analytics/filters";
import { computeMetricasDuracion } from "@/lib/intervenciones-analytics/metrics/duracion";
import { computeDistribucionPorEspacio } from "@/lib/intervenciones-analytics/metrics/espacio";
import { computeIntervencionesPorEstudiante } from "@/lib/intervenciones-analytics/metrics/estudiante";
import { computeFrecuenciaSemanal } from "@/lib/intervenciones-analytics/metrics/frecuencia-semanal";
import { computeObjetivosMasTrabajados } from "@/lib/intervenciones-analytics/metrics/objetivos";
import { computeIntervencionesPorProfesional } from "@/lib/intervenciones-analytics/metrics/profesional";
import { computeIntervencionesPorTipo } from "@/lib/intervenciones-analytics/metrics/tipo";
import { VENTANA_FRECUENCIA_SEMANAL_DEFAULT } from "@/lib/intervenciones-analytics/constants";
import type {
  IntervencionesAnalytics,
  IntervencionesAnalyticsInput,
  IntervencionesAnalyticsResumen,
} from "@/lib/intervenciones-analytics/types";

function computeResumen(
  intervenciones: IntervencionesAnalyticsInput["intervenciones"]
): IntervencionesAnalyticsResumen {
  const estudiantes = new Set<string>();
  const profesionales = new Set<string>();
  const tipos = new Set<string>();
  const espacios = new Set<string>();
  const objetivos = new Set<string>();
  let totalDuracion = 0;
  let totalEvidencias = 0;

  for (const item of intervenciones) {
    estudiantes.add(item.estudianteId);
    profesionales.add(item.profesionalId);
    tipos.add(item.tipoIntervencion);
    if (item.espacioId) espacios.add(item.espacioId);
    for (const objetivo of item.objetivosRelacionados) {
      objetivos.add(objetivo.objetivoId);
    }
    totalDuracion += item.duracionMinutos;
    totalEvidencias += item.cantidadEvidencias;
  }

  const total = intervenciones.length;

  return {
    totalIntervenciones: total,
    totalDuracionMinutos: totalDuracion,
    promedioDuracionMinutos:
      total > 0 ? promedio([totalDuracion / total]) : null,
    totalEvidencias,
    estudiantesDistintos: estudiantes.size,
    profesionalesDistintos: profesionales.size,
    tiposDistintos: tipos.size,
    espaciosDistintos: espacios.size,
    objetivosDistintos: objetivos.size,
  };
}

export function aggregateIntervencionesAnalytics(
  input: IntervencionesAnalyticsInput
): IntervencionesAnalytics {
  const referencia = input.referencia
    ? new Date(input.referencia)
    : new Date();
  const filtros = input.filtros ?? {};
  const intervenciones = applyIntervencionesAnalyticsFiltros(
    input.intervenciones,
    filtros
  );
  const ventanaSemanas =
    input.ventanaSemanas ?? VENTANA_FRECUENCIA_SEMANAL_DEFAULT;

  return {
    generadoEn: referencia.toISOString(),
    alcance: input.alcance,
    filtrosAplicados: filtros,
    resumen: computeResumen(intervenciones),
    porEstudiante: computeIntervencionesPorEstudiante(intervenciones),
    porProfesional: computeIntervencionesPorProfesional(intervenciones),
    porTipo: computeIntervencionesPorTipo(intervenciones),
    duracion: computeMetricasDuracion(intervenciones),
    frecuenciaSemanal: computeFrecuenciaSemanal(
      intervenciones,
      ventanaSemanas,
      referencia
    ),
    distribucionEspacio: computeDistribucionPorEspacio(intervenciones),
    objetivosMasTrabajados: computeObjetivosMasTrabajados(intervenciones),
  };
}
