/**
 * Glosario institucional centralizado — Neuro Enfoco.
 * Toda la UI visible debe consumir estos textos para mantener coherencia terminológica.
 */

export const GLOSSARY = {
  marco: {
    perfilEstudiante: {
      titulo: "Perfil del Estudiante",
      subtitulo: "Quién es el estudiante y qué recursos moviliza.",
      sobreElEstudiante: "Sobre el estudiante",
    },
    perfilParticipacion: {
      titulo: "Perfil de Participación",
      subtitulo:
        "Qué condiciones favorecen o dificultan la participación en contextos concretos.",
      condicionesIniciales: "Condiciones iniciales de participación",
    },
    condicionesParticipacion: {
      titulo: "Condiciones que dificultan la participación",
      tituloFrecuentes: "Condiciones que dificultan la participación (frecuentes)",
      tituloConocidas: "Condiciones que dificultan la participación (conocidas)",
      tituloHoy: "Condiciones que dificultaron la participación hoy",
      agregar: "Agregar condición observada",
      sinRegistroObjetivo: "Sin condición registrada",
      subtituloFrecuentes:
        "Situaciones documentadas en intervenciones; orientan ajustes del entorno y la actividad",
    },
    hallazgoTipos: {
      fortaleza: "Fortaleza",
      interes: "Interés",
      barrera: "Condición que dificulta la participación",
      contexto_exito: "Contexto de éxito",
    },
    avisosInclusivos: {
      participacionGeneral:
        "Las condiciones de participación describen situaciones observadas en contextos concretos. No definen al estudiante. Orientan ajustes del entorno, la actividad y los apoyos, en coherencia con el DUA, el Decreto 83 y la Ley 21.545.",
      condicionPerfilBase:
        "Estas condiciones describen situaciones observadas en contextos concretos. No definen al estudiante.",
      condicionHallazgo:
        "Esta condición describe situaciones observadas en contextos concretos y orienta ajustes del entorno y los apoyos.",
      condicionIntervencion:
        "Estas condiciones describen situaciones observadas en contextos concretos. No definen al estudiante. Orientan ajustes del entorno, la actividad y los apoyos.",
    },
  },

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

  profesional: {
    tituloListado: "Profesionales del establecimiento",
    subtituloListado:
      "Personas que registran intervenciones y acompañan a estudiantes en distintos ámbitos institucionales.",
    tituloNuevo: "Nuevo profesional",
    subtituloNuevo:
      "Registra a una persona del equipo escolar para asociarla a intervenciones y futuros procesos.",
    tituloEditar: "Editar profesional",
    subtituloEditar: "Actualiza los datos institucionales de la persona.",
    nuevo: "Nuevo profesional",
    editar: "Editar",
    nombres: "Nombres",
    apellidos: "Apellidos",
    rolPrincipal: "Rol principal",
    email: "Correo electrónico (opcional)",
    activo: "Activo en el establecimiento",
    guardarNuevo: "Guardar profesional",
    guardarCambios: "Guardar cambios",
    cancelar: "Cancelar",
    volverListado: "Volver a profesionales",
    volverIntervenciones: "Volver a intervenciones",
    gestionarProfesionales: "Gestionar profesionales",
    sinRegistros: "Aún no hay profesionales registrados.",
    noEncontrado: "Profesional no encontrado.",
    columnaNombre: "Nombre",
    columnaEstado: "Estado",
    columnaAcciones: "Acciones",
    estadoActivo: "Activo",
    estadoInactivo: "Inactivo",
    profesionalTransicion:
      "Registro de transición para intervenciones históricas.",
    selectorVacio: "No hay profesionales activos. Registra uno primero.",
    selectorLabel: "Profesional responsable",
  },

  equipoApoyo: {
    tab: "Equipo de apoyo",
    titulo: "Equipo de apoyo",
    subtitulo:
      "Profesionales que acompañan a este estudiante en distintos ámbitos institucionales.",
    filtroVigentes: "Solo vigentes",
    filtroHistorial: "Mostrar historial",
    agregar: "Agregar persona al equipo",
    editar: "Editar participación",
    finalizar: "Finalizar participación",
    marcarResponsable: "Marcar como responsable",
    responsable: "Responsable",
    responsableBadge: "★ Responsable",
    columnaProfesional: "Profesional",
    columnaRol: "Rol",
    columnaAmbito: "Ámbito",
    columnaEstado: "Estado",
    columnaInicio: "Inicio",
    columnaTermino: "Término",
    estadoVigente: "Vigente",
    estadoProgramada: "Programada",
    estadoFinalizada: "Finalizada",
    sinRegistros: "Aún no hay profesionales en el equipo de apoyo.",
    sinRegistrosVigentes:
      "No hay participaciones vigentes. Activa «Mostrar historial» para ver registros anteriores.",
    resumenTitulo: "Equipo de apoyo",
    resumenResponsablePie: "Responsable PIE",
    resumenSinResponsablePie: "Sin responsable PIE asignado",
    resumenProfesionalesActivos: "Profesionales activos",
    resumenAmbitosActivos: "Ámbitos activos",
    verEquipoCompleto: "Ver equipo completo →",
    modalAgregarTitulo: "Agregar al equipo de apoyo",
    modalEditarTitulo: "Editar participación",
    modalSubtitulo:
      "Asocia a un profesional del establecimiento con un ámbito y rol de participación.",
    campoProfesional: "Profesional",
    campoRol: "Rol en el equipo",
    campoAmbito: "Ámbito institucional",
    campoFechaInicio: "Fecha de inicio",
    campoFechaTermino: "Fecha de término (opcional)",
    campoNotas: "Notas (opcional)",
    guardar: "Guardar participación",
    cancelar: "Cancelar",
    finalizarTitulo: "Finalizar participación",
    finalizarDescripcion:
      "La participación quedará en historial. No se eliminará el registro.",
    finalizarConfirmar: "Confirmar finalización",
    finalizarFecha: "Fecha de término",
    errorProfesionalRequerido: "Selecciona un profesional activo.",
    errorGuardar: "No se pudo guardar la participación.",
    gestionarProfesionales: "Gestionar profesionales",
  },

  evaluacionIntegral: {
    tab: "Evaluación Integral",
    titulo: "Evaluación Integral",
    subtitulo:
      "Proceso evaluativo interdisciplinario que origina el conocimiento institucional del estudiante.",
    resumenTitulo: "Evaluación Integral",
    verEvaluacion: "Ver evaluación →",
    sinEvaluacion:
      "Aún no hay evaluación integral registrada para este estudiante.",
    sinEvaluacionDetalle:
      "El ingreso PIE y el Perfil Base pueden existir sin una evaluación formal en el sistema.",
    evaluacionVigente: "Evaluación vigente",
    resumenEvaluativo: "Resumen evaluativo",
    equipoEvaluador: "Equipo evaluador",
    historial: "Historial de evaluaciones",
    hallazgosEvaluativos: "Hallazgos evaluativos",
    sinResponsable: "Sin responsable de proceso",
    sinParticipantes: "Sin participantes registrados en la evaluación.",
    sinHistorial: "Sin evaluaciones anteriores.",
    sinHallazgos: "Sin hallazgos evaluativos registrados.",
    tipo: "Tipo",
    estado: "Estado",
    fechaInicio: "Fecha de inicio",
    fechaCierre: "Fecha de cierre",
    fechaTermino: "Fecha de término",
    responsableProceso: "Responsable del proceso",
    participantes: "Participantes",
    hallazgosTotales: "Hallazgos evaluativos",
    hallazgosConsolidados: "Consolidados en Perfil Base",
    hallazgosPendientes: "Pendientes de consolidación",
    consolidado: "Consolidado en Perfil Base",
    pendienteConsolidacion: "Pendiente de consolidación",
    grupoFortalezas: "Fortalezas",
    grupoIntereses: "Intereses",
    grupoBarreras: "Condiciones de participación",
    grupoContextos: "Contextos de éxito",
    conclusionesEvaluativas: "Conclusiones evaluativas",
    sinConclusiones: "Sin conclusiones evaluativas registradas.",
    columnaFecha: "Fecha",
    columnaTipo: "Tipo",
    columnaEstado: "Estado",
    responsableBadge: "Responsable del proceso",
    nuevaEvaluacion: "Nueva evaluación",
    continuarEvaluacion: "Continuar evaluación",
    planificarDesdeEvaluacion: "Planificar desde evaluación",
    coberturaPlanificacion: "Cobertura de planificación",
    conclusionesPlanificadas: "Conclusiones con objetivo vinculado",
    conclusionesSinPlanificacion: "Conclusiones sin planificación",
  },

  planificacionEvaluativa: {
    titulo: "Planificar desde evaluación",
    subtitulo:
      "Vincula las conclusiones evaluativas con objetivos PIE del estudiante.",
    volverEvaluacion: "Volver a la evaluación",
    volverEstudiantes: "Volver a estudiantes",
    evaluacionNoEncontrada: "Evaluación no encontrada.",
    tipoEvaluacion: "Tipo de evaluación",
    fechaReferencia: "Fecha de referencia",
    coberturaPlanificacion: "Cobertura de planificación",
    conclusionesSinRespuesta: "Sin respuesta planificada",
    listaPriorizada: "Conclusiones pendientes de planificación",
    todasPlanificadas:
      "Todas las conclusiones de esta evaluación tienen al menos un objetivo vinculado.",
    yaPlanificadas: "Conclusiones con planificación",
    respondeConclusion: "Responde a esta conclusión",
    sinObjetivosVinculados: "Sin objetivos vinculados.",
    crearObjetivo: "Crear objetivo",
    vincularExistente: "Vincular objetivo existente",
    verObjetivo: "Ver objetivo",
    desvincular: "Desvincular",
    confirmarDesvincular: "¿Desvincular este objetivo de la conclusión?",
    estadoPlanificada: "Planificada",
    estadoSinPlanificacion: "Sin planificación",
    sinPlanificacion: "Sin planificación",
    avisoBorrador:
      "La evaluación está en borrador. Puedes planificar, pero conviene cerrarla antes.",
    sustentadoTitulo: "Sustentado en evaluación (opcional)",
    sustentadoSubtitulo:
      "Vincula este objetivo con conclusiones evaluativas del estudiante.",
    evaluacionOrigen: "Evaluación de origen",
    seleccionarEvaluacion: "Seleccionar evaluación",
    sinEvaluaciones: "No hay evaluaciones registradas para este estudiante.",
    sinConclusiones: "Esta evaluación no tiene conclusiones registradas.",
    vincularObjetivoTitulo: "Vincular objetivo existente",
    vincularObjetivoSub:
      "Selecciona un objetivo PIE que responda a esta conclusión evaluativa.",
    sinObjetivosDisponibles:
      "No hay objetivos disponibles para vincular. Crea uno nuevo.",
    confirmarVinculo: "Confirmar vínculo",
    vinculando: "Vinculando…",
    cancelar: "Cancelar",
    errorVincular: "No se pudo crear el vínculo.",
    trazabilidadTitulo: "Sustentado en evaluación",
    sinTrazabilidad: "Este objetivo no está vinculado a conclusiones evaluativas.",
  },

  evaluacionCaptura: {
    tituloNueva: "Nueva evaluación integral",
    tituloCaptura: "Evaluación integral",
    subtituloNueva:
      "Inicia un proceso evaluativo para construir conocimiento institucional del estudiante.",
    subtituloCaptura:
      "Registra el encuadre, los hallazgos del equipo y la síntesis evaluativa.",
    pasoEncuadre: "Encuadre",
    pasoHallazgos: "Hallazgos",
    pasoCierre: "Cierre",
    tipoIngreso: "Ingreso",
    tipoReevaluacion: "Reevaluación",
    tipoSeguimiento: "Seguimiento",
    campoEstudiante: "Estudiante",
    campoTipo: "Tipo de evaluación",
    campoFechaInicio: "Fecha de inicio",
    campoFechaCierrePrevista: "Fecha de cierre prevista (opcional)",
    campoSintesis: "Síntesis evaluativa",
    sintesisAyuda:
      "Describe qué observó el equipo, qué es prioritario, qué fortalezas destacan y qué condiciones afectan la participación.",
    grupoFortalezas: "Fortalezas",
    grupoIntereses: "Intereses",
    grupoContextos: "Contextos de éxito",
    grupoCondiciones: "Condiciones de participación",
    agregarFortaleza: "Agregar fortaleza",
    agregarInteres: "Agregar interés",
    agregarContexto: "Agregar contexto",
    agregarCondicion: "Agregar condición",
    sinFortalezas: "Aún no hay fortalezas registradas.",
    sinIntereses: "Aún no hay intereses registrados.",
    sinContextos: "Aún no hay contextos de éxito registrados.",
    sinCondiciones: "Aún no hay condiciones registradas.",
    equipoEvaluador: "Equipo evaluador",
    agregarParticipante: "Agregar al equipo",
    editarParticipante: "Editar participación",
    modalParticipanteSubtitulo:
      "Profesionales institucionales que participan en esta evaluación.",
    campoProfesional: "Profesional",
    campoRol: "Rol en la evaluación",
    marcarResponsable: "Responsable del proceso",
    campoFechaTermino: "Fecha de término (opcional)",
    campoNotas: "Notas (opcional)",
    eliminarParticipante: "Quitar del equipo",
    eliminarHallazgo: "Eliminar",
    sinParticipantes: "Agrega al menos un profesional al equipo evaluador.",
    revisionTitulo: "Revisión previa al cierre",
    revisionParticipantes: "Participantes",
    revisionHallazgos: "Hallazgos registrados",
    revisionResponsable: "Responsable del proceso",
    revisionResponsableSi: "Definido",
    revisionResponsableNo: "Sin definir",
    revisionFechas: "Fechas",
    cerrarEvaluacion: "Cerrar evaluación",
    cerrando: "Cerrando…",
    evaluacionCerrada: "Evaluación cerrada correctamente.",
    evaluacionCerradaTitulo: "Evaluación cerrada",
    evaluacionCerradaDetalle:
      "Los hallazgos se consolidaron en el Perfil Base del estudiante.",
    verEnFicha: "Ver en ficha del estudiante",
    borradorExistente:
      "Este estudiante ya tiene una evaluación en borrador. Continúa ese proceso en lugar de crear otra.",
    ingresoYaRegistrado:
      "Ya existe una evaluación de ingreso cerrada para este estudiante.",
    crearEvaluacion: "Crear evaluación",
    creando: "Creando…",
    anterior: "Anterior",
    siguiente: "Siguiente",
    guardar: "Guardar",
    guardando: "Guardando…",
    cancelar: "Cancelar",
    volverEstudiantes: "Volver a estudiantes",
    errorGuardar: "No se pudo guardar los cambios.",
    errorCrear: "No se pudo crear la evaluación.",
    errorCerrar: "No se pudo cerrar la evaluación.",
    errorParticipante: "No se pudo guardar la participación.",
    seleccionaEstudiante: "Selecciona un estudiante.",
    pasoConclusiones: "Conclusiones",
    derivarConclusion: "Derivar conclusión",
    errorEliminarHallazgoSustento:
      "No se puede eliminar: esta observación es el único sustento de una conclusión evaluativa.",
  },

  conclusionEvaluativa: {
    titulo: "Conclusiones evaluativas",
    subtitulo:
      "Qué requiere respuesta educativa según esta evaluación, sustentado en hallazgos.",
    agregar: "Agregar conclusión",
    editar: "Editar conclusión",
    eliminar: "Eliminar conclusión",
    sinConclusiones: "Aún no hay conclusiones evaluativas registradas.",
    sinHallazgosParaConclusion:
      "Registra al menos un hallazgo antes de derivar conclusiones.",
    campoEnunciado: "Conclusión evaluativa",
    enunciadoAyuda:
      "Describe qué aspecto del aprendizaje o la participación requiere respuesta educativa.",
    campoPrioridad: "Prioridad",
    prioridadAlta: "Alta",
    prioridadMedia: "Media",
    prioridadBaja: "Baja",
    prioridadAltaAviso:
      "Hay más de tres conclusiones de prioridad alta. Considera focalizar el proceso.",
    campoDimension: "Dimensión afectada (recomendado)",
    sinDimension: "Sin dimensión",
    campoDimensionDetalle: "Área curricular (opcional)",
    campoNotas: "Notas del equipo (opcional)",
    hallazgosSustentantes: "Hallazgos sustentantes",
    seleccionarHallazgos: "Selecciona uno o más hallazgos",
    guardar: "Guardar conclusión",
    guardando: "Guardando…",
    cancelar: "Cancelar",
    errorGuardar: "No se pudo guardar la conclusión evaluativa.",
    confirmarEliminar: "¿Eliminar esta conclusión evaluativa?",
    lecturaTitulo: "Conclusiones de la evaluación",
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
    vacioFichaEstudiante:
      "Aún no existen intervenciones registradas para este estudiante.",
    fichaHistorialSubtitulo:
      "Historial institucional y pedagógico derivado de intervenciones y evidencias vinculadas.",
    perfilExperimentalTitulo: "Perfil del Estudiante y de Participación",
    perfilExperimentalSubtitulo:
      "Síntesis del perfil base y las confirmaciones registradas en intervenciones.",
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
      "Vista integrada de condiciones de participación, línea base, metas, evidencias, apoyos e indicadores analíticos derivados de las intervenciones registradas.",
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
    resultadosSubtitulo:
      "Estados emocionales, logro, participación e impactos adicionales observados",
    dimensionesPrincipalesTitulo: "Dimensiones principales trabajadas",
    dimensionesPrincipalesHint:
      "Derivadas automáticamente de los objetivos seleccionados en esta intervención.",
    dimensionesPrincipalesVacias:
      "Selecciona uno o más objetivos trabajados para identificar las dimensiones principales.",
    impactosAdicionalesTitulo: "Impactos adicionales observados",
    impactosAdicionalesHint:
      "Dimensiones impactadas más allá de las vinculadas a los objetivos trabajados.",
    impactosAdicionalesAyuda:
      "Opcional. Registra efectos observados en otras áreas de desarrollo sin repetir las dimensiones ya determinadas por los objetivos.",
    impactosAdicionalesSinOpciones:
      "Todas las dimensiones del catálogo ya están cubiertas por los objetivos seleccionados.",
    salaMultisensorialMes: "Intervenciones y utilización mensual",
    sesionesEsteMes: (count: number) =>
      `${count} intervención${count === 1 ? "" : "es"} este mes`,
  },

  perfilEvolutivo: {
    tab: "Perfil Evolutivo",
    tituloDe: (nombre: string) => `Perfil Evolutivo de ${nombre}`,
    subtitulo:
      "Memoria institucional del conocimiento construido sobre el estudiante y las condiciones de su participación.",
    subtituloEstudiante:
      "Recursos personales que el equipo ha identificado y confirmado a través del tiempo.",
    subtituloParticipacion:
      "Condiciones observadas en la participación del estudiante en distintos contextos.",
    preguntaEstudiante: "¿Qué sabemos hoy sobre este estudiante?",
    preguntaParticipacion:
      "¿Qué hemos aprendido sobre las condiciones que favorecen o dificultan su participación?",
    resumenTitulo: "Resumen del conocimiento registrado",
    distribucionTitulo: "Origen del conocimiento registrado",
    distribucionPerfilBase: "Perfil Base",
    distribucionIntervenciones: "Intervenciones",
    fortalezasConocidas: "Fortalezas conocidas",
    interesesConocidos: "Intereses conocidos",
    contextosDocumentados: "Contextos de éxito documentados",
    condicionesDocumentadas: "Condiciones documentadas",
    seccionFortalezas: "Fortalezas",
    seccionIntereses: "Intereses",
    seccionContextos: "Contextos de éxito",
    seccionCondiciones: "Condiciones que dificultan la participación",
    labelOrigen: "Origen",
    labelConfirmaciones: "Confirmaciones",
    labelPrimeraObservacion: "Primera observación",
    labelUltimaObservacion: "Última observación",
    sinObservaciones: "Sin observaciones registradas",
    vacioGeneral:
      "Aún no hay registros de perfil para este estudiante. Completa el Perfil Base o registra intervenciones para construir esta memoria.",
    vacioFortalezas: "Sin fortalezas registradas todavía.",
    vacioIntereses: "Sin intereses registrados todavía.",
    vacioContextos: "Sin contextos de éxito registrados todavía.",
    vacioCondiciones:
      "Sin condiciones que dificulten la participación registradas todavía.",
    avisoNoEvaluacion:
      "Este perfil describe conocimiento acumulado por el equipo escolar. No evalúa al estudiante ni mide su progreso.",
    confirmacionesNinguna: "Ninguna",
    confirmacionesUna: "1",
    confirmacionesVarias: (count: number) => String(count),
    conteoFortalezas: (count: number) =>
      `${count} fortaleza${count === 1 ? "" : "s"}`,
    conteoIntereses: (count: number) =>
      `${count} interés${count === 1 ? "" : "es"}`,
    conteoContextos: (count: number) =>
      `${count} contexto${count === 1 ? "" : "s"}`,
    conteoCondiciones: (count: number) =>
      `${count} condición${count === 1 ? "" : "es"}`,
  },

  ingresoPie: {
    titulo: "Ingreso PIE",
    subtitulo:
      "Registra el conocimiento de la evaluación integral previa para iniciar el Perfil Base institucional del estudiante.",
    precondicion:
      "La evaluación integral ya fue realizada en el establecimiento. Este asistente documenta el conocimiento relevante para el trabajo pedagógico diario.",
    pasoMarco: "Marco institucional",
    pasoPerfilEstudiante: "Perfil del estudiante",
    pasoParticipacion: "Perfil de participación",
    pasoConfirmacion: "Confirmación",
    fechaIngreso: "Fecha de ingreso PIE",
    proximaReevaluacion: "Próxima reevaluación integral",
    proximaReevaluacionAyuda:
      "Según orientaciones PIE; fecha registrada en la evaluación previa.",
    tipoNee: "Tipo de NEE",
    diagnosticoPrincipal: "Diagnóstico principal (referencial)",
    referenciaEvaluacion: "Referencia de evaluación previa",
    observacionesInstitucionales: "Observaciones institucionales",
    sinHallazgosAviso:
      "Puedes continuar sin registrar hallazgos ahora y completarlos después en el Perfil Base.",
    confirmarSubtitulo:
      "Este conocimiento quedará en el Perfil Base institucional del estudiante.",
    completar: "Completar ingreso PIE",
    marcoResumenTitulo: "Marco institucional PIE",
    marcoResumenSubtitulo:
      "Datos de ingreso y seguimiento programático. No reemplaza evaluaciones clínicas.",
  },

  perfilBase: {
    tab: "Perfil Base",
    tituloDe: (nombre: string) => `Perfil Base de ${nombre}`,
    subtitulo:
      "Conocimiento profesional inicial del estudiante antes y al margen de las intervenciones: familia, equipo escolar e informes previos.",
    origenIngresoPie: "Ingreso PIE",
    origenPerfilBase: "Perfil Base",
    origenIntervencion: "Intervención",
    origenEvaluacionIntegral: "Evaluación integral",
    verHistorial: "Ver historial",
    historialIntervenciones: "Intervenciones asociadas",
    historialVacio:
      "Este hallazgo aún no tiene confirmaciones registradas en intervenciones.",
    verIntervencion: "Ir a intervenciones del estudiante",
  },

  apoyos: {
    utilizados: "Apoyos de participación",
    utilizadosSubtitulo:
      "Apoyos utilizados o presentes durante esta intervención.",
    utilizadosAyuda:
      "Registra los apoyos que el equipo implementó o estuvieron disponibles durante esta experiencia. No implica efectividad ni reemplaza la observación profesional.",
    queFacilitaron: "Apoyos que facilitaron la participación",
    deParticipacion: "Apoyos de participación",
    suelenFacilitar: "Apoyos de participación registrados con frecuencia",
    yAjustes: "Apoyos y ajustes que facilitan la participación",
    sinRegistrados:
      "Aún no hay apoyos registrados en intervenciones.",
    implementados: "Apoyos implementados",
    participacionFicha: {
      etiquetaExperimental: "Vista experimental",
      titulo: "Apoyos que favorecen la participación",
      subtitulo: (nombre: string) =>
        `Resumen de apoyos registrados por el equipo educativo y los contextos en que se han documentado experiencias de participación de ${nombre}.`,
      ayuda:
        "Esta vista organiza información registrada por el equipo educativo. No establece relaciones causales ni reemplaza el juicio profesional.",
      resumenConteos: (ficha: {
        intervencionesConApoyosDocumentados: number;
        totalIntervenciones: number;
        apoyosDocumentados: { length: number };
      }) =>
        `${ficha.intervencionesConApoyosDocumentados} intervenciones con apoyos documentados de ${ficha.totalIntervenciones} registradas · ${ficha.apoyosDocumentados.length} apoyos distintos en el resumen.`,
      seccionApoyos: "Apoyos documentados",
      seccionApoyosDescripcion:
        "Apoyos registrados en intervenciones y la participación observada en cada una.",
      intervencionesDocumentadas: (cantidad: number) =>
        `Documentado en ${cantidad} intervención${cantidad === 1 ? "" : "es"}`,
      veces: (cantidad: number) =>
        `${cantidad} vez${cantidad === 1 ? "" : "es"}`,
      seccionContextos: "Contextos de éxito documentados en las mismas intervenciones",
      seccionContextosDescripcion:
        "Condiciones donde el equipo documentó participación favorable, en intervenciones donde también se registraron apoyos.",
      sinContextos:
        "Aún no hay contextos de éxito documentados en intervenciones con apoyos registrados.",
      seccionFortalezas: "Fortalezas observadas en las mismas intervenciones",
      seccionFortalezasDescripcion:
        "Fortalezas registradas por el equipo en intervenciones donde también se documentaron apoyos.",
      sinFortalezas:
        "Aún no hay fortalezas documentadas en intervenciones con apoyos registrados.",
      seccionNecesidades: "Necesidades de apoyo documentadas en las mismas intervenciones",
      seccionNecesidadesDescripcion:
        "Situaciones del contexto que el equipo documentó en intervenciones donde también se registraron apoyos.",
      sinNecesidades:
        "Aún no hay necesidades de apoyo documentadas en intervenciones con apoyos registrados.",
      seccionPlanificados: "Apoyos planificados sin uso documentado",
      seccionPlanificadosDescripcion:
        "Apoyos previstos en objetivos que aún no aparecen en el registro de apoyos utilizados en intervenciones.",
      planificadoEn: (objetivoNombre: string) =>
        `Planificado en: «${objetivoNombre}»`,
      sinApoyos:
        "No hay apoyos documentados en las intervenciones registradas.",
      vacioTitulo: "Aún no existe información suficiente.",
      vacioTexto:
        "Esta vista se construye a partir de intervenciones registradas por el equipo educativo. A medida que se registren apoyos y experiencias de participación, aparecerá información aquí.",
      registrarIntervencion: "Registrar intervención",
    },
  },

  barreras: {
    observadas: "Condiciones que dificultaron la participación",
    observadasSubtitulo:
      "Situaciones observadas en el contexto de la intervención",
    detectada: "Condición que dificulta el logro del objetivo",
    ayudaObjetivo:
      "Describe una situación o condición observada en el contexto escolar que dificulta el acceso, la participación o el logro del objetivo.",
    placeholderObjetivo:
      "Ej.: Transiciones sin anticipación visual dificultan el inicio autónomo de tareas en aula",
    loQuePuedeDificultar:
      "Condiciones que dificultan la participación (frecuentes)",
    loQuePuedeDificultarSub:
      "Situaciones documentadas en intervenciones; orientan ajustes del entorno y la actividad",
    sinObservadas:
      "Aún no existen condiciones que dificulten la participación registradas.",
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
    editarPie: "Editar objetivo PIE",
    activos: "Objetivos activos",
    pieDe: (nombre: string) => `Objetivos PIE de ${nombre}`,
    sinRegistrados:
      "Aún no hay objetivos PIE registrados para este estudiante.",
    vinculadosDimensiones:
      "Objetivos vinculados a dimensiones observadas en intervenciones",
    planificacion: {
      tituloNuevo: "Planificar objetivo PIE",
      tituloEditar: "Editar planificación del objetivo",
      subtitulo:
        "Define qué queremos desarrollar, desde dónde partimos y cómo lo acompañaremos.",
      bloqueEstudiante: "Estudiante",
      bloqueEstudianteSub:
        "Selecciona el estudiante al que corresponde este objetivo.",
      bloqueArea: "Área de desarrollo",
      bloqueAreaSub:
        "Dimensión del perfil evolutivo que orienta este objetivo.",
      bloqueDesarrollo: "¿Qué queremos desarrollar?",
      bloqueDesarrolloSub:
        "Elige un foco del catálogo o describe un desarrollo personalizado.",
      desarrolloPersonalizado: "Desarrollo personalizado",
      desarrolloPersonalizadoPlaceholder:
        "Describe el foco pedagógico que quieres trabajar",
      bloqueSituacionActual: "Situación actual",
      bloqueSituacionActualSub:
        "¿Dónde se encuentra actualmente el estudiante respecto de este objetivo?",
      lineaBasePregunta:
        "¿Dónde se encuentra actualmente el estudiante respecto de este objetivo?",
      fechaLineaBase: "Fecha de referencia",
      bloqueMeta: "Meta esperada",
      bloqueMetaSub: "¿Qué esperamos observar?",
      metaPlantillasHint: "Plantillas sugeridas según el desarrollo elegido:",
      bloqueCondiciones:
        "Condiciones de participación relacionadas con este objetivo",
      bloqueCondicionesSub:
        "Selecciona las condiciones observadas que actualmente limitan o dificultan la participación del estudiante en contextos relacionados con este objetivo.",
      bloqueCondicionesAyuda:
        "Estas condiciones orientan los ajustes del entorno, la actividad y los apoyos que el equipo planifica implementar.",
      condicionesPerfilSugeridasTitulo: "Documentadas en Perfil Base",
      condicionesPerfilSugeridasAyuda:
        "Barreras registradas en el perfil del estudiante que puedes vincular a este objetivo.",
      condicionesPerfilAgregarTodas: "Agregar todas",
      condicionesPerfilAgregar: "Agregar",
      apoyosSugeridosTitulo: "Apoyos sugeridos según condiciones seleccionadas",
      apoyosSugeridosAyuda:
        "Orientación pedagógica según el catálogo institucional; el equipo decide qué implementar.",
      apoyosSugeridosAgregarTodos: "Agregar apoyos sugeridos",
      apoyosSugeridosAgregar: "Agregar",
      bloqueApoyos: "Apoyos planificados",
      bloqueApoyosSub:
        "Mismo catálogo institucional que en intervenciones. Los espacios se planifican por separado.",
      apoyosVaciosAviso:
        "No has seleccionado apoyos planificados. Puedes guardar el objetivo y completarlos después.",
      apoyoOtroPlaceholder: "Describe el apoyo u otro recurso planificado",
      bloqueObservaciones: "Observaciones del equipo",
      bloqueObservacionesSub:
        "Contexto adicional para el equipo (opcional).",
      guardar: "Guardar objetivo",
      guardarCambios: "Guardar cambios",
    },
  },

  aprendizajes: {
    etiqueta: "Aprendizajes institucionales",
    tab: "Aprendizajes",
    tituloDe: (nombre: string) => `Aprendizajes de ${nombre}`,
    subtitulo:
      "Síntesis trazable del conocimiento construido a partir de hallazgos, intervenciones y evidencias registradas por el equipo.",
    aviso:
      "Esta vista organiza registros institucionales existentes. No evalúa al estudiante, no predice resultados ni reemplaza el juicio profesional.",
    vacioConsolidado:
      "Aún no existen suficientes evidencias para construir aprendizajes consolidados.",
    vacioPatrones:
      "No hay suficientes registros para identificar patrones consistentes.",
    seccionPerfilEstudianteSubtitulo:
      "Fortalezas e intereses con mayor confirmación en el registro del equipo.",
    seccionParticipacionSubtitulo:
      "Contextos, condiciones, apoyos y espacios documentados con mayor frecuencia en intervenciones.",
    fortalezasConfirmadas: "Fortalezas más confirmadas",
    interesesPredominantes: "Intereses predominantes",
    contextosFavorables: "Contextos favorables",
    condicionesFrecuentes: "Condiciones observadas con mayor frecuencia",
    apoyosMasUtilizados: "Apoyos más utilizados",
    espaciosMasUtilizados: "Espacios más utilizados",
    objetivosMasTrabajados: "Objetivos más trabajados",
    trabajoPedagogico: "Trabajo pedagógico realizado",
    trabajoPedagogicoSubtitulo:
      "Participación documentada en intervenciones y objetivos vinculados.",
    tiempoAcumulado: "Tiempo acumulado",
    apoyosDistintos: "Apoyos distintos",
    espaciosDistintos: "Espacios distintos",
    confirmacionIntervenciones: "Confirmación en intervenciones",
    usoEnIntervenciones: (cantidad: number) =>
      `${cantidad} intervención${cantidad === 1 ? "" : "es"}`,
  },

  paci: {
    titulo: "Plan de Adecuación Curricular Individualizado",
    tituloCorto: "PACI",
    tab: "PACI",
    subtitulo:
      "Documento institucional que articula evaluación, objetivos y compromisos del establecimiento por período.",
    nuevoTitulo: "Nuevo PACI",
    nuevoSubtitulo:
      "Inicia un borrador institucional para el estudiante. Puedes completarlo antes de declararlo vigente.",
    detalleTitulo: "Detalle del PACI",
    volverEstudiante: "Volver a la ficha del estudiante",
    volverPaci: "Volver al PACI",
    noEncontrado: "PACI no encontrado.",
    crearPaci: "Crear PACI",
    verDetalle: "Ver detalle",
    declararVigente: "Declarar vigente",
    cerrarPaci: "Cerrar PACI",
    eliminarBorrador: "Eliminar borrador",
    confirmarEliminar: "¿Eliminar este borrador de PACI? Esta acción no se puede deshacer.",
    guardarCambios: "Guardar cambios",
    guardando: "Guardando…",
    periodo: "Período",
    periodoInicio: "Inicio del período (opcional)",
    periodoFin: "Término del período (opcional)",
    estadoBorrador: "Borrador",
    estadoVigente: "Vigente",
    estadoCerrado: "Cerrado",
    sintesisInstitucional: "Síntesis institucional",
    sintesisInstitucionalAyuda:
      "Síntesis del documento PACI para el período. Es independiente de la síntesis evaluativa.",
    sintesisVacia: "Sin síntesis institucional registrada.",
    evaluacionReferencia: "Evaluación de referencia",
    observacionesEvaluacion: "Síntesis evaluativa (evaluación de referencia)",
    observacionesEvaluacionAyuda:
      "Texto registrado al cerrar la evaluación. No se modifica desde el PACI.",
    sinEvaluacionReferencia: "Sin evaluación de referencia asignada.",
    sinConclusionesEvaluacion:
      "Esta evaluación no tiene conclusiones evaluativas. Los objetivos deben seleccionarse explícitamente.",
    objetivosIncluidos: "Objetivos incluidos en el PACI",
    seleccionarObjetivos: "Seleccionar objetivos PIE",
    sinObjetivos: "Aún no hay objetivos incluidos en este PACI.",
    sinObjetivosEstudiante:
      "El estudiante no tiene objetivos PIE registrados. Crea objetivos antes de completar el PACI.",
    trazabilidadTitulo: "Sustento evaluativo",
    sinSustentoEvaluativo: "Sin sustento evaluativo vinculado",
    conSustentoEvaluativo: "Con sustento evaluativo",
    conclusionesVinculadas: "Conclusiones vinculadas",
    hallazgosSustentantes: "Hallazgos sustentantes",
    dimensionProyectada: "Dimensión PIE",
    indicadoresTitulo: "Indicadores del PACI",
    cantidadObjetivos: "Objetivos",
    objetivosConSustento: "Con sustento evaluativo",
    objetivosSinSustento: "Sin sustento evaluativo",
    porcentajeTrazabilidad: "Trazabilidad evaluativa",
    conclusionesCubiertas: "Conclusiones cubiertas",
    vigenteResumenTitulo: "PACI vigente",
    sinPaciVigente:
      "No hay un PACI vigente para este estudiante. Puedes crear un borrador y declararlo cuando esté listo.",
    historialTitulo: "Historial de PACI",
    sinHistorial: "Aún no hay registros de PACI para este estudiante.",
    erroresDeclaracion: "No se puede declarar vigente",
    advertenciasDeclaracion: "Advertencias",
    declaracionExitosa: "PACI declarado vigente.",
    cierreExitoso: "PACI cerrado.",
    seleccionaEstudiante: "Selecciona un estudiante.",
    estudianteRequerido: "Debes indicar un estudiante para crear el PACI.",
    borradorExistente:
      "Ya existe un borrador para este período. Se abrirá el borrador existente.",
    columnaPeriodo: "Período",
    columnaEstado: "Estado",
    columnaObjetivos: "Objetivos",
    columnaAcciones: "Acciones",
    declaradoVigenteEn: "Declarado vigente",
    cerradoEn: "Cerrado",
  },

  estudiante: {
    eliminarTitulo: "Eliminar estudiante",
    eliminarMensajeIntro:
      "Esta acción eliminará al estudiante y todos los registros asociados en este entorno local.",
    eliminarMensajeListaIntro: "Se eliminarán:",
    eliminarMensajeItems: [
      "Perfil Base",
      "Objetivos PIE",
      "Intervenciones",
      "Evidencias",
      "Hallazgos",
      "Observaciones asociadas",
      "Apoyos registrados",
    ] as const,
    eliminarMensajeCierre: "Esta acción no se puede deshacer.",
    eliminarConfirmacionLabel: "Para continuar escribe:",
    eliminarConfirmacionTexto: "ELIMINAR",
    eliminarBotonCancelar: "Cancelar",
    eliminarBotonConfirmar: "Eliminar definitivamente",
    eliminarProtegido:
      "El estudiante base del sistema no puede eliminarse.",
    eliminarAccionListado: "Eliminar",
    eliminarAccionFicha: "Eliminar estudiante",
    eliminarExito: "Estudiante eliminado correctamente.",
    fichaEnfoque:
      "Ficha del estudiante · enfoque basado en fortalezas",
    listadoSubtitulo:
      "Fichas con enfoque en fortalezas, participación y bienestar escolar",
    quienEsPregunta: "Conocer al estudiante",
    quienEsTitulo: (nombre: string) => `Perfil de ${nombre}`,
    quienEsNota:
      "Esta ficha integra el Perfil del Estudiante (fortalezas e intereses) y el Perfil de Participación (contextos de éxito, condiciones, apoyos y espacios). No reemplaza evaluaciones clínicas ni diagnósticas.",
    vacioQuienEs:
      "Aún no hay observaciones suficientes para construir un perfil personalizado.\n\nRegistra intervenciones para documentar recursos del estudiante y condiciones de participación.",
    contextosExitoSubtitulo:
      "Condiciones donde el equipo ha documentado participación favorable",
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
