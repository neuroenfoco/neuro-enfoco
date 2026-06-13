import { getEmotionDisplay } from "@/lib/copy/emotional-states";
import { getEspacioNombre } from "@/lib/espacios-storage";
import {
  getTipoIntervencionNombre,
  type TipoIntervencionId,
} from "@/lib/intervenciones-catalog";
import {
  getIntervencionesByEstudianteId,
  type Intervencion,
} from "@/lib/intervenciones-storage";
import { getProfesionalDisplayNombre } from "@/lib/institucional/profesional-resolve";
import { getObjetivoPIEById } from "@/lib/pie-objectives-storage";
import {
  getApoyoSesionNombre,
  type ApoyoSesionId,
} from "@/lib/sesiones-form-catalog";
import {
  getSesionesByIntervencionId,
  sortSesionesByFecha,
  type Sesion,
} from "@/lib/sessions-storage";

export type EstudianteIntervencionesFiltros = {
  fechaDesde?: string;
  fechaHasta?: string;
  tipoIntervencionId?: TipoIntervencionId | "";
  espacioId?: string;
};

export type IntervencionFichaObjetivo = {
  id: string;
  nombre: string;
};

export type IntervencionFichaEstado = {
  label: string;
  emoji: string;
};

export type IntervencionFichaItem = {
  intervencion: Intervencion;
  evidencia: Sesion | null;
  fechaDisplay: string;
  fechaOrden: number;
  hora: string | null;
  tipoNombre: string;
  espacioNombre: string;
  duracionMinutos: number;
  duracionDisplay: string;
  profesionalNombre: string;
  objetivos: IntervencionFichaObjetivo[];
  estadoInicial: IntervencionFichaEstado | null;
  estadoFinal: IntervencionFichaEstado | null;
  fortalezas: string[];
  apoyos: string[];
  logro: string | null;
  barreras: string[];
};

export type EstudianteIntervencionesKpis = {
  totalIntervenciones: number;
  horasAcumuladas: string;
  espaciosUtilizados: number;
  objetivosTrabajados: number;
};

export type IntervencionesFichaFilterOptions = {
  tipos: { id: TipoIntervencionId; nombre: string }[];
  espacios: { id: string; nombre: string }[];
};

export type EstudianteIntervencionesFicha = {
  estudianteId: string;
  kpis: EstudianteIntervencionesKpis;
  filterOptions: IntervencionesFichaFilterOptions;
  items: IntervencionFichaItem[];
  totalSinFiltrar: number;
};

function parseFechaOrden(fecha: string, evidencia: Sesion | null): number {
  const iso = Date.parse(fecha);
  if (Number.isFinite(iso)) return iso;

  if (evidencia?.fecha) {
    const match = evidencia.fecha.match(
      /^(\d{1,2})\s+([a-záéíóúñ]+)\.?\s+(\d{4})$/i
    );
    if (match) {
      const monthNames: Record<string, number> = {
        ene: 0,
        feb: 1,
        mar: 2,
        abr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        ago: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dic: 11,
      };
      const day = Number(match[1]);
      const month = monthNames[match[2].slice(0, 3).toLowerCase()];
      const year = Number(match[3]);
      if (month !== undefined) {
        return new Date(year, month, day).getTime();
      }
    }
  }

  return 0;
}

function formatFechaDisplay(intervencion: Intervencion, evidencia: Sesion | null): string {
  if (evidencia?.fecha) return evidencia.fecha;

  const date = new Date(intervencion.fecha);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return intervencion.fecha;
}

function getProfesionalNombre(
  profesionalId: string,
  evidencia: Sesion | null
): string {
  return getProfesionalDisplayNombre(
    profesionalId,
    evidencia?.profesionalNombre
  );
}

function formatDuracion(minutos: number): string {
  const safe = Math.max(0, Math.round(minutos));
  if (safe < 60) return `${safe} min`;
  const hours = Math.floor(safe / 60);
  const rest = safe % 60;
  return rest > 0 ? `${hours} h ${rest} min` : `${hours} h`;
}

function formatHorasAcumuladas(totalMinutos: number): string {
  const hours = totalMinutos / 60;
  if (hours === 0) return "0 h";
  if (Number.isInteger(hours)) return `${hours} h`;
  return `${hours.toFixed(1).replace(".", ",")} h`;
}

function resolveApoyosDisplay(
  intervencion: Intervencion,
  evidencia: Sesion | null
): string[] {
  if (evidencia?.apoyosUtilizados?.length) {
    return evidencia.apoyosUtilizados.map((id) =>
      getApoyoSesionNombre(id as ApoyoSesionId)
    );
  }
  return intervencion.apoyosUtilizados;
}

function resolveObjetivos(intervencion: Intervencion): IntervencionFichaObjetivo[] {
  return intervencion.objetivosRelacionados
    .map((id) => {
      const objetivo = getObjetivoPIEById(id);
      if (!objetivo) return null;
      return { id: objetivo.id, nombre: objetivo.nombre };
    })
    .filter((item): item is IntervencionFichaObjetivo => item !== null);
}

function getPrimaryEvidencia(intervencionId: string): Sesion | null {
  const evidencias = sortSesionesByFecha(
    getSesionesByIntervencionId(intervencionId),
    "desc"
  );
  return evidencias[0] ?? null;
}

function buildIntervencionFichaItem(intervencion: Intervencion): IntervencionFichaItem {
  const evidencia = getPrimaryEvidencia(intervencion.id);
  const estadoInicial = evidencia
    ? getEmotionDisplay(evidencia.estadoInicial)
    : null;
  const estadoFinal = evidencia ? getEmotionDisplay(evidencia.estadoFinal) : null;

  return {
    intervencion,
    evidencia,
    fechaDisplay: formatFechaDisplay(intervencion, evidencia),
    fechaOrden: parseFechaOrden(intervencion.fecha, evidencia),
    hora: evidencia?.hora?.trim() || null,
    tipoNombre: getTipoIntervencionNombre(intervencion.tipoIntervencion),
    espacioNombre: intervencion.espacioId
      ? getEspacioNombre(intervencion.espacioId)
      : evidencia?.espacio ?? "Sin espacio registrado",
    duracionMinutos: intervencion.duracionMinutos,
    duracionDisplay: formatDuracion(intervencion.duracionMinutos),
    profesionalNombre: getProfesionalNombre(intervencion.profesionalId, evidencia),
    objetivos: resolveObjetivos(intervencion),
    estadoInicial: estadoInicial
      ? { label: estadoInicial.label, emoji: estadoInicial.emoji }
      : null,
    estadoFinal: estadoFinal
      ? { label: estadoFinal.label, emoji: estadoFinal.emoji }
      : null,
    fortalezas: evidencia?.fortalezas ?? [],
    apoyos: resolveApoyosDisplay(intervencion, evidencia),
    logro: evidencia?.logro?.trim() || intervencion.descripcion?.trim() || null,
    barreras: evidencia?.barrerasObservadas ?? [],
  };
}

function matchesFiltros(
  item: IntervencionFichaItem,
  filtros: EstudianteIntervencionesFiltros
): boolean {
  if (
    filtros.tipoIntervencionId &&
    item.intervencion.tipoIntervencion !== filtros.tipoIntervencionId
  ) {
    return false;
  }

  if (filtros.espacioId && item.intervencion.espacioId !== filtros.espacioId) {
    return false;
  }

  if (filtros.fechaDesde) {
    const desde = new Date(`${filtros.fechaDesde}T00:00:00`).getTime();
    if (item.fechaOrden < desde) return false;
  }

  if (filtros.fechaHasta) {
    const hasta = new Date(`${filtros.fechaHasta}T23:59:59`).getTime();
    if (item.fechaOrden > hasta) return false;
  }

  return true;
}

function buildFilterOptions(items: IntervencionFichaItem[]): IntervencionesFichaFilterOptions {
  const tiposMap = new Map<TipoIntervencionId, string>();
  const espaciosMap = new Map<string, string>();

  for (const item of items) {
    tiposMap.set(item.intervencion.tipoIntervencion, item.tipoNombre);
    if (item.intervencion.espacioId) {
      espaciosMap.set(item.intervencion.espacioId, item.espacioNombre);
    }
  }

  return {
    tipos: [...tiposMap.entries()]
      .map(([id, nombre]) => ({ id, nombre }))
      .sort((left, right) => left.nombre.localeCompare(right.nombre, "es")),
    espacios: [...espaciosMap.entries()]
      .map(([id, nombre]) => ({ id, nombre }))
      .sort((left, right) => left.nombre.localeCompare(right.nombre, "es")),
  };
}

function buildKpis(items: IntervencionFichaItem[]): EstudianteIntervencionesKpis {
  const espacios = new Set<string>();
  const objetivos = new Set<string>();
  let totalMinutos = 0;

  for (const item of items) {
    totalMinutos += item.duracionMinutos;
    if (item.intervencion.espacioId) {
      espacios.add(item.intervencion.espacioId);
    }
    for (const objetivo of item.objetivos) {
      objetivos.add(objetivo.id);
    }
  }

  return {
    totalIntervenciones: items.length,
    horasAcumuladas: formatHorasAcumuladas(totalMinutos),
    espaciosUtilizados: espacios.size,
    objetivosTrabajados: objetivos.size,
  };
}

export function getEstudianteIntervencionesFicha(
  estudianteId: string,
  filtros: EstudianteIntervencionesFiltros = {}
): EstudianteIntervencionesFicha {
  const intervenciones = getIntervencionesByEstudianteId(estudianteId);
  const allItems = intervenciones
    .map(buildIntervencionFichaItem)
    .sort((left, right) => right.fechaOrden - left.fechaOrden);

  const filteredItems = allItems.filter((item) => matchesFiltros(item, filtros));

  return {
    estudianteId,
    kpis: buildKpis(allItems),
    filterOptions: buildFilterOptions(allItems),
    items: filteredItems,
    totalSinFiltrar: allItems.length,
  };
}
