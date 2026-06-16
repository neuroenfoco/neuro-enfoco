import {
  deleteObjetivoPIE,
  getObjetivoPIEById,
  getObjetivosPIE,
  getObjetivosPIEByEstudianteId,
  saveObjetivoPIE,
  updateObjetivoPIE,
  type ObjetivoPIE,
} from "@/lib/pie-objectives-storage";

export type { ObjetivoPIE };

export type SaveObjetivoPIEInput = Parameters<typeof saveObjetivoPIE>[0];
export type UpdateObjetivoPIEInput = Parameters<typeof updateObjetivoPIE>[1];

export interface ObjetivosRepository {
  getAll(): ObjetivoPIE[];
  getById(id: string): ObjetivoPIE | null;
  getByEstudianteId(estudianteId: string): ObjetivoPIE[];
  save(input: SaveObjetivoPIEInput): ObjetivoPIE;
  update(id: string, input: UpdateObjetivoPIEInput): ObjetivoPIE | null;
  delete(id: string): boolean;
}

export class LocalObjetivosRepository implements ObjetivosRepository {
  getAll(): ObjetivoPIE[] {
    return getObjetivosPIE();
  }

  getById(id: string): ObjetivoPIE | null {
    return getObjetivoPIEById(id);
  }

  getByEstudianteId(estudianteId: string): ObjetivoPIE[] {
    return getObjetivosPIEByEstudianteId(estudianteId);
  }

  save(input: SaveObjetivoPIEInput): ObjetivoPIE {
    return saveObjetivoPIE(input);
  }

  update(id: string, input: UpdateObjetivoPIEInput): ObjetivoPIE | null {
    return updateObjetivoPIE(id, input);
  }

  delete(id: string): boolean {
    return deleteObjetivoPIE(id);
  }
}
