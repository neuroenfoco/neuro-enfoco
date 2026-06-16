import type { TipoEspacioId } from "@/lib/espacios-catalog";
import {
  getEspacioById,
  getEspacios,
  getEspaciosActivos,
  getEspaciosByTipo,
  saveEspacio,
  setEspacioActivo,
  updateEspacio,
  type Espacio,
} from "@/lib/espacios-storage";

export type { Espacio };

export type SaveEspacioInput = Parameters<typeof saveEspacio>[0];
export type UpdateEspacioInput = Parameters<typeof updateEspacio>[1];

export interface EspaciosRepository {
  getAll(): Espacio[];
  getActivos(): Espacio[];
  getById(id: string): Espacio | null;
  getByTipo(tipoEspacio: TipoEspacioId): Espacio[];
  save(input: SaveEspacioInput): Espacio | null;
  update(id: string, input: UpdateEspacioInput): Espacio | null;
  setActivo(id: string, activo: boolean): Espacio | null;
}

export class LocalEspaciosRepository implements EspaciosRepository {
  getAll(): Espacio[] {
    return getEspacios();
  }

  getActivos(): Espacio[] {
    return getEspaciosActivos();
  }

  getById(id: string): Espacio | null {
    return getEspacioById(id);
  }

  getByTipo(tipoEspacio: TipoEspacioId): Espacio[] {
    return getEspaciosByTipo(tipoEspacio);
  }

  save(input: SaveEspacioInput): Espacio | null {
    return saveEspacio(input);
  }

  update(id: string, input: UpdateEspacioInput): Espacio | null {
    return updateEspacio(id, input);
  }

  setActivo(id: string, activo: boolean): Espacio | null {
    return setEspacioActivo(id, activo);
  }
}
