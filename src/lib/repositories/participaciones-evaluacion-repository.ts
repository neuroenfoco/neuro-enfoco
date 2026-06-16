import {
  aplicarSnapshotsParticipacionesEvaluacion,
  countResponsablesProcesoEnEvaluacion,
  deleteParticipacionEvaluacionIntegral,
  deleteParticipacionesByEvaluacionId,
  deleteParticipacionesEvaluacionByEstudianteId,
  getParticipacionEvaluacionIntegralById,
  getParticipacionesByEvaluacionId,
  saveParticipacionEvaluacionIntegral,
  updateParticipacionEvaluacionIntegral,
} from "@/lib/evaluacion-integral/participacion-evaluacion-integral-storage";
import type {
  ParticipacionEvaluacionIntegral,
  SaveParticipacionEvaluacionIntegralInput,
  UpdateParticipacionEvaluacionIntegralInput,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";

export type {
  ParticipacionEvaluacionIntegral,
  SaveParticipacionEvaluacionIntegralInput,
  UpdateParticipacionEvaluacionIntegralInput,
};

export interface ParticipacionesEvaluacionRepository {
  getByEvaluacionId(
    evaluacionIntegralId: string
  ): ParticipacionEvaluacionIntegral[];
  getById(id: string): ParticipacionEvaluacionIntegral | null;
  countResponsablesProceso(
    evaluacionIntegralId: string,
    excludeId?: string
  ): number;
  save(
    input: SaveParticipacionEvaluacionIntegralInput
  ): ParticipacionEvaluacionIntegral | null;
  update(
    id: string,
    input: UpdateParticipacionEvaluacionIntegralInput
  ): ParticipacionEvaluacionIntegral | null;
  delete(id: string): boolean;
  aplicarSnapshots(evaluacionIntegralId: string): number;
  deleteByEvaluacionId(evaluacionIntegralId: string): number;
  deleteByEstudianteId(estudianteId: string): number;
}

export class LocalParticipacionesEvaluacionRepository
  implements ParticipacionesEvaluacionRepository
{
  getByEvaluacionId(
    evaluacionIntegralId: string
  ): ParticipacionEvaluacionIntegral[] {
    return getParticipacionesByEvaluacionId(evaluacionIntegralId);
  }

  getById(id: string): ParticipacionEvaluacionIntegral | null {
    return getParticipacionEvaluacionIntegralById(id);
  }

  countResponsablesProceso(
    evaluacionIntegralId: string,
    excludeId?: string
  ): number {
    return countResponsablesProcesoEnEvaluacion(evaluacionIntegralId, excludeId);
  }

  save(
    input: SaveParticipacionEvaluacionIntegralInput
  ): ParticipacionEvaluacionIntegral | null {
    return saveParticipacionEvaluacionIntegral(input);
  }

  update(
    id: string,
    input: UpdateParticipacionEvaluacionIntegralInput
  ): ParticipacionEvaluacionIntegral | null {
    return updateParticipacionEvaluacionIntegral(id, input);
  }

  delete(id: string): boolean {
    return deleteParticipacionEvaluacionIntegral(id);
  }

  aplicarSnapshots(evaluacionIntegralId: string): number {
    return aplicarSnapshotsParticipacionesEvaluacion(evaluacionIntegralId);
  }

  deleteByEvaluacionId(evaluacionIntegralId: string): number {
    return deleteParticipacionesByEvaluacionId(evaluacionIntegralId);
  }

  deleteByEstudianteId(estudianteId: string): number {
    return deleteParticipacionesEvaluacionByEstudianteId(estudianteId);
  }
}
