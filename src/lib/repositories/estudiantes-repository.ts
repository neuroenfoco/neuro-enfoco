import {
  deleteEstudiante,
  getEstudianteById,
  getEstudiantes,
  saveEstudiante,
  type Estudiante,
} from "@/lib/students-storage";

export type { Estudiante };

export type SaveEstudianteInput = Parameters<typeof saveEstudiante>[0];

export interface EstudiantesRepository {
  getAll(): Estudiante[];
  getById(id: string): Estudiante | null;
  save(input: SaveEstudianteInput): Estudiante;
  delete(id: string): boolean;
}

export class LocalEstudiantesRepository implements EstudiantesRepository {
  getAll(): Estudiante[] {
    return getEstudiantes();
  }

  getById(id: string): Estudiante | null {
    return getEstudianteById(id);
  }

  save(input: SaveEstudianteInput): Estudiante {
    return saveEstudiante(input);
  }

  delete(id: string): boolean {
    return deleteEstudiante(id);
  }
}
