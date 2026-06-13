import type { HallazgoPerfil } from "@/lib/perfil-hallazgos-storage";

/** Umbral de confirmaciones para estado derivado EMERGENTE. */
export const UMBRAL_EMERGENTE_OBSERVACIONES = 3;

export type EstadoConocimiento =
  | "CONSOLIDADO"
  | "EMERGENTE"
  | "OBSERVADO"
  | "SIN_EVIDENCIA";

export type ResolveEstadoConocimientoOptions = {
  umbralEmergente?: number;
};

/**
 * Fecha efectiva de pertenencia al Perfil Base institucional.
 * Incluye backfill en lectura para registros legacy `origen === "perfil_base"`.
 */
export function resolvePerfilBaseDesde(hallazgo: HallazgoPerfil): string | null {
  if (hallazgo.perfilBaseDesde) return hallazgo.perfilBaseDesde;

  if (
    hallazgo.origen === "perfil_base" &&
    hallazgo.estadoPerfilBase !== "borrador"
  ) {
    return hallazgo.creadoEn ?? hallazgo.actualizadoEn ?? null;
  }

  return null;
}

export function estaEnPerfilBase(hallazgo: HallazgoPerfil): boolean {
  return resolvePerfilBaseDesde(hallazgo) != null;
}

export function resolveEstadoConocimiento(
  hallazgo: HallazgoPerfil,
  options?: ResolveEstadoConocimientoOptions
): EstadoConocimiento {
  if (resolvePerfilBaseDesde(hallazgo)) return "CONSOLIDADO";

  const n = hallazgo.totalObservaciones;
  const umbral = options?.umbralEmergente ?? UMBRAL_EMERGENTE_OBSERVACIONES;

  if (n === 0) return "SIN_EVIDENCIA";
  if (n >= umbral) return "EMERGENTE";
  return "OBSERVADO";
}

export function esHallazgoEmergente(hallazgo: HallazgoPerfil): boolean {
  return resolveEstadoConocimiento(hallazgo) === "EMERGENTE";
}
