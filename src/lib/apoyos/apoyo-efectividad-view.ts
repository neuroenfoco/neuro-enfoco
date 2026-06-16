import { getApoyoIntervencionResumen } from "@/lib/apoyos/apoyo-intervencion-view";
import { GLOSSARY } from "@/lib/copy/glossary";
import { getApoyosRepository } from "@/lib/repositories/repository-factory";

/**
 * Efectividad y estado operacional de ApoyoPIE.
 * Cadena: ApoyoPIE → VinculoApoyoIntervencion → Intervención → Sesiones.
 * No cruza Sesion.apoyosUtilizados (uso del catálogo en evidencia).
 */

export type ApoyoEfectividadEstado =
  | "sin_actividad"
  | "actividad_inicial"
  | "en_desarrollo"
  | "con_evidencia";

/** Estado operacional mínimo (A18.5.2): trazabilidad vía vínculos + sesiones, no uso en catálogo. */
export type ApoyoEstadoOperacional =
  | "sin_trazabilidad"
  | "sin_uso_documentado"
  | "uso_documentado"
  | "uso_frecuente";

export type ApoyoEstadoOperacionalView = {
  estado: ApoyoEstadoOperacional;
  label: string;
  observacion: string;
};

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

export type ObjetivoApoyosEstadoOperacionalResumen = {
  objetivoId: string;
  total: number;
  usoFrecuente: number;
  usoDocumentado: number;
  sinUsoDocumentado: number;
  sinTrazabilidad: number;
};

const COPY = GLOSSARY.apoyosImplementados.efectividadOperacional;
const OP_COPY = GLOSSARY.apoyosImplementados.estadoOperacionalApoyo;

export const APOYO_ESTADO_OPERACIONAL_STYLES: Record<
  ApoyoEstadoOperacional,
  string
> = {
  sin_trazabilidad: "bg-slate-100 text-slate-600 ring-slate-200",
  sin_uso_documentado: "bg-amber-50 text-amber-800 ring-amber-100",
  uso_documentado: "bg-sky-50 text-sky-800 ring-sky-100",
  uso_frecuente: "bg-emerald-50 text-emerald-800 ring-emerald-100",
};

export const APOYO_EFECTIVIDAD_ESTADO_STYLES: Record<
  ApoyoEfectividadEstado,
  string
> = {
  sin_actividad: "bg-slate-100 text-slate-600 ring-slate-200",
  actividad_inicial: "bg-sky-50 text-sky-800 ring-sky-100",
  en_desarrollo: "bg-amber-50 text-amber-800 ring-amber-100",
  con_evidencia: "bg-emerald-50 text-emerald-800 ring-emerald-100",
};

function resolveEstadoOperacional(
  cantidadIntervenciones: number,
  cantidadEvidencias: number,
  efectividadEstado: ApoyoEfectividadEstado
): ApoyoEstadoOperacionalView {
  if (cantidadIntervenciones === 0) {
    return {
      estado: "sin_trazabilidad",
      label: OP_COPY.sinTrazabilidad,
      observacion: OP_COPY.observacionSinTrazabilidad,
    };
  }

  if (
    cantidadEvidencias >= 3 ||
    efectividadEstado === "con_evidencia"
  ) {
    return {
      estado: "uso_frecuente",
      label: OP_COPY.usoFrecuente,
      observacion: OP_COPY.observacionUsoFrecuente,
    };
  }

  if (cantidadIntervenciones >= 1 && cantidadEvidencias >= 1) {
    return {
      estado: "uso_documentado",
      label: OP_COPY.usoDocumentado,
      observacion: OP_COPY.observacionUsoDocumentado,
    };
  }

  return {
    estado: "sin_uso_documentado",
    label: OP_COPY.vinculadoSinEvidencias,
    observacion: OP_COPY.observacionVinculadoSinEvidencias,
  };
}

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
  const apoyo = getApoyosRepository().getById(apoyoId);
  if (!apoyo) return null;
  return buildView(apoyoId, apoyo.nombre);
}

/** Trazabilidad operacional ApoyoPIE → intervenciones vinculadas → sesiones (sin cruzar apoyosUtilizados). */
export function getApoyoEstadoOperacional(
  apoyoId: string
): ApoyoEstadoOperacionalView | null {
  const efectividad = getApoyoEfectividadView(apoyoId);
  if (!efectividad) return null;

  return resolveEstadoOperacional(
    efectividad.cantidadIntervenciones,
    efectividad.cantidadEvidencias,
    efectividad.estado
  );
}

/** Resumen operacional agregado de apoyos institucionales de un objetivo (A18.5.3). */
export function getObjetivoApoyosEstadoOperacionalResumen(
  objetivoId: string
): ObjetivoApoyosEstadoOperacionalResumen {
  const apoyos = getApoyosRepository().getByObjetivoId(objetivoId);
  const resumen: ObjetivoApoyosEstadoOperacionalResumen = {
    objetivoId,
    total: apoyos.length,
    usoFrecuente: 0,
    usoDocumentado: 0,
    sinUsoDocumentado: 0,
    sinTrazabilidad: 0,
  };

  for (const apoyo of apoyos) {
    const estado = getApoyoEstadoOperacional(apoyo.id);
    if (!estado) continue;

    switch (estado.estado) {
      case "uso_frecuente":
        resumen.usoFrecuente += 1;
        break;
      case "uso_documentado":
        resumen.usoDocumentado += 1;
        break;
      case "sin_uso_documentado":
        resumen.sinUsoDocumentado += 1;
        break;
      case "sin_trazabilidad":
        resumen.sinTrazabilidad += 1;
        break;
    }
  }

  return resumen;
}

export function getEstudianteEfectividadApoyos(
  estudianteId: string
): EstudianteEfectividadApoyosView {
  const apoyos = getApoyosRepository().getByEstudianteId(estudianteId);
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

  for (const apoyo of getApoyosRepository().getAll()) {
    const view = buildView(apoyo.id, apoyo.nombre);
    if (view.estado === "con_evidencia") {
      apoyosConEvidencia += 1;
    }
  }

  return { apoyosConEvidencia };
}
