/**
 * Utilidades de catálogo híbrido para Perfil Base.
 *
 * Diagnóstico: los catálogos y buscarCoincidenciasHallazgo ya existían;
 * HallazgoPerfil solo tenía nombre libre. Se añadieron campos opcionales
 * (catalogoKind, catalogoId, formulacionOriginal) sin romper registros legacy.
 * CatalogKind usa guiones bajos (contextos_exito) alineado al código existente.
 */
import type { CatalogKind, HallazgoCatalogItem } from "@/lib/catalogos/catalog-types";
import { CATALOGO_OTRO_ID } from "@/lib/catalogos/catalog-types";
import {
  CONDICIONES_PARTICIPACION_CATEGORIAS,
  getCondicionesParticipacionPorCategoria,
} from "@/lib/catalogos/condiciones-participacion-catalog";
import {
  CONTEXTOS_EXITO_CATEGORIAS,
  getContextosExitoPorCategoria,
} from "@/lib/catalogos/contextos-exito-catalog";
import {
  FORTALEZAS_CATEGORIAS,
  getFortalezasPorCategoria,
} from "@/lib/catalogos/fortalezas-catalog";
import {
  getInteresesPorCategoria,
  INTERESES_CATEGORIAS,
} from "@/lib/catalogos/intereses-catalog";
import type { HallazgoPerfil, HallazgoTipo } from "@/lib/perfil-hallazgos-storage";
import { normalizeHallazgoNombre } from "@/lib/perfil-hallazgos-storage";

/** Mapeo HallazgoTipo (perfil) → CatalogKind (catálogos institucionales). */
const HALLAZGO_TIPO_TO_CATALOG_KIND: Record<HallazgoTipo, CatalogKind> = {
  fortaleza: "fortalezas",
  interes: "intereses",
  contexto_exito: "contextos_exito",
  barrera: "condiciones_participacion",
};

const CATEGORIA_LABELS: Record<string, string> = {
  cognitivas_y_pensamiento: "Cognitivas y pensamiento",
  personales_y_caracter: "Personales y de carácter",
  sociales_y_emocionales: "Sociales y emocionales",
  creativas_y_expresivas: "Creativas y expresivas",
  tecnicas_y_practicas: "Técnicas y prácticas",
  ciencia_y_naturaleza: "Ciencia y naturaleza",
  tecnologia_y_construccion: "Tecnología y construcción",
  artes_y_expresion: "Artes y expresión",
  lenguaje_y_conocimiento: "Lenguaje y conocimiento",
  otros_intereses: "Otros intereses",
  ambiente_fisico_sensorial: "Ambiente físico y sensorial",
  organizacion_y_anticipacion: "Organización y anticipación",
  apoyos_para_la_tarea: "Apoyos para la tarea",
  relacional_y_emocional: "Relacional y emocional",
  metodologico: "Metodológico",
  barreras_sensoriales: "Sensoriales",
  barreras_organizacion_anticipacion: "Organización y anticipación",
  barreras_tarea_metodologia: "Tarea y metodología",
  barreras_sociales_comunicativas: "Sociales y comunicativas",
  barreras_emocionales_regulacion: "Emocionales y regulación",
  otro: "Otro",
};

const CATALOG_KIND_LABELS: Record<CatalogKind, string> = {
  fortalezas: "Fortalezas",
  intereses: "Intereses",
  contextos_exito: "Contextos de éxito",
  condiciones_participacion: "Condiciones de participación",
};

export function hallazgoTipoToCatalogKind(tipo: HallazgoTipo): CatalogKind {
  return HALLAZGO_TIPO_TO_CATALOG_KIND[tipo];
}

const HALLAZGO_BUSQUEDA_PLACEHOLDER: Record<HallazgoTipo, string> = {
  fortaleza: "Buscar fortaleza…",
  interes: "Buscar interés…",
  contexto_exito: "Buscar contexto…",
  barrera: "Buscar condición…",
};

export function getHallazgoBusquedaPlaceholder(tipo: HallazgoTipo): string {
  return HALLAZGO_BUSQUEDA_PLACEHOLDER[tipo];
}

export function getCatalogKindLabel(kind: CatalogKind): string {
  return CATALOG_KIND_LABELS[kind];
}

export function getCategoriasForCatalogKind(kind: CatalogKind): readonly string[] {
  switch (kind) {
    case "fortalezas":
      return FORTALEZAS_CATEGORIAS;
    case "intereses":
      return INTERESES_CATEGORIAS;
    case "contextos_exito":
      return CONTEXTOS_EXITO_CATEGORIAS;
    case "condiciones_participacion":
      return CONDICIONES_PARTICIPACION_CATEGORIAS;
  }
}

export function getCatalogItemsPorCategoria(
  kind: CatalogKind
): Record<string, HallazgoCatalogItem[]> {
  switch (kind) {
    case "fortalezas":
      return getFortalezasPorCategoria();
    case "intereses":
      return getInteresesPorCategoria();
    case "contextos_exito":
      return getContextosExitoPorCategoria();
    case "condiciones_participacion":
      return getCondicionesParticipacionPorCategoria();
  }
}

export function getCategoriaLabel(categoriaId: string): string {
  return CATEGORIA_LABELS[categoriaId] ?? categoriaId.replace(/_/g, " ");
}

export function getCategoriasNavegables(kind: CatalogKind): string[] {
  return getCategoriasForCatalogKind(kind).filter((categoria) => categoria !== "otro");
}

/**
 * Muestra la formulación original solo cuando difiere del nombre canónico.
 * Compatible con hallazgos legacy sin formulacionOriginal.
 */
export function getHallazgoFormulacionOriginalVisible(
  hallazgo: HallazgoPerfil
): string | null {
  const original = hallazgo.formulacionOriginal?.trim();
  if (!original) return null;

  const nombreNorm = normalizeHallazgoNombre(hallazgo.nombre).toLowerCase();
  const originalNorm = normalizeHallazgoNombre(original).toLowerCase();
  if (nombreNorm === originalNorm) return null;

  return original;
}
