import { PROFILE_DIMENSION_LABELS } from "@/lib/sessions-storage";

export const CUSTOM_ID = "personalizado";

/** @deprecated Use CUSTOM_ID */
export const DESARROLLO_PERSONALIZADO_ID = CUSTOM_ID;

export type PieAreaDesarrollo = (typeof PROFILE_DIMENSION_LABELS)[number];

export type DesarrolloCatalogItem = {
  id: string;
  area: PieAreaDesarrollo;
  nombre: string;
  metaPlantillas: string[];
};

const CATALOGO_DESARROLLO: DesarrolloCatalogItem[] = [
  {
    id: "reg_reconocer_emociones",
    area: "Regulación emocional",
    nombre: "Reconocer emociones",
    metaPlantillas: [
      "Reconocerá emociones básicas con apoyo visual en situaciones guiadas.",
      "Reconocerá emociones básicas de forma autónoma en situaciones cotidianas.",
      "Reconocerá emociones básicas al observar expresiones en material visual.",
    ],
  },
  {
    id: "reg_nombrar_emociones",
    area: "Regulación emocional",
    nombre: "Nombrar emociones",
    metaPlantillas: [
      "Nombrará emociones básicas con apoyo visual en situaciones guiadas.",
      "Nombrará emociones básicas de forma autónoma en situaciones cotidianas.",
      "Nombrará emociones básicas al identificarlas en contextos familiares.",
    ],
  },
  {
    id: "reg_solicitar_ayuda",
    area: "Regulación emocional",
    nombre: "Solicitar ayuda",
    metaPlantillas: [
      "Solicitará ayuda de un adulto cuando enfrente una situación desafiante.",
      "Utilizará una estrategia acordada para pedir apoyo en momentos de frustración.",
      "Solicitará ayuda de forma autónoma en al menos una rutina escolar.",
    ],
  },
  {
    id: "reg_estrategias_calma",
    area: "Regulación emocional",
    nombre: "Utilizar estrategias de calma",
    metaPlantillas: [
      "Utilizará una estrategia de calma con apoyo cuando lo necesite.",
      "Utilizará una estrategia de calma de forma autónoma en situaciones acordadas.",
      "Elegirá y aplicará una estrategia de calma en momentos de sobrecarga.",
    ],
  },
  {
    id: "reg_senales_corporales",
    area: "Regulación emocional",
    nombre: "Identificar señales corporales",
    metaPlantillas: [
      "Identificará señales corporales de malestar con apoyo visual.",
      "Identificará señales corporales y las comunicará a un adulto de referencia.",
      "Reconocerá señales corporales propias antes de una situación desafiante.",
    ],
  },
  {
    id: "reg_anticipar_situaciones",
    area: "Regulación emocional",
    nombre: "Anticipar situaciones desafiantes",
    metaPlantillas: [
      "Anticipará cambios o transiciones con apoyo visual o verbal.",
      "Utilizará anticipación para prepararse en rutinas escolares conocidas.",
      "Reconocerá situaciones desafiantes y aplicará una estrategia acordada.",
    ],
  },
  {
    id: "com_expresar_necesidades",
    area: "Comunicación",
    nombre: "Expresar necesidades",
    metaPlantillas: [
      "Expresará necesidades básicas con apoyo visual o gestual.",
      "Expresará necesidades de forma verbal en contextos cotidianos.",
      "Expresará necesidades de forma clara ante un adulto de referencia.",
    ],
  },
  {
    id: "com_iniciar_conversaciones",
    area: "Comunicación",
    nombre: "Iniciar conversaciones",
    metaPlantillas: [
      "Iniciará conversaciones breves con apoyo en contextos estructurados.",
      "Iniciará conversaciones con pares en actividades guiadas.",
      "Iniciará conversaciones de forma autónoma en situaciones acordadas.",
    ],
  },
  {
    id: "com_mantener_conversaciones",
    area: "Comunicación",
    nombre: "Mantener conversaciones",
    metaPlantillas: [
      "Mantendrá una conversación breve con apoyo en turnos estructurados.",
      "Mantendrá una conversación con pares en actividades guiadas.",
      "Mantendrá una conversación respetando turnos en contextos familiares.",
    ],
  },
  {
    id: "com_comprender_instrucciones",
    area: "Comunicación",
    nombre: "Comprender instrucciones",
    metaPlantillas: [
      "Comprenderá instrucciones simples con apoyo visual.",
      "Comprenderá instrucciones de uno o dos pasos en rutinas conocidas.",
      "Comprenderá instrucciones en contextos de aula con apoyos acordados.",
    ],
  },
  {
    id: "com_formular_preguntas",
    area: "Comunicación",
    nombre: "Formular preguntas pertinentes",
    metaPlantillas: [
      "Formulará preguntas con apoyo cuando no comprenda una consigna.",
      "Formulará preguntas pertinentes en actividades de aula.",
      "Formulará preguntas para aclarar una tarea de forma autónoma.",
    ],
  },
  {
    id: "soc_iniciar_interaccion",
    area: "Interacción social",
    nombre: "Iniciar interacción con pares",
    metaPlantillas: [
      "Iniciará interacción con pares en actividades estructuradas.",
      "Iniciará interacción con pares con apoyo del adulto.",
      "Iniciará interacción con pares de forma autónoma en contextos acordados.",
    ],
  },
  {
    id: "soc_mantener_interaccion",
    area: "Interacción social",
    nombre: "Mantener interacción social",
    metaPlantillas: [
      "Mantendrá interacción social breve en actividades guiadas.",
      "Mantendrá interacción social respetando turnos con apoyo.",
      "Mantendrá interacción social en juegos o tareas cooperativas.",
    ],
  },
  {
    id: "soc_resolver_conflictos",
    area: "Interacción social",
    nombre: "Resolver conflictos",
    metaPlantillas: [
      "Resolverá conflictos menores con mediación del adulto.",
      "Utilizará estrategias acordadas para resolver conflictos con pares.",
      "Solicitará apoyo ante un conflicto antes de escalar la situación.",
    ],
  },
  {
    id: "soc_respetar_turnos",
    area: "Interacción social",
    nombre: "Respetar turnos",
    metaPlantillas: [
      "Respetará turnos con apoyo visual en actividades estructuradas.",
      "Respetará turnos en juegos o dinámicas grupales con recordatorio.",
      "Respetará turnos de forma autónoma en rutinas conocidas.",
    ],
  },
  {
    id: "soc_participar_grupales",
    area: "Interacción social",
    nombre: "Participar en actividades grupales",
    metaPlantillas: [
      "Participará en actividades grupales con apoyo individualizado.",
      "Participará en actividades grupales cumpliendo un rol asignado.",
      "Participará en actividades grupales de forma activa en contextos acordados.",
    ],
  },
  {
    id: "aut_iniciar_tareas",
    area: "Autonomía",
    nombre: "Iniciar tareas",
    metaPlantillas: [
      "Iniciará tareas con apoyo visual o verbal en rutinas conocidas.",
      "Iniciará tareas de forma autónoma en al menos una asignatura o espacio.",
      "Iniciará tareas acordadas sin necesidad de repetición de la consigna.",
    ],
  },
  {
    id: "aut_completar_rutinas",
    area: "Autonomía",
    nombre: "Completar rutinas",
    metaPlantillas: [
      "Completará rutinas diarias con apoyo visual.",
      "Completará rutinas acordadas con mínima supervisión.",
      "Completará rutinas de forma autónoma en contextos conocidos.",
    ],
  },
  {
    id: "aut_organizar_materiales",
    area: "Autonomía",
    nombre: "Organizar materiales",
    metaPlantillas: [
      "Organizará materiales con checklist o apoyo visual.",
      "Organizará materiales de trabajo al inicio y cierre de una actividad.",
      "Organizará materiales de forma autónoma según la rutina de aula.",
    ],
  },
  {
    id: "aut_gestionar_tiempos",
    area: "Autonomía",
    nombre: "Gestionar tiempos",
    metaPlantillas: [
      "Utilizará un temporizador o agenda para gestionar tiempos con apoyo.",
      "Gestionará tiempos de una actividad con anticipación visual.",
      "Respetará tiempos acordados en rutinas escolares con mínimo apoyo.",
    ],
  },
  {
    id: "aut_solicitar_apoyos",
    area: "Autonomía",
    nombre: "Solicitar apoyos de forma autónoma",
    metaPlantillas: [
      "Solicitará apoyos acordados cuando enfrente una tarea desafiante.",
      "Identificará cuándo necesita apoyo y lo pedirá de forma autónoma.",
      "Utilizará una estrategia de solicitud de apoyo en contextos escolares.",
    ],
  },
  {
    id: "par_rutinas_aula",
    area: "Participación escolar",
    nombre: "Participar en rutinas de aula",
    metaPlantillas: [
      "Participará en rutinas de aula con apoyos visuales o verbales.",
      "Participará en rutinas de aula de forma autónoma en contextos conocidos.",
      "Seguirá rutinas de aula con mínima intervención del adulto.",
    ],
  },
  {
    id: "par_actividades_colectivas",
    area: "Participación escolar",
    nombre: "Participar en actividades colectivas",
    metaPlantillas: [
      "Participará en actividades colectivas con apoyo individualizado.",
      "Participará en actividades colectivas cumpliendo un rol acordado.",
      "Participará activamente en al menos una actividad colectiva semanal.",
    ],
  },
  {
    id: "par_espacios_comunes",
    area: "Participación escolar",
    nombre: "Permanecer en espacios comunes",
    metaPlantillas: [
      "Permanecerá en espacios comunes con apoyos de regulación disponibles.",
      "Permanecerá en espacios comunes durante el tiempo acordado.",
      "Participará en espacios comunes con estrategias de anticipación.",
    ],
  },
  {
    id: "par_recreos",
    area: "Participación escolar",
    nombre: "Participar en recreos y tiempos compartidos",
    metaPlantillas: [
      "Participará en recreos con apoyo de un adulto o par tutor.",
      "Participará en recreos eligiendo una actividad estructurada.",
      "Participará en tiempos compartidos con estrategias de regulación.",
    ],
  },
  {
    id: "bien_expresar_bienestar",
    area: "Bienestar percibido",
    nombre: "Expresar bienestar o malestar",
    metaPlantillas: [
      "Expresará bienestar o malestar con apoyo visual o gestual.",
      "Expresará bienestar o malestar de forma verbal a un adulto de referencia.",
      "Comunicará su estado de bienestar en rutinas de inicio o cierre.",
    ],
  },
  {
    id: "bien_necesidades_descanso",
    area: "Bienestar percibido",
    nombre: "Identificar necesidades de descanso",
    metaPlantillas: [
      "Identificará necesidades de descanso con apoyo del adulto.",
      "Solicitará un descanso cuando lo necesite usando una estrategia acordada.",
      "Reconocerá señales de cansancio y pedirá un espacio de regulación.",
    ],
  },
  {
    id: "bien_solicitar_apoyo",
    area: "Bienestar percibido",
    nombre: "Solicitar apoyo cuando lo necesita",
    metaPlantillas: [
      "Solicitará apoyo cuando lo necesite en contextos estructurados.",
      "Utilizará una señal o tarjeta acordada para pedir apoyo.",
      "Solicitará apoyo de forma autónoma ante situaciones de malestar.",
    ],
  },
  {
    id: "fort_ampliar_fortaleza",
    area: "Fortalezas y talentos",
    nombre: "Ampliar una fortaleza identificada",
    metaPlantillas: [
      "Ampliará una fortaleza identificada en actividades guiadas del equipo.",
      "Utilizará una fortaleza reconocida para acceder a una nueva tarea.",
      "Mostrará su fortaleza en al menos un contexto escolar documentado.",
    ],
  },
  {
    id: "fort_potenciar_interes",
    area: "Fortalezas y talentos",
    nombre: "Potenciar interés significativo",
    metaPlantillas: [
      "Potenciará un interés significativo en actividades motivadoras acordadas.",
      "Vinculará un interés personal con una tarea de aprendizaje.",
      "Participará activamente cuando la actividad conecta con un interés propio.",
    ],
  },
  {
    id: "fort_transferir_talento",
    area: "Fortalezas y talentos",
    nombre: "Transferir talento a nuevos contextos",
    metaPlantillas: [
      "Transferirá un talento identificado a un nuevo contexto con apoyo.",
      "Aplicará una fortaleza en una asignatura o espacio distinto al habitual.",
      "Utilizará un recurso personal en una situación nueva de aprendizaje.",
    ],
  },
];

export function getDesarrollosPorArea(area: string): DesarrolloCatalogItem[] {
  return CATALOGO_DESARROLLO.filter((item) => item.area === area);
}

/** @deprecated Use getDesarrollosPorArea */
export const getDesarrollosByArea = getDesarrollosPorArea;

export function getDesarrolloById(
  desarrolloId: string
): DesarrolloCatalogItem | null {
  return CATALOGO_DESARROLLO.find((item) => item.id === desarrolloId) ?? null;
}

export function getMetaPlantillas(desarrolloId: string): string[] {
  return getDesarrolloById(desarrolloId)?.metaPlantillas ?? [];
}

export function getDesarrolloNombre(
  desarrolloId: string,
  nombrePersonalizado: string
): string {
  if (desarrolloId === CUSTOM_ID) {
    return nombrePersonalizado.trim();
  }
  return getDesarrolloById(desarrolloId)?.nombre ?? nombrePersonalizado.trim();
}

export function findDesarrolloByNombreEnArea(
  area: string,
  nombre: string
): DesarrolloCatalogItem | null {
  const normalized = nombre.trim().toLowerCase();
  return (
    CATALOGO_DESARROLLO.find(
      (item) =>
        item.area === area && item.nombre.toLowerCase() === normalized
    ) ?? null
  );
}
