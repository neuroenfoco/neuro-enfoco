import type { Estudiante } from "@/lib/students-storage";
import type { SaveEstudianteInput } from "@/lib/repositories/estudiantes-repository";

export type EstudianteRow = {
  id: string;
  nombre: string;
  curso: string;
  fecha_creacion: string;
  ingreso_pie_completado: boolean | null;
  ingreso_pie_completado_en: string | null;
};

export function estudianteRowToDomain(row: EstudianteRow): Estudiante {
  return {
    id: row.id,
    nombre: row.nombre,
    curso: row.curso,
    fechaCreacion: row.fecha_creacion,
    ...(row.ingreso_pie_completado != null
      ? { ingresoPieCompletado: row.ingreso_pie_completado }
      : {}),
    ...(row.ingreso_pie_completado_en
      ? { ingresoPieCompletadoEn: row.ingreso_pie_completado_en }
      : {}),
  };
}

export function estudianteToRow(estudiante: Estudiante): EstudianteRow {
  return {
    id: estudiante.id,
    nombre: estudiante.nombre,
    curso: estudiante.curso,
    fecha_creacion: estudiante.fechaCreacion,
    ingreso_pie_completado: estudiante.ingresoPieCompletado ?? null,
    ingreso_pie_completado_en: estudiante.ingresoPieCompletadoEn ?? null,
  };
}

export function saveInputToEstudiante(
  input: SaveEstudianteInput,
  id: string,
  fechaCreacion: string
): Estudiante {
  return {
    id,
    nombre: input.nombre.trim(),
    curso: input.curso.trim(),
    fechaCreacion,
    ingresoPieCompletado: input.ingresoPieCompletado,
    ingresoPieCompletadoEn: input.ingresoPieCompletadoEn,
  };
}
