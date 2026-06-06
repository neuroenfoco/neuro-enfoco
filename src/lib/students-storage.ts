import { deleteObjetivosPIEByEstudianteId } from "@/lib/pie-objectives-storage";
import { deleteSessionsByEstudianteId } from "@/lib/sessions-storage";

export interface Estudiante {
  id: string;
  nombre: string;
  curso: string;
  fechaCreacion: string;
}

export const MARTINA_STUDENT_ID = "martina";

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
    typeof estudiante.fechaCreacion === "string"
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

function createMartinaSeed(): Estudiante {
  return {
    id: MARTINA_STUDENT_ID,
    nombre: "Martina Ramírez",
    curso: "3° Básico",
    fechaCreacion: formatEstudianteFecha(),
  };
}

export function ensureSeedEstudiantes(): void {
  if (typeof window === "undefined") return;

  const existing = readEstudiantesRaw();
  if (existing.length > 0) return;

  writeEstudiantes([createMartinaSeed()]);
}

export function getEstudiantes(): Estudiante[] {
  if (typeof window === "undefined") return [];

  ensureSeedEstudiantes();
  return readEstudiantesRaw();
}

export function getEstudianteById(id: string): Estudiante | null {
  return getEstudiantes().find((estudiante) => estudiante.id === id) ?? null;
}

export function saveEstudiante(input: {
  nombre: string;
  curso: string;
}): Estudiante {
  ensureSeedEstudiantes();

  const estudiante: Estudiante = {
    id: crypto.randomUUID(),
    nombre: input.nombre.trim(),
    curso: input.curso.trim(),
    fechaCreacion: formatEstudianteFecha(),
  };

  writeEstudiantes([estudiante, ...getEstudiantes()]);
  return estudiante;
}

export function isProtectedEstudiante(estudianteId: string): boolean {
  return estudianteId === MARTINA_STUDENT_ID;
}

export function deleteEstudiante(estudianteId: string): boolean {
  if (typeof window === "undefined") return false;
  if (isProtectedEstudiante(estudianteId)) return false;

  const estudiantes = getEstudiantes();
  if (!estudiantes.some((estudiante) => estudiante.id === estudianteId)) {
    return false;
  }

  deleteSessionsByEstudianteId(estudianteId);
  deleteObjetivosPIEByEstudianteId(estudianteId);

  writeEstudiantes(
    estudiantes.filter((estudiante) => estudiante.id !== estudianteId)
  );
  return true;
}
