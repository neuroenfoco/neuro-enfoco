import {
  getApoyoEfectividadIndicadores,
  getApoyoEfectividadView,
} from "@/lib/apoyos/apoyo-efectividad-view";
import { getApoyoIntervencionIndicadores } from "@/lib/apoyos/apoyo-intervencion-view";
import { getApoyosImplementadosIndicadores } from "@/lib/apoyos/apoyos-view";
import { getEstudianteBarrerasApoyosResumen } from "@/lib/apoyos/barreras-apoyos-view";
import { GLOSSARY } from "@/lib/copy/glossary";
import type { EvaluacionIntegral } from "@/lib/evaluacion-integral/evaluacion-integral-types";
import {
  getEvaluacionIntegralEstadoLabel,
  getEvaluacionIntegralTipoLabel,
  getFechaReferenciaEvaluacion,
} from "@/lib/evaluacion-integral/evaluacion-integral-view";
import { parseFechaOrden } from "@/lib/estudiante/estudiante-timeline";
import { getTipoIntervencionNombre } from "@/lib/intervenciones-catalog";
import { formatMarcoFechaDisplay } from "@/lib/marco-institucional-pie-storage";
import {
  buildObjetivoSeguimiento,
  type ObjetivoSeguimiento,
} from "@/lib/objetivos/objetivo-seguimiento";
import type { PACI } from "@/lib/paci/paci-types";
import type { ObjetivoPIE } from "@/lib/repositories/objetivos-repository";
import type { Intervencion } from "@/lib/repositories/intervenciones-repository";
import type { Estudiante } from "@/lib/repositories/estudiantes-repository";
import type { Sesion } from "@/lib/repositories/sesiones-repository";
import {
  getApoyosRepository,
  getEstudiantesRepository,
  getEvaluacionesRepository,
  getIntervencionesRepository,
  getObjetivosRepository,
  getPACIRepository,
  getSesionesRepository,
} from "@/lib/repositories/repository-factory";
import {
  diasDesdeInstitucional,
  isWithinDays,
  parseFechaOrdenInstitucional,
  startOfTodayMs,
} from "@/lib/shared/fecha-institucional";

export type DashboardIndicadoresView = {
  estudiantesActivos: number;
  evaluacionesIntegrales: number;
  estudiantesSinEvaluacion: number;
  objetivosActivos: number;
  objetivosConSeguimiento: number;
  objetivosEnRiesgo: number;
  pacisVigentes: number;
  pacisBorrador: number;
  intervencionesUltimoMes: number;
  evidenciasUltimoMes: number;
  apoyosActivos: number;
  apoyosSuspendidos: number;
  apoyosFinalizados: number;
  apoyosConActividad: number;
  apoyosSinActividad: number;
  apoyosConEvidencia: number;
};

export type DashboardBarrerasApoyosView = {
  barrerasIdentificadas: number;
  apoyosSugeridos: number;
  objetivosConSustentoEvaluativo: number;
  objetivosSinSustentoEvaluativo: number;
};

export type DashboardAlertaTipo =
  | "critica"
  | "atencion"
  | "evaluacion_pendiente"
  | "seguimiento_administrativo";

export type DashboardAlertaView = {
  tipo: DashboardAlertaTipo;
  titulo: string;
  descripcion: string;
  estudianteId?: string;
};

export type DashboardActividadTipo =
  | "evaluacion"
  | "intervencion"
  | "paci_vigente"
  | "paci_cerrado";

export type DashboardActividadRecienteItem = {
  id: string;
  fecha: string;
  fechaDisplay: string;
  fechaOrden: number;
  tipo: DashboardActividadTipo;
  tipoLabel: string;
  resumen: string;
  estudianteId?: string;
};

export type DashboardView = {
  tieneEstudiantes: boolean;
  indicadores: DashboardIndicadoresView;
  barrerasApoyos: DashboardBarrerasApoyosView;
  alertas: DashboardAlertaView[];
  actividadReciente: DashboardActividadRecienteItem[];
};

const LIMITE_ACTIVIDAD = 18;

const ALERTA_PRIORIDAD: Record<DashboardAlertaTipo, number> = {
  critica: 0,
  atencion: 1,
  evaluacion_pendiente: 2,
  seguimiento_administrativo: 3,
};

function buildSeguimientoPorObjetivo(
  objetivos: ObjetivoPIE[]
): Map<string, ObjetivoSeguimiento> {
  const seguimientoPorObjetivo = new Map<string, ObjetivoSeguimiento>();
  for (const objetivo of objetivos) {
    seguimientoPorObjetivo.set(objetivo.id, buildObjetivoSeguimiento(objetivo));
  }
  return seguimientoPorObjetivo;
}

function buildIndicadores(
  estudiantes: Estudiante[],
  evaluaciones: EvaluacionIntegral[],
  objetivos: ObjetivoPIE[],
  pacis: PACI[],
  intervenciones: Intervencion[],
  sesiones: Sesion[],
  seguimientoPorObjetivo: Map<string, ObjetivoSeguimiento>,
  nowMs: number
): DashboardIndicadoresView {
  const evaluacionesActivas = evaluaciones.filter(
    (item) => item.estado !== "anulada"
  );

  const estudiantesConEvaluacion = new Set(
    evaluacionesActivas.map((item) => item.estudianteId)
  );

  let objetivosConSeguimiento = 0;
  let objetivosEnRiesgo = 0;

  for (const seguimiento of seguimientoPorObjetivo.values()) {
    if (seguimiento.estadoSeguimiento !== "sin_seguimiento") {
      objetivosConSeguimiento += 1;
    }
    if (seguimiento.estadoSeguimiento === "riesgo") {
      objetivosEnRiesgo += 1;
    }
  }

  const apoyosIndicadores = getApoyosImplementadosIndicadores();
  const apoyoActividadIndicadores = getApoyoIntervencionIndicadores();
  const apoyoEfectividadIndicadores = getApoyoEfectividadIndicadores();

  return {
    estudiantesActivos: estudiantes.length,
    evaluacionesIntegrales: evaluacionesActivas.length,
    estudiantesSinEvaluacion: estudiantes.filter(
      (item) => !estudiantesConEvaluacion.has(item.id)
    ).length,
    objetivosActivos: objetivos.length,
    objetivosConSeguimiento,
    objetivosEnRiesgo,
    pacisVigentes: pacis.filter((item) => item.estado === "vigente").length,
    pacisBorrador: pacis.filter((item) => item.estado === "borrador").length,
    intervencionesUltimoMes: intervenciones.filter((item) =>
      isWithinDays(parseFechaOrdenInstitucional(item.fecha), 30, nowMs)
    ).length,
    evidenciasUltimoMes: sesiones.filter((item) =>
      isWithinDays(parseFechaOrdenInstitucional(item.fecha), 30, nowMs)
    ).length,
    apoyosActivos: apoyosIndicadores.apoyosActivos,
    apoyosSuspendidos: apoyosIndicadores.apoyosSuspendidos,
    apoyosFinalizados: apoyosIndicadores.apoyosFinalizados,
    apoyosConActividad: apoyoActividadIndicadores.apoyosConActividad,
    apoyosSinActividad: apoyoActividadIndicadores.apoyosSinActividad,
    apoyosConEvidencia: apoyoEfectividadIndicadores.apoyosConEvidencia,
  };
}

function getEstudianteNombreFromMap(
  estudianteId: string,
  nombresPorId: Map<string, string>
): string {
  return nombresPorId.get(estudianteId) ?? "Estudiante";
}

function buildBarrerasApoyos(estudiantes: Estudiante[]): DashboardBarrerasApoyosView {
  let barrerasIdentificadas = 0;
  let apoyosSugeridos = 0;
  let objetivosConSustentoEvaluativo = 0;
  let objetivosSinSustentoEvaluativo = 0;

  for (const estudiante of estudiantes) {
    const resumen = getEstudianteBarrerasApoyosResumen(estudiante.id);
    barrerasIdentificadas += resumen.cantidadBarrerasIdentificadas;
    apoyosSugeridos += resumen.cantidadApoyosSugeridos;
    objetivosConSustentoEvaluativo += resumen.objetivosConSustentoEvaluativo;
    objetivosSinSustentoEvaluativo += resumen.objetivosSinSustentoEvaluativo;
  }

  return {
    barrerasIdentificadas,
    apoyosSugeridos,
    objetivosConSustentoEvaluativo,
    objetivosSinSustentoEvaluativo,
  };
}

function buildAlertas(
  estudiantes: Estudiante[],
  evaluaciones: EvaluacionIntegral[],
  objetivos: ObjetivoPIE[],
  pacis: PACI[],
  nombresPorId: Map<string, string>,
  seguimientoPorObjetivo: Map<string, ObjetivoSeguimiento>
): DashboardAlertaView[] {
  const COPY = GLOSSARY.dashboard.alertas;
  const alertas: DashboardAlertaView[] = [];

  const evaluacionesActivas = evaluaciones.filter(
    (item) => item.estado !== "anulada"
  );
  const estudiantesConEvaluacion = new Set(
    evaluacionesActivas.map((item) => item.estudianteId)
  );

  for (const objetivo of objetivos) {
    const seguimiento = seguimientoPorObjetivo.get(objetivo.id);
    if (!seguimiento) continue;

    if (seguimiento.estadoSeguimiento === "riesgo") {
      alertas.push({
        tipo: "critica",
        titulo: COPY.tituloObjetivoRiesgo,
        descripcion: COPY.descripcionObjetivoRiesgo(objetivo.nombre),
        estudianteId: objetivo.estudianteId,
      });
    } else if (seguimiento.estadoSeguimiento === "sin_seguimiento") {
      alertas.push({
        tipo: "atencion",
        titulo: COPY.tituloObjetivoSinSeguimiento,
        descripcion: COPY.descripcionObjetivoSinSeguimiento(objetivo.nombre),
        estudianteId: objetivo.estudianteId,
      });
    }
  }

  for (const estudiante of estudiantes) {
    if (!estudiantesConEvaluacion.has(estudiante.id)) {
      alertas.push({
        tipo: "evaluacion_pendiente",
        titulo: COPY.tituloEvaluacionPendiente,
        descripcion: COPY.descripcionEvaluacionPendiente(estudiante.nombre),
        estudianteId: estudiante.id,
      });
    }
  }

  for (const paci of pacis) {
    if (paci.estado !== "borrador") continue;

    const referencia = paci.actualizadoEn || paci.creadoEn;
    const fechaOrden = parseFechaOrdenInstitucional(referencia);
    if (diasDesdeInstitucional(fechaOrden, startOfTodayMs()) > 30) {
      alertas.push({
        tipo: "seguimiento_administrativo",
        titulo: COPY.tituloPaciBorrador,
        descripcion: COPY.descripcionPaciBorrador(
          paci.periodoLabel,
          getEstudianteNombreFromMap(paci.estudianteId, nombresPorId)
        ),
        estudianteId: paci.estudianteId,
      });
    }
  }

  const todayMs = startOfTodayMs();

  for (const apoyo of getApoyosRepository().getAll()) {
    if (apoyo.estado !== "activo") continue;

    const efectividad = getApoyoEfectividadView(apoyo.id);
    if (!efectividad) continue;

    const referencia = apoyo.creadoEn || apoyo.actualizadoEn;
    const fechaOrden = parseFechaOrdenInstitucional(referencia);
    const dias = diasDesdeInstitucional(fechaOrden, todayMs);

    if (efectividad.estado === "sin_actividad" && dias > 30) {
      alertas.push({
        tipo: "atencion",
        titulo: COPY.tituloApoyoSinActividadProlongada,
        descripcion: COPY.descripcionApoyoSinActividadProlongada(apoyo.nombre),
        estudianteId: apoyo.estudianteId,
      });
      continue;
    }

    if (efectividad.estado === "actividad_inicial" && dias > 60) {
      alertas.push({
        tipo: "atencion",
        titulo: COPY.tituloApoyoActividadInicialProlongada,
        descripcion: COPY.descripcionApoyoActividadInicialProlongada(
          apoyo.nombre
        ),
        estudianteId: apoyo.estudianteId,
      });
    }
  }

  return alertas.sort(
    (left, right) => ALERTA_PRIORIDAD[left.tipo] - ALERTA_PRIORIDAD[right.tipo]
  );
}

function buildActividadReciente(
  evaluaciones: EvaluacionIntegral[],
  intervenciones: Intervencion[],
  pacis: PACI[],
  nombresPorId: Map<string, string>
): DashboardActividadRecienteItem[] {
  const COPY = GLOSSARY.dashboard.actividadReciente;
  const ESTUDIANTE_COPY = GLOSSARY.estudiante;
  const items: DashboardActividadRecienteItem[] = [];

  for (const evaluacion of evaluaciones) {
    if (evaluacion.estado === "anulada") continue;

    const fechaReferencia = getFechaReferenciaEvaluacion(evaluacion);
    const fechaOrden =
      parseFechaOrden(fechaReferencia) ||
      parseFechaOrden(evaluacion.fechaInicio);

    items.push({
      id: `evaluacion-${evaluacion.id}`,
      fecha: fechaReferencia,
      fechaOrden,
      fechaDisplay: formatMarcoFechaDisplay(fechaReferencia),
      tipo: "evaluacion",
      tipoLabel: ESTUDIANTE_COPY.timelineTipoEvaluacion,
      resumen: ESTUDIANTE_COPY.timelineEvaluacionResumen(
        getEvaluacionIntegralTipoLabel(evaluacion.tipo),
        getEvaluacionIntegralEstadoLabel(evaluacion.estado)
      ),
      estudianteId: evaluacion.estudianteId,
    });
  }

  for (const intervencion of intervenciones) {
    const fechaOrden = parseFechaOrden(intervencion.fecha);
    const tipoNombre = getTipoIntervencionNombre(intervencion.tipoIntervencion);

    items.push({
      id: `intervencion-${intervencion.id}`,
      fecha: intervencion.fecha,
      fechaOrden,
      fechaDisplay: formatMarcoFechaDisplay(intervencion.fecha),
      tipo: "intervencion",
      tipoLabel: ESTUDIANTE_COPY.timelineTipoIntervencion,
      resumen: COPY.resumenIntervencion(
        tipoNombre,
        getEstudianteNombreFromMap(intervencion.estudianteId, nombresPorId)
      ),
      estudianteId: intervencion.estudianteId,
    });
  }

  for (const paci of pacis) {
    if (paci.declaradoVigenteEn) {
      items.push({
        id: `paci-vigente-${paci.id}`,
        fecha: paci.declaradoVigenteEn,
        fechaOrden: parseFechaOrden(paci.declaradoVigenteEn),
        fechaDisplay: formatMarcoFechaDisplay(paci.declaradoVigenteEn),
        tipo: "paci_vigente",
        tipoLabel: COPY.tipoPaciVigente,
        resumen: ESTUDIANTE_COPY.timelinePaciVigente(paci.periodoLabel),
        estudianteId: paci.estudianteId,
      });
    }

    if (paci.cerradoEn) {
      items.push({
        id: `paci-cerrado-${paci.id}`,
        fecha: paci.cerradoEn,
        fechaOrden: parseFechaOrden(paci.cerradoEn),
        fechaDisplay: formatMarcoFechaDisplay(paci.cerradoEn),
        tipo: "paci_cerrado",
        tipoLabel: COPY.tipoPaciCerrado,
        resumen: ESTUDIANTE_COPY.timelinePaciCerrado(paci.periodoLabel),
        estudianteId: paci.estudianteId,
      });
    }
  }

  return items
    .sort((left, right) => right.fechaOrden - left.fechaOrden)
    .slice(0, LIMITE_ACTIVIDAD);
}

export function getDashboardView(): DashboardView {
  const estudiantes = getEstudiantesRepository().getAll();
  const evaluaciones = getEvaluacionesRepository().getAll();
  const objetivos = getObjetivosRepository().getAll();
  const pacis = getPACIRepository().getAll();
  const intervenciones = getIntervencionesRepository().getAll();
  const sesiones = getSesionesRepository().getAll();
  const nowMs = startOfTodayMs();
  const nombresPorId = new Map(
    estudiantes.map((item) => [item.id, item.nombre] as const)
  );
  const seguimientoPorObjetivo = buildSeguimientoPorObjetivo(objetivos);

  const tieneEstudiantes = estudiantes.length > 0;

  return {
    tieneEstudiantes,
    indicadores: buildIndicadores(
      estudiantes,
      evaluaciones,
      objetivos,
      pacis,
      intervenciones,
      sesiones,
      seguimientoPorObjetivo,
      nowMs
    ),
    barrerasApoyos: buildBarrerasApoyos(estudiantes),
    alertas: tieneEstudiantes
      ? buildAlertas(
          estudiantes,
          evaluaciones,
          objetivos,
          pacis,
          nombresPorId,
          seguimientoPorObjetivo
        )
      : [],
    actividadReciente: tieneEstudiantes
      ? buildActividadReciente(
          evaluaciones,
          intervenciones,
          pacis,
          nombresPorId
        )
      : [],
  };
}
