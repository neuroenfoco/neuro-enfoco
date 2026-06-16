import {
  deleteProfesional,
  getDefaultProfesionalId,
  getProfesionalById,
  getProfesionales,
  getProfesionalesActivos,
  saveProfesional,
  updateProfesional,
  type DeleteProfesionalResult,
  type Profesional,
} from "@/lib/institucional/profesionales-storage";

export type { Profesional, DeleteProfesionalResult };

export type SaveProfesionalInput = Parameters<typeof saveProfesional>[0];
export type UpdateProfesionalInput = Parameters<typeof updateProfesional>[1];

export interface ProfesionalesRepository {
  getAll(): Profesional[];
  getActivos(): Profesional[];
  getById(id: string): Profesional | null;
  getDefaultId(): string;
  save(input: SaveProfesionalInput): Profesional | null;
  update(id: string, input: UpdateProfesionalInput): Profesional | null;
  delete(id: string): DeleteProfesionalResult;
}

export class LocalProfesionalesRepository implements ProfesionalesRepository {
  getAll(): Profesional[] {
    return getProfesionales();
  }

  getActivos(): Profesional[] {
    return getProfesionalesActivos();
  }

  getById(id: string): Profesional | null {
    return getProfesionalById(id) ?? null;
  }

  getDefaultId(): string {
    return getDefaultProfesionalId();
  }

  save(input: SaveProfesionalInput): Profesional | null {
    return saveProfesional(input);
  }

  update(id: string, input: UpdateProfesionalInput): Profesional | null {
    return updateProfesional(id, input);
  }

  delete(id: string): DeleteProfesionalResult {
    return deleteProfesional(id);
  }
}
