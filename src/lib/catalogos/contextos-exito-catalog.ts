import {
  buildCatalogItems,
  createCatalogModule,
  registerCatalogAccessor,
  withOtroItem,
  type CatalogCategoryGroup,
  type HallazgoCatalogItem,
} from "@/lib/catalogos/catalog-types";

const CONTEXTOS_EXITO_ENTRIES = [
  {
    categoria: "ambiente_fisico_sensorial",
    nombres: [
      "Espacios tranquilos y con poco ruido",
      "Iluminación suave o natural",
      "Lugar fijo y predecible dentro de la sala",
      "Acceso a un rincón de calma o regulación",
      "Ambiente ordenado y con pocos distractores",
      "Posibilidad de moverse o cambiar de postura",
    ],
  },
  {
    categoria: "organizacion_y_anticipacion",
    nombres: [
      "Rutinas claras y predecibles",
      "Anticipación de los cambios con tiempo",
      "Uso de agendas o apoyos visuales",
      "Instrucciones paso a paso",
      "Tiempos de transición avisados con antelación",
    ],
  },
  {
    categoria: "apoyos_para_la_tarea",
    nombres: [
      "Consignas cortas y concretas",
      "Apoyo visual (pictogramas, esquemas, imágenes)",
      "Ejemplos o modelos a seguir",
      "Tiempo adicional para responder",
      "Fragmentación de tareas en pasos pequeños",
      "Material concreto o manipulable",
    ],
  },
  {
    categoria: "relacional_y_emocional",
    nombres: [
      "Vínculo con un adulto de confianza",
      "Trabajo individual o en parejas",
      "Refuerzo positivo frecuente",
      "Validación de sus emociones",
      "Trabajo a partir de sus intereses",
    ],
  },
  {
    categoria: "metodologico",
    nombres: [
      "Aprendizaje a través del juego",
      "Actividades con un objetivo claro",
      "Uso de tecnología o recursos digitales",
      "Aprendizaje práctico y experiencial",
      "Opciones para elegir cómo realizar la tarea",
    ],
  },
] as const;

export const CONTEXTOS_EXITO_CATALOG_ITEMS: readonly HallazgoCatalogItem[] =
  withOtroItem(buildCatalogItems("ctx", CONTEXTOS_EXITO_ENTRIES));

const contextosModule = createCatalogModule(CONTEXTOS_EXITO_CATALOG_ITEMS);

export const getContextosExitoCatalog = contextosModule.getCatalog;
export const getContextosExitoPorCategoria = contextosModule.getPorCategoria;
export const getContextoExitoById = contextosModule.getById;

registerCatalogAccessor("contextos_exito", getContextoExitoById);

export const CONTEXTOS_EXITO_CATEGORIAS = [
  "ambiente_fisico_sensorial",
  "organizacion_y_anticipacion",
  "apoyos_para_la_tarea",
  "relacional_y_emocional",
  "metodologico",
  "otro",
] as const;

export type ContextosExitoCategoria = (typeof CONTEXTOS_EXITO_CATEGORIAS)[number];

export function getContextosExitoPorCategoriaId(
  categoria: string
): HallazgoCatalogItem[] {
  const grouped: CatalogCategoryGroup<HallazgoCatalogItem> =
    getContextosExitoPorCategoria();
  return grouped[categoria] ?? [];
}
