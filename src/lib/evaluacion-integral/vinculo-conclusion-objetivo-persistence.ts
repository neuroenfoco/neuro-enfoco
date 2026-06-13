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
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(VINCULO_CONCLUSION_OBJETIVO_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isVinculoConclusionObjetivoPIE);
  } catch {
    return [];
  }
}

export function writeVinculosConclusionObjetivo(
  items: VinculoConclusionObjetivoPIE[]
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    VINCULO_CONCLUSION_OBJETIVO_STORAGE_KEY,
    JSON.stringify(items)
  );
}
