import {
  deleteMarcoInstitucionalPIEByEstudianteId,
  getMarcoInstitucionalPIEByEstudianteId,
  saveMarcoInstitucionalPIE,
  type EstadoPIE,
  type MarcoInstitucionalPIE,
  type SaveMarcoInstitucionalPIEInput,
} from "@/lib/marco-institucional-pie-storage";

export type { EstadoPIE, MarcoInstitucionalPIE, SaveMarcoInstitucionalPIEInput };

export interface MarcoInstitucionalRepository {
  getByEstudianteId(estudianteId: string): MarcoInstitucionalPIE | null;
  save(input: SaveMarcoInstitucionalPIEInput): MarcoInstitucionalPIE;
  deleteByEstudianteId(estudianteId: string): boolean;
}

export class LocalMarcoInstitucionalRepository
  implements MarcoInstitucionalRepository
{
  getByEstudianteId(estudianteId: string): MarcoInstitucionalPIE | null {
    return getMarcoInstitucionalPIEByEstudianteId(estudianteId);
  }

  save(input: SaveMarcoInstitucionalPIEInput): MarcoInstitucionalPIE {
    return saveMarcoInstitucionalPIE(input);
  }

  deleteByEstudianteId(estudianteId: string): boolean {
    return deleteMarcoInstitucionalPIEByEstudianteId(estudianteId);
  }
}
