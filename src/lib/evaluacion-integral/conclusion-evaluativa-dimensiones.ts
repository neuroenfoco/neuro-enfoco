import type { ConclusionEvaluativaDimensionId } from "@/lib/evaluacion-integral/evaluacion-integral-types";

export type ConclusionEvaluativaDimensionDef = {
  id: ConclusionEvaluativaDimensionId;
  nombre: string;
  orden: number;
};

export const CATALOGO_CONCLUSION_EVALUATIVA_DIMENSIONES: readonly ConclusionEvaluativaDimensionDef[] =
  [
    {
      id: "participacion_convivencia",
      nombre: "Participación y convivencia",
      orden: 10,
    },
    {
      id: "comunicacion_lenguaje",
      nombre: "Comunicación y lenguaje",
      orden: 20,
    },
    {
      id: "aprendizaje_curricular",
      nombre: "Aprendizaje curricular",
      orden: 30,
    },
    {
      id: "atencion_funcion_ejecutiva",
      nombre: "Atención, función ejecutiva y autorregulación",
      orden: 40,
    },
    { id: "socioemocional", nombre: "Socioemocional", orden: 50 },
    { id: "sensorial_motor", nombre: "Sensorial y motor", orden: 60 },
    { id: "acceso_contexto", nombre: "Acceso y adecuaciones del contexto", orden: 70 },
  ] as const;

export const CONCLUSION_EVALUATIVA_DIMENSION_IDS =
  CATALOGO_CONCLUSION_EVALUATIVA_DIMENSIONES.map((item) => item.id);

export function isConclusionEvaluativaDimensionId(
  value: string
): value is ConclusionEvaluativaDimensionId {
  return (CONCLUSION_EVALUATIVA_DIMENSION_IDS as readonly string[]).includes(
    value
  );
}

export function getConclusionEvaluativaDimensionNombre(
  id: ConclusionEvaluativaDimensionId
): string {
  return (
    CATALOGO_CONCLUSION_EVALUATIVA_DIMENSIONES.find((item) => item.id === id)
      ?.nombre ?? id
  );
}
