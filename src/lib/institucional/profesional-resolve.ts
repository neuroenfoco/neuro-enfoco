import {
  DEFAULT_PROFESIONAL_ID,
  ensureSeedProfesionales,
  formatProfesionalNombreCompleto,
  getDefaultProfesionalId,
  getProfesionalById,
  getProfesionalRolNombre,
} from "@/lib/institucional/profesionales-storage";

/**
 * Nombres del catálogo placeholder previo a la entidad Profesional.
 * Solo para visualización de registros históricos que usaron esos ids.
 */
const LEGACY_CATALOGO_PROFESIONAL_NOMBRES: Record<string, string> = {
  "profesional-local": "Equipo escolar",
  "educadora-diferencial": "Educadora diferencial",
  "psicologa-escolar": "Psicóloga escolar",
  fonoaudiologa: "Fonoaudióloga",
  "terapeuta-ocupacional": "Terapeuta ocupacional",
};

/**
 * Resuelve el id a persistir en intervenciones/sesiones.
 * Si no hay id o no existe el profesional, usa el default de transición.
 */
export function resolveProfesionalIdForPersist(
  profesionalId?: string
): string {
  ensureSeedProfesionales();

  const trimmed = profesionalId?.trim();
  if (!trimmed) return getDefaultProfesionalId();

  if (getProfesionalById(trimmed)) return trimmed;

  return getDefaultProfesionalId();
}

export function getProfesionalDisplayNombre(
  profesionalId: string,
  fallback?: string
): string {
  ensureSeedProfesionales();

  const profesional = getProfesionalById(profesionalId);
  if (profesional) {
    const nombre = formatProfesionalNombreCompleto(profesional);
    const rol = getProfesionalRolNombre(profesional);
    return rol ? `${nombre} — ${rol}` : nombre;
  }

  const legacy = LEGACY_CATALOGO_PROFESIONAL_NOMBRES[profesionalId];
  if (legacy) return legacy;

  if (fallback?.trim()) return fallback.trim();

  if (profesionalId === DEFAULT_PROFESIONAL_ID) return "Equipo escolar";

  return profesionalId;
}

export { DEFAULT_PROFESIONAL_ID, getDefaultProfesionalId };
