import { GLOSSARY } from "@/lib/copy/glossary";
import type { HallazgoTipo } from "@/lib/perfil-hallazgos-storage";

export type IngresoPieGrupoConfig = {
  tipo: HallazgoTipo;
  title: string;
  addLabel: string;
  emptyLabel: string;
  accent: "teal" | "amber";
};

export const INGRESO_GRUPOS_ESTUDIANTE: IngresoPieGrupoConfig[] = [
  {
    tipo: "fortaleza",
    title: "Fortalezas conocidas",
    addLabel: "Agregar fortaleza",
    emptyLabel: "Sin fortalezas registradas en este paso.",
    accent: "teal",
  },
  {
    tipo: "interes",
    title: "Intereses conocidos",
    addLabel: "Agregar interés",
    emptyLabel: "Sin intereses registrados en este paso.",
    accent: "teal",
  },
];

export const INGRESO_GRUPOS_PARTICIPACION: IngresoPieGrupoConfig[] = [
  {
    tipo: "contexto_exito",
    title: "Contextos de éxito conocidos",
    addLabel: "Agregar contexto de éxito",
    emptyLabel: "Sin contextos de éxito registrados en este paso.",
    accent: "teal",
  },
  {
    tipo: "barrera",
    title: GLOSSARY.marco.condicionesParticipacion.tituloConocidas,
    addLabel: GLOSSARY.marco.condicionesParticipacion.agregar,
    emptyLabel: "Sin condiciones registradas en este paso.",
    accent: "amber",
  },
];
