import {
  getRolProfesionalById,
  isRolProfesionalId,
  type RolProfesionalId,
} from "@/lib/institucional/roles-profesional-catalog";
import { getIntervenciones } from "@/lib/intervenciones-storage";
import { getSesiones } from "@/lib/sessions-storage";
import { readApoyosPIE } from "@/lib/apoyos/apoyos-persistence";

/**
 * ID histórico usado antes de la entidad Profesional.
 * Se conserva como id del profesional semilla de transición.
 */
export const DEFAULT_PROFESIONAL_ID = "profesional-local";

export type Profesional = {
  id: string;
  nombres: string;
  apellidos: string;
  rolPrincipalId: RolProfesionalId;
  email?: string;
  activo: boolean;
  creadoEn: string;
  actualizadoEn: string;
};

const STORAGE_KEY = "neuro-enfoco-profesionales";

function nowIso(): string {
  return new Date().toISOString();
}

function isProfesional(value: unknown): value is Profesional {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.nombres === "string" &&
    typeof item.apellidos === "string" &&
    typeof item.rolPrincipalId === "string" &&
    isRolProfesionalId(item.rolPrincipalId) &&
    (typeof item.email === "string" || item.email === undefined) &&
    typeof item.activo === "boolean" &&
    typeof item.creadoEn === "string" &&
    typeof item.actualizadoEn === "string"
  );
}

function readProfesionales(): Profesional[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isProfesional);
  } catch {
    return [];
  }
}

function writeProfesionales(profesionales: Profesional[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profesionales));
}

function createSeedProfesionalDefault(): Profesional {
  const timestamp = nowIso();

  return {
    id: DEFAULT_PROFESIONAL_ID,
    nombres: "Equipo",
    apellidos: "escolar",
    rolPrincipalId: "coordinador_pie",
    activo: true,
    creadoEn: timestamp,
    actualizadoEn: timestamp,
  };
}

/** Garantiza al menos el profesional de transición `profesional-local`. */
export function ensureSeedProfesionales(): void {
  if (typeof window === "undefined") return;

  const existing = readProfesionales();
  if (existing.some((item) => item.id === DEFAULT_PROFESIONAL_ID)) return;

  writeProfesionales([createSeedProfesionalDefault(), ...existing]);
}

export function getProfesionales(): Profesional[] {
  ensureSeedProfesionales();
  return readProfesionales().sort((a, b) =>
    formatProfesionalNombreCompleto(a).localeCompare(
      formatProfesionalNombreCompleto(b),
      "es"
    )
  );
}

export function getProfesionalesActivos(): Profesional[] {
  return getProfesionales().filter((item) => item.activo);
}

export function getProfesionalById(id: string): Profesional | undefined {
  ensureSeedProfesionales();
  return readProfesionales().find((item) => item.id === id);
}

export function formatProfesionalNombreCompleto(
  profesional: Pick<Profesional, "nombres" | "apellidos">
): string {
  return `${profesional.nombres.trim()} ${profesional.apellidos.trim()}`.trim();
}

export function getDefaultProfesionalId(): string {
  ensureSeedProfesionales();
  return DEFAULT_PROFESIONAL_ID;
}

export function saveProfesional(input: {
  id?: string;
  nombres: string;
  apellidos: string;
  rolPrincipalId: RolProfesionalId;
  email?: string;
  activo?: boolean;
}): Profesional | null {
  if (!isRolProfesionalId(input.rolPrincipalId)) return null;

  const nombres = input.nombres.trim();
  const apellidos = input.apellidos.trim();
  if (!nombres || !apellidos) return null;

  const existing = readProfesionales();
  const timestamp = nowIso();
  const id = input.id?.trim() || crypto.randomUUID();

  const profesional: Profesional = {
    id,
    nombres,
    apellidos,
    rolPrincipalId: input.rolPrincipalId,
    email: input.email?.trim() || undefined,
    activo: input.activo ?? true,
    creadoEn: timestamp,
    actualizadoEn: timestamp,
  };

  const index = existing.findIndex((item) => item.id === id);
  if (index >= 0) {
    profesional.creadoEn = existing[index].creadoEn;
  }

  const next =
    index >= 0
      ? existing.map((item, itemIndex) =>
          itemIndex === index ? profesional : item
        )
      : [profesional, ...existing];

  writeProfesionales(next);
  return profesional;
}

export function updateProfesional(
  id: string,
  input: {
    nombres?: string;
    apellidos?: string;
    rolPrincipalId?: RolProfesionalId;
    email?: string;
    activo?: boolean;
  }
): Profesional | null {
  const existing = readProfesionales();
  const index = existing.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const current = existing[index];

  if (
    input.rolPrincipalId !== undefined &&
    !isRolProfesionalId(input.rolPrincipalId)
  ) {
    return null;
  }

  const nombres =
    input.nombres !== undefined ? input.nombres.trim() : current.nombres;
  const apellidos =
    input.apellidos !== undefined ? input.apellidos.trim() : current.apellidos;

  if (!nombres || !apellidos) return null;

  const updated: Profesional = {
    ...current,
    nombres,
    apellidos,
    rolPrincipalId: input.rolPrincipalId ?? current.rolPrincipalId,
    email:
      input.email !== undefined
        ? input.email.trim() || undefined
        : current.email,
    activo: input.activo ?? current.activo,
    actualizadoEn: nowIso(),
  };

  const next = existing.map((item, itemIndex) =>
    itemIndex === index ? updated : item
  );
  writeProfesionales(next);
  return updated;
}

export function getProfesionalRolNombre(profesional: Profesional): string {
  return getRolProfesionalById(profesional.rolPrincipalId)?.nombre ?? "";
}

const PARTICIPACIONES_EQUIPO_STORAGE_KEY =
  "neuro-enfoco-participaciones-profesional-estudiante";
const PARTICIPACIONES_EVALUACION_STORAGE_KEY =
  "neuro-enfoco-participaciones-evaluacion-integral";

function readJsonArrayFromStorage(key: string): unknown[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function storageArrayReferencesProfesionalId(
  items: unknown[],
  profesionalId: string
): boolean {
  return items.some(
    (item) =>
      !!item &&
      typeof item === "object" &&
      (item as Record<string, unknown>).profesionalId === profesionalId
  );
}

export function profesionalTieneReferencias(profesionalId: string): boolean {
  const id = profesionalId.trim();
  if (!id) return false;

  if (getIntervenciones().some((item) => item.profesionalId === id)) {
    return true;
  }

  if (
    getSesiones().some(
      (item) => item.profesionalId !== undefined && item.profesionalId === id
    )
  ) {
    return true;
  }

  if (
    storageArrayReferencesProfesionalId(
      readJsonArrayFromStorage(PARTICIPACIONES_EQUIPO_STORAGE_KEY),
      id
    )
  ) {
    return true;
  }

  if (
    storageArrayReferencesProfesionalId(
      readJsonArrayFromStorage(PARTICIPACIONES_EVALUACION_STORAGE_KEY),
      id
    )
  ) {
    return true;
  }

  if (
    readApoyosPIE().some((item) => item.responsableProfesionalId === id)
  ) {
    return true;
  }

  return false;
}

export type DeleteProfesionalResult =
  | { ok: true }
  | { ok: false; error: string };

export function deleteProfesional(id: string): DeleteProfesionalResult {
  if (typeof window === "undefined") {
    return { ok: false, error: "Solo disponible en el cliente." };
  }

  const trimmed = id.trim();
  if (!trimmed) {
    return { ok: false, error: "Profesional no encontrado." };
  }

  if (trimmed === DEFAULT_PROFESIONAL_ID) {
    return {
      ok: false,
      error:
        "No es posible eliminar el registro de transición del establecimiento.",
    };
  }

  const existing = readProfesionales();
  if (!existing.some((item) => item.id === trimmed)) {
    return { ok: false, error: "Profesional no encontrado." };
  }

  if (profesionalTieneReferencias(trimmed)) {
    return {
      ok: false,
      error:
        "No es posible eliminar este profesional porque está siendo utilizado en registros existentes.",
    };
  }

  writeProfesionales(existing.filter((item) => item.id !== trimmed));
  return { ok: true };
}
