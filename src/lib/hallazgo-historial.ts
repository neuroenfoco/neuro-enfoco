import { getEspacioNombre } from "@/lib/espacios-storage";
import { getTipoIntervencionNombre } from "@/lib/intervenciones-catalog";
import { getIntervencionById } from "@/lib/intervenciones-storage";
import { getObjetivoPIEById } from "@/lib/pie-objectives-storage";
import {
  getHallazgoById,
  getObservacionesByHallazgoId,
  getHallazgoOrigenLabel,
  type HallazgoPerfil,
} from "@/lib/perfil-hallazgos-storage";
import { getProfesionalDisplayNombre } from "@/lib/institucional/profesional-resolve";
import { getSesiones } from "@/lib/sessions-storage";

export type HallazgoHistorialItem = {
  observacionId: string;
  intervencionId: string;
  evidenciaId: string;
  estudianteId: string;
  fechaDisplay: string;
  fechaOrden: number;
  hora: string | null;
  espacioNombre: string;
  tipoIntervencionNombre: string;
  profesionalNombre: string;
  objetivosNombres: string[];
  logro: string | null;
  intervencionDisponible: boolean;
  evidenciaDisponible: boolean;
};

export type HallazgoHistorial = {
  hallazgo: HallazgoPerfil;
  origenLabel: string;
  confirmaciones: number;
  primeraObservacionDisplay: string | null;
  ultimaObservacionDisplay: string | null;
  items: HallazgoHistorialItem[];
};

function formatIsoFechaDisplay(iso: string | null): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatObservadoEnDisplay(iso: string, hora?: string | null): string {
  const formatted = formatIsoFechaDisplay(iso);
  if (!formatted) return iso;
  return hora ? `${formatted} · ${hora}` : formatted;
}

function getProfesionalNombre(profesionalId: string, fallback?: string): string {
  return getProfesionalDisplayNombre(profesionalId, fallback);
}

function resolveObjetivosNombres(
  objetivoIds: string[],
  fallbackIds: string[] = []
): string[] {
  const ids = objetivoIds.length > 0 ? objetivoIds : fallbackIds;
  const nombres = ids
    .map((id) => getObjetivoPIEById(id)?.nombre)
    .filter((nombre): nombre is string => Boolean(nombre?.trim()));

  return [...new Set(nombres)];
}

function buildHistorialItem(
  observacion: ReturnType<typeof getObservacionesByHallazgoId>[number]
): HallazgoHistorialItem {
  const intervencion = getIntervencionById(observacion.intervencionId);
  const evidencia =
    getSesiones().find((sesion) => sesion.id === observacion.evidenciaId) ?? null;

  const fechaOrden = Date.parse(observacion.observadoEn);
  const hora = evidencia?.hora?.trim() || null;

  return {
    observacionId: observacion.id,
    intervencionId: observacion.intervencionId,
    evidenciaId: observacion.evidenciaId,
    estudianteId: observacion.estudianteId,
    fechaDisplay: formatObservadoEnDisplay(observacion.observadoEn, hora),
    fechaOrden: Number.isFinite(fechaOrden) ? fechaOrden : 0,
    hora,
    espacioNombre: intervencion?.espacioId
      ? getEspacioNombre(intervencion.espacioId)
      : evidencia?.espacio ?? "Sin espacio registrado",
    tipoIntervencionNombre: intervencion
      ? getTipoIntervencionNombre(intervencion.tipoIntervencion)
      : "Intervención no disponible",
    profesionalNombre: intervencion
      ? getProfesionalNombre(
          intervencion.profesionalId,
          evidencia?.profesionalNombre
        )
      : evidencia?.profesionalNombre ?? "Profesional no registrado",
    objetivosNombres: resolveObjetivosNombres(
      intervencion?.objetivosRelacionados ?? [],
      evidencia?.objetivosTrabajadosIds ?? []
    ),
    logro:
      evidencia?.logro?.trim() ||
      intervencion?.descripcion?.trim() ||
      null,
    intervencionDisponible: Boolean(intervencion),
    evidenciaDisponible: Boolean(evidencia),
  };
}

export function getHallazgoHistorial(hallazgoId: string): HallazgoHistorial | null {
  const hallazgo = getHallazgoById(hallazgoId);
  if (!hallazgo) return null;

  const items = getObservacionesByHallazgoId(hallazgoId).map(buildHistorialItem);

  return {
    hallazgo,
    origenLabel: getHallazgoOrigenLabel(hallazgo.origen),
    confirmaciones: hallazgo.totalObservaciones,
    primeraObservacionDisplay: formatIsoFechaDisplay(hallazgo.primeraObservacionEn),
    ultimaObservacionDisplay: formatIsoFechaDisplay(hallazgo.ultimaObservacionEn),
    items,
  };
}
