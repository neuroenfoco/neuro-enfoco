/** Identificador de entidad persistida. */
export type EntityId = string;

/**
 * Contrato base para repositorios locales (síncronos).
 * Las implementaciones Supabase extenderán estos contratos vía async-ready.
 */
export interface SyncRepository<TEntity, TSaveInput, TUpdateInput = never> {
  getAll(): TEntity[];
  getById(id: EntityId): TEntity | null;
  save(input: TSaveInput): TEntity | null;
  delete(id: EntityId): boolean;
  update?(id: EntityId, input: TUpdateInput): TEntity | null;
}

/** Marca repositorios que delegan al stack localStorage actual. */
export type LocalRepositoryImplementation = "local";
