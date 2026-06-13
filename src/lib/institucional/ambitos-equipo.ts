/**
 * Ámbitos de participación profesional con un estudiante.
 * Transversal: PIE es un consumidor, no el dueño del catálogo.
 */

export const AMBITOS_EQUIPO = [
  "pie",
  "ley_21545",
  "paec",
  "dec",
  "convivencia",
  "bienestar",
] as const;

export type AmbitoEquipo = (typeof AMBITOS_EQUIPO)[number];

export type AmbitoEquipoDef = {
  id: AmbitoEquipo;
  nombre: string;
  descripcion: string;
};

export const CATALOGO_AMBITOS_EQUIPO: readonly AmbitoEquipoDef[] = [
  {
    id: "pie",
    nombre: "PIE",
    descripcion: "Programa de Integración Escolar",
  },
  {
    id: "ley_21545",
    nombre: "Ley 21.545",
    descripcion: "Inclusión y adecuaciones para estudiantes con NEE",
  },
  {
    id: "paec",
    nombre: "PAEC",
    descripcion: "Plan de Adecuación Educativa Curricular",
  },
  {
    id: "dec",
    nombre: "DEC",
    descripcion: "Decreto de evaluación y certificación",
  },
  {
    id: "convivencia",
    nombre: "Convivencia escolar",
    descripcion: "Mediación, orientación y clima escolar",
  },
  {
    id: "bienestar",
    nombre: "Bienestar socioemocional",
    descripcion: "Regulación, acompañamiento y salud mental escolar",
  },
] as const;

export function isAmbitoEquipo(value: string): value is AmbitoEquipo {
  return (AMBITOS_EQUIPO as readonly string[]).includes(value);
}

export function getAmbitoEquipoNombre(id: AmbitoEquipo): string {
  return CATALOGO_AMBITOS_EQUIPO.find((item) => item.id === id)?.nombre ?? id;
}
