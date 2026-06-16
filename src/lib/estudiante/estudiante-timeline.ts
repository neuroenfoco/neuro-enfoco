import { GLOSSARY } from "@/lib/copy/glossary";
import { getHistorialEvaluaciones } from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { getTipoIntervencionNombre } from "@/lib/intervenciones-catalog";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";
import type { PACI } from "@/lib/paci/paci-types";
import {
  getIntervencionesRepository,
  getPACIRepository,
  getSesionesRepository,
} from "@/lib/repositories/repository-factory";
import type { Intervencion } from "@/lib/repositories/intervenciones-repository";
import { parseFechaOrdenInstitucional } from "@/lib/shared/fecha-institucional";

export type EstudianteTimelineTipo = "evaluacion" | "intervencion" | "paci";

export type EstudianteTimelineItem = {
  id: string;
  tipo: EstudianteTimelineTipo;
  tipoLabel: string;
  fecha: string;
  fechaOrden: number;
  fechaDisplay: string;
  resumen: string;
};

export function parseFechaOrden(value: string): number {
  return parseFechaOrdenInstitucional(value);
}

function buildPACIEvents(paci: PACI): EstudianteTimelineItem[] {
  const COPY = GLOSSARY.estudiante;
  const events: EstudianteTimelineItem[] = [];

  events.push({
    id: `paci-creado-${paci.id}`,
    tipo: "paci",
    tipoLabel: COPY.timelineTipoPaci,
    fecha: paci.creadoEn,
    fechaOrden: parseFechaOrden(paci.creadoEn),
    fechaDisplay: formatMarcoFechaDisplay(paci.creadoEn),
    resumen: COPY.timelinePaciCreado(paci.periodoLabel),
  });

  if (paci.declaradoVigenteEn) {
    events.push({
      id: `paci-vigente-${paci.id}`,
      tipo: "paci",
      tipoLabel: COPY.timelineTipoPaci,
      fecha: paci.declaradoVigenteEn,
      fechaOrden: parseFechaOrden(paci.declaradoVigenteEn),
      fechaDisplay: formatMarcoFechaDisplay(paci.declaradoVigenteEn),
      resumen: COPY.timelinePaciVigente(paci.periodoLabel),
    });
  }

  if (paci.cerradoEn) {
    events.push({
      id: `paci-cerrado-${paci.id}`,
      tipo: "paci",
      tipoLabel: COPY.timelineTipoPaci,
      fecha: paci.cerradoEn,
      fechaOrden: parseFechaOrden(paci.cerradoEn),
      fechaDisplay: formatMarcoFechaDisplay(paci.cerradoEn),
      resumen: COPY.timelinePaciCerrado(paci.periodoLabel),
    });
  }

  return events;
}

function getIntervencionFechaOrden(intervencion: Intervencion): number {
  const sesiones = getSesionesRepository().getByIntervencionId(intervencion.id);
  for (const sesion of sesiones) {
    const orden = parseFechaOrden(sesion.fecha);
    if (orden > 0) return orden;
  }
  return parseFechaOrden(intervencion.fecha);
}

function getIntervencionFechaDisplay(intervencion: Intervencion): string {
  const sesiones = getSesionesRepository().getByIntervencionId(intervencion.id);
  const sesionFecha = sesiones.find((item) => item.fecha.trim())?.fecha.trim();
  if (sesionFecha) return sesionFecha;
  return formatMarcoFechaDisplay(intervencion.fecha);
}

export function getEstudianteTimelineActividad(
  estudianteId: string
): EstudianteTimelineItem[] {
  const items: EstudianteTimelineItem[] = [];
  const COPY = GLOSSARY.estudiante;

  for (const evaluacion of getHistorialEvaluaciones(estudianteId)) {
    items.push({
      id: `evaluacion-${evaluacion.id}`,
      tipo: "evaluacion",
      tipoLabel: COPY.timelineTipoEvaluacion,
      fecha: evaluacion.fechaReferencia,
      fechaOrden:
        parseFechaOrden(evaluacion.fechaReferencia) ||
        parseFechaOrden(evaluacion.fechaInicio),
      fechaDisplay: formatMarcoFechaDisplay(evaluacion.fechaReferencia),
      resumen: COPY.timelineEvaluacionResumen(
        evaluacion.tipoLabel,
        evaluacion.estadoLabel
      ),
    });
  }

  for (const intervencion of getIntervencionesRepository().getByEstudianteId(
    estudianteId
  )) {
    const sesiones = getSesionesRepository().getByIntervencionId(intervencion.id);
    const tipoNombre = getTipoIntervencionNombre(intervencion.tipoIntervencion);
    const logro = sesiones.find((item) => item.logro.trim())?.logro.trim();

    items.push({
      id: `intervencion-${intervencion.id}`,
      tipo: "intervencion",
      tipoLabel: COPY.timelineTipoIntervencion,
      fecha: intervencion.fecha,
      fechaOrden: getIntervencionFechaOrden(intervencion),
      fechaDisplay: getIntervencionFechaDisplay(intervencion),
      resumen: logro
        ? COPY.timelineIntervencionConLogro(tipoNombre, logro)
        : COPY.timelineIntervencionResumen(tipoNombre),
    });
  }

  for (const paci of getPACIRepository().getByEstudianteId(estudianteId)) {
    items.push(...buildPACIEvents(paci));
  }

  return items.sort((left, right) => right.fechaOrden - left.fechaOrden);
}
