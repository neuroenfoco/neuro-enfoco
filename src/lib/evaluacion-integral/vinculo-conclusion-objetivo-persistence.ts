import { getStorageAdapter } from "@/lib/core/browser-storage-adapter";
import type { VinculoConclusionObjetivoPIE } from "@/lib/evaluacion-integral/evaluacion-integral-types";

export const VINCULO_CONCLUSION_OBJETIVO_STORAGE_KEY =
  "neuro-enfoco-vinculos-conclusion-objetivo-pie";

function isVinculoConclusionObjetivoPIE(
  value: unknown
): value is VinculoConclusionObjetivoPIE {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.conclusionEvaluativaId === "string" &&
    typeof item.objetivoPieId === "string" &&
    typeof item.estudianteId === "string" &&
    typeof item.evaluacionIntegralId === "string" &&
    typeof item.creadoEn === "string"
  );
}

export function readVinculosConclusionObjetivo(): VinculoConclusionObjetivoPIE[] {
  const parsed = getStorageAdapter().read<unknown>(
    VINCULO_CONCLUSION_OBJETIVO_STORAGE_KEY
  );
  return parsed.filter(isVinculoConclusionObjetivoPIE);
}

export function writeVinculosConclusionObjetivo(
  items: VinculoConclusionObjetivoPIE[]
): void {
  getStorageAdapter().write(VINCULO_CONCLUSION_OBJETIVO_STORAGE_KEY, items);
}
