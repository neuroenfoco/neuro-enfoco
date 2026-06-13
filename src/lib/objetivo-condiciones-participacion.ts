import {
  CATALOGO_OTRO_ID,
  type CondicionParticipacionCatalogItem,
} from "@/lib/catalogos/catalog-types";
import {
  getCondicionParticipacionById,
  getCondicionesParticipacionCatalog,
} from "@/lib/catalogos/condiciones-participacion-catalog";
import { buscarCoincidenciasHallazgo } from "@/lib/hallazgos-normalizacion";
import type { ObjetivoPIE } from "@/lib/pie-objectives-storage";

export type CondicionesParticipacionFormState = {
  condicionesParticipacionIds: string[];
  condicionParticipacionOtro: string;
};

const SEGMENT_SPLIT = /[,;\n]+/;

function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function findCatalogItemByNombre(
  nombre: string
): CondicionParticipacionCatalogItem | undefined {
  const normalized = normalizeText(nombre).toLowerCase();
  return getCondicionesParticipacionCatalog().find(
    (item) => item.nombre.toLowerCase() === normalized
  );
}

/**
 * Infiere IDs de catálogo desde barreraDetectada legacy (texto libre).
 * Sin coincidencia → Otro con texto original preservado.
 */
export function inferCondicionesFromBarreraDetectada(
  barreraDetectada?: string
): CondicionesParticipacionFormState {
  const trimmed = barreraDetectada?.trim() ?? "";
  if (!trimmed) {
    return { condicionesParticipacionIds: [], condicionParticipacionOtro: "" };
  }

  const exactWhole = findCatalogItemByNombre(trimmed);
  if (exactWhole) {
    return {
      condicionesParticipacionIds: [exactWhole.id],
      condicionParticipacionOtro: "",
    };
  }

  const segments = trimmed
    .split(SEGMENT_SPLIT)
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length > 1) {
    const ids: string[] = [];
    const unmatched: string[] = [];

    for (const segment of segments) {
      const item = findCatalogItemByNombre(segment);
      if (item) {
        if (!ids.includes(item.id)) ids.push(item.id);
      } else {
        unmatched.push(segment);
      }
    }

    if (ids.length > 0) {
      if (unmatched.length > 0) {
        return {
          condicionesParticipacionIds: [...ids, CATALOGO_OTRO_ID],
          condicionParticipacionOtro: unmatched.join("; "),
        };
      }
      return {
        condicionesParticipacionIds: ids,
        condicionParticipacionOtro: "",
      };
    }
  }

  const [sugerencia] = buscarCoincidenciasHallazgo(trimmed, {
    catalogo: "condiciones_participacion",
    maxResultados: 1,
    umbralMinimo: 0.75,
  });

  if (sugerencia) {
    return {
      condicionesParticipacionIds: [sugerencia.id],
      condicionParticipacionOtro: "",
    };
  }

  return {
    condicionesParticipacionIds: [CATALOGO_OTRO_ID],
    condicionParticipacionOtro: trimmed,
  };
}

/** Estado de formulario desde objetivo (IDs persistidos o inferencia legacy). */
export function getCondicionesParticipacionFormState(
  objetivo: ObjetivoPIE
): CondicionesParticipacionFormState {
  if (objetivo.condicionesParticipacionIds?.length) {
    const ids = [...objetivo.condicionesParticipacionIds];
    const otro = objetivo.condicionParticipacionOtro?.trim() ?? "";

    if (otro && !ids.includes(CATALOGO_OTRO_ID)) {
      ids.push(CATALOGO_OTRO_ID);
    }

    return {
      condicionesParticipacionIds: ids,
      condicionParticipacionOtro: otro,
    };
  }

  return inferCondicionesFromBarreraDetectada(objetivo.barreraDetectada);
}

export function getCondicionParticipacionNombre(id: string): string {
  if (id === CATALOGO_OTRO_ID) {
    return "Otro (especificar)";
  }
  return getCondicionParticipacionById(id)?.nombre ?? id;
}

/** Texto denormalizado para barreraDetectada (compatibilidad legacy). */
export function buildBarreraDetectadaFromCondiciones(
  ids: string[],
  otro?: string
): string | undefined {
  const nombres = ids
    .filter((id) => id !== CATALOGO_OTRO_ID)
    .map((id) => getCondicionParticipacionNombre(id));

  const otroTrimmed = otro?.trim();
  if (ids.includes(CATALOGO_OTRO_ID) && otroTrimmed) {
    nombres.push(otroTrimmed);
  }

  const value = nombres.map((nombre) => nombre.trim()).filter(Boolean).join("; ");
  return value || undefined;
}

export function normalizeCondicionesParticipacionInput(input: {
  condicionesParticipacionIds?: string[];
  condicionParticipacionOtro?: string;
}): {
  condicionesParticipacionIds?: string[];
  condicionParticipacionOtro?: string;
  barreraDetectada?: string;
} {
  const ids = [...(input.condicionesParticipacionIds ?? [])];
  const otro = input.condicionParticipacionOtro?.trim() ?? "";

  if (otro && !ids.includes(CATALOGO_OTRO_ID)) {
    ids.push(CATALOGO_OTRO_ID);
  }

  if (ids.length === 0) {
    return {
      condicionesParticipacionIds: undefined,
      condicionParticipacionOtro: undefined,
      barreraDetectada: undefined,
    };
  }

  return {
    condicionesParticipacionIds: ids,
    condicionParticipacionOtro: ids.includes(CATALOGO_OTRO_ID)
      ? otro || undefined
      : undefined,
    barreraDetectada: buildBarreraDetectadaFromCondiciones(ids, otro),
  };
}

export function hasCondicionesParticipacionRegistradas(
  objetivo: ObjetivoPIE
): boolean {
  if (objetivo.condicionesParticipacionIds?.length) return true;
  return Boolean(objetivo.barreraDetectada?.trim());
}
