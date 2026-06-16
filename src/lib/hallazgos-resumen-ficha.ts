import {
  getHallazgoById,
  getHallazgosByEstudianteId,
  getHallazgosConsolidadosPerfilBase,
  getObservacionesByEvidenciaId,
  type HallazgoPerfil,
  type HallazgoTipo,
} from "@/lib/perfil-hallazgos-storage";
import {
  EMPTY_QUIEN_ES_MESSAGE,
  getFichaHeaderKpisForEstudiante,
  getSesionesByEstudianteId,
  type FichaHeaderKpis,
  type LogroReciente,
} from "@/lib/sessions-storage";

export type HallazgoResumenItem = {
  hallazgoId: string;
  nombre: string;
  confirmaciones: number;
  ultimaObservacionDisplay: string | null;
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

function sortHallazgosPorConfirmaciones(
  hallazgos: HallazgoPerfil[]
): HallazgoPerfil[] {
  return [...hallazgos].sort(
    (left, right) =>
      right.totalObservaciones - left.totalObservaciones ||
      (right.ultimaObservacionEn
        ? Date.parse(right.ultimaObservacionEn)
        : 0) -
        (left.ultimaObservacionEn ? Date.parse(left.ultimaObservacionEn) : 0) ||
      left.nombre.localeCompare(right.nombre, "es")
  );
}

function toResumenItem(hallazgo: HallazgoPerfil): HallazgoResumenItem {
  return {
    hallazgoId: hallazgo.id,
    nombre: hallazgo.nombre,
    confirmaciones: hallazgo.totalObservaciones,
    ultimaObservacionDisplay: formatObservacionFechaDisplay(
      hallazgo.ultimaObservacionEn
    ),
  };
}

/** Hallazgos del estudiante por tipo, ordenados por confirmaciones DESC. */
export function getHallazgosResumenPorTipo(
  estudianteId: string,
  tipo: HallazgoTipo,
  options?: { soloConfirmados?: boolean }
): HallazgoResumenItem[] {
  const soloConfirmados = options?.soloConfirmados ?? true;

  return sortHallazgosPorConfirmaciones(
    getHallazgosByEstudianteId(estudianteId).filter(
      (item) =>
        item.tipo === tipo &&
        (!soloConfirmados || item.totalObservaciones > 0)
    )
  ).map(toResumenItem);
}

/** Hallazgos consolidados en Perfil Base por tipo (sin exigir confirmaciones). */
export function getHallazgosConsolidadosResumen(
  estudianteId: string,
  tipo: HallazgoTipo
): HallazgoResumenItem[] {
  return sortHallazgosPorConfirmaciones(
    getHallazgosConsolidadosPerfilBase(estudianteId, tipo)
  ).map(toResumenItem);
}

/** Intereses consolidados en Perfil Base (sin exigir confirmaciones en intervenciones). */
export function getInteresesConsolidadosResumen(
  estudianteId: string
): HallazgoResumenItem[] {
  return getHallazgosConsolidadosResumen(estudianteId, "interes");
}

/** Top fortalezas consolidadas en Perfil Base. */
export function getTopFortalezasConfirmadas(
  estudianteId: string,
  limit = 5
): HallazgoResumenItem[] {
  return getHallazgosConsolidadosResumen(estudianteId, "fortaleza").slice(0, limit);
}

/** Fortalezas distintas con al menos una confirmación (alineado con Aprendizajes). */
export function countFortalezasConfirmadas(estudianteId: string): number {
  return getHallazgosResumenPorTipo(estudianteId, "fortaleza").length;
}

export function getHallazgoNombresPorEvidenciaId(
  evidenciaId: string,
  tipo?: HallazgoTipo
): string[] {
  const nombres = new Set<string>();

  for (const observacion of getObservacionesByEvidenciaId(evidenciaId)) {
    const hallazgo = getHallazgoById(observacion.hallazgoId);
    if (!hallazgo) continue;
    if (tipo && hallazgo.tipo !== tipo) continue;
    nombres.add(hallazgo.nombre);
  }

  return [...nombres].sort((left, right) => left.localeCompare(right, "es"));
}

export function getLogrosRecientesResumenFicha(
  estudianteId: string
): LogroReciente[] {
  return getSesionesByEstudianteId(estudianteId)
    .filter((sesion) => sesion.logro.trim().length > 0)
    .map((sesion) => {
      const fortalezas = getHallazgoNombresPorEvidenciaId(sesion.id, "fortaleza");

      return {
        id: sesion.id,
        fecha: sesion.fecha,
        logro: sesion.logro.trim(),
        fortaleza:
          fortalezas.length > 0
            ? fortalezas.join(", ")
            : "Sin fortaleza registrada",
        espacio: sesion.espacio,
      };
    });
}

export function getFichaHeaderKpisResumenFicha(
  estudianteId: string,
  objetivosPieActivos: number
): FichaHeaderKpis {
  const base = getFichaHeaderKpisForEstudiante(estudianteId, objetivosPieActivos);

  return {
    ...base,
    fortalezasObservadas: String(countFortalezasConfirmadas(estudianteId)),
  };
}

function formatListSpanish(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} y ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

const INTERES_CON_ARTICULO: Record<string, string> = {
  Animales: "los animales",
  Tecnología: "la tecnología",
  Arte: "el arte",
  Naturaleza: "la naturaleza",
  Construcción: "la construcción",
  Música: "la música",
  Lectura: "la lectura",
  Ciencia: "la ciencia",
  Videojuegos: "los videojuegos",
  Deportes: "los deportes",
};

/** Narrativa «¿Quién es?» desde conocimiento consolidado en Perfil Base. */
export function generateQuienEsResumenDesdeHallazgos(
  estudianteId: string,
  nombre: string
): string | null {
  const fortalezas = getHallazgosConsolidadosResumen(estudianteId, "fortaleza")
    .slice(0, 3)
    .map((item) => item.nombre);
  const intereses = getHallazgosConsolidadosResumen(estudianteId, "interes")
    .slice(0, 3)
    .map((item) => item.nombre);
  const contextos = getHallazgosConsolidadosResumen(
    estudianteId,
    "contexto_exito"
  )
    .slice(0, 3)
    .map((item) => item.nombre);

  const sentences: string[] = [];

  if (fortalezas.length > 0) {
    sentences.push(
      `${nombre} destaca por su ${formatListSpanish(
        fortalezas.map((item) => item.toLowerCase())
      )}.`
    );
  }

  if (intereses.length > 0) {
    sentences.push(
      `Se interesa especialmente por ${formatListSpanish(
        intereses.map(
          (item) => INTERES_CON_ARTICULO[item] ?? item.toLowerCase()
        )
      )}.`
    );
  }

  if (contextos.length > 0) {
    sentences.push(
      `Participa mejor cuando cuenta con ${formatListSpanish(
        contextos.map((item) => item.toLowerCase())
      )}.`
    );
  }

  return sentences.length > 0 ? sentences.join(" ") : null;
}

export { EMPTY_QUIEN_ES_MESSAGE };
