/**
 * Estados emocionales: etiquetas inclusivas y compatibilidad con registros legados.
 */

export type EmotionalStateId =
  | "muy-alterada"
  | "alterada"
  | "neutral"
  | "regulada"
  | "muy-regulada";

export const EMOTIONAL_STATE_CANONICAL_LABELS: Record<EmotionalStateId, string> =
  {
    "muy-alterada": "Muy alterado/a",
    alterada: "Alterado/a",
    neutral: "Neutral",
    regulada: "Regulado/a",
    "muy-regulada": "Muy regulado/a",
  };

export const EMOTIONAL_STATE_EMOJIS: Record<EmotionalStateId, string> = {
  "muy-alterada": "😣",
  alterada: "😕",
  neutral: "😐",
  regulada: "🙂",
  "muy-regulada": "😄",
};

export const EMOTIONAL_STATE_VALUES: Record<EmotionalStateId, number> = {
  "muy-alterada": 1,
  alterada: 2,
  neutral: 3,
  regulada: 4,
  "muy-regulada": 5,
};

/** Etiquetas almacenadas antes de la normalización lingüística. */
const LEGACY_LABEL_TO_ID: Record<string, EmotionalStateId> = {
  "Muy alterada": "muy-alterada",
  "Muy alterado/a": "muy-alterada",
  Alterada: "alterada",
  "Alterado/a": "alterada",
  Neutral: "neutral",
  Regulada: "regulada",
  "Regulado/a": "regulada",
  "Muy regulada": "muy-regulada",
  "Muy regulado/a": "muy-regulada",
};

const CANONICAL_LABEL_SET = new Set(
  Object.values(EMOTIONAL_STATE_CANONICAL_LABELS)
);

export function emotionalStateIdFromLabel(label: string): EmotionalStateId | null {
  const trimmed = label.trim();
  const byLegacy = LEGACY_LABEL_TO_ID[trimmed];
  if (byLegacy) return byLegacy;

  for (const [id, canonical] of Object.entries(EMOTIONAL_STATE_CANONICAL_LABELS)) {
    if (canonical === trimmed) return id as EmotionalStateId;
  }

  return null;
}

/** Normaliza cualquier etiqueta (legada o canónica) a la forma inclusiva actual. */
export function normalizeEmotionalStateLabel(label: string): string {
  const id = emotionalStateIdFromLabel(label);
  if (id) return EMOTIONAL_STATE_CANONICAL_LABELS[id];
  return label.trim() || EMOTIONAL_STATE_CANONICAL_LABELS.neutral;
}

export function getEstadoEmocionalValor(estado: string): number {
  const id = emotionalStateIdFromLabel(estado);
  if (id) return EMOTIONAL_STATE_VALUES[id];
  return EMOTIONAL_STATE_VALUES.neutral;
}

export function getEmotionDisplay(label: string): {
  emoji: string;
  label: string;
} {
  const id = emotionalStateIdFromLabel(label);
  const canonical = normalizeEmotionalStateLabel(label);

  if (id) {
    return {
      emoji: EMOTIONAL_STATE_EMOJIS[id],
      label: canonical,
    };
  }

  return {
    emoji: "😐",
    label: canonical,
  };
}

export function labelFromEmotionalStateId(id: EmotionalStateId): string {
  return EMOTIONAL_STATE_CANONICAL_LABELS[id];
}

export function getEmotionalStateFormOptions(): {
  id: EmotionalStateId;
  emoji: string;
  label: string;
}[] {
  return (Object.keys(EMOTIONAL_STATE_CANONICAL_LABELS) as EmotionalStateId[]).map(
    (id) => ({
      id,
      emoji: EMOTIONAL_STATE_EMOJIS[id],
      label: EMOTIONAL_STATE_CANONICAL_LABELS[id],
    })
  );
}

export function isCanonicalEmotionalStateLabel(label: string): boolean {
  return CANONICAL_LABEL_SET.has(normalizeEmotionalStateLabel(label));
}
