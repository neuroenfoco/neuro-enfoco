import {
  CATALOGO_OTRO_ID,
  type CatalogKind,
  type HallazgoCatalogItem,
} from "@/lib/catalogos/catalog-types";
import "@/lib/catalogos/index";
import { getContextosExitoCatalog } from "@/lib/catalogos/contextos-exito-catalog";
import { getCondicionesParticipacionCatalog } from "@/lib/catalogos/condiciones-participacion-catalog";
import { getFortalezasCatalog } from "@/lib/catalogos/fortalezas-catalog";
import { getInteresesCatalog } from "@/lib/catalogos/intereses-catalog";

/** Resultado de una sugerencia de consolidación (asistencia, no reemplazo). */
export type HallazgoNormalizacionSugerencia = {
  id: string;
  nombre: string;
  categoria: string;
  catalogo: CatalogKind;
  score: number;
};

export type BuscarCoincidenciasHallazgoOptions = {
  /** Si se omite, busca en los cuatro catálogos institucionales. */
  catalogo?: CatalogKind;
  /** Máximo de sugerencias devueltas. Por defecto 5. */
  maxResultados?: number;
  /** Umbral mínimo de score (0–1). Por defecto 0.55. */
  umbralMinimo?: number;
};

type CatalogoIndexado = {
  catalogo: CatalogKind;
  item: HallazgoCatalogItem;
  nombreNormalizado: string;
  tokens: string[];
  stems: string[];
};

const DEFAULT_MAX_RESULTADOS = 5;
const DEFAULT_UMBRAL_MINIMO = 0.55;

const STOPWORDS = new Set([
  "muy",
  "bastante",
  "gran",
  "excelente",
  "buena",
  "buen",
  "bueno",
  "alta",
  "alto",
  "fuerte",
  "gran",
  "demasiado",
  "poco",
  "algo",
  "una",
  "uno",
  "unos",
  "unas",
  "el",
  "la",
  "los",
  "las",
  "de",
  "del",
  "y",
  "en",
  "con",
  "por",
  "para",
  "su",
  "sus",
]);

/**
 * Raíces léxicas curadas para ampliar consultas cortas sin embeddings.
 * Solo cubre ambigüedades frecuentes en contexto escolar.
 */
const RAICES_SINONIMOS: Readonly<Record<string, readonly string[]>> = {
  art: ["arte", "artistica", "dibujo", "pintura", "manualidades", "teatro"],
  creativ: ["creativa", "creativo", "creatividad", "imaginacion", "imaginativa"],
  music: ["musica", "musical", "instrumento", "instrumentos"],
  tecnolog: ["tecnologia", "computacion", "videojuegos", "programacion", "robotica"],
  animal: ["animales", "dinosaurios", "insectos", "mascotas"],
};

const SPANISH_SUFFIXES = [
  "mente",
  "aciones",
  "acion",
  "ición",
  "icion",
  "idad",
  "amiento",
  "miento",
  "adora",
  "ador",
  "ivas",
  "ivos",
  "iva",
  "ivo",
  "tas",
  "tos",
  "tes",
  "es",
  "as",
  "os",
  "a",
  "o",
  "e",
] as const;

let catalogoIndexCache: CatalogoIndexado[] | null = null;

/** Normaliza texto para comparación: minúsculas, sin tildes, sin puntuación, espacios simples. */
export function normalizarTextoHallazgo(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Tokeniza incluyendo contenido entre paréntesis como términos adicionales. */
export function tokenizarTextoHallazgo(texto: string): string[] {
  const normalizado = normalizarTextoHallazgo(texto);
  if (!normalizado) return [];

  const tokens: string[] = [];
  const parentesis = /\(([^)]+)\)/g;
  let base = normalizado;

  for (const match of normalizado.matchAll(parentesis)) {
    const inner = match[1];
    if (inner) {
      tokens.push(
        ...inner
          .split(/[,;/]/)
          .map((part) => part.trim())
          .filter(Boolean)
      );
    }
    base = base.replace(match[0], " ");
  }

  tokens.push(
    ...base
      .split(/\s+/)
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
  );

  return [...new Set(tokens)];
}

/** Raíz léxica aproximada en español para tolerar variaciones morfológicas. */
export function obtenerRaizLexica(palabra: string): string {
  let raiz = normalizarTextoHallazgo(palabra);
  if (raiz.length <= 3) return raiz;

  for (const sufijo of SPANISH_SUFFIXES) {
    if (raiz.length > sufijo.length + 3 && raiz.endsWith(sufijo)) {
      raiz = raiz.slice(0, -sufijo.length);
      break;
    }
  }

  return raiz;
}

function esStopword(token: string): boolean {
  return STOPWORDS.has(token);
}

function expandirTokensConsulta(tokens: string[]): string[] {
  const expandidos = new Set<string>();

  for (const token of tokens) {
    expandidos.add(token);
    const raiz = obtenerRaizLexica(token);
    if (raiz.length >= 3) {
      expandidos.add(raiz);
      const sinonimos = RAICES_SINONIMOS[raiz];
      if (sinonimos) {
        for (const sinonimo of sinonimos) {
          expandidos.add(sinonimo);
          expandidos.add(obtenerRaizLexica(sinonimo));
        }
      }
    }
  }

  return [...expandidos].filter((token) => token.length >= 2);
}

function diceCoefficient(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;

  const bigramsA = new Map<string, number>();
  for (let i = 0; i < a.length - 1; i += 1) {
    const bigram = a.slice(i, i + 2);
    bigramsA.set(bigram, (bigramsA.get(bigram) ?? 0) + 1);
  }

  let intersection = 0;
  for (let i = 0; i < b.length - 1; i += 1) {
    const bigram = b.slice(i, i + 2);
    const count = bigramsA.get(bigram) ?? 0;
    if (count > 0) {
      intersection += 1;
      bigramsA.set(bigram, count - 1);
    }
  }

  return (2 * intersection) / (a.length - 1 + (b.length - 1));
}

function prefijoCompartido(a: string, b: string): number {
  const limite = Math.min(a.length, b.length);
  let longitud = 0;
  for (let i = 0; i < limite; i += 1) {
    if (a[i] !== b[i]) break;
    longitud += 1;
  }
  return longitud;
}

function puntuarTokenContraToken(
  consulta: string,
  candidato: string,
  viaSinonimo: boolean
): number {
  if (!consulta || !candidato) return 0;
  if (consulta === candidato) return viaSinonimo ? 0.88 : 0.98;

  const raizConsulta = obtenerRaizLexica(consulta);
  const raizCandidato = obtenerRaizLexica(candidato);

  if (raizConsulta.length >= 4 && raizConsulta === raizCandidato) {
    return viaSinonimo ? 0.84 : 0.94;
  }

  if (raizConsulta.length >= 4 && raizCandidato.startsWith(raizConsulta)) {
    return viaSinonimo ? 0.8 : 0.9;
  }

  if (raizCandidato.length >= 4 && raizConsulta.startsWith(raizCandidato)) {
    return viaSinonimo ? 0.76 : 0.86;
  }

  const prefijo = prefijoCompartido(raizConsulta, raizCandidato);
  if (prefijo >= 4) {
    const base = 0.68 + prefijo / Math.max(raizConsulta.length, raizCandidato.length) * 0.2;
    return viaSinonimo ? base * 0.92 : base;
  }

  if (consulta.length >= 4 && candidato.includes(consulta)) {
    return viaSinonimo ? 0.72 : 0.82;
  }

  return 0;
}

function puntuarConsultaContraItem(
  consultaNormalizada: string,
  tokensConsulta: string[],
  item: CatalogoIndexado
): number {
  if (!consultaNormalizada) return 0;

  if (consultaNormalizada === item.nombreNormalizado) {
    return 1;
  }

  let mejor = 0;

  if (
    consultaNormalizada.length >= 4 &&
    item.nombreNormalizado.includes(consultaNormalizada)
  ) {
    mejor = Math.max(
      mejor,
      0.86 + (consultaNormalizada.length / item.nombreNormalizado.length) * 0.1
    );
  }

  const tokensOriginales = tokensConsulta.filter((token) => !esStopword(token));
  const tokensExpandidos = expandirTokensConsulta(tokensOriginales);
  const tokensSinonimo = new Set(
    expandirTokensConsulta(tokensOriginales).filter(
      (token) => !tokensOriginales.includes(token)
    )
  );

  for (const tokenConsulta of tokensExpandidos) {
    const viaSinonimo = tokensSinonimo.has(tokenConsulta);

    for (let i = 0; i < item.tokens.length; i += 1) {
      const tokenCandidato = item.tokens[i];
      const stemCandidato = item.stems[i];
      const tokenScore = puntuarTokenContraToken(
        tokenConsulta,
        tokenCandidato,
        viaSinonimo
      );
      const stemScore = puntuarTokenContraToken(
        tokenConsulta,
        stemCandidato,
        viaSinonimo
      );
      mejor = Math.max(mejor, tokenScore, stemScore);
    }
  }

  const dice = diceCoefficient(consultaNormalizada, item.nombreNormalizado);
  if (dice >= 0.45) {
    mejor = Math.max(mejor, dice * 0.82);
  }

  return Math.min(mejor, 1);
}

function debeOmitirItem(item: HallazgoCatalogItem, consultaNormalizada: string): boolean {
  if (item.id !== CATALOGO_OTRO_ID) return false;

  const consultaOtros = new Set(["otro", "otra", "otros", "especificar", "especifica"]);
  return !consultaOtros.has(consultaNormalizada);
}

function obtenerCatalogoPorTipo(catalogo: CatalogKind): HallazgoCatalogItem[] {
  switch (catalogo) {
    case "fortalezas":
      return getFortalezasCatalog();
    case "intereses":
      return getInteresesCatalog();
    case "contextos_exito":
      return getContextosExitoCatalog();
    case "condiciones_participacion":
      return getCondicionesParticipacionCatalog();
    default:
      return [];
  }
}

function construirIndiceCatalogos(catalogo?: CatalogKind): CatalogoIndexado[] {
  const catalogos: CatalogKind[] = catalogo
    ? [catalogo]
    : ["fortalezas", "intereses", "contextos_exito", "condiciones_participacion"];

  return catalogos.flatMap((tipo) =>
    obtenerCatalogoPorTipo(tipo).map((item) => {
      const tokens = tokenizarTextoHallazgo(item.nombre);
      return {
        catalogo: tipo,
        item,
        nombreNormalizado: normalizarTextoHallazgo(item.nombre),
        tokens,
        stems: tokens.map((token) => obtenerRaizLexica(token)),
      };
    })
  );
}

function getCatalogoIndex(catalogo?: CatalogKind): CatalogoIndexado[] {
  if (!catalogo) {
    if (!catalogoIndexCache) {
      catalogoIndexCache = construirIndiceCatalogos();
    }
    return catalogoIndexCache;
  }

  return construirIndiceCatalogos(catalogo);
}

/**
 * Busca coincidencias aproximadas en catálogos institucionales.
 * Asiste al profesional; no modifica ni reemplaza registros existentes.
 */
export function buscarCoincidenciasHallazgo(
  texto: string,
  options: BuscarCoincidenciasHallazgoOptions = {}
): HallazgoNormalizacionSugerencia[] {
  const consultaNormalizada = normalizarTextoHallazgo(texto);
  if (consultaNormalizada.length < 2) return [];

  const maxResultados = options.maxResultados ?? DEFAULT_MAX_RESULTADOS;
  const umbralMinimo = options.umbralMinimo ?? DEFAULT_UMBRAL_MINIMO;
  const tokensConsulta = tokenizarTextoHallazgo(texto).filter(
    (token) => !esStopword(token)
  );

  if (tokensConsulta.length === 0 && consultaNormalizada.length < 3) {
    return [];
  }

  const indice = getCatalogoIndex(options.catalogo);
  const resultados: HallazgoNormalizacionSugerencia[] = [];

  for (const entrada of indice) {
    if (debeOmitirItem(entrada.item, consultaNormalizada)) continue;

    const score = puntuarConsultaContraItem(
      consultaNormalizada,
      tokensConsulta.length > 0 ? tokensConsulta : [consultaNormalizada],
      entrada
    );

    if (score < umbralMinimo) continue;

    resultados.push({
      id: entrada.item.id,
      nombre: entrada.item.nombre,
      categoria: entrada.item.categoria,
      catalogo: entrada.catalogo,
      score: Math.round(score * 100) / 100,
    });
  }

  return resultados
    .sort((a, b) => b.score - a.score)
    .filter(
      (sugerencia, index, lista) =>
        lista.findIndex((item) => item.id === sugerencia.id) === index
    )
    .slice(0, maxResultados);
}

/** Invalida el índice en memoria (útil si los catálogos cambian en runtime). */
export function invalidarIndiceNormalizacionHallazgos(): void {
  catalogoIndexCache = null;
}

export function getCatalogosDisponiblesParaNormalizacion(): CatalogKind[] {
  return ["fortalezas", "intereses", "contextos_exito", "condiciones_participacion"];
}
