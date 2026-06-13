import type { ConsolidarHallazgosEvaluacionResult } from "@/lib/evaluacion-integral/evaluacion-integral-types";
import {
  getEvaluacionIntegralById,
  marcarEvaluacionIntegralCerrada,
} from "@/lib/evaluacion-integral/evaluacion-integral-storage";
import {
  getHallazgosEvaluativosByEvaluacionId,
  vincularHallazgoEvaluativoAPerfil,
} from "@/lib/evaluacion-integral/hallazgo-evaluativo-storage";
import { aplicarSnapshotsParticipacionesEvaluacion } from "@/lib/evaluacion-integral/participacion-evaluacion-integral-storage";
import {
  getMarcoInstitucionalPIEByEstudianteId,
  saveMarcoInstitucionalPIE,
} from "@/lib/marco-institucional-pie-storage";
import {
  createHallazgoPerfil,
  findHallazgoByCatalogoId,
  findHallazgoByNombre,
  incorporarHallazgoAlPerfilBase,
} from "@/lib/perfil-hallazgos-storage";
import { estaEnPerfilBase } from "@/lib/hallazgo-estado-conocimiento";

export type CerrarEvaluacionIntegralResult =
  | {
      ok: true;
      evaluacionIntegralId: string;
      fechaCierre: string;
      snapshotsAplicados: number;
      consolidacion: ConsolidarHallazgosEvaluacionResult;
      marcoSincronizado: boolean;
    }
  | { ok: false; error: string };

export function consolidarHallazgosEvaluacion(
  evaluacionIntegralId: string
): ConsolidarHallazgosEvaluacionResult | null {
  const evaluacion = getEvaluacionIntegralById(evaluacionIntegralId);
  if (!evaluacion || evaluacion.estado !== "cerrada") return null;

  const fechaConsolidacion = evaluacion.fechaCierre ?? evaluacion.actualizadoEn;
  const hallazgos = getHallazgosEvaluativosByEvaluacionId(evaluacionIntegralId);

  let vinculadosExistentes = 0;
  let creadosEnPerfil = 0;
  let yaConsolidados = 0;

  for (const hallazgoEvaluativo of hallazgos) {
    if (hallazgoEvaluativo.consolidadoEn && hallazgoEvaluativo.hallazgoPerfilId) {
      yaConsolidados += 1;
      continue;
    }

    const existentePorCatalogo = hallazgoEvaluativo.catalogoId
      ? findHallazgoByCatalogoId(
          evaluacion.estudianteId,
          hallazgoEvaluativo.tipo,
          hallazgoEvaluativo.catalogoId
        )
      : null;

    const existente =
      existentePorCatalogo ??
      findHallazgoByNombre(
        evaluacion.estudianteId,
        hallazgoEvaluativo.tipo,
        hallazgoEvaluativo.nombre
      );

    if (existente) {
      if (!estaEnPerfilBase(existente)) {
        incorporarHallazgoAlPerfilBase({
          hallazgoId: existente.id,
          perfilBaseDesde: fechaConsolidacion,
        });
      }

      vincularHallazgoEvaluativoAPerfil(
        hallazgoEvaluativo.id,
        existente.id,
        fechaConsolidacion
      );
      vinculadosExistentes += 1;
      continue;
    }

    const creado = createHallazgoPerfil({
      estudianteId: evaluacion.estudianteId,
      tipo: hallazgoEvaluativo.tipo,
      nombre: hallazgoEvaluativo.nombre,
      origen: "evaluacion_integral",
      perfilBaseDesde: fechaConsolidacion,
      catalogoKind: hallazgoEvaluativo.catalogoKind,
      catalogoId: hallazgoEvaluativo.catalogoId,
      formulacionOriginal: hallazgoEvaluativo.formulacionOriginal,
      evaluacionIntegralId: evaluacion.id,
      hallazgoEvaluativoId: hallazgoEvaluativo.id,
    });

    if (!creado) continue;

    vincularHallazgoEvaluativoAPerfil(
      hallazgoEvaluativo.id,
      creado.id,
      fechaConsolidacion
    );
    creadosEnPerfil += 1;
  }

  return {
    evaluacionIntegralId,
    procesados: hallazgos.length,
    vinculadosExistentes,
    creadosEnPerfil,
    yaConsolidados,
  };
}

export function sincronizarMarcoDesdeEvaluacion(
  evaluacionIntegralId: string
): boolean {
  const evaluacion = getEvaluacionIntegralById(evaluacionIntegralId);
  if (!evaluacion || evaluacion.estado !== "cerrada") return false;

  const marco = getMarcoInstitucionalPIEByEstudianteId(evaluacion.estudianteId);
  if (!marco) return false;

  saveMarcoInstitucionalPIE({
    estudianteId: evaluacion.estudianteId,
    estadoPIE: marco.estadoPIE,
    fechaIngresoPIE: marco.fechaIngresoPIE,
    fechaProximaReevaluacionIntegral:
      evaluacion.fechaProximaReevaluacion ??
      marco.fechaProximaReevaluacionIntegral,
    tipoNEE: evaluacion.tipoNEE ?? marco.tipoNEE,
    diagnosticoPrincipal:
      evaluacion.diagnosticoNEEResumen ?? marco.diagnosticoPrincipal,
    referenciaEvaluacionPrevia:
      evaluacion.referenciaEvaluacionPrevia ?? marco.referenciaEvaluacionPrevia,
    observacionesInstitucionales: marco.observacionesInstitucionales,
  });

  return true;
}

export function cerrarEvaluacionIntegral(
  evaluacionIntegralId: string,
  fechaCierre?: string
): CerrarEvaluacionIntegralResult {
  const evaluacion = getEvaluacionIntegralById(evaluacionIntegralId);
  if (!evaluacion) {
    return { ok: false, error: "Evaluación integral no encontrada." };
  }
  if (evaluacion.estado !== "borrador") {
    return {
      ok: false,
      error: "Solo se pueden cerrar evaluaciones en estado borrador.",
    };
  }

  const cierre = (fechaCierre ?? evaluacion.fechaTermino ?? new Date().toISOString()).trim();
  const cerrada = marcarEvaluacionIntegralCerrada(evaluacionIntegralId, cierre);
  if (!cerrada) {
    return {
      ok: false,
      error:
        "No se pudo cerrar la evaluación. Verifique fechas y que no exista otra evaluación de ingreso cerrada.",
    };
  }

  const snapshotsAplicados =
    aplicarSnapshotsParticipacionesEvaluacion(evaluacionIntegralId);

  const consolidacion = consolidarHallazgosEvaluacion(evaluacionIntegralId);
  if (!consolidacion) {
    return {
      ok: false,
      error: "La evaluación se cerró pero falló la consolidación de hallazgos.",
    };
  }

  const marcoSincronizado = sincronizarMarcoDesdeEvaluacion(evaluacionIntegralId);

  return {
    ok: true,
    evaluacionIntegralId,
    fechaCierre: cierre,
    snapshotsAplicados,
    consolidacion,
    marcoSincronizado,
  };
}
