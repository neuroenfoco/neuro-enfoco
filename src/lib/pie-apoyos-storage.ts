export interface ApoyoImplementado {
  id: string;
  objetivoId: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaTermino?: string;
}

export type ApoyosPorObjetivo = {
  objetivoId: string;
  activos: ApoyoImplementado[];
  historico: ApoyoImplementado[];
  totalImplementados: number;
};

/** Base analítica para correlacionar apoyos con resultados del objetivo. */
export type ApoyoAnaliticaBase = {
  apoyoId: string;
  objetivoId: string;
  nombre: string;
  activo: boolean;
  fechaInicio: string;
  fechaTermino?: string;
  duracionDias: number | null;
};

const STORAGE_KEY = "neuro-enfoco-apoyos-pie";

function isApoyoImplementado(value: unknown): value is ApoyoImplementado {
  if (!value || typeof value !== "object") return false;

  const apoyo = value as Record<string, unknown>;

  return (
    typeof apoyo.id === "string" &&
    typeof apoyo.objetivoId === "string" &&
    typeof apoyo.nombre === "string" &&
    typeof apoyo.descripcion === "string" &&
    typeof apoyo.fechaInicio === "string" &&
    (typeof apoyo.fechaTermino === "string" || apoyo.fechaTermino === undefined)
  );
}

function readApoyos(): ApoyoImplementado[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isApoyoImplementado);
  } catch {
    return [];
  }
}

function writeApoyos(apoyos: ApoyoImplementado[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(apoyos));
}

function parseApoyoFecha(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatApoyoFechaDisplay(value: string): string {
  const parsed = parseApoyoFecha(value);
  if (!parsed) return value;

  return parsed.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function apoyoFechaToInputValue(value?: string): string {
  if (!value?.trim()) return "";

  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const parsed = parseApoyoFecha(trimmed);
  if (!parsed) return "";

  return parsed.toISOString().slice(0, 10);
}

export function inputValueToApoyoFecha(value: string): string {
  return new Date(`${value.trim()}T12:00:00`).toISOString();
}

export function isApoyoActivo(apoyo: ApoyoImplementado, today = new Date()): boolean {
  if (!apoyo.fechaTermino?.trim()) return true;

  const termino = parseApoyoFecha(apoyo.fechaTermino);
  if (!termino) return true;

  return startOfDay(termino) >= startOfDay(today);
}

function getDuracionDias(apoyo: ApoyoImplementado, today = new Date()): number | null {
  const inicio = parseApoyoFecha(apoyo.fechaInicio);
  if (!inicio) return null;

  const fin = apoyo.fechaTermino?.trim()
    ? parseApoyoFecha(apoyo.fechaTermino)
  : startOfDay(today);

  if (!fin) return null;

  const diffMs = startOfDay(fin).getTime() - startOfDay(inicio).getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
}

export function getApoyoAnaliticaBase(
  apoyo: ApoyoImplementado
): ApoyoAnaliticaBase {
  const activo = isApoyoActivo(apoyo);

  return {
    apoyoId: apoyo.id,
    objetivoId: apoyo.objetivoId,
    nombre: apoyo.nombre,
    activo,
    fechaInicio: apoyo.fechaInicio,
    fechaTermino: apoyo.fechaTermino,
    duracionDias: getDuracionDias(apoyo),
  };
}

export function getApoyosByObjetivoId(objetivoId: string): ApoyoImplementado[] {
  return readApoyos().filter((apoyo) => apoyo.objetivoId === objetivoId);
}

export function getApoyosPorObjetivo(objetivoId: string): ApoyosPorObjetivo {
  const apoyos = getApoyosByObjetivoId(objetivoId).sort((left, right) => {
    const leftTime = parseApoyoFecha(left.fechaInicio)?.getTime() ?? 0;
    const rightTime = parseApoyoFecha(right.fechaInicio)?.getTime() ?? 0;
    return rightTime - leftTime;
  });

  const activos: ApoyoImplementado[] = [];
  const historico: ApoyoImplementado[] = [];

  for (const apoyo of apoyos) {
    if (isApoyoActivo(apoyo)) {
      activos.push(apoyo);
    } else {
      historico.push(apoyo);
    }
  }

  return {
    objetivoId,
    activos,
    historico,
    totalImplementados: apoyos.length,
  };
}

export function getApoyosAnaliticaByObjetivoId(
  objetivoId: string
): ApoyoAnaliticaBase[] {
  return getApoyosByObjetivoId(objetivoId).map(getApoyoAnaliticaBase);
}

export function saveApoyoImplementado(input: {
  objetivoId: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaTermino?: string;
}): ApoyoImplementado {
  const apoyo: ApoyoImplementado = {
    id: crypto.randomUUID(),
    objetivoId: input.objetivoId,
    nombre: input.nombre.trim(),
    descripcion: input.descripcion.trim(),
    fechaInicio: input.fechaInicio,
    fechaTermino: input.fechaTermino,
  };

  writeApoyos([apoyo, ...readApoyos()]);
  return apoyo;
}

export function deleteApoyoImplementado(apoyoId: string): boolean {
  if (typeof window === "undefined") return false;

  const existing = readApoyos();
  const next = existing.filter((apoyo) => apoyo.id !== apoyoId);
  if (next.length === existing.length) return false;

  writeApoyos(next);
  return true;
}

export function deleteApoyosByObjetivoId(objetivoId: string): number {
  if (typeof window === "undefined") return 0;

  const existing = readApoyos();
  const next = existing.filter((apoyo) => apoyo.objetivoId !== objetivoId);
  const removedCount = existing.length - next.length;

  if (removedCount > 0) {
    writeApoyos(next);
  }

  return removedCount;
}

export function deleteApoyosByObjetivoIds(objetivoIds: string[]): number {
  if (objetivoIds.length === 0) return 0;

  const ids = new Set(objetivoIds);
  const existing = readApoyos();
  const next = existing.filter((apoyo) => !ids.has(apoyo.objetivoId));
  const removedCount = existing.length - next.length;

  if (removedCount > 0) {
    writeApoyos(next);
  }

  return removedCount;
}
