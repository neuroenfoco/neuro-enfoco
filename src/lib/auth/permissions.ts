import type { UserRole } from "@/lib/auth/auth-types";

export type Permission =
  | "estudiantes.read"
  | "estudiantes.write"
  | "evaluaciones.read"
  | "evaluaciones.write"
  | "objetivos.read"
  | "objetivos.write"
  | "intervenciones.read"
  | "intervenciones.write"
  | "paci.read"
  | "paci.write"
  | "reportes.read"
  | "configuracion.write";

export const ALL_PERMISSIONS: Permission[] = [
  "estudiantes.read",
  "estudiantes.write",
  "evaluaciones.read",
  "evaluaciones.write",
  "objetivos.read",
  "objetivos.write",
  "intervenciones.read",
  "intervenciones.write",
  "paci.read",
  "paci.write",
  "reportes.read",
  "configuracion.write",
];

const ACADEMIC_READ: Permission[] = [
  "estudiantes.read",
  "evaluaciones.read",
  "objetivos.read",
  "intervenciones.read",
  "paci.read",
  "reportes.read",
];

const ACADEMIC_WRITE: Permission[] = [
  "estudiantes.write",
  "evaluaciones.write",
  "objetivos.write",
  "intervenciones.write",
  "paci.write",
];

const SPECIALIST_PERMISSIONS: Permission[] = [
  "estudiantes.read",
  "evaluaciones.read",
  "evaluaciones.write",
  "objetivos.read",
  "objetivos.write",
  "intervenciones.read",
  "intervenciones.write",
  "paci.read",
  "reportes.read",
];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  administrador: ALL_PERMISSIONS,
  coordinador_pie: [...ACADEMIC_READ, ...ACADEMIC_WRITE],
  educador_diferencial: [...ACADEMIC_READ, ...ACADEMIC_WRITE],
  psicologo: SPECIALIST_PERMISSIONS,
  fonoaudiologo: SPECIALIST_PERMISSIONS,
  terapeuta_ocupacional: SPECIALIST_PERMISSIONS,
  docente: [
    "estudiantes.read",
    "evaluaciones.read",
    "objetivos.read",
    "intervenciones.read",
    "intervenciones.write",
    "paci.read",
  ],
};

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role];
}
