const MS_POR_DIA = 24 * 60 * 60 * 1000;

const MESES_ES: Record<string, number> = {
  ene: 0,
  feb: 1,
  mar: 2,
  abr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dic: 11,
};

export function startOfTodayMs(): number {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
}

/**
 * Parsea fechas institucionales en ISO, YYYY-MM-DD o formato display español (ej. «9 jun 2026»).
 */
export function parseFechaInstitucional(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const iso = Date.parse(trimmed);
  if (Number.isFinite(iso)) {
    return new Date(iso);
  }

  const isoDate = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoDate) {
    return new Date(
      Number(isoDate[1]),
      Number(isoDate[2]) - 1,
      Number(isoDate[3]),
      12,
      0,
      0
    );
  }

  const display = trimmed.match(/^(\d{1,2})\s+([a-záéíóúñ]+)\.?\s+(\d{4})$/i);
  if (display) {
    const monthKey = display[2].slice(0, 3).toLowerCase();
    const month = MESES_ES[monthKey];
    if (month === undefined) return null;
    return new Date(
      Number(display[3]),
      month,
      Number(display[1]),
      12,
      0,
      0
    );
  }

  return null;
}

/** Timestamp para orden cronológico; 0 si la fecha no es interpretable. */
export function parseFechaOrdenInstitucional(value: string): number {
  const parsed = parseFechaInstitucional(value);
  return parsed ? parsed.getTime() : 0;
}

export function isWithinDays(
  fechaOrden: number,
  days: number,
  referenceStartMs: number = startOfTodayMs()
): boolean {
  if (fechaOrden <= 0) return false;
  return fechaOrden >= referenceStartMs - days * MS_POR_DIA;
}

export function diasDesdeInstitucional(
  fechaOrden: number,
  referenceStartMs: number = startOfTodayMs()
): number {
  if (fechaOrden <= 0) return 0;
  return Math.max(0, Math.round((referenceStartMs - fechaOrden) / MS_POR_DIA));
}
