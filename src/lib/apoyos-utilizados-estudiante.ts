/**
 * Uso del apoyo por estudiante — agregación desde evidencias (Sesion).
 *
 * **Pregunta que responde:** «¿Qué apoyos del catálogo ha utilizado o documentado
 * el equipo en intervenciones de este estudiante?»
 *
 * ## Capas semánticas (A18.5)
 *
 * | Capa | Entidad / campo | Rol |
 * |------|-----------------|-----|
 * | **Uso del apoyo (canónico)** | `Sesion.apoyosUtilizados` | IDs del catálogo ApoyoSesionId al registrar evidencia |
 * | **Estrategia que ayudó (legacy)** | `Sesion.estrategiasQueAyudaron` | Espejo textual; se resuelve al mismo catálogo cuando es posible |
 * | **Apoyo planificado** | `ObjetivoPIE.apoyosPlanificadosIds` | Intención pedagógica; no es uso documentado (fuera de este módulo) |
 * | **Apoyo institucional** | `ApoyoPIE` | ¿Qué apoyo implementamos? Distinto del uso en cada intervención |
 * | **Espejo en intervención** | `Intervencion.apoyosUtilizados` | Labels denormalizados al guardar; fallback si no hay evidencia |
 * | **ApoyoImplementado (legacy)** | `pie-apoyos-storage` | Período administrativo opcional; distinto de ApoyoPIE |
 *
 * **Fuente efectiva de verdad para «¿qué apoyo utilizamos hoy?»:**
 * evidencia (`Sesion`) resuelta con `resolverApoyosDesdeSesion` (IDs + legacy unificados).
 */

import { resolverApoyosDesdeSesion } from "@/lib/apoyos-consolidados-objetivo";
import { getIntervencionById } from "@/lib/intervenciones-storage";
import {
  getHallazgoById,
  getObservacionesByEvidenciaId,
} from "@/lib/perfil-hallazgos-storage";
import { getSesionesByEstudianteId } from "@/lib/sessions-storage";

export type ApoyoUtilizadoUso = {
  id: string;
  nombre: string;
  cantidad: number;
};

export type ApoyoUtilizadoAgregado = {
  id: string;
  nombre: string;
  /** Veces documentado en evidencias (una por sesión con el apoyo). */
  cantidad: number;
  intervencionIds: string[];
  evidenciaIds: string[];
  objetivoIds: string[];
  /** Condiciones de participación (hallazgos tipo barrera) co-ocurrentes en la misma evidencia. */
  condicionHallazgoIds: string[];
};

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}

function resolverObjetivoIdsDeSesion(
  intervencionId: string,
  objetivosTrabajadosIds: string[] | undefined
): string[] {
  const intervencion = getIntervencionById(intervencionId);
  const desdeIntervencion = intervencion?.objetivosRelacionados ?? [];
  const desdeEvidencia = objetivosTrabajadosIds ?? [];
  return uniqueStrings(
    desdeIntervencion.length > 0 ? desdeIntervencion : desdeEvidencia
  );
}

function resolverCondicionHallazgoIdsDeEvidencia(
  evidenciaId: string
): string[] {
  const ids: string[] = [];

  for (const observacion of getObservacionesByEvidenciaId(evidenciaId)) {
    const hallazgo = getHallazgoById(observacion.hallazgoId);
    if (hallazgo?.tipo === "barrera") {
      ids.push(hallazgo.id);
    }
  }

  return uniqueStrings(ids);
}

/**
 * Agrega apoyos utilizados desde evidencias del estudiante.
 * Una aparición por sesión/intervención donde el apoyo fue documentado.
 */
export function getApoyosUtilizadosAgregadosPorEstudiante(
  estudianteId: string
): ApoyoUtilizadoAgregado[] {
  const byKey = new Map<string, ApoyoUtilizadoAgregado>();

  for (const sesion of getSesionesByEstudianteId(estudianteId)) {
    if (!sesion.intervencionId) continue;

    const apoyos = resolverApoyosDesdeSesion(sesion);
    if (apoyos.length === 0) continue;

    const objetivoIds = resolverObjetivoIdsDeSesion(
      sesion.intervencionId,
      sesion.objetivosTrabajadosIds
    );
    const condicionHallazgoIds = resolverCondicionHallazgoIdsDeEvidencia(
      sesion.id
    );

    for (const apoyo of apoyos) {
      const current = byKey.get(apoyo.key) ?? {
        id: apoyo.key,
        nombre: apoyo.nombre,
        cantidad: 0,
        intervencionIds: [],
        evidenciaIds: [],
        objetivoIds: [],
        condicionHallazgoIds: [],
      };

      current.cantidad += 1;

      if (!current.intervencionIds.includes(sesion.intervencionId)) {
        current.intervencionIds.push(sesion.intervencionId);
      }
      if (!current.evidenciaIds.includes(sesion.id)) {
        current.evidenciaIds.push(sesion.id);
      }
      for (const objetivoId of objetivoIds) {
        if (!current.objetivoIds.includes(objetivoId)) {
          current.objetivoIds.push(objetivoId);
        }
      }
      for (const condicionId of condicionHallazgoIds) {
        if (!current.condicionHallazgoIds.includes(condicionId)) {
          current.condicionHallazgoIds.push(condicionId);
        }
      }

      byKey.set(apoyo.key, current);
    }
  }

  return [...byKey.values()].sort(
    (left, right) =>
      right.cantidad - left.cantidad ||
      left.nombre.localeCompare(right.nombre, "es")
  );
}

export function getApoyosMasUtilizadosPorEstudiante(
  estudianteId: string
): ApoyoUtilizadoUso[] {
  return getApoyosUtilizadosAgregadosPorEstudiante(estudianteId).map(
    (item) => ({
      id: item.id,
      nombre: item.nombre,
      cantidad: item.cantidad,
    })
  );
}

export function countApoyosDistintosUtilizados(estudianteId: string): number {
  return getApoyosUtilizadosAgregadosPorEstudiante(estudianteId).length;
}
