/**
 * Dimensiones de impacto en una Sesion (evidencia).
 *
 * Modelo:
 * - dimensionesPrincipales: derivadas de objetivosTrabajadosIds (no se persisten).
 * - impactosAdicionales: registrados explícitamente por el profesional.
 * - dimensiones: unión (principales ∪ adicionales) para compatibilidad con Perfil
 *   Evolutivo, inferido_dimension y lecturas legacy.
 *
 * Sesiones antiguas sin impactosAdicionales conservan dimensiones tal cual.
 */
import { getObjetivoPIEById } from "@/lib/pie-objectives-storage";
import type { Sesion } from "@/lib/sessions-storage";

/** Alineado con PROFILE_DIMENSION_LABELS en sessions-storage. */
export const DIMENSIONES_DESARROLLO_CATALOGO = [
  "Regulación emocional",
  "Interacción social",
  "Comunicación",
  "Autonomía",
  "Participación escolar",
  "Bienestar percibido",
  "Fortalezas y talentos",
] as const;

export type SesionImpactosDimensiones = {
  dimensionesPrincipales: string[];
  impactosAdicionales: string[];
  /** Igual que Sesion.dimensiones (total impactado). */
  dimensionesImpactoTotal: string[];
  /** true si no existe impactosAdicionales persistido (dato histórico mezclado). */
  esLegacySinCampoExplicito?: boolean;
};

function uniqueSorted(labels: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const label of DIMENSIONES_DESARROLLO_CATALOGO) {
    if (labels.includes(label) && !seen.has(label)) {
      seen.add(label);
      result.push(label);
    }
  }

  for (const label of labels) {
    if (!seen.has(label)) {
      seen.add(label);
      result.push(label);
    }
  }

  return result;
}

export function isDimensionCatalogo(label: string): boolean {
  return (DIMENSIONES_DESARROLLO_CATALOGO as readonly string[]).includes(label);
}

/**
 * Dimensiones principales a partir de los objetivos trabajados en la sesión.
 */
export function getDimensionesPrincipalesFromObjetivoIds(
  objetivoIds: string[]
): string[] {
  const dimensiones: string[] = [];

  for (const objetivoId of objetivoIds) {
    const objetivo = getObjetivoPIEById(objetivoId);
    if (!objetivo?.dimensionRelacionada) continue;
    if (!dimensiones.includes(objetivo.dimensionRelacionada)) {
      dimensiones.push(objetivo.dimensionRelacionada);
    }
  }

  return uniqueSorted(dimensiones);
}

/**
 * Unión ordenada para persistir en Sesion.dimensiones.
 */
export function buildDimensionesSesion(
  dimensionesPrincipales: string[],
  impactosAdicionales: string[]
): string[] {
  const adicionalesSinDuplicar = impactosAdicionales.filter(
    (dimension) => !dimensionesPrincipales.includes(dimension)
  );
  return uniqueSorted([...dimensionesPrincipales, ...adicionalesSinDuplicar]);
}

export function getImpactosAdicionalesDisponibles(
  dimensionesPrincipales: string[]
): string[] {
  return DIMENSIONES_DESARROLLO_CATALOGO.filter(
    (dimension) => !dimensionesPrincipales.includes(dimension)
  );
}

/**
 * Normaliza impactos adicionales y recalcula dimensiones cuando el campo explícito existe.
 */
export function reconciliarDimensionesSesion(sesion: Sesion): Sesion {
  const objetivosTrabajadosIds = sesion.objetivosTrabajadosIds ?? [];
  const dimensionesPrincipales =
    getDimensionesPrincipalesFromObjetivoIds(objetivosTrabajadosIds);

  if (sesion.impactosAdicionales === undefined) {
    return sesion;
  }

  const impactosAdicionales = sesion.impactosAdicionales.filter(
    (dimension) =>
      isDimensionCatalogo(dimension) &&
      !dimensionesPrincipales.includes(dimension)
  );

  return {
    ...sesion,
    impactosAdicionales,
    dimensiones: buildDimensionesSesion(
      dimensionesPrincipales,
      impactosAdicionales
    ),
  };
}

/**
 * Vista analítica de impactos (Aprendizajes / analíticas futuras).
 * No modifica la sesión.
 */
export function resolveSesionImpactosDimensiones(
  sesion: Sesion
): SesionImpactosDimensiones {
  const dimensionesPrincipales = getDimensionesPrincipalesFromObjetivoIds(
    sesion.objetivosTrabajadosIds ?? []
  );

  if (sesion.impactosAdicionales !== undefined) {
    return {
      dimensionesPrincipales,
      impactosAdicionales: sesion.impactosAdicionales,
      dimensionesImpactoTotal: sesion.dimensiones,
      esLegacySinCampoExplicito: false,
    };
  }

  if (dimensionesPrincipales.length > 0 && sesion.dimensiones.length > 0) {
    const impactosInferidos = sesion.dimensiones.filter(
      (dimension) => !dimensionesPrincipales.includes(dimension)
    );
    const principalesEnSesion = sesion.dimensiones.filter((dimension) =>
      dimensionesPrincipales.includes(dimension)
    );

    return {
      dimensionesPrincipales:
        principalesEnSesion.length > 0
          ? uniqueSorted(principalesEnSesion)
          : dimensionesPrincipales,
      impactosAdicionales: uniqueSorted(impactosInferidos),
      dimensionesImpactoTotal: sesion.dimensiones,
      esLegacySinCampoExplicito: true,
    };
  }

  return {
    dimensionesPrincipales: [],
    impactosAdicionales: [],
    dimensionesImpactoTotal: sesion.dimensiones,
    esLegacySinCampoExplicito: true,
  };
}
