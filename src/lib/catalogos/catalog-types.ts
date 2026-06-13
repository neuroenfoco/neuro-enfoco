export interface HallazgoCatalogItem {
  id: string;
  nombre: string;
  categoria: string;
}

export interface CondicionParticipacionCatalogItem extends HallazgoCatalogItem {
  /** Preparado para futuras recomendaciones automáticas de apoyos. */
  apoyosSugeridos?: string[];
}

export type CatalogKind =
  | "fortalezas"
  | "intereses"
  | "contextos_exito"
  | "condiciones_participacion";

export const CATALOGO_OTRO_ID = "otro";

export const CATALOGO_OTRO_NOMBRE = "Otro (especificar)";

export type CatalogCategoryGroup<T extends HallazgoCatalogItem> = Record<string, T[]>;

const catalogAccessors = new Map<
  CatalogKind,
  (id: string) => HallazgoCatalogItem | CondicionParticipacionCatalogItem | null
>();

export function registerCatalogAccessor(
  kind: CatalogKind,
  getById: (id: string) => HallazgoCatalogItem | CondicionParticipacionCatalogItem | null
): void {
  catalogAccessors.set(kind, getById);
}

export function groupByCategoria<T extends HallazgoCatalogItem>(
  items: readonly T[]
): CatalogCategoryGroup<T> {
  return items.reduce<CatalogCategoryGroup<T>>((groups, item) => {
    const current = groups[item.categoria] ?? [];
    groups[item.categoria] = [...current, item];
    return groups;
  }, {});
}

export function createCatalogModule<T extends HallazgoCatalogItem>(items: readonly T[]) {
  return {
    getCatalog: (): T[] => [...items],
    getPorCategoria: (): CatalogCategoryGroup<T> => groupByCategoria(items),
    getById: (id: string): T | null =>
      items.find((item) => item.id === id) ?? null,
  };
}

export function getItemById(
  catalog: CatalogKind,
  id: string
): HallazgoCatalogItem | CondicionParticipacionCatalogItem | null {
  return catalogAccessors.get(catalog)?.(id) ?? null;
}

export function slugifyCatalogId(prefix: string, nombre: string): string {
  const normalized = nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `${prefix}_${normalized}`;
}

export function buildCatalogItems(
  prefix: string,
  entries: ReadonlyArray<{ categoria: string; nombres: readonly string[] }>
): HallazgoCatalogItem[] {
  return entries.flatMap(({ categoria, nombres }) =>
    nombres.map((nombre) => ({
      id: slugifyCatalogId(prefix, nombre),
      nombre,
      categoria,
    }))
  );
}

export function withOtroItem<T extends HallazgoCatalogItem>(items: T[]): T[] {
  return [
    ...items,
    {
      id: CATALOGO_OTRO_ID,
      nombre: CATALOGO_OTRO_NOMBRE,
      categoria: "otro",
    } as T,
  ];
}
