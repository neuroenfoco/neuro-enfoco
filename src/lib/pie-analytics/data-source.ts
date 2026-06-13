import {
  getApoyoAnaliticaBase,
  getApoyosByObjetivoId,
} from "@/lib/pie-apoyos-storage";
import { getObjetivoPIEById, getObjetivosPIEByEstudianteId } from "@/lib/pie-objectives-storage";
import {
  getMejoraSesionForSesion,
  getSesionesByEstudianteIdAndDimension,
  sortSesionesByFecha,
  type Sesion,
} from "@/lib/sessions-storage";
import type {
  PieAnalyticsApoyo,
  PieAnalyticsEvidencia,
  PieAnalyticsEstudianteInput,
  PieAnalyticsObjetivoInput,
} from "@/lib/pie-analytics/types";

function sesionToEvidencia(sesion: Sesion): PieAnalyticsEvidencia {
  return {
    sesionId: sesion.id,
    fecha: sesion.fecha,
    estadoInicial: sesion.estadoInicial,
    estadoFinal: sesion.estadoFinal,
    impacto: getMejoraSesionForSesion(sesion),
    fortalezas: sesion.fortalezas,
    logro: sesion.logro,
    intervencionId: sesion.intervencionId,
  };
}

function apoyoToAnalyticsApoyo(
  apoyo: ReturnType<typeof getApoyosByObjetivoId>[number]
): PieAnalyticsApoyo {
  const analitica = getApoyoAnaliticaBase(apoyo);

  return {
    apoyoId: apoyo.id,
    nombre: apoyo.nombre,
    descripcion: apoyo.descripcion,
    fechaInicio: apoyo.fechaInicio,
    fechaTermino: apoyo.fechaTermino,
    activo: analitica.activo,
    duracionDias: analitica.duracionDias,
  };
}

export function buildPieAnalyticsObjetivoInput(
  objetivoId: string
): PieAnalyticsObjetivoInput | null {
  const objetivo = getObjetivoPIEById(objetivoId);
  if (!objetivo) return null;

  const evidencias = sortSesionesByFecha(
    getSesionesByEstudianteIdAndDimension(
      objetivo.estudianteId,
      objetivo.dimensionRelacionada
    ),
    "asc"
  ).map(sesionToEvidencia);

  const apoyos = getApoyosByObjetivoId(objetivoId).map(apoyoToAnalyticsApoyo);

  return {
    objetivoId: objetivo.id,
    estudianteId: objetivo.estudianteId,
    nombre: objetivo.nombre,
    dimensionRelacionada: objetivo.dimensionRelacionada,
    lineaBase: objetivo.lineaBase,
    fechaLineaBase: objetivo.fechaLineaBase,
    metaLogro: objetivo.metaLogro,
    barreraDetectada: objetivo.barreraDetectada,
    evidencias,
    apoyos,
  };
}

export function buildPieAnalyticsEstudianteInput(
  estudianteId: string
): PieAnalyticsEstudianteInput {
  const objetivos = getObjetivosPIEByEstudianteId(estudianteId)
    .map((objetivo) => buildPieAnalyticsObjetivoInput(objetivo.id))
    .filter((input): input is PieAnalyticsObjetivoInput => input !== null);

  return {
    estudianteId,
    objetivos,
  };
}
