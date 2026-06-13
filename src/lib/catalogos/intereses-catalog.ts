import {
  buildCatalogItems,
  createCatalogModule,
  registerCatalogAccessor,
  withOtroItem,
  type CatalogCategoryGroup,
  type HallazgoCatalogItem,
} from "@/lib/catalogos/catalog-types";

const INTERESES_ENTRIES = [
  {
    categoria: "ciencia_y_naturaleza",
    nombres: [
      "Animales (dinosaurios, insectos, mascotas)",
      "Espacio y astronomía",
      "Plantas y medio ambiente",
      "Fenómenos naturales y clima",
      "Cuerpo humano y biología",
      "Experimentos y química",
      "Volcanes y geología",
    ],
  },
  {
    categoria: "tecnologia_y_construccion",
    nombres: [
      "Computación y videojuegos",
      "Robótica y programación",
      "Lego, bloques y mecanismos",
      "Vehículos y transporte (trenes, autos, aviones)",
      "Electrónica",
    ],
  },
  {
    categoria: "artes_y_expresion",
    nombres: [
      "Dibujo y pintura",
      "Música e instrumentos",
      "Danza y movimiento",
      "Teatro y actuación",
      "Manualidades",
    ],
  },
  {
    categoria: "lenguaje_y_conocimiento",
    nombres: [
      "Lectura y libros",
      "Geografía, mapas y banderas",
      "Historia",
      "Idiomas",
      "Números y matemáticas",
      "Calendarios y fechas",
    ],
  },
  {
    categoria: "otros_intereses",
    nombres: [
      "Deportes",
      "Cocina",
      "Coleccionar objetos",
      "Personajes de películas o series",
      "Juegos de mesa y estrategia",
    ],
  },
] as const;

export const INTERESES_CATALOG_ITEMS: readonly HallazgoCatalogItem[] = withOtroItem(
  buildCatalogItems("int", INTERESES_ENTRIES)
);

const interesesModule = createCatalogModule(INTERESES_CATALOG_ITEMS);

export const getInteresesCatalog = interesesModule.getCatalog;
export const getInteresesPorCategoria = interesesModule.getPorCategoria;
export const getInteresById = interesesModule.getById;

registerCatalogAccessor("intereses", getInteresById);

export const INTERESES_CATEGORIAS = [
  "ciencia_y_naturaleza",
  "tecnologia_y_construccion",
  "artes_y_expresion",
  "lenguaje_y_conocimiento",
  "otros_intereses",
  "otro",
] as const;

export type InteresesCategoria = (typeof INTERESES_CATEGORIAS)[number];

export function getInteresesPorCategoriaId(
  categoria: string
): HallazgoCatalogItem[] {
  const grouped: CatalogCategoryGroup<HallazgoCatalogItem> =
    getInteresesPorCategoria();
  return grouped[categoria] ?? [];
}
