import { getEstudianteBarrerasApoyosResumen } from "@/lib/apoyos/barreras-apoyos-view";
import { GLOSSARY } from "@/lib/copy/glossary";
import type { PACIEstado } from "@/lib/paci/paci-types";
import {
  getEstudiantesRepository,
  getEvaluacionesRepository,
  getIntervencionesRepository,
  getObjetivosRepository,
  getPACIRepository,
} from "@/lib/repositories/repository-factory";
import type { Estudiante } from "@/lib/repositories/estudiantes-repository";

export type EstudiantePACIEstadoResumen = "sin_paci" | PACIEstado;

export type EstudianteResumenIntegral = {
  estudiante: Estudiante;
  iniciales: string;
  objetivosPieActivos: number;
  intervencionesRegistradas: number;
  evaluacionesIntegrales: number;
  paciEstado: EstudiantePACIEstadoResumen;
  paciEstadoLabel: string;
  barrerasIdentificadas: number;
  apoyosSugeridos: number;
};

function getEstudianteIniciales(nombre: string): string {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getEstudiantePACIEstadoResumen(
  estudianteId: string
): EstudiantePACIEstadoResumen {
  const pacis = getPACIRepository().getByEstudianteId(estudianteId);
  if (pacis.length === 0) return "sin_paci";

  if (pacis.some((item) => item.estado === "vigente")) return "vigente";
  if (pacis.some((item) => item.estado === "borrador")) return "borrador";
  return "cerrado";
}

export function getEstudiantePACIEstadoLabel(
  estado: EstudiantePACIEstadoResumen
): string {
  const COPY = GLOSSARY.estudiante;
  switch (estado) {
    case "sin_paci":
      return COPY.paciEstadoSinPaci;
    case "borrador":
      return GLOSSARY.paci.estadoBorrador;
    case "vigente":
      return GLOSSARY.paci.estadoVigente;
    case "cerrado":
      return GLOSSARY.paci.estadoCerrado;
  }
}

export function getEstudianteResumenIntegral(
  estudianteId: string
): EstudianteResumenIntegral | null {
  const estudiante = getEstudiantesRepository().getById(estudianteId);
  if (!estudiante) return null;

  const paciEstado = getEstudiantePACIEstadoResumen(estudianteId);
  const barrerasApoyos = getEstudianteBarrerasApoyosResumen(estudianteId);

  return {
    estudiante,
    iniciales: getEstudianteIniciales(estudiante.nombre),
    objetivosPieActivos:
      getObjetivosRepository().getByEstudianteId(estudianteId).length,
    intervencionesRegistradas:
      getIntervencionesRepository().getByEstudianteId(estudianteId).length,
    evaluacionesIntegrales: getEvaluacionesRepository()
      .getByEstudianteId(estudianteId)
      .filter((item) => item.estado !== "anulada").length,
    paciEstado,
    paciEstadoLabel: getEstudiantePACIEstadoLabel(paciEstado),
    barrerasIdentificadas: barrerasApoyos.cantidadBarrerasIdentificadas,
    apoyosSugeridos: barrerasApoyos.cantidadApoyosSugeridos,
  };
}
