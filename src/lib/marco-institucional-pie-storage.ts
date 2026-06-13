export type EstadoPIE = "ingreso" | "seguimiento";

export interface MarcoInstitucionalPIE {
  estudianteId: string;
  estadoPIE: EstadoPIE;
  fechaIngresoPIE: string;
  fechaProximaReevaluacionIntegral?: string;
  tipoNEE?: string;
  diagnosticoPrincipal?: string;
  referenciaEvaluacionPrevia?: string;
  observacionesInstitucionales?: string;
  creadoEn: string;
  actualizadoEn: string;
}

export type SaveMarcoInstitucionalPIEInput = {
  estudianteId: string;
  estadoPIE?: EstadoPIE;
  fechaIngresoPIE: string;
  fechaProximaReevaluacionIntegral?: string;
  tipoNEE?: string;
  diagnosticoPrincipal?: string;
  referenciaEvaluacionPrevia?: string;
  observacionesInstitucionales?: string;
};

const STORAGE_KEY = "neuro-enfoco-marco-institucional-pie";

const ESTADOS_PIE: EstadoPIE[] = ["ingreso", "seguimiento"];

function nowIso(): string {
  return new Date().toISOString();
}

function isEstadoPIE(value: string): value is EstadoPIE {
  return ESTADOS_PIE.includes(value as EstadoPIE);
}

function isMarcoInstitucionalPIE(value: unknown): value is MarcoInstitucionalPIE {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.estudianteId === "string" &&
    typeof item.estadoPIE === "string" &&
    isEstadoPIE(item.estadoPIE) &&
    typeof item.fechaIngresoPIE === "string" &&
    (typeof item.fechaProximaReevaluacionIntegral === "string" ||
      item.fechaProximaReevaluacionIntegral === undefined) &&
    (typeof item.tipoNEE === "string" || item.tipoNEE === undefined) &&
    (typeof item.diagnosticoPrincipal === "string" ||
      item.diagnosticoPrincipal === undefined) &&
    (typeof item.referenciaEvaluacionPrevia === "string" ||
      item.referenciaEvaluacionPrevia === undefined) &&
    (typeof item.observacionesInstitucionales === "string" ||
      item.observacionesInstitucionales === undefined) &&
    typeof item.creadoEn === "string" &&
    typeof item.actualizadoEn === "string"
  );
}

function readMarcos(): MarcoInstitucionalPIE[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isMarcoInstitucionalPIE);
  } catch {
    return [];
  }
}

function writeMarcos(marcos: MarcoInstitucionalPIE[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(marcos));
}

function trimOptional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Compara fechas por día calendario (acepta YYYY-MM-DD o ISO). */
export function compareFechasPorDia(left: string, right: string): number {
  const leftTime = startOfDayTimestamp(left);
  const rightTime = startOfDayTimestamp(right);
  if (!Number.isFinite(leftTime) || !Number.isFinite(rightTime)) return NaN;
  return leftTime - rightTime;
}

function startOfDayTimestamp(value: string): number {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number);
    return new Date(year, month - 1, day).getTime();
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return NaN;
  return new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate()
  ).getTime();
}

export function validateFechasMarco(input: {
  fechaIngresoPIE: string;
  fechaProximaReevaluacionIntegral?: string;
}): string | null {
  if (!input.fechaIngresoPIE.trim()) {
    return "La fecha de ingreso PIE es obligatoria.";
  }

  if (Number.isNaN(startOfDayTimestamp(input.fechaIngresoPIE))) {
    return "La fecha de ingreso PIE no es válida.";
  }

  const proxima = input.fechaProximaReevaluacionIntegral?.trim();
  if (!proxima) return null;

  if (Number.isNaN(startOfDayTimestamp(proxima))) {
    return "La fecha de próxima reevaluación integral no es válida.";
  }

  if (compareFechasPorDia(proxima, input.fechaIngresoPIE) < 0) {
    return "La próxima reevaluación integral debe ser igual o posterior al ingreso PIE.";
  }

  return null;
}

export function normalizeFechaIngresoPIE(value: string): string {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0).toISOString();
  }
  return trimmed;
}

export function getMarcoInstitucionalPIEByEstudianteId(
  estudianteId: string
): MarcoInstitucionalPIE | null {
  return (
    readMarcos().find((item) => item.estudianteId === estudianteId) ?? null
  );
}

export function saveMarcoInstitucionalPIE(
  input: SaveMarcoInstitucionalPIEInput
): MarcoInstitucionalPIE {
  const timestamp = nowIso();
  const marcos = readMarcos();
  const index = marcos.findIndex((item) => item.estudianteId === input.estudianteId);

  const payload: MarcoInstitucionalPIE = {
    estudianteId: input.estudianteId,
    estadoPIE: input.estadoPIE ?? "ingreso",
    fechaIngresoPIE: normalizeFechaIngresoPIE(input.fechaIngresoPIE),
    fechaProximaReevaluacionIntegral: input.fechaProximaReevaluacionIntegral
      ? normalizeFechaIngresoPIE(input.fechaProximaReevaluacionIntegral)
      : undefined,
    tipoNEE: trimOptional(input.tipoNEE),
    diagnosticoPrincipal: trimOptional(input.diagnosticoPrincipal),
    referenciaEvaluacionPrevia: trimOptional(input.referenciaEvaluacionPrevia),
    observacionesInstitucionales: trimOptional(input.observacionesInstitucionales),
    creadoEn: index === -1 ? timestamp : marcos[index].creadoEn,
    actualizadoEn: timestamp,
  };

  if (index === -1) {
    writeMarcos([payload, ...marcos]);
  } else {
    const next = [...marcos];
    next[index] = payload;
    writeMarcos(next);
  }

  return payload;
}

export function deleteMarcoInstitucionalPIEByEstudianteId(
  estudianteId: string
): boolean {
  const marcos = readMarcos();
  const next = marcos.filter((item) => item.estudianteId !== estudianteId);
  if (next.length === marcos.length) return false;
  writeMarcos(next);
  return true;
}

export function formatMarcoFechaDisplay(iso: string): string {
  const trimmed = iso.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);
    return parsed.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
