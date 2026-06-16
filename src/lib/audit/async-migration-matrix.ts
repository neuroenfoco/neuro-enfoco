/**
 * Matriz de métodos que migrarán a async por repositorio (PACI-A15.1).
 * Derivada de interfaces actuales en src/lib/repositories/*.
 */

import { ASYNC_MIGRATION_ORDER } from "@/lib/repositories/async-ready";

export type AsyncMigrationEntry = {
  repository: string;
  method: string;
  currentSignature: string;
  futureSignature: string;
  migrationPhase: "A17" | "A18";
};

export const ASYNC_MIGRATION_MATRIX: AsyncMigrationEntry[] = [
  // EstudiantesRepository
  {
    repository: "EstudiantesRepository",
    method: "getAll",
    currentSignature: "(): Estudiante[]",
    futureSignature: "(): Promise<Estudiante[]>",
    migrationPhase: "A17",
  },
  {
    repository: "EstudiantesRepository",
    method: "getById",
    currentSignature: "(id: string): Estudiante | null",
    futureSignature: "(id: string): Promise<Estudiante | null>",
    migrationPhase: "A17",
  },
  {
    repository: "EstudiantesRepository",
    method: "save",
    currentSignature: "(input: SaveEstudianteInput): Estudiante",
    futureSignature: "(input: SaveEstudianteInput): Promise<Estudiante>",
    migrationPhase: "A17",
  },
  {
    repository: "EstudiantesRepository",
    method: "delete",
    currentSignature: "(id: string): boolean",
    futureSignature: "(id: string): Promise<boolean>",
    migrationPhase: "A17",
  },
  // ObjetivosRepository
  {
    repository: "ObjetivosRepository",
    method: "getAll",
    currentSignature: "(): ObjetivoPIE[]",
    futureSignature: "(): Promise<ObjetivoPIE[]>",
    migrationPhase: "A17",
  },
  {
    repository: "ObjetivosRepository",
    method: "getById",
    currentSignature: "(id: string): ObjetivoPIE | null",
    futureSignature: "(id: string): Promise<ObjetivoPIE | null>",
    migrationPhase: "A17",
  },
  {
    repository: "ObjetivosRepository",
    method: "getByEstudianteId",
    currentSignature: "(estudianteId: string): ObjetivoPIE[]",
    futureSignature: "(estudianteId: string): Promise<ObjetivoPIE[]>",
    migrationPhase: "A17",
  },
  {
    repository: "ObjetivosRepository",
    method: "save",
    currentSignature: "(input: SaveObjetivoPIEInput): ObjetivoPIE",
    futureSignature: "(input: SaveObjetivoPIEInput): Promise<ObjetivoPIE>",
    migrationPhase: "A17",
  },
  {
    repository: "ObjetivosRepository",
    method: "update",
    currentSignature: "(id: string, input: UpdateObjetivoPIEInput): ObjetivoPIE | null",
    futureSignature: "(id: string, input: UpdateObjetivoPIEInput): Promise<ObjetivoPIE | null>",
    migrationPhase: "A17",
  },
  {
    repository: "ObjetivosRepository",
    method: "delete",
    currentSignature: "(id: string): boolean",
    futureSignature: "(id: string): Promise<boolean>",
    migrationPhase: "A17",
  },
  // IntervencionesRepository
  {
    repository: "IntervencionesRepository",
    method: "getAll",
    currentSignature: "(): Intervencion[]",
    futureSignature: "(): Promise<Intervencion[]>",
    migrationPhase: "A17",
  },
  {
    repository: "IntervencionesRepository",
    method: "getById",
    currentSignature: "(id: string): Intervencion | null",
    futureSignature: "(id: string): Promise<Intervencion | null>",
    migrationPhase: "A17",
  },
  {
    repository: "IntervencionesRepository",
    method: "getByEstudianteId",
    currentSignature: "(estudianteId: string): Intervencion[]",
    futureSignature: "(estudianteId: string): Promise<Intervencion[]>",
    migrationPhase: "A17",
  },
  {
    repository: "IntervencionesRepository",
    method: "getByObjetivoId",
    currentSignature: "(objetivoId: string): Intervencion[]",
    futureSignature: "(objetivoId: string): Promise<Intervencion[]>",
    migrationPhase: "A17",
  },
  {
    repository: "IntervencionesRepository",
    method: "save",
    currentSignature: "(input: SaveIntervencionInput): Intervencion | null",
    futureSignature: "(input: SaveIntervencionInput): Promise<Intervencion | null>",
    migrationPhase: "A17",
  },
  {
    repository: "IntervencionesRepository",
    method: "update",
    currentSignature: "(id: string, input: UpdateIntervencionInput): Intervencion | null",
    futureSignature: "(id: string, input: UpdateIntervencionInput): Promise<Intervencion | null>",
    migrationPhase: "A17",
  },
  {
    repository: "IntervencionesRepository",
    method: "delete",
    currentSignature: "(id: string): boolean",
    futureSignature: "(id: string): Promise<boolean>",
    migrationPhase: "A17",
  },
  // ApoyosRepository
  {
    repository: "ApoyosRepository",
    method: "getAll",
    currentSignature: "(): ApoyoPIE[]",
    futureSignature: "(): Promise<ApoyoPIE[]>",
    migrationPhase: "A17",
  },
  {
    repository: "ApoyosRepository",
    method: "getById",
    currentSignature: "(id: string): ApoyoPIE | null",
    futureSignature: "(id: string): Promise<ApoyoPIE | null>",
    migrationPhase: "A17",
  },
  {
    repository: "ApoyosRepository",
    method: "getByEstudianteId",
    currentSignature: "(estudianteId: string): ApoyoPIE[]",
    futureSignature: "(estudianteId: string): Promise<ApoyoPIE[]>",
    migrationPhase: "A17",
  },
  {
    repository: "ApoyosRepository",
    method: "getByObjetivoId",
    currentSignature: "(objetivoPieId: string): ApoyoPIE[]",
    futureSignature: "(objetivoPieId: string): Promise<ApoyoPIE[]>",
    migrationPhase: "A17",
  },
  {
    repository: "ApoyosRepository",
    method: "save",
    currentSignature: "(input: CreateApoyoPIEInput): ApoyoPIE | null",
    futureSignature: "(input: CreateApoyoPIEInput): Promise<ApoyoPIE | null>",
    migrationPhase: "A17",
  },
  {
    repository: "ApoyosRepository",
    method: "update",
    currentSignature: "(id: string, input: UpdateApoyoPIEInput): ApoyoPIE | null",
    futureSignature: "(id: string, input: UpdateApoyoPIEInput): Promise<ApoyoPIE | null>",
    migrationPhase: "A17",
  },
  {
    repository: "ApoyosRepository",
    method: "delete",
    currentSignature: "(id: string): boolean",
    futureSignature: "(id: string): Promise<boolean>",
    migrationPhase: "A17",
  },
  // EvaluacionesRepository
  {
    repository: "EvaluacionesRepository",
    method: "getAll",
    currentSignature: "(): EvaluacionIntegral[]",
    futureSignature: "(): Promise<EvaluacionIntegral[]>",
    migrationPhase: "A18",
  },
  {
    repository: "EvaluacionesRepository",
    method: "getById",
    currentSignature: "(id: string): EvaluacionIntegral | null",
    futureSignature: "(id: string): Promise<EvaluacionIntegral | null>",
    migrationPhase: "A18",
  },
  {
    repository: "EvaluacionesRepository",
    method: "getByEstudianteId",
    currentSignature: "(estudianteId: string): EvaluacionIntegral[]",
    futureSignature: "(estudianteId: string): Promise<EvaluacionIntegral[]>",
    migrationPhase: "A18",
  },
  {
    repository: "EvaluacionesRepository",
    method: "save",
    currentSignature: "(input: SaveEvaluacionIntegralInput): EvaluacionIntegral | null",
    futureSignature: "(input: SaveEvaluacionIntegralInput): Promise<EvaluacionIntegral | null>",
    migrationPhase: "A18",
  },
  {
    repository: "EvaluacionesRepository",
    method: "update",
    currentSignature: "(id: string, input: UpdateEvaluacionIntegralInput): EvaluacionIntegral | null",
    futureSignature: "(id: string, input: UpdateEvaluacionIntegralInput): Promise<EvaluacionIntegral | null>",
    migrationPhase: "A18",
  },
  {
    repository: "EvaluacionesRepository",
    method: "delete",
    currentSignature: "(id: string): boolean",
    futureSignature: "(id: string): Promise<boolean>",
    migrationPhase: "A18",
  },
  // PACIRepository
  {
    repository: "PACIRepository",
    method: "getAll",
    currentSignature: "(): PACI[]",
    futureSignature: "(): Promise<PACI[]>",
    migrationPhase: "A18",
  },
  {
    repository: "PACIRepository",
    method: "getById",
    currentSignature: "(id: string): PACI | null",
    futureSignature: "(id: string): Promise<PACI | null>",
    migrationPhase: "A18",
  },
  {
    repository: "PACIRepository",
    method: "getByEstudianteId",
    currentSignature: "(estudianteId: string): PACI[]",
    futureSignature: "(estudianteId: string): Promise<PACI[]>",
    migrationPhase: "A18",
  },
  {
    repository: "PACIRepository",
    method: "save",
    currentSignature: "(input: SavePACIInput): PACI | null",
    futureSignature: "(input: SavePACIInput): Promise<PACI | null>",
    migrationPhase: "A18",
  },
  {
    repository: "PACIRepository",
    method: "update",
    currentSignature: "(id: string, input: UpdatePACIBorradorInput): PACI | null",
    futureSignature: "(id: string, input: UpdatePACIBorradorInput): Promise<PACI | null>",
    migrationPhase: "A18",
  },
  {
    repository: "PACIRepository",
    method: "delete",
    currentSignature: "(id: string): boolean",
    futureSignature: "(id: string): Promise<boolean>",
    migrationPhase: "A18",
  },
  // SesionesRepository (no en ASYNC_READY_REPOSITORIES; fase A18 extendida)
  {
    repository: "SesionesRepository",
    method: "getAll",
    currentSignature: "(): Sesion[]",
    futureSignature: "(): Promise<Sesion[]>",
    migrationPhase: "A18",
  },
  {
    repository: "SesionesRepository",
    method: "getById",
    currentSignature: "(id: string): Sesion | null",
    futureSignature: "(id: string): Promise<Sesion | null>",
    migrationPhase: "A18",
  },
  {
    repository: "SesionesRepository",
    method: "getByEstudianteId",
    currentSignature: "(estudianteId: string): Sesion[]",
    futureSignature: "(estudianteId: string): Promise<Sesion[]>",
    migrationPhase: "A18",
  },
  {
    repository: "SesionesRepository",
    method: "getByIntervencionId",
    currentSignature: "(intervencionId: string): Sesion[]",
    futureSignature: "(intervencionId: string): Promise<Sesion[]>",
    migrationPhase: "A18",
  },
];

export { ASYNC_MIGRATION_ORDER };

export function getAsyncMigrationMethodCount(): number {
  return ASYNC_MIGRATION_MATRIX.length;
}

export function getAsyncMigrationMethodCountByRepository(
  repository: string
): number {
  return ASYNC_MIGRATION_MATRIX.filter(
    (entry) => entry.repository === repository
  ).length;
}
