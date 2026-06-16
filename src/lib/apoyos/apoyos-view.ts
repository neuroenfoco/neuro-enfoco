/**
 * Vistas de lectura para apoyos institucionales (ApoyoPIE).
 *
 * **Pregunta que responde:** «¿Qué apoyo estamos implementando?» — registro
 * institucional con responsable, frecuencia, estado y vínculo con objetivos.
 *
 * Distinto de:
 * - **Uso del apoyo** (`Sesion.apoyosUtilizados`): ¿qué utilizamos hoy en una intervención?
 * - **Apoyos planificados** (`ObjetivoPIE.apoyosPlanificadosIds`): intención en la planificación.
 */

import { GLOSSARY } from "@/lib/copy/glossary";
import { getProfesionalDisplayNombre } from "@/lib/institucional/profesional-resolve";
import { getApoyosRepository } from "@/lib/repositories/repository-factory";
import type { ApoyoPIE, ApoyoPIEEstado } from "@/lib/apoyos/apoyos-types";

export type ApoyoPIEResumen = {
  id: string;
  nombre: string;
  tipo: ApoyoPIE["tipo"];
  tipoLabel: string;
  descripcion?: string;
  responsable?: string;
  responsableProfesionalId?: string;
  frecuencia?: string;
  estado: string;
  estadoId: ApoyoPIEEstado;
  objetivoPieId?: string;
};

export type ObjetivoApoyosView = {
  objetivoId: string;
  apoyos: ApoyoPIEResumen[];
  cantidadActivos: number;
  cantidadSuspendidos: number;
  cantidadFinalizados: number;
};

export type EstudianteApoyosView = {
  estudianteId: string;
  apoyosActivos: number;
  apoyosSuspendidos: number;
  apoyosFinalizados: number;
  apoyos: ApoyoPIEResumen[];
};

const COPY = GLOSSARY.apoyosImplementados;

export function getApoyoPIETipoLabel(tipo: string): string {
  return GLOSSARY.barrerasApoyos.tipoApoyo(tipo);
}

export function getApoyoPIEEstadoLabel(estado: ApoyoPIEEstado): string {
  switch (estado) {
    case "activo":
      return COPY.estadoActivo;
    case "suspendido":
      return COPY.estadoSuspendido;
    case "finalizado":
      return COPY.estadoFinalizado;
  }
}

type ApoyoResponsableSource = Pick<
  ApoyoPIE,
  "responsableNombreSnapshot" | "responsableProfesionalId" | "responsable"
>;

export function getApoyoResponsableDisplay(apoyo: ApoyoResponsableSource): string {
  const snapshot = apoyo.responsableNombreSnapshot?.trim();
  if (snapshot) return snapshot;

  const profesionalId = apoyo.responsableProfesionalId?.trim();
  if (profesionalId) {
    return getProfesionalDisplayNombre(profesionalId);
  }

  const legacy = apoyo.responsable?.trim();
  if (legacy) return legacy;

  return "—";
}

function toResumen(apoyo: ApoyoPIE): ApoyoPIEResumen {
  const responsableDisplay = getApoyoResponsableDisplay(apoyo);
  return {
    id: apoyo.id,
    nombre: apoyo.nombre,
    tipo: apoyo.tipo,
    tipoLabel: getApoyoPIETipoLabel(apoyo.tipo),
    descripcion: apoyo.descripcion,
    responsable:
      responsableDisplay === "—" ? undefined : responsableDisplay,
    responsableProfesionalId: apoyo.responsableProfesionalId,
    frecuencia: apoyo.frecuencia,
    estado: getApoyoPIEEstadoLabel(apoyo.estado),
    estadoId: apoyo.estado,
    objetivoPieId: apoyo.objetivoPieId,
  };
}

function countByEstado(apoyos: ApoyoPIEResumen[]) {
  return {
    activos: apoyos.filter((item) => item.estadoId === "activo").length,
    suspendidos: apoyos.filter((item) => item.estadoId === "suspendido").length,
    finalizados: apoyos.filter((item) => item.estadoId === "finalizado").length,
  };
}

export function getObjetivoApoyosView(objetivoId: string): ObjetivoApoyosView {
  const apoyos = getApoyosRepository()
    .getByObjetivoId(objetivoId)
    .map(toResumen);
  const counts = countByEstado(apoyos);

  return {
    objetivoId,
    apoyos,
    cantidadActivos: counts.activos,
    cantidadSuspendidos: counts.suspendidos,
    cantidadFinalizados: counts.finalizados,
  };
}

export function getEstudianteApoyosView(
  estudianteId: string
): EstudianteApoyosView {
  const apoyos = getApoyosRepository()
    .getByEstudianteId(estudianteId)
    .map(toResumen);
  const counts = countByEstado(apoyos);

  return {
    estudianteId,
    apoyosActivos: counts.activos,
    apoyosSuspendidos: counts.suspendidos,
    apoyosFinalizados: counts.finalizados,
    apoyos,
  };
}

export function getApoyosImplementadosIndicadores(): {
  apoyosActivos: number;
  apoyosSuspendidos: number;
  apoyosFinalizados: number;
} {
  const resumenes = getApoyosRepository().getAll().map(toResumen);
  const counts = countByEstado(resumenes);

  return {
    apoyosActivos: counts.activos,
    apoyosSuspendidos: counts.suspendidos,
    apoyosFinalizados: counts.finalizados,
  };
}
