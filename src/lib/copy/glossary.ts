/**
 * Glosario institucional centralizado — Neuro Enfoco.
 * Toda la UI visible debe consumir estos textos para mantener coherencia terminológica.
 */

export const GLOSSARY = {
  app: {
    name: "Neuro Enfoco",
    tagline: "Neurobienestar escolar",
    focusSidebar:
      "Fortalezas · PIE · Ley 21.545 · Perfil evolutivo",
    focusRegistrar:
      "PIE · inclusión · convivencia · espacios · bienestar",
    equipoEscolar: "Equipo escolar",
    colegioDemo: "Colegio Demo",
  },

  nav: {
    dashboard: "Dashboard",
    estudiantes: "Estudiantes",
    intervenciones: "Intervenciones",
    objetivos: "Objetivos",
    reportes: "Reportes",
  },

  intervencion: {
    singular: "intervención",
    plural: "intervenciones",
    registrar: "Registrar intervención",
    nueva: "Nueva intervención",
    historial: "Historial de intervenciones",
    historialSubtitulo:
      "Registro de intervenciones · fortalezas y evidencias",
    guardar: "Guardar intervención",
    guardarYVerEstudiante: "Guardar y ver estudiante",
    guardadaOk: "Intervención registrada correctamente",
    eliminadaOk: "Intervención eliminada correctamente",
    eliminar: "Eliminar intervención",
    confirmarEliminar: "¿Deseas eliminar esta intervención?",
    eliminarAdvertencia:
      "Esta acción eliminará la evidencia asociada y puede afectar indicadores, fortalezas observadas, perfil evolutivo y objetivos PIE.",
    vacioListado: "Todavía no hay intervenciones registradas.",
    contador: (count: number) =>
      `${count} intervención${count === 1 ? "" : "es"} registrada${count === 1 ? "" : "s"}`,
    fichaActualizada: "Ficha actualizada desde intervenciones registradas",
    evidenciasDimensiones:
      "Evidencias de intervenciones registradas · 7 dimensiones de desarrollo",
    perfilEvolutivoPie:
      "El perfil evolutivo integra observaciones de aula, intervenciones de regulación y evidencias PIE / Ley TEA para documentar el progreso longitudinal de cada estudiante.",
    proximas: "Próximas intervenciones",
    datosIntervencion: "Datos de la intervención",
    estadoInicialHint:
      "Estado inicial registrado al inicio de la intervención",
    estadoFinalHint:
      "Estado final registrado al cierre de la intervención",
    tabEstudiante: "Intervenciones",
    kpiRegistradas: "Intervenciones registradas",
    eliminarEstudianteAdvertencia:
      "También se eliminarán todas las intervenciones, evidencias y observaciones asociadas.",
    desdeIntervenciones:
      "Vista integrada de barreras, línea base, metas, evidencias, apoyos e indicadores analíticos derivados de las intervenciones registradas.",
    objetivosNoEliminan:
      "Las intervenciones registradas no se eliminarán. Solo se quitará el objetivo PIE.",
    apoyosNoModifican:
      "Se quitará del registro de apoyos del objetivo. Las intervenciones no se modifican.",
    evidenciasDesdeIntervenciones:
      "Las evidencias se vincularán desde intervenciones que documenten la dimensión seleccionada.",
    sintesisEvidencias: "Evidencias vinculadas desde intervenciones registradas",
    historiaProgreso:
      "Historia del progreso documentado en intervenciones",
    sinAsociadasObjetivo:
      "Aún no hay intervenciones asociadas a este objetivo.",
    registrarCta: "Registrar intervención",
    descripcionRegistrar:
      "Documenta apoyos, observaciones y resultados en un solo flujo. Aplica a PIE, inclusión escolar, convivencia, espacios de calma, multisensorialidad y apoyos en aula.",
    tituloRegistrar: "Registrar intervención",
    logroDefault:
      "Se observó uso de un apoyo de regulación emocional sin apoyo directo.",
    placeholderLogro:
      "Describe el avance desde un enfoque de fortalezas.",
    salaMultisensorialMes: "Intervenciones y utilización mensual",
    sesionesEsteMes: (count: number) =>
      `${count} intervención${count === 1 ? "" : "es"} este mes`,
  },

  apoyos: {
    utilizados: "Apoyos utilizados",
    utilizadosSubtitulo:
      "Apoyos que facilitaron la participación durante la intervención.",
    queFacilitaron: "Apoyos que facilitaron la participación",
    suelenFacilitar: "Apoyos que suelen facilitar la participación",
    yAjustes: "Apoyos y ajustes que facilitan la participación",
    sinRegistrados:
      "Aún no hay apoyos registrados en intervenciones.",
    implementados: "Apoyos implementados",
  },

  barreras: {
    observadas: "Barreras observadas",
    observadasSubtitulo:
      "Aspectos que dificultaron la participación durante la intervención",
    detectada: "Barrera detectada",
    ayudaObjetivo:
      "Describe la barrera detectada que puede dificultar la participación, el aprendizaje o la autonomía del estudiante.",
    placeholderObjetivo:
      "Ej.: Necesidad de apoyo para iniciar tareas de forma autónoma en el aula",
    loQuePuedeDificultar: "Barreras observadas frecuentes",
    loQuePuedeDificultarSub:
      "Aspectos a considerar con respeto y sin juicio",
    sinObservadas: "Aún no existen barreras observadas.",
    trabajoGrupal:
      "Trabajo grupal con alta demanda social",
  },

  evidencia: {
    pie: "Evidencia PIE",
    leyTea: "Evidencia Ley TEA",
    leyTeaDescripcion:
      "Registro de apoyos y ajustes según la Ley 21.545.",
    seccion: "Evidencias",
    seccionSubtitulo:
      "Documentación institucional vinculada a esta intervención",
  },

  objetivo: {
    pie: "Objetivos PIE",
    nuevoPie: "Nuevo objetivo PIE",
    activos: "Objetivos activos",
    pieDe: (nombre: string) => `Objetivos PIE de ${nombre}`,
    sinRegistrados:
      "Aún no hay objetivos PIE registrados para este estudiante.",
    vinculadosDimensiones:
      "Objetivos vinculados a dimensiones observadas en intervenciones",
  },

  estudiante: {
    fichaEnfoque:
      "Ficha del estudiante · enfoque basado en fortalezas",
    listadoSubtitulo:
      "Fichas con enfoque en fortalezas, participación y bienestar escolar",
    quienEsPregunta: "Conocer al estudiante",
    quienEsTitulo: (nombre: string) => `Perfil de ${nombre}`,
    quienEsNota:
      "Esta ficha prioriza identidad, fortalezas, intereses y contextos de éxito. No reemplaza evaluaciones clínicas ni diagnósticas.",
    vacioQuienEs:
      "Aún no hay observaciones suficientes para construir un perfil personalizado.\n\nRegistra intervenciones para identificar fortalezas, intereses y contextos de éxito.",
    cursoConApoyosLey: "2° básico · apoyos Ley 21.545",
    cursoPie: "5° básico · PIE",
  },

  dashboard: {
    titulo: "Centro de bienestar y seguimiento",
    subtitulo:
      "Seguimiento de bienestar, fortalezas, intervenciones y evidencias PIE y Ley 21.545 en un perfil socioemocional evolutivo.",
    logroRegulacion:
      "Se observó uso de un apoyo de regulación de forma autónoma.",
    logroFrustracion:
      "Mostró avances en la regulación ante situaciones desafiantes.",
    logroEmociones:
      "Se identificaron emociones durante una intervención.",
    logrosRecientes: "Logros recientes de estudiantes",
  },

  insights: {
    sinDatos: "Aún no hay evidencias suficientes para este indicador.",
    estadosFinales:
      "Los estados finales registrados promedian por sobre los estados iniciales.",
    motorAnalitico:
      "Indicadores derivados de evidencias registradas (sin generación automática de texto por IA).",
  },

  meta: {
    title: "Neuro Enfoco",
    description:
      "Plataforma de seguimiento socioemocional, inclusión escolar y evidencias PIE.",
  },
} as const;

export type Glossary = typeof GLOSSARY;
