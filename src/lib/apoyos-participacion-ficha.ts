/**
 * Ficha de uso del apoyo y participación por estudiante.
 *
 * **Pregunta que responde:** «¿Qué uso del apoyo y contextos de participación
 * ha documentado el equipo en las intervenciones de este estudiante?»
 *
 * Agrega `Sesion.apoyosUtilizados` (catálogo ApoyoSesionId) y contrasta con
 * apoyos planificados en objetivos sin uso documentado. No sustituye ApoyoPIE.
 */

import {
  getApoyoPlanificadoNombre,
  isEspacioPlanificadoId,
} from "@/lib/pie-apoyos-planificados-catalog";
import { getObjetivosPIEByEstudianteId } from "@/lib/pie-objectives-storage";
import {
  CATALOGO_APOYOS_SESION,
  getApoyoSesionNombre,
  getNivelParticipacionNombre,
  type ApoyoSesionId,
  type NivelParticipacionId,
} from "@/lib/sesiones-form-catalog";
import {
  getSesionesByEstudianteId,
  type Sesion,
} from "@/lib/sessions-storage";

export type ParticipacionDistribucion = {
  activaOLiderazgo: number;
  parcial: number;
  bajaParticipacion: number;
  sinRegistro: number;
};

export type ApoyoDocumentadoItem = {
  apoyoKey: string;
  nombre: string;
  intervenciones: number;
  participacion: ParticipacionDistribucion;
  intervencionIds: string[];
};

export type FrecuenciaDocumentadaItem = {
  nombre: string;
  veces: number;
};

export type ApoyoPlanificadoSinUsoItem = {
  apoyoId: string;
  apoyoNombre: string;
  objetivoId: string;
  objetivoNombre: string;
};

export type ApoyosParticipacionFicha = {
  estudianteId: string;
  generadoEn: string;
  totalIntervenciones: number;
  intervencionesConApoyosDocumentados: number;
  datosInsuficientes: boolean;
  apoyosDocumentados: ApoyoDocumentadoItem[];
  contextosExitoDocumentados: FrecuenciaDocumentadaItem[];
  fortalezasObservadas: FrecuenciaDocumentadaItem[];
  necesidadesApoyoDocumentadas: FrecuenciaDocumentadaItem[];
  apoyosPlanificadosSinUso: ApoyoPlanificadoSinUsoItem[];
};

type ApoyoResuelto = {
  key: string;
  nombre: string;
};

type ParticipacionClase = keyof ParticipacionDistribucion;

function normalizeNombre(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function clasificarParticipacion(
  nivel?: NivelParticipacionId
): ParticipacionClase {
  if (!nivel) return "sinRegistro";
  if (nivel === "activa" || nivel === "lidera") return "activaOLiderazgo";
  if (nivel === "parcial") return "parcial";
  return "bajaParticipacion";
}

function resolverApoyosDesdeSesion(sesion: Sesion): ApoyoResuelto[] {
  const apoyos = new Map<string, string>();

  for (const id of sesion.apoyosUtilizados ?? []) {
    apoyos.set(id, getApoyoSesionNombre(id));
  }

  for (const estrategia of sesion.estrategiasQueAyudaron ?? []) {
    const trimmed = normalizeNombre(estrategia);
    if (!trimmed) continue;

    const normalized = trimmed.toLowerCase();
    let mapeado = false;

    for (const def of CATALOGO_APOYOS_SESION) {
      const nombreNormalizado = def.nombre.toLowerCase();
      const legacyNormalizado = def.etiquetaEstrategiaLegacy?.toLowerCase();

      if (normalized === nombreNormalizado || normalized === legacyNormalizado) {
        apoyos.set(def.id, def.nombre);
        mapeado = true;
        break;
      }
    }

    if (!mapeado) {
      apoyos.set(`legacy:${normalized}`, trimmed);
    }
  }

  return [...apoyos.entries()].map(([key, nombre]) => ({ key, nombre }));
}

function incrementarFrecuencia(
  map: Map<string, number>,
  nombres: string[]
): void {
  for (const nombre of nombres) {
    const normalized = normalizeNombre(nombre);
    if (!normalized) continue;
    map.set(normalized, (map.get(normalized) ?? 0) + 1);
  }
}

function mapAFrecuencias(map: Map<string, number>): FrecuenciaDocumentadaItem[] {
  return [...map.entries()]
    .map(([nombre, veces]) => ({ nombre, veces }))
    .sort(
      (left, right) =>
        right.veces - left.veces || left.nombre.localeCompare(right.nombre, "es")
    );
}

function crearDistribucionVacia(): ParticipacionDistribucion {
  return {
    activaOLiderazgo: 0,
    parcial: 0,
    bajaParticipacion: 0,
    sinRegistro: 0,
  };
}

export function getApoyosParticipacionFicha(
  estudianteId: string
): ApoyosParticipacionFicha {
  const sesiones = getSesionesByEstudianteId(estudianteId).filter(
    (sesion) => sesion.intervencionId
  );

  const apoyoStats = new Map<
    string,
    {
      nombre: string;
      intervencionIds: Set<string>;
      participacion: ParticipacionDistribucion;
    }
  >();

  const contextosMap = new Map<string, number>();
  const fortalezasMap = new Map<string, number>();
  const necesidadesMap = new Map<string, number>();
  const apoyosUsadosIds = new Set<string>();

  let intervencionesConApoyosDocumentados = 0;

  for (const sesion of sesiones) {
    const apoyos = resolverApoyosDesdeSesion(sesion);
    if (apoyos.length === 0) continue;

    intervencionesConApoyosDocumentados += 1;
    const intervencionId = sesion.intervencionId!;
    const claseParticipacion = clasificarParticipacion(sesion.nivelParticipacion);

    incrementarFrecuencia(contextosMap, sesion.contextosExitoObservados ?? []);
    incrementarFrecuencia(fortalezasMap, sesion.fortalezas ?? []);
    incrementarFrecuencia(necesidadesMap, sesion.barrerasObservadas ?? []);

    for (const apoyo of apoyos) {
      if (!apoyo.key.startsWith("legacy:")) {
        apoyosUsadosIds.add(apoyo.key);
      }

      const current = apoyoStats.get(apoyo.key) ?? {
        nombre: apoyo.nombre,
        intervencionIds: new Set<string>(),
        participacion: crearDistribucionVacia(),
      };

      current.intervencionIds.add(intervencionId);
      current.participacion[claseParticipacion] += 1;
      apoyoStats.set(apoyo.key, current);
    }
  }

  const apoyosDocumentados: ApoyoDocumentadoItem[] = [...apoyoStats.entries()]
    .map(([apoyoKey, stats]) => ({
      apoyoKey,
      nombre: stats.nombre,
      intervenciones: stats.intervencionIds.size,
      participacion: stats.participacion,
      intervencionIds: [...stats.intervencionIds],
    }))
    .sort(
      (left, right) =>
        right.intervenciones - left.intervenciones ||
        left.nombre.localeCompare(right.nombre, "es")
    );

  const apoyosPlanificadosSinUso: ApoyoPlanificadoSinUsoItem[] = [];

  for (const objetivo of getObjetivosPIEByEstudianteId(estudianteId)) {
    for (const apoyoId of objetivo.apoyosPlanificadosIds ?? []) {
      if (apoyoId === "otro" || isEspacioPlanificadoId(apoyoId)) continue;
      if (apoyosUsadosIds.has(apoyoId)) continue;

      apoyosPlanificadosSinUso.push({
        apoyoId,
        apoyoNombre: getApoyoPlanificadoNombre(apoyoId),
        objetivoId: objetivo.id,
        objetivoNombre: objetivo.nombre,
      });
    }
  }

  apoyosPlanificadosSinUso.sort(
    (left, right) =>
      left.apoyoNombre.localeCompare(right.apoyoNombre, "es") ||
      left.objetivoNombre.localeCompare(right.objetivoNombre, "es")
  );

  return {
    estudianteId,
    generadoEn: new Date().toISOString(),
    totalIntervenciones: sesiones.length,
    intervencionesConApoyosDocumentados,
    datosInsuficientes: intervencionesConApoyosDocumentados === 0,
    apoyosDocumentados,
    contextosExitoDocumentados: mapAFrecuencias(contextosMap),
    fortalezasObservadas: mapAFrecuencias(fortalezasMap),
    necesidadesApoyoDocumentadas: mapAFrecuencias(necesidadesMap),
    apoyosPlanificadosSinUso,
  };
}

export function getParticipacionDistribucionLabels(): Record<
  keyof ParticipacionDistribucion,
  string
> {
  return {
    activaOLiderazgo: `${getNivelParticipacionNombre("activa")} o ${getNivelParticipacionNombre("lidera").toLowerCase()}`,
    parcial: getNivelParticipacionNombre("parcial"),
    bajaParticipacion: `${getNivelParticipacionNombre("no_participa")} o ${getNivelParticipacionNombre("con_resistencia").toLowerCase()}`,
    sinRegistro: "Sin registro de participación",
  };
}

export function isApoyoSesionId(value: string): value is ApoyoSesionId {
  return CATALOGO_APOYOS_SESION.some((item) => item.id === value);
}
