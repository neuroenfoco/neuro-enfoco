import type { ParticipacionProfesionalEstudiante } from "@/lib/institucional/participaciones-profesional-estudiante-storage";

export type EstadoVigenciaParticipacion =
  | "vigente"
  | "finalizada"
  | "programada";

type ParticipacionVigenciaFields = Pick<
  ParticipacionProfesionalEstudiante,
  "fechaInicio" | "fechaTermino"
>;

export function todayParticipacionDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isValidParticipacionFechas(
  fechaInicio: string,
  fechaTermino?: string
): boolean {
  const inicio = fechaInicio.trim();
  if (!inicio) return false;
  if (!fechaTermino?.trim()) return true;
  return fechaTermino.trim() >= inicio;
}

export function resolverEstadoVigencia(
  participacion: ParticipacionVigenciaFields,
  refDate: string = todayParticipacionDate()
): EstadoVigenciaParticipacion {
  const inicio = participacion.fechaInicio.trim();
  const termino = participacion.fechaTermino?.trim();

  if (termino && termino < refDate) {
    return "finalizada";
  }

  if (inicio > refDate) {
    return "programada";
  }

  return "vigente";
}

export function isParticipacionActiva(
  participacion: ParticipacionVigenciaFields,
  refDate: string = todayParticipacionDate()
): boolean {
  return resolverEstadoVigencia(participacion, refDate) !== "finalizada";
}
