/**
 * Catálogo institucional de roles profesionales.
 * No exclusivo de PIE; los ámbitos se asignan en ParticipacionProfesionalEstudiante.
 */

export type RolProfesionalId =
  | "educadora_diferencial"
  | "psicologa"
  | "fonoaudiologa"
  | "terapeuta_ocupacional"
  | "psicopedagoga"
  | "docente_aula"
  | "coordinador_pie"
  | "trabajadora_social"
  | "orientador"
  | "encargado_convivencia"
  | "otro";

export type RolProfesionalDef = {
  id: RolProfesionalId;
  nombre: string;
  orden: number;
};

export const CATALOGO_ROLES_PROFESIONAL: readonly RolProfesionalDef[] = [
  { id: "educadora_diferencial", nombre: "Educador/a diferencial", orden: 10 },
  { id: "psicologa", nombre: "Psicólogo/a", orden: 20 },
  { id: "fonoaudiologa", nombre: "Fonoaudiólogo/a", orden: 30 },
  { id: "terapeuta_ocupacional", nombre: "Terapeuta ocupacional", orden: 40 },
  { id: "psicopedagoga", nombre: "Psicopedagogo/a", orden: 50 },
  { id: "docente_aula", nombre: "Docente de aula", orden: 60 },
  { id: "coordinador_pie", nombre: "Coordinador/a PIE", orden: 70 },
  { id: "trabajadora_social", nombre: "Trabajador/a social", orden: 80 },
  { id: "orientador", nombre: "Orientador/a", orden: 90 },
  {
    id: "encargado_convivencia",
    nombre: "Encargado/a de convivencia",
    orden: 100,
  },
  { id: "otro", nombre: "Otro", orden: 999 },
] as const;

export const ROL_PROFESIONAL_IDS = CATALOGO_ROLES_PROFESIONAL.map(
  (item) => item.id
) as RolProfesionalId[];

export function isRolProfesionalId(value: string): value is RolProfesionalId {
  return (ROL_PROFESIONAL_IDS as readonly string[]).includes(value);
}

export function getRolProfesionalNombre(id: RolProfesionalId): string {
  return (
    CATALOGO_ROLES_PROFESIONAL.find((item) => item.id === id)?.nombre ?? id
  );
}

export function getRolProfesionalById(
  id: string
): RolProfesionalDef | undefined {
  return CATALOGO_ROLES_PROFESIONAL.find((item) => item.id === id);
}
