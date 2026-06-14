import type {
  ApoyoPIE,
  ApoyoPIEEstado,
  ApoyoPIETipo,
} from "@/lib/apoyos/apoyos-types";
import { getStorageAdapter } from "@/lib/core/browser-storage-adapter";

export const APOYOS_PIE_STORAGE_KEY = "neuro-enfoco-apoyos-implementados";

const TIPOS: ApoyoPIETipo[] = [
  "adaptacion_acceso",
  "adaptacion_curricular",
  "apoyo_emocional",
  "apoyo_sensorial",
  "apoyo_comunicacion",
  "apoyo_conductual",
  "otro",
];

const ESTADOS: ApoyoPIEEstado[] = ["activo", "suspendido", "finalizado"];

function isApoyoPIETipo(value: string): value is ApoyoPIETipo {
  return TIPOS.includes(value as ApoyoPIETipo);
}

function isApoyoPIEEstado(value: string): value is ApoyoPIEEstado {
  return ESTADOS.includes(value as ApoyoPIEEstado);
}

export function isApoyoPIE(value: unknown): value is ApoyoPIE {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.estudianteId === "string" &&
    (typeof item.objetivoPieId === "string" || item.objetivoPieId === undefined) &&
    typeof item.nombre === "string" &&
    typeof item.tipo === "string" &&
    isApoyoPIETipo(item.tipo) &&
    (typeof item.descripcion === "string" || item.descripcion === undefined) &&
    (typeof item.responsable === "string" || item.responsable === undefined) &&
    (typeof item.frecuencia === "string" || item.frecuencia === undefined) &&
    typeof item.estado === "string" &&
    isApoyoPIEEstado(item.estado) &&
    typeof item.creadoEn === "string" &&
    typeof item.actualizadoEn === "string"
  );
}

export function normalizeApoyoPIE(raw: ApoyoPIE): ApoyoPIE {
  return {
    ...raw,
    nombre: raw.nombre.trim(),
    descripcion: raw.descripcion?.trim() || undefined,
    responsable: raw.responsable?.trim() || undefined,
    frecuencia: raw.frecuencia?.trim() || undefined,
    objetivoPieId: raw.objetivoPieId?.trim() || undefined,
  };
}

export function readApoyosPIE(): ApoyoPIE[] {
  const parsed = getStorageAdapter().read<unknown>(APOYOS_PIE_STORAGE_KEY);

  const valid: ApoyoPIE[] = [];
  for (const item of parsed) {
    if (!isApoyoPIE(item)) continue;
    valid.push(normalizeApoyoPIE(item));
  }

  if (process.env.NODE_ENV === "development" && valid.length !== parsed.length) {
    console.debug(
      "[readApoyosPIE] registros descartados:",
      parsed.length - valid.length
    );
  }

  return valid;
}

export function writeApoyosPIE(items: ApoyoPIE[]): void {
  getStorageAdapter().write(APOYOS_PIE_STORAGE_KEY, items);
}
