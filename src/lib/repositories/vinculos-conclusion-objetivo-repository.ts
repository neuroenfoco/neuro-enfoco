import {
  deleteVinculosByConclusionId,
  deleteVinculosByConclusionIds,
  deleteVinculosByEstudianteId,
  deleteVinculosByEvaluacionId,
  deleteVinculosByObjetivoId,
  getVinculosByConclusionId,
  getVinculosByEstudianteId,
  getVinculosByEvaluacionId,
  getVinculosByObjetivoId,
  linkConclusionesToObjetivo,
  linkConclusionToObjetivo,
  syncVinculosObjetivo,
  unlinkConclusionFromObjetivo,
} from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import type {
  SaveVinculoConclusionObjetivoPIEInput,
  VinculoConclusionObjetivoPIE,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";

export type {
  SaveVinculoConclusionObjetivoPIEInput,
  VinculoConclusionObjetivoPIE,
};

export interface VinculosConclusionObjetivoRepository {
  getByConclusionId(conclusionEvaluativaId: string): VinculoConclusionObjetivoPIE[];
  getByObjetivoId(objetivoPieId: string): VinculoConclusionObjetivoPIE[];
  getByEstudianteId(estudianteId: string): VinculoConclusionObjetivoPIE[];
  getByEvaluacionId(evaluacionIntegralId: string): VinculoConclusionObjetivoPIE[];
  link(
    input: SaveVinculoConclusionObjetivoPIEInput
  ): VinculoConclusionObjetivoPIE | null;
  linkMany(objetivoPieId: string, conclusionEvaluativaIds: string[]): boolean;
  unlink(conclusionEvaluativaId: string, objetivoPieId: string): boolean;
  syncObjetivo(objetivoPieId: string, conclusionEvaluativaIds: string[]): boolean;
  deleteByObjetivoId(objetivoPieId: string): number;
  deleteByConclusionId(conclusionEvaluativaId: string): number;
  deleteByConclusionIds(conclusionEvaluativaIds: string[]): number;
  deleteByEstudianteId(estudianteId: string): number;
  deleteByEvaluacionId(evaluacionIntegralId: string): number;
}

export class LocalVinculosConclusionObjetivoRepository
  implements VinculosConclusionObjetivoRepository
{
  getByConclusionId(
    conclusionEvaluativaId: string
  ): VinculoConclusionObjetivoPIE[] {
    return getVinculosByConclusionId(conclusionEvaluativaId);
  }

  getByObjetivoId(objetivoPieId: string): VinculoConclusionObjetivoPIE[] {
    return getVinculosByObjetivoId(objetivoPieId);
  }

  getByEstudianteId(estudianteId: string): VinculoConclusionObjetivoPIE[] {
    return getVinculosByEstudianteId(estudianteId);
  }

  getByEvaluacionId(evaluacionIntegralId: string): VinculoConclusionObjetivoPIE[] {
    return getVinculosByEvaluacionId(evaluacionIntegralId);
  }

  link(
    input: SaveVinculoConclusionObjetivoPIEInput
  ): VinculoConclusionObjetivoPIE | null {
    return linkConclusionToObjetivo(input);
  }

  linkMany(objetivoPieId: string, conclusionEvaluativaIds: string[]): boolean {
    return linkConclusionesToObjetivo(objetivoPieId, conclusionEvaluativaIds);
  }

  unlink(conclusionEvaluativaId: string, objetivoPieId: string): boolean {
    return unlinkConclusionFromObjetivo(conclusionEvaluativaId, objetivoPieId);
  }

  syncObjetivo(
    objetivoPieId: string,
    conclusionEvaluativaIds: string[]
  ): boolean {
    return syncVinculosObjetivo(objetivoPieId, conclusionEvaluativaIds);
  }

  deleteByObjetivoId(objetivoPieId: string): number {
    return deleteVinculosByObjetivoId(objetivoPieId);
  }

  deleteByConclusionId(conclusionEvaluativaId: string): number {
    return deleteVinculosByConclusionId(conclusionEvaluativaId);
  }

  deleteByConclusionIds(conclusionEvaluativaIds: string[]): number {
    return deleteVinculosByConclusionIds(conclusionEvaluativaIds);
  }

  deleteByEstudianteId(estudianteId: string): number {
    return deleteVinculosByEstudianteId(estudianteId);
  }

  deleteByEvaluacionId(evaluacionIntegralId: string): number {
    return deleteVinculosByEvaluacionId(evaluacionIntegralId);
  }
}
