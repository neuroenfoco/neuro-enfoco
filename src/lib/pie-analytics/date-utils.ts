import { MS_POR_DIA, MS_POR_SEMANA } from "@/lib/pie-analytics/constants";

export function parseAnalyticsFecha(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function diffDias(left: Date, right: Date): number {
  return Math.round(
    (startOfDay(right).getTime() - startOfDay(left).getTime()) / MS_POR_DIA
  );
}

export function subtractSemanas(date: Date, semanas: number): Date {
  return new Date(date.getTime() - semanas * MS_POR_SEMANA);
}

export function isFechaEnRango(
  fecha: Date,
  inicio: Date,
  fin: Date
): boolean {
  const value = startOfDay(fecha).getTime();
  return (
    value >= startOfDay(inicio).getTime() && value <= startOfDay(fin).getTime()
  );
}

export function countSemanasUnicas(fechas: Date[]): number {
  const semanas = new Set<string>();

  for (const fecha of fechas) {
    const start = startOfDay(fecha);
    const weekKey = `${start.getFullYear()}-W${Math.floor(
      (start.getTime() - new Date(start.getFullYear(), 0, 1).getTime()) /
        MS_POR_SEMANA
    )}`;
    semanas.add(weekKey);
  }

  return semanas.size;
}
