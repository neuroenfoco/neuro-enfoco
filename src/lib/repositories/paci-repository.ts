import { readPACIs } from "@/lib/paci/paci-persistence";
import {
  createPACI,
  deletePACI,
  getPACIById,
  getPACIsByEstudianteId,
  updatePACIBorrador,
} from "@/lib/paci/paci-storage";
import type {
  PACI,
  SavePACIInput,
  UpdatePACIBorradorInput,
} from "@/lib/paci/paci-types";

export type { PACI, SavePACIInput, UpdatePACIBorradorInput };

export interface PACIRepository {
  getAll(): PACI[];
  getById(id: string): PACI | null;
  getByEstudianteId(estudianteId: string): PACI[];
  save(input: SavePACIInput): PACI | null;
  update(id: string, input: UpdatePACIBorradorInput): PACI | null;
  delete(id: string): boolean;
}

export class LocalPACIRepository implements PACIRepository {
  getAll(): PACI[] {
    return readPACIs();
  }

  getById(id: string): PACI | null {
    return getPACIById(id);
  }

  getByEstudianteId(estudianteId: string): PACI[] {
    return getPACIsByEstudianteId(estudianteId);
  }

  save(input: SavePACIInput): PACI | null {
    return createPACI(input);
  }

  update(id: string, input: UpdatePACIBorradorInput): PACI | null {
    return updatePACIBorrador(id, input);
  }

  delete(id: string): boolean {
    return deletePACI(id);
  }
}
