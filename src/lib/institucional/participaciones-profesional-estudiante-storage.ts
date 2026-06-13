import {
  isAmbitoEquipo,
  type AmbitoEquipo,
} from "@/lib/institucional/ambitos-equipo";
import {
  isParticipacionActiva,
  isValidParticipacionFechas,
  todayParticipacionDate,
} from "@/lib/institucional/participacion-vigencia";
import {
  getProfesionalById,
  type Profesional,
} from "@/lib/institucional/profesionales-storage";
import {
  isRolProfesionalId,
  type RolProfesionalId,
} from "@/lib/institucional/roles-profesional-catalog";

export type ParticipacionOrigen =
  | "manual"
  | "ingreso_pie"
  | "intervencion"
  | "evaluacion_integral"
  | "fudei_import";

const ORIGENES_PARTICIPACION: ParticipacionOrigen[] = [
  "manual",
  "ingreso_pie",
  "intervencion",
  "evaluacion_integral",
  "fudei_import",
];

export type ParticipacionProfesionalEstudiante = {
  id: string;
  estudianteId: string;
  profesionalId: string;
  rolId: RolProfesionalId;
  ambito: AmbitoEquipo;
  esResponsable: boolean;
  fechaInicio: string;
  fechaTermino?: string;
  origen: ParticipacionOrigen;
  notas?: string;
  creadoEn: string;
  actualizadoEn: string;
};

export type SaveParticipacionProfesionalEstudianteInput = {
  estudianteId: string;
  profesionalId: string;
  rolId: RolProfesionalId;
  ambito: AmbitoEquipo;
  esResponsable?: boolean;
  fechaInicio: string;
  fechaTermino?: string;
  origen?: ParticipacionOrigen;
  notas?: string;
};

export type UpdateParticipacionProfesionalEstudianteInput = {
  profesionalId?: string;
  rolId?: RolProfesionalId;
  ambito?: AmbitoEquipo;
  esResponsable?: boolean;
  fechaInicio?: string;
  fechaTermino?: string;
  notas?: string;
};

const STORAGE_KEY = "neuro-enfoco-participaciones-profesional-estudiante";

function nowIso(): string {
  return new Date().toISOString();
}

function isParticipacionOrigen(value: string): value is ParticipacionOrigen {
  return ORIGENES_PARTICIPACION.includes(value as ParticipacionOrigen);
}

function normalizeParticipacion(
  value: Record<string, unknown>
): ParticipacionProfesionalEstudiante | null {
  if (
    typeof value.id !== "string" ||
    typeof value.estudianteId !== "string" ||
    typeof value.profesionalId !== "string" ||
    typeof value.rolId !== "string" ||
    !isRolProfesionalId(value.rolId) ||
    typeof value.ambito !== "string" ||
    !isAmbitoEquipo(value.ambito) ||
    typeof value.esResponsable !== "boolean" ||
    typeof value.fechaInicio !== "string"
  ) {
    return null;
  }

  const fechaInicio = value.fechaInicio.trim();
  const fechaTermino =
    typeof value.fechaTermino === "string" && value.fechaTermino.trim()
      ? value.fechaTermino.trim()
      : undefined;
  const origenRaw =
    typeof value.origen === "string" && isParticipacionOrigen(value.origen)
      ? value.origen
      : "manual";
  const creadoEn =
    typeof value.creadoEn === "string" ? value.creadoEn : fechaInicio;
  const actualizadoEn =
    typeof value.actualizadoEn === "string"
      ? value.actualizadoEn
      : creadoEn;

  return {
    id: value.id,
    estudianteId: value.estudianteId,
    profesionalId: value.profesionalId,
    rolId: value.rolId,
    ambito: value.ambito,
    esResponsable: value.esResponsable,
    fechaInicio,
    fechaTermino,
    origen: origenRaw,
    notas:
      typeof value.notas === "string" && value.notas.trim()
        ? value.notas.trim()
        : undefined,
    creadoEn,
    actualizadoEn,
  };
}

function isParticipacionProfesionalEstudiante(
  value: unknown
): value is ParticipacionProfesionalEstudiante {
  if (!value || typeof value !== "object") return false;
  return normalizeParticipacion(value as Record<string, unknown>) !== null;
}

function readParticipaciones(): ParticipacionProfesionalEstudiante[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) =>
        item && typeof item === "object"
          ? normalizeParticipacion(item as Record<string, unknown>)
          : null
      )
      .filter((item): item is ParticipacionProfesionalEstudiante => item !== null);
  } catch {
    return [];
  }
}

function writeParticipaciones(items: ParticipacionProfesionalEstudiante[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function assertProfesionalActivo(profesionalId: string): Profesional {
  const profesional = getProfesionalById(profesionalId);
  if (!profesional) {
    throw new Error("El profesional seleccionado no existe.");
  }
  if (!profesional.activo) {
    throw new Error("El profesional seleccionado no está activo.");
  }
  return profesional;
}

function assertFechasParticipacion(
  fechaInicio: string,
  fechaTermino?: string
): void {
  if (!isValidParticipacionFechas(fechaInicio, fechaTermino)) {
    throw new Error("La fecha de término debe ser igual o posterior al inicio.");
  }
}

export function getParticipacionesByEstudianteId(
  estudianteId: string
): ParticipacionProfesionalEstudiante[] {
  return readParticipaciones().filter(
    (item) => item.estudianteId === estudianteId
  );
}

export function getParticipacionesActivasByEstudianteId(
  estudianteId: string,
  ambito?: AmbitoEquipo,
  refDate: string = todayParticipacionDate()
): ParticipacionProfesionalEstudiante[] {
  return getParticipacionesByEstudianteId(estudianteId).filter((item) => {
    if (!isParticipacionActiva(item, refDate)) return false;
    if (ambito && item.ambito !== ambito) return false;
    return true;
  });
}

export function getParticipacionesPIEByEstudianteId(
  estudianteId: string
): ParticipacionProfesionalEstudiante[] {
  return getParticipacionesByEstudianteId(estudianteId).filter(
    (item) => item.ambito === "pie"
  );
}

export function getParticipacionById(
  id: string
): ParticipacionProfesionalEstudiante | null {
  return readParticipaciones().find((item) => item.id === id) ?? null;
}

export function saveParticipacionProfesionalEstudiante(
  input: SaveParticipacionProfesionalEstudianteInput
): ParticipacionProfesionalEstudiante {
  assertProfesionalActivo(input.profesionalId);
  assertFechasParticipacion(input.fechaInicio, input.fechaTermino);

  const participaciones = readParticipaciones();
  const timestamp = nowIso();
  const participacion: ParticipacionProfesionalEstudiante = {
    id: crypto.randomUUID(),
    estudianteId: input.estudianteId,
    profesionalId: input.profesionalId,
    rolId: input.rolId,
    ambito: input.ambito,
    esResponsable: input.esResponsable ?? false,
    fechaInicio: input.fechaInicio.trim(),
    fechaTermino: input.fechaTermino?.trim() || undefined,
    origen: input.origen ?? "manual",
    notas: input.notas?.trim() || undefined,
    creadoEn: timestamp,
    actualizadoEn: timestamp,
  };

  if (participacion.esResponsable && isParticipacionActiva(participacion)) {
    clearResponsableActivoEnAmbito(
      participaciones,
      participacion.estudianteId,
      participacion.ambito,
      participacion.id
    );
  }

  participaciones.push(participacion);
  writeParticipaciones(participaciones);
  return participacion;
}

export function updateParticipacionProfesionalEstudiante(
  id: string,
  input: UpdateParticipacionProfesionalEstudianteInput
): ParticipacionProfesionalEstudiante | null {
  const participaciones = readParticipaciones();
  const index = participaciones.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const current = participaciones[index];
  const profesionalId = input.profesionalId ?? current.profesionalId;
  const fechaInicio = input.fechaInicio?.trim() ?? current.fechaInicio;
  const fechaTermino =
    input.fechaTermino !== undefined
      ? input.fechaTermino.trim() || undefined
      : current.fechaTermino;

  assertProfesionalActivo(profesionalId);
  assertFechasParticipacion(fechaInicio, fechaTermino);

  const updated: ParticipacionProfesionalEstudiante = {
    ...current,
    profesionalId,
    rolId: input.rolId ?? current.rolId,
    ambito: input.ambito ?? current.ambito,
    esResponsable: input.esResponsable ?? current.esResponsable,
    fechaInicio,
    fechaTermino,
    notas:
      input.notas !== undefined
        ? input.notas.trim() || undefined
        : current.notas,
    actualizadoEn: nowIso(),
  };

  if (updated.esResponsable && isParticipacionActiva(updated)) {
    clearResponsableActivoEnAmbito(
      participaciones,
      updated.estudianteId,
      updated.ambito,
      updated.id
    );
  }

  participaciones[index] = updated;
  writeParticipaciones(participaciones);
  return updated;
}

export function finalizarParticipacion(
  id: string,
  fechaTermino?: string
): ParticipacionProfesionalEstudiante | null {
  const participaciones = readParticipaciones();
  const index = participaciones.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const current = participaciones[index];
  const termino = (fechaTermino?.trim() || todayParticipacionDate()).trim();
  assertFechasParticipacion(current.fechaInicio, termino);

  const updated: ParticipacionProfesionalEstudiante = {
    ...current,
    fechaTermino: termino,
    actualizadoEn: nowIso(),
  };

  participaciones[index] = updated;
  writeParticipaciones(participaciones);
  return updated;
}

function clearResponsableActivoEnAmbito(
  participaciones: ParticipacionProfesionalEstudiante[],
  estudianteId: string,
  ambito: AmbitoEquipo,
  exceptId: string
): void {
  for (let i = 0; i < participaciones.length; i += 1) {
    const item = participaciones[i];
    if (item.id === exceptId) continue;
    if (item.estudianteId !== estudianteId) continue;
    if (item.ambito !== ambito) continue;
    if (!item.esResponsable) continue;
    if (!isParticipacionActiva(item)) continue;

    participaciones[i] = {
      ...item,
      esResponsable: false,
      actualizadoEn: nowIso(),
    };
  }
}

export function setResponsableEnAmbito(
  estudianteId: string,
  participacionId: string
): ParticipacionProfesionalEstudiante | null {
  const participaciones = readParticipaciones();
  const index = participaciones.findIndex((item) => item.id === participacionId);
  if (index < 0) return null;

  const target = participaciones[index];
  if (target.estudianteId !== estudianteId) return null;
  if (!isParticipacionActiva(target)) {
    throw new Error(
      "Solo una participación vigente puede marcarse como responsable."
    );
  }

  clearResponsableActivoEnAmbito(
    participaciones,
    estudianteId,
    target.ambito,
    target.id
  );

  const updated: ParticipacionProfesionalEstudiante = {
    ...target,
    esResponsable: true,
    actualizadoEn: nowIso(),
  };

  participaciones[index] = updated;
  writeParticipaciones(participaciones);
  return updated;
}

export function deleteParticipacionesByEstudianteId(estudianteId: string): number {
  const participaciones = readParticipaciones();
  const next = participaciones.filter(
    (item) => item.estudianteId !== estudianteId
  );
  const removed = participaciones.length - next.length;
  if (removed > 0) writeParticipaciones(next);
  return removed;
}

export { isParticipacionProfesionalEstudiante };
