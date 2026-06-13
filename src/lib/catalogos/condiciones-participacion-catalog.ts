import {
  buildCatalogItems,
  createCatalogModule,
  registerCatalogAccessor,
  withOtroItem,
  type CatalogCategoryGroup,
  type CondicionParticipacionCatalogItem,
} from "@/lib/catalogos/catalog-types";
import { getApoyosSugeridosPorCondicionNombre } from "@/lib/condiciones-apoyos-sugeridos-map";

const CONDICIONES_PARTICIPACION_ENTRIES = [
  {
    categoria: "barreras_sensoriales",
    nombres: [
      "Ruidos fuertes o inesperados",
      "Espacios muy concurridos o bulliciosos",
      "Iluminación intensa o parpadeante",
      "Olores, texturas o estímulos intensos",
      "Exceso de información visual en el entorno",
    ],
  },
  {
    categoria: "barreras_organizacion_anticipacion",
    nombres: [
      "Cambios imprevistos en la rutina",
      "Falta de estructura o instrucciones poco claras",
      "Transiciones bruscas entre actividades",
      "Imprevistos sin anticipación",
      "Cambios de espacio o de adulto a cargo",
    ],
  },
  {
    categoria: "barreras_tarea_metodologia",
    nombres: [
      "Consignas largas o ambiguas",
      "Tiempos de respuesta muy acotados",
      "Tareas extensas sin pausas",
      "Exceso de demandas simultáneas",
      "Actividades sin propósito claro para el estudiante",
      "Falta de apoyos visuales o concretos",
    ],
  },
  {
    categoria: "barreras_sociales_comunicativas",
    nombres: [
      "Actividades grupales numerosas",
      "Situaciones sociales no estructuradas (recreos, trabajos libres)",
      "Expectativa de contacto visual o cercanía física",
      "Lenguaje figurado, ironías o dobles sentidos",
      "Presión por participar de forma oral o pública",
    ],
  },
  {
    categoria: "barreras_emocionales_regulacion",
    nombres: [
      "Situaciones de estrés o frustración sin apoyo",
      "Falta de espacios o tiempos para autorregularse",
      "Demandas en momentos de desregulación",
      "Ambientes con tensión o conflicto",
    ],
  },
] as const;

export const CONDICIONES_PARTICIPACION_CATALOG_ITEMS: readonly CondicionParticipacionCatalogItem[] =
  withOtroItem(
    buildCatalogItems("cond", CONDICIONES_PARTICIPACION_ENTRIES).map(
      (item) => ({
        ...item,
        apoyosSugeridos: [
          ...getApoyosSugeridosPorCondicionNombre(item.nombre),
        ],
      })
    )
  );

const condicionesModule = createCatalogModule(CONDICIONES_PARTICIPACION_CATALOG_ITEMS);

export const getCondicionesParticipacionCatalog = condicionesModule.getCatalog;
export const getCondicionesParticipacionPorCategoria =
  condicionesModule.getPorCategoria;
export const getCondicionParticipacionById = condicionesModule.getById;

registerCatalogAccessor(
  "condiciones_participacion",
  getCondicionParticipacionById
);

export const CONDICIONES_PARTICIPACION_CATEGORIAS = [
  "barreras_sensoriales",
  "barreras_organizacion_anticipacion",
  "barreras_tarea_metodologia",
  "barreras_sociales_comunicativas",
  "barreras_emocionales_regulacion",
  "otro",
] as const;

export type CondicionesParticipacionCategoria =
  (typeof CONDICIONES_PARTICIPACION_CATEGORIAS)[number];

export function getCondicionesParticipacionPorCategoriaId(
  categoria: string
): CondicionParticipacionCatalogItem[] {
  const grouped: CatalogCategoryGroup<CondicionParticipacionCatalogItem> =
    getCondicionesParticipacionPorCategoria();
  return grouped[categoria] ?? [];
}
