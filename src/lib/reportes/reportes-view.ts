import { getApoyoEfectividadView } from "@/lib/apoyos/apoyo-efectividad-view";
import {
  getApoyoPIEEstadoLabel,
  getApoyoResponsableDisplay,
} from "@/lib/apoyos/apoyos-view";
import { GLOSSARY } from "@/lib/copy/glossary";
import {
  getDashboardView,
  type DashboardAlertaView,
} from "@/lib/dashboard/dashboard-view";
import {
  buildObjetivoSeguimiento,
  type EstadoSeguimientoObjetivo,
} from "@/lib/objetivos/objetivo-seguimiento";
import {
  getApoyosRepository,
  getEstudiantesRepository,
  getObjetivosRepository,
} from "@/lib/repositories/repository-factory";

export type ReporteEstadoInstitucional = {
  estudiantesActivos: number;
  estudiantesSinEvaluacion: number;
  evaluacionesIntegrales: number;
  objetivosActivos: number;
  objetivosEnRiesgo: number;
  pacisVigentes: number;
  pacisBorrador: number;
  apoyosActivos: number;
  apoyosConEvidencia: number;
};

export type ReporteSeguimientoObjetivoItem = {
  objetivoId: string;
  estudianteId: string;
  estudiante: string;
  objetivo: string;
  estadoSeguimiento: EstadoSeguimientoObjetivo;
  estadoSeguimientoLabel: string;
  ultimaActividad: string | null;
  ultimaActividadLabel: string | null;
  intervenciones: number;
  evidencias: number;
};

export type ReporteApoyoImplementadoItem = {
  apoyoId: string;
  estudianteId: string;
  estudiante: string;
  apoyo: string;
  responsable: string;
  frecuencia: string;
  estado: string;
  intervenciones: number;
  evidencias: number;
  estadoOperacional: string;
};

export type AlertaInstitucionalGrupo =
  | "evaluacion_pendiente"
  | "seguimiento"
  | "apoyos"
  | "paci";

export type ReporteAlertaInstitucionalItem = DashboardAlertaView & {
  grupo: AlertaInstitucionalGrupo;
  estudiante: string;
};

export type ReporteAlertasInstitucionales = {
  evaluacionPendiente: ReporteAlertaInstitucionalItem[];
  seguimiento: ReporteAlertaInstitucionalItem[];
  apoyos: ReporteAlertaInstitucionalItem[];
  paci: ReporteAlertaInstitucionalItem[];
};

export type ReportesInstitucionalesView = {
  tieneEstudiantes: boolean;
  estadoInstitucional: ReporteEstadoInstitucional;
  seguimientoObjetivos: ReporteSeguimientoObjetivoItem[];
  apoyosImplementados: ReporteApoyoImplementadoItem[];
  alertas: ReporteAlertasInstitucionales;
};

const SEGUIMIENTO_COPY = GLOSSARY.objetivo.seguimiento;
const ALERTA_COPY = GLOSSARY.dashboard.alertas;

function getEstadoSeguimientoLabel(
  estado: EstadoSeguimientoObjetivo
): string {
  switch (estado) {
    case "activo":
      return SEGUIMIENTO_COPY.estadoActivo;
    case "atencion":
      return SEGUIMIENTO_COPY.estadoAtencion;
    case "riesgo":
      return SEGUIMIENTO_COPY.estadoRiesgo;
    case "sin_seguimiento":
      return SEGUIMIENTO_COPY.estadoSinSeguimiento;
  }
}

function resolverGrupoAlerta(
  alerta: DashboardAlertaView
): AlertaInstitucionalGrupo {
  if (alerta.tipo === "evaluacion_pendiente") {
    return "evaluacion_pendiente";
  }
  if (alerta.tipo === "seguimiento_administrativo") {
    return "paci";
  }
  if (
    alerta.titulo === ALERTA_COPY.tituloApoyoSinActividadProlongada ||
    alerta.titulo === ALERTA_COPY.tituloApoyoActividadInicialProlongada
  ) {
    return "apoyos";
  }
  return "seguimiento";
}

function buildEstadoInstitucional(): ReporteEstadoInstitucional {
  const { indicadores } = getDashboardView();

  return {
    estudiantesActivos: indicadores.estudiantesActivos,
    estudiantesSinEvaluacion: indicadores.estudiantesSinEvaluacion,
    evaluacionesIntegrales: indicadores.evaluacionesIntegrales,
    objetivosActivos: indicadores.objetivosActivos,
    objetivosEnRiesgo: indicadores.objetivosEnRiesgo,
    pacisVigentes: indicadores.pacisVigentes,
    pacisBorrador: indicadores.pacisBorrador,
    apoyosActivos: indicadores.apoyosActivos,
    apoyosConEvidencia: indicadores.apoyosConEvidencia,
  };
}

function buildSeguimientoObjetivos(
  nombresPorId: Map<string, string>
): ReporteSeguimientoObjetivoItem[] {
  return getObjetivosRepository()
    .getAll()
    .map((objetivo) => {
      const seguimiento = buildObjetivoSeguimiento(objetivo);
      return {
        objetivoId: objetivo.id,
        estudianteId: objetivo.estudianteId,
        estudiante: nombresPorId.get(objetivo.estudianteId) ?? "Estudiante",
        objetivo: objetivo.nombre,
        estadoSeguimiento: seguimiento.estadoSeguimiento,
        estadoSeguimientoLabel: getEstadoSeguimientoLabel(
          seguimiento.estadoSeguimiento
        ),
        ultimaActividad: seguimiento.ultimaActividad,
        ultimaActividadLabel:
          seguimiento.ultimaActividadLabel ?? SEGUIMIENTO_COPY.sinActividad,
        intervenciones: seguimiento.cantidadIntervenciones,
        evidencias: seguimiento.cantidadEvidencias,
      };
    })
    .sort((left, right) => {
      const byEstudiante = left.estudiante.localeCompare(
        right.estudiante,
        "es"
      );
      if (byEstudiante !== 0) return byEstudiante;
      return left.objetivo.localeCompare(right.objetivo, "es");
    });
}

function buildApoyosImplementados(
  nombresPorId: Map<string, string>
): ReporteApoyoImplementadoItem[] {
  return getApoyosRepository()
    .getAll()
    .map((apoyo) => {
      const efectividad = getApoyoEfectividadView(apoyo.id);
      return {
        apoyoId: apoyo.id,
        estudianteId: apoyo.estudianteId,
        estudiante: nombresPorId.get(apoyo.estudianteId) ?? "Estudiante",
        apoyo: apoyo.nombre,
        responsable: getApoyoResponsableDisplay(apoyo),
        frecuencia: apoyo.frecuencia ?? "—",
        estado: getApoyoPIEEstadoLabel(apoyo.estado),
        intervenciones: efectividad?.cantidadIntervenciones ?? 0,
        evidencias: efectividad?.cantidadEvidencias ?? 0,
        estadoOperacional: efectividad?.estadoLabel ?? "—",
      };
    })
    .sort((left, right) => {
      const byEstudiante = left.estudiante.localeCompare(
        right.estudiante,
        "es"
      );
      if (byEstudiante !== 0) return byEstudiante;
      return left.apoyo.localeCompare(right.apoyo, "es");
    });
}

function buildAlertasAgrupadas(
  alertas: DashboardAlertaView[],
  nombresPorId: Map<string, string>
): ReporteAlertasInstitucionales {
  const grouped: ReporteAlertasInstitucionales = {
    evaluacionPendiente: [],
    seguimiento: [],
    apoyos: [],
    paci: [],
  };

  for (const alerta of alertas) {
    const item: ReporteAlertaInstitucionalItem = {
      ...alerta,
      grupo: resolverGrupoAlerta(alerta),
      estudiante: alerta.estudianteId
        ? (nombresPorId.get(alerta.estudianteId) ?? "Estudiante")
        : "—",
    };

    switch (item.grupo) {
      case "evaluacion_pendiente":
        grouped.evaluacionPendiente.push(item);
        break;
      case "seguimiento":
        grouped.seguimiento.push(item);
        break;
      case "apoyos":
        grouped.apoyos.push(item);
        break;
      case "paci":
        grouped.paci.push(item);
        break;
    }
  }

  return grouped;
}

export function getReportesInstitucionalesView(): ReportesInstitucionalesView {
  const estudiantes = getEstudiantesRepository().getAll();
  const dashboard = getDashboardView();
  const nombresPorId = new Map(
    estudiantes.map((item) => [item.id, item.nombre] as const)
  );

  return {
    tieneEstudiantes: dashboard.tieneEstudiantes,
    estadoInstitucional: buildEstadoInstitucional(),
    seguimientoObjetivos: buildSeguimientoObjetivos(nombresPorId),
    apoyosImplementados: buildApoyosImplementados(nombresPorId),
    alertas: buildAlertasAgrupadas(dashboard.alertas, nombresPorId),
  };
}
