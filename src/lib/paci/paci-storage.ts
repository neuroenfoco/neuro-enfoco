import {
  readEvaluacionesIntegrales,
} from "@/lib/evaluacion-integral/evaluacion-integral-persistence";
import type { EvaluacionIntegral } from "@/lib/evaluacion-integral/evaluacion-integral-types";
import { getVinculosByEvaluacionId } from "@/lib/evaluacion-integral/vinculo-conclusion-objetivo-storage";
import {
  readPACIObjetivos,
  writePACIObjetivos,
} from "@/lib/paci/paci-objetivo-persistence";
import {
  normalizePACI,
  readPACIs,
  writePACIs,
} from "@/lib/paci/paci-persistence";
import type {
  PACI,
  PACIObjetivo,
  SavePACIInput,
  UpdatePACIBorradorInput,
} from "@/lib/paci/paci-types";
import {
  assertUnicoPACIVigente,
  canDeclararPACIVigente,
  normalizePeriodoLabel,
  puedeEditarPACI,
  validateEvaluacionReferencia,
  validateObjetivoParaPACI,
  validatePACIAnterior,
} from "@/lib/paci/paci-validacion";
import { getObjetivoPIEById } from "@/lib/pie-objectives-storage";
import { getEstudianteById } from "@/lib/students-storage";

export {
  PACI_OBJETIVO_STORAGE_KEY,
} from "@/lib/paci/paci-objetivo-persistence";
export { PACI_STORAGE_KEY } from "@/lib/paci/paci-persistence";

function nowIso(): string {
  return new Date().toISOString();
}

function getFechaReferenciaEvaluacion(
  evaluacion: Pick<
    EvaluacionIntegral,
    "fechaCierre" | "fechaTermino" | "fechaInicio"
  >
): string {
  return (
    evaluacion.fechaCierre?.trim() ||
    evaluacion.fechaTermino?.trim() ||
    evaluacion.fechaInicio.trim()
  );
}

function getUltimaEvaluacionCerradaId(estudianteId: string): string | null {
  const evaluaciones = readEvaluacionesIntegrales()
    .filter(
      (item) => item.estudianteId === estudianteId && item.estado === "cerrada"
    )
    .sort((a, b) => {
      const fechaA = getFechaReferenciaEvaluacion(a);
      const fechaB = getFechaReferenciaEvaluacion(b);
      return fechaB.localeCompare(fechaA);
    });

  return evaluaciones[0]?.id ?? null;
}

function suggestObjetivoIdsForPACI(
  estudianteId: string,
  evaluacionReferenciaId: string
): string[] {
  const vinculos = getVinculosByEvaluacionId(evaluacionReferenciaId);
  const ids = new Set<string>();

  for (const vinculo of vinculos) {
    const objetivo = getObjetivoPIEById(vinculo.objetivoPieId);
    if (objetivo && objetivo.estudianteId === estudianteId) {
      ids.add(objetivo.id);
    }
  }

  return [...ids];
}

export function getPACIById(id: string): PACI | null {
  return readPACIs().find((item) => item.id === id) ?? null;
}

export function getPACIsByEstudianteId(estudianteId: string): PACI[] {
  return readPACIs()
    .filter((item) => item.estudianteId === estudianteId)
    .sort((a, b) => b.actualizadoEn.localeCompare(a.actualizadoEn));
}

export function getPACIVigenteByEstudianteId(estudianteId: string): PACI | null {
  return (
    readPACIs().find(
      (item) => item.estudianteId === estudianteId && item.estado === "vigente"
    ) ?? null
  );
}

export function getPACIBorradorByEstudianteYPeriodo(
  estudianteId: string,
  periodoLabel: string
): PACI | null {
  const normalized = normalizePeriodoLabel(periodoLabel);
  return (
    readPACIs().find(
      (item) =>
        item.estudianteId === estudianteId &&
        normalizePeriodoLabel(item.periodoLabel) === normalized &&
        item.estado === "borrador"
    ) ?? null
  );
}

export function getPACIObjetivosByPACIId(paciId: string): PACIObjetivo[] {
  return readPACIObjetivos()
    .filter((item) => item.paciId === paciId)
    .sort((a, b) => a.orden - b.orden);
}

export function getPACIObjetivosByObjetivoId(
  objetivoPieId: string
): PACIObjetivo[] {
  return readPACIObjetivos().filter(
    (item) => item.objetivoPieId === objetivoPieId
  );
}

export function createPACI(input: SavePACIInput): PACI | null {
  const estudianteId = input.estudianteId.trim();
  const periodoLabel = normalizePeriodoLabel(input.periodoLabel);

  if (!estudianteId || !periodoLabel) return null;
  if (!getEstudianteById(estudianteId)) return null;

  const borradorExistente = getPACIBorradorByEstudianteYPeriodo(
    estudianteId,
    periodoLabel
  );
  if (borradorExistente) {
    return borradorExistente;
  }

  if (input.paciAnteriorId?.trim()) {
    const anteriorError = validatePACIAnterior(
      input.paciAnteriorId.trim(),
      estudianteId
    );
    if (anteriorError) return null;
  }

  let evaluacionReferenciaId = input.evaluacionReferenciaId?.trim();
  if (evaluacionReferenciaId) {
    const evaluacionError = validateEvaluacionReferencia(
      evaluacionReferenciaId,
      estudianteId
    );
    if (evaluacionError) return null;
  } else {
    evaluacionReferenciaId = getUltimaEvaluacionCerradaId(estudianteId) ?? undefined;
  }

  const now = nowIso();
  const paci: PACI = normalizePACI({
    id: crypto.randomUUID(),
    estudianteId,
    periodoLabel,
    periodoInicio: input.periodoInicio?.trim() || undefined,
    periodoFin: input.periodoFin?.trim() || undefined,
    estado: "borrador",
    evaluacionReferenciaId,
    sintesisInstitucional: input.sintesisInstitucional?.trim() || undefined,
    paciAnteriorId: input.paciAnteriorId?.trim() || undefined,
    creadoEn: now,
    actualizadoEn: now,
  });

  writePACIs([paci, ...readPACIs()]);

  const objetivoPieIds =
    input.objetivoPieIds ??
    (evaluacionReferenciaId
      ? suggestObjetivoIdsForPACI(estudianteId, evaluacionReferenciaId)
      : []);

  if (objetivoPieIds.length > 0) {
    syncPACIObjetivos(paci.id, objetivoPieIds);
  }

  return getPACIById(paci.id);
}

export function updatePACIBorrador(
  paciId: string,
  input: UpdatePACIBorradorInput
): PACI | null {
  const items = readPACIs();
  const index = items.findIndex((item) => item.id === paciId);
  if (index === -1) return null;

  const current = items[index];
  if (!puedeEditarPACI(current)) return null;

  const evaluacionReferenciaId =
    input.evaluacionReferenciaId !== undefined
      ? input.evaluacionReferenciaId.trim() || undefined
      : current.evaluacionReferenciaId;

  if (evaluacionReferenciaId) {
    const evaluacionError = validateEvaluacionReferencia(
      evaluacionReferenciaId,
      current.estudianteId
    );
    if (evaluacionError) return null;
  }

  const updated = normalizePACI({
    ...current,
    periodoInicio:
      input.periodoInicio !== undefined
        ? input.periodoInicio.trim() || undefined
        : current.periodoInicio,
    periodoFin:
      input.periodoFin !== undefined
        ? input.periodoFin.trim() || undefined
        : current.periodoFin,
    evaluacionReferenciaId,
    sintesisInstitucional:
      input.sintesisInstitucional !== undefined
        ? input.sintesisInstitucional.trim() || undefined
        : current.sintesisInstitucional,
    actualizadoEn: nowIso(),
  });

  const next = [...items];
  next[index] = updated;
  writePACIs(next);
  return updated;
}

export function syncPACIObjetivos(
  paciId: string,
  objetivoPieIds: string[]
): boolean {
  const paci = getPACIById(paciId);
  if (!paci || !puedeEditarPACI(paci)) return false;

  const uniqueIds = [
    ...new Set(objetivoPieIds.map((id) => id.trim()).filter(Boolean)),
  ];

  for (const objetivoPieId of uniqueIds) {
    const error = validateObjetivoParaPACI(objetivoPieId, paci.estudianteId);
    if (error) return false;
  }

  const all = readPACIObjetivos();
  const remaining = all.filter((item) => item.paciId !== paciId);
  const existingForPaci = all.filter((item) => item.paciId === paciId);
  const now = nowIso();
  const nextForPaci: PACIObjetivo[] = [];

  uniqueIds.forEach((objetivoPieId, index) => {
    const existing = existingForPaci.find(
      (item) => item.objetivoPieId === objetivoPieId
    );
    if (existing) {
      nextForPaci.push({ ...existing, orden: index });
      return;
    }

    nextForPaci.push({
      id: crypto.randomUUID(),
      paciId,
      objetivoPieId,
      orden: index,
      creadoEn: now,
    });
  });

  writePACIObjetivos([...nextForPaci, ...remaining]);
  return true;
}

export function declararPACIVigente(paciId: string): PACI | null {
  const validation = canDeclararPACIVigente(paciId);
  if (!validation.ok) return null;

  const items = readPACIs();
  const index = items.findIndex((item) => item.id === paciId);
  if (index === -1) return null;

  const current = items[index];
  if (current.estado !== "borrador") return null;

  const updated: PACI = {
    ...current,
    estado: "vigente",
    declaradoVigenteEn: nowIso(),
    actualizadoEn: nowIso(),
  };

  const next = [...items];
  next[index] = updated;
  writePACIs(next);
  return updated;
}

export function cerrarPACI(paciId: string): PACI | null {
  const items = readPACIs();
  const index = items.findIndex((item) => item.id === paciId);
  if (index === -1) return null;

  const current = items[index];
  if (current.estado !== "vigente") return null;

  const now = nowIso();
  const updated: PACI = {
    ...current,
    estado: "cerrado",
    cerradoEn: now,
    actualizadoEn: now,
  };

  const next = [...items];
  next[index] = updated;
  writePACIs(next);
  return updated;
}

export function deletePACI(paciId: string): boolean {
  const items = readPACIs();
  const target = items.find((item) => item.id === paciId);
  if (!target || target.estado !== "borrador") return false;

  deletePACIObjetivosByPACIId(paciId);
  writePACIs(items.filter((item) => item.id !== paciId));
  return true;
}

export function deletePACIObjetivosByPACIId(paciId: string): number {
  const items = readPACIObjetivos();
  const remaining = items.filter((item) => item.paciId !== paciId);
  const removed = items.length - remaining.length;
  if (removed > 0) writePACIObjetivos(remaining);
  return removed;
}

export function deletePACIObjetivosByObjetivoId(objetivoPieId: string): number {
  const items = readPACIObjetivos();
  const remaining = items.filter((item) => item.objetivoPieId !== objetivoPieId);
  const removed = items.length - remaining.length;
  if (removed > 0) writePACIObjetivos(remaining);
  return removed;
}

export function deletePACIObjetivosByEstudianteId(estudianteId: string): number {
  const paciIds = new Set(
    readPACIs()
      .filter((item) => item.estudianteId === estudianteId)
      .map((item) => item.id)
  );
  const items = readPACIObjetivos();
  const remaining = items.filter((item) => !paciIds.has(item.paciId));
  const removed = items.length - remaining.length;
  if (removed > 0) writePACIObjetivos(remaining);
  return removed;
}

export function deletePACIsByEstudianteId(estudianteId: string): number {
  deletePACIObjetivosByEstudianteId(estudianteId);
  const items = readPACIs();
  const remaining = items.filter((item) => item.estudianteId !== estudianteId);
  const removed = items.length - remaining.length;
  if (removed > 0) writePACIs(remaining);
  return removed;
}

export function getDefaultPeriodoLabel(date: Date = new Date()): string {
  return String(date.getFullYear());
}
