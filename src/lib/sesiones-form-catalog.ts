/**
 * Catálogos extensibles para el formulario de registro de sesión / intervención.
 * Para agregar ítems: extender el tipo Id correspondiente y el array CATALOGO_*.
 */

export type SesionEspacioId =
  | "sala_multisensorial"
  | "espacio_calma"
  | "aula"
  | "patio"
  | "otro";

export type SesionEspacioDef = {
  id: SesionEspacioId;
  nombre: string;
  orden: number;
};

export const CATALOGO_ESPACIOS_SESION: readonly SesionEspacioDef[] = [
  { id: "sala_multisensorial", nombre: "Sala Multisensorial", orden: 10 },
  { id: "espacio_calma", nombre: "Espacio de Calma", orden: 20 },
  { id: "aula", nombre: "Aula", orden: 30 },
  { id: "patio", nombre: "Patio", orden: 40 },
  { id: "otro", nombre: "Otro", orden: 50 },
] as const;

export function getSesionEspacioNombre(id: SesionEspacioId): string {
  return (
    CATALOGO_ESPACIOS_SESION.find((item) => item.id === id)?.nombre ?? id
  );
}

export function resolveSesionEspacioId(value: string): SesionEspacioId | null {
  const byId = CATALOGO_ESPACIOS_SESION.find((item) => item.id === value);
  if (byId) return byId.id;

  const normalized = value.trim().toLowerCase();
  const byNombre = CATALOGO_ESPACIOS_SESION.find(
    (item) => item.nombre.toLowerCase() === normalized
  );
  return byNombre?.id ?? null;
}

export type ApoyoSesionId =
  | "agenda_visual"
  | "pictogramas"
  | "instrucciones_visuales"
  | "anticipacion_verbal"
  | "tiempo_transicion"
  | "actividad_estructurada"
  | "companero_tutor"
  | "refuerzo_positivo"
  | "tecnologia_apoyo"
  | "apoyo_individual"
  | "pausa_regulacion";

export type ApoyoSesionDef = {
  id: ApoyoSesionId;
  nombre: string;
  /** Etiqueta en estrategiasQueAyudaron para compatibilidad con sesiones previas. */
  etiquetaEstrategiaLegacy?: string;
  orden: number;
};

export const CATALOGO_APOYOS_SESION: readonly ApoyoSesionDef[] = [
  {
    id: "agenda_visual",
    nombre: "Agenda visual",
    orden: 10,
  },
  {
    id: "pictogramas",
    nombre: "Pictogramas",
    orden: 20,
  },
  {
    id: "instrucciones_visuales",
    nombre: "Instrucciones visuales",
    etiquetaEstrategiaLegacy: "Instrucciones visuales",
    orden: 30,
  },
  {
    id: "anticipacion_verbal",
    nombre: "Anticipación verbal",
    etiquetaEstrategiaLegacy: "Anticipar cambios",
    orden: 40,
  },
  {
    id: "tiempo_transicion",
    nombre: "Tiempo de transición",
    etiquetaEstrategiaLegacy: "Tiempo de transición",
    orden: 50,
  },
  {
    id: "actividad_estructurada",
    nombre: "Actividad estructurada",
    etiquetaEstrategiaLegacy: "Actividades estructuradas",
    orden: 60,
  },
  {
    id: "companero_tutor",
    nombre: "Compañero tutor",
    orden: 70,
  },
  {
    id: "refuerzo_positivo",
    nombre: "Refuerzo positivo",
    etiquetaEstrategiaLegacy: "Refuerzo positivo",
    orden: 80,
  },
  {
    id: "tecnologia_apoyo",
    nombre: "Tecnología de apoyo",
    orden: 90,
  },
  {
    id: "apoyo_individual",
    nombre: "Apoyo individual",
    etiquetaEstrategiaLegacy: "Apoyo individual",
    orden: 100,
  },
  {
    id: "pausa_regulacion",
    nombre: "Pausa de regulación",
    etiquetaEstrategiaLegacy: "Pausas programadas",
    orden: 110,
  },
] as const;

export function getApoyoSesionNombre(id: ApoyoSesionId): string {
  return CATALOGO_APOYOS_SESION.find((item) => item.id === id)?.nombre ?? id;
}

export function apoyosSesionToEstrategiasLegacy(ids: ApoyoSesionId[]): string[] {
  const labels = new Set<string>();

  for (const id of ids) {
    const def = CATALOGO_APOYOS_SESION.find((item) => item.id === id);
    if (!def) continue;
    labels.add(def.etiquetaEstrategiaLegacy ?? def.nombre);
  }

  return Array.from(labels);
}

export type NivelParticipacionId =
  | "no_participa"
  | "con_resistencia"
  | "parcial"
  | "activa"
  | "lidera";

export type NivelParticipacionDef = {
  id: NivelParticipacionId;
  nombre: string;
  orden: number;
};

export const CATALOGO_NIVEL_PARTICIPACION: readonly NivelParticipacionDef[] = [
  { id: "no_participa", nombre: "No participa", orden: 10 },
  { id: "con_resistencia", nombre: "Participa con resistencia", orden: 20 },
  { id: "parcial", nombre: "Participa parcialmente", orden: 30 },
  { id: "activa", nombre: "Participa activamente", orden: 40 },
  { id: "lidera", nombre: "Lidera la actividad", orden: 50 },
] as const;

export function getNivelParticipacionNombre(id: NivelParticipacionId): string {
  return (
    CATALOGO_NIVEL_PARTICIPACION.find((item) => item.id === id)?.nombre ?? id
  );
}

export type NivelApoyoRequeridoId =
  | "independiente"
  | "verbal"
  | "gestual"
  | "fisico_parcial"
  | "fisico_total";

export type NivelApoyoRequeridoDef = {
  id: NivelApoyoRequeridoId;
  nombre: string;
  orden: number;
};

export const CATALOGO_NIVEL_APOYO_REQUERIDO: readonly NivelApoyoRequeridoDef[] =
  [
    { id: "independiente", nombre: "Independiente", orden: 10 },
    { id: "verbal", nombre: "Apoyo verbal", orden: 20 },
    { id: "gestual", nombre: "Apoyo gestual", orden: 30 },
    { id: "fisico_parcial", nombre: "Apoyo físico parcial", orden: 40 },
    { id: "fisico_total", nombre: "Apoyo físico total", orden: 50 },
  ] as const;

export function getNivelApoyoRequeridoNombre(
  id: NivelApoyoRequeridoId
): string {
  return (
    CATALOGO_NIVEL_APOYO_REQUERIDO.find((item) => item.id === id)?.nombre ??
    id
  );
}

export type EvidenciaInstitucionalId = "evidencia_pie" | "evidencia_ley_tea";

export type EvidenciaInstitucionalDef = {
  id: EvidenciaInstitucionalId;
  nombre: string;
  descripcion: string;
  /** Si false, se muestra como próximamente sin permitir selección. */
  disponible: boolean;
  orden: number;
};

export const CATALOGO_EVIDENCIAS_INSTITUCIONALES: readonly EvidenciaInstitucionalDef[] =
  [
    {
      id: "evidencia_pie",
      nombre: "Evidencia PIE",
      descripcion: "Documentación para el Programa de Integración Escolar.",
      disponible: true,
      orden: 10,
    },
    {
      id: "evidencia_ley_tea",
      nombre: "Evidencia Ley TEA",
      descripcion: "Registro de apoyos y ajustes según la Ley 21.545.",
      disponible: true,
      orden: 20,
    },
  ] as const;

export function getEvidenciasInstitucionalesDisponibles(): EvidenciaInstitucionalDef[] {
  return CATALOGO_EVIDENCIAS_INSTITUCIONALES.filter((item) => item.disponible);
}

export function evidenciasIdsToFlags(ids: EvidenciaInstitucionalId[]): {
  evidenciaPIE: boolean;
  evidenciaLeyTEA: boolean;
} {
  return {
    evidenciaPIE: ids.includes("evidencia_pie"),
    evidenciaLeyTEA: ids.includes("evidencia_ley_tea"),
  };
}

export function evidenciasFlagsToIds(
  evidenciaPIE: boolean,
  evidenciaLeyTEA: boolean
): EvidenciaInstitucionalId[] {
  const ids: EvidenciaInstitucionalId[] = [];
  if (evidenciaPIE) ids.push("evidencia_pie");
  if (evidenciaLeyTEA) ids.push("evidencia_ley_tea");
  return ids;
}

export type ProfesionalSesionDef = {
  id: string;
  nombre: string;
  rol: string;
};

/** Placeholder hasta implementar entidad Profesional. */
export const CATALOGO_PROFESIONALES_SESION: readonly ProfesionalSesionDef[] = [
  {
    id: "profesional-local",
    nombre: "Equipo PIE",
    rol: "Equipo de aula",
  },
  {
    id: "educadora-diferencial",
    nombre: "Educadora diferencial",
    rol: "PIE",
  },
  {
    id: "psicologa-escolar",
    nombre: "Psicóloga escolar",
    rol: "Convivencia escolar",
  },
  {
    id: "fonoaudiologa",
    nombre: "Fonoaudióloga",
    rol: "Apoyo especializado",
  },
  {
    id: "terapeuta-ocupacional",
    nombre: "Terapeuta ocupacional",
    rol: "Regulación sensorial",
  },
] as const;

export const DURACION_SESION_PRESETS = [15, 30, 45, 60, 90] as const;

export const DEFAULT_DURACION_MINUTOS = 45;
