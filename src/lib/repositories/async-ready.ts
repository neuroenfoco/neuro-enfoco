/**
 * Tipos futuros para repositorios async (Supabase).
 *
 * NO convertir implementaciones locales aún: los Local*Repository siguen siendo
 * síncronos. Este módulo centraliza el contrato Promise que adoptarán las
 * implementaciones Supabase y la migración gradual de consumidores UI.
 */

import type { ApoyosRepository } from "@/lib/repositories/apoyos-repository";
import type {
  SaveEstudianteInput,
} from "@/lib/repositories/estudiantes-repository";
import type { EvaluacionesRepository } from "@/lib/repositories/evaluaciones-repository";
import type { IntervencionesRepository } from "@/lib/repositories/intervenciones-repository";
import type { ObjetivosRepository } from "@/lib/repositories/objetivos-repository";
import type { PACIRepository } from "@/lib/repositories/paci-repository";
import type { Estudiante } from "@/lib/students-storage";

type AsyncMethod<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => Promise<R>
  : never;

type AsyncRepository<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown
    ? AsyncMethod<T[K]>
    : T[K];
};

/** Repositorios que requerirán migración a Promise en fase Supabase. */
export interface AsyncEstudiantesRepository {
  getAll(): Promise<Estudiante[]>;
  getById(id: string): Promise<Estudiante | null>;
  save(input: SaveEstudianteInput): Promise<Estudiante>;
  marcarIngresoPieCompletado(
    estudianteId: string,
    completadoEn?: string
  ): Promise<Estudiante | null>;
  delete(id: string): Promise<boolean>;
}

export type AsyncObjetivosRepository = AsyncRepository<ObjetivosRepository>;
export type AsyncEvaluacionesRepository = AsyncRepository<EvaluacionesRepository>;
export type AsyncPACIRepository = AsyncRepository<PACIRepository>;
export type AsyncIntervencionesRepository = AsyncRepository<IntervencionesRepository>;
export type AsyncApoyosRepository = AsyncRepository<ApoyosRepository>;

export const ASYNC_READY_REPOSITORIES = [
  "EstudiantesRepository",
  "ObjetivosRepository",
  "EvaluacionesRepository",
  "PACIRepository",
  "IntervencionesRepository",
  "ApoyosRepository",
] as const;

export type AsyncReadyRepositoryName = (typeof ASYNC_READY_REPOSITORIES)[number];

/**
 * Orden sugerido de migración async (menor acoplamiento → mayor cascada).
 * Evaluaciones y PACI tienen dependencias cruzadas con objetivos y estudiantes.
 */
export const ASYNC_MIGRATION_ORDER: AsyncReadyRepositoryName[] = [
  "EstudiantesRepository",
  "ObjetivosRepository",
  "IntervencionesRepository",
  "ApoyosRepository",
  "EvaluacionesRepository",
  "PACIRepository",
];
