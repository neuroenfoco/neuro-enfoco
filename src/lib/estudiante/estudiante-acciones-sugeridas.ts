import { GLOSSARY } from "@/lib/copy/glossary";
import { getEstudiantePACIEstadoResumen } from "@/lib/estudiante/estudiante-resumen-integral";
import {
  getEstudianteObjetivosSeguimiento,
} from "@/lib/objetivos/objetivo-seguimiento";
import {
  getEvaluacionesRepository,
  getIntervencionesRepository,
  getObjetivosRepository,
  getSesionesRepository,
} from "@/lib/repositories/repository-factory";
import {
  isWithinDays,
  parseFechaOrdenInstitucional,
  startOfTodayMs,
} from "@/lib/shared/fecha-institucional";

export type AccionSugeridaId =
  | "evaluacion_integral"
  | "objetivos_pie"
  | "crear_paci"
  | "seguimiento_intervenciones"
  | "objetivo_sin_seguimiento"
  | "objetivo_riesgo"
  | "objetivo_sin_evidencias";

export type AccionSugerida = {
  id: AccionSugeridaId;
  titulo: string;
  descripcion: string;
  prioridad: number;
};

const DIAS_SIN_INTERVENCION_SEGUIMIENTO = 30;

function tieneIntervencionReciente(estudianteId: string): boolean {
  const referenceMs = startOfTodayMs();

  for (const intervencion of getIntervencionesRepository().getByEstudianteId(
    estudianteId
  )) {
    if (
      isWithinDays(
        parseFechaOrdenInstitucional(intervencion.fecha),
        DIAS_SIN_INTERVENCION_SEGUIMIENTO,
        referenceMs
      )
    ) {
      return true;
    }

    for (const sesion of getSesionesRepository().getByIntervencionId(
      intervencion.id
    )) {
      if (
        isWithinDays(
          parseFechaOrdenInstitucional(sesion.fecha),
          DIAS_SIN_INTERVENCION_SEGUIMIENTO,
          referenceMs
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

function tieneEvaluacionIntegral(estudianteId: string): boolean {
  return getEvaluacionesRepository()
    .getByEstudianteId(estudianteId)
    .some((item) => item.estado !== "anulada");
}

function agregarAccionesSeguimientoObjetivos(
  estudianteId: string,
  acciones: AccionSugerida[]
): void {
  const COPY = GLOSSARY.estudiante;
  const seguimientos = getEstudianteObjetivosSeguimiento(estudianteId);

  if (seguimientos.some((item) => item.estadoSeguimiento === "riesgo")) {
    acciones.push({
      id: "objetivo_riesgo",
      titulo: COPY.accionObjetivoRiesgoTitulo,
      descripcion: COPY.accionObjetivoRiesgoDescripcion,
      prioridad: 5,
    });
  }

  if (seguimientos.some((item) => item.estadoSeguimiento === "sin_seguimiento")) {
    acciones.push({
      id: "objetivo_sin_seguimiento",
      titulo: COPY.accionObjetivoSinSeguimientoTitulo,
      descripcion: COPY.accionObjetivoSinSeguimientoDescripcion,
      prioridad: 6,
    });
  }

  if (
    seguimientos.some(
      (item) =>
        item.cantidadIntervenciones > 0 && item.cantidadEvidencias === 0
    )
  ) {
    acciones.push({
      id: "objetivo_sin_evidencias",
      titulo: COPY.accionObjetivoSinEvidenciasTitulo,
      descripcion: COPY.accionObjetivoSinEvidenciasDescripcion,
      prioridad: 7,
    });
  }
}

export function getEstudianteAccionesSugeridas(
  estudianteId: string
): AccionSugerida[] {
  const COPY = GLOSSARY.estudiante;
  const acciones: AccionSugerida[] = [];

  const evaluacion = tieneEvaluacionIntegral(estudianteId);
  const objetivos =
    getObjetivosRepository().getByEstudianteId(estudianteId).length > 0;
  const paciEstado = getEstudiantePACIEstadoResumen(estudianteId);

  if (!evaluacion) {
    acciones.push({
      id: "evaluacion_integral",
      titulo: COPY.accionEvaluacionTitulo,
      descripcion: COPY.accionEvaluacionDescripcion,
      prioridad: 1,
    });
    return acciones;
  }

  if (!objetivos) {
    acciones.push({
      id: "objetivos_pie",
      titulo: COPY.accionObjetivosTitulo,
      descripcion: COPY.accionObjetivosDescripcion,
      prioridad: 2,
    });
    return acciones;
  }

  if (paciEstado === "sin_paci") {
    acciones.push({
      id: "crear_paci",
      titulo: COPY.accionPaciTitulo,
      descripcion: COPY.accionPaciDescripcion,
      prioridad: 3,
    });
    return acciones;
  }

  if (paciEstado === "vigente" && !tieneIntervencionReciente(estudianteId)) {
    acciones.push({
      id: "seguimiento_intervenciones",
      titulo: COPY.accionSeguimientoTitulo,
      descripcion: COPY.accionSeguimientoDescripcion,
      prioridad: 4,
    });
  }

  agregarAccionesSeguimientoObjetivos(estudianteId, acciones);

  return acciones.sort((a, b) => a.prioridad - b.prioridad);
}
