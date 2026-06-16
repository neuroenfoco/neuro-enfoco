import type { AsyncEstudiantesRepository } from "@/lib/repositories/async-ready";
import type {
  EstudiantesRepository,
  SaveEstudianteInput,
} from "@/lib/repositories/estudiantes-repository";
import {
  marcarIngresoPieCompletado as marcarIngresoPieCompletadoLocal,
  type Estudiante,
} from "@/lib/students-storage";

export class LocalAsyncEstudiantesRepository implements AsyncEstudiantesRepository {
  constructor(private readonly local: EstudiantesRepository) {}

  getAll(): Promise<Estudiante[]> {
    return Promise.resolve(this.local.getAll());
  }

  getById(id: string): Promise<Estudiante | null> {
    return Promise.resolve(this.local.getById(id));
  }

  save(input: SaveEstudianteInput): Promise<Estudiante> {
    return Promise.resolve(this.local.save(input));
  }

  marcarIngresoPieCompletado(
    estudianteId: string,
    completadoEn?: string
  ): Promise<Estudiante | null> {
    return Promise.resolve(
      marcarIngresoPieCompletadoLocal(estudianteId, completadoEn)
    );
  }

  delete(id: string): Promise<boolean> {
    return Promise.resolve(this.local.delete(id));
  }
}
