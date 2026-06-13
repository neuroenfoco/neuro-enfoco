import type { PACIObjetivo } from "@/lib/paci/paci-types";

export const PACI_OBJETIVO_STORAGE_KEY = "neuro-enfoco-paci-objetivos";

export function isPACIObjetivo(value: unknown): value is PACIObjetivo {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.paciId === "string" &&
    typeof item.objetivoPieId === "string" &&
    typeof item.orden === "number" &&
    Number.isFinite(item.orden) &&
    typeof item.creadoEn === "string"
  );
}

export function readPACIObjetivos(): PACIObjetivo[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(PACI_OBJETIVO_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const valid: PACIObjetivo[] = [];
    for (const item of parsed) {
      if (!isPACIObjetivo(item)) continue;
      valid.push(item);
    }

    if (
      process.env.NODE_ENV === "development" &&
      valid.length !== parsed.length
    ) {
      console.debug(
        "[readPACIObjetivos] registros descartados:",
        parsed.length - valid.length
      );
    }

    return valid;
  } catch {
    return [];
  }
}

export function writePACIObjetivos(items: PACIObjetivo[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PACI_OBJETIVO_STORAGE_KEY, JSON.stringify(items));
}
