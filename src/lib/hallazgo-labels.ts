import { GLOSSARY } from "@/lib/copy/glossary";
import type { HallazgoTipo } from "@/lib/perfil-hallazgos-storage";

export type HallazgoDimension = "perfil_estudiante" | "perfil_participacion";

const HALLAZGO_DIMENSION_BY_TIPO: Record<HallazgoTipo, HallazgoDimension> = {
  fortaleza: "perfil_estudiante",
  interes: "perfil_estudiante",
  barrera: "perfil_participacion",
  contexto_exito: "perfil_participacion",
};

export function getHallazgoDimension(tipo: HallazgoTipo): HallazgoDimension {
  return HALLAZGO_DIMENSION_BY_TIPO[tipo];
}

export function getHallazgoDimensionLabel(dimension: HallazgoDimension): string {
  return dimension === "perfil_estudiante"
    ? GLOSSARY.marco.perfilEstudiante.titulo
    : GLOSSARY.marco.perfilParticipacion.titulo;
}

export function getHallazgoTipoLabel(tipo: HallazgoTipo): string {
  return GLOSSARY.marco.hallazgoTipos[tipo];
}

export function isHallazgoPerfilParticipacion(tipo: HallazgoTipo): boolean {
  return getHallazgoDimension(tipo) === "perfil_participacion";
}
