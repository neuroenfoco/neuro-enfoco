import type { ConclusionEvaluativaDimensionId } from "@/lib/evaluacion-integral/evaluacion-integral-types";
import { PROFILE_DIMENSION_LABELS } from "@/lib/sessions-storage";

export type PACIDimensionInstitucionalId =
  | "participacion_convivencia_escolar"
  | "comunicacion_lenguaje"
  | "funcionamiento_sensorial_motor"
  | "acceso_contexto_educativo"
  | "aprendizajes_curriculares"
  | "autonomia_funcionamiento_adaptativo"
  | "familia_contexto";

export type PACIDimensionInstitucional = {
  id: PACIDimensionInstitucionalId;
  nombre: string;
  orden: number;
};

export const CATALOGO_PACI_DIMENSIONES_INSTITUCIONALES: readonly PACIDimensionInstitucional[] =
  [
    {
      id: "participacion_convivencia_escolar",
      nombre: "Participación y convivencia escolar",
      orden: 10,
    },
    {
      id: "comunicacion_lenguaje",
      nombre: "Comunicación y lenguaje",
      orden: 20,
    },
    {
      id: "funcionamiento_sensorial_motor",
      nombre: "Funcionamiento sensorial y motor",
      orden: 30,
    },
    {
      id: "acceso_contexto_educativo",
      nombre: "Acceso al contexto educativo",
      orden: 40,
    },
    {
      id: "aprendizajes_curriculares",
      nombre: "Aprendizajes curriculares",
      orden: 50,
    },
    {
      id: "autonomia_funcionamiento_adaptativo",
      nombre: "Autonomía y funcionamiento adaptativo",
      orden: 60,
    },
    { id: "familia_contexto", nombre: "Familia y contexto", orden: 70 },
  ] as const;

export const PACI_DIMENSION_INSTITUCIONAL_IDS =
  CATALOGO_PACI_DIMENSIONES_INSTITUCIONALES.map((item) => item.id);

export type PACIDimensionProyectadaFuente = "objetivo" | "conclusion";

export type PACIDimensionProyectada = {
  id: PACIDimensionInstitucionalId;
  nombre: string;
  fuente: PACIDimensionProyectadaFuente;
};

type ObjetivoDimensionLabel = (typeof PROFILE_DIMENSION_LABELS)[number];

/**
 * Mapeo formalizado desde planificacion-evaluativa-view:
 * dimensión de conclusión evaluativa → dimensión de objetivo PIE (perfil).
 */
export function mapConclusionDimensionToObjetivoDimension(
  dimensionId?: ConclusionEvaluativaDimensionId
): ObjetivoDimensionLabel | undefined {
  switch (dimensionId) {
    case "participacion_convivencia":
      return "Participación escolar";
    case "comunicacion_lenguaje":
      return "Comunicación";
    case "socioemocional":
      return "Regulación emocional";
    case "atencion_funcion_ejecutiva":
      return "Autonomía";
    case "sensorial_motor":
      return "Bienestar percibido";
    case "acceso_contexto":
      return "Participación escolar";
    case "aprendizaje_curricular":
      return "Fortalezas y talentos";
    default:
      return undefined;
  }
}

const OBJETIVO_DIMENSION_TO_INSTITUCIONAL: Record<
  ObjetivoDimensionLabel,
  PACIDimensionInstitucionalId
> = {
  "Participación escolar": "participacion_convivencia_escolar",
  Comunicación: "comunicacion_lenguaje",
  "Regulación emocional": "autonomia_funcionamiento_adaptativo",
  "Interacción social": "participacion_convivencia_escolar",
  Autonomía: "autonomia_funcionamiento_adaptativo",
  "Bienestar percibido": "funcionamiento_sensorial_motor",
  "Fortalezas y talentos": "aprendizajes_curriculares",
};

const CONCLUSION_DIMENSION_TO_INSTITUCIONAL: Record<
  ConclusionEvaluativaDimensionId,
  PACIDimensionInstitucionalId
> = {
  participacion_convivencia: "participacion_convivencia_escolar",
  comunicacion_lenguaje: "comunicacion_lenguaje",
  sensorial_motor: "funcionamiento_sensorial_motor",
  acceso_contexto: "acceso_contexto_educativo",
  aprendizaje_curricular: "aprendizajes_curriculares",
  atencion_funcion_ejecutiva: "autonomia_funcionamiento_adaptativo",
  socioemocional: "autonomia_funcionamiento_adaptativo",
};

export function getPACIDimensionInstitucionalNombre(
  id: PACIDimensionInstitucionalId
): string {
  return (
    CATALOGO_PACI_DIMENSIONES_INSTITUCIONALES.find((item) => item.id === id)
      ?.nombre ?? id
  );
}

export function mapObjetivoDimensionToInstitucional(
  dimensionRelacionada: string
): PACIDimensionInstitucionalId | undefined {
  const trimmed = dimensionRelacionada.trim();
  if (!trimmed) return undefined;

  const direct =
    OBJETIVO_DIMENSION_TO_INSTITUCIONAL[trimmed as ObjetivoDimensionLabel];
  if (direct) return direct;

  const normalized = trimmed.toLowerCase();
  for (const [label, institutionalId] of Object.entries(
    OBJETIVO_DIMENSION_TO_INSTITUCIONAL
  )) {
    if (label.toLowerCase() === normalized) {
      return institutionalId;
    }
  }

  return undefined;
}

export function mapConclusionDimensionToInstitucional(
  dimensionId: ConclusionEvaluativaDimensionId
): PACIDimensionInstitucionalId {
  return CONCLUSION_DIMENSION_TO_INSTITUCIONAL[dimensionId];
}

export function proyectarDimensionPIE(input: {
  dimensionRelacionada?: string;
  conclusionDimensionId?: ConclusionEvaluativaDimensionId;
}): PACIDimensionProyectada | undefined {
  if (input.dimensionRelacionada?.trim()) {
    const id = mapObjetivoDimensionToInstitucional(input.dimensionRelacionada);
    if (id) {
      return {
        id,
        nombre: getPACIDimensionInstitucionalNombre(id),
        fuente: "objetivo",
      };
    }
  }

  if (input.conclusionDimensionId) {
    const id = mapConclusionDimensionToInstitucional(
      input.conclusionDimensionId
    );
    return {
      id,
      nombre: getPACIDimensionInstitucionalNombre(id),
      fuente: "conclusion",
    };
  }

  return undefined;
}
