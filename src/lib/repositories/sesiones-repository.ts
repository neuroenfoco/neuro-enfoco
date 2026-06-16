import {
  clearIntervencionIdFromSesiones,
  deleteSession,
  deleteSessionsByEstudianteId,
  getSesiones,
  getSesionesByEstudianteId,
  getSesionesByIntervencionId,
  saveSesion,
  updateSesionIntervencionId,
  type Sesion,
} from "@/lib/sessions-storage";

export type { Sesion };

export interface SesionesRepository {
  getAll(): Sesion[];
  getById(id: string): Sesion | null;
  getByEstudianteId(estudianteId: string): Sesion[];
  getByIntervencionId(intervencionId: string): Sesion[];
  save(sesion: Sesion): void;
  delete(id: string): boolean;
  deleteByEstudianteId(estudianteId: string): number;
  updateIntervencionId(
    sesionId: string,
    intervencionId: string | undefined,
    expectedEstudianteId?: string
  ): boolean;
  clearIntervencionId(intervencionId: string): number;
}

export class LocalSesionesRepository implements SesionesRepository {
  getAll(): Sesion[] {
    return getSesiones();
  }

  getById(id: string): Sesion | null {
    return getSesiones().find((sesion) => sesion.id === id) ?? null;
  }

  getByEstudianteId(estudianteId: string): Sesion[] {
    return getSesionesByEstudianteId(estudianteId);
  }

  getByIntervencionId(intervencionId: string): Sesion[] {
    return getSesionesByIntervencionId(intervencionId);
  }

  save(sesion: Sesion): void {
    saveSesion(sesion);
  }

  delete(id: string): boolean {
    return deleteSession(id);
  }

  deleteByEstudianteId(estudianteId: string): number {
    return deleteSessionsByEstudianteId(estudianteId);
  }

  updateIntervencionId(
    sesionId: string,
    intervencionId: string | undefined,
    expectedEstudianteId?: string
  ): boolean {
    return updateSesionIntervencionId(
      sesionId,
      intervencionId,
      expectedEstudianteId
    );
  }

  clearIntervencionId(intervencionId: string): number {
    return clearIntervencionIdFromSesiones(intervencionId);
  }
}
