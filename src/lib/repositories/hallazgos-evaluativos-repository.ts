import {
  deleteHallazgoEvaluativo,
  deleteHallazgosEvaluativosByEstudianteId,
  deleteHallazgosEvaluativosByEvaluacionId,
  getHallazgoEvaluativoById,
  getHallazgosEvaluativosByEvaluacionId,
  saveHallazgoEvaluativo,
  updateHallazgoEvaluativo,
  vincularHallazgoEvaluativoAPerfil,
} from "@/lib/evaluacion-integral/hallazgo-evaluativo-storage";
import type {
  HallazgoEvaluativo,
  SaveHallazgoEvaluativoInput,
  UpdateHallazgoEvaluativoInput,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";

export type {
  HallazgoEvaluativo,
  SaveHallazgoEvaluativoInput,
  UpdateHallazgoEvaluativoInput,
};

export interface HallazgosEvaluativosRepository {
  getByEvaluacionId(evaluacionIntegralId: string): HallazgoEvaluativo[];
  getById(id: string): HallazgoEvaluativo | null;
  save(input: SaveHallazgoEvaluativoInput): HallazgoEvaluativo | null;
  update(
    id: string,
    input: UpdateHallazgoEvaluativoInput
  ): HallazgoEvaluativo | null;
  delete(id: string): boolean;
  vincularAPerfil(
    hallazgoEvaluativoId: string,
    hallazgoPerfilId: string,
    consolidadoEn: string
  ): HallazgoEvaluativo | null;
  deleteByEvaluacionId(evaluacionIntegralId: string): number;
  deleteByEstudianteId(estudianteId: string): number;
}

export class LocalHallazgosEvaluativosRepository
  implements HallazgosEvaluativosRepository
{
  getByEvaluacionId(evaluacionIntegralId: string): HallazgoEvaluativo[] {
    return getHallazgosEvaluativosByEvaluacionId(evaluacionIntegralId);
  }

  getById(id: string): HallazgoEvaluativo | null {
    return getHallazgoEvaluativoById(id);
  }

  save(input: SaveHallazgoEvaluativoInput): HallazgoEvaluativo | null {
    return saveHallazgoEvaluativo(input);
  }

  update(
    id: string,
    input: UpdateHallazgoEvaluativoInput
  ): HallazgoEvaluativo | null {
    return updateHallazgoEvaluativo(id, input);
  }

  delete(id: string): boolean {
    return deleteHallazgoEvaluativo(id);
  }

  vincularAPerfil(
    hallazgoEvaluativoId: string,
    hallazgoPerfilId: string,
    consolidadoEn: string
  ): HallazgoEvaluativo | null {
    return vincularHallazgoEvaluativoAPerfil(
      hallazgoEvaluativoId,
      hallazgoPerfilId,
      consolidadoEn
    );
  }

  deleteByEvaluacionId(evaluacionIntegralId: string): number {
    return deleteHallazgosEvaluativosByEvaluacionId(evaluacionIntegralId);
  }

  deleteByEstudianteId(estudianteId: string): number {
    return deleteHallazgosEvaluativosByEstudianteId(estudianteId);
  }
}
