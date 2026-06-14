import type { CatalogKind } from "@/lib/catalogos/catalog-types";
import { CATALOGO_OTRO_ID } from "@/lib/catalogos/catalog-types";
import { cerrarEvaluacionIntegral } from "@/lib/evaluacion-integral/evaluacion-integral-consolidacion";
import { saveHallazgoEvaluativo } from "@/lib/evaluacion-integral/hallazgo-evaluativo-storage";
import { saveEvaluacionIntegral } from "@/lib/evaluacion-integral/evaluacion-integral-storage";
import type { EvaluacionIntegral } from "@/lib/evaluacion-integral/evaluacion-integral-types";
import {
  type EstadoPIE,
  type MarcoInstitucionalPIE,
  saveMarcoInstitucionalPIE,
  validateFechasMarco,
} from "@/lib/marco-institucional-pie-storage";
import {
  normalizeHallazgoNombre,
  type HallazgoTipo,
} from "@/lib/perfil-hallazgos-storage";
import {
  getEstudianteById,
} from "@/lib/students-storage";

/** Marca evaluaciones originadas en el wizard de Ingreso PIE (A3). */
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
      evaluacionIntegralId: string;
      hallazgosEvaluativosCreados: number;
      /** Hallazgos consolidados en Perfil Base tras el cierre. */
      hallazgosConsolidados: number;
      /** Alias retrocompatible con consumidores previos. */
      hallazgosCreados: number;
    }
  | { ok: false; error: string };

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

function crearEvaluacionIngresoDesdeMarco(
  estudianteId: string,
  marco: MarcoInstitucionalPIE,
  inputMarco: IngresoPieMarcoInput
): EvaluacionIntegral | null {
  return saveEvaluacionIntegral({
    estudianteId,
    tipo: "ingreso",
    fechaInicio: marco.fechaIngresoPIE,
    ingresoPieOrigen: INGRESO_PIE_EVALUACION_ORIGEN,
    tipoNEE: inputMarco.tipoNEE,
    diagnosticoNEEResumen: inputMarco.diagnosticoPrincipal,
    fechaProximaReevaluacion: inputMarco.fechaProximaReevaluacionIntegral,
    referenciaEvaluacionPrevia: inputMarco.referenciaEvaluacionPrevia,
    observacionesEvaluacion: inputMarco.observacionesInstitucionales,
  });
}

function persistirHallazgosEvaluativosDesdeIngreso(
  evaluacionIntegralId: string,
  estudianteId: string,
  borradores: HallazgoIngresoBorrador[]
): { creados: number; error?: string } {
  let creados = 0;

  for (const borrador of borradores) {
    const hallazgo = saveHallazgoEvaluativo({
      evaluacionIntegralId,
      estudianteId,
      tipo: borrador.tipo,
      nombre: borrador.nombre,
      catalogoKind: borrador.catalogoKind,
      catalogoId: borrador.catalogoId,
      formulacionOriginal: borrador.formulacionOriginal,
    });

    if (!hallazgo) {
      return {
        creados,
        error: `No se pudo registrar el hallazgo evaluativo «${borrador.nombre}».`,
      };
    }

    creados += 1;
  }

  return { creados };
}

/**
 * Completa el ingreso PIE creando EvaluacionIntegral, HallazgoEvaluativo y
 * consolidando en Perfil Base vía cerrarEvaluacionIntegral() (pipeline único).
 */
export function completarIngresoPIE(
  input: CompletarIngresoPIEInput
): CompletarIngresoPIEResult {
  if (typeof window === "undefined") {
    return { ok: false, error: "Solo disponible en el cliente." };
  }

  const estudianteId = input.estudianteId.trim();

  if (!estudianteId) {
    return { ok: false, error: "Debes seleccionar un estudiante." };
  }

  const estudiante = getEstudianteById(estudianteId);

  if (!estudiante) {
    return { ok: false, error: "El estudiante seleccionado no existe." };
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

  const evaluacion = crearEvaluacionIngresoDesdeMarco(
    estudiante.id,
    marco,
    input.marco
  );

  if (!evaluacion) {
    return {
      ok: false,
      error:
        "No se pudo crear la evaluación integral de ingreso. Verifique fechas y que no exista otra evaluación de ingreso cerrada.",
    };
  }

  const borradores = deduplicarBorradores(input.hallazgos);
  const hallazgosPersistidos = persistirHallazgosEvaluativosDesdeIngreso(
    evaluacion.id,
    estudiante.id,
    borradores
  );

  if (hallazgosPersistidos.error) {
    return { ok: false, error: hallazgosPersistidos.error };
  }

  const cierre = cerrarEvaluacionIntegral(evaluacion.id, marco.fechaIngresoPIE);

  if (!cierre.ok) {
    return { ok: false, error: cierre.error };
  }

  const hallazgosConsolidados =
    cierre.consolidacion.creadosEnPerfil +
    cierre.consolidacion.vinculadosExistentes +
    cierre.consolidacion.yaConsolidados;

  return {
    ok: true,
    estudianteId: estudiante.id,
    marco,
    evaluacionIntegralId: evaluacion.id,
    hallazgosEvaluativosCreados: hallazgosPersistidos.creados,
    hallazgosConsolidados,
    hallazgosCreados: hallazgosConsolidados,
  };
}
