import { isTipoEspacioId } from "@/lib/espacios-catalog";
import { isTipoIntervencionId } from "@/lib/intervenciones-catalog";
import type {
  IntervencionesAnalyticsFiltros,
  IntervencionesAnalyticsInput,
  IntervencionesAnalyticsIntervencion,
  IntervencionesAnalyticsObjetivoRef,
} from "@/lib/intervenciones-analytics/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isObjetivoRef(value: unknown): value is IntervencionesAnalyticsObjetivoRef {
  if (!isRecord(value)) return false;
  return (
    typeof value.objetivoId === "string" &&
    (typeof value.nombre === "string" || value.nombre === undefined) &&
    (typeof value.dimensionRelacionada === "string" ||
      value.dimensionRelacionada === undefined)
  );
}

function isIntervencionAnalytics(
  value: unknown
): value is IntervencionesAnalyticsIntervencion {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.estudianteId === "string" &&
    (typeof value.estudianteNombre === "string" ||
      value.estudianteNombre === undefined) &&
    typeof value.profesionalId === "string" &&
    (typeof value.profesionalNombre === "string" ||
      value.profesionalNombre === undefined) &&
    typeof value.fecha === "string" &&
    typeof value.tipoIntervencion === "string" &&
    isTipoIntervencionId(value.tipoIntervencion) &&
    (typeof value.espacioId === "string" || value.espacioId === undefined) &&
    (typeof value.espacioNombre === "string" ||
      value.espacioNombre === undefined) &&
    (typeof value.tipoEspacio === "string"
      ? isTipoEspacioId(value.tipoEspacio)
      : value.tipoEspacio === undefined) &&
    typeof value.duracionMinutos === "number" &&
    Array.isArray(value.objetivosRelacionados) &&
    value.objetivosRelacionados.every(isObjetivoRef) &&
    typeof value.cantidadEvidencias === "number"
  );
}

function isFiltros(value: unknown): value is IntervencionesAnalyticsFiltros {
  if (!isRecord(value)) return false;

  return (
    (typeof value.estudianteId === "string" ||
      value.estudianteId === undefined) &&
    (typeof value.profesionalId === "string" ||
      value.profesionalId === undefined) &&
    (typeof value.tipoIntervencionId === "string"
      ? isTipoIntervencionId(value.tipoIntervencionId)
      : value.tipoIntervencionId === undefined) &&
    (typeof value.espacioId === "string" || value.espacioId === undefined) &&
    (typeof value.tipoEspacio === "string"
      ? isTipoEspacioId(value.tipoEspacio)
      : value.tipoEspacio === undefined) &&
    (typeof value.fechaDesde === "string" || value.fechaDesde === undefined) &&
    (typeof value.fechaHasta === "string" || value.fechaHasta === undefined)
  );
}

export function isIntervencionesAnalyticsInput(
  value: unknown
): value is IntervencionesAnalyticsInput {
  if (!isRecord(value)) return false;

  const alcance = value.alcance;
  const alcanceValido =
    alcance === "institucional" ||
    alcance === "estudiante" ||
    alcance === "profesional";

  return (
    alcanceValido &&
    (value.filtros === undefined || isFiltros(value.filtros)) &&
    Array.isArray(value.intervenciones) &&
    value.intervenciones.every(isIntervencionAnalytics) &&
    (typeof value.referencia === "string" || value.referencia === undefined) &&
    (typeof value.ventanaSemanas === "number" ||
      value.ventanaSemanas === undefined)
  );
}
