import { readApoyosPIE } from "@/lib/apoyos/apoyos-persistence";
import {
  createApoyoPIE,
  deleteApoyoPIE,
  getApoyoPIEById,
  getApoyosByEstudianteId,
  getApoyosByObjetivoId,
  updateApoyoPIE,
} from "@/lib/apoyos/apoyos-storage";
import type {
  ApoyoPIE,
  CreateApoyoPIEInput,
  UpdateApoyoPIEInput,
} from "@/lib/apoyos/apoyos-types";

export type { ApoyoPIE, CreateApoyoPIEInput, UpdateApoyoPIEInput };

export interface ApoyosRepository {
  getAll(): ApoyoPIE[];
  getById(id: string): ApoyoPIE | null;
  getByEstudianteId(estudianteId: string): ApoyoPIE[];
  getByObjetivoId(objetivoPieId: string): ApoyoPIE[];
  save(input: CreateApoyoPIEInput): ApoyoPIE | null;
  update(id: string, input: UpdateApoyoPIEInput): ApoyoPIE | null;
  delete(id: string): boolean;
}

export class LocalApoyosRepository implements ApoyosRepository {
  getAll(): ApoyoPIE[] {
    return readApoyosPIE();
  }

  getById(id: string): ApoyoPIE | null {
    return getApoyoPIEById(id);
  }

  getByEstudianteId(estudianteId: string): ApoyoPIE[] {
    return getApoyosByEstudianteId(estudianteId);
  }

  getByObjetivoId(objetivoPieId: string): ApoyoPIE[] {
    return getApoyosByObjetivoId(objetivoPieId);
  }

  save(input: CreateApoyoPIEInput): ApoyoPIE | null {
    return createApoyoPIE(input);
  }

  update(id: string, input: UpdateApoyoPIEInput): ApoyoPIE | null {
    return updateApoyoPIE(id, input);
  }

  delete(id: string): boolean {
    return deleteApoyoPIE(id);
  }
}
