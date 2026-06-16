import { enrichObjetivoPIE } from "@/lib/evaluacion-integral/planificacion-evaluativa-view";
import type { ConclusionSustentanteResumen } from "@/lib/evaluacion-integral/evaluacion-integral-types";
import { buildObjetivoSeguimiento } from "@/lib/objetivos/objetivo-seguimiento";
import {
  proyectarDimensionPIE,
  type PACIDimensionInstitucionalId,
} from "@/lib/paci/paci-dimensiones";
import { buildPACICadenaTrazabilidadObjetivo } from "@/lib/paci/paci-trazabilidad";
import type { PACIConclusionTrazabilidad } from "@/lib/paci/paci-trazabilidad";
import { getObjetivosRepository } from "@/lib/repositories/repository-factory";
import type { ObjetivoPIE } from "@/lib/repositories/objetivos-repository";

export type BarreraResumen = {
  id: string;
  descripcion: string;
  origen: "hallazgo" | "conclusion";
};

export type ApoyoTipo =
  | "adaptacion_acceso"
  | "adaptacion_curricular"
  | "apoyo_emocional"
  | "apoyo_sensorial"
  | "apoyo_comunicacion"
  | "apoyo_conductual"
  | "otro";

export type ApoyoResumen = {
  id: string;
  nombre: string;
  tipo: ApoyoTipo;
};

export type ObjetivoBarrerasApoyosView = {
  objetivoId: string;
  objetivoNombre: string;
  barreras: BarreraResumen[];
  apoyosSugeridos: ApoyoResumen[];
  cantidadBarreras: number;
  cantidadApoyos: number;
};

export type ObjetivoBarrerasApoyosDetalleView = ObjetivoBarrerasApoyosView & {
  sustentoNarrativo: string;
  tieneSustentoEvaluativo: boolean;
  conclusionesRelacionadas: ConclusionSustentanteResumen[];
};

export type EstudianteBarrerasApoyosResumen = {
  cantidadBarrerasIdentificadas: number;
  cantidadApoyosSugeridos: number;
  objetivosConSustentoEvaluativo: number;
  objetivosSinSustentoEvaluativo: number;
};

type ApoyoSugeridoDefinicion = {
  nombre: string;
  tipo: ApoyoTipo;
};

const APOYOS_POR_DIMENSION_PACI: Record<
  PACIDimensionInstitucionalId,
  readonly ApoyoSugeridoDefinicion[]
> = {
  participacion_convivencia_escolar: [
    { nombre: "Mediación social", tipo: "apoyo_conductual" },
    { nombre: "Trabajo colaborativo", tipo: "apoyo_conductual" },
    { nombre: "Apoyo convivencia", tipo: "apoyo_conductual" },
  ],
  comunicacion_lenguaje: [
    { nombre: "Apoyos visuales", tipo: "apoyo_comunicacion" },
    { nombre: "Comunicación aumentativa", tipo: "apoyo_comunicacion" },
    { nombre: "Modelamiento verbal", tipo: "apoyo_comunicacion" },
  ],
  funcionamiento_sensorial_motor: [
    { nombre: "Regulación sensorial", tipo: "apoyo_sensorial" },
    { nombre: "Pausas programadas", tipo: "apoyo_sensorial" },
    { nombre: "Espacio de calma", tipo: "apoyo_sensorial" },
  ],
  acceso_contexto_educativo: [
    { nombre: "Adaptación de acceso", tipo: "adaptacion_acceso" },
    { nombre: "Anticipación visual", tipo: "adaptacion_acceso" },
    { nombre: "Ajustes ambientales", tipo: "adaptacion_acceso" },
  ],
  aprendizajes_curriculares: [
    { nombre: "Adecuaciones curriculares", tipo: "adaptacion_curricular" },
    { nombre: "Apoyos pedagógicos", tipo: "adaptacion_curricular" },
  ],
  autonomia_funcionamiento_adaptativo: [
    { nombre: "Apoyos de organización", tipo: "otro" },
    { nombre: "Rutinas visuales", tipo: "apoyo_comunicacion" },
    { nombre: "Autonomía guiada", tipo: "otro" },
  ],
  familia_contexto: [
    { nombre: "Coordinación familia-escuela", tipo: "otro" },
    { nombre: "Seguimiento familiar", tipo: "otro" },
  ],
};

function slugifyApoyoNombre(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatBarreraDesdeConclusion(enunciado: string): string {
  const texto = enunciado.trim();
  if (!texto) {
    return "Condición identificada en evaluación integral que orienta este objetivo.";
  }
  return `Condición que limita la participación o el aprendizaje: ${texto}`;
}

function formatBarreraDesdeHallazgo(hallazgo: {
  nombre: string;
  tipoLabel: string;
}): string {
  const nombre = hallazgo.nombre.trim();
  const tipo = hallazgo.tipoLabel.trim();
  if (!nombre) {
    return `Situación documentada en evaluación (${tipo || "hallazgo evaluativo"}).`;
  }
  if (!tipo) return `Situación documentada en evaluación: ${nombre}`;
  return `Situación documentada en evaluación (${tipo}): ${nombre}`;
}

function resolverDimensionProyectada(
  objetivo: ObjetivoPIE,
  conclusiones: PACIConclusionTrazabilidad[]
): PACIDimensionInstitucionalId | undefined {
  const fromObjetivo = proyectarDimensionPIE({
    dimensionRelacionada: objetivo.dimensionRelacionada,
  });
  if (fromObjetivo) return fromObjetivo.id;

  const primeraConDimension = conclusiones.find((item) => item.dimensionId);
  if (primeraConDimension?.dimensionId) {
    return proyectarDimensionPIE({
      conclusionDimensionId: primeraConDimension.dimensionId,
    })?.id;
  }

  return undefined;
}

function buildApoyosSugeridos(
  dimensionId: PACIDimensionInstitucionalId | undefined
): ApoyoResumen[] {
  if (!dimensionId) return [];

  const definiciones = APOYOS_POR_DIMENSION_PACI[dimensionId] ?? [];
  return definiciones.map((item) => ({
    id: `${dimensionId}-${slugifyApoyoNombre(item.nombre)}`,
    nombre: item.nombre,
    tipo: item.tipo,
  }));
}

function buildBarrerasDesdeTrazabilidad(
  conclusiones: PACIConclusionTrazabilidad[]
): BarreraResumen[] {
  const barreras: BarreraResumen[] = [];
  const hallazgosVistos = new Set<string>();

  for (const conclusion of conclusiones) {
    barreras.push({
      id: `conclusion-${conclusion.id}`,
      descripcion: formatBarreraDesdeConclusion(conclusion.enunciado),
      origen: "conclusion",
    });

    for (const hallazgo of conclusion.hallazgosSustentantes) {
      if (hallazgosVistos.has(hallazgo.id)) continue;
      hallazgosVistos.add(hallazgo.id);
      barreras.push({
        id: `hallazgo-${hallazgo.id}`,
        descripcion: formatBarreraDesdeHallazgo(hallazgo),
        origen: "hallazgo",
      });
    }
  }

  return barreras;
}

function buildSustentoNarrativo(
  objetivo: ObjetivoPIE,
  tieneSustentoEvaluativo: boolean,
  conclusiones: PACIConclusionTrazabilidad[]
): string {
  if (!tieneSustentoEvaluativo) {
    const descripcion = objetivo.descripcion?.trim();
    if (descripcion) {
      return descripcion;
    }
    return "Este objetivo aún no cuenta con conclusiones evaluativas vinculadas. Se orienta desde la planificación pedagógica del equipo.";
  }

  if (conclusiones.length === 1) {
    return `Este objetivo responde a la conclusión evaluativa: «${conclusiones[0].enunciado}».`;
  }

  const resumen = conclusiones
    .slice(0, 2)
    .map((item) => `«${item.enunciado}»`)
    .join(" y ");

  if (conclusiones.length === 2) {
    return `Este objetivo articula las conclusiones evaluativas ${resumen}.`;
  }

  return `Este objetivo articula ${conclusiones.length} conclusiones evaluativas, entre ellas ${resumen}.`;
}

export function buildObjetivoBarrerasApoyosView(
  objetivo: ObjetivoPIE
): ObjetivoBarrerasApoyosView {
  const trazabilidad = buildPACICadenaTrazabilidadObjetivo(objetivo);
  const barreras = buildBarrerasDesdeTrazabilidad(trazabilidad.conclusiones);
  const dimensionId = resolverDimensionProyectada(
    objetivo,
    trazabilidad.conclusiones
  );
  const apoyosSugeridos = buildApoyosSugeridos(dimensionId);

  return {
    objetivoId: objetivo.id,
    objetivoNombre: objetivo.nombre,
    barreras,
    apoyosSugeridos,
    cantidadBarreras: barreras.length,
    cantidadApoyos: apoyosSugeridos.length,
  };
}

export function getObjetivoBarrerasApoyosView(
  objetivoId: string
): ObjetivoBarrerasApoyosView | null {
  const objetivo = getObjetivosRepository().getById(objetivoId);
  if (!objetivo) return null;
  return buildObjetivoBarrerasApoyosView(objetivo);
}

export function getObjetivoBarrerasApoyosDetalleView(
  objetivoId: string
): ObjetivoBarrerasApoyosDetalleView | null {
  const objetivo = getObjetivosRepository().getById(objetivoId);
  if (!objetivo) return null;

  const trazabilidad = buildPACICadenaTrazabilidadObjetivo(objetivo);
  const base = buildObjetivoBarrerasApoyosView(objetivo);
  const resumenEnriquecido = enrichObjetivoPIE(objetivo);

  return {
    ...base,
    sustentoNarrativo: buildSustentoNarrativo(
      objetivo,
      trazabilidad.tieneSustentoEvaluativo,
      trazabilidad.conclusiones
    ),
    tieneSustentoEvaluativo: trazabilidad.tieneSustentoEvaluativo,
    conclusionesRelacionadas: resumenEnriquecido.conclusionesSustentantes,
  };
}

export function getEstudianteObjetivosBarrerasApoyos(
  estudianteId: string
): ObjetivoBarrerasApoyosView[] {
  return getObjetivosRepository()
    .getByEstudianteId(estudianteId)
    .map((objetivo) => buildObjetivoBarrerasApoyosView(objetivo))
    .sort((a, b) => a.objetivoNombre.localeCompare(b.objetivoNombre, "es"));
}

export function getEstudianteBarrerasApoyosResumen(
  estudianteId: string
): EstudianteBarrerasApoyosResumen {
  const objetivos = getObjetivosRepository().getByEstudianteId(estudianteId);
  const views = objetivos.map((objetivo) =>
    buildObjetivoBarrerasApoyosView(objetivo)
  );

  const barreraIds = new Set<string>();
  const apoyoIds = new Set<string>();
  let objetivosConSustentoEvaluativo = 0;
  let objetivosSinSustentoEvaluativo = 0;

  for (const objetivo of objetivos) {
    const trazabilidad = buildPACICadenaTrazabilidadObjetivo(objetivo);
    if (trazabilidad.tieneSustentoEvaluativo) {
      objetivosConSustentoEvaluativo += 1;
    } else {
      objetivosSinSustentoEvaluativo += 1;
    }
  }

  for (const view of views) {
    for (const barrera of view.barreras) {
      barreraIds.add(barrera.id);
    }
    for (const apoyo of view.apoyosSugeridos) {
      apoyoIds.add(apoyo.id);
    }
  }

  return {
    cantidadBarrerasIdentificadas: barreraIds.size,
    cantidadApoyosSugeridos: apoyoIds.size,
    objetivosConSustentoEvaluativo,
    objetivosSinSustentoEvaluativo,
  };
}

export function getObjetivoBarrerasApoyosConSeguimiento(objetivoId: string) {
  const objetivo = getObjetivosRepository().getById(objetivoId);
  if (!objetivo) return null;

  return {
    barrerasApoyos: buildObjetivoBarrerasApoyosView(objetivo),
    seguimiento: buildObjetivoSeguimiento(objetivo),
  };
}

export { APOYOS_POR_DIMENSION_PACI };
