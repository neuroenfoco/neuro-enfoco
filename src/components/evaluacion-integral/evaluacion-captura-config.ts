import { GLOSSARY } from "@/lib/copy/glossary";
import type { HallazgoTipo } from "@/lib/perfil-hallazgos-storage";

export type EvaluacionCapturaGrupoConfig = {
  tipo: HallazgoTipo;
  title: string;
  addLabel: string;
  emptyLabel: string;
  accent: "teal" | "amber";
};

export const EVALUACION_CAPTURA_GRUPOS: EvaluacionCapturaGrupoConfig[] = [
  {
    tipo: "fortaleza",
    title: GLOSSARY.evaluacionCaptura.grupoFortalezas,
    addLabel: GLOSSARY.evaluacionCaptura.agregarFortaleza,
    emptyLabel: GLOSSARY.evaluacionCaptura.sinFortalezas,
    accent: "teal",
  },
  {
    tipo: "interes",
    title: GLOSSARY.evaluacionCaptura.grupoIntereses,
    addLabel: GLOSSARY.evaluacionCaptura.agregarInteres,
    emptyLabel: GLOSSARY.evaluacionCaptura.sinIntereses,
    accent: "teal",
  },
  {
    tipo: "contexto_exito",
    title: GLOSSARY.evaluacionCaptura.grupoContextos,
    addLabel: GLOSSARY.evaluacionCaptura.agregarContexto,
    emptyLabel: GLOSSARY.evaluacionCaptura.sinContextos,
    accent: "teal",
  },
  {
    tipo: "barrera",
    title: GLOSSARY.evaluacionCaptura.grupoCondiciones,
    addLabel: GLOSSARY.evaluacionCaptura.agregarCondicion,
    emptyLabel: GLOSSARY.evaluacionCaptura.sinCondiciones,
    accent: "amber",
  },
];

export const EVALUACION_CAPTURA_PASOS = [
  { id: 1, label: GLOSSARY.evaluacionCaptura.pasoEncuadre },
  { id: 2, label: GLOSSARY.evaluacionCaptura.pasoHallazgos },
  { id: 3, label: GLOSSARY.evaluacionCaptura.pasoConclusiones },
  { id: 4, label: GLOSSARY.evaluacionCaptura.pasoCierre },
] as const;

export const EVALUACION_TIPOS_CAPTURA = [
  { id: "ingreso" as const, label: GLOSSARY.evaluacionCaptura.tipoIngreso },
  {
    id: "reevaluacion" as const,
    label: GLOSSARY.evaluacionCaptura.tipoReevaluacion,
  },
  {
    id: "seguimiento" as const,
    label: GLOSSARY.evaluacionCaptura.tipoSeguimiento,
  },
];
