import {
  buildCatalogItems,
  createCatalogModule,
  registerCatalogAccessor,
  withOtroItem,
  type CatalogCategoryGroup,
  type HallazgoCatalogItem,
} from "@/lib/catalogos/catalog-types";

const FORTALEZAS_ENTRIES = [
  {
    categoria: "cognitivas_y_pensamiento",
    nombres: [
      "Memoria excepcional (datos, fechas, detalles)",
      "Atención al detalle",
      "Pensamiento lógico y estructurado",
      "Reconocimiento de patrones",
      "Pensamiento visual",
      "Capacidad de concentración profunda (hiperfoco)",
      "Conocimiento experto en temas de interés",
      "Habilidad para clasificar y organizar",
      "Razonamiento matemático",
      "Lectura temprana / fluidez lectora",
      "Pensamiento secuencial",
      "Capacidad de observación",
      "Aprendizaje autodidacta",
    ],
  },
  {
    categoria: "personales_y_caracter",
    nombres: [
      "Honestidad y sinceridad",
      "Perseverancia y constancia",
      "Sentido de la justicia",
      "Lealtad",
      "Responsabilidad con sus rutinas y tareas",
      "Curiosidad e interés por aprender",
      "Autenticidad",
      "Capacidad de seguir reglas claras",
    ],
  },
  {
    categoria: "sociales_y_emocionales",
    nombres: [
      "Empatía y bondad",
      "Confiabilidad",
      "Cuidado por los animales o el entorno",
    ],
  },
  {
    categoria: "creativas_y_expresivas",
    nombres: [
      "Habilidad artística (dibujo, pintura)",
      "Habilidad musical",
      "Creatividad e imaginación",
      "Expresión a través del juego o construcción",
      "Narración de historias",
      "Diseño y creación de mundos",
    ],
  },
  {
    categoria: "tecnicas_y_practicas",
    nombres: [
      "Habilidad con tecnología y dispositivos",
      "Destreza en armado y construcción",
      "Habilidad manual / motricidad fina",
      "Facilidad con programación o robótica",
      "Resolución de problemas técnicos",
      "Orientación espacial",
    ],
  },
] as const;

export const FORTALEZAS_CATALOG_ITEMS: readonly HallazgoCatalogItem[] = withOtroItem(
  buildCatalogItems("fort", FORTALEZAS_ENTRIES)
);

const fortalezasModule = createCatalogModule(FORTALEZAS_CATALOG_ITEMS);

export const getFortalezasCatalog = fortalezasModule.getCatalog;
export const getFortalezasPorCategoria = fortalezasModule.getPorCategoria;
export const getFortalezaById = fortalezasModule.getById;

registerCatalogAccessor("fortalezas", getFortalezaById);

export const FORTALEZAS_CATEGORIAS = [
  "cognitivas_y_pensamiento",
  "personales_y_caracter",
  "sociales_y_emocionales",
  "creativas_y_expresivas",
  "tecnicas_y_practicas",
  "otro",
] as const;

export type FortalezasCategoria = (typeof FORTALEZAS_CATEGORIAS)[number];

export function getFortalezasPorCategoriaId(
  categoria: string
): HallazgoCatalogItem[] {
  const grouped: CatalogCategoryGroup<HallazgoCatalogItem> =
    getFortalezasPorCategoria();
  return grouped[categoria] ?? [];
}
