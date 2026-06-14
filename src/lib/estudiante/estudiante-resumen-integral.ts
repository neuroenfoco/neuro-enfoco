import { getEstudianteBarrerasApoyosResumen } from "@/lib/apoyos/barreras-apoyos-view";
import { GLOSSARY } from "@/lib/copy/glossary";
import { getEvaluacionesIntegralesByEstudianteId } from "@/lib/evaluacion-integral/evaluacion-integral-storage";
import { getIntervencionesByEstudianteId } from "@/lib/intervenciones-storage";
import { getPACIsByEstudianteId } from "@/lib/paci/paci-storage";
import type { PACIEstado } from "@/lib/paci/paci-types";
import { getObjetivosPIEByEstudianteId } from "@/lib/pie-objectives-storage";
import {
  getEstudianteById,
  getEstudianteIniciales,
  type Estudiante,
} from "@/lib/students-storage";

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

export function getEstudiantePACIEstadoResumen(
  estudianteId: string
): EstudiantePACIEstadoResumen {
  const pacis = getPACIsByEstudianteId(estudianteId);
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
  const estudiante = getEstudianteById(estudianteId);
  if (!estudiante) return null;

  const paciEstado = getEstudiantePACIEstadoResumen(estudianteId);
  const barrerasApoyos = getEstudianteBarrerasApoyosResumen(estudianteId);

  return {
    estudiante,
    iniciales: getEstudianteIniciales(estudiante.nombre),
    objetivosPieActivos: getObjetivosPIEByEstudianteId(estudianteId).length,
    intervencionesRegistradas:
      getIntervencionesByEstudianteId(estudianteId).length,
    evaluacionesIntegrales: getEvaluacionesIntegralesByEstudianteId(
      estudianteId
    ).filter((item) => item.estado !== "anulada").length,
    paciEstado,
    paciEstadoLabel: getEstudiantePACIEstadoLabel(paciEstado),
    barrerasIdentificadas: barrerasApoyos.cantidadBarrerasIdentificadas,
    apoyosSugeridos: barrerasApoyos.cantidadApoyosSugeridos,
  };
}
