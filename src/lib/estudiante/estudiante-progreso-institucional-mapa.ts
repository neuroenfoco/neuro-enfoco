import { getApoyoEstadoOperacional } from "@/lib/apoyos/apoyo-efectividad-view";
import { GLOSSARY } from "@/lib/copy/glossary";
import { tieneIngresoPIECompletado } from "@/lib/ingreso-pie";
import { getEstudianteObjetivosSeguimiento } from "@/lib/objetivos/objetivo-seguimiento";
import { getPerfilEvolutivoFicha } from "@/lib/perfil-evolutivo-ficha";
import { getHallazgosConsolidadosPerfilBase } from "@/lib/perfil-hallazgos-storage";
import {
  getApoyosRepository,
  getIntervencionesRepository,
  getSesionesRepository,
} from "@/lib/repositories/repository-factory";
import {
  isWithinDays,
  parseFechaOrdenInstitucional,
  startOfTodayMs,
} from "@/lib/shared/fecha-institucional";

export type ProgresoInstitucionalEstado = "verde" | "amarillo" | "rojo";

export type ProgresoInstitucionalNodoId =
  | "perfil_base"
  | "objetivos"
  | "apoyos"
  | "intervenciones"
  | "evidencias"
  | "perfil_evolutivo";

export type ProgresoInstitucionalNodo = {
  id: ProgresoInstitucionalNodoId;
  titulo: string;
  estado: ProgresoInstitucionalEstado;
  resumen: string;
  tabDestino?: string;
};

export type EstudianteProgresoInstitucionalMapa = {
  estudianteId: string;
  nodos: ProgresoInstitucionalNodo[];
};

const COPY = GLOSSARY.estudiante.progresoInstitucional;
const DIAS_ACTIVIDAD_RECIENTE = 30;
const HALLAZGOS_PERFIL_BASE_SUFICIENTES = 3;
const HALLAZGOS_EVOLUTIVO_SUFICIENTES = 3;

function evaluarPerfilBase(estudianteId: string): ProgresoInstitucionalNodo {
  const ingreso = tieneIngresoPIECompletado(estudianteId);
  const hallazgos = getHallazgosConsolidadosPerfilBase(estudianteId).length;

  if (ingreso && hallazgos >= HALLAZGOS_PERFIL_BASE_SUFICIENTES) {
    return {
      id: "perfil_base",
      titulo: COPY.nodoPerfilBase,
      estado: "verde",
      resumen: COPY.resumenPerfilBaseVerde(hallazgos),
      tabDestino: "perfil-base",
    };
  }

  if ((ingreso && hallazgos > 0) || (!ingreso && hallazgos > 0)) {
    return {
      id: "perfil_base",
      titulo: COPY.nodoPerfilBase,
      estado: "amarillo",
      resumen: COPY.resumenPerfilBaseAmarillo(hallazgos),
      tabDestino: "perfil-base",
    };
  }

  if (ingreso && hallazgos === 0) {
    return {
      id: "perfil_base",
      titulo: COPY.nodoPerfilBase,
      estado: "amarillo",
      resumen: COPY.resumenPerfilBaseIngresoSinHallazgos,
      tabDestino: "perfil-base",
    };
  }

  return {
    id: "perfil_base",
    titulo: COPY.nodoPerfilBase,
    estado: "rojo",
    resumen: COPY.resumenPerfilBaseRojo,
    tabDestino: "perfil-base",
  };
}

function evaluarObjetivos(estudianteId: string): ProgresoInstitucionalNodo {
  const seguimientos = getEstudianteObjetivosSeguimiento(estudianteId);

  if (seguimientos.length === 0) {
    return {
      id: "objetivos",
      titulo: COPY.nodoObjetivos,
      estado: "rojo",
      resumen: COPY.resumenObjetivosRojo,
      tabDestino: "objetivos",
    };
  }

  const enRiesgo = seguimientos.some((item) => item.estadoSeguimiento === "riesgo");
  const enAtencion = seguimientos.some(
    (item) => item.estadoSeguimiento === "atencion"
  );

  if (enRiesgo || enAtencion) {
    return {
      id: "objetivos",
      titulo: COPY.nodoObjetivos,
      estado: "amarillo",
      resumen: COPY.resumenObjetivosAmarillo(
        seguimientos.length,
        enRiesgo,
        enAtencion
      ),
      tabDestino: "objetivos",
    };
  }

  return {
    id: "objetivos",
    titulo: COPY.nodoObjetivos,
    estado: "verde",
    resumen: COPY.resumenObjetivosVerde(seguimientos.length),
    tabDestino: "objetivos",
  };
}

function contarApoyosOperacionales(estudianteId: string) {
  const apoyos = getApoyosRepository().getByEstudianteId(estudianteId);
  let sinTrazabilidad = 0;
  let sinUsoDocumentado = 0;

  for (const apoyo of apoyos) {
    const estado = getApoyoEstadoOperacional(apoyo.id);
    if (!estado) continue;

    if (estado.estado === "sin_trazabilidad") {
      sinTrazabilidad += 1;
    } else if (estado.estado === "sin_uso_documentado") {
      sinUsoDocumentado += 1;
    }
  }

  return {
    total: apoyos.length,
    sinTrazabilidad,
    sinUsoDocumentado,
  };
}

function evaluarApoyos(estudianteId: string): ProgresoInstitucionalNodo {
  const conteo = contarApoyosOperacionales(estudianteId);

  if (conteo.total === 0) {
    return {
      id: "apoyos",
      titulo: COPY.nodoApoyos,
      estado: "verde",
      resumen: COPY.resumenApoyosSinRegistros,
      tabDestino: "objetivos",
    };
  }

  if (conteo.sinTrazabilidad > 0) {
    return {
      id: "apoyos",
      titulo: COPY.nodoApoyos,
      estado: "rojo",
      resumen: COPY.resumenApoyosSinTrazabilidad(conteo.sinTrazabilidad),
      tabDestino: "objetivos",
    };
  }

  if (conteo.sinUsoDocumentado > 0) {
    return {
      id: "apoyos",
      titulo: COPY.nodoApoyos,
      estado: "amarillo",
      resumen: COPY.resumenApoyosSinUsoDocumentado(conteo.sinUsoDocumentado),
      tabDestino: "objetivos",
    };
  }

  return {
    id: "apoyos",
    titulo: COPY.nodoApoyos,
    estado: "verde",
    resumen: COPY.resumenApoyosVerde(conteo.total),
    tabDestino: "objetivos",
  };
}

function tieneIntervencionReciente(estudianteId: string): boolean {
  const referenceMs = startOfTodayMs();

  for (const intervencion of getIntervencionesRepository().getByEstudianteId(
    estudianteId
  )) {
    if (
      isWithinDays(
        parseFechaOrdenInstitucional(intervencion.fecha),
        DIAS_ACTIVIDAD_RECIENTE,
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
          DIAS_ACTIVIDAD_RECIENTE,
          referenceMs
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

function evaluarIntervenciones(estudianteId: string): ProgresoInstitucionalNodo {
  const total = getIntervencionesRepository().getByEstudianteId(estudianteId)
    .length;

  if (total === 0) {
    return {
      id: "intervenciones",
      titulo: COPY.nodoIntervenciones,
      estado: "rojo",
      resumen: COPY.resumenIntervencionesRojo,
      tabDestino: "sesiones",
    };
  }

  if (tieneIntervencionReciente(estudianteId)) {
    return {
      id: "intervenciones",
      titulo: COPY.nodoIntervenciones,
      estado: "verde",
      resumen: COPY.resumenIntervencionesVerde(total),
      tabDestino: "sesiones",
    };
  }

  return {
    id: "intervenciones",
    titulo: COPY.nodoIntervenciones,
    estado: "amarillo",
    resumen: COPY.resumenIntervencionesAmarillo(total),
    tabDestino: "sesiones",
  };
}

function tieneSesionReciente(estudianteId: string): boolean {
  const referenceMs = startOfTodayMs();

  for (const sesion of getSesionesRepository().getByEstudianteId(estudianteId)) {
    if (
      isWithinDays(
        parseFechaOrdenInstitucional(sesion.fecha),
        DIAS_ACTIVIDAD_RECIENTE,
        referenceMs
      )
    ) {
      return true;
    }
  }

  return false;
}

function evaluarEvidencias(estudianteId: string): ProgresoInstitucionalNodo {
  const sesiones = getSesionesRepository().getByEstudianteId(estudianteId);

  if (sesiones.length === 0) {
    return {
      id: "evidencias",
      titulo: COPY.nodoEvidencias,
      estado: "rojo",
      resumen: COPY.resumenEvidenciasRojo,
      tabDestino: "sesiones",
    };
  }

  if (tieneSesionReciente(estudianteId)) {
    return {
      id: "evidencias",
      titulo: COPY.nodoEvidencias,
      estado: "verde",
      resumen: COPY.resumenEvidenciasVerde(sesiones.length),
      tabDestino: "sesiones",
    };
  }

  return {
    id: "evidencias",
    titulo: COPY.nodoEvidencias,
    estado: "amarillo",
    resumen: COPY.resumenEvidenciasAmarillo(sesiones.length),
    tabDestino: "sesiones",
  };
}

function evaluarPerfilEvolutivo(estudianteId: string): ProgresoInstitucionalNodo {
  const ficha = getPerfilEvolutivoFicha(estudianteId);
  const total =
    ficha.resumen.fortalezasConocidas +
    ficha.resumen.interesesConocidos +
    ficha.resumen.contextosExitoDocumentados +
    ficha.resumen.condicionesDocumentadas;

  if (!ficha.tieneRegistros || total === 0) {
    return {
      id: "perfil_evolutivo",
      titulo: COPY.nodoPerfilEvolutivo,
      estado: "rojo",
      resumen: COPY.resumenPerfilEvolutivoRojo,
      tabDestino: "perfil",
    };
  }

  if (total < HALLAZGOS_EVOLUTIVO_SUFICIENTES) {
    return {
      id: "perfil_evolutivo",
      titulo: COPY.nodoPerfilEvolutivo,
      estado: "amarillo",
      resumen: COPY.resumenPerfilEvolutivoAmarillo(total),
      tabDestino: "perfil",
    };
  }

  return {
    id: "perfil_evolutivo",
    titulo: COPY.nodoPerfilEvolutivo,
    estado: "verde",
    resumen: COPY.resumenPerfilEvolutivoVerde(total),
    tabDestino: "perfil",
  };
}

export function getEstudianteProgresoInstitucionalMapa(
  estudianteId: string
): EstudianteProgresoInstitucionalMapa {
  return {
    estudianteId,
    nodos: [
      evaluarPerfilBase(estudianteId),
      evaluarObjetivos(estudianteId),
      evaluarApoyos(estudianteId),
      evaluarIntervenciones(estudianteId),
      evaluarEvidencias(estudianteId),
      evaluarPerfilEvolutivo(estudianteId),
    ],
  };
}
