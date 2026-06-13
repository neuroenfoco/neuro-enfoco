import {
  AMBITOS_EQUIPO,
  getAmbitoEquipoNombre,
  type AmbitoEquipo,
} from "@/lib/institucional/ambitos-equipo";
import {
  getParticipacionesByEstudianteId,
  type ParticipacionProfesionalEstudiante,
} from "@/lib/institucional/participaciones-profesional-estudiante-storage";
import {
  isParticipacionActiva,
  resolverEstadoVigencia,
  todayParticipacionDate,
  type EstadoVigenciaParticipacion,
} from "@/lib/institucional/participacion-vigencia";
import {
  formatProfesionalNombreCompleto,
  getProfesionalById,
} from "@/lib/institucional/profesionales-storage";
import { getRolProfesionalNombre } from "@/lib/institucional/roles-profesional-catalog";
import { getEstudianteById } from "@/lib/students-storage";

export type ParticipacionEnriquecida = ParticipacionProfesionalEstudiante & {
  profesionalNombre: string;
  rolNombre: string;
  ambitoNombre: string;
  estadoVigencia: EstadoVigenciaParticipacion;
};

export type EquipoApoyoResumen = {
  cantidadProfesionalesActivos: number;
  cantidadAmbitosActivos: number;
  responsablePie?: ParticipacionEnriquecida;
};

export type EquipoApoyoEstudianteView = {
  estudianteId: string;
  participacionesActivas: ParticipacionEnriquecida[];
  participacionesHistorial: ParticipacionEnriquecida[];
  participacionesVisibles: ParticipacionEnriquecida[];
  porAmbito: Partial<Record<AmbitoEquipo, ParticipacionEnriquecida[]>>;
  responsablesPorAmbito: Partial<Record<AmbitoEquipo, ParticipacionEnriquecida>>;
  resumen: EquipoApoyoResumen;
};

export type EquipoApoyoViewOptions = {
  incluirHistorial?: boolean;
  refDate?: string;
};

function enrichParticipacion(
  participacion: ParticipacionProfesionalEstudiante,
  refDate: string
): ParticipacionEnriquecida {
  const profesional = getProfesionalById(participacion.profesionalId);

  return {
    ...participacion,
    profesionalNombre: profesional
      ? formatProfesionalNombreCompleto(profesional)
      : participacion.profesionalId,
    rolNombre: getRolProfesionalNombre(participacion.rolId),
    ambitoNombre: getAmbitoEquipoNombre(participacion.ambito),
    estadoVigencia: resolverEstadoVigencia(participacion, refDate),
  };
}

function groupByAmbito(
  participaciones: ParticipacionEnriquecida[]
): Partial<Record<AmbitoEquipo, ParticipacionEnriquecida[]>> {
  const grouped: Partial<Record<AmbitoEquipo, ParticipacionEnriquecida[]>> =
    {};

  for (const participacion of participaciones) {
    const current = grouped[participacion.ambito] ?? [];
    grouped[participacion.ambito] = [...current, participacion];
  }

  for (const ambito of Object.keys(grouped) as AmbitoEquipo[]) {
    grouped[ambito]?.sort((a, b) => {
      if (a.esResponsable !== b.esResponsable) {
        return a.esResponsable ? -1 : 1;
      }
      return b.fechaInicio.localeCompare(a.fechaInicio);
    });
  }

  return grouped;
}

function buildResponsablesPorAmbito(
  participacionesActivas: ParticipacionEnriquecida[]
): Partial<Record<AmbitoEquipo, ParticipacionEnriquecida>> {
  const responsables: Partial<Record<AmbitoEquipo, ParticipacionEnriquecida>> =
    {};

  for (const participacion of participacionesActivas) {
    if (!participacion.esResponsable) continue;
    responsables[participacion.ambito] = participacion;
  }

  return responsables;
}

function buildResumen(
  participacionesActivas: ParticipacionEnriquecida[],
  responsablesPorAmbito: Partial<
    Record<AmbitoEquipo, ParticipacionEnriquecida>
  >
): EquipoApoyoResumen {
  const profesionalesUnicos = new Set(
    participacionesActivas.map((item) => item.profesionalId)
  );
  const ambitosActivos = new Set(
    participacionesActivas.map((item) => item.ambito)
  );

  return {
    cantidadProfesionalesActivos: profesionalesUnicos.size,
    cantidadAmbitosActivos: ambitosActivos.size,
    responsablePie: responsablesPorAmbito.pie,
  };
}

/**
 * Read model «Equipo de apoyo»: enriquece, filtra vigencia y agrupa por ámbito.
 * La UI consume esta vista sin reimplementar lógica de agrupación.
 */
export function getEquipoApoyoEstudianteView(
  estudianteId: string,
  options: EquipoApoyoViewOptions = {}
): EquipoApoyoEstudianteView | null {
  if (!getEstudianteById(estudianteId)) return null;

  const refDate = options.refDate ?? todayParticipacionDate();
  const incluirHistorial = options.incluirHistorial ?? false;

  const todas = getParticipacionesByEstudianteId(estudianteId)
    .map((item) => enrichParticipacion(item, refDate))
    .sort((a, b) => b.fechaInicio.localeCompare(a.fechaInicio));

  const participacionesActivas = todas.filter((item) =>
    isParticipacionActiva(item, refDate)
  );
  const participacionesHistorial = todas.filter(
    (item) => item.estadoVigencia === "finalizada"
  );
  const participacionesVisibles = incluirHistorial
    ? todas
    : participacionesActivas;

  const porAmbito = groupByAmbito(participacionesVisibles);
  const responsablesPorAmbito = buildResponsablesPorAmbito(participacionesActivas);
  const resumen = buildResumen(participacionesActivas, responsablesPorAmbito);

  return {
    estudianteId,
    participacionesActivas,
    participacionesHistorial,
    participacionesVisibles,
    porAmbito,
    responsablesPorAmbito,
    resumen,
  };
}

export function getAmbitosConParticipacionesVisibles(
  view: EquipoApoyoEstudianteView
): AmbitoEquipo[] {
  return AMBITOS_EQUIPO.filter(
    (ambito) => (view.porAmbito[ambito]?.length ?? 0) > 0
  );
}
