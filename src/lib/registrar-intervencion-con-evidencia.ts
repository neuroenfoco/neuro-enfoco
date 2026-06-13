import { buildEspacioSeedId } from "@/lib/espacios-catalog";
import { ensureSeedEspacios } from "@/lib/espacios-storage";
import type { TipoIntervencionId } from "@/lib/intervenciones-catalog";
import {
  eliminarIntervencionCompleta,
  formatIntervencionFecha,
  saveIntervencion,
  type Intervencion,
} from "@/lib/intervenciones-storage";
import {
  getApoyoSesionNombre,
  type ApoyoSesionId,
  type SesionEspacioId,
} from "@/lib/sesiones-form-catalog";
import { registrarObservacionesHallazgo } from "@/lib/perfil-hallazgos-storage";
import { saveSesion, type Sesion } from "@/lib/sessions-storage";
import { getEstudianteById } from "@/lib/students-storage";

const SESION_ESPACIO_INSTITUCIONAL: Record<SesionEspacioId, string> = {
  sala_multisensorial: buildEspacioSeedId("sala_multisensorial"),
  espacio_calma: buildEspacioSeedId("espacio_calma"),
  aula: buildEspacioSeedId("aula_recursos"),
  patio: buildEspacioSeedId("otro"),
  otro: buildEspacioSeedId("otro"),
};

const SESION_ESPACIO_TIPO_INTERVENCION: Record<SesionEspacioId, TipoIntervencionId> =
  {
    sala_multisensorial: "sala_multisensorial",
    espacio_calma: "espacio_calma",
    aula: "aula_recursos",
    patio: "acompañamiento_recreo",
    otro: "sesion_individual",
  };

export type EvidenciaIntervencionInput = Omit<Sesion, "id" | "intervencionId">;

export type RegistrarIntervencionConEvidenciaInput = {
  evidencia: EvidenciaIntervencionInput;
  tipoIntervencion?: TipoIntervencionId;
  descripcion?: string;
  observaciones?: string;
  /** IDs de HallazgoPerfil presentes en esta intervención. */
  hallazgosPresentesIds?: string[];
};

export type RegistrarIntervencionConEvidenciaResult =
  | { ok: true; intervencion: Intervencion; evidencia: Sesion }
  | { ok: false; error: string };

function resolveInstitucionalEspacioId(
  espacioId?: SesionEspacioId
): string | undefined {
  if (!espacioId) return undefined;
  return SESION_ESPACIO_INSTITUCIONAL[espacioId];
}

function inferTipoIntervencion(
  espacioId?: SesionEspacioId,
  override?: TipoIntervencionId
): TipoIntervencionId {
  if (override) return override;
  if (espacioId && SESION_ESPACIO_TIPO_INTERVENCION[espacioId]) {
    return SESION_ESPACIO_TIPO_INTERVENCION[espacioId];
  }
  return "sesion_individual";
}

function apoyosToIntervencionLabels(apoyos?: ApoyoSesionId[]): string[] {
  if (!apoyos?.length) return [];
  return apoyos.map((id) => getApoyoSesionNombre(id));
}

function sesionFechaToIso(fecha: string, hora?: string): string {
  const match = fecha.match(/^(\d{1,2})\s+([a-záéíóúñ]+)\.?\s+(\d{4})$/i);
  if (!match) return formatIntervencionFecha();

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
  if (month === undefined) return formatIntervencionFecha();

  const [hours, minutes] = (hora ?? "12:00").split(":").map(Number);
  return new Date(
    year,
    month,
    day,
    Number.isFinite(hours) ? hours : 12,
    Number.isFinite(minutes) ? minutes : 0
  ).toISOString();
}

/**
 * Crea una intervención institucional y su evidencia pedagógica vinculada (1:1).
 * Toda evidencia nueva queda asociada mediante `intervencionId`.
 */
export function registrarIntervencionConEvidencia(
  input: RegistrarIntervencionConEvidenciaInput
): RegistrarIntervencionConEvidenciaResult {
  if (typeof window === "undefined") {
    return { ok: false, error: "Solo disponible en el cliente." };
  }

  const estudianteId = input.evidencia.estudianteId?.trim();
  if (!estudianteId || !getEstudianteById(estudianteId)) {
    return { ok: false, error: "Estudiante no válido." };
  }

  ensureSeedEspacios();

  const intervencionId = crypto.randomUUID();
  const evidenciaId = crypto.randomUUID();
  const espacioInstitucionalId = resolveInstitucionalEspacioId(
    input.evidencia.espacioId
  );
  const tipoIntervencion = inferTipoIntervencion(
    input.evidencia.espacioId,
    input.tipoIntervencion
  );
  const descripcion =
    input.descripcion?.trim() ||
    input.evidencia.logro?.trim() ||
    "Intervención registrada";
  const observaciones = input.observaciones?.trim() ?? "";

  const intervencion = saveIntervencion({
    id: intervencionId,
    estudianteId,
    profesionalId: input.evidencia.profesionalId,
    fecha: sesionFechaToIso(input.evidencia.fecha, input.evidencia.hora),
    tipoIntervencion,
    espacioId: espacioInstitucionalId,
    duracionMinutos: input.evidencia.duracionMinutos ?? 0,
    descripcion,
    objetivosRelacionados: input.evidencia.objetivosTrabajadosIds ?? [],
    apoyosUtilizados: apoyosToIntervencionLabels(input.evidencia.apoyosUtilizados),
    observaciones,
  });

  if (!intervencion) {
    return {
      ok: false,
      error: "No se pudo registrar la intervención institucional.",
    };
  }

  const evidencia: Sesion = {
    ...input.evidencia,
    id: evidenciaId,
    estudianteId,
    intervencionId: intervencion.id,
  };

  try {
    saveSesion(evidencia);
  } catch {
    eliminarIntervencionCompleta(intervencion.id);
    return {
      ok: false,
      error: "No se pudo vincular la evidencia a la intervención.",
    };
  }

  if (input.hallazgosPresentesIds?.length) {
    try {
      registrarObservacionesHallazgo({
        estudianteId,
        intervencionId: intervencion.id,
        evidenciaId: evidencia.id,
        hallazgoIds: input.hallazgosPresentesIds,
        observadoEn: intervencion.fecha,
      });
    } catch {
      eliminarIntervencionCompleta(intervencion.id);
      return {
        ok: false,
        error: "No se pudieron registrar las observaciones del perfil.",
      };
    }
  }

  return { ok: true, intervencion, evidencia };
}
