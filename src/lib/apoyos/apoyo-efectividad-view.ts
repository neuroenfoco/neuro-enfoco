import { getApoyoIntervencionResumen } from "@/lib/apoyos/apoyo-intervencion-view";
import { readApoyosPIE } from "@/lib/apoyos/apoyos-persistence";
import {
  getApoyoPIEById,
  getApoyosByEstudianteId,
} from "@/lib/apoyos/apoyos-storage";
import { GLOSSARY } from "@/lib/copy/glossary";

export type ApoyoEfectividadEstado =
  | "sin_actividad"
  | "actividad_inicial"
  | "en_desarrollo"
  | "con_evidencia";

export type ApoyoEfectividadView = {
  apoyoId: string;
  nombreApoyo: string;
  cantidadIntervenciones: number;
  cantidadEvidencias: number;
  ultimaActividad?: string;
  estado: ApoyoEfectividadEstado;
  estadoLabel: string;
  observacion: string;
};

export type EstudianteEfectividadApoyosView = {
  estudianteId: string;
  cantidadSinActividad: number;
  cantidadActividadInicial: number;
  cantidadEnDesarrollo: number;
  cantidadConEvidencia: number;
  apoyos: ApoyoEfectividadView[];
};

const COPY = GLOSSARY.apoyosImplementados.efectividadOperacional;

export const APOYO_EFECTIVIDAD_ESTADO_STYLES: Record<
  ApoyoEfectividadEstado,
  string
> = {
  sin_actividad: "bg-slate-100 text-slate-600 ring-slate-200",
  actividad_inicial: "bg-sky-50 text-sky-800 ring-sky-100",
  en_desarrollo: "bg-amber-50 text-amber-800 ring-amber-100",
  con_evidencia: "bg-emerald-50 text-emerald-800 ring-emerald-100",
};

function resolveEstado(
  cantidadIntervenciones: number,
  cantidadEvidencias: number
): ApoyoEfectividadEstado {
  if (cantidadIntervenciones === 0 && cantidadEvidencias === 0) {
    return "sin_actividad";
  }
  if (cantidadIntervenciones >= 3 && cantidadEvidencias >= 3) {
    return "con_evidencia";
  }
  if (cantidadIntervenciones >= 2 && cantidadEvidencias >= 1) {
    return "en_desarrollo";
  }
  if (cantidadIntervenciones >= 1 && cantidadEvidencias === 0) {
    return "actividad_inicial";
  }
  return "actividad_inicial";
}

function getEstadoLabel(estado: ApoyoEfectividadEstado): string {
  switch (estado) {
    case "sin_actividad":
      return COPY.sinActividad;
    case "actividad_inicial":
      return COPY.actividadInicial;
    case "en_desarrollo":
      return COPY.enDesarrollo;
    case "con_evidencia":
      return COPY.conEvidencia;
  }
}

function getObservacion(estado: ApoyoEfectividadEstado): string {
  switch (estado) {
    case "sin_actividad":
      return COPY.observacionSinActividad;
    case "actividad_inicial":
      return COPY.observacionActividadInicial;
    case "en_desarrollo":
      return COPY.observacionEnDesarrollo;
    case "con_evidencia":
      return COPY.observacionConEvidencia;
  }
}

function buildView(
  apoyoId: string,
  nombreApoyo: string
): ApoyoEfectividadView {
  const resumen = getApoyoIntervencionResumen(apoyoId);
  const estado = resolveEstado(
    resumen.cantidadIntervenciones,
    resumen.cantidadEvidencias
  );

  return {
    apoyoId,
    nombreApoyo,
    cantidadIntervenciones: resumen.cantidadIntervenciones,
    cantidadEvidencias: resumen.cantidadEvidencias,
    ultimaActividad: resumen.ultimaActividad,
    estado,
    estadoLabel: getEstadoLabel(estado),
    observacion: getObservacion(estado),
  };
}

export function getApoyoEfectividadView(
  apoyoId: string
): ApoyoEfectividadView | null {
  const apoyo = getApoyoPIEById(apoyoId);
  if (!apoyo) return null;
  return buildView(apoyoId, apoyo.nombre);
}

export function getEstudianteEfectividadApoyos(
  estudianteId: string
): EstudianteEfectividadApoyosView {
  const apoyos = getApoyosByEstudianteId(estudianteId);
  const views = apoyos.map((apoyo) => buildView(apoyo.id, apoyo.nombre));

  return {
    estudianteId,
    cantidadSinActividad: views.filter((item) => item.estado === "sin_actividad")
      .length,
    cantidadActividadInicial: views.filter(
      (item) => item.estado === "actividad_inicial"
    ).length,
    cantidadEnDesarrollo: views.filter((item) => item.estado === "en_desarrollo")
      .length,
    cantidadConEvidencia: views.filter((item) => item.estado === "con_evidencia")
      .length,
    apoyos: views,
  };
}

export function getApoyoEfectividadIndicadores(): {
  apoyosConEvidencia: number;
} {
  let apoyosConEvidencia = 0;

  for (const apoyo of readApoyosPIE()) {
    const view = buildView(apoyo.id, apoyo.nombre);
    if (view.estado === "con_evidencia") {
      apoyosConEvidencia += 1;
    }
  }

  return { apoyosConEvidencia };
}
