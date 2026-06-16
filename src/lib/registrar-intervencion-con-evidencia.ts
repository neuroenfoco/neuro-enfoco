import { buildEspacioSeedId } from "@/lib/espacios-catalog";
import { ensureSeedEspacios } from "@/lib/espacios-storage";
import {
  assertEstudianteExisteAsync,
} from "@/lib/evaluacion-integral/evaluacion-integral-validacion";
import type { TipoIntervencionId } from "@/lib/intervenciones-catalog";
import {
  formatIntervencionFecha,
  saveIntervencion,
  saveIntervencionAsync,
  type SaveIntervencionInput,
} from "@/lib/intervenciones-storage";
import { registrarObservacionesHallazgo } from "@/lib/perfil-hallazgos-storage";
import type { Intervencion } from "@/lib/repositories/intervenciones-repository";
import {
  getEstudiantesRepository,
  getIntervencionesRepository,
  getSesionesRepository,
} from "@/lib/repositories/repository-factory";
import type { Sesion } from "@/lib/repositories/sesiones-repository";
import {
  getApoyoSesionNombre,
  type ApoyoSesionId,
  type SesionEspacioId,
} from "@/lib/sesiones-form-catalog";

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

function buildIntervencionInput(
  input: RegistrarIntervencionConEvidenciaInput,
  estudianteId: string,
  intervencionId: string
): SaveIntervencionInput {
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

  return {
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
    observaciones: input.observaciones?.trim() ?? "",
  };
}

function finalizarRegistroIntervencionConEvidencia(
  input: RegistrarIntervencionConEvidenciaInput,
  estudianteId: string,
  intervencion: Intervencion,
  evidenciaId: string
): RegistrarIntervencionConEvidenciaResult {
  const intervencionesRepository = getIntervencionesRepository();
  const sesionesRepository = getSesionesRepository();

  const evidencia: Sesion = {
    ...input.evidencia,
    id: evidenciaId,
    estudianteId,
    intervencionId: intervencion.id,
  };

  try {
    sesionesRepository.save(evidencia);
  } catch {
    intervencionesRepository.delete(intervencion.id);
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
      intervencionesRepository.delete(intervencion.id);
      return {
        ok: false,
        error: "No se pudieron registrar las observaciones del perfil.",
      };
    }
  }

  return { ok: true, intervencion, evidencia };
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
  if (!estudianteId || !getEstudiantesRepository().getById(estudianteId)) {
    return { ok: false, error: "Estudiante no válido." };
  }

  ensureSeedEspacios();

  const intervencionId = crypto.randomUUID();
  const evidenciaId = crypto.randomUUID();

  const intervencion = saveIntervencion(
    buildIntervencionInput(input, estudianteId, intervencionId)
  );

  if (!intervencion) {
    return {
      ok: false,
      error: "No se pudo registrar la intervención institucional.",
    };
  }

  return finalizarRegistroIntervencionConEvidencia(
    input,
    estudianteId,
    intervencion,
    evidenciaId
  );
}

export async function registrarIntervencionConEvidenciaAsync(
  input: RegistrarIntervencionConEvidenciaInput
): Promise<RegistrarIntervencionConEvidenciaResult> {
  if (typeof window === "undefined") {
    return { ok: false, error: "Solo disponible en el cliente." };
  }

  const estudianteId = input.evidencia.estudianteId?.trim();
  if (!estudianteId) {
    return { ok: false, error: "Estudiante no válido." };
  }

  const estudianteError = await assertEstudianteExisteAsync(estudianteId);
  if (estudianteError) {
    return { ok: false, error: estudianteError };
  }

  ensureSeedEspacios();

  const intervencionId = crypto.randomUUID();
  const evidenciaId = crypto.randomUUID();

  const intervencion = await saveIntervencionAsync(
    buildIntervencionInput(input, estudianteId, intervencionId)
  );

  if (!intervencion) {
    return {
      ok: false,
      error: "No se pudo registrar la intervención institucional.",
    };
  }

  return finalizarRegistroIntervencionConEvidencia(
    input,
    estudianteId,
    intervencion,
    evidenciaId
  );
}
