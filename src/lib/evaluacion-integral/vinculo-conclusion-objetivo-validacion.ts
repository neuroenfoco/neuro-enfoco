import { getConclusionEvaluativaById } from "@/lib/evaluacion-integral/conclusion-evaluativa-storage";
import type { VinculoConclusionObjetivoPIE } from "@/lib/evaluacion-integral/evaluacion-integral-types";
import { getObjetivoPIEById } from "@/lib/pie-objectives-storage";

export function validateVinculoConclusionObjetivo(
  conclusionEvaluativaId: string,
  objetivoPieId: string,
  existingVinculos: VinculoConclusionObjetivoPIE[] = []
): string | null {
  const conclusion = getConclusionEvaluativaById(conclusionEvaluativaId);
  if (!conclusion) {
    return "Conclusión evaluativa no encontrada.";
  }

  const objetivo = getObjetivoPIEById(objetivoPieId);
  if (!objetivo) {
    return "Objetivo PIE no encontrado.";
  }

  if (conclusion.estudianteId !== objetivo.estudianteId) {
    return "La conclusión y el objetivo deben pertenecer al mismo estudiante.";
  }

  const duplicate = existingVinculos.some(
    (item) =>
      item.conclusionEvaluativaId === conclusionEvaluativaId &&
      item.objetivoPieId === objetivoPieId
  );
  if (duplicate) {
    return "Este vínculo ya existe.";
  }

  return null;
}
