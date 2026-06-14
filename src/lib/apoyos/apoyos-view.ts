import { GLOSSARY } from "@/lib/copy/glossary";
import { readApoyosPIE } from "@/lib/apoyos/apoyos-persistence";
import {
  getApoyosByEstudianteId,
  getApoyosByObjetivoId,
} from "@/lib/apoyos/apoyos-storage";
import type { ApoyoPIE, ApoyoPIEEstado } from "@/lib/apoyos/apoyos-types";

export type ApoyoPIEResumen = {
  id: string;
  nombre: string;
  tipo: ApoyoPIE["tipo"];
  tipoLabel: string;
  descripcion?: string;
  responsable?: string;
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

function toResumen(apoyo: ApoyoPIE): ApoyoPIEResumen {
  return {
    id: apoyo.id,
    nombre: apoyo.nombre,
    tipo: apoyo.tipo,
    tipoLabel: getApoyoPIETipoLabel(apoyo.tipo),
    descripcion: apoyo.descripcion,
    responsable: apoyo.responsable,
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
  const apoyos = getApoyosByObjetivoId(objetivoId).map(toResumen);
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
  const apoyos = getApoyosByEstudianteId(estudianteId).map(toResumen);
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
  const resumenes = readApoyosPIE().map(toResumen);
  const counts = countByEstado(resumenes);

  return {
    apoyosActivos: counts.activos,
    apoyosSuspendidos: counts.suspendidos,
    apoyosFinalizados: counts.finalizados,
  };
}
