import { CATALOGO_OTRO_ID } from "@/lib/catalogos/catalog-types";
import { getCondicionParticipacionById } from "@/lib/catalogos/condiciones-participacion-catalog";
import {
  getApoyosSugeridosPorCondicionNombre,
} from "@/lib/condiciones-apoyos-sugeridos-map";
import {
  inferCondicionesFromBarreraDetectada,
} from "@/lib/objetivo-condiciones-participacion";
import { getHallazgosConsolidadosPerfilBase } from "@/lib/perfil-hallazgos-storage";
import {
  getApoyoSesionNombre,
  type ApoyoSesionId,
} from "@/lib/sesiones-form-catalog";

export type CondicionPerfilSugerida = {
  catalogoId: string;
  nombre: string;
  hallazgoId: string;
};

export type ApoyoSugeridoPlanificacion = {
  id: ApoyoSesionId;
  nombre: string;
  /** Nombres de condiciones que motivan la sugerencia. */
  condicionesOrigen: string[];
};

function resolverCatalogoIdDesdeHallazgo(
  catalogoId: string | undefined,
  nombre: string
): string | null {
  if (catalogoId && catalogoId !== CATALOGO_OTRO_ID) {
    return getCondicionParticipacionById(catalogoId) ? catalogoId : null;
  }

  const inferred = inferCondicionesFromBarreraDetectada(nombre);
  const firstId = inferred.condicionesParticipacionIds[0];
  if (!firstId || firstId === CATALOGO_OTRO_ID) return null;
  return getCondicionParticipacionById(firstId) ? firstId : null;
}

/** Condiciones documentadas en Perfil Base, listas para vincular al objetivo. */
export function getCondicionesSugeridasDesdePerfilBase(
  estudianteId: string
): CondicionPerfilSugerida[] {
  if (!estudianteId.trim()) return [];

  const hallazgos = getHallazgosConsolidadosPerfilBase(estudianteId, "barrera");
  const seen = new Set<string>();
  const result: CondicionPerfilSugerida[] = [];

  for (const hallazgo of hallazgos) {
    const catalogoId = resolverCatalogoIdDesdeHallazgo(
      hallazgo.catalogoId,
      hallazgo.nombre
    );
    if (!catalogoId || seen.has(catalogoId)) continue;

    const item = getCondicionParticipacionById(catalogoId);
    if (!item) continue;

    seen.add(catalogoId);
    result.push({
      catalogoId,
      nombre: item.nombre,
      hallazgoId: hallazgo.id,
    });
  }

  return result;
}

/** Apoyos sugeridos según condiciones seleccionadas en el objetivo. */
export function getApoyosSugeridosParaCondiciones(
  condicionIds: string[]
): ApoyoSugeridoPlanificacion[] {
  const apoyosPorId = new Map<ApoyoSesionId, Set<string>>();

  for (const condicionId of condicionIds) {
    if (condicionId === CATALOGO_OTRO_ID) continue;

    const condicion = getCondicionParticipacionById(condicionId);
    if (!condicion) continue;

    const apoyoIds =
      condicion.apoyosSugeridos?.length
        ? (condicion.apoyosSugeridos as ApoyoSesionId[])
        : [...getApoyosSugeridosPorCondicionNombre(condicion.nombre)];

    for (const apoyoId of apoyoIds) {
      const origenes = apoyosPorId.get(apoyoId) ?? new Set<string>();
      origenes.add(condicion.nombre);
      apoyosPorId.set(apoyoId, origenes);
    }
  }

  return [...apoyosPorId.entries()]
    .map(([id, origenes]) => ({
      id,
      nombre: getApoyoSesionNombre(id),
      condicionesOrigen: [...origenes].sort((a, b) => a.localeCompare(b, "es")),
    }))
    .sort(
      (left, right) =>
        left.nombre.localeCompare(right.nombre, "es") ||
        right.condicionesOrigen.length - left.condicionesOrigen.length
    );
}
