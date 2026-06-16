import {
  deleteEvaluacionIntegral,
  getEvaluacionIntegralById,
  getEvaluacionesIntegralesByEstudianteId,
  saveEvaluacionIntegral,
  updateEvaluacionIntegral,
} from "@/lib/evaluacion-integral/evaluacion-integral-storage";
import { readEvaluacionesIntegrales } from "@/lib/evaluacion-integral/evaluacion-integral-persistence";
import type {
  EvaluacionIntegral,
  SaveEvaluacionIntegralInput,
  UpdateEvaluacionIntegralInput,
} from "@/lib/evaluacion-integral/evaluacion-integral-types";

export type {
  EvaluacionIntegral,
  SaveEvaluacionIntegralInput,
  UpdateEvaluacionIntegralInput,
};

export interface EvaluacionesRepository {
  getAll(): EvaluacionIntegral[];
  getById(id: string): EvaluacionIntegral | null;
  getByEstudianteId(estudianteId: string): EvaluacionIntegral[];
  save(input: SaveEvaluacionIntegralInput): EvaluacionIntegral | null;
  update(id: string, input: UpdateEvaluacionIntegralInput): EvaluacionIntegral | null;
  delete(id: string): boolean;
}

export class LocalEvaluacionesRepository implements EvaluacionesRepository {
  getAll(): EvaluacionIntegral[] {
    return readEvaluacionesIntegrales();
  }

  getById(id: string): EvaluacionIntegral | null {
    return getEvaluacionIntegralById(id);
  }

  getByEstudianteId(estudianteId: string): EvaluacionIntegral[] {
    return getEvaluacionesIntegralesByEstudianteId(estudianteId);
  }

  save(input: SaveEvaluacionIntegralInput): EvaluacionIntegral | null {
    return saveEvaluacionIntegral(input);
  }

  update(
    id: string,
    input: UpdateEvaluacionIntegralInput
  ): EvaluacionIntegral | null {
    return updateEvaluacionIntegral(id, input);
  }

  delete(id: string): boolean {
    return deleteEvaluacionIntegral(id);
  }
}
