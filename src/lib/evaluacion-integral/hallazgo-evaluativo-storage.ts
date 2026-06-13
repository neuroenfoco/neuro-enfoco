import type { CatalogKind } from "@/lib/catalogos/catalog-types";
import { CATALOGO_OTRO_ID } from "@/lib/catalogos/catalog-types";
import {
  normalizeHallazgoNombre,
  type HallazgoTipo,
} from "@/lib/perfil-hallazgos-storage";
import type {
  HallazgoEvaluativo,
  SaveHallazgoEvaluativoInput,
  UpdateHallazgoEvaluativoInput,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";
import { getEvaluacionIntegralById } from "@/lib/evaluacion-integral/evaluacion-integral-persistence";
import {
  detachHallazgoFromConclusiones,
  hallazgoEsUnicoSustentoDeConclusion,
} from "@/lib/evaluacion-integral/conclusion-evaluativa-persistence";
import { puedeEditarEvaluacionIntegral } from "@/lib/evaluacion-integral/evaluacion-integral-validacion";

const STORAGE_KEY = "neuro-enfoco-hallazgos-evaluativos";

const HALLAZGO_TIPOS: HallazgoTipo[] = [
  "fortaleza",
  "interes",
  "barrera",
  "contexto_exito",
];

const CATALOG_KINDS: CatalogKind[] = [
  "fortalezas",
  "intereses",
  "contextos_exito",
  "condiciones_participacion",
];

function nowIso(): string {
  return new Date().toISOString();
}

function isHallazgoTipo(value: string): value is HallazgoTipo {
  return HALLAZGO_TIPOS.includes(value as HallazgoTipo);
}

function isCatalogKind(value: string): value is CatalogKind {
  return CATALOG_KINDS.includes(value as CatalogKind);
}

function trimOptional(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

function isHallazgoEvaluativo(value: unknown): value is HallazgoEvaluativo {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.evaluacionIntegralId === "string" &&
    typeof item.estudianteId === "string" &&
    typeof item.tipo === "string" &&
    isHallazgoTipo(item.tipo) &&
    typeof item.nombre === "string" &&
    (typeof item.catalogoKind === "string"
      ? isCatalogKind(item.catalogoKind)
      : item.catalogoKind === undefined) &&
    (typeof item.catalogoId === "string" || item.catalogoId === undefined) &&
    (typeof item.formulacionOriginal === "string" ||
      item.formulacionOriginal === undefined) &&
    (typeof item.hallazgoPerfilId === "string" ||
      item.hallazgoPerfilId === undefined) &&
    (typeof item.consolidadoEn === "string" ||
      item.consolidadoEn === undefined) &&
    typeof item.creadoEn === "string" &&
    typeof item.actualizadoEn === "string"
  );
}

function readHallazgosEvaluativos(): HallazgoEvaluativo[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHallazgoEvaluativo);
  } catch {
    return [];
  }
}

function writeHallazgosEvaluativos(items: HallazgoEvaluativo[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getHallazgosEvaluativosByEvaluacionId(
  evaluacionIntegralId: string
): HallazgoEvaluativo[] {
  return readHallazgosEvaluativos().filter(
    (item) => item.evaluacionIntegralId === evaluacionIntegralId
  );
}

export function getHallazgoEvaluativoById(
  id: string
): HallazgoEvaluativo | null {
  return readHallazgosEvaluativos().find((item) => item.id === id) ?? null;
}

export function saveHallazgoEvaluativo(
  input: SaveHallazgoEvaluativoInput
): HallazgoEvaluativo | null {
  const evaluacion = getEvaluacionIntegralById(input.evaluacionIntegralId);
  if (!evaluacion) return null;
  if (!puedeEditarEvaluacionIntegral(evaluacion)) return null;
  if (evaluacion.estudianteId !== input.estudianteId.trim()) return null;

  const nombre = normalizeHallazgoNombre(input.nombre);
  if (!nombre) return null;

  const timestamp = nowIso();
  const hallazgo: HallazgoEvaluativo = {
    id: crypto.randomUUID(),
    evaluacionIntegralId: input.evaluacionIntegralId,
    estudianteId: input.estudianteId.trim(),
    tipo: input.tipo,
    nombre,
    catalogoKind: input.catalogoKind,
    catalogoId:
      input.catalogoId && input.catalogoId !== CATALOGO_OTRO_ID
        ? input.catalogoId
        : undefined,
    formulacionOriginal: trimOptional(input.formulacionOriginal),
    creadoEn: timestamp,
    actualizadoEn: timestamp,
  };

  writeHallazgosEvaluativos([hallazgo, ...readHallazgosEvaluativos()]);
  return hallazgo;
}

export function updateHallazgoEvaluativo(
  id: string,
  input: UpdateHallazgoEvaluativoInput
): HallazgoEvaluativo | null {
  const items = readHallazgosEvaluativos();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const current = items[index];
  const evaluacion = getEvaluacionIntegralById(current.evaluacionIntegralId);
  if (!evaluacion || !puedeEditarEvaluacionIntegral(evaluacion)) return null;
  if (current.consolidadoEn) return null;

  const nombre = input.nombre
    ? normalizeHallazgoNombre(input.nombre)
    : current.nombre;
  if (!nombre) return null;

  const updated: HallazgoEvaluativo = {
    ...current,
    nombre,
    catalogoKind: input.catalogoKind ?? current.catalogoKind,
    catalogoId:
      input.catalogoId !== undefined
        ? input.catalogoId && input.catalogoId !== CATALOGO_OTRO_ID
          ? input.catalogoId
          : undefined
        : current.catalogoId,
    formulacionOriginal:
      input.formulacionOriginal !== undefined
        ? trimOptional(input.formulacionOriginal)
        : current.formulacionOriginal,
    actualizadoEn: nowIso(),
  };

  const next = [...items];
  next[index] = updated;
  writeHallazgosEvaluativos(next);
  return updated;
}

export function deleteHallazgoEvaluativo(id: string): boolean {
  const items = readHallazgosEvaluativos();
  const target = items.find((item) => item.id === id);
  if (!target) return false;

  const evaluacion = getEvaluacionIntegralById(target.evaluacionIntegralId);
  if (!evaluacion || !puedeEditarEvaluacionIntegral(evaluacion)) return false;
  if (target.consolidadoEn) return false;

  if (
    hallazgoEsUnicoSustentoDeConclusion(
      target.evaluacionIntegralId,
      id
    )
  ) {
    return false;
  }

  const detach = detachHallazgoFromConclusiones(
    target.evaluacionIntegralId,
    id
  );
  if (detach.conclusionesSinSustento.length > 0) return false;

  writeHallazgosEvaluativos(items.filter((item) => item.id !== id));
  return true;
}

export function vincularHallazgoEvaluativoAPerfil(
  hallazgoEvaluativoId: string,
  hallazgoPerfilId: string,
  consolidadoEn: string
): HallazgoEvaluativo | null {
  const items = readHallazgosEvaluativos();
  const index = items.findIndex((item) => item.id === hallazgoEvaluativoId);
  if (index === -1) return null;

  const updated: HallazgoEvaluativo = {
    ...items[index],
    hallazgoPerfilId,
    consolidadoEn,
    actualizadoEn: nowIso(),
  };

  const next = [...items];
  next[index] = updated;
  writeHallazgosEvaluativos(next);
  return updated;
}

export function deleteHallazgosEvaluativosByEvaluacionId(
  evaluacionIntegralId: string
): number {
  const items = readHallazgosEvaluativos();
  const remaining = items.filter(
    (item) => item.evaluacionIntegralId !== evaluacionIntegralId
  );
  const removed = items.length - remaining.length;
  if (removed > 0) writeHallazgosEvaluativos(remaining);
  return removed;
}

export function deleteHallazgosEvaluativosByEstudianteId(
  estudianteId: string
): number {
  const items = readHallazgosEvaluativos();
  const remaining = items.filter((item) => item.estudianteId !== estudianteId);
  const removed = items.length - remaining.length;
  if (removed > 0) writeHallazgosEvaluativos(remaining);
  return removed;
}
