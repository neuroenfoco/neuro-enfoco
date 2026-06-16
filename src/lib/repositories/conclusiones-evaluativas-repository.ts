import {
  countConclusionesByEvaluacionId,
  deleteConclusionEvaluativa,
  deleteConclusionesEvaluativasByEstudianteId,
  deleteConclusionesEvaluativasByEvaluacionId,
  getConclusionEvaluativaById,
  getConclusionesEvaluativasByEstudianteId,
  getConclusionesEvaluativasByEvaluacionId,
  saveConclusionEvaluativa,
  updateConclusionEvaluativa,
} from "@/lib/evaluacion-integral/conclusion-evaluativa-storage";
import type {
  ConclusionEvaluativa,
  SaveConclusionEvaluativaInput,
  UpdateConclusionEvaluativaInput,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";

export type {
  ConclusionEvaluativa,
  SaveConclusionEvaluativaInput,
  UpdateConclusionEvaluativaInput,
};

export interface ConclusionesEvaluativasRepository {
  getByEvaluacionId(evaluacionIntegralId: string): ConclusionEvaluativa[];
  getByEstudianteId(estudianteId: string): ConclusionEvaluativa[];
  getById(id: string): ConclusionEvaluativa | null;
  countByEvaluacionId(evaluacionIntegralId: string): number;
  save(input: SaveConclusionEvaluativaInput): ConclusionEvaluativa | null;
  update(
    id: string,
    input: UpdateConclusionEvaluativaInput
  ): ConclusionEvaluativa | null;
  delete(id: string): boolean;
  deleteByEvaluacionId(evaluacionIntegralId: string): number;
  deleteByEstudianteId(estudianteId: string): number;
}

export class LocalConclusionesEvaluativasRepository
  implements ConclusionesEvaluativasRepository
{
  getByEvaluacionId(evaluacionIntegralId: string): ConclusionEvaluativa[] {
    return getConclusionesEvaluativasByEvaluacionId(evaluacionIntegralId);
  }

  getByEstudianteId(estudianteId: string): ConclusionEvaluativa[] {
    return getConclusionesEvaluativasByEstudianteId(estudianteId);
  }

  getById(id: string): ConclusionEvaluativa | null {
    return getConclusionEvaluativaById(id);
  }

  countByEvaluacionId(evaluacionIntegralId: string): number {
    return countConclusionesByEvaluacionId(evaluacionIntegralId);
  }

  save(input: SaveConclusionEvaluativaInput): ConclusionEvaluativa | null {
    return saveConclusionEvaluativa(input);
  }

  update(
    id: string,
    input: UpdateConclusionEvaluativaInput
  ): ConclusionEvaluativa | null {
    return updateConclusionEvaluativa(id, input);
  }

  delete(id: string): boolean {
    return deleteConclusionEvaluativa(id);
  }

  deleteByEvaluacionId(evaluacionIntegralId: string): number {
    return deleteConclusionesEvaluativasByEvaluacionId(evaluacionIntegralId);
  }

  deleteByEstudianteId(estudianteId: string): number {
    return deleteConclusionesEvaluativasByEstudianteId(estudianteId);
  }
}
