import { GLOSSARY } from "@/lib/copy/glossary";
import { estaEnPerfilBase } from "@/lib/hallazgo-estado-conocimiento";
import {
  getHallazgosByEstudianteId,
  getHallazgoOrigenLabel,
  type HallazgoOrigen,
  type HallazgoPerfil,
  type HallazgoTipo,
} from "@/lib/perfil-hallazgos-storage";

export type PerfilEvolutivoOrigenConteo = {
  fortalezas: number;
  intereses: number;
  contextosExito: number;
  condiciones: number;
};

export type PerfilEvolutivoResumen = {
  fortalezasConocidas: number;
  interesesConocidos: number;
  contextosExitoDocumentados: number;
  condicionesDocumentadas: number;
};

export type PerfilEvolutivoItem = {
  id: string;
  nombre: string;
  tipo: HallazgoTipo;
  origen: HallazgoOrigen;
  origenLabel: string;
  totalConfirmaciones: number;
  primeraObservacionDisplay: string | null;
  ultimaObservacionDisplay: string | null;
};

export type PerfilEvolutivoFicha = {
  estudianteId: string;
  resumen: PerfilEvolutivoResumen;
  distribucionPerfilBase: PerfilEvolutivoOrigenConteo;
  distribucionIntervenciones: PerfilEvolutivoOrigenConteo;
  fortalezas: PerfilEvolutivoItem[];
  intereses: PerfilEvolutivoItem[];
  contextosExito: PerfilEvolutivoItem[];
  condiciones: PerfilEvolutivoItem[];
  tieneRegistros: boolean;
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

function toEvolutivoItem(hallazgo: HallazgoPerfil): PerfilEvolutivoItem {
  return {
    id: hallazgo.id,
    nombre: hallazgo.nombre,
    tipo: hallazgo.tipo,
    origen: hallazgo.origen,
    origenLabel: getHallazgoOrigenLabel(hallazgo.origen),
    totalConfirmaciones: hallazgo.totalObservaciones,
    primeraObservacionDisplay: formatObservacionFechaDisplay(
      hallazgo.primeraObservacionEn
    ),
    ultimaObservacionDisplay: formatObservacionFechaDisplay(
      hallazgo.ultimaObservacionEn
    ),
  };
}

function sortHallazgos(hallazgos: HallazgoPerfil[]): HallazgoPerfil[] {
  return [...hallazgos].sort((left, right) => {
    const leftTime = left.ultimaObservacionEn
      ? Date.parse(left.ultimaObservacionEn)
      : 0;
    const rightTime = right.ultimaObservacionEn
      ? Date.parse(right.ultimaObservacionEn)
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

function countByPertenenciaPerfilBase(
  hallazgos: HallazgoPerfil[],
  enPerfilBase: boolean
): PerfilEvolutivoOrigenConteo {
  const filtered = hallazgos.filter(
    (item) => estaEnPerfilBase(item) === enPerfilBase
  );

  return {
    fortalezas: filtered.filter((item) => item.tipo === "fortaleza").length,
    intereses: filtered.filter((item) => item.tipo === "interes").length,
    contextosExito: filtered.filter((item) => item.tipo === "contexto_exito")
      .length,
    condiciones: filtered.filter((item) => item.tipo === "barrera").length,
  };
}

export function getPerfilEvolutivoFicha(
  estudianteId: string
): PerfilEvolutivoFicha {
  const hallazgos = getHallazgosByEstudianteId(estudianteId);

  const fortalezas = sortHallazgos(
    hallazgos.filter((item) => item.tipo === "fortaleza")
  ).map(toEvolutivoItem);
  const intereses = sortHallazgos(
    hallazgos.filter((item) => item.tipo === "interes")
  ).map(toEvolutivoItem);
  const contextosExito = sortHallazgos(
    hallazgos.filter((item) => item.tipo === "contexto_exito")
  ).map(toEvolutivoItem);
  const condiciones = sortHallazgos(
    hallazgos.filter((item) => item.tipo === "barrera")
  ).map(toEvolutivoItem);

  return {
    estudianteId,
    resumen: {
      fortalezasConocidas: fortalezas.length,
      interesesConocidos: intereses.length,
      contextosExitoDocumentados: contextosExito.length,
      condicionesDocumentadas: condiciones.length,
    },
    distribucionPerfilBase: countByPertenenciaPerfilBase(hallazgos, true),
    distribucionIntervenciones: countByPertenenciaPerfilBase(hallazgos, false),
    fortalezas,
    intereses,
    contextosExito,
    condiciones,
    tieneRegistros: hallazgos.length > 0,
  };
}

export function formatPerfilEvolutivoConfirmaciones(total: number): string {
  if (total === 0) return GLOSSARY.perfilEvolutivo.confirmacionesNinguna;
  if (total === 1) return GLOSSARY.perfilEvolutivo.confirmacionesUna;
  return GLOSSARY.perfilEvolutivo.confirmacionesVarias(total);
}
