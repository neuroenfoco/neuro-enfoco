import { getEvidenciasPorObjetivoId } from "@/lib/evidencias-por-objetivo";
import { getIntervencionesByObjetivoId } from "@/lib/intervenciones-storage";
import {
  parseFechaOrdenInstitucional,
  startOfTodayMs,
  diasDesdeInstitucional,
} from "@/lib/shared/fecha-institucional";
import {
  getObjetivoPIEById,
  getObjetivosPIEByEstudianteId,
  type ObjetivoPIE,
} from "@/lib/pie-objectives-storage";
import type { Sesion } from "@/lib/sessions-storage";

export type EstadoSeguimientoObjetivo =
  | "sin_seguimiento"
  | "activo"
  | "atencion"
  | "riesgo";

export type ObjetivoSeguimiento = {
  objetivoId: string;
  objetivoNombre: string;
  cantidadIntervenciones: number;
  cantidadEvidencias: number;
  ultimaActividad: string | null;
  ultimaActividadLabel: string | null;
  diasSinActividad: number | null;
  estadoSeguimiento: EstadoSeguimientoObjetivo;
};

export type EstudianteSeguimientoResumen = {
  objetivosActivos: number;
  objetivosConSeguimiento: number;
  objetivosSeguimientoActivo: number;
  objetivosEnAtencion: number;
  objetivosEnRiesgo: number;
  objetivosSinSeguimiento: number;
};

function formatUltimaActividadLabel(timestamp: number): string {
  const diffDays = diasDesdeInstitucional(timestamp, startOfTodayMs());

  if (diffDays <= 0) return "Hoy";
  if (diffDays === 1) return "Hace 1 día";
  return `Hace ${diffDays} días`;
}

function formatUltimaActividadIso(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

function resolverUltimaActividad(
  intervenciones: ReturnType<typeof getIntervencionesByObjetivoId>,
  evidencias: Sesion[]
): { timestamp: number | null; label: string | null; iso: string | null } {
  let maxTimestamp = 0;

  for (const intervencion of intervenciones) {
    const orden = parseFechaOrdenInstitucional(intervencion.fecha);
    if (orden > maxTimestamp) {
      maxTimestamp = orden;
    }
  }

  for (const sesion of evidencias) {
    const orden = parseFechaOrdenInstitucional(sesion.fecha);
    if (orden > maxTimestamp) {
      maxTimestamp = orden;
    }
  }

  if (maxTimestamp === 0) {
    return { timestamp: null, label: null, iso: null };
  }

  return {
    timestamp: maxTimestamp,
    label: formatUltimaActividadLabel(maxTimestamp),
    iso: formatUltimaActividadIso(maxTimestamp),
  };
}

export function resolverEstadoSeguimiento(
  cantidadIntervenciones: number,
  diasSinActividad: number | null
): EstadoSeguimientoObjetivo {
  if (cantidadIntervenciones === 0) {
    return "sin_seguimiento";
  }

  if (diasSinActividad === null) {
    return "sin_seguimiento";
  }

  if (diasSinActividad <= 30) return "activo";
  if (diasSinActividad <= 60) return "atencion";
  return "riesgo";
}

export function buildObjetivoSeguimiento(objetivo: ObjetivoPIE): ObjetivoSeguimiento {
  const intervenciones = getIntervencionesByObjetivoId(objetivo.id);
  const evidencias = getEvidenciasPorObjetivoId(objetivo.id);
  const ultima = resolverUltimaActividad(intervenciones, evidencias);
  const diasSinActividad =
    ultima.timestamp !== null
      ? diasDesdeInstitucional(ultima.timestamp, startOfTodayMs())
      : null;

  return {
    objetivoId: objetivo.id,
    objetivoNombre: objetivo.nombre,
    cantidadIntervenciones: intervenciones.length,
    cantidadEvidencias: evidencias.length,
    ultimaActividad: ultima.iso,
    ultimaActividadLabel: ultima.label,
    diasSinActividad,
    estadoSeguimiento: resolverEstadoSeguimiento(
      intervenciones.length,
      diasSinActividad
    ),
  };
}

export function buildEstudianteSeguimientoResumen(
  items: ObjetivoSeguimiento[]
): EstudianteSeguimientoResumen {
  return {
    objetivosActivos: items.length,
    objetivosConSeguimiento: items.filter(
      (item) => item.estadoSeguimiento !== "sin_seguimiento"
    ).length,
    objetivosSeguimientoActivo: items.filter(
      (item) => item.estadoSeguimiento === "activo"
    ).length,
    objetivosEnAtencion: items.filter(
      (item) => item.estadoSeguimiento === "atencion"
    ).length,
    objetivosEnRiesgo: items.filter((item) => item.estadoSeguimiento === "riesgo")
      .length,
    objetivosSinSeguimiento: items.filter(
      (item) => item.estadoSeguimiento === "sin_seguimiento"
    ).length,
  };
}

export function getObjetivoSeguimiento(objetivoId: string): ObjetivoSeguimiento | null {
  const objetivo = getObjetivoPIEById(objetivoId);
  if (!objetivo) return null;
  return buildObjetivoSeguimiento(objetivo);
}

export function getEstudianteObjetivosSeguimiento(
  estudianteId: string
): ObjetivoSeguimiento[] {
  return getObjetivosPIEByEstudianteId(estudianteId)
    .map((objetivo) => buildObjetivoSeguimiento(objetivo))
    .sort((a, b) => a.objetivoNombre.localeCompare(b.objetivoNombre, "es"));
}

export function getEstudianteSeguimientoResumen(
  estudianteId: string
): EstudianteSeguimientoResumen {
  return buildEstudianteSeguimientoResumen(
    getEstudianteObjetivosSeguimiento(estudianteId)
  );
}
