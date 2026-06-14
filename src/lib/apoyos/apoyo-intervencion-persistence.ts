import type { VinculoApoyoIntervencion } from "@/lib/apoyos/apoyo-intervencion-types";
import { getStorageAdapter } from "@/lib/core/browser-storage-adapter";

export const VINCULOS_APOYO_INTERVENCION_STORAGE_KEY =
  "neuro-enfoco-vinculos-apoyo-intervencion";

function isVinculoApoyoIntervencion(value: unknown): value is VinculoApoyoIntervencion {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.apoyoId === "string" &&
    typeof item.intervencionId === "string" &&
    typeof item.creadoEn === "string"
  );
}

export function readVinculosApoyoIntervencion(): VinculoApoyoIntervencion[] {
  const parsed = getStorageAdapter().read<unknown>(
    VINCULOS_APOYO_INTERVENCION_STORAGE_KEY
  );

  const valid: VinculoApoyoIntervencion[] = [];
  for (const item of parsed) {
    if (!isVinculoApoyoIntervencion(item)) continue;
    valid.push(item);
  }

  if (process.env.NODE_ENV === "development" && valid.length !== parsed.length) {
    console.debug(
      "[readVinculosApoyoIntervencion] registros descartados:",
      parsed.length - valid.length
    );
  }

  return valid;
}

export function writeVinculosApoyoIntervencion(
  items: VinculoApoyoIntervencion[]
): void {
  getStorageAdapter().write(VINCULOS_APOYO_INTERVENCION_STORAGE_KEY, items);
}
