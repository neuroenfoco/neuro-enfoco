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
    institucionNeutra: "Plataforma institucional PIE",
  },

  institutionalGuidance: {
    cardTitles: {
      info: "¿Qué es este módulo?",
      orientacion: "Orientación",
      recomendacion: "Siguiente paso sugerido",
    },
    perfilBase: {
      eyebrow: "Conocimiento institucional consolidado",
      info: {
        title: "Perfil Base",
        body:
          "Referencia institucional compartida sobre fortalezas, intereses, contextos de éxito y condiciones que influyen en la participación del estudiante.",
        detail:
          "Se alimenta del ingreso PIE, la edición directa del equipo y el cierre de evaluaciones integrales. Las intervenciones pueden confirmar hallazgos, pero no reemplazan esta referencia común.",
      },
      recomendacionSinConsolidado: {
        body:
          "Aún no hay conocimiento consolidado en el Perfil Base. Puedes completar el ingreso PIE o registrar hallazgos directamente en esta pestaña.",
        ctaIngreso: "Ir a ingreso PIE",
      },
    },
    perfilEvolutivo: {
      info: {
        title: "Perfil Evolutivo",
        body:
          "Memoria longitudinal de todo el conocimiento registrado: lo consolidado en Perfil Base y lo emergente desde intervenciones.",
        detail:
          "Este perfil no evalúa al estudiante, no lo califica y no reemplaza una evaluación formal. Permite ver cómo evoluciona el conocimiento del equipo y con qué frecuencia se confirman hallazgos.",
      },
      recomendacionSinRegistros: {
        body:
          "Completa el Perfil Base o registra intervenciones para construir esta memoria longitudinal del estudiante.",
      },
    },
    evaluacionIntegral: {
      info: {
        title: "Evaluación Integral",
        body:
          "Proceso evaluativo interdisciplinario formal con equipo, hallazgos, conclusiones y fechas institucionales.",
        detail:
          "Formaliza y revisa el conocimiento institucional, actualiza el Perfil Base y sustenta objetivos y PACI. Puede coexistir con ingreso PIE previo; no es el único camino de entrada al sistema.",
      },
      recomendacionSinEvaluacion: {
        body:
          "No hay evaluación integral registrada. El Perfil Base puede existir igualmente; la evaluación formaliza hallazgos y sustenta conclusiones para objetivos y PACI.",
        cta: "Nueva evaluación",
      },
      recomendacionBorrador: {
        body:
          "Hay una evaluación en borrador. Al cerrarla, los hallazgos se consolidarán en el Perfil Base.",
        cta: "Continuar evaluación",
      },
    },
    objetivos: {
      info: {
        title: "Objetivos PIE",
        body:
          "Puente entre el conocimiento institucional y la práctica educativa: metas pedagógicas con línea base, condiciones de participación y apoyos planificados.",
        detail:
          "Pueden vincularse a conclusiones evaluativas o planificarse directamente. Los apoyos institucionales (ApoyoPIE) y el uso del apoyo en intervenciones se documentan en el seguimiento y las evidencias.",
      },
      recomendacionSinObjetivos: {
        body:
          "Aún no hay objetivos PIE. Puedes planificarlos desde conclusiones evaluativas o de forma directa con el equipo.",
        cta: "Nuevo objetivo",
      },
    },
    apoyos: {
      info: {
        title: "Apoyos institucionales",
        body:
          "Registro de los apoyos (ApoyoPIE) que el establecimiento planifica e implementa para favorecer la participación y el logro de objetivos PIE.",
        detail:
          "ApoyoPIE responde «¿Qué apoyo estamos implementando?». El uso concreto en cada intervención se documenta por separado («¿Qué apoyo utilizamos hoy?») mediante el catálogo de participación en evidencias.",
      },
      recomendacionSinRegistros: {
        body:
          "Aún no hay apoyos institucionales registrados. Puedes declararlos desde un objetivo PIE o desde la ficha del estudiante.",
        cta: "Ir a objetivos",
      },
    },
    intervenciones: {
      info: {
        title: "Intervenciones",
        body:
          "Registro de las acciones, el uso del apoyo y los acompañamientos documentados por el equipo en contextos concretos.",
        detail:
          "En cada intervención el equipo registra qué apoyos del catálogo utilizó o tuvo disponibles (uso del apoyo). Las intervenciones documentan evidencias y observaciones que contribuyen al seguimiento del estudiante y al fortalecimiento del conocimiento institucional.",
      },
      recomendacionSinRegistros: {
        body:
          "No hay intervenciones registradas. Documenta el acompañamiento pedagógico cuando el equipo implemente apoyos o experiencias con el estudiante.",
        cta: "Registrar intervención",
      },
    },
    comoFunciona: {
      vision:
        "Neuro Enfoco organiza conocimiento institucional, planificación pedagógica y seguimiento documentado sin reemplazar el juicio profesional del equipo.",
      ejePrincipal: [
        "Estudiante",
        "Perfil Base",
        "Objetivos",
        "Apoyos institucionales",
        "Intervenciones",
        "Evidencias",
        "Perfil Evolutivo",
      ],
      evaluacionComplementaria:
        "La Evaluación Integral es un proceso complementario que formaliza conocimiento, actualiza el Perfil Base y sustenta objetivos y PACI.",
    },
  },

  nav: {
    dashboard: "Dashboard",
    estudiantes: "Estudiantes",
    profesionales: "Profesionales",
    intervenciones: "Intervenciones",
    objetivos: "Objetivos",
    reportes: "Reportes",
    configuracion: "Configuración",
  },

  auth: {
    sesionActiva: "Sesión activa",
    sinAutenticacion: "Sin autenticación",
    usuarioDemo: "Usuario de demostración",
    avisoPreparacion:
      "La autenticación institucional estará disponible en una versión futura. Por ahora se utiliza un usuario de demostración con permisos completos.",
  },

  session: {
    titulo: "Sesión institucional",
    subtitulo:
      "Identidad y permisos del usuario conectado al establecimiento en esta sesión.",
    rolAsignado: "Rol asignado",
    estadoCuenta: "Estado de la cuenta",
    permisosActivos: "Permisos activos",
  },

  usuarios: {
    titulo: "Usuarios institucionales",
    subtitulo:
      "Personas con acceso a la plataforma según su rol en el establecimiento. La gestión de cuentas estará disponible en una versión futura.",
    avisoSoloLectura:
      "Vista informativa. No es posible crear, editar ni desactivar usuarios en esta versión.",
    columnaNombre: "Nombre",
    columnaRol: "Rol",
    columnaCorreo: "Correo",
    columnaEstado: "Estado",
    estadoActivo: "Activo",
    estadoInactivo: "Inactivo",
    sinRegistros: "No hay usuarios institucionales registrados.",
  },

  roles: {
    administrador: "Administrador",
    coordinadorPie: "Coordinador/a PIE",
    educadorDiferencial: "Educador/a diferencial",
    psicologo: "Psicólogo/a",
    fonoaudiologo: "Fonoaudiólogo/a",
    terapeutaOcupacional: "Terapeuta ocupacional",
    docente: "Docente",
  },

  permisos: {
    titulo: "Permisos institucionales",
    subtitulo:
      "Capacidades asignadas por rol para acceder y modificar registros del establecimiento.",
    estudiantesRead: "Consultar estudiantes",
    estudiantesWrite: "Gestionar estudiantes",
    evaluacionesRead: "Consultar evaluaciones",
    evaluacionesWrite: "Gestionar evaluaciones",
    objetivosRead: "Consultar objetivos PIE",
    objetivosWrite: "Gestionar objetivos PIE",
    intervencionesRead: "Consultar intervenciones",
    intervencionesWrite: "Registrar intervenciones",
    paciRead: "Consultar PACI",
    paciWrite: "Gestionar PACI",
    reportesRead: "Consultar reportes",
    configuracionWrite: "Administrar configuración",
  },

  configuracion: {
    titulo: "Configuración institucional",
    subtitulo:
      "Parámetros y administración de la plataforma para el establecimiento.",
    usuariosTitulo: "Usuarios de la plataforma",
    usuariosSubtitulo:
      "Accesos institucionales según rol y estado de cada persona del equipo.",
    avisoFuturo:
      "Esta sección prepara la arquitectura multiusuario. La autenticación real y la gestión de cuentas se integrarán en el backend institucional.",
  },

  profesional: {
    tituloListado: "Profesionales del establecimiento",
    subtituloListado:
      "Personas del equipo escolar que participan en intervenciones, evaluaciones, equipo de apoyo y otros procesos institucionales.",
    tituloNuevo: "Nuevo profesional",
    subtituloNuevo:
      "Registra a una persona del equipo para vincularla a intervenciones, evaluaciones y acompañamiento de estudiantes.",
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
      "Registro de transición para datos históricos del establecimiento.",
    indicadorTotal: "Total profesionales",
    indicadorActivos: "Profesionales activos",
    indicadorRoles: "Roles representados",
    eliminar: "Eliminar",
    eliminarTitulo: "Eliminar profesional",
    eliminarMensaje:
      "¿Estás seguro de eliminar a este profesional? Esta acción no se puede deshacer.",
    eliminarBotonCancelar: "Cancelar",
    eliminarBotonConfirmar: "Eliminar",
    eliminarExito: "Profesional eliminado correctamente.",
    eliminarEnUso:
      "No es posible eliminar este profesional porque está siendo utilizado en registros existentes.",
    eliminarNoPermitidoTransicion:
      "No es posible eliminar el registro de transición del establecimiento.",
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
      "Proceso evaluativo interdisciplinario que formaliza y revisa el conocimiento institucional del estudiante.",
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
      "El Ingreso PIE ya fue completado para este estudiante.",
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
      "Registro de acompañamientos, evidencias y observaciones del trabajo pedagógico con estudiantes.",
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
      "Acciones, apoyos y acompañamientos documentados con sus evidencias y observaciones asociadas.",
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
      "Objetivos activos, evidencias asociadas y seguimiento derivado de intervenciones registradas.",
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
      "Documenta las acciones implementadas, el uso del apoyo y las observaciones del acompañamiento pedagógico, con evidencia asociada.",
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
      "Memoria longitudinal del conocimiento construido sobre el estudiante y las condiciones de su participación, integrando Perfil Base e intervenciones.",
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
    seleccionaEstudiante: "Estudiante",
    selectorEstudiantePlaceholder: "Seleccionar estudiante",
    sinEstudiantes:
      "No existen estudiantes registrados.",
    crearEstudianteCta: "Crear estudiante",
    errorEstudianteRequerido: "Selecciona un estudiante.",
    estudianteNombreLabel: "Nombre",
    estudianteCursoLabel: "Curso",
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
      "Referencia institucional compartida sobre fortalezas, intereses, contextos de éxito y condiciones que influyen en la participación del estudiante.",
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

  apoyoPie: {
    entidad: "ApoyoPIE",
    capaInstitucional: "Apoyo institucional",
    capaUso: "Uso del apoyo",
    capaPlanificacion: "Apoyo planificado",
    preguntaInstitucional: "¿Qué apoyo estamos implementando?",
    preguntaUso: "¿Qué apoyo utilizamos hoy?",
    preguntaPlanificacion: "¿Qué apoyos anticipamos para este objetivo?",
    definicionInstitucional:
      "Entidad canónica ApoyoPIE: el apoyo que el establecimiento declara, asigna y da seguimiento (responsable, frecuencia, estado, vínculo con objetivos e intervenciones).",
    definicionUso:
      "Evidencia en intervenciones vía Sesion.apoyosUtilizados y el catálogo ApoyoSesionId. Documenta el uso concreto sin reemplazar el registro institucional ApoyoPIE.",
    definicionPlanificacion:
      "Intención pedagógica en ObjetivoPIE.apoyosPlanificadosIds. Orienta la planificación; no equivale al apoyo institucional ni al uso documentado.",
    notaLegacyApoyoImplementado:
      "El registro opcional «período declarado por el equipo» (ApoyoImplementado) es un concepto administrativo distinto de ApoyoPIE.",
  },

  apoyos: {
    utilizados: "Uso del apoyo",
    utilizadosSubtitulo:
      "¿Qué apoyo utilizamos hoy? Catálogo institucional presente o usado en esta intervención.",
    utilizadosAyuda:
      "Registra el uso del apoyo según el catálogo de participación. No declara el apoyo institucional (ApoyoPIE) ni implica efectividad; complementa la observación profesional.",
    queFacilitaron: "Apoyos que facilitaron la participación",
    deParticipacion: "Uso del apoyo en intervenciones",
    sugeridos:
      "Apoyos sugeridos según la dimensión PIE proyectada; orientación pedagógica que el equipo adapta al contexto.",
    suelenFacilitar: "Uso del apoyo registrado con frecuencia",
    yAjustes: "Apoyos y ajustes que facilitan la participación",
    sinRegistrados:
      "Aún no hay apoyos registrados en intervenciones.",
    implementados: "Apoyos implementados",
    participacionFicha: {
      etiquetaExperimental: "Vista experimental",
      titulo: "Uso del apoyo y participación",
      subtitulo: (nombre: string) =>
        `Resumen del uso del apoyo documentado en intervenciones de ${nombre} y los contextos en que el equipo registró experiencias de participación.`,
      ayuda:
        "Esta vista cruza uso del apoyo (evidencias en intervenciones) con planificación en objetivos. No establece relaciones causales ni reemplaza el juicio profesional ni el registro institucional ApoyoPIE.",
      resumenConteos: (ficha: {
        intervencionesConApoyosDocumentados: number;
        totalIntervenciones: number;
        apoyosDocumentados: { length: number };
      }) =>
        `${ficha.intervencionesConApoyosDocumentados} intervenciones con apoyos documentados de ${ficha.totalIntervenciones} registradas · ${ficha.apoyosDocumentados.length} apoyos distintos en el resumen.`,
      seccionApoyos: "Uso del apoyo documentado",
      seccionApoyosDescripcion:
        "Apoyos del catálogo registrados al documentar intervenciones y la participación observada en cada una.",
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
        "Apoyos previstos en objetivos que aún no aparecen en el uso del apoyo registrado en intervenciones.",
      planificadoEn: (objetivoNombre: string) =>
        `Planificado en: «${objetivoNombre}»`,
      sinApoyos:
        "No hay uso del apoyo documentado en las intervenciones registradas.",
      vacioTitulo: "Aún no existe información suficiente.",
      vacioTexto:
        "Esta vista se construye a partir de intervenciones registradas por el equipo educativo. A medida que se registren apoyos y experiencias de participación, aparecerá información aquí.",
      registrarIntervencion: "Registrar intervención",
    },
  },

  barrerasApoyos: {
    titulo: "Barreras y apoyos",
    subtitulo:
      "Barreras identificadas desde evaluación integral y apoyos sugeridos según la dimensión PIE de cada objetivo.",
    barreras: "Barreras",
    apoyos: "Apoyos",
    apoyosSugeridos: "Apoyos sugeridos",
    barrerasIdentificadas: "Barreras identificadas",
    barrerasRelacionadas: "Barreras relacionadas",
    apoyosRecomendados: "Apoyos recomendados",
    apoyosRecomendadosAyuda:
      "Orientación pedagógica según dimensión proyectada; el equipo decide qué implementar.",
    porQueEsteObjetivo: "¿Por qué este objetivo?",
    conclusionesRelacionadas: "Conclusiones evaluativas relacionadas",
    trazabilidad:
      "La trazabilidad evaluativa conecta hallazgos, conclusiones y objetivos PIE para fundamentar la planificación pedagógica.",
    sinBarreras:
      "Aún no hay barreras identificadas desde evaluación vinculada a este objetivo.",
    sinApoyos:
      "No hay apoyos sugeridos para la dimensión proyectada de este objetivo.",
    sinObjetivos: "Aún no hay objetivos PIE para analizar.",
    sinSustentoEvaluativo:
      "Sin conclusiones evaluativas vinculadas. La planificación se orienta desde el equipo.",
    origenConclusion: "Conclusión",
    origenHallazgo: "Hallazgo",
    verDetalleObjetivo: "Ver detalle del objetivo →",
    verEvaluacion: "Ver evaluación integral →",
    irEvaluacion: "Ir a evaluación integral →",
    resumenBarreras: "Barreras identificadas",
    resumenApoyos: "Apoyos sugeridos",
    resumenConSustento: "Con sustento evaluativo",
    resumenSinSustento: "Sin sustento evaluativo",
    tipoApoyo: (tipo: string) => {
      switch (tipo) {
        case "adaptacion_acceso":
          return "Adaptación de acceso";
        case "adaptacion_curricular":
          return "Adaptación curricular";
        case "apoyo_emocional":
          return "Apoyo emocional";
        case "apoyo_sensorial":
          return "Apoyo sensorial";
        case "apoyo_comunicacion":
          return "Apoyo comunicacional";
        case "apoyo_conductual":
          return "Apoyo conductual";
        default:
          return "Otro apoyo";
      }
    },
  },

  apoyosConsolidados: {
    titulo: "Planificación y uso del apoyo",
    subtitulo:
      "Cruza apoyos planificados en el objetivo con el uso del apoyo documentado en intervenciones vinculadas.",
    ayuda:
      "No implica efectividad del apoyo. Refleja planificación pedagógica y registros de uso en intervenciones.",
    sinDatos:
      "Aún no hay apoyos planificados ni uso del apoyo documentado para este objetivo.",
    chipPlanificados: "Planificados",
    chipDocumentados: "Uso documentado",
    chipIntervencionesConApoyos: "Intervenciones con uso del apoyo",
    chipPrimeraDocumentacion: "Primera documentación",
    chipUltimaDocumentacion: "Última documentación",
    grupoPlanificadosYDocumentados: "Planificados con uso documentado",
    grupoPlanificadosSinDocumentacion: "Planificados, sin uso documentado aún",
    grupoDocumentadosSinPlanificacion: "Uso documentado sin planificación previa",
    vacioPlanificadosYDocumentados:
      "No hay apoyos planificados con uso documentado en intervenciones.",
    vacioPlanificadosSinDocumentacion:
      "No hay apoyos planificados pendientes de documentar en intervenciones.",
    vacioDocumentadosSinPlanificacion:
      "No hay uso del apoyo documentado fuera de la planificación del objetivo.",
    planificadoSinRegistro:
      "Planificado en este objetivo; aún sin uso del apoyo registrado en intervenciones vinculadas.",
    estadoPlanificadoYDocumentado: "Planificado y con uso documentado",
    estadoPlanificadoSinDocumentacion: "Planificado, sin uso documentado aún",
    estadoDocumentadoSinPlanificacion: "Uso documentado en intervenciones",
  },

  apoyosImplementados: {
    titulo: "Apoyos implementados",
    subtituloObjetivo:
      "¿Qué apoyo estamos implementando? Registro institucional ApoyoPIE vinculado a este objetivo PIE.",
    subtituloEstudiante:
      "¿Qué apoyo estamos implementando? Apoyos institucionales (ApoyoPIE) del estudiante y sus objetivos.",
    ayudaInstitucional:
      "ApoyoPIE es el apoyo institucional: responsable, frecuencia, estado y trazabilidad operacional. El uso en cada intervención se registra por separado.",
    nuevoApoyo: "Registrar apoyo institucional",
    guardar: "Guardar apoyo",
    guardarCambios: "Guardar cambios",
    editarApoyo: "Editar apoyo",
    editar: "Editar",
    eliminar: "Eliminar",
    cancelar: "Cancelar",
    confirmarEliminar: "¿Eliminar este apoyo institucional (ApoyoPIE)?",
    sinApoyos: "Aún no hay apoyos institucionales (ApoyoPIE) registrados.",
    crearDesdeSugerido: "Registrar como apoyo institucional",
    verObjetivo: "Ver objetivo →",
    campoNombre: "Nombre del apoyo",
    campoTipo: "Tipo de apoyo",
    campoDescripcion: "Descripción",
    responsable: "Responsable",
    sinAsignar: "Sin asignar",
    frecuencia: "Frecuencia",
    frecuenciaPlaceholder: "Ej.: Diario en aula",
    estadoApoyo: "Estado del apoyo",
    estadoActivo: "Activo",
    estadoSuspendido: "Suspendido",
    estadoFinalizado: "Finalizado",
    grupoActivos: "Apoyos activos",
    grupoSuspendidos: "Apoyos suspendidos",
    grupoFinalizados: "Apoyos finalizados",
    intervencionesVinculadas: "Intervenciones vinculadas",
    apoyosRelacionados: "Apoyos relacionados",
    actividadApoyo: "Actividad del apoyo",
    sinActividad: "Sin actividad registrada",
    metricaIntervenciones: "Intervenciones",
    metricaEvidencias: "Evidencias",
    ultimaIntervencion: "Última intervención",
    ultimaActividad: "Última actividad",
    vincularIntervencion: "Vincular intervención",
    vincularApoyo: "Vincular apoyo institucional",
    seleccionarIntervencion: "Seleccionar intervención",
    seleccionarApoyo: "Seleccionar apoyo institucional",
    vincular: "Vincular",
    desvincular: "Desvincular",
    sinIntervencionesVinculadas: "Sin intervenciones vinculadas a este apoyo.",
    sinApoyosRelacionados: "Sin apoyos institucionales relacionados.",
    confirmarDesvincularIntervencion:
      "¿Desvincular esta intervención del apoyo institucional?",
    confirmarDesvincularApoyo:
      "¿Desvincular este apoyo institucional de la intervención?",
    efectividadOperacional: {
      titulo: "Efectividad operacional",
      subtitulo:
        "Nivel de actividad y evidencia registrada en intervenciones vinculadas. No evalúa el éxito educativo del apoyo.",
      sinActividad: "Sin actividad",
      actividadInicial: "Actividad inicial",
      enDesarrollo: "En desarrollo",
      conEvidencia: "Con evidencia",
      estadoOperacional: "Estado operacional",
      observacionSinActividad:
        "Sin intervenciones ni evidencias vinculadas a este apoyo.",
      observacionActividadInicial:
        "Hay intervenciones vinculadas, pero aún no se registran evidencias.",
      observacionEnDesarrollo:
        "Intervenciones y evidencias en desarrollo; la trazabilidad operacional avanza.",
      observacionConEvidencia:
        "Intervenciones y evidencias consolidadas en el registro institucional.",
    },
    estadoOperacionalApoyo: {
      titulo: "Estado operacional",
      aclaracion:
        "Uso documentado en intervenciones vinculadas. No afirma que el apoyo figure en el registro de uso del catálogo de la sesión.",
      sinTrazabilidad: "Sin trazabilidad operacional",
      usoDocumentado: "Uso documentado",
      usoFrecuente: "Uso frecuente",
      vinculadoSinEvidencias: "Sin uso documentado",
      observacionSinTrazabilidad:
        "No hay intervenciones vinculadas a este apoyo institucional.",
      observacionUsoDocumentado:
        "Uso documentado en intervenciones vinculadas (sesiones registradas en la cadena).",
      observacionUsoFrecuente:
        "Actividad recurrente en intervenciones vinculadas y sesiones asociadas.",
      observacionVinculadoSinEvidencias:
        "Hay intervenciones vinculadas, pero aún no hay sesiones documentadas en esa cadena.",
    },
    resumenOperacionalObjetivo: {
      titulo: "Apoyos institucionales",
      usoFrecuente: "Uso frecuente",
      usoDocumentado: "Uso documentado",
      sinUsoDocumentado: "Sin uso documentado",
      sinTrazabilidad: "Sin trazabilidad",
      alertaSinTrazabilidad:
        "Hay apoyos institucionales sin intervenciones vinculadas.",
      alertaSinUsoDocumentado:
        "Hay apoyos vinculados que aún no registran actividad documentada.",
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
    identificadas:
      "Barreras identificadas desde evaluación integral que orientan la planificación pedagógica.",
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
      "Planificación pedagógica individualizada vinculada al perfil y, cuando corresponde, a conclusiones de evaluación integral.",
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
        "¿Qué apoyos anticipamos para este objetivo? Mismo catálogo que el uso del apoyo en intervenciones. Los espacios se planifican por separado.",
      bloqueApoyosCatalogoTitulo: "Catálogo de apoyos planificados",
      bloqueApoyosCatalogoSub:
        "Selecciona apoyos del catálogo institucional (ApoyoSesionId). La implementación institucional (ApoyoPIE) y el uso en intervenciones se registran después.",
      apoyosVaciosAviso:
        "No has seleccionado apoyos planificados. Puedes guardar el objetivo y completarlos después.",
      apoyoOtroPlaceholder: "Describe el apoyo u otro recurso planificado",
      bloqueObservaciones: "Observaciones del equipo",
      bloqueObservacionesSub:
        "Contexto adicional para el equipo (opcional).",
      guardar: "Guardar objetivo",
      guardarCambios: "Guardar cambios",
    },
    seguimiento: {
      titulo: "Seguimiento del objetivo",
      intervencionesRegistradas: "Intervenciones registradas",
      evidenciasRegistradas: "Evidencias registradas",
      ultimaActividad: "Última actividad",
      sinActividad: "Sin actividad registrada",
      verObjetivo: "Ver detalle del objetivo →",
      registrarSeguimiento: "Registrar intervención →",
      estadoActivo: "Activo",
      estadoAtencion: "Atención",
      estadoRiesgo: "Riesgo",
      estadoSinSeguimiento: "Sin seguimiento",
    },
    detalle: {
      eyebrow: "Objetivo",
      metaEsperada: "Meta esperada",
      estudiante: "Estudiante",
      dimension: "Dimensión relacionada",
      apoyosActivos: "Apoyos institucionales activos",
      fundamentoTitulo: "¿Por qué existe este objetivo?",
      condicionesTitulo: "Condiciones que dificultan la participación",
      condicionesPlanificacion: "Desde la planificación del objetivo",
      condicionesEvaluacion: "Desde la evaluación integral",
      facilitadoresTitulo: "Condiciones que favorecen la participación",
      facilitadoresSubtitulo:
        "Referencia desde el Perfil Base del estudiante para orientar la planificación y los apoyos asociados a este objetivo.",
      facilitadoresFortalezas: "Fortalezas observadas",
      facilitadoresIntereses: "Intereses relevantes",
      facilitadoresContextos: "Contextos de éxito conocidos",
      facilitadoresVacio:
        "Aún no existen fortalezas, intereses o contextos de éxito consolidados en el Perfil Base del estudiante.",
      verPerfilBase: "Ver Perfil Base completo →",
      situacionInicial: "Situación inicial",
      lineaBase: "Línea base",
      fechaLineaBase: "Fecha de línea base",
      evidenciasTitulo: "Evidencias y avance",
      cadenaAriaLabel: "Secuencia conceptual del trabajo pedagógico",
      cadenaConceptual: [
        "Perfil Base",
        "Objetivo",
        "Apoyos implementados",
        "Intervenciones",
        "Evidencias",
      ],
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
    apoyosMasUtilizados: "Uso del apoyo más frecuente",
    espaciosMasUtilizados: "Espacios más utilizados",
    objetivosMasTrabajados: "Objetivos más trabajados",
    trabajoPedagogico: "Trabajo pedagógico realizado",
    trabajoPedagogicoSubtitulo:
      "Participación documentada en intervenciones y objetivos vinculados.",
    tiempoAcumulado: "Tiempo acumulado",
    apoyosDistintos: "Apoyos distintos en uso documentado",
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
    eliminarAccionListado: "Eliminar",
    eliminarAccionFicha: "Eliminar estudiante",
    eliminarExito: "Estudiante eliminado correctamente.",
    resumenIntegralTitulo: "Seguimiento integral",
    kpiObjetivosPieActivos: "Objetivos PIE activos",
    kpiIntervencionesRegistradas: "Intervenciones registradas",
    kpiEvaluacionesIntegrales: "Evaluaciones integrales",
    kpiPaciEstado: "Estado PACI",
    paciEstadoSinPaci: "Sin PACI",
    timelineTitulo: "Actividad reciente",
    timelineSubtitulo:
      "Evaluaciones, intervenciones y cambios de PACI en orden cronológico.",
    timelineVacio:
      "Aún no hay actividad registrada para construir una línea de tiempo.",
    timelineTipoEvaluacion: "Evaluación",
    timelineTipoIntervencion: "Intervención",
    timelineTipoPaci: "PACI",
    timelineEvaluacionResumen: (tipo: string, estado: string) =>
      `${tipo} · ${estado}`,
    timelineIntervencionResumen: (tipo: string) =>
      `Intervención de ${tipo.toLowerCase()} registrada.`,
    timelineIntervencionConLogro: (tipo: string, logro: string) =>
      `${tipo}: ${logro}`,
    timelinePaciCreado: (periodo: string) =>
      `Borrador PACI creado para ${periodo}.`,
    timelinePaciVigente: (periodo: string) =>
      `PACI declarado vigente para ${periodo}.`,
    timelinePaciCerrado: (periodo: string) =>
      `PACI cerrado para ${periodo}.`,
    accionesSugeridasTitulo: "Próximas acciones sugeridas",
    accionesSugeridasSubtitulo:
      "Orientaciones según el estado del proceso pedagógico del estudiante.",
    accionesSugeridasVacio:
      "El seguimiento está al día según los registros actuales.",
    progresoInstitucional: {
      titulo: "Progreso institucional",
      subtitulo:
        "Estado del ciclo pedagógico según registros actuales del estudiante.",
      siguientePasoTitulo: "Siguiente paso sugerido",
      sinAccionPrioritaria: "No hay acciones prioritarias sugeridas.",
      nodoPerfilBase: "Perfil Base",
      nodoObjetivos: "Objetivos",
      nodoApoyos: "Apoyos",
      nodoIntervenciones: "Intervenciones",
      nodoEvidencias: "Evidencias",
      nodoPerfilEvolutivo: "Perfil Evolutivo",
      resumenPerfilBaseVerde: (n: number) =>
        `${n} hallazgo${n === 1 ? "" : "s"} consolidado${n === 1 ? "" : "s"}`,
      resumenPerfilBaseAmarillo: (n: number) =>
        `${n} hallazgo${n === 1 ? "" : "s"} consolidado${n === 1 ? "" : "s"} — ampliar perfil`,
      resumenPerfilBaseIngresoSinHallazgos:
        "Ingreso PIE completo — sin hallazgos consolidados aún",
      resumenPerfilBaseRojo: "Sin ingreso PIE ni hallazgos consolidados",
      resumenObjetivosVerde: (n: number) =>
        `${n} objetivo${n === 1 ? "" : "s"} sin alertas de seguimiento`,
      resumenObjetivosAmarillo: (n: number, riesgo: boolean, atencion: boolean) => {
        const partes: string[] = [];
        if (riesgo) partes.push("riesgo");
        if (atencion) partes.push("atención");
        const alerta = partes.join(" y ");
        return `${n} objetivo${n === 1 ? "" : "s"} — seguimiento en ${alerta}`;
      },
      resumenObjetivosRojo: "Sin objetivos PIE registrados",
      resumenApoyosSinRegistros: "Sin apoyos institucionales registrados",
      resumenApoyosVerde: (n: number) =>
        `${n} apoyo${n === 1 ? "" : "s"} con trazabilidad operacional`,
      resumenApoyosSinTrazabilidad: (n: number) =>
        `${n} apoyo${n === 1 ? "" : "s"} sin trazabilidad operacional`,
      resumenApoyosSinUsoDocumentado: (n: number) =>
        `${n} apoyo${n === 1 ? "" : "s"} sin uso documentado`,
      resumenIntervencionesVerde: (n: number) =>
        `Actividad en los últimos 30 días (${n} intervención${n === 1 ? "" : "es"})`,
      resumenIntervencionesAmarillo: (n: number) =>
        `${n} intervención${n === 1 ? "" : "es"} sin actividad reciente`,
      resumenIntervencionesRojo: "Sin intervenciones registradas",
      resumenEvidenciasVerde: (n: number) =>
        `Evidencias recientes (${n} sesión${n === 1 ? "" : "es"})`,
      resumenEvidenciasAmarillo: (n: number) =>
        `${n} sesión${n === 1 ? "" : "es"} sin registros recientes`,
      resumenEvidenciasRojo: "Sin registros de evidencia",
      resumenPerfilEvolutivoVerde: (n: number) =>
        `${n} registro${n === 1 ? "" : "s"} en memoria evolutiva`,
      resumenPerfilEvolutivoAmarillo: (n: number) =>
        `${n} registro${n === 1 ? "" : "s"} — memoria evolutiva escasa`,
      resumenPerfilEvolutivoRojo: "Sin registros evolutivos",
    },
    accionEvaluacionTitulo: "Iniciar evaluación integral",
    accionEvaluacionDescripcion:
      "Aún no hay evaluación integral registrada. Inicia el proceso evaluativo interdisciplinario.",
    accionEvaluacionCta: "Ir a evaluación integral",
    accionObjetivosTitulo: "Definir objetivos PIE",
    accionObjetivosDescripcion:
      "Hay evaluación registrada pero sin objetivos PIE. Planifica objetivos a partir de las conclusiones evaluativas.",
    accionObjetivosCta: "Ir a objetivos",
    accionPaciTitulo: "Crear PACI",
    accionPaciDescripcion:
      "Existen objetivos PIE pero aún no hay PACI. Articula evaluación y objetivos en un documento institucional.",
    accionPaciCta: "Crear PACI",
    accionSeguimientoTitulo: "Registrar seguimiento",
    accionSeguimientoDescripcion:
      "El PACI está vigente y no hay intervenciones recientes. Documenta el seguimiento pedagógico del período.",
    accionSeguimientoCta: "Registrar intervención",
    accionObjetivoSinSeguimientoTitulo: "Registrar intervención por objetivo",
    accionObjetivoSinSeguimientoDescripcion:
      "Hay objetivos PIE sin intervenciones asociadas. Documenta el seguimiento pedagógico.",
    accionObjetivoSinSeguimientoCta: "Ir a intervenciones",
    accionObjetivoRiesgoTitulo: "Seguimiento prioritario",
    accionObjetivoRiesgoDescripcion:
      "Hay objetivos con más de 60 días sin actividad registrada. Revisa el seguimiento.",
    accionObjetivoRiesgoCta: "Revisar seguimiento",
    accionObjetivoSinEvidenciasTitulo: "Registrar evidencias",
    accionObjetivoSinEvidenciasDescripcion:
      "Hay objetivos con intervenciones pero sin evidencias vinculadas.",
    accionObjetivoSinEvidenciasCta: "Registrar evidencias",
    seguimientoObjetivos: {
      titulo: "Seguimiento de objetivos",
      subtitulo:
        "Intervenciones y evidencias consolidadas por objetivo PIE activo.",
      irIntervenciones: "Ir a intervenciones →",
      sinObjetivos: "Aún no hay objetivos PIE para seguir.",
      resumenActivos: "Objetivos activos",
      resumenConSeguimiento: "Objetivos con seguimiento",
      resumenSeguimientoActivo: "Objetivos con seguimiento activo",
      resumenEnAtencion: "En atención",
      resumenEnRiesgo: "En riesgo",
    },
    fichaEnfoque:
      "Ficha del estudiante · enfoque basado en fortalezas",
    listadoSubtitulo:
      "Fichas con enfoque en fortalezas, participación y bienestar escolar",
    nuevoCta: "Nuevo estudiante",
    nuevoTitulo: "Nuevo estudiante",
    nuevoSubtitulo:
      "Registra datos básicos para abrir la ficha de seguimiento. No requiere ingreso PIE.",
    nuevoNotaIngresoPie:
      "Si ya existe evaluación integral previa y debes documentar el ingreso PIE, usa",
    nuevoGuardar: "Crear estudiante",
    nuevoCancelar: "Cancelar",
    guardando: "Guardando…",
    volverListado: "Volver a estudiantes",
    labelNombre: "Nombre del estudiante",
    labelCurso: "Curso",
    placeholderNombre: "Ej: Tomás Herrera",
    placeholderCurso: "Ej: 4° Básico",
    errorNombreRequerido: "Ingresa el nombre del estudiante.",
    errorCursoRequerido: "Ingresa el curso del estudiante.",
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

  reportes: {
    titulo: "Reportes institucionales",
    subtitulo:
      "Vistas consolidadas de estado, seguimiento de objetivos, apoyos institucionales (ApoyoPIE) y alertas a partir de los registros del equipo PIE.",
    estadoInstitucional: {
      titulo: "Estado institucional",
      subtitulo:
        "Indicadores agregados de estudiantes, evaluaciones, objetivos PIE, PACI y apoyos institucionales (ApoyoPIE).",
    },
    seguimientoObjetivos: {
      titulo: "Seguimiento de objetivos",
      subtitulo:
        "Estado de seguimiento por objetivo PIE activo según intervenciones y evidencias registradas.",
      exportarCsv: "Exportar CSV",
      sinRegistros: "No hay objetivos PIE registrados.",
      columnaEstudiante: "Estudiante",
      columnaObjetivo: "Objetivo",
      columnaEstado: "Estado de seguimiento",
      columnaUltimaActividad: "Última actividad",
      columnaIntervenciones: "Intervenciones",
      columnaEvidencias: "Evidencias",
    },
    apoyosImplementados: {
      titulo: "Apoyos institucionales (ApoyoPIE)",
      subtitulo:
        "¿Qué apoyo estamos implementando? Apoyos declarados por el establecimiento con trazabilidad operacional de intervenciones y evidencias.",
      exportarCsv: "Exportar CSV",
      sinRegistros: "No hay apoyos institucionales (ApoyoPIE) registrados.",
      columnaEstudiante: "Estudiante",
      columnaApoyo: "Apoyo",
      columnaResponsable: "Responsable",
      columnaFrecuencia: "Frecuencia",
      columnaEstado: "Estado",
      columnaIntervenciones: "Intervenciones",
      columnaEvidencias: "Evidencias",
      columnaEstadoOperacional: "Estado operacional",
    },
    alertas: {
      titulo: "Alertas institucionales",
      subtitulo:
        "Situaciones agrupadas que requieren revisión del equipo según trazabilidad registrada.",
      exportarCsv: "Exportar CSV",
      sinAlertas: "No hay alertas institucionales en este momento.",
      grupoEvaluacionPendiente: "Evaluación pendiente",
      grupoSeguimiento: "Seguimiento",
      grupoApoyos: "Apoyos",
      grupoPaci: "PACI",
      columnaGrupo: "Grupo",
      columnaTipo: "Tipo",
      columnaTitulo: "Título",
      columnaDescripcion: "Descripción",
      columnaEstudiante: "Estudiante",
    },
    estadoVacio: {
      titulo: "Sin datos para reportes",
      descripcion:
        "Registra estudiantes y su trazabilidad PIE para generar reportes institucionales.",
      irEstudiantes: "Ir a estudiantes",
    },
  },

  dashboard: {
    titulo: "Gestión institucional PIE",
    subtitulo:
      "Indicadores, alertas y actividad reciente del equipo PIE a partir de evaluaciones, objetivos, intervenciones y PACI registrados.",
    irIngresoPie: "Iniciar ingreso PIE",
    irNuevoEstudiante: "Nuevo estudiante",
    verEstudiantes: "Ver estudiantes",
    estadoVacio: {
      titulo: "Bienvenido a Neuro Enfoco",
      descripcion: "No existen estudiantes registrados.",
    },
    indicadores: {
      titulo: "Indicadores institucionales",
      subtitulo:
        "Resumen operativo de estudiantes, evaluaciones, objetivos PIE, PACI e intervenciones.",
      estudiantesActivos: "Estudiantes activos",
      evaluacionesIntegrales: "Evaluaciones integrales",
      estudiantesSinEvaluacion: "Sin evaluación integral",
      objetivosActivos: "Objetivos PIE activos",
      objetivosConSeguimiento: "Objetivos con seguimiento",
      objetivosEnRiesgo: "Objetivos en riesgo",
      pacisVigentes: "PACI vigentes",
      pacisBorrador: "PACI en borrador",
      intervencionesUltimoMes: "Intervenciones (30 días)",
      evidenciasUltimoMes: "Evidencias (30 días)",
      apoyosActivos: "Apoyos institucionales activos",
      apoyosSuspendidos: "Apoyos institucionales suspendidos",
      apoyosFinalizados: "Apoyos institucionales finalizados",
      apoyosConActividad: "Apoyos institucionales con actividad vinculada",
      apoyosSinActividad: "Apoyos institucionales sin actividad vinculada",
      apoyosConEvidencia: "Apoyos institucionales con evidencia operacional",
    },
    alertas: {
      titulo: "Alertas prioritarias",
      subtitulo:
        "Situaciones que requieren revisión del equipo según seguimiento y trazabilidad registrada.",
      sinAlertas: "No hay alertas prioritarias en este momento.",
      tituloObjetivoRiesgo: "Objetivo en riesgo",
      descripcionObjetivoRiesgo: (nombre: string) =>
        `El objetivo «${nombre}» supera 60 días sin actividad documentada.`,
      tituloObjetivoSinSeguimiento: "Objetivo sin seguimiento",
      descripcionObjetivoSinSeguimiento: (nombre: string) =>
        `El objetivo «${nombre}» no tiene intervenciones registradas.`,
      tituloEvaluacionPendiente: "Evaluación pendiente",
      descripcionEvaluacionPendiente: (nombre: string) =>
        `${nombre} aún no cuenta con evaluación integral registrada.`,
      tituloPaciBorrador: "PACI en borrador prolongado",
      descripcionPaciBorrador: (periodo: string, estudiante: string) =>
        `PACI ${periodo} de ${estudiante} lleva más de 30 días sin declararse vigente.`,
      tituloApoyoSinActividadProlongada: "Apoyo activo sin actividad",
      descripcionApoyoSinActividadProlongada: (nombre: string) =>
        `El apoyo «${nombre}» lleva más de 30 días activo sin intervenciones ni evidencias vinculadas.`,
      tituloApoyoActividadInicialProlongada: "Apoyo con actividad inicial prolongada",
      descripcionApoyoActividadInicialProlongada: (nombre: string) =>
        `El apoyo «${nombre}» lleva más de 60 días con intervenciones vinculadas pero sin evidencias registradas.`,
      tipoCritica: "Crítica",
      tipoAtencion: "Atención",
      tipoEvaluacionPendiente: "Evaluación pendiente",
      tipoSeguimientoAdministrativo: "Seguimiento administrativo",
      verEstudiante: "Ver estudiante →",
    },
    actividadReciente: {
      titulo: "Actividad reciente",
      subtitulo:
        "Últimos registros de evaluaciones, intervenciones y cambios de estado PACI.",
      sinActividad: "Aún no hay actividad institucional registrada.",
      resumenIntervencion: (tipo: string, estudiante: string) =>
        `${tipo} · ${estudiante}`,
      tipoPaciVigente: "PACI vigente",
      tipoPaciCerrado: "PACI cerrado",
    },
    barrerasApoyos: {
      titulo: "Barreras y apoyos",
      subtitulo:
        "Agregado institucional de barreras identificadas, apoyos sugeridos y sustento evaluativo en objetivos PIE.",
      barrerasIdentificadas: "Barreras identificadas",
      apoyosSugeridos: "Apoyos sugeridos",
      objetivosConSustento: "Con sustento evaluativo",
      objetivosSinSustento: "Sin sustento evaluativo",
    },
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
