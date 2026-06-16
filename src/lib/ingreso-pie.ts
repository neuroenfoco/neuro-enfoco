import type { CatalogKind } from "@/lib/catalogos/catalog-types";
import { CATALOGO_OTRO_ID } from "@/lib/catalogos/catalog-types";
import { getEvaluacionIngresoCerradaByEstudianteId } from "@/lib/evaluacion-integral/evaluacion-integral-storage";
import { estaEnPerfilBase } from "@/lib/hallazgo-estado-conocimiento";
import {
  type EstadoPIE,
  type MarcoInstitucionalPIE,
  saveMarcoInstitucionalPIE,
  validateFechasMarco,
} from "@/lib/marco-institucional-pie-storage";
import {
  createHallazgoPerfil,
  findHallazgoByCatalogoId,
  findHallazgoByNombre,
  incorporarHallazgoAlPerfilBase,
  normalizeHallazgoNombre,
  type HallazgoTipo,
} from "@/lib/perfil-hallazgos-storage";
import { getEstudiantesRepositoryAsync } from "@/lib/repositories/repository-factory";
import { getEstudianteById } from "@/lib/students-storage";

/** Marca evaluaciones originadas en el wizard de Ingreso PIE (legacy A3). */
export const INGRESO_PIE_EVALUACION_ORIGEN = "ingreso_pie";

export type HallazgoIngresoBorrador = {
  tipo: HallazgoTipo;
  nombre: string;
  catalogoKind?: CatalogKind;
  catalogoId?: string;
  formulacionOriginal?: string;
};

export type IngresoPieMarcoInput = {
  estadoPIE?: EstadoPIE;
  fechaIngresoPIE: string;
  fechaProximaReevaluacionIntegral?: string;
  tipoNEE?: string;
  diagnosticoPrincipal?: string;
  referenciaEvaluacionPrevia?: string;
  observacionesInstitucionales?: string;
};

export type CompletarIngresoPIEInput = {
  estudianteId: string;
  marco: IngresoPieMarcoInput;
  hallazgos: HallazgoIngresoBorrador[];
};

export type CompletarIngresoPIEResult =
  | {
      ok: true;
      estudianteId: string;
      marco: MarcoInstitucionalPIE;
      /** Hallazgos incorporados al Perfil Base. */
      hallazgosConsolidados: number;
      /** Alias retrocompatible con consumidores previos. */
      hallazgosCreados: number;
    }
  | { ok: false; error: string };

function ingresoPIECompletadoDesdeEstudiante(
  estudiante: { ingresoPieCompletado?: boolean } | null | undefined,
  estudianteId: string
): boolean {
  if (estudiante?.ingresoPieCompletado) return true;
  return getEvaluacionIngresoCerradaByEstudianteId(estudianteId) !== null;
}

/** Ingreso PIE completado vía flag o evaluación de ingreso cerrada (legacy). */
export function tieneIngresoPIECompletado(estudianteId: string): boolean {
  return ingresoPIECompletadoDesdeEstudiante(
    getEstudianteById(estudianteId),
    estudianteId
  );
}

/** Misma regla que `tieneIngresoPIECompletado`, vía repositorio async activo. */
export async function tieneIngresoPIECompletadoAsync(
  estudianteId: string
): Promise<boolean> {
  const trimmed = estudianteId.trim();
  if (!trimmed) return false;

  const estudiante = await getEstudiantesRepositoryAsync().getById(trimmed);
  return ingresoPIECompletadoDesdeEstudiante(estudiante, trimmed);
}

function deduplicarBorradores(
  borradores: HallazgoIngresoBorrador[]
): HallazgoIngresoBorrador[] {
  const seenCatalogo = new Set<string>();
  const seenNombre = new Set<string>();
  const result: HallazgoIngresoBorrador[] = [];

  for (const borrador of borradores) {
    const nombre = normalizeHallazgoNombre(borrador.nombre);
    if (!nombre) continue;

    if (
      borrador.catalogoId &&
      borrador.catalogoId !== CATALOGO_OTRO_ID
    ) {
      const key = `${borrador.tipo}:${borrador.catalogoId}`;
      if (seenCatalogo.has(key)) continue;
      seenCatalogo.add(key);
      result.push({ ...borrador, nombre });
      continue;
    }

    const nombreKey = `${borrador.tipo}:${nombre.toLowerCase()}`;
    if (seenNombre.has(nombreKey)) continue;
    seenNombre.add(nombreKey);
    result.push({ ...borrador, nombre });
  }

  return result;
}

function consolidarHallazgosIngresoPIE(
  estudianteId: string,
  borradores: HallazgoIngresoBorrador[],
  perfilBaseDesde: string
): { consolidados: number } {
  let consolidados = 0;

  for (const borrador of borradores) {
    const existentePorCatalogo = borrador.catalogoId
      ? findHallazgoByCatalogoId(
          estudianteId,
          borrador.tipo,
          borrador.catalogoId
        )
      : null;

    const existente =
      existentePorCatalogo ??
      findHallazgoByNombre(estudianteId, borrador.tipo, borrador.nombre);

    if (existente) {
      if (!estaEnPerfilBase(existente)) {
        incorporarHallazgoAlPerfilBase({
          hallazgoId: existente.id,
          perfilBaseDesde,
        });
      }
      consolidados += 1;
      continue;
    }

    const creado = createHallazgoPerfil({
      estudianteId,
      tipo: borrador.tipo,
      nombre: borrador.nombre,
      origen: "ingreso_pie",
      perfilBaseDesde,
      catalogoKind: borrador.catalogoKind,
      catalogoId: borrador.catalogoId,
      formulacionOriginal: borrador.formulacionOriginal,
    });

    if (creado) consolidados += 1;
  }

  return { consolidados };
}

/**
 * Completa el ingreso PIE guardando marco institucional, hallazgos en Perfil Base
 * y marcando el estudiante. No crea EvaluacionIntegral.
 */
export async function completarIngresoPIE(
  input: CompletarIngresoPIEInput
): Promise<CompletarIngresoPIEResult> {
  if (typeof window === "undefined") {
    return { ok: false, error: "Solo disponible en el cliente." };
  }

  const estudianteId = input.estudianteId.trim();

  if (!estudianteId) {
    return { ok: false, error: "Debes seleccionar un estudiante." };
  }

  const estudiante =
    await getEstudiantesRepositoryAsync().getById(estudianteId);

  if (!estudiante) {
    return { ok: false, error: "El estudiante seleccionado no existe." };
  }

  if (await tieneIngresoPIECompletadoAsync(estudiante.id)) {
    return {
      ok: false,
      error:
        "El Ingreso PIE ya fue completado para este estudiante. Verifique el marco institucional.",
    };
  }

  const fechaError = validateFechasMarco(input.marco);
  if (fechaError) {
    return { ok: false, error: fechaError };
  }

  const marco = saveMarcoInstitucionalPIE({
    estudianteId: estudiante.id,
    ...input.marco,
    estadoPIE: input.marco.estadoPIE ?? "ingreso",
  });

  const borradores = deduplicarBorradores(input.hallazgos);
  const { consolidados } = consolidarHallazgosIngresoPIE(
    estudiante.id,
    borradores,
    marco.fechaIngresoPIE
  );

  const marcado = await getEstudiantesRepositoryAsync().marcarIngresoPieCompletado(
    estudiante.id,
    marco.fechaIngresoPIE
  );
  if (!marcado) {
    return {
      ok: false,
      error: "No se pudo marcar el ingreso PIE como completado.",
    };
  }

  return {
    ok: true,
    estudianteId: estudiante.id,
    marco,
    hallazgosConsolidados: consolidados,
    hallazgosCreados: consolidados,
  };
}
