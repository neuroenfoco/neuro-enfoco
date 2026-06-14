import { readApoyosPIE } from "@/lib/apoyos/apoyos-persistence";
import { getIntervencionesByApoyoId } from "@/lib/apoyos/apoyo-intervencion-storage";
import { getApoyoPIEById } from "@/lib/apoyos/apoyos-storage";
import { getSesionesByIntervencionId } from "@/lib/sessions-storage";

export type ApoyoIntervencionResumen = {
  apoyoId: string;
  cantidadIntervenciones: number;
  cantidadEvidencias: number;
  ultimaIntervencion?: string;
  ultimaActividad?: string;
};

export type ApoyoEfectividadBaseView = {
  apoyoId: string;
  nombreApoyo: string;
  intervenciones: number;
  evidencias: number;
  tieneActividad: boolean;
};

function buildActividadFromIntervenciones(
  intervencionIds: string[],
  intervencionFechas: string[]
): { cantidadEvidencias: number; ultimaIntervencion?: string; ultimaActividad?: string } {
  let cantidadEvidencias = 0;
  const fechasActividad: string[] = [...intervencionFechas];

  for (const intervencionId of intervencionIds) {
    const sesiones = getSesionesByIntervencionId(intervencionId);
    cantidadEvidencias += sesiones.length;
    for (const sesion of sesiones) {
      if (sesion.fecha) fechasActividad.push(sesion.fecha);
    }
  }

  fechasActividad.sort((a, b) => b.localeCompare(a));

  return {
    cantidadEvidencias,
    ultimaIntervencion: intervencionFechas.sort((a, b) => b.localeCompare(a))[0],
    ultimaActividad: fechasActividad[0],
  };
}

export function getApoyoIntervencionResumen(apoyoId: string): ApoyoIntervencionResumen {
  const intervenciones = getIntervencionesByApoyoId(apoyoId);
  const intervencionIds = intervenciones.map((item) => item.id);
  const intervencionFechas = intervenciones.map((item) => item.fecha);
  const actividad = buildActividadFromIntervenciones(intervencionIds, intervencionFechas);

  return {
    apoyoId,
    cantidadIntervenciones: intervenciones.length,
    cantidadEvidencias: actividad.cantidadEvidencias,
    ultimaIntervencion: actividad.ultimaIntervencion,
    ultimaActividad: actividad.ultimaActividad,
  };
}

export function getApoyoEfectividadBaseView(
  apoyoId: string
): ApoyoEfectividadBaseView | null {
  const apoyo = getApoyoPIEById(apoyoId);
  if (!apoyo) return null;

  const resumen = getApoyoIntervencionResumen(apoyoId);

  return {
    apoyoId,
    nombreApoyo: apoyo.nombre,
    intervenciones: resumen.cantidadIntervenciones,
    evidencias: resumen.cantidadEvidencias,
    tieneActividad:
      resumen.cantidadIntervenciones > 0 || resumen.cantidadEvidencias > 0,
  };
}

export function getApoyoIntervencionIndicadores(): {
  apoyosConActividad: number;
  apoyosSinActividad: number;
} {
  let apoyosConActividad = 0;
  let apoyosSinActividad = 0;

  for (const apoyo of readApoyosPIE()) {
    const view = getApoyoEfectividadBaseView(apoyo.id);
    if (!view) continue;
    if (view.tieneActividad) {
      apoyosConActividad += 1;
    } else {
      apoyosSinActividad += 1;
    }
  }

  return { apoyosConActividad, apoyosSinActividad };
}
