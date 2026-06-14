import type { PACI, PACIEstado } from "@/lib/paci/paci-types";
import { getStorageAdapter } from "@/lib/core/browser-storage-adapter";

export const PACI_STORAGE_KEY = "neuro-enfoco-paci";

const ESTADOS_PACI: PACIEstado[] = ["borrador", "vigente", "cerrado"];

function isPACIEstado(value: string): value is PACIEstado {
  return ESTADOS_PACI.includes(value as PACIEstado);
}

export function isPACI(value: unknown): value is PACI {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.estudianteId === "string" &&
    typeof item.periodoLabel === "string" &&
    isPACIEstado(item.estado as string) &&
    (typeof item.periodoInicio === "string" || item.periodoInicio === undefined) &&
    (typeof item.periodoFin === "string" || item.periodoFin === undefined) &&
    (typeof item.evaluacionReferenciaId === "string" ||
      item.evaluacionReferenciaId === undefined) &&
    (typeof item.sintesisInstitucional === "string" ||
      item.sintesisInstitucional === undefined) &&
    (typeof item.paciAnteriorId === "string" || item.paciAnteriorId === undefined) &&
    (typeof item.declaradoVigenteEn === "string" ||
      item.declaradoVigenteEn === undefined) &&
    (typeof item.cerradoEn === "string" || item.cerradoEn === undefined) &&
    typeof item.creadoEn === "string" &&
    typeof item.actualizadoEn === "string"
  );
}

export function normalizePACI(raw: PACI): PACI {
  return {
    ...raw,
    periodoLabel: raw.periodoLabel.trim(),
    periodoInicio: raw.periodoInicio?.trim() || undefined,
    periodoFin: raw.periodoFin?.trim() || undefined,
    evaluacionReferenciaId: raw.evaluacionReferenciaId?.trim() || undefined,
    sintesisInstitucional: raw.sintesisInstitucional?.trim() || undefined,
    paciAnteriorId: raw.paciAnteriorId?.trim() || undefined,
  };
}

export function readPACIs(): PACI[] {
  const parsed = getStorageAdapter().read<unknown>(PACI_STORAGE_KEY);

  const valid: PACI[] = [];
  for (const item of parsed) {
    if (!isPACI(item)) continue;
    valid.push(normalizePACI(item));
  }

  if (process.env.NODE_ENV === "development" && valid.length !== parsed.length) {
    console.debug(
      "[readPACIs] registros descartados:",
      parsed.length - valid.length
    );
  }

  return valid;
}

export function writePACIs(items: PACI[]): void {
  getStorageAdapter().write(PACI_STORAGE_KEY, items);
}
