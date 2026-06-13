/**
 * Auditoría read-only de calidad HallazgoPerfil.
 * Uso: npx tsx scripts/auditar-hallazgos-calidad.ts [ruta-export-json]
 *
 * El JSON opcional debe ser el array de localStorage "neuro-enfoco-perfil-hallazgos".
 */
import { readFileSync } from "node:fs";
import { getCondicionesParticipacionCatalog } from "../src/lib/catalogos/condiciones-participacion-catalog";
import { getContextosExitoCatalog } from "../src/lib/catalogos/contextos-exito-catalog";
import { getFortalezasCatalog } from "../src/lib/catalogos/fortalezas-catalog";
import { getInteresesCatalog } from "../src/lib/catalogos/intereses-catalog";
import type { CatalogKind } from "../src/lib/catalogos/catalog-types";
import { hallazgoTipoToCatalogKind } from "../src/lib/hallazgo-catalogo-utils";
import {
  buscarCoincidenciasHallazgo,
  normalizarTextoHallazgo,
} from "../src/lib/hallazgos-normalizacion";
import type { HallazgoPerfil, HallazgoTipo } from "../src/lib/perfil-hallazgos-storage";
import {
  BARRERA_OPTIONS,
  CONTEXTO_EXITO_OPTIONS,
  FORTALEZA_OPTIONS,
  INTERES_OPTIONS,
} from "../src/lib/sessions-storage";

type FlagCalidad =
  | "nombre_menor_4"
  | "repeticion_caracteres"
  | "solo_numeros"
  | "sin_palabras_reconocibles"
  | "posible_duplicado_catalogo"
  | "sin_observaciones";

type HallazgoSospechoso = {
  id: string;
  nombre: string;
  tipo: HallazgoTipo;
  estudianteId: string;
  flags: FlagCalidad[];
  detalle?: string;
};

type ParDuplicado = {
  estudianteId: string;
  tipo: HallazgoTipo;
  nombres: string[];
  clave: string;
};

const TIPO_TO_LEGACY: Record<HallazgoTipo, readonly string[]> = {
  fortaleza: FORTALEZA_OPTIONS,
  interes: INTERES_OPTIONS,
  barrera: BARRERA_OPTIONS,
  contexto_exito: CONTEXTO_EXITO_OPTIONS,
};

function catalogoPorTipo(tipo: HallazgoTipo) {
  const kind = hallazgoTipoToCatalogKind(tipo);
  switch (kind) {
    case "fortalezas":
      return getFortalezasCatalog();
    case "intereses":
      return getInteresesCatalog();
    case "contextos_exito":
      return getContextosExitoCatalog();
    case "condiciones_participacion":
      return getCondicionesParticipacionCatalog();
  }
}

function tieneRepeticionCaracteres(texto: string): boolean {
  const compacto = texto.replace(/\s+/g, "");
  if (/(.)\1{2,}/i.test(compacto)) return true;

  const n = compacto.toLowerCase();
  if (n.length < 4) return false;

  for (let periodo = 1; periodo <= 3; periodo += 1) {
    if (n.length < periodo * 2) continue;
    const patron = n.slice(0, periodo);
    let repite = true;
    for (let i = periodo; i < n.length; i += periodo) {
      if (n.slice(i, i + periodo) !== patron.slice(0, n.slice(i, i + periodo).length)) {
        repite = false;
        break;
      }
    }
    if (repite && n.length >= periodo * 2) return true;
  }

  return false;
}

function esSoloNumeros(texto: string): boolean {
  return /^\d+$/.test(texto.trim());
}

function sinPalabrasReconocibles(texto: string): boolean {
  const norm = normalizarTextoHallazgo(texto);
  if (!norm) return true;

  const tokens = norm.split(/\s+/).filter(Boolean);
  const tieneEspacios = tokens.length > 1;
  const tieneVocal = /[aeiou]/.test(norm);

  if (!tieneEspacios && norm.length >= 4 && !tieneVocal) return true;
  if (!tieneEspacios && /^[bcdfghjklmnpqrstvwxyz]{4,}$/i.test(norm)) return true;

  const palabraUnica = tokens.length === 1 ? tokens[0] : null;
  if (palabraUnica && palabraUnica.length >= 4 && !tieneVocal) return true;

  return false;
}

function evaluarHallazgo(h: HallazgoPerfil): HallazgoSospechoso | null {
  const flags: FlagCalidad[] = [];
  const detalles: string[] = [];
  const nombre = h.nombre.trim();

  if (nombre.length < 4) flags.push("nombre_menor_4");
  if (tieneRepeticionCaracteres(nombre)) flags.push("repeticion_caracteres");
  if (esSoloNumeros(nombre)) flags.push("solo_numeros");
  if (sinPalabrasReconocibles(nombre)) flags.push("sin_palabras_reconocibles");
  if (h.totalObservaciones === 0) flags.push("sin_observaciones");

  const kind = hallazgoTipoToCatalogKind(h.tipo);
  const coincidencias = buscarCoincidenciasHallazgo(nombre, {
    catalogo: kind,
    maxResultados: 1,
    umbralMinimo: 0.92,
  });

  if (
    coincidencias.length > 0 &&
    (!h.catalogoId || h.catalogoId !== coincidencias[0].id)
  ) {
    flags.push("posible_duplicado_catalogo");
    detalles.push(
      `Coincide con catálogo «${coincidencias[0].nombre}» (score ${coincidencias[0].score}) sin catalogoId vinculado`
    );
  }

  if (flags.length === 0) return null;

  return {
    id: h.id,
    nombre: h.nombre,
    tipo: h.tipo,
    estudianteId: h.estudianteId,
    flags,
    detalle: detalles.join("; ") || undefined,
  };
}

function detectarDuplicadosNormalizados(
  hallazgos: HallazgoPerfil[]
): ParDuplicado[] {
  const grupos = new Map<string, HallazgoPerfil[]>();

  for (const h of hallazgos) {
    const clave = `${h.estudianteId}::${h.tipo}::${normalizarTextoHallazgo(h.nombre)}`;
    const lista = grupos.get(clave) ?? [];
    lista.push(h);
    grupos.set(clave, lista);
  }

  return [...grupos.entries()]
    .filter(([, lista]) => lista.length > 1)
    .map(([clave, lista]) => ({
      clave,
      estudianteId: lista[0].estudianteId,
      tipo: lista[0].tipo,
      nombres: lista.map((item) => item.nombre),
    }));
}

function construirCorpusLegacySimulado(estudianteId: string): HallazgoPerfil[] {
  const ahora = new Date().toISOString();
  const items: HallazgoPerfil[] = [];
  let i = 0;

  const tipos: HallazgoTipo[] = [
    "fortaleza",
    "interes",
    "barrera",
    "contexto_exito",
  ];

  for (const tipo of tipos) {
    for (const nombre of TIPO_TO_LEGACY[tipo]) {
      i += 1;
      items.push({
        id: `legacy-sim-${i}`,
        estudianteId,
        tipo,
        nombre,
        origen: "intervencion",
        totalObservaciones: 1,
        primeraObservacionEn: ahora,
        ultimaObservacionEn: ahora,
        creadoEn: ahora,
        actualizadoEn: ahora,
      });
    }
  }

  return items;
}

function construirCorpusCatalogoSimulado(estudianteId: string): HallazgoPerfil[] {
  const ahora = new Date().toISOString();
  const items: HallazgoPerfil[] = [];
  let i = 0;

  const map: { tipo: HallazgoTipo; kind: CatalogKind }[] = [
    { tipo: "fortaleza", kind: "fortalezas" },
    { tipo: "interes", kind: "intereses" },
    { tipo: "contexto_exito", kind: "contextos_exito" },
    { tipo: "barrera", kind: "condiciones_participacion" },
  ];

  for (const entry of map) {
    const catalogo = catalogoPorTipo(entry.tipo);
    for (const item of catalogo) {
      i += 1;
      items.push({
        id: `cat-sim-${entry.tipo}-${i}`,
        estudianteId,
        tipo: entry.tipo,
        nombre: item.nombre,
        origen: "perfil_base",
        catalogoKind: entry.kind,
        catalogoId: item.id,
        totalObservaciones: 0,
        primeraObservacionEn: null,
        ultimaObservacionEn: null,
        creadoEn: ahora,
        actualizadoEn: ahora,
      });
    }
  }

  return items;
}

function cargarHallazgosExportados(ruta?: string): HallazgoPerfil[] {
  if (!ruta) return [];
  const raw = readFileSync(ruta, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed as HallazgoPerfil[];
}

function auditar(hallazgos: HallazgoPerfil[], etiqueta: string) {
  const sospechosos = hallazgos
    .map(evaluarHallazgo)
    .filter((item): item is HallazgoSospechoso => item !== null);

  const duplicados = detectarDuplicadosNormalizados(hallazgos);
  const sinObservaciones = hallazgos.filter((h) => h.totalObservaciones === 0);

  return {
    etiqueta,
    total: hallazgos.length,
    sospechosos,
    duplicados,
    sinObservaciones: sinObservaciones.length,
    sinObservacionesLista: sinObservaciones.map((h) => ({
      id: h.id,
      nombre: h.nombre,
      tipo: h.tipo,
      origen: h.origen,
    })),
  };
}

const exportPath = process.argv[2];
const exportados = cargarHallazgosExportados(exportPath);
const legacySim = construirCorpusLegacySimulado("martina");
const catalogoSim = construirCorpusCatalogoSimulado("martina");

const resultados = [
  auditar(exportados, exportPath ? `Export localStorage (${exportPath})` : "localStorage (sin export — 0 registros)"),
  auditar(legacySim, "Corpus legacy sesión (FORTALEZA/INTERES/BARRERA/CONTEXTO_OPTIONS)"),
  auditar(catalogoSim, "Corpus catálogo institucional (simulado Perfil Base)"),
];

console.log(JSON.stringify({ generadoEn: new Date().toISOString(), resultados }, null, 2));
