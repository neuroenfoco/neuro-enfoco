import { getEspacioNombre } from "@/lib/espacios-storage";
import {
  getIntervencionesByEstudianteId,
  type Intervencion,
} from "@/lib/intervenciones-storage";
import { getObjetivoPIEById } from "@/lib/pie-objectives-storage";
import {
  getHallazgosByEstudianteId,
  getHallazgoOrigenLabel,
  getObservacionesByHallazgoId,
  type HallazgoOrigen,
  type HallazgoPerfil,
  type HallazgoTipo,
} from "@/lib/perfil-hallazgos-storage";
import {
  countApoyosDistintosUtilizados,
  getApoyosMasUtilizadosPorEstudiante,
} from "@/lib/apoyos-utilizados-estudiante";

export type AprendizajeItem = {
  nombre: string;
  confirmaciones: number;
  ultimaObservacion: string | null;
  origen: HallazgoOrigen;
  origenLabel: string;
  hallazgoId: string;
  intervencionesCount: number;
};

export type AprendizajeUso = {
  id: string;
  nombre: string;
  cantidad: number;
};

export type ResumenParticipacion = {
  totalIntervenciones: number;
  horasAcumuladas: string;
  objetivosActivos: number;
  apoyosDistintos: number;
  espaciosDistintos: number;
};

export type AprendizajeEstudiante = {
  fortalezasFrecuentes: AprendizajeItem[];
  interesesPredominantes: AprendizajeItem[];
  contextosFavorables: AprendizajeItem[];
  condicionesFrecuentes: AprendizajeItem[];
  apoyosMasUtilizados: AprendizajeUso[];
  espaciosMasUtilizados: AprendizajeUso[];
  objetivosMasTrabajados: AprendizajeUso[];
  resumenParticipacion: ResumenParticipacion;
  tieneEvidenciasConsolidadas: boolean;
};

function formatObservacionFechaDisplay(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatHorasAcumuladas(totalMinutos: number): string {
  const hours = totalMinutos / 60;
  if (hours === 0) return "0 h";
  if (Number.isInteger(hours)) return `${hours} h`;
  return `${hours.toFixed(1).replace(".", ",")} h`;
}

function countIntervencionesDistintas(hallazgoId: string): number {
  const observaciones = getObservacionesByHallazgoId(hallazgoId);
  return new Set(observaciones.map((item) => item.intervencionId)).size;
}

function toAprendizajeItem(hallazgo: HallazgoPerfil): AprendizajeItem {
  return {
    nombre: hallazgo.nombre,
    confirmaciones: hallazgo.totalObservaciones,
    ultimaObservacion: formatObservacionFechaDisplay(hallazgo.ultimaObservacionEn),
    origen: hallazgo.origen,
    origenLabel: getHallazgoOrigenLabel(hallazgo.origen),
    hallazgoId: hallazgo.id,
    intervencionesCount: countIntervencionesDistintas(hallazgo.id),
  };
}

function sortByConfirmaciones(items: AprendizajeItem[]): AprendizajeItem[] {
  return [...items].sort((left, right) => {
    if (right.confirmaciones !== left.confirmaciones) {
      return right.confirmaciones - left.confirmaciones;
    }

    const leftTime = left.ultimaObservacion
      ? Date.parse(left.ultimaObservacion)
      : 0;
    const rightTime = right.ultimaObservacion
      ? Date.parse(right.ultimaObservacion)
      : 0;

    if (rightTime !== leftTime) {
      return (
        (Number.isFinite(rightTime) ? rightTime : 0) -
        (Number.isFinite(leftTime) ? leftTime : 0)
      );
    }

    return left.nombre.localeCompare(right.nombre, "es");
  });
}

function hallazgosToItems(
  hallazgos: HallazgoPerfil[],
  tipo: HallazgoTipo
): AprendizajeItem[] {
  return sortByConfirmaciones(
    hallazgos
      .filter((item) => item.tipo === tipo && item.totalObservaciones > 0)
      .map(toAprendizajeItem)
  );
}

function buildUsoCounts(
  entries: { id: string; nombre: string }[]
): AprendizajeUso[] {
  const counts = new Map<string, AprendizajeUso>();

  for (const entry of entries) {
    const current = counts.get(entry.id);
    if (current) {
      current.cantidad += 1;
    } else {
      counts.set(entry.id, {
        id: entry.id,
        nombre: entry.nombre,
        cantidad: 1,
      });
    }
  }

  return [...counts.values()].sort(
    (left, right) =>
      right.cantidad - left.cantidad ||
      left.nombre.localeCompare(right.nombre, "es")
  );
}

function buildResumenParticipacion(
  intervenciones: Intervencion[],
  apoyosDistintos: number,
  espaciosDistintos: number,
  objetivosActivos: number
): ResumenParticipacion {
  const totalMinutos = intervenciones.reduce(
    (sum, item) => sum + Math.max(0, item.duracionMinutos),
    0
  );

  return {
    totalIntervenciones: intervenciones.length,
    horasAcumuladas: formatHorasAcumuladas(totalMinutos),
    objetivosActivos,
    apoyosDistintos,
    espaciosDistintos,
  };
}

export function getAprendizajeEstudiante(
  estudianteId: string
): AprendizajeEstudiante {
  const hallazgos = getHallazgosByEstudianteId(estudianteId);
  const intervenciones = getIntervencionesByEstudianteId(estudianteId);

  const fortalezasFrecuentes = hallazgosToItems(hallazgos, "fortaleza");
  const interesesPredominantes = hallazgosToItems(hallazgos, "interes");
  const contextosFavorables = hallazgosToItems(hallazgos, "contexto_exito");
  const condicionesFrecuentes = hallazgosToItems(hallazgos, "barrera");

  const apoyosMasUtilizados = getApoyosMasUtilizadosPorEstudiante(estudianteId);
  const espacioEntries: { id: string; nombre: string }[] = [];
  const objetivoEntries: { id: string; nombre: string }[] = [];
  const objetivosDistintos = new Set<string>();
  const espaciosDistintos = new Set<string>();

  for (const intervencion of intervenciones) {
    if (intervencion.espacioId) {
      const nombre = getEspacioNombre(intervencion.espacioId);
      espacioEntries.push({ id: intervencion.espacioId, nombre });
      espaciosDistintos.add(intervencion.espacioId);
    }

    for (const objetivoId of intervencion.objetivosRelacionados) {
      const objetivo = getObjetivoPIEById(objetivoId);
      if (!objetivo) continue;
      objetivoEntries.push({ id: objetivoId, nombre: objetivo.nombre });
      objetivosDistintos.add(objetivoId);
    }
  }

  const espaciosMasUtilizados = buildUsoCounts(espacioEntries);
  const objetivosMasTrabajados = buildUsoCounts(objetivoEntries);

  const tieneEvidenciasConsolidadas =
    fortalezasFrecuentes.length > 0 ||
    interesesPredominantes.length > 0 ||
    contextosFavorables.length > 0 ||
    condicionesFrecuentes.length > 0 ||
    intervenciones.length > 0;

  return {
    fortalezasFrecuentes,
    interesesPredominantes,
    contextosFavorables,
    condicionesFrecuentes,
    apoyosMasUtilizados,
    espaciosMasUtilizados,
    objetivosMasTrabajados,
    resumenParticipacion: buildResumenParticipacion(
      intervenciones,
      countApoyosDistintosUtilizados(estudianteId),
      espaciosDistintos.size,
      objetivosDistintos.size
    ),
    tieneEvidenciasConsolidadas,
  };
}

export function formatAprendizajeConfirmaciones(total: number): string {
  if (total === 0) return "Sin confirmaciones registradas";
  if (total === 1) return "Confirmado en 1 intervención";
  return `Confirmado en ${total} intervenciones`;
}
