import { getEspacioById } from "@/lib/espacios-storage";
import type { TipoIntervencionId } from "@/lib/intervenciones-catalog";
import { getObjetivoPIEById } from "@/lib/pie-objectives-storage";
import { getSesionesByIntervencionId } from "@/lib/sessions-storage";
import { getProfesionalDisplayNombre } from "@/lib/institucional/profesional-resolve";
import { getEstudianteById } from "@/lib/students-storage";
import type {
  IntervencionesAnalyticsFiltros,
  IntervencionesAnalyticsInput,
  IntervencionesAnalyticsIntervencion,
} from "@/lib/intervenciones-analytics/types";

export type IntervencionAnalyticsSource = {
  id: string;
  estudianteId: string;
  profesionalId: string;
  fecha: string;
  tipoIntervencion: TipoIntervencionId;
  espacioId?: string;
  duracionMinutos: number;
  objetivosRelacionados: string[];
};

function intervencionToAnalyticsItem(
  intervencion: IntervencionAnalyticsSource
): IntervencionesAnalyticsIntervencion {
  const estudiante = getEstudianteById(intervencion.estudianteId);
  const espacio = intervencion.espacioId
    ? getEspacioById(intervencion.espacioId)
    : null;

  return {
    id: intervencion.id,
    estudianteId: intervencion.estudianteId,
    estudianteNombre: estudiante?.nombre,
    profesionalId: intervencion.profesionalId,
    profesionalNombre: getProfesionalDisplayNombre(intervencion.profesionalId),
    fecha: intervencion.fecha,
    tipoIntervencion: intervencion.tipoIntervencion,
    espacioId: intervencion.espacioId,
    espacioNombre: espacio?.nombre,
    tipoEspacio: espacio?.tipoEspacio,
    duracionMinutos: intervencion.duracionMinutos,
    objetivosRelacionados: intervencion.objetivosRelacionados.map(
      (objetivoId) => {
        const objetivo = getObjetivoPIEById(objetivoId);
        return {
          objetivoId,
          nombre: objetivo?.nombre,
          dimensionRelacionada: objetivo?.dimensionRelacionada,
        };
      }
    ),
    cantidadEvidencias: getSesionesByIntervencionId(intervencion.id).length,
  };
}

export function buildIntervencionesAnalyticsInput(
  intervenciones: IntervencionAnalyticsSource[],
  options: {
    alcance?: IntervencionesAnalyticsInput["alcance"];
    filtros?: IntervencionesAnalyticsFiltros;
    referencia?: string;
    ventanaSemanas?: number;
  } = {}
): IntervencionesAnalyticsInput {
  const filtros = options.filtros ?? {};

  let alcance = options.alcance ?? "institucional";
  if (!options.alcance) {
    if (filtros.estudianteId) alcance = "estudiante";
    else if (filtros.profesionalId) alcance = "profesional";
  }

  return {
    alcance,
    filtros,
    intervenciones: intervenciones.map(intervencionToAnalyticsItem),
    referencia: options.referencia,
    ventanaSemanas: options.ventanaSemanas,
  };
}
