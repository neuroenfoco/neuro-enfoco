import type { ApoyoSesionId } from "@/lib/sesiones-form-catalog";

/**
 * Relación pedagógica condición → apoyos de participación (catálogo canónico).
 * Orienta sugerencias en planificación de objetivos; no implica prescripción automática.
 */
export const APOYOS_SUGERIDOS_POR_CONDICION_NOMBRE: Readonly<
  Record<string, readonly ApoyoSesionId[]>
> = {
  "Ruidos fuertes o inesperados": ["ajustes_sensoriales", "pausa_regulacion"],
  "Espacios muy concurridos o bulliciosos": [
    "ajustes_sensoriales",
    "actividad_estructurada",
    "apoyo_individual",
  ],
  "Iluminación intensa o parpadeante": ["ajustes_sensoriales"],
  "Olores, texturas o estímulos intensos": ["ajustes_sensoriales"],
  "Exceso de información visual en el entorno": [
    "instrucciones_visuales",
    "apoyo_visual_personalizado",
    "pictogramas",
  ],
  "Cambios imprevistos en la rutina": [
    "agenda_visual",
    "anticipacion_verbal",
    "tiempo_transicion",
    "temporizador_visual",
  ],
  "Falta de estructura o instrucciones poco claras": [
    "actividad_estructurada",
    "instrucciones_visuales",
    "secuencia_visual",
  ],
  "Transiciones bruscas entre actividades": [
    "tiempo_transicion",
    "anticipacion_verbal",
    "temporizador_visual",
  ],
  "Imprevistos sin anticipación": ["anticipacion_verbal", "agenda_visual"],
  "Cambios de espacio o de adulto a cargo": [
    "anticipacion_verbal",
    "tiempo_transicion",
  ],
  "Consignas largas o ambiguas": [
    "instrucciones_visuales",
    "pictogramas",
    "actividad_estructurada",
  ],
  "Tiempos de respuesta muy acotados": [
    "temporizador_visual",
    "tiempo_transicion",
  ],
  "Tareas extensas sin pausas": ["actividad_estructurada", "pausa_regulacion"],
  "Exceso de demandas simultáneas": [
    "actividad_estructurada",
    "apoyo_individual",
    "secuencia_visual",
  ],
  "Actividades sin propósito claro para el estudiante": [
    "actividad_basada_intereses",
    "actividad_estructurada",
  ],
  "Falta de apoyos visuales o concretos": [
    "pictogramas",
    "instrucciones_visuales",
    "secuencia_visual",
    "apoyo_visual_personalizado",
  ],
  "Actividades grupales numerosas": [
    "actividad_estructurada",
    "apoyo_individual",
    "companero_tutor",
  ],
  "Situaciones sociales no estructuradas (recreos, trabajos libres)": [
    "actividad_estructurada",
    "anticipacion_verbal",
  ],
  "Expectativa de contacto visual o cercanía física": [
    "apoyo_individual",
    "refuerzo_positivo",
  ],
  "Lenguaje figurado, ironías o dobles sentidos": [
    "instrucciones_visuales",
    "pictogramas",
    "modelado",
  ],
  "Presión por participar de forma oral o pública": [
    "apoyo_individual",
    "refuerzo_positivo",
    "tecnologia_apoyo",
  ],
  "Situaciones de estrés o frustración sin apoyo": [
    "pausa_regulacion",
    "refuerzo_positivo",
    "apoyo_individual",
  ],
  "Falta de espacios o tiempos para autorregularse": [
    "pausa_regulacion",
    "ajustes_sensoriales",
  ],
  "Demandas en momentos de desregulación": [
    "pausa_regulacion",
    "anticipacion_verbal",
  ],
  "Ambientes con tensión o conflicto": [
    "ajustes_sensoriales",
    "apoyo_individual",
    "pausa_regulacion",
  ],
};

export function getApoyosSugeridosPorCondicionNombre(
  nombre: string
): readonly ApoyoSesionId[] {
  return APOYOS_SUGERIDOS_POR_CONDICION_NOMBRE[nombre] ?? [];
}
