/**
 * Textos de catálogos institucionales (espacios, tipos de intervención).
 * Los archivos de catálogo consumen estos textos y añaden metadatos técnicos.
 */

export const CATALOG_COPY = {
  espacios: {
    sala_multisensorial: {
      nombre: "Sala multisensorial",
      descripcion:
        "Espacio con estímulos sensoriales controlados para regulación y exploración.",
    },
    espacio_calma: {
      nombre: "Espacio de calma",
      descripcion:
        "Ambiente de baja demanda para autorregulación y descanso.",
    },
    aula_recursos: {
      nombre: "Aula de recursos",
      descripcion:
        "Espacio del equipo PIE o de especialidad para apoyos diferenciados.",
    },
    sala_tea: {
      nombre: "Sala TEA",
      descripcion:
        "Espacio con apoyos para la participación y el bienestar de estudiantes con TEA.",
    },
    oficina_convivencia: {
      nombre: "Oficina de convivencia",
      descripcion:
        "Espacio para mediación, acuerdos y trabajo socioemocional.",
    },
    sala_apoyo: {
      nombre: "Sala de apoyo",
      descripcion:
        "Espacio general de apoyo pedagógico o psicosocial.",
    },
    otro: {
      nombre: "Otro",
      descripcion: "Espacio no clasificado en las categorías anteriores.",
    },
  },
  tiposIntervencion: {
    apoyo_en_aula: {
      nombre: "Apoyo en aula",
      descripcion:
        "Acompañamiento pedagógico dentro del aula regular o especial de origen.",
    },
    sesion_individual: {
      nombre: "Intervención individual",
      descripcion:
        "Trabajo uno a uno con el estudiante, dentro o fuera del aula.",
    },
    sesion_grupal: {
      nombre: "Intervención grupal",
      descripcion:
        "Trabajo con un grupo reducido de estudiantes con objetivos compartidos.",
    },
    espacio_calma: {
      nombre: "Espacio de calma",
      descripcion:
        "Intervención en espacio de autorregulación y descanso sensorial.",
    },
    sala_multisensorial: {
      nombre: "Sala multisensorial",
      descripcion:
        "Intervención en sala multisensorial con estímulos controlados.",
    },
    aula_recursos: {
      nombre: "Aula de recursos",
      descripcion:
        "Apoyo desde el equipo de aula de recursos o especialidad PIE.",
    },
    acompañamiento_recreo: {
      nombre: "Acompañamiento en recreo",
      descripcion:
        "Mediación y apoyo durante el recreo o momentos de mayor demanda social.",
    },
    mediacion_convivencia: {
      nombre: "Mediación de convivencia",
      descripcion:
        "Intervención focalizada en conflictos, acuerdos y habilidades prosociales.",
    },
    orientacion_familiar: {
      nombre: "Orientación familiar",
      descripcion:
        "Trabajo con apoderados o familia para continuidad de apoyos en el hogar.",
    },
    otro: {
      nombre: "Otro",
      descripcion: "Intervención que no encaja en las categorías anteriores.",
    },
  },
} as const;
