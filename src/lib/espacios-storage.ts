import {
  buildEspacioSeedId,
  getCatalogoTiposEspacio,
  getTipoEspacioById,
  isTipoEspacioId,
  resolveEspacioId,
  resolveTipoEspacioId,
  type TipoEspacioId,
} from "@/lib/espacios-catalog";

export { resolveEspacioId } from "@/lib/espacios-catalog";

export interface Espacio {
  id: string;
  nombre: string;
  tipoEspacio: TipoEspacioId;
  descripcion: string;
  activo: boolean;
}

export type EspacioResumen = {
  espacio: Espacio;
  totalIntervenciones: number;
};

const STORAGE_KEY = "neuro-enfoco-espacios";

function isEspacio(value: unknown): value is Espacio {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.nombre === "string" &&
    typeof item.tipoEspacio === "string" &&
    isTipoEspacioId(item.tipoEspacio) &&
    typeof item.descripcion === "string" &&
    typeof item.activo === "boolean"
  );
}

function normalizeEspacioStored(item: Espacio): Espacio {
  const resolvedId = resolveEspacioId(item.id) ?? item.id;
  const tipoResuelto = resolveTipoEspacioId(item.tipoEspacio) ?? item.tipoEspacio;

  return {
    ...item,
    id: resolvedId,
    tipoEspacio: tipoResuelto,
  };
}

function readEspacios(): Espacio[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isEspacio).map(normalizeEspacioStored);
  } catch {
    return [];
  }
}

function writeEspacios(espacios: Espacio[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(espacios));
}

function createSeedEspacio(tipoEspacio: TipoEspacioId): Espacio {
  const tipo = getTipoEspacioById(tipoEspacio);

  return {
    id: buildEspacioSeedId(tipoEspacio),
    nombre: tipo?.nombre ?? tipoEspacio,
    tipoEspacio,
    descripcion: tipo?.descripcion ?? "",
    activo: true,
  };
}

export function ensureSeedEspacios(): void {
  if (typeof window === "undefined") return;

  const existing = readEspacios();
  if (existing.length > 0) return;

  const seeds = getCatalogoTiposEspacio().map((tipo) =>
    createSeedEspacio(tipo.id)
  );
  writeEspacios(seeds);
}

export function getEspacios(): Espacio[] {
  if (typeof window === "undefined") return [];

  ensureSeedEspacios();
  return readEspacios();
}

export function getEspaciosActivos(): Espacio[] {
  return getEspacios().filter((espacio) => espacio.activo);
}

export function getEspacioById(espacioId: string): Espacio | null {
  const resolved = resolveEspacioId(espacioId);
  if (!resolved) return null;

  return getEspacios().find((espacio) => espacio.id === resolved) ?? null;
}

export function getEspacioNombre(espacioId?: string): string {
  if (!espacioId?.trim()) return "Sin espacio registrado";
  return getEspacioById(espacioId)?.nombre ?? espacioId;
}

export function getEspaciosByTipo(tipoEspacio: TipoEspacioId): Espacio[] {
  return getEspacios().filter((espacio) => espacio.tipoEspacio === tipoEspacio);
}

export function isEspacioDisponibleParaIntervencion(espacioId: string): boolean {
  const espacio = getEspacioById(espacioId);
  return Boolean(espacio?.activo);
}

export function saveEspacio(input: {
  nombre: string;
  tipoEspacio: TipoEspacioId;
  descripcion?: string;
  activo?: boolean;
}): Espacio | null {
  if (!isTipoEspacioId(input.tipoEspacio)) return null;

  const espacio: Espacio = {
    id: crypto.randomUUID(),
    nombre: input.nombre.trim(),
    tipoEspacio: input.tipoEspacio,
    descripcion: input.descripcion?.trim() ?? "",
    activo: input.activo ?? true,
  };

  writeEspacios([espacio, ...getEspacios()]);
  return espacio;
}

export function updateEspacio(
  espacioId: string,
  input: {
    nombre?: string;
    tipoEspacio?: TipoEspacioId;
    descripcion?: string;
    activo?: boolean;
  }
): Espacio | null {
  const existing = getEspacios();
  const resolved = resolveEspacioId(espacioId);
  if (!resolved) return null;

  const index = existing.findIndex((item) => item.id === resolved);
  if (index === -1) return null;

  if (input.tipoEspacio !== undefined && !isTipoEspacioId(input.tipoEspacio)) {
    return null;
  }

  const current = existing[index];
  const updated: Espacio = {
    ...current,
    nombre: input.nombre?.trim() ?? current.nombre,
    tipoEspacio: input.tipoEspacio ?? current.tipoEspacio,
    descripcion:
      input.descripcion !== undefined
        ? input.descripcion.trim()
        : current.descripcion,
    activo: input.activo ?? current.activo,
  };

  const next = [...existing];
  next[index] = updated;
  writeEspacios(next);
  return updated;
}

export function setEspacioActivo(espacioId: string, activo: boolean): Espacio | null {
  return updateEspacio(espacioId, { activo });
}

export function getEspacioResumen(
  espacio: Espacio,
  totalIntervenciones: number
): EspacioResumen {
  return {
    espacio,
    totalIntervenciones,
  };
}
