import {
  eliminarIntervencionCompleta,
  getIntervencionById,
  getIntervenciones,
  getIntervencionesByEstudianteId,
  getIntervencionesByObjetivoId,
  saveIntervencion,
  updateIntervencion,
  type Intervencion,
} from "@/lib/intervenciones-storage";

export type { Intervencion };

export type SaveIntervencionInput = Parameters<typeof saveIntervencion>[0];
export type UpdateIntervencionInput = Parameters<typeof updateIntervencion>[1];

export interface IntervencionesRepository {
  getAll(): Intervencion[];
  getById(id: string): Intervencion | null;
  getByEstudianteId(estudianteId: string): Intervencion[];
  getByObjetivoId(objetivoId: string): Intervencion[];
  save(input: SaveIntervencionInput): Intervencion | null;
  update(id: string, input: UpdateIntervencionInput): Intervencion | null;
  delete(id: string): boolean;
}

export class LocalIntervencionesRepository implements IntervencionesRepository {
  getAll(): Intervencion[] {
    return getIntervenciones();
  }

  getById(id: string): Intervencion | null {
    return getIntervencionById(id);
  }

  getByEstudianteId(estudianteId: string): Intervencion[] {
    return getIntervencionesByEstudianteId(estudianteId);
  }

  getByObjetivoId(objetivoId: string): Intervencion[] {
    return getIntervencionesByObjetivoId(objetivoId);
  }

  save(input: SaveIntervencionInput): Intervencion | null {
    return saveIntervencion(input);
  }

  update(id: string, input: UpdateIntervencionInput): Intervencion | null {
    return updateIntervencion(id, input);
  }

  delete(id: string): boolean {
    return eliminarIntervencionCompleta(id);
  }
}
