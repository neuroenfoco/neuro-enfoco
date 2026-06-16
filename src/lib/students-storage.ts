export interface Estudiante {
  id: string;
  nombre: string;
  curso: string;
  fechaCreacion: string;
  ingresoPieCompletado?: boolean;
  ingresoPieCompletadoEn?: string;
}

const STORAGE_KEY = "neuro-enfoco-estudiantes";

export function formatEstudianteFecha(date: Date = new Date()): string {
  return date.toISOString();
}

export function getEstudianteIniciales(nombre: string): string {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getEstudiantePrimerNombre(nombre: string): string {
  return nombre.split(" ")[0] ?? nombre;
}

function isEstudiante(value: unknown): value is Estudiante {
  if (!value || typeof value !== "object") return false;

  const estudiante = value as Record<string, unknown>;

  return (
    typeof estudiante.id === "string" &&
    typeof estudiante.nombre === "string" &&
    typeof estudiante.curso === "string" &&
    typeof estudiante.fechaCreacion === "string" &&
    (typeof estudiante.ingresoPieCompletado === "boolean" ||
      estudiante.ingresoPieCompletado === undefined) &&
    (typeof estudiante.ingresoPieCompletadoEn === "string" ||
      estudiante.ingresoPieCompletadoEn === undefined)
  );
}

function readEstudiantesRaw(): Estudiante[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isEstudiante);
  } catch {
    return [];
  }
}

function writeEstudiantes(estudiantes: Estudiante[]): void {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(estudiantes));
}

export function getEstudiantes(): Estudiante[] {
  if (typeof window === "undefined") return [];

  return readEstudiantesRaw();
}

export function getEstudianteById(id: string): Estudiante | null {
  return getEstudiantes().find((estudiante) => estudiante.id === id) ?? null;
}

export function marcarIngresoPieCompletado(
  estudianteId: string,
  completadoEn?: string
): Estudiante | null {
  const estudiantes = readEstudiantesRaw();
  const index = estudiantes.findIndex((estudiante) => estudiante.id === estudianteId);
  if (index === -1) return null;

  const updated: Estudiante = {
    ...estudiantes[index],
    ingresoPieCompletado: true,
    ingresoPieCompletadoEn: completadoEn ?? formatEstudianteFecha(),
  };

  const next = [...estudiantes];
  next[index] = updated;
  writeEstudiantes(next);
  return updated;
}

export function saveEstudiante(input: {
  nombre: string;
  curso: string;
  ingresoPieCompletado?: boolean;
  ingresoPieCompletadoEn?: string;
}): Estudiante {
  const estudiante: Estudiante = {
    id: crypto.randomUUID(),
    nombre: input.nombre.trim(),
    curso: input.curso.trim(),
    fechaCreacion: formatEstudianteFecha(),
    ingresoPieCompletado: input.ingresoPieCompletado,
    ingresoPieCompletadoEn: input.ingresoPieCompletadoEn,
  };

  writeEstudiantes([estudiante, ...getEstudiantes()]);
  return estudiante;
}

/** Quita el registro del estudiante del storage (uso interno de cascada). */
export function removeEstudianteRecord(estudianteId: string): boolean {
  if (typeof window === "undefined") return false;

  const estudiantes = readEstudiantesRaw();
  const next = estudiantes.filter((estudiante) => estudiante.id !== estudianteId);
  if (next.length === estudiantes.length) return false;

  writeEstudiantes(next);
  return true;
}

/** @deprecated Usar deleteEstudianteCompleto desde @/lib/delete-estudiante-completo */
export function deleteEstudiante(estudianteId: string): boolean {
  if (typeof window === "undefined") return false;

  // Import dinámico para evitar dependencia circular con delete-estudiante-completo.
  const { deleteEstudianteCompleto } =
    require("@/lib/delete-estudiante-completo") as typeof import("@/lib/delete-estudiante-completo");
  return deleteEstudianteCompleto(estudianteId).ok;
}
